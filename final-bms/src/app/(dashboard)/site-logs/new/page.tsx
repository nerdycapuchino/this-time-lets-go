import SiteLogForm from "@/components/site-logs/SiteLogForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewSiteLogPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase.from("projects").select("id, name");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Inspection Record</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Archive on-site observations and visual evidence</p>
      </div>
      <SiteLogForm projects={projects || []} />
    </div>
  );
}
