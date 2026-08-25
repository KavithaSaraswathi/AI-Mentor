import React, { useState } from 'react';
import { ResourceItem } from '../types';
import { StorageService } from '../services/storageService';
import { StatusBadge } from '../components/StatusBadge';
import {
  Bookmark,
  ExternalLink,
  Plus,
  Trash2,
  Search
} from 'lucide-react';

interface ResourcesPageProps {
  onRefreshData: () => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onRefreshData }) => {
  const resources = StorageService.getResources();

  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Form State
  const [resName, setResName] = useState('');
  const [resCategory, setResCategory] = useState<ResourceItem['category']>('Java');
  const [resUrl, setResUrl] = useState('');
  const [resDescription, setResDescription] = useState('');
  const [resPriority, setResPriority] = useState<ResourceItem['priority']>('High');
  const [resNotes, setResNotes] = useState('');

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName.trim() || !resUrl.trim()) return;

    const newRes: ResourceItem = {
      id: 'res_' + Date.now(),
      name: resName,
      category: resCategory,
      url: resUrl.startsWith('http') ? resUrl : `https://${resUrl}`,
      description: resDescription,
      priority: resPriority,
      notes: resNotes
    };

    StorageService.addResource(newRes);
    setShowAddModal(false);
    setResName('');
    setResUrl('');
    onRefreshData();
  };

  const handleDelete = (id: string) => {
    StorageService.deleteResource(id);
    onRefreshData();
  };

  const filteredResources = resources.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || r.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-xs uppercase tracking-wider">
            <Bookmark size={16} />
            <span>Resource Manager</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Curated External Resources</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bookmark Java, DSA, AI/ML, and Placement learning links. Opens directly in new browser tabs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Save New Resource</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search resource name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
        >
          <option value="All">All Categories</option>
          <option value="Java">Java</option>
          <option value="DSA">DSA</option>
          <option value="LeetCode">LeetCode</option>
          <option value="AI/ML">AI/ML</option>
          <option value="GenAI">GenAI</option>
          <option value="Agentic AI">Agentic AI</option>
          <option value="Aptitude">Aptitude</option>
          <option value="Placement">Placement</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    {res.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{res.name}</h3>
                </div>
                <StatusBadge status={res.priority} size="sm" />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {res.description}
              </p>

              {res.notes && (
                <div className="p-2.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl text-[11px] text-slate-500 italic">
                  Note: {res.notes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Open Resource</span>
                <ExternalLink size={14} />
              </a>

              <button
                onClick={() => handleDelete(res.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                title="Delete resource"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Save External Resource Link</h3>

            <form onSubmit={handleSaveResource} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Resource Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LangChain Documentation, GeeksforGeeks DBMS"
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value as ResourceItem['category'])}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Java">Java</option>
                    <option value="DSA">DSA</option>
                    <option value="LeetCode">LeetCode</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="GenAI">GenAI</option>
                    <option value="Agentic AI">Agentic AI</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Placement">Placement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={resPriority}
                    onChange={(e) => setResPriority(e.target.value as ResourceItem['priority'])}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Why is this resource useful?"
                  value={resDescription}
                  onChange={(e) => setResDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
