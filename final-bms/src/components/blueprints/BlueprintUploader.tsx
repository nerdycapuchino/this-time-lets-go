"use client";

import { useFormState } from "react-dom";
import { uploadBlueprint } from "@/app/actions/blueprints";
import { useEffect } from "react";
import { Upload } from "lucide-react";

export default function BlueprintUploader({ projectId }: { projectId: string }) {
  const initialState = { message: "" };
  const uploadBlueprintWithId = uploadBlueprint.bind(null, projectId);
  const [state, formAction] = useFormState(uploadBlueprintWithId, initialState);

  useEffect(() => {
    if (state.message === "success") {
      // Could show a success toast here
      alert("Upload successful!");
    } else if (state.message) {
      alert(`Error: ${state.message}`);
    }
  }, [state]);

  return (
    <div className="glass-surface p-8 rounded-3xl shadow-xl">
      <h2 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white mb-8 uppercase">Upload New Asset</h2>
      <form action={formAction} className="space-y-8">
        <div>
          <label htmlFor="file" className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            Source File (.dwg, .rvt, .pdf)
          </label>
          <div className="relative">
            <input
              type="file"
              id="file"
              name="file"
              className="block w-full text-xs text-gray-500 file:mr-6 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
            Revision Metadata
          </label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="e.g., 'Structural optimization V2'"
            className="w-full px-4 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-medium"
            required
          />
        </div>
        {/* In a real app, we'd have a dropdown to select the milestone */}
        <input type="hidden" name="milestone_id" value="1" />
        <div className="pt-2">
          <button
            type="submit"
            className="shimmer-button inline-flex items-center justify-center w-full md:w-auto py-4 px-10 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl"
          >
            <Upload className="mr-3 h-4 w-4" />
            INITIATE UPLOAD
          </button>
        </div>
      </form>
    </div>
  );
}
