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
