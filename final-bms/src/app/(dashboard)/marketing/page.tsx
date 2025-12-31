import { getMarketingMetrics } from '@/app/actions/marketing';
import { IndianRupee, Target, Percent } from 'lucide-react';

export default async function MarketingPage() {
  const { totalLeads, convertedLeads, totalRevenue, error } = await getMarketingMetrics();

  const staticSpend = 2000;
  const conversionPercentage = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
  const actualCPA = convertedLeads > 0 ? staticSpend / convertedLeads : 0;

  if (error) {
    return <div className="p-4 text-red-500">Error fetching marketing data: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Marketing ROI</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Real-time analysis of acquisition efficiency and revenue attribution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Total Leads Captured */}
        <div className="glass-card p-8 rounded-3xl neu-shadow transition-all hover:border-blue-500/20">
          <div className="flex flex-col">
            <div className="bg-blue-600/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <Target className="text-blue-600 dark:text-blue-400 h-6 w-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Lead Generation</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{totalLeads}</p>
          </div>
        </div>

        {/* Conversion % */}
        <div className="glass-card p-8 rounded-3xl neu-shadow transition-all hover:border-green-500/20">
          <div className="flex flex-col">
            <div className="bg-green-600/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <Percent className="text-green-600 dark:text-green-400 h-6 w-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Conversion Rate</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{conversionPercentage.toFixed(1)}%</p>
          </div>
        </div>

        {/* Actual CPA */}
        <div className="glass-card p-8 rounded-3xl neu-shadow transition-all hover:border-yellow-500/20">
          <div className="flex flex-col">
            <div className="bg-yellow-600/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <IndianRupee className="text-yellow-600 dark:text-yellow-400 h-6 w-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Cost Per Acq.</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">₹{actualCPA.toFixed(0)}</p>
          </div>
        </div>

        {/* Total Revenue Generated */}
        <div className="glass-card p-8 rounded-3xl neu-shadow transition-all hover:border-purple-500/20">
          <div className="flex flex-col">
            <div className="bg-purple-600/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <IndianRupee className="text-purple-600 dark:text-purple-400 h-6 w-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Total Attribution</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

      </div>

      <div className="glass-surface p-6 rounded-2xl border border-white/5 bg-white/5">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
          * METRIC CALCULATION: Actual CPA is computed against a baseline campaign spend of ₹2,000. Data refreshed in real-time based on Sales Pipeline transitions.
        </p>
      </div>
    </div>
  );
}
