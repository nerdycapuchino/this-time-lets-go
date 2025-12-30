"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProject(prevState: { message: string }, formData: FormData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Authentication required." };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    return { message: "Project name is required." };
  }

  // In a real app, we'd get the organization_id from the user's profile
  // For now, let's assume a hardcoded organization_id for simplicity.
  // This needs to be fixed later.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return { message: "Could not find user profile or organization." };
  }


  const { error } = await supabase.from("projects").insert({
    name,
    description,
    client_id: user.id, // Setting the creator as the client for now
    organization_id: profile.organization_id,
  });

  if (error) {
    console.error(error);
    return { message: `Failed to create project: ${error.message}` };
  }

  revalidatePath("/dashboard/projects");
  return { message: "success" };
}
