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
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(index)}
              className={cn(
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                index === activeTab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-8">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}
