'use client'

import { useState } from 'react'
import { getLeads, deleteLead, getLeadById } from '@/app/actions/leads'
import { LeadForm } from '@/components/leads/LeadForm'
import { useEffect } from 'react'

interface Lead {
  id: string
  full_name: string
  email: string
  phone: string
  company: string
  service_requested: string
  status: string
  created_at: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Load leads on mount
  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    setIsLoading(true)
    const data = await getLeads()
    setLeads(data || [])
    setIsLoading(false)
  }

  const handleCreateNew = () => {
    setEditingLead(undefined)
    setIsFormOpen(true)
  }

  const handleEditLead = async (lead: Lead) => {
    setEditingLead(lead)
    setIsFormOpen(true)
  }

  const handleDeleteLead = async (leadId: string) => {
    const result = await deleteLead(leadId)
    if (result.success) {
      setLeads(leads.filter(l => l.id !== leadId))
      setDeleteConfirm(null)
    }
  }

  const handleFormSuccess = async () => {
    await loadLeads()
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-blue-900 text-blue-100',
      'contacted': 'bg-purple-900 text-purple-100',
      'qualified': 'bg-amber-900 text-amber-100',
      'negotiating': 'bg-yellow-900 text-yellow-100',
      'converted': 'bg-emerald-900 text-emerald-100',
      'lost': 'bg-red-900 text-red-100',
    }
    return colors[status] || 'bg-slate-700 text-slate-200'
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Leads Dashboard</h1>
            <p className="text-gray-500 text-sm font-medium mt-1">Strategic pipeline entry and market engagement tracking</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
          >
            + New Lead
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-400">Loading leads...</div>
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
          <p className="text-slate-400 mb-4">No leads yet. Create your first lead to get started.</p>
          <button
            onClick={handleCreateNew}
            className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
          >
            Create First Lead
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{lead.full_name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                    <p>📧 {lead.email}</p>
                    <p>📱 {lead.phone}</p>
                    <p>🏢 {lead.company || 'No company'}</p>
                    <p>🎯 {lead.service_requested || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditLead(lead)}
                      className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(lead.id)}
                      className="px-3 py-2 text-sm bg-red-900 hover:bg-red-800 text-red-100 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {deleteConfirm === lead.id && (
                <div className="mt-4 p-4 bg-red-900 bg-opacity-20 border border-red-900 rounded-lg">
                  <p className="text-red-200 mb-3">Are you sure you want to delete this lead? This action cannot be undone.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <LeadForm
        lead={editingLead}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingLead(undefined)
        }}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
