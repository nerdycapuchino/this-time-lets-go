import { createClient } from "@/lib/supabase/server";
import { Plus, MessageSquare, Camera } from "lucide-react";
import Link from "next/link";

export default async function SiteLogsPage() {
  const supabase = createClient();
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Site Inspection Logs</h1>
        <Link
          href="/dashboard/site-logs/new"
          className="bg-black text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="mr-2" />
          New Log
        </Link>
      </div>
      <div className="space-y-6">
        {logs && logs.length > 0 ? (
          logs.map((log) => (
            <div key={log.id} className="bg-white rounded-md shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-lg">{log.projects?.name}</p>
                    <p className="text-sm text-gray-500">
                        Logged by: {log.profiles?.first_name} {log.profiles?.last_name} on {new Date(log.log_date).toLocaleDateString()}
                    </p>
                </div>
                <span className="text-xs bg-gray-100 p-2 rounded-lg">ID: {log.id}</span>
              </div>
              
              {log.notes && (
                <div className="mt-4 flex items-start">
                    <MessageSquare className="h-5 w-5 mr-3 text-gray-400 mt-1"/>
                    <p className="text-gray-700 whitespace-pre-wrap">{log.notes}</p>
                </div>
              )}

              {log.photos && log.photos.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold flex items-center"><Camera className="h-5 w-5 mr-2 text-gray-400"/> Photos</h4>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-2">
                        {log.photos.map((photo: string, index: number) => (
                            <a key={index} href={getPublicUrl(photo)} target="_blank" rel="noopener noreferrer">
                                <img src={getPublicUrl(photo)} alt={`Site photo ${index + 1}`} className="w-full h-32 object-cover rounded-md hover:shadow-lg"/>
                            </a>
                        ))}
                    </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 bg-white p-12 rounded-md shadow-md">
            <p>No site logs found.</p>
          </div>
        )}
        {error && <p className="p-4 text-red-500">Error: {error.message}</p>}
      </div>
    </div>
  );
}
