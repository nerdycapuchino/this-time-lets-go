import { createClient } from '@supabase/supabase-js';

// This client is intended for server-side operations that require elevated privileges,
// such as bypassing RLS for administrative tasks or writing to storage.
// It should NEVER be exposed to the client-side.

// Ensure that the service role key is stored securely in your environment variables
// and is not the same as the public anon key.
let _supabaseAdmin: any = null;

export const getSupabaseAdmin = () => {
  if (_supabaseAdmin) return _supabaseAdmin;

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in the environment variables.');
    }
    // Return a dummy client during build if variables are missing
    return {} as any;
  }

  _supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    }
  );
  
  return _supabaseAdmin;
};
