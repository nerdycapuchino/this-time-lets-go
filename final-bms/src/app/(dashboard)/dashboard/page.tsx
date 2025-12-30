import { getSystemHealth } from '@/app/actions/watchdog';
import { AlertTriangle, Info } from 'lucide-react';

export default async function DashboardPage() {
  const { staleLeads, staleProjects } = await getSystemHealth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Welcome</h2>
          <p className="text-gray-600">Welcome to your dashboard.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">System Alerts</h2>
          <div className="space-y-4">
            <div className={`p-4 rounded-md flex items-start gap-4 ${staleLeads && staleLeads > 0 ? 'bg-orange-50 border-l-4 border-orange-400' : 'bg-green-50 border-l-4 border-green-400'}`}>
              <div>
                {staleLeads && staleLeads > 0 ? <AlertTriangle className="text-orange-500" /> : <Info className="text-green-500" />}
              </div>
              <div>
                <p className="font-semibold">{staleLeads || 0} Stale Leads</p>
                <p className="text-sm text-gray-600">New leads older than 24 hours.</p>
              </div>
            </div>
            <div className={`p-4 rounded-md flex items-start gap-4 ${staleProjects && staleProjects > 0 ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'bg-green-50 border-l-4 border-green-400'}`}>
              <div>
                {staleProjects && staleProjects > 0 ? <AlertTriangle className="text-yellow-500" /> : <Info className="text-green-500" />}
              </div>
              <div>
                <p className="font-semibold">{staleProjects || 0} Stale Projects</p>
                <p className="text-sm text-gray-600">Projects with no activity in 3 days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
