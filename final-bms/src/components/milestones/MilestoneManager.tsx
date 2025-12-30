import { createClient } from "@/lib/supabase/server";
import MilestoneCard from "./MilestoneCard";

type MilestoneManagerProps = {
  projectId: number;
};

export default async function MilestoneManager({ projectId }: { projectId: number }) {
  const supabase = await createClient();
  
  const { data: milestones, error } = await supabase
    .from("project_milestones")
    .select()
    .eq("project_id", projectId)
    .order("due_date", { ascending: true });

  const { data: invoices, error: invoiceError } = await supabase
    .from("invoices")
    .select()
    .eq("project_id", projectId);

  if (error) {
    return <p className="text-red-500">Could not load milestones: {error.message}</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Milestones & Invoicing</h2>
      {milestones.map(milestone => (
        <MilestoneCard 
            key={milestone.id} 
            milestone={milestone}
            invoice={invoices?.find(i => i.milestone_id === milestone.id)}
        />
      ))}
      {invoiceError && <p className="text-red-500">Could not load invoices: {invoiceError.message}</p>}
    </div>
  );
}
