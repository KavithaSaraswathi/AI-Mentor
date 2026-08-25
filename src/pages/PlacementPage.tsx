import React, { useState } from 'react';
import { AptitudeTopic, Topic, TopicStatus } from '../types';
import { StorageService } from '../services/storageService';
import { ProgressBar } from '../components/ProgressBar';
import { StatusBadge } from '../components/StatusBadge';
import {
  Target,
  Calculator,
  Server,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus
} from 'lucide-react';

interface PlacementPageProps {
  onRefreshData: () => void;
}

export const PlacementPage: React.FC<PlacementPageProps> = ({ onRefreshData }) => {
  const [activeTab, setActiveTab] = useState<'aptitude' | 'cs' | 'interview'>('aptitude');

  const aptitudeTopics = StorageService.getAptitudeTopics();
  const csTopics = StorageService.getCsFundamentals();

  // Edit Aptitude Topic modal state
  const [editingAptitude, setEditingAptitude] = useState<AptitudeTopic | null>(null);
  const [attCount, setAttCount] = useState<number>(0);
  const [solCount, setSolCount] = useState<number>(0);
  const [timeMins, setTimeMins] = useState<number>(0);

  // HR & Interview questions state stored in state
  const [hrQuestions, setHrQuestions] = useState([
    { id: 'hr-1', question: 'Tell me about yourself', status: 'Prepared', notes: 'Walked through B.Tech, Java + DSA projects, and AI interest.' },
    { id: 'hr-2', question: 'What are your key strengths & weaknesses?', status: 'Prepared', notes: 'Strength: Problem solving consistency. Weakness: Taking on too many open tasks.' },
    { id: 'hr-3', question: 'Where do you see yourself in 3-5 years?', status: 'Prepared', notes: 'Becoming a Senior AI Engineer building production systems.' },
    { id: 'hr-4', question: 'Why should we hire you?', status: 'In Progress', notes: 'Highlight strong Java DSA fundamentals + hands-on GenAI project work.' },
    { id: 'hr-5', question: 'Why this company?', status: 'Not Started', notes: '' },
    { id: 'hr-6', question: 'Describe a challenging technical problem you solved.', status: 'Prepared', notes: 'Discussed optimizing HashMap collision resolution.' }
  ]);

  const [gdTopics, setGdTopics] = useState([
    { id: 'gd-1', topic: 'Impact of Generative AI on Tech Jobs', status: 'Practiced', confidence: 'High', notes: 'Argued AI augments developers rather than replacing core logic.' },
    { id: 'gd-2', topic: 'Remote Work vs Office Work Culture', status: 'Practiced', confidence: 'Medium', notes: 'Hybrid model yields optimal focus and team bonding.' },
    { id: 'gd-3', topic: 'Ethical Implications of Autonomous AI Agents', status: 'In Progress', confidence: 'Medium', notes: 'Need to structure points on security guardrails.' }
  ]);

  const handleOpenAptitudeEdit = (apt: AptitudeTopic) => {
    setEditingAptitude(apt);
    setAttCount(apt.questionsAttempted);
    setSolCount(apt.questionsSolved);
    setTimeMins(apt.timeTakenMinutes);
  };

  const handleSaveAptitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAptitude) return;

    const acc = attCount > 0 ? Number(((solCount / attCount) * 100).toFixed(1)) : 0;

    const updated: AptitudeTopic = {
      ...editingAptitude,
      questionsAttempted: attCount,
      questionsSolved: solCount,
      accuracy: acc,
      timeTakenMinutes: timeMins,
      lastPracticed: new Date().toISOString().split('T')[0]
    };

    StorageService.updateAptitudeTopic(updated);
    setEditingAptitude(null);
    onRefreshData();
  };

  const handleUpdateCsStatus = (topic: Topic, newStatus: TopicStatus) => {
    const progress = newStatus === 'Completed' ? 100 : newStatus === 'Learning' ? 50 : newStatus === 'Needs Revision' ? 60 : 0;
    const updated: Topic = {
      ...topic,
      status: newStatus,
      progress,
      lastStudied: new Date().toISOString().split('T')[0]
    };
    StorageService.updateCsFundamentalTopic(updated);
    onRefreshData();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 rounded-2xl border border-emerald-700/40 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs uppercase tracking-wider">
            <Target size={16} />
            <span>Placement Preparation Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold">College Placement Preparation</h1>
          <p className="text-xs text-emerald-200">
            Track Quantitative Aptitude, CS Fundamentals (DBMS, OS, CN), Technical & HR Interview Questions.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('aptitude')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'aptitude'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-emerald-200'
            }`}
          >
            Aptitude Tracker
          </button>
          <button
            onClick={() => setActiveTab('cs')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'cs'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-emerald-200'
            }`}
          >
            CS Fundamentals
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'interview'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-emerald-200'
            }`}
          >
            HR & Technical Interview
          </button>
        </div>
      </div>

      {/* 1. APTITUDE TRACKER */}
      {activeTab === 'aptitude' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator size={18} className="text-emerald-500" />
              <span>Quantitative, Logical & Verbal Aptitude Topics</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Click any topic card to log practice sessions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aptitudeTopics.map((apt) => (
              <div
                key={apt.id}
                onClick={() => handleOpenAptitudeEdit(apt)}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {apt.category}
                    </span>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">{apt.name}</h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      apt.accuracy >= 80
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : apt.accuracy >= 65
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    }`}
                  >
                    {apt.accuracy}% Acc
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-700/40 p-2.5 rounded-xl text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium">Solved / Att.</span>
                    <p className="font-bold text-slate-900 dark:text-white">{apt.questionsSolved} / {apt.questionsAttempted}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium">Time Logged</span>
                    <p className="font-bold text-slate-900 dark:text-white">{apt.timeTakenMinutes} mins</p>
                  </div>
                </div>

                {apt.weakSubtopics.length > 0 && (
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    <span>Weak: {apt.weakSubtopics.join(', ')}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700">
                  <span>Last practiced: {apt.lastPracticed}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Log Session →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CS FUNDAMENTALS */}
      {activeTab === 'cs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {csTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">{topic.name}</h4>
                  <StatusBadge status={topic.status} size="sm" />
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[36px]">
                  {topic.notes}
                </p>

                <ProgressBar progress={topic.progress} color="emerald" size="sm" />

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400">
                    {topic.lastStudied ? `Revised: ${topic.lastStudied}` : 'Not studied'}
                  </span>
                  <select
                    value={topic.status}
                    onChange={(e) => handleUpdateCsStatus(topic, e.target.value as TopicStatus)}
                    className="bg-slate-100 dark:bg-slate-700 border-none text-slate-800 dark:text-slate-200 rounded px-2 py-1 text-xs font-semibold"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Learning">Learning</option>
                    <option value="Completed">Completed</option>
                    <option value="Needs Revision">Needs Revision</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. INTERVIEW PREP & GROUP DISCUSSION */}
      {activeTab === 'interview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* HR Interview Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck size={18} className="text-emerald-500" />
              <span>HR & Behavioral Interview Prep</span>
            </h3>

            <div className="space-y-3">
              {hrQuestions.map((q) => (
                <div key={q.id} className="p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200/60 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">"{q.question}"</h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded text-[10px] font-semibold">
                      {q.status}
                    </span>
                  </div>
                  {q.notes && <p className="text-xs text-slate-600 dark:text-slate-400 italic">Notes: {q.notes}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Group Discussion Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target size={18} className="text-emerald-500" />
              <span>Group Discussion (GD) Practice</span>
            </h3>

            <div className="space-y-3">
              {gdTopics.map((gd) => (
                <div key={gd.id} className="p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200/60 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{gd.topic}</h4>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded text-[10px] font-semibold">
                      {gd.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Key Points: {gd.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Log Aptitude Modal */}
      {editingAptitude && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Log Aptitude Practice: {editingAptitude.name}
            </h3>

            <form onSubmit={handleSaveAptitude} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Questions Attempted
                </label>
                <input
                  type="number"
                  min={0}
                  value={attCount}
                  onChange={(e) => setAttCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Questions Solved Correctly
                </label>
                <input
                  type="number"
                  min={0}
                  max={attCount}
                  value={solCount}
                  onChange={(e) => setSolCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Time Taken (Minutes)
                </label>
                <input
                  type="number"
                  min={0}
                  value={timeMins}
                  onChange={(e) => setTimeMins(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-center">
                <span className="text-xs text-slate-500">Calculated Accuracy</span>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {attCount > 0 ? ((solCount / attCount) * 100).toFixed(1) : 0}%
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAptitude(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  Save Practice Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
