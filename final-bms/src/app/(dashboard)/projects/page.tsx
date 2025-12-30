import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: projects, error } = await supabase.from("projects").select();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">PROJECTS</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Manage and track your active workspace</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="shimmer-button bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center font-bold shadow-lg shadow-blue-500/20"
        >
          <Plus className="mr-2 h-5 w-5" />
          NEW PROJECT
        </Link>
      </div>
      
      <div className="glass-surface rounded-3xl overflow-hidden">
        <ul className="divide-y divide-white/5">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="block p-6 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">{project.name}</p>
                      <p className="text-sm text-gray-500 mt-1 max-w-2xl">{project.description}</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="p-12 text-center text-gray-500 italic">
              No projects found in the current workspace.
            </li>
          )}
        </ul>
        {error && (
          <div className="p-6 bg-red-500/10 text-red-500 text-sm font-bold">
            ERROR: {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
