'use client'

interface SiteLog {
  id: string
  created_at: string
  image_url: string
  notes: string
}

interface SiteLogListProps {
  logs: SiteLog[]
}

export function SiteLogList({ logs }: SiteLogListProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No site logs have been added yet.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {logs.map((log) => (
        <div key={log.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <img src={log.image_url} alt={`Site log from ${new Date(log.created_at).toLocaleDateString()}`} className="w-full h-auto object-cover" />
          <div className="p-4">
            <p className="text-sm text-gray-700">{log.notes}</p>
            <p className="text-xs text-gray-500 mt-2">{new Date(log.created_at).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
