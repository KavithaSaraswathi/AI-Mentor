import React, { useState } from 'react';
import { UserProfile } from '../types';
import { StorageService } from '../services/storageService';
import { SUPABASE_SQL_SCHEMA, isSupabaseConfigured } from '../lib/supabase';
import {
  Settings as SettingsIcon,
  Database,
  Key,
  User,
  Copy,
  Check,
  RotateCcw,
  Download
} from 'lucide-react';

interface SettingsPageProps {
  profile: UserProfile;
  onRefreshData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ profile, onRefreshData }) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [roleTarget, setRoleTarget] = useState(profile.currentRoleTarget);
  const [learningStyle, setLearningStyle] = useState(profile.learningStyle);

  const [openaiKey, setOpenaiKey] = useState(localStorage.getItem('ai_mentor_openai_key') || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name,
      email,
      currentRoleTarget: roleTarget,
      learningStyle
    };
    StorageService.saveProfile(updated);

    if (openaiKey.trim()) {
      localStorage.setItem('ai_mentor_openai_key', openaiKey.trim());
    } else {
      localStorage.removeItem('ai_mentor_openai_key');
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    onRefreshData();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      profile: StorageService.getProfile(),
      javaTopics: StorageService.getJavaTopics(),
      dsaTopics: StorageService.getDsaTopics(),
      aimlTopics: StorageService.getAiMlTopics(),
      problems: StorageService.getProblems(),
      dailyLogs: StorageService.getDailyLogs(),
      resources: StorageService.getResources(),
      projects: StorageService.getProjects(),
      exploreLater: StorageService.getExploreLater(),
      aptitudeTopics: StorageService.getAptitudeTopics()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_mentor_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data back to initial seed defaults?')) {
      StorageService.resetAllData();
      onRefreshData();
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
        <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Settings & Data Preferences</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your personal profile, learning goals, Supabase backend configuration, and AI keys.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <Check size={16} />
          <span>Profile and settings updated successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Profile & Preferences */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User size={18} className="text-brand-500" />
            <span>Personal Profile & Learning Preferences</span>
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Placement Role
                </label>
                <select
                  value={roleTarget}
                  onChange={(e) => setRoleTarget(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                  <option value="Machine Learning Intern">Machine Learning Intern</option>
                  <option value="GenAI Engineer">GenAI Engineer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="Software Developer">Software Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Learning Style
                </label>
                <input
                  type="text"
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* OpenAI API Key Optional Upgrade */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Key size={14} className="text-purple-500" />
                <span>OpenAI / Live LLM API Key (Optional)</span>
              </label>
              <input
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                If omitted, AI Mentor runs on the built-in rule-based engine out-of-the-box.
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              Save Profile & Settings
            </button>
          </form>
        </div>

        {/* 2. Supabase Integration Setup */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database size={18} className="text-emerald-500" />
                <span>Supabase PostgreSQL Integration</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Status:{' '}
                <span className={`font-bold ${isSupabaseConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {isSupabaseConfigured ? 'Connected to Supabase' : 'Offline Mode (Using LocalStorage)'}
                </span>
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedSql ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copiedSql ? 'SQL Copied!' : 'Copy Supabase SQL Schema'}</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-xs text-slate-600 dark:text-slate-400 space-y-2 border border-slate-200/60 dark:border-slate-700">
            <p className="font-bold text-slate-900 dark:text-white">How to connect Supabase PostgreSQL:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Create a project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-brand-500 underline">supabase.com</a>.</li>
              <li>Go to SQL Editor, click "Copy Supabase SQL Schema" above, and run the script.</li>
              <li>Add <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> to your <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">.env</code> file.</li>
            </ol>
          </div>
        </div>

        {/* 3. Data Backup & Reset */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Data Management & Reset</h2>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportData}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Download size={16} />
              <span>Export Local Backup JSON</span>
            </button>

            <button
              onClick={handleResetData}
              className="px-4 py-2.5 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RotateCcw size={16} />
              <span>Reset All Data to Default Seed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
