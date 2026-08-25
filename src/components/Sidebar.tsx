import React from 'react';
import {
  LayoutDashboard,
  Code2,
  Brain,
  Target,
  FileCheck,
  Bot,
  CalendarCheck,
  Bookmark,
  Map,
  Compass,
  Settings,
  X,
  Sparkles,
  BarChart3
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'java-dsa'
  | 'aiml'
  | 'placement'
  | 'resume-analyzer'
  | 'ai-mentor'
  | 'daily-progress'
  | 'analytics'
  | 'resources'
  | 'roadmaps'
  | 'explore-later'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isOpen,
  onCloseMobile
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'java-dsa', label: 'Java + DSA', icon: <Code2 size={18} /> },
    { id: 'aiml', label: 'AI / ML', icon: <Brain size={18} /> },
    { id: 'placement', label: 'Placement', icon: <Target size={18} /> },
    { id: 'resume-analyzer', label: 'Resume Analyzer', icon: <FileCheck size={18} /> },
    { id: 'ai-mentor', label: 'AI Mentor', icon: <Bot size={18} />, badge: 'AI' },
    { id: 'daily-progress', label: 'Daily Progress', icon: <CalendarCheck size={18} /> },
    { id: 'analytics', label: 'Progress Analytics', icon: <BarChart3 size={18} /> },
    { id: 'resources', label: 'Resources', icon: <Bookmark size={18} /> },
    { id: 'roadmaps', label: 'Roadmaps', icon: <Map size={18} /> },
    { id: 'explore-later', label: 'Explore Later', icon: <Compass size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Header Logo */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-base leading-none">
                AI Mentor
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Personal Learning & Prep
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-brand-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Motivation Card */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl text-xs space-y-1">
            <p className="font-semibold text-brand-300">Target Role</p>
            <p className="text-slate-300">AI/ML Engineer & Java Dev</p>
            <p className="text-[10px] text-slate-400 pt-1">« Learn → Build → Automate »</p>
          </div>
        </div>
      </aside>
    </>
  );
};
