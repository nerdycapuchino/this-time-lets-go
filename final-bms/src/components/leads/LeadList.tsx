'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { convertToProject } from '@/app/actions/leads'
import { User, Phone, Mail, Workflow, Loader2 } from 'lucide-react'

type Lead = {
  id: string
  full_name: string
  email: string | null
  phone: string
  service_requested: string
  status: string
  notes: string | null
  created_at: string
}

interface LeadListProps {
  leads: Lead[]
}

export function LeadList({ leads }: LeadListProps) {
  const [convertingId, setConvertingId] = useState<string | null>(null)
  const router = useRouter()

  const handleConvert = async (leadId: string) => {
    if (confirm('Are you sure you want to convert this lead to a project?')) {
      setConvertingId(leadId)
      const result = await convertToProject(leadId)
      setConvertingId(null)
      if (result.error) {
        alert(`Error: ${result.error}`)
      } else if (result.success && result.projectId) {
        alert('Lead converted successfully! Redirecting to the new project...')
        router.push(`/dashboard/projects/${result.projectId}`)
      }
    }
  }

  if (leads.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 border border-dashed rounded-lg">
        <p>No new leads. Check your marketing campaigns!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div key={lead.id} className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" /> {lead.full_name}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> {lead.phone}
            </p>
            {lead.email && (
                <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" /> {lead.email}
                </p>
            )}
            <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded-md border italic">"{lead.notes || 'No message left.'}"</p>
            <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{lead.service_requested}</span>
          </div>
          <div>
            <button
              onClick={() => handleConvert(lead.id)}
              disabled={convertingId === lead.id || lead.status === 'converted'}
              className="flex items-center gap-2 text-sm text-white font-semibold p-2 px-3 rounded-md bg-green-600 hover:bg-green-700 disabled:bg-green-300 transition-colors"
            >
              {convertingId === lead.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Workflow className="w-4 h-4" />
              )}
              {lead.status === 'converted' ? 'Converted' : 'Convert to Project'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
