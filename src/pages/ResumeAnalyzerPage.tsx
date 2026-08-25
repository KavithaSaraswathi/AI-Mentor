import React, { useState } from 'react';
import { ResumeAnalysisRecord } from '../types';
import { AiService } from '../services/aiService';
import { StorageService } from '../services/storageService';
import {
  FileCheck,
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
  FileText
} from 'lucide-react';

export const ResumeAnalyzerPage: React.FC = () => {
  const [targetRole, setTargetRole] = useState<string>('Machine Learning Intern');
  const [resumeText, setResumeText] = useState<string>(
    `Student Developer Resume
Target Role: Machine Learning Intern

EDUCATION
B.Tech in Computer Science, State University (2022 - 2026) - CGPA: 8.7

TECHNICAL SKILLS
Languages: Java, Python, SQL, HTML/CSS
Tools & Frameworks: Pandas, NumPy, Git, VSCode, Jupyter Notebooks, LeetCode
Concepts: Data Structures & Algorithms, Object-Oriented Programming, Operating Systems, DBMS

PROJECTS
1. Automated CSV Data Analyzer
- Developed Python script using Pandas and Matplotlib to automate dataset summary generation.
- Handled null value imputation and generated distribution charts.

2. Java Placement Assistant App
- Built React and TypeScript web app to track Java DSA, aptitude, and daily progress.
- Implemented LocalStorage fallback for offline usage.`
  );

  const [analysis, setAnalysis] = useState<ResumeAnalysisRecord | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setResumeText(content);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const result = AiService.analyzeResume(resumeText, targetRole);
      setAnalysis(result);
      StorageService.addResumeAnalysis(result);
      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl border border-blue-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-300 font-semibold text-xs uppercase tracking-wider">
            <FileCheck size={16} />
            <span>Target Role Resume Analyzer</span>
          </div>
          <h1 className="text-2xl font-extrabold">ATS Resume Evaluator</h1>
          <p className="text-xs text-blue-200">
            Compare your resume skills against target job roles and receive actionable improvement suggestions.
          </p>
        </div>

        {/* Role Selector */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-blue-300 uppercase">Target Role</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-blue-700 bg-slate-800 text-white shadow-inner cursor-pointer"
          >
            <option value="Machine Learning Intern">Machine Learning Intern</option>
            <option value="AI/ML Engineer">AI/ML Engineer</option>
            <option value="GenAI Engineer">GenAI Engineer</option>
            <option value="Java Developer">Java Developer</option>
            <option value="Software Developer">Software Developer</option>
            <option value="Data Analyst">Data Analyst</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText size={18} className="text-brand-500" />
                <span>Resume Content</span>
              </h3>
              <label className="cursor-pointer px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1">
                <Upload size={14} />
                <span>Upload TXT/PDF</span>
                <input type="file" accept=".txt,.pdf" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <textarea
              rows={14}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full p-3.5 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 leading-relaxed"
            />

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles size={16} />
              <span>{isAnalyzing ? 'Analyzing Resume...' : 'Analyze Resume for Target Role'}</span>
            </button>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {analysis ? (
            <div className="space-y-6">
              {/* ATS Score Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Match Score</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Role: {analysis.targetRole}</h3>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-md text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                    <AlertTriangle size={12} />
                    <span>ATS-style estimate, not an official ATS score</span>
                  </div>
                </div>

                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex flex-col items-center justify-center shadow-lg self-center sm:self-auto">
                  <span className="text-3xl font-extrabold">{analysis.score}</span>
                  <span className="text-[10px] text-brand-100 font-semibold">/ 100 Score</span>
                </div>
              </div>

              {/* Match Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                  <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 size={16} />
                    <span>Strong Matches</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-800 dark:text-emerald-300">
                    {analysis.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span>•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50/70 dark:bg-red-950/30 p-5 rounded-2xl border border-red-200 dark:border-red-900/50 space-y-3">
                  <h4 className="font-bold text-sm text-red-900 dark:text-red-300 flex items-center gap-1.5">
                    <XCircle size={16} />
                    <span>Missing / Weak Skills</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-red-800 dark:text-red-300">
                    {analysis.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span>•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-brand-500" />
                  <span>Actionable Improvement Suggestions</span>
                </h3>

                <div className="space-y-3">
                  {analysis.suggestions.map((sug, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-200 dark:border-slate-700 text-center space-y-3 shadow-sm">
              <Award size={36} className="text-brand-500 mx-auto opacity-80" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ready for Resume Evaluation</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Paste your resume text or upload a file on the left, choose your target placement role, and click "Analyze Resume" to view your ATS score and keyword gap analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
