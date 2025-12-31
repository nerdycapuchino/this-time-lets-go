'use client';

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  owner: string;
  created_at: string;
  due_date?: string;
}

async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  
  return data || [];
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Projects</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track your projects</p>
        </div>
        <Link
          href="/dashboard/projects?new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          New Project
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400">No projects found. Create your first project to get started.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">{project.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  project.status === 'in_progress' ? 'bg-blue-900 text-blue-200' :
                  project.status === 'completed' ? 'bg-green-900 text-green-200' :
                  project.status === 'on_hold' ? 'bg-yellow-900 text-yellow-200' :
                  'bg-gray-900 text-gray-200'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
              <div className="space-y-2 text-sm">
                <p className="text-slate-400"><span className="font-semibold">Owner:</span> {project.owner}</p>
                {project.due_date && (
                  <p className="text-slate-400"><span className="font-semibold">Due:</span> {new Date(project.due_date).toLocaleDateString()}</p>
                )}
              </div>
              <button className="mt-4 w-full py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors text-sm font-medium">
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
