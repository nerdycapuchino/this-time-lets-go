"use client";

import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Types received from the server RPC call
type ProjectData = {
  id: number;
  name: string;
  currency: 'USD' | 'INR';
  invoices: { amount: number; status: string, currency: 'USD' | 'INR' }[];
  kanban_cards: {
    id: number;
    title: string;
    budgeted_hours: number | null;
    time_logs: { duration_minutes: number | null; cost: number | null, currency: 'USD' | 'INR' }[];
  }[];
};
type MonthlyData = { month: string; total_revenue: number | null; total_cost: number | null; };
type ExchangeRate = { from_currency: 'USD' | 'INR'; to_currency: 'USD' | 'INR'; rate: number; };

type ProfitabilityDashboardProps = {
  projectsData: ProjectData[];
  monthlyData: MonthlyData[];
  exchangeRates: ExchangeRate[];
};

type DisplayCurrency = 'USD' | 'PROJECT';

const currencySymbols = { USD: '$', INR: '₹' };

export default function ProfitabilityDashboard({ projectsData, monthlyData, exchangeRates }: ProfitabilityDashboardProps) {
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>('USD');

  const getRate = (from?: 'USD' | 'INR', to?: 'USD' | 'INR') => {
    if (!from || !to || from === to) return 1.0;
    return exchangeRates.find(r => r.from_currency === from && r.to_currency === to)?.rate || 1.0;
  };

  const projectMetrics = useMemo(() => {
    return projectsData.map(p => {
      const revenue = p.invoices.reduce((sum, inv) => (inv.status === 'paid' || inv.status === 'sent' ? sum + inv.amount : sum), 0);
      const cost = p.kanban_cards.reduce((cardSum, card) => cardSum + (card.time_logs.reduce((logSum, log) => logSum + (log.cost || 0), 0)), 0);
      
      const targetCurrency = displayCurrency === 'USD' ? 'USD' : p.currency;
      const rate = getRate(p.currency, targetCurrency);
      
      const convertedRevenue = revenue * rate;
      const convertedCost = cost * rate;

      const margin = convertedRevenue > 0 ? ((convertedRevenue - convertedCost) / convertedRevenue) * 100 : 0;
      const isTrendingToLoss = convertedCost > 0 && convertedRevenue > 0 && (convertedCost / convertedRevenue) > 0.8;
      
      return { id: p.id, name: p.name, revenue: convertedRevenue, cost: convertedCost, margin, isTrendingToLoss, currency: targetCurrency };
    });
  }, [projectsData, displayCurrency, exchangeRates]);

  const taskMetrics = useMemo(() => {
    return projectsData.flatMap(p => 
      p.kanban_cards.map(card => {
        const consumed_hours = card.time_logs.reduce((sum, log) => sum + ((log.duration_minutes || 0) / 60), 0);
        const budgeted = card.budgeted_hours || 0;
        const burn = budgeted > 0 ? (consumed_hours / budgeted) * 100 : 0;
        return { projectId: p.id, projectName: p.name, taskId: card.id, taskTitle: card.title, budgeted_hours: budgeted, consumed_hours, burn };
      })
    ).filter(t => t.budgeted_hours > 0);
  }, [projectsData]);

  const keyMetrics = useMemo(() => {
    const totalRevenue = projectMetrics.reduce((sum, p) => sum + p.revenue, 0);
    const totalCost = projectMetrics.reduce((sum, p) => sum + p.cost, 0);
    const overallMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
    return { totalRevenue, totalCost, overallMargin };
  }, [projectMetrics]);
  
  const projectsTrendingToLoss = projectMetrics.filter(p => p.isTrendingToLoss);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <select value={displayCurrency} onChange={e => setDisplayCurrency(e.target.value as DisplayCurrency)} className="p-2 border rounded-md">
            <option value="USD">View in USD (Normalized)</option>
            <option value="PROJECT">View in Project Currency</option>
        </select>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg shadow"><h3 className="text-sm font-medium text-gray-500">Total Revenue (USD)</h3><p className="mt-1 text-3xl font-semibold">${keyMetrics.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p></div>
            <div className="p-4 bg-white rounded-lg shadow"><h3 className="text-sm font-medium text-gray-500">Total Cost (USD)</h3><p className="mt-1 text-3xl font-semibold">${keyMetrics.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p></div>
            <div className="p-4 bg-white rounded-lg shadow"><h3 className="text-sm font-medium text-gray-500">Overall Profit Margin</h3><p className={`mt-1 text-3xl font-semibold ${keyMetrics.overallMargin < 20 ? 'text-red-600' : 'text-green-600'}`}>{keyMetrics.overallMargin.toFixed(1)}%</p></div>
        </div>

        {projectsTrendingToLoss.length > 0 && <div className="p-4 bg-red-50 rounded-lg shadow"><h3 className="text-lg font-semibold text-red-800">Projects Trending Toward Loss</h3><ul className="mt-2 list-disc list-inside">{projectsTrendingToLoss.map(p => <li key={p.id}>{p.name}</li>)}</ul></div>}
        
        <div className="p-4 bg-white rounded-lg shadow h-96"><h3 className="text-lg font-semibold">Monthly Overview (USD)</h3><ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} /><Legend /><Bar dataKey="total_revenue" fill="#82ca9d" name="Revenue" /><Bar dataKey="total_cost" fill="#8884d8" name="Cost" /></BarChart></ResponsiveContainer></div>

        <div className="p-4 bg-white rounded-lg shadow"><h3 className="text-lg font-semibold">Project-Level Profitability</h3><table className="min-w-full divide-y divide-gray-200 mt-4"><thead><tr><th>Project</th><th>Revenue</th><th>Cost</th><th>Margin</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{projectMetrics.map(p => (<tr key={p.id}>
            <td className="px-6 py-4">{p.name}</td>
            <td className="px-6 py-4">{currencySymbols[p.currency]}{p.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            <td className="px-6 py-4">{currencySymbols[p.currency]}{p.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
            <td className={`px-6 py-4 ${p.margin < 20 ? 'text-red-600' : 'text-green-600'}`}>{p.margin.toFixed(1)}%</td>
        </tr>))}</tbody></table></div>

        <div className="p-4 bg-white rounded-lg shadow"><h3 className="text-lg font-semibold">Task-Level Effort Burn</h3><table className="min-w-full divide-y divide-gray-200 mt-4"><thead><tr><th>Task</th><th>Budgeted Hours</th><th>Consumed Hours</th><th>Burn</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{taskMetrics.map(t => (<tr key={t.taskId}>
            <td className="px-6 py-4">{t.projectName} - {t.taskTitle}</td>
            <td className="px-6 py-4">{t.budgeted_hours.toFixed(2)}</td>
            <td className="px-6 py-4">{t.consumed_hours.toFixed(2)}</td>
            <td className="px-6 py-4"><div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(t.burn, 100)}%` }}></div></div></td>
        </tr>))}</tbody></table></div>
    </div>
  );
}
