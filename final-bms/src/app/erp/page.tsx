'use client';

import { useState } from 'react';

const departments = [
  { id: 1, name: 'Engineering', employees: 15, utilization: 85, budget: 500000 },
  { id: 2, name: 'Sales', employees: 10, utilization: 70, budget: 300000 },
  { id: 3, name: 'Marketing', employees: 8, utilization: 75, budget: 200000 },
  { id: 4, name: 'Operations', employees: 12, utilization: 80, budget: 400000 },
];

const inventory = [
  { id: 1, item: 'Server Hardware', quantity: 45, capacity: 100, status: 'Normal' },
  { id: 2, item: 'Office Supplies', quantity: 230, capacity: 500, status: 'Normal' },
  { id: 3, item: 'Development Tools', quantity: 12, capacity: 20, status: 'Low' },
  { id: 4, item: 'Licenses', quantity: 85, capacity: 150, status: 'Normal' },
];

export default function ERPPage() {
  const totalEmployees = departments.reduce((sum, d) => sum + d.employees, 0);
  const avgUtilization = Math.round(departments.reduce((sum, d) => sum + d.utilization, 0) / departments.length);
  const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">ERP - Operations & Resources</h1>
        <p className="text-slate-400 mt-2">Monitor business health, resource allocation, and inventory</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Total Employees</p>
          <p className="text-3xl font-bold text-white mt-2">{totalEmployees}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Avg Utilization</p>
          <p className="text-3xl font-bold text-white mt-2">{avgUtilization}%</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Total Budget</p>
          <p className="text-3xl font-bold text-white mt-2">${(totalBudget / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">System Health</p>
          <p className="text-3xl font-bold text-green-400 mt-2">99.2%</p>
        </div>
      </div>

      {/* Resource Allocation */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Resource Allocation</h2>
        <div className="space-y-4">
          {departments.map(dept => (
            <div key={dept.id}>
              <div className="flex justify-between mb-2">
                <span className="text-white font-medium">{dept.name}</span>
                <span className="text-slate-400">{dept.employees} employees | {dept.utilization}% utilized</span>
              </div>
              <div className="bg-slate-900 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full" 
                  style={{width: `${dept.utilization}%`}}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Management */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <h2 className="text-2xl font-bold text-white p-6 mb-0">Inventory Levels</h2>
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-6 py-4 text-left text-white font-semibold">Item</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Quantity</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Capacity</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Usage %</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {inventory.map(item => (
              <tr key={item.id} className="hover:bg-slate-700 transition">
                <td className="px-6 py-4 text-white">{item.item}</td>
                <td className="px-6 py-4 text-slate-300">{item.quantity}</td>
                <td className="px-6 py-4 text-slate-300">{item.capacity}</td>
                <td className="px-6 py-4 text-slate-300">{Math.round((item.quantity / item.capacity) * 100)}%</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === 'Low' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
