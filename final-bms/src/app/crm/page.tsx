'use client';

import { useState } from 'react';

const sampleLeads = [
  { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1234567890', status: 'New', source: 'Website', value: 50000, orderHistory: 0, pastPurchases: [], abandonedCart: false, invoiceStatus: 'None', quality: 'Good' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1234567891', status: 'Proposal', source: 'Referral', value: 75000, orderHistory: 2, pastPurchases: ['Order-001', 'Order-002'], abandonedCart: false, invoiceStatus: 'Paid', quality: 'Excellent' },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '+1234567892', status: 'Negotiation', source: 'LinkedIn', value: 100000, orderHistory: 5, pastPurchases: ['Order-003', 'Order-004', 'Order-005'], abandonedCart: true, invoiceStatus: 'Pending', quality: 'Good' },
  { id: 4, name: 'Emma Davis', email: 'emma@example.com', phone: '+1234567893', status: 'Qualified', source: 'Email', value: 120000, orderHistory: 3, pastPurchases: ['Order-006'], abandonedCart: false, invoiceStatus: 'Paid', quality: 'Excellent' },
  { id: 5, name: 'Robert Wilson', email: 'robert@example.com', phone: '+1234567894', status: 'Lost', source: 'Cold Call', value: 40000, orderHistory: 1, pastPurchases: ['Order-007'], abandonedCart: true, invoiceStatus: 'Unpaid', quality: 'Damaged - RMA Pending' },
];

const pipelineStages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

const statusColors = {
  New: 'bg-blue-900 text-blue-200',
  Contacted: 'bg-yellow-900 text-yellow-200',
  Qualified: 'bg-green-900 text-green-200',
  Proposal: 'bg-purple-900 text-purple-200',
  Negotiation: 'bg-orange-900 text-orange-200',
  Won: 'bg-emerald-900 text-emerald-200',
  Lost: 'bg-red-900 text-red-200',
};

export default function CRMPage() {
  const [leads, setLeads] = useState(sampleLeads);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [expandedLead, setExpandedLead] = useState(null);

  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const avgValue = leads.length > 0 ? Math.round(totalValue / leads.length) : 0;
  const conversionRate = Math.round((leads.filter(l => l.status === 'Won').length / leads.length) * 100);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">CRM - Advanced Client Management</h1>
          <p className="text-slate-400 mt-2">Pipeline tracking, sales history, returns & quality claims</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
          + New Lead
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Total Leads</p>
          <p className="text-3xl font-bold text-white mt-2">{leads.length}</p>
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
          <p className="text-3xl font-bold text-green-400 mt-2">{conversionRate}%</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Quality Issues</p>
          <p className="text-3xl font-bold text-red-400 mt-2">1 RMA</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-slate-700 pb-4">
        {['overview', 'pipeline', 'orders', 'returns'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
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
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-700 transition cursor-pointer">
                  <td className="px-6 py-4 text-white font-medium">{lead.name}</td>
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
                    <button onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)} className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white transition">📋</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders & History Tab */}
      {selectedTab === 'orders' && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Order Lifecycle & History</h2>
          <div className="space-y-4">
            {leads.filter(l => l.orderHistory > 0).map(lead => (
              <div key={lead.id} className="bg-slate-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{lead.name}</h3>
                    <p className="text-slate-400 text-sm">{lead.orderHistory} orders | Invoice: {lead.invoiceStatus}</p>
                  </div>
                  <div className="text-right">
                    {lead.abandonedCart && <span className="text-yellow-400 font-medium">⚠️ Cart Abandoned</span>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {lead.pastPurchases.map(order => (
                    <div key={order} className="bg-slate-600 px-3 py-2 rounded text-slate-200">
                      {order}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Returns & Quality Tab */}
      {selectedTab === 'returns' && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Quality Claims & Returns Management</h2>
          <div className="space-y-4">
            {leads.filter(l => l.quality !== 'Good' && l.quality !== 'Excellent').map(lead => (
              <div key={lead.id} className="bg-red-900 bg-opacity-20 border border-red-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-semibold">{lead.name}</h3>
                    <p className="text-red-300 text-sm mt-1">{lead.quality}</p>
                    <p className="text-slate-400 text-sm mt-2">Reference: {lead.pastPurchases[0]}</p>
                  </div>
                  <div className="space-y-2">
                    <button className="block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition">Create RMA</button>
                    <button className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition">Contact Client</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline View */}
      {selectedTab === 'pipeline' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipelineStages.map(stage => {
            const stageLeads = leads.filter(l => l.status === stage);
            return (
              <div key={stage} className="bg-slate-800 rounded-lg p-4 flex-shrink-0 w-72 min-h-96">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold">{stage}</h3>
                  <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-sm">{stageLeads.length}</span>
                </div>
                <div className="space-y-3">
                  {stageLeads.map(lead => (
                    <div key={lead.id} className="bg-slate-700 p-3 rounded-lg hover:bg-slate-600 transition">
                      <p className="text-white font-medium text-sm">{lead.name}</p>
                      <p className="text-slate-400 text-xs mt-1">${lead.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
