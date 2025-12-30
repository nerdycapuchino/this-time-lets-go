import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: projects, error } = await supabase.from("projects").select();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="bg-black text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="mr-2" />
          New Project
        </Link>
      </div>
      <div className="bg-white rounded-md shadow-md">
        <ul className="divide-y divide-gray-200">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="block p-4 hover:bg-gray-50"
                >
                  <p className="font-semibold">{project.name}</p>
                  <p className="text-sm text-gray-500">{project.description}</p>
                  <p className="text-sm text-gray-500 capitalize mt-2">
                    Status:{" "}
                    <span className="font-medium text-black">
                      {project.status}
                    </span>
                  </p>
                </Link>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">
              No projects found.
            </li>
          )}
        </ul>
        {error && (
          <p className="p-4 text-red-500">
            Error fetching projects: {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
