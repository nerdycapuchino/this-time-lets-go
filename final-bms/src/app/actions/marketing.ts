import { createClient } from '@/lib/supabase/server';

export async function getMarketingMetrics() {
  const supabase = await createClient();

  // 1. Get total leads
  const { count: totalLeads, error: leadsError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  if (leadsError) {
    console.error('Error fetching total leads:', leadsError.message);
  }

  // 2. Get converted leads
  const { count: convertedLeads, error: convertedError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'converted');

  if (convertedError) {
    console.error('Error fetching converted leads:', convertedError.message);
  }

  // 3. Get total revenue from paid invoices
  const { data: revenueData, error: revenueError } = await supabase
    .from('invoices')
    .select('amount')
    .eq('status', 'paid');
    
  if (revenueError) {
    console.error('Error fetching revenue:', revenueError.message);
  }

  const totalRevenue = revenueData?.reduce((acc, invoice) => acc + (invoice.amount || 0), 0) || 0;

  return {
    totalLeads: totalLeads ?? 0,
    convertedLeads: convertedLeads ?? 0,
    totalRevenue,
    error: leadsError || convertedError || revenueError,
  };
}
