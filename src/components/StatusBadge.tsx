import React from 'react';
import { TopicStatus, ProblemStatus, ProjectStatus } from '../types';

type BadgeStatus = TopicStatus | ProblemStatus | ProjectStatus | 'Active' | 'Completed' | 'High' | 'Medium' | 'Low';

interface StatusBadgeProps {
  status: BadgeStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let style = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  switch (status) {
    case 'Completed':
    case 'Solved':
    case 'Deployed':
      style = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      break;
    case 'Learning':
    case 'In Progress':
    case 'Attempted':
    case 'Active':
      style = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      break;
    case 'Needs Revision':
      style = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      break;
    case 'Not Started':
    case 'Not Attempted':
    case 'Idea':
    case 'Planning':
      style = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      break;
    case 'High':
      style = 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800';
      break;
    case 'Medium':
      style = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      break;
    case 'Low':
      style = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      break;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-md border ${padding} ${style}`}>
      {status}
    </span>
  );
};
