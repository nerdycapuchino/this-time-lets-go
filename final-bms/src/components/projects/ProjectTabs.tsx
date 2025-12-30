"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility for classnames

type Tab = {
  name: string;
  content: React.ReactNode;
};

type ProjectTabsProps = {
  tabs: Tab[];
};

export default function ProjectTabs({ tabs }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full space-y-8">
      <div className="border-b border-white/5 overflow-x-auto">
        <nav className="flex space-x-12 min-w-max pb-px" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(index)}
              className={cn(
                'whitespace-nowrap py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group',
                index === activeTab
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {tab.name}
              <div className={cn(
                'absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full transition-all duration-300 transform origin-left',
                index === activeTab ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50'
              )} />
            </button>
          ))}
        </nav>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}
