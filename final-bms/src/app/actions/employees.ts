'use server';

import { createClient } from '@/lib/supabase/server';

export async function getEmployees() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('employees').select('*');

  if (error) {
    console.error('Error fetching employees:', error.message);
    return [];
  }

  return data;
}
