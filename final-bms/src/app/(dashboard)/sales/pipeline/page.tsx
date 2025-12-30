import { getLeads } from '@/app/actions/leads';
import { IndianRupee } from 'lucide-react';

const STAGES = ['inquiry', 'meeting', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

export default async function SalesPipelinePage() {
  const leads = await getLeads();

  const leadsByStage = STAGES.reduce((acc, stage) => {
    acc[stage] = leads.filter(lead => lead.pipeline_stage === stage);
    return acc;
  }, {} as Record<string, typeof leads>);

  const stageTotals = STAGES.reduce((acc, stage) => {
    acc[stage] = leadsByStage[stage].reduce((sum, lead) => sum + (lead.deal_value || 0), 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Sales Pipeline</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Real-time conversion tracking across all deal stages</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-white dark:bg-zinc-900 glass-surface rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Value</span>
            <span className="text-lg font-black text-blue-600">₹{Object.values(stageTotals).reduce((a, b) => a + b, 0).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-8 snap-x">
        {STAGES.map(stage => (
          <div key={stage} className="w-80 flex-shrink-0 snap-start">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">{stage.replace('_', ' ')}</h2>
              <span className="px-2.5 py-1 bg-white dark:bg-white/5 rounded-lg text-[10px] font-black text-gray-500 border border-white/10">
                {leadsByStage[stage].length}
              </span>
            </div>
            <div className="space-y-4 min-h-[600px] glass-surface rounded-3xl p-3 bg-white/5 border border-white/5">
              {leadsByStage[stage].map(lead => (
                <div key={lead.id} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 neu-shadow border border-white/10 hover:border-blue-500/30 transition-all group cursor-pointer">
                  <p className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">{lead.full_name}</p>
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-tight mb-4">{lead.service_requested}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-black text-sm">
                      <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                      <span>{lead.deal_value?.toLocaleString('en-IN') || '0'}</span>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
