'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getInventory() {
  const supabase = createClient();
  const { data, error } = await supabase.from('inventory').select('*');

  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }

  return data;
}

export async function updateStock(itemId: string, newStockLevel: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('inventory')
    .update({ stock_level: newStockLevel })
    .eq('id', itemId);

  if (error) {
    console.error('Error updating stock:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/inventory');
  return { success: true };
}

export async function getProjectBOM(projectId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('project_materials')
    .select(`
      quantity,
      inventory ( id, item_name, unit )
    `)
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching project BOM:', error);
    return [];
  }

  return data;
}
