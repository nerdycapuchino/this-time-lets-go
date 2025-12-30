"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateMilestoneStatus(milestoneId: number, status: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("project_milestones")
    .update({ status })
    .eq("id", milestoneId)
    .select("project_id")
    .single();

  if (error) {
    console.error("Update milestone status error:", error);
    return { error: error.message };
  }

  if (data) {
    revalidatePath(`/dashboard/projects/${data.project_id}`);
  }

  return { data };
}
