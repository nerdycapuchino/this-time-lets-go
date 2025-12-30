'use client'

import { useState } from 'react'
import { generateInvoiceForMilestone } from '@/app/actions/invoices'
import { generateInvoicePDF } from '@/lib/pdf-generator'
import { Loader2, FileText, CheckCircle, X } from 'lucide-react'

interface MilestoneApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  milestone: {
    id: string
    name: string
    amount: number
  }
  projectName: string
}

export function MilestoneApprovalModal({ 
  isOpen, 
  onClose, 
  milestone,
  projectName 
}: MilestoneApprovalModalProps) {
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle')
  const [invoiceData, setInvoiceData] = useState<any>(null)

  if (!isOpen) return null

  const handleGenerateInvoice = async () => {
    setStatus('generating')
    const result = await generateInvoiceForMilestone(milestone.id)

    if (result.error) {
      setStatus('error')
      alert(result.error)
      return
    }

    if (result.success && result.invoice) {
      setInvoiceData({ ...result.invoice, ...result.details })
      setStatus('success')
    }
  }

  const handleDownloadPDF = () => {
    if (!invoiceData) return
    const doc = generateInvoicePDF({
      invoiceNumber: invoiceData.id.slice(0, 8).toUpperCase(),
      date: invoiceData.issue_date,
      clientName: invoiceData.clientName,
      projectName: invoiceData.projectName,
      items: [{ description: invoiceData.milestoneName, amount: invoiceData.amount }],
      total: invoiceData.amount
    })
    doc.save(`Invoice-${projectName}-${milestone.name}.pdf`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Milestone Completed</h2>
            <p className="text-sm text-gray-500">{projectName}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X className="h-5 w-5 text-gray-400" /></button>
        </div>

        <div className="mb-6 rounded-xl bg-slate-50 p-4 border border-slate-200">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate-600">{milestone.name}</span>
            <span className="text-lg font-bold text-slate-900">
              ₹{new Intl.NumberFormat('en-IN').format(milestone.amount)}
            </span>
          </div>
          <p className="text-xs text-slate-500 italic">Ready to generate professional GST-ready invoice.</p>
        </div>

        <div className="space-y-3">
          {status === 'idle' && (
            <button
              onClick={handleGenerateInvoice}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 transition-all"
            >
              <FileText className="h-5 w-5" /> Generate & Log Invoice
            </button>
          )}

          {status === 'generating' && (
            <button disabled className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-3 font-medium text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" /> Processing...
            </button>
          )}

          {status === 'success' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600 justify-center font-semibold p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5" /> Invoice Generated!
              </div>
              <button
                onClick={handleDownloadPDF}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
              >
                Download PDF Invoice
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}