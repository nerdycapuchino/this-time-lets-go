// src/app/(portal)/share/[key]/page.tsx
import { notFound } from 'next/navigation';
import { getPortalData } from '@/app/actions/portal';
import { format } from 'date-fns';
import { FileText, CheckCircle2, Clock } from 'lucide-react';

export default async function ProjectSharePage({ params }: { params: Promise<{ key: string }> }) {
  const resolvedParams = await params;
  const { key } = resolvedParams;

  const data = await getPortalData(key);

  if (!data) {
    notFound();
  }

  const { project, siteLogs, revisions, paymentStatus } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-12 border-b pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{project.name}</h1>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full text-sm font-medium uppercase tracking-wider">
              {project.status.replace('_', ' ')}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Client Portal
            </span>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="font-semibold">{format(new Date(), 'PPP')}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          {/* Site Logs Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-500" />
              Latest Site Updates
            </h2>
            {siteLogs.length > 0 ? (
              <div className="space-y-6">
                {siteLogs.map((log: any) => (
                  <div key={log.id} className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {format(new Date(log.created_at), 'MMMM do, yyyy')}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{log.notes || 'No entry details provided.'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-zinc-900/50 p-8 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 text-center">
                <p className="text-gray-500 dark:text-gray-400">No recent site updates available.</p>
              </div>
            )}
          </section>

          {/* Revisions Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-purple-500" />
              Latest Documents
            </h2>
            {revisions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {revisions.map((rev: any) => (
                  <div key={rev.id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-100 dark:border-zinc-800 flex items-center gap-3">
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded">
                      <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {rev.file_name || 'Document'}
                      </p>
                      <p className="text-xs text-gray-500">Version {rev.version} • {format(new Date(rev.created_at), 'MMM d')}</p>
                    </div>
                    <a 
                      href={`/api/download/${rev.storage_object_id}`} 
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No documents shared yet.</p>
            )}
          </section>
        </div>

        <div className="space-y-8">
          {/* Financial Summary Card */}
          <section className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment Overview</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Invoiced</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${paymentStatus.totalInvoiced.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">Paid</p>
                  <p className="text-lg font-bold text-green-600">${paymentStatus.totalPaid.toLocaleString()}</p>
                </div>
              </div>

              <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(paymentStatus.totalPaid / paymentStatus.totalInvoiced) * 100 || 0}%` }}
                ></div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Balance Outstanding</span>
                  <span className="text-lg font-bold text-red-600">${paymentStatus.outstanding.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support Card */}
          <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/50">
            <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-2">Need Support?</h3>
            <p className="text-xs text-blue-700 dark:text-blue-400 mb-4">If you have any questions about your project, please contact your project manager.</p>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Request Callback
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
