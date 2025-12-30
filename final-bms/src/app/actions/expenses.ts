'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addExpense(data: {
  project_id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  receipt_url?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from('expenses').insert(data);

  if (error) {
    return { error: { message: error.message } };
  }

  revalidatePath(`/dashboard/projects/${data.project_id}`);
  return { error: null };
}

export async function getProjectExpenses(projectId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('project_id', projectId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error.message);
    return [];
  }

  return data;
}
