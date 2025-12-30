'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function generateInvoiceForMilestone(milestoneId: string) {
  const supabase = await createClient()

  try {
    // 1. Fetch Milestone and Project Details
    // We assume a relationship where milestones belong to projects, and projects have clients
    const { data: milestone, error: milestoneError } = await supabase
      .from('project_milestones')
      .select(`
        id,
        name,
        amount,
        project_id,
        projects (
          id,
          name,
          client_id,
          profiles:client_id (
            full_name,
            email,
            address
          )
        )
      `)
      .eq('id', milestoneId)
      .single()

    if (milestoneError || !milestone) {
      throw new Error('Milestone not found or access denied')
    }

    const project = Array.isArray(milestone.projects) ? milestone.projects[0] : milestone.projects
    // @ts-ignore - Supabase types might vary based on generation
    const client = project?.profiles

    if (!milestone.amount) {
      throw new Error('Milestone has no set amount. Cannot generate invoice.')
    }

    // 2. Check if invoice already exists
    const { data: existingInvoice } = await supabase
      .from('invoices')
      .select('id')
      .eq('milestone_id', milestoneId)
      .single()

    if (existingInvoice) {
      return { error: 'Invoice already exists for this milestone.', invoiceId: existingInvoice.id }
    }

    // 3. Create Invoice Record
    const { data: newInvoice, error: insertError } = await supabase
      .from('invoices')
      .insert({
        project_id: milestone.project_id,
        milestone_id: milestone.id,
        client_id: project?.client_id,
        amount: milestone.amount,
        status: 'pending',
        issue_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Net 14 default
      })
      .select()
      .single()

    if (insertError) throw insertError

    revalidatePath(`/projects/${milestone.project_id}`)
    
    return { 
      success: true, 
      invoice: newInvoice,
      details: {
        milestoneName: milestone.name,
        clientName: client?.[0]?.full_name || 'Client',
        projectName: project?.name,
        amount: milestone.amount
      }
    }

  } catch (error: any) {
    console.error('Invoice generation error:', error)
    return { error: error.message }
  }
}