'use client';

import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center">
      <div className="text-center space-y-8">
        {/* StudioBMS Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white tracking-tight">
            Studio<span className="text-blue-500">BMS</span>
          </h1>
          <p className="text-xl text-slate-400">
            Creative Studio Management System
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-slate-300 max-w-md mx-auto leading-relaxed">
          Manage your creative studio projects, assets, and workflows in one unified platform.
        </p>

        {/* CTA Button */}
        <div className="pt-8">
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Enter Dashboard
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-slate-500 text-sm">
        © 2024 StudioBMS. All rights reserved.
      </div>
    </div>
  );
}
