// src/app/actions/portal.ts
"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { Database } from "@/types/supabase";

export async function getPortalData(key: string) {
  // Fetch project details using admin client to bypass RLS
  const { data: project, error: projectError } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('portal_access_key', key)
    .single();

  if (projectError || !project) {
    console.error("Error fetching project for portal:", projectError?.message);
    return null;
  }

  // Fetch latest 3 site logs
  const { data: siteLogs } = await supabaseAdmin
    .from('site_logs')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch latest documents (revisions)
  const { data: revisions } = await supabaseAdmin
    .from('drawing_revisions')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch invoices for payment status
  const { data: invoices } = await supabaseAdmin
    .from('invoices')
    .select('*')
    .eq('project_id', project.id);

  const totalInvoiced = invoices?.reduce((acc, inv) => acc + Number(inv.amount), 0) || 0;
  const totalPaid = invoices?.filter(inv => inv.status === 'paid')
    .reduce((acc, inv) => acc + Number(inv.amount), 0) || 0;

  return {
    project,
    siteLogs: siteLogs || [],
    revisions: revisions || [],
    paymentStatus: {
      totalInvoiced,
      totalPaid,
      outstanding: totalInvoiced - totalPaid
    }
  };
}
