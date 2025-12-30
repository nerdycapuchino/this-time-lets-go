"use client";

import { useMemo } from 'react';
import { Download, FileText, History } from 'lucide-react';

// This type should ideally be co-located with your other database types
export type Revision = {
  id: number;
  created_at: string;
  file_name: string;
  version: number;
  storage_object_id: string; // This is the full path in the bucket
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
};

interface RevisionListProps {
  revisions: Revision[];
}

// Helper to get the public URL for a file
function getPublicUrl(storageObjectId: string): string {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('SUPABASE_URL not set, download links may be broken.');
    return '#';
  }
  const url = new URL(
    `/storage/v1/object/public/project-assets/${storageObjectId}`,
    process.env.NEXT_PUBLIC_SUPABASE_URL
  ).toString();
  return url;
}

export function RevisionList({ revisions }: RevisionListProps) {
  const groupedRevisions = useMemo(() => {
    const groups: Record<string, Revision[]> = {};
    for (const revision of revisions) {
      if (!groups[revision.file_name]) {
        groups[revision.file_name] = [];
      }
      groups[revision.file_name].push(revision);
    }
    // Sort each group by version descending
    for (const fileName in groups) {
      groups[fileName].sort((a, b) => b.version - a.version);
    }
    return groups;
  }, [revisions]);

  const sortedFileNames = useMemo(
    () => Object.keys(groupedRevisions).sort((a, b) => a.localeCompare(b)),
    [groupedRevisions]
  );

  if (revisions.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <History className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Revisions</h3>
        <p className="mt-1 text-sm text-gray-500">Upload a file to see its version history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedFileNames.map((fileName) => (
        <div key={fileName} className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              {fileName}
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {groupedRevisions[fileName].map((revision, index) => {
              const uploaderName = revision.profiles
                ? `${revision.profiles.first_name || ''} ${revision.profiles.last_name || ''}`.trim()
                : 'Unknown User';

              return (
                <li key={revision.id} className="px-4 py-4 flex items-center justify-between space-x-4">
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-800">
                      Version {revision.version}
                      {index === 0 && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Latest
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded by {uploaderName} on {new Date(revision.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={getPublicUrl(revision.storage_object_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
