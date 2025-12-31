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
  const initialState = { success: false, error: "" };
  const [state, formAction] = useFormState(createSiteLog, initialState as any);
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState("");

  const handleVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    
    recognition.onresult = (event: any) => {
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
    if (state?.success) {
      alert("Site log created!");
      window.location.href = "/dashboard/site-logs";
    } else if (state?.error) {
      alert(`Error: ${state.error}`);
    }
  }, [state]);

  return (
    <form action={formAction} className="glass-surface p-8 rounded-3xl shadow-xl max-w-lg mx-auto">
      <h2 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white mb-8 uppercase">Direct Entry</h2>
      <div className="mb-6">
        <label htmlFor="project_id" className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
          Select Project
        </label>
        <select
          id="project_id"
          name="project_id"
          className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
          required
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="notes" className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
          Notes / Transcriptions
        </label>
        <div className="relative">
          <textarea
            id="notes"
            name="notes"
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            placeholder="Describe site conditions..."
          />
          <button
            type="button"
            onClick={handleVoiceRecognition}
            className={`absolute bottom-4 right-4 p-3 rounded-2xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}
          >
            <Mic size={20} />
          </button>
        </div>
      </div>

      <div className="mb-8">
        <label htmlFor="photos" className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
          Evidence Capture
        </label>
        <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-200 dark:border-white/10 border-dashed rounded-3xl hover:bg-white/5 transition-colors">
            <div className="space-y-1 text-center">
                <Camera className="mx-auto h-10 w-10 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                    <label htmlFor="photos" className="relative cursor-pointer font-bold text-blue-600 hover:text-blue-500">
                        <span>Upload assets</span>
                        <input id="photos" name="photos" type="file" className="sr-only" multiple accept="image/*" capture="environment" />
                    </label>
                    <p className="pl-1 dark:text-gray-400">or drag and drop</p>
                </div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">JPG, PNG up to 10MB</p>
            </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="shimmer-button w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl"
        >
          Archive Site Log
        </button>
      </div>
    </form>
  );
}
