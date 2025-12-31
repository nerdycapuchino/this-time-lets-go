import { getSystemHealth } from '@/app/actions/watchdog';
import { AlertTriangle, Info, Zap, ShieldCheck } from 'lucide-react';

export default async function DashboardPage() {
  const { staleLeads, staleProjects } = await getSystemHealth();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Command Center</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Operational overview and strategic workspace telemetry</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">System Secure</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-3xl neu-shadow border-blue-500/10 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors duration-700"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight flex items-center gap-3">
              <Zap className="h-5 w-5 text-blue-600" />
              Active Operations
            </h2>
            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xl">
              Welcome to StudioBMS. Your workspace is currently synchronizing with the production environment. Select a module from the sidebar to begin architectural management.
            </p>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Status</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">OPERATIONAL</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Env</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">PROD-ALPHA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Leads</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">SYNCHRONIZED</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Uptime</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">99.98%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl neu-shadow border-orange-500/10">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">System Watchdog</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl flex items-center gap-4 transition-colors ${staleLeads && staleLeads > 0 ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-green-500/5 border border-white/5'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${staleLeads && staleLeads > 0 ? 'bg-orange-500/20' : 'bg-green-500/20'}`}>
                  {staleLeads && staleLeads > 0 ? <AlertTriangle className="h-5 w-5 text-orange-500" /> : <Info className="h-5 w-5 text-green-500" />}
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{staleLeads || 0} Stale Leads</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Needs follow-up</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl flex items-center gap-4 transition-colors ${staleProjects && staleProjects > 0 ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-green-500/5 border border-white/5'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${staleProjects && staleProjects > 0 ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                  {staleProjects && staleProjects > 0 ? <AlertTriangle className="h-5 w-5 text-yellow-500" /> : <Info className="h-5 w-5 text-green-500" />}
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{staleProjects || 0} Idle Projects</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">No activity in 72h</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl neu-shadow">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Financial Integrity</span>
            <div className="flex items-end gap-3">
              <span className="text-2xl font-black text-blue-600">VERIFIED</span>
              <span className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Internal Audit Clear</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
