'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { decode } from 'base64-arraybuffer'

export async function createSiteLog(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const projectId = formData.get('projectId') as string
  const notes = formData.get('notes') as string
  const markupData = formData.get('markupData') as string
  const fileDataUrl = formData.get('file') as string

  if (!projectId || !fileDataUrl) {
    return { error: 'Missing project ID or file data' }
  }

  try {
    const fileContents = fileDataUrl.split(',')[1]
    if (!fileContents) {
        return { error: 'Invalid file data' }
    }
    const fileBuffer = decode(fileContents)
    
    // Construct a unique filename
    const fileName = `${Date.now()}.jpg`
    const storagePath = `projects/${projectId}/site-logs/${fileName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('project-assets')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage Upload Error:', uploadError)
      throw new Error('Failed to upload image to storage.')
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-assets')
      .getPublicUrl(storagePath)

    // Insert record into the database
    const { error: dbError } = await supabase.from('site_logs').insert({
      project_id: projectId,
      notes,
      markup_data: JSON.parse(markupData),
      image_url: publicUrl,
    })

    if (dbError) {
      console.error('Database Insert Error:', dbError)
      throw new Error('Failed to save site log record.')
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Create Site Log Error:', error)
    return { error: error.message || 'Failed to create site log' }
  }
}

export async function getSiteLogs(projectId: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('site_logs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
  
    if (error) {
      console.error('Fetch Site Logs Error:', error)
      return []
    }
  
    return data
  }