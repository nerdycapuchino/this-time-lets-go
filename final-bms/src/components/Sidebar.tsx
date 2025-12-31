'use client';

import Link from 'next/link';
import { useState } from 'react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'CRM', href: '/crm', icon: '👥' },
  { name: 'ERP', href: '/erp', icon: '⚙️' },
  { name: 'POS', href: '/pos', icon: '🛒' },
  { name: 'Projects', href: '/projects', icon: '📋' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`${
      isCollapsed ? 'w-20' : 'w-64'
    } bg-slate-900 border-r border-slate-700 transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-blue-400">StudioBMS</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-800 rounded transition"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white"
            title={item.name}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-slate-700 text-xs text-slate-500 ${
        isCollapsed ? 'text-center' : ''
      }`}>
        {!isCollapsed ? (
          <p>© 2024 StudioBMS</p>
        ) : (
          <p>v1.0</p>
        )}
      </div>
    </aside>
  );
}
