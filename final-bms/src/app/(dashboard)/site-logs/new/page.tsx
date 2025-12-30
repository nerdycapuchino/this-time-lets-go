import SiteLogForm from "@/components/site-logs/SiteLogForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewSiteLogPage() {
  const supabase = createClient();
  const { data: projects } = await supabase.from("projects").select("id, name");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Site Inspection Log</h1>
      <SiteLogForm projects={projects || []} />
    </div>
  );
}
