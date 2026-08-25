import React, { useState } from 'react';
import { NavTab } from '../components/Sidebar';
import { UserProfile, Topic, Problem, DailyProgressEntry, GoalItem } from '../types';
import { StorageService } from '../services/storageService';
import { AiService } from '../services/aiService';
import { ProgressBar } from '../components/ProgressBar';
import { StatusBadge } from '../components/StatusBadge';
import {
  Code2,
  Brain,
  Target,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BarChart2,
  CheckSquare,
  Plus
} from 'lucide-react';

interface LandingDashboardProps {
  profile: UserProfile;
  onNavigate: (tab: NavTab) => void;
  onRefreshData: () => void;
}

export const LandingDashboard: React.FC<LandingDashboardProps> = ({
  profile,
  onNavigate,
  onRefreshData
}) => {
  const javaTopics = StorageService.getJavaTopics();
  const dsaTopics = StorageService.getDsaTopics();
  const aimlTopics = StorageService.getAiMlTopics();
  const problems = StorageService.getProblems();
  const dailyLogs = StorageService.getDailyLogs();
  const goals = StorageService.getGoals();

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Recommendation engine call
  const recommendation = AiService.getTodayRecommendation();

  // Active topic
  const activeAiml = aimlTopics.find(t => t.status === 'Learning');
  const activeJava = javaTopics.find(t => t.status === 'Learning');

  // Weak Areas
  const weakJava = javaTopics.filter(t => t.status === 'Needs Revision');
  const weakDsa = dsaTopics.filter(t => t.status === 'Needs Revision');
  const weakAiml = aimlTopics.filter(t => t.status === 'Needs Revision');
  const weakProblems = problems.filter(p => p.status === 'Needs Revision' || p.needsRevision);

  // Problem stats
  const solvedProblems = problems.filter(p => p.status === 'Solved');
  const easyCount = solvedProblems.filter(p => p.difficulty === 'Easy').length;
  const mediumCount = solvedProblems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = solvedProblems.filter(p => p.difficulty === 'Hard').length;

  // Study time calculation for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = dailyLogs.filter(l => l.date === todayStr);

  const getCatDuration = (catKeyword: string) => {
    return todayLogs
      .filter(l => l.category.toLowerCase().includes(catKeyword.toLowerCase()))
      .reduce((acc, l) => acc + l.durationMinutes, 0);
  };

  const javaTodayMins = getCatDuration('java') || getCatDuration('dsa');
  const aimlTodayMins = getCatDuration('ai') || getCatDuration('ml');
  const aptTodayMins = getCatDuration('aptitude') || getCatDuration('placement');

  const handleToggleGoal = (id: string, currentStatus: GoalItem['status']) => {
    const nextStatus = currentStatus === 'Completed' ? 'Active' : 'Completed';
    StorageService.updateGoalStatus(id, nextStatus);
    onRefreshData();
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    StorageService.addGoal({
      id: 'g_' + Date.now(),
      title: newGoalTitle,
      category: 'General',
      deadline: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      status: 'Active'
    });
    setNewGoalTitle('');
    setShowGoalModal(false);
    onRefreshData();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* 1. HERO BRANDING & GREETING */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide">
            <Sparkles size={14} className="text-amber-300" />
            <span>AI Mentor Platform</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            AI Mentor
          </h1>
          <p className="text-brand-100 text-sm sm:text-base max-w-2xl">
            « Your personal learning & placement companion »
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs text-brand-200">
            <span>• Java & DSA Mastery</span>
            <span>• AI/ML to Agentic AI</span>
            <span>• College Placement Prep</span>
          </div>
        </div>
      </div>

      {/* 2. THREE PRIMARY QUICK START CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Java + DSA */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl">
              ☕
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Java + DSA</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Core Java, OOP, Data Structures, Algorithms & LeetCode practice.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Java', 'OOP', 'DSA', 'LeetCode', 'Coding Interview'].map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => onNavigate('java-dsa')}
            className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Continue Learning</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Card 2: AI / ML */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xl">
              🤖
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI / ML</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Python, Data Science, Machine Learning, Deep Learning, GenAI & Agentic AI.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Python', 'Pandas', 'ML', 'GenAI', 'RAG', 'Agentic AI'].map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => onNavigate('aiml')}
            className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Continue Learning</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Card 3: Placement */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl">
              🎯
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Placement</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Aptitude, CS Fundamentals (DBMS, OS, CN), Technical & HR Interview prep.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Aptitude', 'DBMS', 'OS', 'HR Interview', 'Resume'].map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => onNavigate('placement')}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Continue Preparing</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 3. PROMINENT "WHAT SHOULD I DO TODAY?" RECOMMENDATION ENGINE CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-indigo-900/50 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-900/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-500/20 text-brand-400 rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">What Should I Do Today?</h2>
              <p className="text-xs text-slate-400">Rule-Based AI Learning & Practice Engine</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-full text-xs font-medium self-start sm:self-auto">
            Recommendation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Target size={20} className="text-amber-400" />
              <span>{recommendation.primaryTitle}</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {recommendation.reason}
            </p>
            {recommendation.secondarySuggestions.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <p className="text-xs font-semibold text-slate-400">Next Action Steps:</p>
                {recommendation.secondarySuggestions.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center items-center p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
            <div className="text-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Priority Focus</span>
              <p className="text-base font-bold text-brand-300 mt-1">{recommendation.category}</p>
            </div>
            <button
              onClick={() => onNavigate(recommendation.targetPath as NavTab)}
              className="w-full py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span>{recommendation.actionText}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. DASHBOARD METRICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Progress & Weekly Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Progress */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock size={18} className="text-brand-500" />
                <span>Today's Progress</span>
              </h3>
              <button
                onClick={() => onNavigate('daily-progress')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                + Log Progress
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Java + DSA</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {Math.floor(javaTodayMins / 60)}h {javaTodayMins % 60}m
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI / ML</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {Math.floor(aimlTodayMins / 60)}h {aimlTodayMins % 60}m
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Aptitude</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {Math.floor(aptTodayMins / 60)}h {aptTodayMins % 60}m
                </p>
              </div>
            </div>
          </div>

          {/* Current Learning Topics */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Current Learning</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">AI / ML</span>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                      {activeAiml ? activeAiml.name : 'Python Basics & Control Flow'}
                    </h4>
                  </div>
                  <StatusBadge status={activeAiml ? activeAiml.status : 'Not Started'} size="sm" />
                </div>
                <ProgressBar progress={activeAiml ? activeAiml.progress : 0} color="purple" />
                <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                  <span>{activeAiml?.lastStudied ? `Last studied: ${activeAiml.lastStudied}` : 'Not started yet'}</span>
                  <button
                    onClick={() => onNavigate('aiml')}
                    className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
                  >
                    {activeAiml ? 'Continue →' : 'Start Topic →'}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Java + DSA</span>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                      {activeJava ? activeJava.name : 'Variables & Data Types'}
                    </h4>
                  </div>
                  <StatusBadge status={activeJava ? activeJava.status : 'Not Started'} size="sm" />
                </div>
                <ProgressBar progress={activeJava ? activeJava.progress : 0} color="amber" />
                <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                  <span>{activeJava?.lastStudied ? `Last studied: ${activeJava.lastStudied}` : 'Not started yet'}</span>
                  <button
                    onClick={() => onNavigate('java-dsa')}
                    className="text-amber-600 dark:text-amber-400 font-medium hover:underline"
                  >
                    {activeJava ? 'Continue →' : 'Start Topic →'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Study Chart Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 size={18} className="text-brand-500" />
                <span>Weekly Study Time</span>
              </h3>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline"
              >
                View Analytics →
              </button>
            </div>

            <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
              {[
                { day: 'Mon', hours: 2.5 },
                { day: 'Tue', hours: 1.8 },
                { day: 'Wed', hours: 3.2 },
                { day: 'Thu', hours: 2.0 },
                { day: 'Fri', hours: 4.0 },
                { day: 'Sat', hours: 3.5 },
                { day: 'Sun', hours: 2.7 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-medium text-slate-500">{item.hours}h</span>
                  <div
                    className="w-full bg-brand-500/80 hover:bg-brand-600 rounded-t-md transition-all"
                    style={{ height: `${(item.hours / 4) * 100}%` }}
                  />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Streaks, Problems Solved, Weak Areas, Current Goals */}
        <div className="space-y-6">
          {/* Learning Streak Card */}
          <div className="bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-amber-100 uppercase tracking-wider">Consistency Tracker</span>
              <h4 className="text-2xl font-extrabold">{profile.streakDays} Day Streak</h4>
              <p className="text-xs text-amber-100">Keep learning daily to preserve your streak!</p>
            </div>
            <Flame size={48} className="text-amber-200 opacity-90" />
          </div>

          {/* Problems Solved Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Problems Solved</h3>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded">
                Total: {solvedProblems.length}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/60 dark:border-emerald-800">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">Easy</span>
                <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">{easyCount}</p>
              </div>

              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200/60 dark:border-amber-800">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">Medium</span>
                <p className="text-lg font-extrabold text-amber-700 dark:text-amber-300">{mediumCount}</p>
              </div>

              <div className="p-2.5 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200/60 dark:border-red-800">
                <span className="text-[11px] font-bold text-red-700 dark:text-red-300">Hard</span>
                <p className="text-lg font-extrabold text-red-700 dark:text-red-300">{hardCount}</p>
              </div>
            </div>
          </div>

          {/* Weak Areas Needing Revision */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              <span>Needs Revision</span>
            </h3>

            <div className="space-y-2">
              {[...weakJava, ...weakDsa, ...weakAiml].length === 0 && weakProblems.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No topics currently marked for revision.</p>
              ) : (
                <>
                  {[...weakJava, ...weakDsa, ...weakAiml].map((topic) => (
                    <div key={topic.id} className="flex justify-between items-center p-2.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{topic.name}</span>
                      <StatusBadge status="Needs Revision" size="sm" />
                    </div>
                  ))}
                  {weakProblems.map((prob) => (
                    <div key={prob.id} className="flex justify-between items-center p-2.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{prob.name} ({prob.difficulty})</span>
                      <StatusBadge status="Needs Revision" size="sm" />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Current Goals */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare size={18} className="text-brand-500" />
                <span>Current Goals</span>
              </h3>
              <button
                onClick={() => setShowGoalModal(!showGoalModal)}
                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                <Plus size={16} />
              </button>
            </div>

            {showGoalModal && (
              <form onSubmit={handleAddGoal} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New goal description..."
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </form>
            )}

            <div className="space-y-2">
              {goals.map((g) => (
                <div
                  key={g.id}
                  onClick={() => handleToggleGoal(g.id, g.status)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    g.status === 'Completed'
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={g.status === 'Completed'}
                    onChange={() => {}}
                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className={`text-xs font-medium flex-1 ${g.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {g.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
