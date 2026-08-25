import React, { useState } from 'react';
import { Topic, Problem, TopicStatus, ProblemDifficulty, ProblemStatus } from '../types';
import { StorageService } from '../services/storageService';
import { ProgressBar } from '../components/ProgressBar';
import { StatusBadge } from '../components/StatusBadge';
import {
  Code2,
  ExternalLink,
  Plus,
  Filter,
  CheckCircle2,
  BookOpen,
  Edit2,
  Trash2,
  Search,
  ChevronDown
} from 'lucide-react';

interface JavaDsaPageProps {
  onRefreshData: () => void;
}

export const JavaDsaPage: React.FC<JavaDsaPageProps> = ({ onRefreshData }) => {
  const [activeTab, setActiveTab] = useState<'java' | 'dsa' | 'problems'>('java');

  const javaTopics = StorageService.getJavaTopics();
  const dsaTopics = StorageService.getDsaTopics();
  const problems = StorageService.getProblems();

  // Filters for Problem Tracker
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Problem Modal state
  const [showAddProblemModal, setShowAddProblemModal] = useState(false);
  const [newProbName, setNewProbName] = useState('');
  const [newProbPlatform, setNewProbPlatform] = useState<Problem['platform']>('LeetCode');
  const [newProbUrl, setNewProbUrl] = useState('');
  const [newProbTopic, setNewProbTopic] = useState('Arrays');
  const [newProbPattern, setNewProbPattern] = useState('');
  const [newProbDifficulty, setNewProbDifficulty] = useState<ProblemDifficulty>('Easy');
  const [newProbStatus, setNewProbStatus] = useState<ProblemStatus>('Solved');
  const [newProbTimeTaken, setNewProbTimeTaken] = useState<number>(15);
  const [newProbApproach, setNewProbApproach] = useState('');
  const [newProbMistakes, setNewProbMistakes] = useState('');
  const [newProbNotes, setNewProbNotes] = useState('');

  // Topic Edit modal state
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const handleUpdateTopicStatus = (topic: Topic, newStatus: TopicStatus) => {
    const progress = newStatus === 'Completed' ? 100 : newStatus === 'Learning' ? 50 : newStatus === 'Needs Revision' ? 60 : 0;
    const updated: Topic = {
      ...topic,
      status: newStatus,
      progress,
      lastStudied: new Date().toISOString().split('T')[0],
      completedAt: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : topic.completedAt
    };

    if (topic.category === 'java') {
      StorageService.updateJavaTopic(updated);
    } else {
      StorageService.updateDsaTopic(updated);
    }
    onRefreshData();
  };

  const handleSaveProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProbName.trim()) return;

    const newProblem: Problem = {
      id: 'p_' + Date.now(),
      name: newProbName,
      platform: newProbPlatform,
      url: newProbUrl || 'https://leetcode.com',
      topic: newProbTopic,
      pattern: newProbPattern,
      difficulty: newProbDifficulty,
      status: newProbStatus,
      dateSolved: new Date().toISOString().split('T')[0],
      timeTakenMinutes: Number(newProbTimeTaken) || 0,
      approach: newProbApproach,
      mistakes: newProbMistakes,
      notes: newProbNotes,
      needsRevision: newProbStatus === 'Needs Revision'
    };

    StorageService.addProblem(newProblem);
    setShowAddProblemModal(false);
    setNewProbName('');
    onRefreshData();
  };

  const handleDeleteProblem = (id: string) => {
    StorageService.deleteProblem(id);
    onRefreshData();
  };

  // Filter problems
  const filteredProblems = problems.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDiff = filterDifficulty === 'All' || p.difficulty === filterDifficulty;
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchDiff && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Code2 size={16} />
            <span>Java + Data Structures & Algorithms</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Java & DSA Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track Java concepts, OOP fundamentals, DSA topic roadmaps, and LeetCode problem practice.
          </p>
        </div>

        {/* NeetCode 150 Integration Card */}
        <div className="flex items-center gap-3 p-3 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 rounded-xl">
          <div className="text-left">
            <p className="text-xs font-bold text-brand-900 dark:text-brand-200">NeetCode 150</p>
            <p className="text-[10px] text-brand-700 dark:text-brand-300">Curated DSA Practice List</p>
          </div>
          <a
            href="https://neetcode.io/roadmap"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Open Resource</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('java')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'java'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          ☕ Java Roadmap
        </button>
        <button
          onClick={() => setActiveTab('dsa')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'dsa'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          🧩 DSA Roadmap
        </button>
        <button
          onClick={() => setActiveTab('problems')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'problems'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          📝 LeetCode / Problem Tracker ({problems.length})
        </button>
      </div>

      {/* 1. JAVA ROADMAP VIEW */}
      {activeTab === 'java' && (
        <div className="space-y-6">
          {['Java Basics', 'OOP', 'Advanced Java'].map((subSec) => {
            const sectionTopics = javaTopics.filter((t) => t.subSection === subSec);

            return (
              <div key={subSec} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen size={18} className="text-amber-500" />
                    <span>{subSec}</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    {sectionTopics.filter((t) => t.status === 'Completed').length} / {sectionTopics.length} Completed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200/70 dark:border-slate-700 space-y-3 hover:border-amber-400 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{topic.name}</h4>
                        <StatusBadge status={topic.status} size="sm" />
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[32px] line-clamp-2">
                        {topic.notes || 'Click to add study notes...'}
                      </p>

                      <ProgressBar progress={topic.progress} color="amber" size="sm" />

                      <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700 text-xs">
                        <span className="text-[11px] text-slate-400">
                          {topic.lastStudied ? `Last studied: ${topic.lastStudied}` : 'Not studied yet'}
                        </span>
                        <div className="relative group">
                          <select
                            value={topic.status}
                            onChange={(e) => handleUpdateTopicStatus(topic, e.target.value as TopicStatus)}
                            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded px-2 py-0.5 text-xs font-semibold cursor-pointer"
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="Learning">Learning</option>
                            <option value="Completed">Completed</option>
                            <option value="Needs Revision">Needs Revision</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. DSA ROADMAP VIEW */}
      {activeTab === 'dsa' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dsaTopics.map((topic) => {
              const topicProblems = problems.filter(
                (p) => p.topic.toLowerCase().includes(topic.name.toLowerCase()) && p.status === 'Solved'
              );

              return (
                <div
                  key={topic.id}
                  className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">{topic.name}</h4>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                        {topicProblems.length} Problems Solved
                      </p>
                    </div>
                    <StatusBadge status={topic.status} size="sm" />
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[32px]">
                    {topic.notes}
                  </p>

                  <ProgressBar progress={topic.progress} color="amber" size="sm" />

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
                    <span className="text-[11px] text-slate-400">
                      {topic.lastStudied ? `Last practiced: ${topic.lastStudied}` : 'Not practiced yet'}
                    </span>
                    <select
                      value={topic.status}
                      onChange={(e) => handleUpdateTopicStatus(topic, e.target.value as TopicStatus)}
                      className="bg-slate-100 dark:bg-slate-700 border-none text-slate-800 dark:text-slate-200 rounded px-2 py-1 text-xs font-semibold"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="Learning">Learning</option>
                      <option value="Completed">Completed</option>
                      <option value="Needs Revision">Needs Revision</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. LEETCODE / PROBLEM TRACKER VIEW */}
      {activeTab === 'problems' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search problem name or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Statuses</option>
                <option value="Solved">Solved</option>
                <option value="Attempted">Attempted</option>
                <option value="Needs Revision">Needs Revision</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddProblemModal(true)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus size={16} />
              <span>Add Problem</span>
            </button>
          </div>

          {/* Problem List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Problem Name</th>
                    <th className="p-3.5">Platform</th>
                    <th className="p-3.5">Topic & Pattern</th>
                    <th className="p-3.5">Difficulty</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Solved Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 italic">
                        No coding problems match your filters. Click "+ Add Problem" to add one manually.
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((prob) => (
                      <tr key={prob.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                          <a
                            href={prob.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-brand-600 hover:underline flex items-center gap-1"
                          >
                            <span>{prob.name}</span>
                            <ExternalLink size={12} className="text-slate-400" />
                          </a>
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-400 font-medium">
                          {prob.platform}
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{prob.topic}</span>
                          {prob.pattern && <span className="block text-[11px] text-slate-400">{prob.pattern}</span>}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-bold ${
                              prob.difficulty === 'Easy'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : prob.difficulty === 'Medium'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <StatusBadge status={prob.status} size="sm" />
                        </td>
                        <td className="p-3.5 text-slate-500">
                          {prob.dateSolved || 'N/A'}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteProblem(prob.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete problem"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Problem Modal */}
      {showAddProblemModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add LeetCode / Coding Problem</h3>

            <form onSubmit={handleSaveProblem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Problem Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3Sum, Trapping Rain Water"
                  value={newProbName}
                  onChange={(e) => setNewProbName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Platform
                  </label>
                  <select
                    value={newProbPlatform}
                    onChange={(e) => setNewProbPlatform(e.target.value as Problem['platform'])}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="LeetCode">LeetCode</option>
                    <option value="GeeksforGeeks">GeeksforGeeks</option>
                    <option value="HackerRank">HackerRank</option>
                    <option value="CodeStudio">CodeStudio</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newProbDifficulty}
                    onChange={(e) => setNewProbDifficulty(e.target.value as ProblemDifficulty)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    placeholder="Arrays, Dynamic Programming, Graphs"
                    value={newProbTopic}
                    onChange={(e) => setNewProbTopic(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pattern
                  </label>
                  <input
                    type="text"
                    placeholder="Two Pointers, Monotonic Stack"
                    value={newProbPattern}
                    onChange={(e) => setNewProbPattern(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Problem URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/..."
                  value={newProbUrl}
                  onChange={(e) => setNewProbUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Approach & Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of solution approach or mistakes to avoid..."
                  value={newProbApproach}
                  onChange={(e) => setNewProbApproach(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProblemModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold"
                >
                  Save Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
