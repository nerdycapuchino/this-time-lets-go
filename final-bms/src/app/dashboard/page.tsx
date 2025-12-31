'use client';

import GlobalDashboard from './global-dashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <GlobalDashboard />
      </div>
    </div>
  );
}
