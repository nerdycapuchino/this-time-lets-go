'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadRevision(formData: FormData) {
  const supabase = await createClient()
  
  const file = formData.get('file') as File
  const projectId = formData.get('projectId') as string
  // The logical name of the drawing (e.g., "Floor Plan Level 1")
  // If this is a new drawing, the user might provide it, or we derive it from the filename
  const drawingName = formData.get('drawingName') as string || file.name

  if (!file || !projectId) {
    return { error: 'Missing file or project ID' }
  }

  try {
    // 1. Determine the next version number
    const { data: existingRevisions, error: fetchError } = await supabase
      .from('drawing_revisions')
      .select('version_number')
      .eq('project_id', projectId)
      .eq('file_name', drawingName)
      .order('version_number', { ascending: false })
      .limit(1)

    if (fetchError) throw fetchError

    const nextVersion = (existingRevisions?.[0]?.version_number || 0) + 1
    const versionString = `V${nextVersion}`
    
    // 2. Construct Storage Path: projects/[projectId]/[drawingName]/V[x]_[originalName]
    //Vx ensures unique filenames in the bucket even if the user uploads "drawing.pdf" every time
    const storagePath = `projects/${projectId}/${drawingName}/${versionString}_${file.name}`

    // 3. Upload to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('project-assets')
      .upload(storagePath, file, {
        upsert: false, // Prevent overwriting existing versions accidentally
      })

    if (uploadError) throw uploadError

    // 4. Insert Record into Database
    const { error: dbError } = await supabase
      .from('drawing_revisions')
      .insert({
        project_id: projectId,
        file_name: drawingName,
        version_number: nextVersion,
        file_path: storagePath,
        file_type: file.type,
        // created_by: user.id // If you have RLS enabled and want to track uploader
      })

    if (dbError) throw dbError

    revalidatePath(`/projects/${projectId}`)
    return { success: true, version: nextVersion }

  } catch (error: any) {
    console.error('Upload error:', error)
    return { error: error.message || 'Failed to upload revision' }
  }
}

export async function getRevisions(projectId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('drawing_revisions')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch error:', error)
    return []
  }

  return data
}