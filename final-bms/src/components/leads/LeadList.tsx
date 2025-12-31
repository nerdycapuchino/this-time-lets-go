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
    <div className="space-y-6">
      {leads.map((lead) => (
        <div key={lead.id} className="glass-card p-8 rounded-3xl neu-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-blue-500/20 transition-all">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">
                  {lead.full_name}
                </h3>
                <div className="flex flex-wrap gap-4 mt-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> {lead.phone}
                  </p>
                  {lead.email && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" /> {lead.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 italic">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">"{lead.notes || 'No strategic objectives defined.'}"</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black bg-blue-600/10 text-blue-600 border border-blue-600/20 px-3 py-1 rounded-full uppercase tracking-widest">
                {lead.service_requested}
              </span>
              <span className="text-[9px] font-black bg-gray-100 dark:bg-white/5 text-gray-500 px-3 py-1 rounded-full uppercase tracking-widest">
                REF: {lead.id.slice(0, 8)}
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <button
              onClick={() => handleConvert(lead.id)}
              disabled={convertingId === lead.id || lead.status === 'converted'}
              className="shimmer-button w-full md:w-auto flex items-center justify-center gap-3 text-[10px] font-black text-white px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest"
            >
              {convertingId === lead.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Workflow className="w-4 h-4" />
              )}
              {lead.status === 'converted' ? 'PROCESSED' : 'CONVERT TO PROJECT'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
