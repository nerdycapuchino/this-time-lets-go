import { getLeads } from '@/app/actions/leads'
import { LeadList } from '@/components/leads/LeadList'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const leads = await getLeads()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Leads Dashboard</h1>
        <p className="text-gray-500">New contacts from your marketing channels.</p>
      </div>
      <LeadList leads={leads as any[]} />
    </div>
  )
}
