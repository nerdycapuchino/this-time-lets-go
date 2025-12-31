'use client'

import { useState } from 'react'
import { generateInvoiceForMilestone } from '@/app/actions/invoicing'
import { generateInvoicePDF } from '@/lib/pdf-generator'
import { Loader2, FileText, CheckCircle, X } from 'lucide-react'

interface MilestoneApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  milestone: {
    id: number
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
      invoiceNumber: String(invoiceData.id).toUpperCase(),
      date: invoiceData.created_at || new Date().toISOString(),
      clientName: invoiceData.clientName,
      projectName: invoiceData.projectName,
      items: [{ description: invoiceData.milestoneName, amount: invoiceData.amount }],
      total: invoiceData.amount
    })
    doc.save(`Invoice-${projectName}-${milestone.name}.pdf`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-md glass-surface rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Milestone Approval</h2>
            <p className="architectural-heading mt-1">{projectName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="h-5 w-5 text-gray-400" /></button>
        </div>

        <div className="mb-8 rounded-2xl bg-white/5 p-6 border border-white/5 neu-shadow">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">{milestone.name}</span>
            <span className="text-xl font-black text-blue-600 dark:text-blue-400">
              ₹{new Intl.NumberFormat('en-IN').format(milestone.amount)}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">GST-READY INVOICE CALCULATION</p>
        </div>

        <div className="space-y-4">
          {status === 'idle' && (
            <button
              onClick={handleGenerateInvoice}
              className="shimmer-button w-full flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-xs font-black text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest"
            >
              <FileText className="h-4 w-4" /> Finalize & Log Invoice
            </button>
          )}

          {status === 'generating' && (
            <button disabled className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white/5 px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest border border-white/5">
              <Loader2 className="h-4 w-4 animate-spin" /> Transmitting...
            </button>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-500 justify-center text-xs font-black p-4 bg-green-500/10 rounded-2xl border border-green-500/20 uppercase tracking-widest">
                <CheckCircle className="h-4 w-4" /> Transaction Logged
              </div>
              <button
                onClick={handleDownloadPDF}
                className="shimmer-button w-full flex items-center justify-center gap-3 rounded-2xl bg-gray-900 dark:bg-white px-6 py-4 text-xs font-black text-white dark:text-black hover:opacity-90 transition-all uppercase tracking-widest"
              >
                Archive PDF Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}