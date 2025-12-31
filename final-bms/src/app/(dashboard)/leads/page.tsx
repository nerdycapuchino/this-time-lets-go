import { getLeads } from '@/app/actions/leads'
import { LeadList } from '@/components/leads/LeadList'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const leads = await getLeads()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Leads Dashboard</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Strategic pipeline entry and market engagement tracking</p>
      </div>
      <LeadList leads={leads as any[]} />
    </div>
  );
}
