'use client';

import { useState } from 'react';

const sampleLeads = [
  { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1234567890', status: 'New', source: 'Website', value: 50000 },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1234567891', status: 'Contacted', source: 'Referral', value: 75000 },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '+1234567892', status: 'Qualified', source: 'LinkedIn', value: 100000 },
  { id: 4, name: 'Emma Davis', email: 'emma@example.com', phone: '+1234567893', status: 'In Progress', source: 'Email', value: 120000 },
  { id: 5, name: 'Robert Wilson', email: 'robert@example.com', phone: '+1234567894', status: 'Lost', source: 'Cold Call', value: 40000 },
];

const statusColors = {
  New: 'bg-blue-900 text-blue-200',
  Contacted: 'bg-yellow-900 text-yellow-200',
  Qualified: 'bg-green-900 text-green-200',
  'In Progress': 'bg-purple-900 text-purple-200',
  Lost: 'bg-red-900 text-red-200',
};

export default function CRMPage() {
  const [leads, setLeads] = useState(sampleLeads);
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);

  const filteredLeads = filter === 'All' ? leads : leads.filter(lead => lead.status === filter);

  const totalValue = filteredLeads.reduce((sum, lead) => sum + lead.value, 0);
  const avgValue = filteredLeads.length > 0 ? Math.round(totalValue / filteredLeads.length) : 0;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">CRM - Client Management</h1>
          <p className="text-slate-400 mt-2">Manage leads, track pipeline, and communicate with clients</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
        >
          + New Lead
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Total Leads</p>
          <p className="text-3xl font-bold text-white mt-2">{filteredLeads.length}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Total Value</p>
          <p className="text-3xl font-bold text-white mt-2">${(totalValue / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Avg Deal Value</p>
          <p className="text-3xl font-bold text-white mt-2">${(avgValue / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Conversion Rate</p>
          <p className="text-3xl font-bold text-white mt-2">40%</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'New', 'Contacted', 'Qualified', 'In Progress', 'Lost'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-6 py-4 text-left text-white font-semibold">Client Name</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Contact</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Source</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Deal Value</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredLeads.map(lead => (
              <tr key={lead.id} className="hover:bg-slate-700 transition">
                <td className="px-6 py-4 text-white">{lead.name}</td>
                <td className="px-6 py-4 text-slate-300">{lead.email}</td>
                <td className="px-6 py-4 text-slate-300">{lead.source}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[lead.status] || ''}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-white font-semibold">${lead.value.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white transition">📞</button>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white transition">✉️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
