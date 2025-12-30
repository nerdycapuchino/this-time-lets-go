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
    <div className="bg-white p-6 rounded-md shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Upload New Blueprint</h2>
      <form action={formAction}>
        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Blueprint File (.dwg, .rvt, .pdf)
          </label>
          <input
            type="file"
            id="file"
            name="file"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Version Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="e.g., 'Initial client proposal'"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            required
          />
        </div>
        {/* In a real app, we'd have a dropdown to select the milestone */}
        <input type="hidden" name="milestone_id" value="1" />
        <div>
          <button
            type="submit"
            className="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}
