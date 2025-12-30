"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function startTimer(cardId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required." };

  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
  if (!profile) return { error: "Profile not found." };
  
  // Check if there is already an active timer for this card by this user
  const { data: existing } = await supabase
    .from("time_logs")
    .select("id")
    .eq("kanban_card_id", cardId)
    .eq("user_id", user.id)
    .is("end_time", null)
    .single();

  if (existing) {
    return { error: "A timer is already running for this card." };
  }

  const { data, error } = await supabase
    .from("time_logs")
    .insert({
      kanban_card_id: cardId,
      user_id: user.id,
      organization_id: profile.organization_id,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/dashboard/projects/.*", "layout"); // Revalidate all project pages
  return { data };
}

export async function stopTimer(logId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Authentication required." };

    // Get the time log and its related project's currency
    const { data: timeLog, error: timeLogError } = await supabase
        .from("time_logs")
        .select(`
            id,
            start_time,
            kanban_cards (
                projects ( currency )
            )
        `)
        .eq("id", logId)
        .eq("user_id", user.id)
        .single() as any;
    
    if (timeLogError || !timeLog) return { error: "Active time log not found." };

    const projectCurrency = timeLog.kanban_cards?.projects?.currency || 'USD';

    // Get user's hourly rate and their rate's currency
    const { data: profile } = await supabase
        .from('profiles')
        .select('hourly_rate, hourly_rate_currency')
        .eq('id', user.id)
        .single();

    if (!profile) return { error: "Profile not found." };
    
    const userRate = profile.hourly_rate || 0;
    const userRateCurrency = profile.hourly_rate_currency || 'USD';

    let exchangeRate = 1.0;
    if (userRateCurrency !== projectCurrency) {
        const { data: rateData, error: rateError } = await supabase
            .from('exchange_rates')
            .select('rate')
            .eq('from_currency', userRateCurrency)
            .eq('to_currency', projectCurrency)
            .single();
        if (rateError || !rateData) return { error: `Exchange rate from ${userRateCurrency} to ${projectCurrency} not found.`};
        exchangeRate = rateData.rate;
    }

    const startTime = new Date(timeLog.start_time);
    const endTime = new Date();
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
    const cost = (durationMinutes / 60) * userRate * exchangeRate;

    const { data, error } = await supabase
        .from("time_logs")
        .update({
            end_time: endTime.toISOString(),
            duration_minutes: durationMinutes,
            cost: cost,
            currency: projectCurrency, // Save the cost in the project's currency
        })
        .eq("id", logId)
        .select()
        .single();
        
    if (error) return { error: error.message };
    
    revalidatePath("/dashboard/projects/.*", "layout");
    return { data };
}
