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
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Sales Pipeline</h1>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <div key={stage} className="w-80 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold capitalize text-gray-700">{stage.replace('_', ' ')}</h2>
              <span className="font-bold text-gray-800">
                ₹{stageTotals[stage].toLocaleString('en-IN')}
              </span>
            </div>
            <div className="space-y-4 h-full bg-gray-100 rounded-lg p-2">
              {leadsByStage[stage].map(lead => (
                <div key={lead.id} className="p-4 rounded-lg bg-gray-100 shadow-[9px_9px_16px_#d9d9d9,-9px_-9px_16px_#ffffff]">
                  <p className="font-bold text-gray-800">{lead.full_name}</p>
                  <p className="text-sm text-gray-600">{lead.service_requested}</p>
                  <div className="flex items-center mt-2">
                    <IndianRupee className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="text-gray-700 font-semibold">{lead.deal_value?.toLocaleString('en-IN') || 'N/A'}</span>
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
