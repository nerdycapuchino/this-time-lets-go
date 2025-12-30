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
    <div>
      <h1 className="text-2xl font-bold mb-6">New Project</h1>
      <form action={formAction} className="bg-white p-6 rounded-md shadow-md max-w-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Create Project
          </button>
        </div>
        {state.message && state.message !== "success" && (
          <p className="mt-4 text-red-500">{state.message}</p>
        )}
      </form>
    </div>
  );
}
