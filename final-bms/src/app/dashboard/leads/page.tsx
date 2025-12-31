'use client';

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  created_at: string;
}

async function getLeads(): Promise<Lead[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
  
  return data || [];
}

export default async function LeadsPage() {
  const leads = await getLeads();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Leads</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track your leads</p>
        </div>
        <Link
          href="/dashboard/leads?new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          New Lead
        </Link>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-slate-300 font-semibold text-sm">Name</th>
              <th className="px-6 py-3 text-left text-slate-300 font-semibold text-sm">Email</th>
              <th className="px-6 py-3 text-left text-slate-300 font-semibold text-sm">Phone</th>
              <th className="px-6 py-3 text-left text-slate-300 font-semibold text-sm">Company</th>
              <th className="px-6 py-3 text-left text-slate-300 font-semibold text-sm">Status</th>
              <th className="px-6 py-3 text-left text-slate-300 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  No leads found. Start by creating a new lead.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-800 hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 text-slate-100">{lead.name}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{lead.email}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{lead.phone}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{lead.company}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      lead.status === 'active' ? 'bg-green-900 text-green-200' :
                      lead.status === 'inactive' ? 'bg-gray-900 text-gray-200' :
                      'bg-yellow-900 text-yellow-200'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
