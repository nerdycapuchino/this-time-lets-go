'use client';

const financialData = {
  revenue: [
    { id: 1, project: 'Website Redesign', milestone: 'Design Phase', amount: 5000, dueDate: '2025-01-15', status: 'Completed', invoiceId: 'INV-001' },
    { id: 2, project: 'App Development', milestone: 'Backend Setup', amount: 8000, dueDate: '2025-02-01', status: 'In Progress', invoiceId: 'INV-002' },
    { id: 3, project: 'Consulting', milestone: 'Monthly Retainer', amount: 3000, dueDate: '2025-01-30', status: 'Pending', invoiceId: 'INV-003' },
  ],
  expenses: [
    { id: 1, type: 'Vendor', vendor: 'AWS', amount: -1200, date: '2025-01-10', category: 'Cloud Services' },
    { id: 2, type: 'Material', vendor: 'Design Software', amount: -500, date: '2025-01-12', category: 'Software License' },
    { id: 3, type: 'Payroll', vendor: 'Employee Salary', amount: -15000, date: '2025-01-01', category: 'Salaries' },
    { id: 4, type: 'Material', vendor: 'Office Supplies', amount: -300, date: '2025-01-15', category: 'Supplies' },
  ],
};

export default function FinancePage() {
  const totalRevenue = financialData.revenue.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = Math.abs(financialData.expenses.reduce((sum, e) => sum + e.amount, 0));
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white">Finance Module</h1>
        <p className="text-slate-400 mt-2">Revenue tracking, milestone billing, expenses & profitability</p>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-green-400 mt-2">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Total Expenses</p>
          <p className="text-3xl font-bold text-red-400 mt-2">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Net Profit</p>
          <p className={`text-3xl font-bold mt-2 ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>${netProfit.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm">Profit Margin</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{profitMargin}%</p>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Revenue - Milestone Based Billing</h2>
        <div className="space-y-3">
          {financialData.revenue.map(rev => (
            <div key={rev.id} className="bg-slate-700 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{rev.project}</h3>
                  <p className="text-slate-400 text-sm mt-1">{rev.milestone} • {rev.invoiceId}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">${rev.amount.toLocaleString()}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded text-sm ${rev.status === 'Completed' ? 'bg-green-900 text-green-200' : rev.status === 'In Progress' ? 'bg-blue-900 text-blue-200' : 'bg-yellow-900 text-yellow-200'}`}>
                    {rev.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Section */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Expenses - Tracking by Category</h2>
        <div className="space-y-2">
          {financialData.expenses.map(exp => (
            <div key={exp.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
              <div>
                <p className="text-white font-medium">{exp.vendor}</p>
                <p className="text-slate-400 text-sm">{exp.type} • {exp.category}</p>
              </div>
              <p className="text-red-400 font-bold">${Math.abs(exp.amount).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Expense Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Cloud Services', 'Software License', 'Salaries', 'Supplies'].map(cat => {
            const amount = Math.abs(financialData.expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0));
            const percent = ((amount / totalExpenses) * 100).toFixed(0);
            return (
              <div key={cat} className="bg-slate-700 p-4 rounded-lg">
                <p className="text-white font-medium mb-2">{cat}</p>
                <p className="text-2xl font-bold text-white">${amount.toLocaleString()}</p>
                <div className="mt-3 bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{width: `${percent}%`}} />
                </div>
                <p className="text-slate-400 text-sm mt-2">{percent}% of total</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
