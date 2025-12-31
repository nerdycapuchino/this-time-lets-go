'use client';

interface KPI {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
}

export default function GlobalDashboard() {
  const kpis: KPI[] = [
    {
      label: 'Revenue Today',
      value: 12450,
      unit: '$',
      trend: 'up',
      change: '+12% vs yesterday',
    },
    {
      label: 'Active Leads',
      value: 48,
      trend: 'up',
      change: '+5 new leads',
    },
    {
      label: 'Active Projects',
      value: 23,
      trend: 'neutral',
      change: '3 at risk',
    },
    {
      label: 'Inventory Alerts',
      value: 7,
      trend: 'down',
      change: '2 critical',
    },
    {
      label: 'Outstanding Invoices',
      value: 15,
      unit: '$',
      trend: 'down',
      change: '85,320 pending',
    },
    {
      label: 'System Health',
      value: '98%',
      trend: 'up',
      change: 'All systems operational',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Mission Control</h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time business intelligence at a glance
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-slate-900 border border-slate-800 rounded p-6 hover:border-slate-700 transition-colors"
          >
            {/* Label */}
            <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
              {kpi.label}
            </p>

            {/* Value */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-100">
                {kpi.unit}
                {kpi.value}
              </span>
            </div>

            {/* Trend & Change */}
            <div className="mt-4 flex items-center justify-between">
              <span
                className={`text-xs font-semibold uppercase tracking-wide ${
                  kpi.trend === 'up'
                    ? 'text-emerald-500'
                    : kpi.trend === 'down'
                    ? 'text-red-500'
                    : 'text-slate-500'
                }`}
              >
                {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'}{' '}
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded p-6">
        <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'New Lead', action: '/crm?new' },
            { label: 'New Invoice', action: '/finance?new' },
            { label: 'New Project', action: '/projects?new' },
            { label: 'Inventory Check', action: '/erp?inventory' },
          ].map((action) => (
            <a
              key={action.label}
              href={action.action}
              className="px-4 py-3 bg-slate-800 text-slate-300 text-sm font-medium rounded hover:bg-slate-700 transition-colors text-center"
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
