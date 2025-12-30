import { createClient } from '@/lib/supabase/server'

export async function getSystemHealth() {
  const supabase = await createClient()
  
  // 1. Check for Stale Leads (New leads > 24h old)
  const { count: staleLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')
    .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  // 2. Check for Stale Projects (No activity in 3 days)
  const { count: staleProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .lt('updated_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())

  return { staleLeads, staleProjects }
}
