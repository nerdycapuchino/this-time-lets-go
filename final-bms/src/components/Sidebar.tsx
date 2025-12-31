'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavSection {
  label: string;
  items: Array<{
    name: string;
    href: string;
    icon: string;
  }>;
}

const navigationSections: NavSection[] = [
  {
    label: 'CORE',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: '📊' },
      { name: 'CRM', href: '/crm', icon: '👥' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { name: 'Projects', href: '/projects', icon: '📋' },
      { name: 'Sales & POS', href: '/pos', icon: '🛒' },
      { name: 'ERP', href: '/erp', icon: '⚙️' },
    ],
  },
  {
    label: 'FINANCE & HR',
    items: [
      { name: 'Finance', href: '/finance', icon: '💰' },
      { name: 'HR', href: '/hr', icon: '👔' },
    ],
  },
  {
    label: 'INTEGRATIONS',
    items: [
      { name: 'Website Sync', href: '/website-sync', icon: '🔗' },
      { name: 'Reports', href: '/reports', icon: '📈' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { name: 'Settings', href: '/settings', icon: '⚙️' },
    ],
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-72'
      } bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col h-screen`}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-sm font-semibold text-slate-100 tracking-wider">STUDIOBMS</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-800 rounded transition text-slate-400 hover:text-slate-200"
          title="Toggle sidebar"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-8 space-y-8">
        {navigationSections.map((section) => (
          <div key={section.label}>
            {!isCollapsed && (
              <h2 className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                {section.label}
              </h2>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors duration-200"
                  title={item.name}
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="text-sm font-normal">{item.name}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        {!isCollapsed ? (
          <p className="text-xs text-slate-600 text-center">© 2024 StudioBMS</p>
        ) : (
          <p className="text-xs text-slate-600 text-center">v1</p>
        )}
      </div>
    </aside>
  );
}
