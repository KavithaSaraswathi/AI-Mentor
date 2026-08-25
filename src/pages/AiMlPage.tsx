import React, { useState } from 'react';
import { Topic, ProjectItem, TopicStatus, ProjectStatus } from '../types';
import { StorageService } from '../services/storageService';
import { ProgressBar } from '../components/ProgressBar';
import { StatusBadge } from '../components/StatusBadge';
import {
  Brain,
  Sparkles,
  Github,
  ExternalLink,
  Plus,
  BookOpen,
  FolderGit2,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface AiMlPageProps {
  onRefreshData: () => void;
}

export const AiMlPage: React.FC<AiMlPageProps> = ({ onRefreshData }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'projects'>('roadmap');

  const aimlTopics = StorageService.getAiMlTopics();
  const projects = StorageService.getProjects();

  // Add Project Modal state
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [projName, setProjName] = useState('');
  const [projCategory, setProjCategory] = useState<ProjectItem['category']>('GenAI');
  const [projDescription, setProjDescription] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projStatus, setProjStatus] = useState<ProjectStatus>('In Progress');
  const [projGithub, setProjGithub] = useState('');
  const [projDemo, setProjDemo] = useState('');
  const [projLearned, setProjLearned] = useState('');
  const [projProblems, setProjProblems] = useState('');

  const stages = [
    'Python Foundation',
    'Machine Learning',
    'Deep Learning',
    'Generative AI',
    'Agentic AI',
    'AI Automation',
    'Advanced Agentic AI'
  ];

  const handleUpdateStatus = (topic: Topic, newStatus: TopicStatus) => {
    const progress = newStatus === 'Completed' ? 100 : newStatus === 'Learning' ? 50 : newStatus === 'Needs Revision' ? 60 : 0;
    const updated: Topic = {
      ...topic,
      status: newStatus,
      progress,
      lastStudied: new Date().toISOString().split('T')[0]
    };
    StorageService.updateAiMlTopic(updated);
    onRefreshData();
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    const newProject: ProjectItem = {
      id: 'proj_' + Date.now(),
      name: projName,
      category: projCategory,
      description: projDescription,
      technologies: projTech.split(',').map(t => t.trim()).filter(Boolean),
      status: projStatus,
      githubUrl: projGithub || 'https://github.com',
      demoUrl: projDemo,
      whatLearned: projLearned,
      problemsFaced: projProblems
    };

    StorageService.addProject(newProject);
    setShowAddProjectModal(false);
    setProjName('');
    onRefreshData();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl border border-purple-800/40 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs uppercase tracking-wider">
            <Brain size={16} />
            <span>AI / ML Learning Mentor Curriculum</span>
          </div>
          <h1 className="text-2xl font-extrabold">AI / ML to Agentic AI Roadmap</h1>
          <p className="text-xs text-purple-200">
            Structured 7-stage learning path from Python foundation to production Multi-Agent AI systems.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'roadmap'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-purple-200'
            }`}
          >
            Structured Roadmap
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'projects'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-purple-200'
            }`}
          >
            AI/ML Project Tracker ({projects.length})
          </button>
        </div>
      </div>

      {/* 1. STRUCTURED 7-STAGE ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-8">
          {stages.map((stageName, stageIdx) => {
            const stageTopics = aimlTopics.filter((t) => t.subSection === stageName);
            const completedCount = stageTopics.filter((t) => t.status === 'Completed').length;

            return (
              <div key={stageName} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                      0{stageIdx + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{stageName}</h3>
                      <p className="text-[11px] text-slate-400">Progression Stage {stageIdx + 1} of 7</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2.5 py-1 rounded-full self-start sm:self-auto">
                    {completedCount} / {stageTopics.length} Completed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stageTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200/70 dark:border-slate-700 space-y-3 hover:border-purple-400 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{topic.name}</h4>
                        <StatusBadge status={topic.status} size="sm" />
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[32px] line-clamp-2">
                        {topic.notes}
                      </p>

                      <ProgressBar progress={topic.progress} color="purple" size="sm" />

                      <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700 text-xs">
                        <span className="text-[11px] text-slate-400">
                          {topic.lastStudied ? `Last studied: ${topic.lastStudied}` : 'Not studied'}
                        </span>
                        <select
                          value={topic.status}
                          onChange={(e) => handleUpdateStatus(topic, e.target.value as TopicStatus)}
                          className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded px-2 py-0.5 text-xs font-semibold cursor-pointer"
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
            );
          })}
        </div>
      )}

      {/* 2. AI/ML PROJECT TRACKER */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderGit2 size={18} className="text-purple-500" />
              <span>AI / ML & Portfolio Projects</span>
            </h3>
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus size={16} />
              <span>Add Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        {proj.category}
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{proj.name}</h4>
                    </div>
                    <StatusBadge status={proj.status} size="sm" />
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* What learned section */}
                  {proj.whatLearned && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl text-xs space-y-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-200">💡 What I Learned:</p>
                      <p className="text-slate-600 dark:text-slate-400">{proj.whatLearned}</p>
                    </div>
                  )}
                </div>

                {/* External links */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-purple-600 font-semibold"
                      >
                        <Github size={14} />
                        <span>Repository</span>
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold"
                      >
                        <ExternalLink size={14} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Record AI/ML Project</h3>

            <form onSubmit={handleSaveProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Mentor Assistant, RAG PDF Chatbot"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value as ProjectItem['category'])}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="GenAI">GenAI</option>
                    <option value="Agentic AI">Agentic AI</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Java/Backend">Java/Backend</option>
                    <option value="Full Stack">Full Stack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={projStatus}
                    onChange={(e) => setProjStatus(e.target.value as ProjectStatus)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Idea">Idea</option>
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Deployed">Deployed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technologies Used (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Python, LangChain, FastAPI, React, ChromaDB"
                  value={projTech}
                  onChange={(e) => setProjTech(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief overview of project goals and features..."
                  value={projDescription}
                  onChange={(e) => setProjDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What I Learned
                </label>
                <textarea
                  rows={2}
                  placeholder="Key concepts mastered or technical takeaways..."
                  value={projLearned}
                  onChange={(e) => setProjLearned(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
