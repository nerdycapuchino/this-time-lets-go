"use client";

import { useState } from "react";
import BlueprintViewer from "./BlueprintViewer";

type Revision = {
  id: number;
  description: string;
  version: number;
  publicUrl: string;
};

type BlueprintGridProps = {
  revisions: Revision[];
};

export default function BlueprintGrid({ revisions }: BlueprintGridProps) {
  const [selectedRevision, setSelectedRevision] = useState<Revision | null>(null);

  const openViewer = (revision: Revision) => setSelectedRevision(revision);
  const closeViewer = () => setSelectedRevision(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {revisions && revisions.length > 0 ? (
          revisions.map((revision) => (
            <div
              key={revision.id}
              className="glass-surface rounded-2xl overflow-hidden cursor-pointer neu-shadow group hover:border-blue-500/30 transition-all duration-500"
              onClick={() => openViewer(revision)}
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={revision.publicUrl}
                  alt={revision.description}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">View Spec</span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-bold text-xs text-gray-900 dark:text-white truncate mb-1">{revision.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    V{revision.version}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    ARCHIVE
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center glass-surface rounded-3xl border-dashed border-2">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              Waiting for architectural uploads
            </p>
          </div>
        )}
      </div>
      {selectedRevision && (
        <BlueprintViewer revision={selectedRevision} onClose={closeViewer} />
      )}
    </>
  );
}
