"use client";

import { Home, Folder, Users, DollarSign, ClipboardList, TrendingUp, UsersRound, Network, Warehouse, Hammer } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  // Role-based navigation will be handled by middleware
  const isManager = true; // Placeholder - actual check via middleware
  const canSeeInventory = true; // Placeholder - actual check via middleware
  const isFieldStaff = false; // Placeholder - actual check via middleware

  return (
    <div className="w-64 glass-surface m-4 rounded-3xl h-[calc(100vh-2rem)] p-6 flex flex-col fixed left-0 top-0 z-50">
      <div className="mb-12">
        <Link href="/dashboard" className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-400">
          STUDIO<span className="text-gray-900 dark:text-white">BMS</span>
        </Link>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-blue-600 transition-all group">
              <Home className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/team" className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-blue-600 transition-all group">
              <UsersRound className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Team Hub</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/leads" className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-blue-600 transition-all group">
              <Users className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Leads Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/projects" className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-blue-600 transition-all group">
              <Folder className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Projects</span>
            </Link>
          </li>
          {isManager && (
            <li>
              <Link href="/dashboard/sales/pipeline" className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-blue-600 transition-all group">
                <Network className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Sales Pipeline</span>
              </Link>
            </li>
          )}
          {canSeeInventory && (
            <>
              <li>
                <Link href="/dashboard/inventory" className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-blue-600 transition-all group">
                  <Warehouse className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Inventory</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/manufacturing" className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-blue-600 transition-all group">
                  <Hammer className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Manufacturing Hub</span>
                </Link>
              </li>
            </>
          )}
          <li>
            <Link href="/dashboard/site-logs" className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-blue-600 transition-all group">
              <ClipboardList className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Site Logs</span>
            </Link>
          </li>
          {!isFieldStaff && (
            <>
              <li>
                <Link href="/dashboard/marketing" className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-blue-600 transition-all group">
                  <TrendingUp className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Marketing ROI</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/profitability" className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-blue-600 transition-all group">
                  <DollarSign className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Profitability</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/finance/payroll" className="flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-blue-600 transition-all group">
                  <DollarSign className="mr-3 h-5 w-5 text-green-600" />
                  <span className="font-medium">Payroll</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="pt-4 border-t border-white/10">
        <div className="px-4 py-2 text-xs architectural-heading">
          Connected as
        </div>
        <div className="px-4 py-1 text-sm font-bold truncate">
          PUBLIC USER
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
