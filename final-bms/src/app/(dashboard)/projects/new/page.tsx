"use client";

import { createProject } from "@/app/actions/projects";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function NewProjectPage() {
  const [state, formAction] = useFormState(createProject, { message: "" });

  useEffect(() => {
    if (state.message === "success") {
      //not the best way to redirect, but it works for now
      window.location.href = "/dashboard/projects";
    }
  }, [state]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Initialize Project</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Configure a new architectural workspace</p>
      </div>

      <form action={formAction} className="glass-card p-8 rounded-3xl shadow-xl max-w-2xl">
        <div className="mb-6">
          <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Project Title
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g., Sky-High Residency"
            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-bold"
            required
          />
        </div>
        <div className="mb-8">
          <label htmlFor="description" className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Brief / Objectives
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Outline the scope and key deliverables..."
            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-medium"
          />
        </div>
        <div>
          <button
            type="submit"
            className="shimmer-button w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all"
          >
            Deploy Project Hub
          </button>
        </div>
        {state.message && state.message !== "success" && (
          <p className="mt-6 text-xs font-bold text-red-500 uppercase tracking-widest bg-red-500/10 py-3 rounded-xl text-center">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
