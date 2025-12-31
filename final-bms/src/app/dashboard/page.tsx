'use client';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back to StudioBMS</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors">
            <h2 className="text-xl font-semibold text-white mb-4">Projects</h2>
            <p className="text-slate-400 mb-4">Manage your creative projects</p>
            <button className="text-blue-500 hover:text-blue-400">View All →</button>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors">
            <h2 className="text-xl font-semibold text-white mb-4">Assets</h2>
            <p className="text-slate-400 mb-4">Organize your creative assets</p>
            <button className="text-blue-500 hover:text-blue-400">View All →</button>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors">
            <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
            <p className="text-slate-400 mb-4">Configure your workspace</p>
            <button className="text-blue-500 hover:text-blue-400">Go to Settings →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
