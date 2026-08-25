import React from 'react';
import { StorageService } from '../services/storageService';
import { ProgressBar } from '../components/ProgressBar';
import { BarChart3, Clock, CheckCircle2, Flame, Award, PieChart } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const profile = StorageService.getProfile();
  const javaTopics = StorageService.getJavaTopics();
  const dsaTopics = StorageService.getDsaTopics();
  const aimlTopics = StorageService.getAiMlTopics();
  const problems = StorageService.getProblems();
  const dailyLogs = StorageService.getDailyLogs();

  // Calculations
  const totalStudyMinutes = dailyLogs.reduce((acc, l) => acc + l.durationMinutes, 0);
  const totalHours = Math.floor(totalStudyMinutes / 60);

  const solvedProblems = problems.filter((p) => p.status === 'Solved');
  const easyCount = solvedProblems.filter((p) => p.difficulty === 'Easy').length;
  const mediumCount = solvedProblems.filter((p) => p.difficulty === 'Medium').length;
  const hardCount = solvedProblems.filter((p) => p.difficulty === 'Hard').length;

  const totalJavaCompleted = javaTopics.filter((t) => t.status === 'Completed').length;
  const javaPercent = Math.round((totalJavaCompleted / javaTopics.length) * 100);

  const totalDsaCompleted = dsaTopics.filter((t) => t.status === 'Completed').length;
  const dsaPercent = Math.round((totalDsaCompleted / dsaTopics.length) * 100);

  const totalAimlCompleted = aimlTopics.filter((t) => t.status === 'Completed').length;
  const aimlPercent = Math.round((totalAimlCompleted / aimlTopics.length) * 100);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
        <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl">
          <BarChart3 size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Progress Analytics</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Overview of study duration, DSA problem breakdown, and curriculum completion rates.
          </p>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span className="font-semibold">Total Study Time</span>
            <Clock size={16} className="text-brand-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalHours}h {totalStudyMinutes % 60}m</p>
          <p className="text-[11px] text-slate-400">Across all categories logged</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span className="font-semibold">Problems Solved</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{solvedProblems.length}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">LeetCode & DSA</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span className="font-semibold">Active Streak</span>
            <Flame size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{profile.streakDays} Days</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400">Daily learning streak</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span className="font-semibold">Target Placement Role</span>
            <Award size={16} className="text-purple-500" />
          </div>
          <p className="text-base font-extrabold text-slate-900 dark:text-white truncate">{profile.currentRoleTarget}</p>
          <p className="text-[11px] text-purple-600 dark:text-purple-400">Target Role Focus</p>
        </div>
      </div>

      {/* Category Wise Completion Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart size={18} className="text-brand-500" />
            <span>Curriculum Completion Rates</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">☕ Java Curriculum</span>
                <span className="text-amber-600 dark:text-amber-400">{javaPercent}%</span>
              </div>
              <ProgressBar progress={javaPercent} color="amber" size="md" showLabel={false} />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">🧩 DSA Roadmap Topics</span>
                <span className="text-brand-600 dark:text-brand-400">{dsaPercent}%</span>
              </div>
              <ProgressBar progress={dsaPercent} color="brand" size="md" showLabel={false} />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">🤖 AI / ML to Agentic AI</span>
                <span className="text-purple-600 dark:text-purple-400">{aimlPercent}%</span>
              </div>
              <ProgressBar progress={aimlPercent} color="purple" size="md" showLabel={false} />
            </div>
          </div>
        </div>

        {/* Problem Difficulty Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Coding Difficulty Distribution</h3>

          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex justify-between items-center border border-emerald-200/50">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Easy Problems</span>
              <span className="text-lg font-extrabold text-emerald-800 dark:text-emerald-300">{easyCount} solved</span>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl flex justify-between items-center border border-amber-200/50">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Medium Problems</span>
              <span className="text-lg font-extrabold text-amber-800 dark:text-amber-300">{mediumCount} solved</span>
            </div>

            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl flex justify-between items-center border border-red-200/50">
              <span className="text-xs font-bold text-red-800 dark:text-red-300">Hard Problems</span>
              <span className="text-lg font-extrabold text-red-800 dark:text-red-300">{hardCount} solved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
