import { createClient } from "@/lib/supabase/server";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import ProjectTabs from "@/components/projects/ProjectTabs";
import MilestoneManager from "@/components/milestones/MilestoneManager";
import { UploadZone } from "@/components/revisions/upload-zone";
import { RevisionList } from "@/components/revisions/revision-list";
import { getSiteLogs } from "@/app/actions/siteLogs";
import { SiteLogCapture } from "@/components/site-logs/SiteLogCapture";
import { SiteLogList } from "@/components/site-logs/SiteLogList";

type ProjectPageProps = {
  params: {
    id: string;
  };
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select()
    .eq("id", params.id)
    .single();

  if (projectError) return <p className="p-4 text-red-500">Error: {projectError.message}</p>;
  if (!project) return <p className="p-4 text-gray-500">Project not found.</p>;

  // Data for Task Board Tab
  const { data: cards, error: cardsError } = await supabase.from("kanban_cards").select(`*, profiles (first_name, last_name)`).eq("project_id", params.id);
  const cardIds = cards?.map(c => c.id) || [];
  const { data: timeLogs, error: timeLogsError } = await supabase.from("time_logs").select().in("kanban_card_id", cardIds);

  // Data for Revision Hub Tab
  const { data: revisions, error: revisionsError } = await supabase
    .from("drawing_revisions")
    .select(`
      id,
      created_at,
      file_name,
      version_number,
      file_path,
      profiles (first_name, last_name)
    `)
    .eq("project_id", params.id)
    .order("file_name", { ascending: true })
    .order("version_number", { ascending: false });

  // Data for Site Logs Tab
  const siteLogs = await getSiteLogs(params.id);
  
  const tabs = [
    {
        name: "Task Board",
        content: (
            <>
                <KanbanBoard initialCards={cards || []} timeLogs={timeLogs || []} currentUserId={user?.id || ""} />
                {cardsError && <p className="text-red-500">{cardsError.message}</p>}
                {timeLogsError && <p className="text-red-500">{timeLogsError.message}</p>}
            </>
        )
    },
    {
        name: "Revision Hub",
        content: (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">File Revisions</h2>
                    <RevisionList revisions={revisions || []} />
                    {revisionsError && <p className="text-red-500 mt-4">{revisionsError.message}</p>}
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Upload New Version</h2>
                    <UploadZone projectId={project.id} />
                </div>
            </div>
        )
    },
    {
        name: "Site Logs",
        content: (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Log History</h2>
                    <SiteLogList logs={siteLogs as any[]} />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Add New Log</h2>
                    <SiteLogCapture projectId={project.id} onUploadComplete={() => {
                        // Revalidation is handled by the server action
                    }} />
                </div>
            </div>
        )
    },
    {
        name: "Milestones & Invoicing",
        content: <MilestoneManager projectId={project.id} />
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <p className="text-gray-500">{project.description}</p>
        </div>
      </div>
      <ProjectTabs tabs={tabs} />
    </div>
  );
}
