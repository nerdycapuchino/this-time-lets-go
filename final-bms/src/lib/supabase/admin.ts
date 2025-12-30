import { createClient } from '@supabase/supabase-js';

// This client is intended for server-side operations that require elevated privileges,
// such as bypassing RLS for administrative tasks or writing to storage.
// It should NEVER be exposed to the client-side.

// Ensure that the service role key is stored securely in your environment variables
// and is not the same as the public anon key.
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in the environment variables.');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set in the environment variables.');
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      // It's recommended to auto-refresh the token on the admin client
      autoRefreshToken: true,
      // It's recommended to persist the session on the admin client
      persistSession: false,
    },
  }
);
