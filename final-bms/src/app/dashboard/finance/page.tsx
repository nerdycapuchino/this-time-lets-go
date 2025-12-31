'use client';

import { createClient } from '@/lib/supabase/server';

interface Invoice {
  id: string;
  client_name: string;
  amount: number;
  status: string;
  due_date: string;
  created_at: string;
}

async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
  
  return data || [];
}

export default async function FinancePage() {
  const invoices = await getInvoices();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Finance</h1>
        <p className="text-slate-400 text-sm mt-1">Manage invoices and financial records</p>
      </div>

      {/* Invoices Table */}
      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-slate-300 font-semibold text-sm">Invoice ID</th>
              <th className="px-6 py-3 text-left text-slate-300 font-semibold text-sm">Client</th>
              <th className="px-6 py-3 text-left text-slate-300 font-semibold text-sm">Amount</th>
              <th className="px-6 py-3 text-left text-slate-300 font-semibold text-sm">Status</th>
              <th className="px-6 py-3 text-left text-slate-300 font-semibold text-sm">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-slate-800 hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 text-slate-100 font-mono text-sm">{invoice.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{invoice.client_name}</td>
                  <td className="px-6 py-4 text-slate-100 font-semibold">${invoice.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      invoice.status === 'paid' ? 'bg-green-900 text-green-200' :
                      invoice.status === 'pending' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-red-900 text-red-200'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{new Date(invoice.due_date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
