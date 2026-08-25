import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { Map, ArrowDown, CheckCircle, Clock, Circle, AlertCircle } from 'lucide-react';
import { TopicStatus } from '../types';

export const RoadmapsPage: React.FC = () => {
  const [activeRoadmap, setActiveRoadmap] = useState<'aiml' | 'placement'>('aiml');

  const javaTopics = StorageService.getJavaTopics();
  const dsaTopics = StorageService.getDsaTopics();
  const aimlTopics = StorageService.getAiMlTopics();
  const csTopics = StorageService.getCsFundamentals();
  const aptitudeTopics = StorageService.getAptitudeTopics();
  const problems = StorageService.getProblems();
  const projects = StorageService.getProjects();
  const resumeAnalyses = StorageService.getResumeAnalyses();

  // Helper function to calculate aggregated stage status from list of topics
  const getSubSectionStatus = (topicsList: typeof javaTopics, subSectionName: string): TopicStatus => {
    const section = topicsList.filter((t) => t.subSection === subSectionName);
    if (section.length === 0) return 'Not Started';

    const completed = section.filter((t) => t.status === 'Completed').length;
    const learning = section.filter((t) => t.status === 'Learning').length;
    const revision = section.filter((t) => t.status === 'Needs Revision').length;

    if (completed === section.length) return 'Completed';
    if (learning > 0) return 'Learning';
    if (revision > 0) return 'Needs Revision';
    return 'Not Started';
  };

  // Dynamic AI/ML Roadmap Progression Nodes derived from live storage
  const aimlSequence = [
    { name: 'Python Foundation', status: getSubSectionStatus(aimlTopics, 'Python Foundation') },
    { name: 'Machine Learning', status: getSubSectionStatus(aimlTopics, 'Machine Learning') },
    { name: 'Deep Learning', status: getSubSectionStatus(aimlTopics, 'Deep Learning') },
    { name: 'Generative AI', status: getSubSectionStatus(aimlTopics, 'Generative AI') },
    { name: 'Agentic AI', status: getSubSectionStatus(aimlTopics, 'Agentic AI') },
    { name: 'AI Automation', status: getSubSectionStatus(aimlTopics, 'AI Automation') },
    { name: 'Advanced Agentic AI', status: getSubSectionStatus(aimlTopics, 'Advanced Agentic AI') },
  ];

  // Helper for Placement nodes
  const getPlacementNodeStatus = (key: string): TopicStatus => {
    switch (key) {
      case 'java':
        return getSubSectionStatus(javaTopics, 'Java Basics');
      case 'oop':
        return getSubSectionStatus(javaTopics, 'OOP');
      case 'dsa': {
        const comp = dsaTopics.filter((t) => t.status === 'Completed').length;
        const learn = dsaTopics.filter((t) => t.status === 'Learning').length;
        if (comp === dsaTopics.length && dsaTopics.length > 0) return 'Completed';
        if (learn > 0 || comp > 0) return 'Learning';
        return 'Not Started';
      }
      case 'leetcode': {
        const solved = problems.filter((p) => p.status === 'Solved').length;
        if (solved >= 20) return 'Completed';
        if (solved > 0) return 'Learning';
        return 'Not Started';
      }
      case 'aptitude': {
        const attempted = aptitudeTopics.reduce((acc, a) => acc + a.questionsAttempted, 0);
        if (attempted > 50) return 'Completed';
        if (attempted > 0) return 'Learning';
        return 'Not Started';
      }
      case 'cs': {
        const comp = csTopics.filter((t) => t.status === 'Completed').length;
        const learn = csTopics.filter((t) => t.status === 'Learning').length;
        if (comp === csTopics.length && csTopics.length > 0) return 'Completed';
        if (learn > 0 || comp > 0) return 'Learning';
        return 'Not Started';
      }
      case 'projects': {
        const comp = projects.filter((p) => p.status === 'Completed' || p.status === 'Deployed').length;
        if (comp >= 2) return 'Completed';
        if (projects.length > 0) return 'Learning';
        return 'Not Started';
      }
      case 'resume': {
        if (resumeAnalyses.length > 0) return 'Completed';
        return 'Not Started';
      }
      default:
        return 'Not Started';
    }
  };

  // Dynamic Placement Sequence Nodes
  const placementSequence = [
    { name: 'Java Fundamentals', status: getPlacementNodeStatus('java') },
    { name: 'Object-Oriented Programming (OOP)', status: getPlacementNodeStatus('oop') },
    { name: 'Data Structures & Algorithms (DSA)', status: getPlacementNodeStatus('dsa') },
    { name: 'LeetCode Problem Practice', status: getPlacementNodeStatus('leetcode') },
    { name: 'Quantitative & Logical Aptitude', status: getPlacementNodeStatus('aptitude') },
    { name: 'CS Fundamentals (DBMS, OS, CN)', status: getPlacementNodeStatus('cs') },
    { name: 'Technical Portfolio Projects', status: getPlacementNodeStatus('projects') },
    { name: 'ATS Resume Optimization', status: getPlacementNodeStatus('resume') },
  ];

  const currentSequence = activeRoadmap === 'aiml' ? aimlSequence : placementSequence;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-xs uppercase tracking-wider">
            <Map size={16} />
            <span>Visual Flowchart Roadmaps</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Learning Step Progression</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dynamic flowchart synced in real-time with your actual topic progress.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveRoadmap('aiml')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeRoadmap === 'aiml'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            AI / ML Roadmap
          </button>
          <button
            onClick={() => setActiveRoadmap('placement')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeRoadmap === 'placement'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Placement Roadmap
          </button>
        </div>
      </div>

      {/* Visual Timeline Flowchart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-xl mx-auto flex flex-col items-center space-y-3">
          {currentSequence.map((node, idx) => {
            const isCompleted = node.status === 'Completed';
            const isInProgress = (node.status as string) === 'Learning' || (node.status as string) === 'In Progress';
            const isRevision = node.status === 'Needs Revision';

            return (
              <React.Fragment key={idx}>
                {/* Node Box */}
                <div
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : isInProgress
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                      : isRevision
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                      : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center bg-white/60 dark:bg-black/30">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm">{node.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {isCompleted ? (
                      <>
                        <CheckCircle size={16} className="text-emerald-600" />
                        <span>Completed</span>
                      </>
                    ) : isInProgress ? (
                      <>
                        <Clock size={16} className="text-blue-600" />
                        <span>In Progress</span>
                      </>
                    ) : isRevision ? (
                      <>
                        <AlertCircle size={16} className="text-amber-600" />
                        <span>Needs Revision</span>
                      </>
                    ) : (
                      <>
                        <Circle size={16} className="text-slate-400" />
                        <span>Not Started</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Connecting Arrow */}
                {idx < currentSequence.length - 1 && (
                  <div className="py-1 text-slate-300 dark:text-slate-600">
                    <ArrowDown size={20} className="animate-bounce" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
