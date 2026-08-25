import React, { useState } from 'react';
import { ExploreLaterItem } from '../types';
import { StorageService } from '../services/storageService';
import { AiService } from '../services/aiService';
import { StatusBadge } from '../components/StatusBadge';
import {
  Compass,
  Plus,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface ExploreLaterPageProps {
  onRefreshData: () => void;
}

export const ExploreLaterPage: React.FC<ExploreLaterPageProps> = ({ onRefreshData }) => {
  const items = StorageService.getExploreLater();

  const [showAddModal, setShowAddModal] = useState(false);
  const [tech, setTech] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [url, setUrl] = useState('');
  const [priority, setPriority] = useState<ExploreLaterItem['priority']>('Medium');
  const [notes, setNotes] = useState('');

  // Tech evaluation result
  const [evalResult, setEvalResult] = useState<{ destination: 'roadmap' | 'explore_later'; reason: string } | null>(null);

  const handleEvaluateAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tech.trim()) return;

    // Evaluate against decision rule
    const res = AiService.evaluateTechnology(tech, description);
    setEvalResult(res);

    const newItem: ExploreLaterItem = {
      id: 'el_' + Date.now(),
      technology: tech,
      description,
      reason,
      url,
      priority,
      notes,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    StorageService.addExploreLater(newItem);
    setShowAddModal(false);
    setTech('');
    setDescription('');
    setReason('');
    setUrl('');
    onRefreshData();
  };

  const handleDelete = (id: string) => {
    StorageService.deleteExploreLater(id);
    onRefreshData();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-900 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
            <Compass size={16} />
            <span>Shiny Object Protection</span>
          </div>
          <h1 className="text-2xl font-extrabold">Explore Later Vault</h1>
          <p className="text-xs text-indigo-200">
            Prevent unnecessary technology switching. Park trending AI frameworks & tools here until your core foundation is complete.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Park Technology</span>
        </button>
      </div>

      {/* Decision Rule Philosophy Card */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl flex items-start gap-3 text-amber-900 dark:text-amber-200">
        <ShieldAlert size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-amber-950 dark:text-amber-100">
            Rule of Focus: « Does this technology directly help my current AI roadmap or active project right now? »
          </p>
          <p className="text-amber-800 dark:text-amber-300">
            If <b>YES</b> → Schedule learning session. If <b>NO</b> → Park it inside Explore Later to avoid context switching!
          </p>
        </div>
      </div>

      {/* Evaluation Result Toast */}
      {evalResult && (
        <div className="bg-brand-900 text-white p-4 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-300" />
            <span><b>AI Mentor Evaluation:</b> {evalResult.reason}</span>
          </div>
          <button onClick={() => setEvalResult(null)} className="text-brand-300 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Explore Later Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.technology}</h3>
                <StatusBadge status={item.priority} size="sm" />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {item.reason && (
                <div className="p-2.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Why I saved it:</span>
                  <p className="text-slate-600 dark:text-slate-400">{item.reason}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-400">
              <span>Added: {item.dateAdded}</span>
              <div className="flex items-center gap-2">
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-brand-600 hover:text-brand-700"
                    title="Open URL"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Park Technology for Later</h3>

            <form onSubmit={handleEvaluateAndSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technology / Framework Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LangGraph, CrewAI, AutoGen, DeepSeek-R1"
                  value={tech}
                  onChange={(e) => setTech(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What does it do?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Why I Saved It / Relevance
                </label>
                <input
                  type="text"
                  placeholder="Interesting for multi-agent workflows, but need ML foundation first"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ExploreLaterItem['priority'])}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
                >
                  Evaluate & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
