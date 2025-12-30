"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function uploadBlueprint(
  projectId: string,
  prevState: { message: string },
  formData: FormData
) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: "Authentication required." };

  const file = formData.get("file") as File;
  const description = formData.get("description") as string;
  const milestoneId = formData.get("milestone_id") as string; // Will be dynamic later

  if (!file || file.size === 0) return { message: "File is required." };
  if (!description) return { message: "Description is required." };
  
  // 1. Determine the next version number
  // For simplicity, we'll just count existing revisions for this milestone.
  // A more robust solution might use a transaction.
  const { count, error: countError } = await supabase
    .from("drawing_revisions")
    .select('*', { count: 'exact', head: true })
    .eq("project_milestone_id", milestoneId);

  if (countError) {
    console.error("Count Error:", countError);
    return { message: "Could not determine revision version." };
  }
  const newVersion = (count || 0) + 1;
  const revisionId = uuidv4(); // A unique ID for the folder path

  // 2. Upload file to Supabase Storage
  const filePath = `projects/${projectId}/revisions/${revisionId}/${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("blueprints") // Assuming a 'blueprints' bucket exists
    .upload(filePath, file);

  if (uploadError) {
    console.error("Upload Error:", uploadError);
    // In a real app, you might want to create the bucket if it doesn't exist
    return { message: `Storage Error: ${uploadError.message}. Ensure a 'blueprints' bucket exists.` };
  }

  // 3. Create a new record in the drawing_revisions table
  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
  if (!profile) return { message: "Profile not found." };
  
  const { error: dbError } = await supabase.from("drawing_revisions").insert({
    project_milestone_id: milestoneId,
    uploader_id: user.id,
    storage_object_id: filePath, // Storing the full path
    version: newVersion,
    description: description,
    organization_id: profile.organization_id,
  });

  if (dbError) {
    console.error("Database Error:", dbError);
    // If the DB insert fails, we should ideally delete the uploaded file.
    // This is a good use case for a Supabase Edge Function transaction.
    return { message: `Database Error: ${dbError.message}` };
  }

  // 4. Revalidate the project page path
  revalidatePath(`/dashboard/projects/${projectId}`);
  return { message: "success" };
}

export async function getMarkupComments(revisionId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("drawing_markups")
    .select()
    .eq("drawing_revision_id", revisionId);

  if (error) {
    console.error("Get Markups Error:", error);
    return [];
  }
  return data;
}

export async function addMarkupComment(
  revisionId: number,
  commentData: { x: number; y: number; text: string }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required." };
  
  const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single();
  if (!profile) return { error: "Profile not found." };

  const { data, error } = await supabase.from("drawing_markups").insert({
    drawing_revision_id: revisionId,
    author_id: user.id,
    markup_data: commentData,
    organization_id: profile.organization_id,
  }).select().single();

  if (error) {
    console.error("Add Markup Error:", error);
    return { error: error.message };
  }

  // Find project id for revalidation
  const { data: revision } = await supabase.from('drawing_revisions').select('project_milestones(projects(id))').eq('id', revisionId).single();
  const projectId = revision?.project_milestones?.projects?.id;
  if(projectId) {
    revalidatePath(`/dashboard/projects/${projectId}`);
  }

  return { data };
}
