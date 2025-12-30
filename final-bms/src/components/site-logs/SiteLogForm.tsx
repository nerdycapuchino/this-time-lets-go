"use client";

import { useFormState } from "react-dom";
import { createSiteLog } from "@/app/actions/siteLogs";
import { useEffect, useState } from "react";
import { Mic, Camera } from "lucide-react";

type Project = {
  id: number;
  name: string;
};

export default function SiteLogForm({ projects }: { projects: Project[] }) {
  const initialState = { message: "" };
  const [state, formAction] = useFormState(createSiteLog, initialState);
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState("");

  const handleVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    
    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setNotes(finalTranscript + interimTranscript);
    };

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  useEffect(() => {
    if (state.message === "success") {
      alert("Site log created!");
      window.location.href = "/dashboard/site-logs"; // Redirect after success
    } else if (state.message) {
      alert(`Error: ${state.message}`);
    }
  }, [state]);

  return (
    <form action={formAction} className="bg-white p-6 rounded-md shadow-md max-w-lg mx-auto">
      <div className="mb-4">
        <label htmlFor="project_id" className="block text-sm font-medium text-gray-700">
          Project
        </label>
        <select
          id="project_id"
          name="project_id"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <div className="relative">
          <textarea
            id="notes"
            name="notes"
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={handleVoiceRecognition}
            className={`absolute bottom-3 right-3 p-2 rounded-full ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            <Mic size={20} />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
          Photos
        </label>
        <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                    <label htmlFor="photos" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload files</span>
                        <input id="photos" name="photos" type="file" className="sr-only" multiple accept="image/*" capture="environment" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border shadow-sm text-sm font-medium rounded-md text-white bg-black"
        >
          Save Site Log
        </button>
      </div>
    </form>
  );
}
