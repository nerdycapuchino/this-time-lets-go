import { type SupabaseClient } from '@supabase/supabase-js';

export const PROJECT_ASSETS_BUCKET = 'project-assets';

/**
 * Initializes the public bucket for project assets if it doesn't already exist.
 * This is an idempotent operation, safe to call on application startup or before any upload.
 * 
 * @param supabase - The Supabase client instance.
 */
export async function initializeProjectAssetsBucket(supabase: SupabaseClient): Promise<void> {
  // First, check if the bucket exists.
  const { error: getError } = await supabase.storage.getBucket(PROJECT_ASSETS_BUCKET);

  if (getError && getError.message.toLowerCase().includes('bucket not found')) {
    // If the bucket does not exist, create it.
    console.log(`Bucket '${PROJECT_ASSETS_BUCKET}' not found. Creating it...`);
    const { error: createError } = await supabase.storage.createBucket(
      PROJECT_ASSETS_BUCKET,
      {
        public: true, // As per requirements, the bucket is public.
        // In a production environment, you might want to add more specific policies:
        // fileSizeLimit: '100mb',
        // allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf', 'application/postscript', 'image/vnd.dwg'],
      }
    );

    if (createError) {
      console.error(`FATAL: Could not create bucket '${PROJECT_ASSETS_BUCKET}'.`, createError);
      throw createError;
    }

    console.log(`Bucket '${PROJECT_ASSETS_BUCKET}' created successfully.`);
  } else if (getError) {
    // An unexpected error occurred when trying to get the bucket info.
    console.error(`Error checking for bucket '${PROJECT_ASSETS_BUCKET}'.`, getError);
    throw getError;
  }
  // If there was no error, the bucket already exists, and no action is needed.
}
