'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addProposal(data: {
  lead_id: string;
  scope_of_work: string;
  total_price: number;
}) {
  const supabase = await createClient();

  // This is a simplified example. In a real app, you'd likely have a 'proposals' table.
  // Here, we'll just update the lead with the proposal details.
  const { error } = await supabase
    .from('leads')
    .update({ 
      pipeline_stage: 'proposal',
      deal_value: data.total_price,
      notes: `Proposal Sent: ${data.scope_of_work}` 
    })
    .eq('id', data.lead_id);

  if (error) {
    return { error: { message: error.message } };
  }

  revalidatePath('/dashboard/sales/pipeline');
  return { error: null };
}
