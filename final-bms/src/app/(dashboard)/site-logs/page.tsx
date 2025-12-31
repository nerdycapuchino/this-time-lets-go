import { createClient } from "@/lib/supabase/server";
import { Plus, MessageSquare, Camera } from "lucide-react";
import Link from "next/link";

export default async function SiteLogsPage() {
  const supabase = await createClient();
  const { data: logs, error } = await supabase
    .from("site_logs")
    .select(`
      *,
      projects (name),
      profiles (first_name, last_name)
    `)
    .order("log_date", { ascending: false });

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage.from("site-photos").getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Inspection Archives</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Chronological repository of field observations and visual verification</p>
        </div>
        <Link
          href="/dashboard/site-logs/new"
          className="shimmer-button bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center font-bold shadow-lg shadow-blue-500/20"
        >
          <Plus className="mr-2 h-5 w-5" />
          NEW INSPECTION
        </Link>
      </div>

      <div className="space-y-8">
        {logs && logs.length > 0 ? (
          logs.map((log) => (
            <div key={log.id} className="glass-card p-8 rounded-3xl neu-shadow group hover:border-blue-500/20 transition-all">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/5">
                <div>
                    <p className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">{log.projects?.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">
                        Recorded by {log.profiles?.first_name} {log.profiles?.last_name} • {new Date(log.log_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full text-gray-400">LOG REF: {log.id}</span>
              </div>
              
              {log.notes && (
                <div className="flex items-start bg-white/5 p-6 rounded-2xl border border-white/5 mb-6">
                    <MessageSquare className="h-4 w-4 mr-4 text-blue-500 mt-1"/>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-relaxed italic">"{log.notes}"</p>
                </div>
              )}

              {log.photos && log.photos.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center"><Camera className="h-3.5 w-3.5 mr-2 text-gray-400"/> Visual Assets</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {log.photos.map((photo: string, index: number) => (
                            <a key={index} href={getPublicUrl(photo)} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all shadow-xl group/img">
                                <img src={getPublicUrl(photo)} alt={`Site photo ${index + 1}`} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"/>
                            </a>
                        ))}
                    </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 glass-card rounded-3xl border-dashed border-2">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs italic">No inspection records found in the archive.</p>
          </div>
        )}
        {error && <div className="p-6 bg-red-500/10 text-red-500 text-sm font-bold rounded-2xl uppercase tracking-widest">ERROR: {error.message}</div>}
      </div>
    </div>
  );
}
