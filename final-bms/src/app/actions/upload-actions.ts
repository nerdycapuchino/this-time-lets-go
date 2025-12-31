'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { PROJECT_ASSETS_BUCKET, initializeProjectAssetsBucket } from '@/lib/supabase/storage';

interface UploadResult {
  error?: string;
}

export async function uploadFileAction(formData: FormData): Promise<UploadResult> {
  const supabase = await createClient();

  try {
    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('You must be logged in to upload files.');
    }

    // 2. Validate form data
    const file = formData.get('file') as File | null;
    const projectIdString = formData.get('projectId') as string | null;

    if (!file || file.size === 0) {
      throw new Error('No file provided or file is empty.');
    }
    if (!projectIdString) {
      throw new Error('Project ID is missing.');
    }
    const projectId = BigInt(projectIdString);

    // Get organization ID from user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.organization_id) {
      throw new Error('Could not determine user organization.');
    }
    const { organization_id } = profile;

    // Use the admin client for elevated-privilege operations
    const adminClient = getSupabaseAdmin();

    // 3. Ensure storage bucket exists (idempotent call)
    await initializeProjectAssetsBucket(adminClient);

    // 4. Versioning Logic
    const { data: latestRevision, error: versionError } = await adminClient
      .from('drawing_revisions')
      .select('version')
      .eq('project_id', projectId)
      .eq('file_name', file.name)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (versionError && versionError.code !== 'PGRST116') { // Ignore "no rows found"
      throw new Error(`Database error checking for previous versions: ${versionError.message}`);
    }

    const newVersion = (latestRevision?.version || 0) + 1;

    // 5. File Upload
    const filePath = `${organization_id}/${projectId}/${file.name}/v${newVersion}_${file.name}`;
    
    const { error: uploadError } = await adminClient.storage
      .from(PROJECT_ASSETS_BUCKET)
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Storage error: ${uploadError.message}`);
    }

    // 6. Database Insert
    const { error: dbError } = await adminClient
      .from('drawing_revisions')
      .insert({
        organization_id,
        project_id: projectId,
        uploader_id: user.id,
        file_name: file.name,
        version: newVersion,
        storage_object_id: filePath, // The path in the bucket
      });

    if (dbError) {
      // Attempt to clean up the orphaned file in storage if the DB insert fails
      await adminClient.storage.from(PROJECT_ASSETS_BUCKET).remove([filePath]);
      throw new Error(`Database error: ${dbError.message}`);
    }

    // 7. Cache Revalidation
    revalidatePath(`/projects/${projectId}`);
    
    return {}; // Success

  } catch (err: any) {
    return { error: err.message };
  }
}
