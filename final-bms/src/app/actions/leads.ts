'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getLeads() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching leads:', error)
    return []
  }

  return data
}

export async function convertToProject(leadId: string) {
    const supabase = await createClient()

    // 1. Get lead details
    const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()

    if (leadError || !lead) {
        return { error: 'Lead not found.' }
    }

    // 2. Create a new project
    const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert({
            name: `${lead.full_name} - ${lead.service_requested}`,
            client_id: null, // Assuming no client profile exists yet
            status: 'active',
            start_date: new Date().toISOString(),
        })
        .select()
        .single()

    if (projectError || !newProject) {
        return { error: 'Failed to create project.' }
    }

    // 3. Create initial kanban cards for a "7-day ad sprint"
    const sprintCards = [
        { title: 'Day 1: Strategy & Kick-off', status: 'todo', project_id: newProject.id, order: 1 },
        { title: 'Day 2: Ad Creative Development', status: 'todo', project_id: newProject.id, order: 2 },
        { title: 'Day 3: Landing Page Setup', status: 'todo', project_id: newProject.id, order: 3 },
        { title: 'Day 4: Campaign Build & Tracking', status: 'todo', project_id: newProject.id, order: 4 },
        { title: 'Day 5: Launch & Monitoring', status: 'todo', project_id: newProject.id, order: 5 },
        { title: 'Day 6: Optimization', status: 'todo', project_id: newProject.id, order: 6 },
        { title: 'Day 7: Reporting & Next Steps', status: 'todo', project_id: newProject.id, order: 7 },
    ]

    const { error: cardsError } = await supabase
        .from('kanban_cards')
        .insert(sprintCards)

    if (cardsError) {
        // Optional: clean up created project if card creation fails
        await supabase.from('projects').delete().eq('id', newProject.id)
        return { error: 'Failed to create project workflow.' }
    }

    // 4. Update lead status
    const { error: updateError } = await supabase
        .from('leads')
        .update({ status: 'converted' })
        .eq('id', leadId)

    if (updateError) {
        // Log this, but don't fail the whole operation since the project is created.
        console.error('Could not update lead status:', updateError)
    }

    revalidatePath('/dashboard/leads')
    revalidatePath(`/dashboard/projects/${newProject.id}`)
    
    return { success: true, projectId: newProject.id }
}

// CREATE LEAD
export async function createLead(formData: {
  full_name: string
  email: string
  phone: string
  company: string
  service_requested: string
  status: string
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('leads')
    .insert({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      service_requested: formData.service_requested,
      status: formData.status || 'new',
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating lead:', error)
    return { error: 'Failed to create lead.' }
  }

  revalidatePath('/dashboard/leads')
  return { success: true, data }
}

// UPDATE LEAD
export async function updateLead(leadId: string, formData: {
  full_name: string
  email: string
  phone: string
  company: string
  service_requested: string
  status: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leads')
    .update({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      service_requested: formData.service_requested,
      status: formData.status,
    })
    .eq('id', leadId)
    .select()
    .single()

  if (error) {
    console.error('Error updating lead:', error)
    return { error: 'Failed to update lead.' }
  }

  revalidatePath('/dashboard/leads')
  return { success: true, data }
}

// DELETE LEAD
export async function deleteLead(leadId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId)

  if (error) {
    console.error('Error deleting lead:', error)
    return { error: 'Failed to delete lead.' }
  }

  revalidatePath('/dashboard/leads')
  return { success: true }
}

// GET SINGLE LEAD
export async function getLeadById(leadId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (error) {
    console.error('Error fetching lead:', error)
    return null
  }

  return data
}
