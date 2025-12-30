import { FileText, Download, Clock } from 'lucide-react'
import { getRevisions } from '@/app/actions/revisions'

interface RevisionListProps {
  projectId: string
}

export async function RevisionList({ projectId }: RevisionListProps) {
  const revisions = await getRevisions(projectId)

  if (!revisions || revisions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
        <p>No drawings uploaded yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {revisions.map((rev: any) => (
        <div 
          key={rev.id} 
          className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <span className="font-bold text-blue-700 text-xs">V{rev.version_number}</span>
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{rev.file_name}</h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{new Date(rev.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <a 
            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-assets/${rev.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Download className="h-5 w-5" />
          </a>
        </div>
      ))}
    </div>
  )
}