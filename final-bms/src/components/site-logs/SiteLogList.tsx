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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {logs.map((log) => (
        <div key={log.id} className="glass-surface rounded-3xl overflow-hidden neu-shadow group hover:border-blue-500/30 transition-all duration-500">
          <div className="aspect-video overflow-hidden">
            <img 
              src={log.image_url} 
              alt={`Site log from ${new Date(log.created_at).toLocaleDateString()}`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          </div>
          <div className="p-6">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-4 leading-relaxed">{log.notes}</p>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                {new Date(log.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Verified
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
