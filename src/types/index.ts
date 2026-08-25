export type TopicStatus = 'Not Started' | 'Learning' | 'Completed' | 'Needs Revision';
export type CategoryType = 'java' | 'dsa' | 'aiml' | 'placement' | 'cs_fundamentals' | 'aptitude';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  learningStyle: string;
  goals: string[];
  currentRoleTarget: string;
  streakDays: number;
  lastActiveDate: string;
}

export interface Topic {
  id: string;
  category: CategoryType;
  name: string;
  subSection?: string;
  status: TopicStatus;
  progress: number; // 0 to 100
  notes: string;
  startedAt?: string;
  completedAt?: string;
  lastStudied?: string;
  order: number;
}

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';
export type ProblemStatus = 'Not Attempted' | 'Attempted' | 'Solved' | 'Needs Revision';

export interface Problem {
  id: string;
  name: string;
  platform: 'LeetCode' | 'GeeksforGeeks' | 'HackerRank' | 'CodeStudio' | 'Other';
  url: string;
  topic: string;
  pattern: string;
  difficulty: ProblemDifficulty;
  status: ProblemStatus;
  dateSolved?: string;
  timeTakenMinutes?: number;
  approach?: string;
  mistakes?: string;
  notes?: string;
  needsRevision: boolean;
}

export interface DailyProgressEntry {
  id: string;
  date: string; // YYYY-MM-DD
  category: string;
  topic: string;
  description: string;
  durationMinutes: number;
  problemsSolved: number;
  notes: string;
  confidence: 'low' | 'medium' | 'high' | 'great';
}

export interface DailyProgressAnalysis {
  totalDurationMinutes: number;
  categoryBreakdown: Record<string, number>;
  problemsSolvedToday: number;
  strength: string;
  weakness: string;
  suggestedNextStep: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  category: 'Java' | 'DSA' | 'LeetCode' | 'Aptitude' | 'AI/ML' | 'GenAI' | 'Agentic AI' | 'Placement' | 'Interview' | 'Other';
  url: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  notes: string;
}

export type ProjectStatus = 'Idea' | 'Planning' | 'In Progress' | 'Completed' | 'Deployed';

export interface ProjectItem {
  id: string;
  name: string;
  category: 'AI/ML' | 'Java/Backend' | 'Full Stack' | 'GenAI' | 'Agentic AI' | 'Other';
  description: string;
  technologies: string[];
  status: ProjectStatus;
  githubUrl?: string;
  demoUrl?: string;
  whatLearned?: string;
  problemsFaced?: string;
  futureImprovements?: string;
}

export interface ExploreLaterItem {
  id: string;
  technology: string;
  description: string;
  reason: string;
  url?: string;
  priority: 'Low' | 'Medium' | 'High';
  notes?: string;
  dateAdded: string;
}

export interface ResumeAnalysisRecord {
  id: string;
  resumeName: string;
  targetRole: string;
  score: number; // 0 to 100
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestions: string[];
  createdAt: string;
}

export interface AptitudeTopic {
  id: string;
  name: string;
  category: 'Quantitative' | 'Logical' | 'Verbal' | 'Data Interpretation';
  questionsAttempted: number;
  questionsSolved: number;
  accuracy: number;
  timeTakenMinutes: number;
  weakSubtopics: string[];
  lastPracticed: string;
}

export interface GoalItem {
  id: string;
  title: string;
  category: string;
  deadline: string;
  status: 'Active' | 'Completed' | 'Pending';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
}
