import React, { useState } from 'react';
import { DailyProgressEntry, DailyProgressAnalysis } from '../types';
import { StorageService } from '../services/storageService';
import { AiService } from '../services/aiService';
import {
  CalendarCheck,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

interface DailyProgressPageProps {
  onRefreshData: () => void;
}

export const DailyProgressPage: React.FC<DailyProgressPageProps> = ({ onRefreshData }) => {
  const dailyLogs = StorageService.getDailyLogs();

  // Form State
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<string>('AI / ML');
  const [topic, setTopic] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [problemsSolved, setProblemsSolved] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [confidence, setConfidence] = useState<DailyProgressEntry['confidence']>('high');

  // Analysis result state
  const [latestAnalysis, setLatestAnalysis] = useState<DailyProgressAnalysis | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const newLog: DailyProgressEntry = {
      id: 'dl_' + Date.now(),
      date,
      category,
      topic,
      description,
      durationMinutes: Number(durationMinutes) || 0,
      problemsSolved: Number(problemsSolved) || 0,
      notes,
      confidence
    };

    StorageService.addDailyLog(newLog);

    // Trigger rule-based analysis engine
    const analysis = AiService.analyzeDailyProgress(newLog);
    setLatestAnalysis(analysis);

    // Reset form fields except category
    setTopic('');
    setDescription('');
    setNotes('');

    onRefreshData();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
        <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl">
          <CalendarCheck size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Daily Learning Logger</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Record what you studied today and receive instant AI performance analysis & next steps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: What did you learn today? */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                What did you learn today?
              </h2>
              <p className="text-xs text-slate-500">Fill in your study session details to update your progress metrics.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Java + DSA">Java + DSA</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Placement Prep">Placement Prep</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="CS Fundamentals">CS Fundamentals</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic Studied *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pandas groupby & aggregation, Sliding Window pattern"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What I Learned / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain key concepts learned (e.g. 'groupby, filtering, handling null values with fillna')"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Study Duration (mins)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Problems Solved
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={problemsSolved}
                    onChange={(e) => setProblemsSolved(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confidence Level
                  </label>
                  <select
                    value={confidence}
                    onChange={(e) => setConfidence(e.target.value as DailyProgressEntry['confidence'])}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="great">Great 🔥</option>
                    <option value="high">High 👍</option>
                    <option value="medium">Medium 🤔</option>
                    <option value="low">Low 😟</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>Save Entry & Generate Analysis</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Section: Today's Analysis & History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Analysis Result Card */}
          {latestAnalysis ? (
            <div className="bg-gradient-to-br from-slate-900 to-brand-950 text-white rounded-2xl p-6 border border-brand-800 shadow-lg space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-800/80 pb-3">
                <Sparkles size={20} className="text-amber-400" />
                <h3 className="text-base font-bold">Today's AI Summary Analysis</h3>
              </div>

              <div className="p-3 bg-white/10 rounded-xl space-y-1 text-xs">
                <p className="text-slate-300 font-medium">Session Summary:</p>
                <p className="text-sm font-bold text-brand-300">
                  Studied {Math.floor(latestAnalysis.totalDurationMinutes / 60)}h {latestAnalysis.totalDurationMinutes % 60}m | {latestAnalysis.problemsSolvedToday} Problems Solved
                </p>
              </div>

              <div className="space-y-3 pt-1 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Award size={14} />
                    <span>Strength</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed bg-white/5 p-2.5 rounded-lg border border-emerald-500/20">
                    "{latestAnalysis.strength}"
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    <span>Weakness / Watch Out</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed bg-white/5 p-2.5 rounded-lg border border-amber-500/20">
                    "{latestAnalysis.weakness}"
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-brand-400 flex items-center gap-1.5">
                    <TrendingUp size={14} />
                    <span>Suggested Next Step</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed bg-white/5 p-2.5 rounded-lg border border-brand-500/20">
                    "{latestAnalysis.suggestedNextStep}"
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-center space-y-2">
              <Sparkles size={24} className="text-brand-500 mx-auto opacity-70" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Daily Analysis Engine Ready</h3>
              <p className="text-xs text-slate-500">
                Log today's study topic on the left form to view instant strengths, weaknesses, and next step suggestions.
              </p>
            </div>
          )}

          {/* Previous Logs History */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Daily Logs</h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {dailyLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200/60 dark:border-slate-700 space-y-1.5">
                  <div className="flex justify-between items-start text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{log.topic}</span>
                    <span className="text-[10px] text-slate-400">{log.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{log.description}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                    <span>Category: {log.category}</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400">{log.durationMinutes} mins</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
