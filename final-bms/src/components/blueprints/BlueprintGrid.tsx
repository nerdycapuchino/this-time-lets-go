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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {revisions && revisions.length > 0 ? (
          revisions.map((revision) => (
            <div
              key={revision.id}
              className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg"
              onClick={() => openViewer(revision)}
            >
              <img
                src={revision.publicUrl}
                alt={revision.description}
                className="w-full h-48 object-cover"
              />
              <div className="p-2">
                <p className="font-semibold text-sm truncate">{revision.description}</p>
                <p className="text-xs text-gray-500">
                  Version: {revision.version}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">
            No blueprints uploaded yet.
          </p>
        )}
      </div>
      {selectedRevision && (
        <BlueprintViewer revision={selectedRevision} onClose={closeViewer} />
      )}
    </>
  );
}
