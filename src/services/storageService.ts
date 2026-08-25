import {
  UserProfile,
  Topic,
  Problem,
  DailyProgressEntry,
  ResourceItem,
  ProjectItem,
  ExploreLaterItem,
  AptitudeTopic,
  GoalItem,
  ResumeAnalysisRecord
} from '../types';
import {
  initialProfile,
  initialJavaTopics,
  initialDsaTopics,
  initialAiMlTopics,
  initialProblems,
  initialDailyLogs,
  initialResources,
  initialProjects,
  initialExploreLater,
  initialAptitudeTopics,
  initialCsFundamentals,
  initialGoals
} from './seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const KEYS = {
  VERSION: 'ai_mentor_storage_version_v2',
  PROFILE: 'ai_mentor_profile',
  JAVA_TOPICS: 'ai_mentor_java_topics',
  DSA_TOPICS: 'ai_mentor_dsa_topics',
  AIML_TOPICS: 'ai_mentor_aiml_topics',
  PROBLEMS: 'ai_mentor_problems',
  DAILY_LOGS: 'ai_mentor_daily_logs',
  RESOURCES: 'ai_mentor_resources',
  PROJECTS: 'ai_mentor_projects',
  EXPLORE_LATER: 'ai_mentor_explore_later',
  APTITUDE_TOPICS: 'ai_mentor_aptitude_topics',
  CS_FUNDAMENTALS: 'ai_mentor_cs_fundamentals',
  GOALS: 'ai_mentor_goals',
  RESUME_ANALYSES: 'ai_mentor_resume_analyses',
};

// Ensure version flag is set without clearing user progress
(function checkStorageVersion() {
  try {
    const currentVer = localStorage.getItem(KEYS.VERSION);
    if (!currentVer) {
      localStorage.setItem(KEYS.VERSION, 'v2_clean');
    }
  } catch (err) {
    console.error('Error checking storage version:', err);
  }
})();

function dedupeItems<T extends { id?: string; name?: string; technology?: string; title?: string }>(items: T[]): T[] {
  if (!Array.isArray(items)) return items;
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  return items.filter(item => {
    const idKey = item.id;
    const nameKey = item.name || item.technology || item.title;

    if (idKey && seenIds.has(idKey)) return false;
    if (nameKey && seenNames.has(nameKey.toLowerCase())) return false;

    if (idKey) seenIds.add(idKey);
    if (nameKey) seenNames.add(nameKey.toLowerCase());
    return true;
  });
}

function getItem<T>(key: string, defaultData: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultData;
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed)) {
      return dedupeItems(parsed) as unknown as T;
    }
    return parsed;
  } catch (err) {
    console.error(`Error reading ${key} from LocalStorage:`, err);
    return defaultData;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to LocalStorage:`, err);
  }
}

export const StorageService = {
  // --- Profile ---
  getProfile(): UserProfile {
    return getItem<UserProfile>(KEYS.PROFILE, initialProfile);
  },
  saveProfile(profile: UserProfile): void {
    setItem(KEYS.PROFILE, profile);
    if (isSupabaseConfigured && supabase) {
      supabase.from('profiles').upsert({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        learning_style: profile.learningStyle,
        goals: profile.goals,
        current_role_target: profile.currentRoleTarget,
        streak_days: profile.streakDays,
        last_active_date: profile.lastActiveDate
      }).then();
    }
  },

  // --- Topics (Java, DSA, AI/ML, CS Fundamentals) ---
  getJavaTopics(): Topic[] {
    return getItem<Topic[]>(KEYS.JAVA_TOPICS, initialJavaTopics);
  },
  saveJavaTopics(topics: Topic[]): void {
    setItem(KEYS.JAVA_TOPICS, topics);
  },
  updateJavaTopic(updated: Topic): void {
    const list = this.getJavaTopics().map(t => t.id === updated.id ? updated : t);
    this.saveJavaTopics(list);
  },

  getDsaTopics(): Topic[] {
    return getItem<Topic[]>(KEYS.DSA_TOPICS, initialDsaTopics);
  },
  saveDsaTopics(topics: Topic[]): void {
    setItem(KEYS.DSA_TOPICS, topics);
  },
  updateDsaTopic(updated: Topic): void {
    const list = this.getDsaTopics().map(t => t.id === updated.id ? updated : t);
    this.saveDsaTopics(list);
  },

  getAiMlTopics(): Topic[] {
    return getItem<Topic[]>(KEYS.AIML_TOPICS, initialAiMlTopics);
  },
  saveAiMlTopics(topics: Topic[]): void {
    setItem(KEYS.AIML_TOPICS, topics);
  },
  updateAiMlTopic(updated: Topic): void {
    const list = this.getAiMlTopics().map(t => t.id === updated.id ? updated : t);
    this.saveAiMlTopics(list);
  },

  getCsFundamentals(): Topic[] {
    return getItem<Topic[]>(KEYS.CS_FUNDAMENTALS, initialCsFundamentals);
  },
  saveCsFundamentals(topics: Topic[]): void {
    setItem(KEYS.CS_FUNDAMENTALS, topics);
  },
  updateCsFundamentalTopic(updated: Topic): void {
    const list = this.getCsFundamentals().map(t => t.id === updated.id ? updated : t);
    this.saveCsFundamentals(list);
  },

  // --- Coding Problems ---
  getProblems(): Problem[] {
    return getItem<Problem[]>(KEYS.PROBLEMS, initialProblems);
  },
  saveProblems(problems: Problem[]): void {
    setItem(KEYS.PROBLEMS, problems);
  },
  addProblem(problem: Problem): void {
    const list = [problem, ...this.getProblems()];
    this.saveProblems(list);
  },
  updateProblem(updated: Problem): void {
    const list = this.getProblems().map(p => p.id === updated.id ? updated : p);
    this.saveProblems(list);
  },
  deleteProblem(id: string): void {
    const list = this.getProblems().filter(p => p.id !== id);
    this.saveProblems(list);
  },

  // --- Daily Progress ---
  getDailyLogs(): DailyProgressEntry[] {
    return getItem<DailyProgressEntry[]>(KEYS.DAILY_LOGS, initialDailyLogs);
  },
  saveDailyLogs(logs: DailyProgressEntry[]): void {
    setItem(KEYS.DAILY_LOGS, logs);
  },
  addDailyLog(log: DailyProgressEntry): void {
    const list = [log, ...this.getDailyLogs()];
    this.saveDailyLogs(list);

    // Update profile streak logic
    const profile = this.getProfile();
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (profile.lastActiveDate === yesterday) {
        profile.streakDays += 1;
      } else {
        profile.streakDays = 1;
      }
      profile.lastActiveDate = today;
      this.saveProfile(profile);
    }
  },

  // --- Resources ---
  getResources(): ResourceItem[] {
    return getItem<ResourceItem[]>(KEYS.RESOURCES, initialResources);
  },
  saveResources(resources: ResourceItem[]): void {
    setItem(KEYS.RESOURCES, resources);
  },
  addResource(resource: ResourceItem): void {
    const list = [resource, ...this.getResources()];
    this.saveResources(list);
  },
  deleteResource(id: string): void {
    const list = this.getResources().filter(r => r.id !== id);
    this.saveResources(list);
  },

  // --- Projects ---
  getProjects(): ProjectItem[] {
    return getItem<ProjectItem[]>(KEYS.PROJECTS, initialProjects);
  },
  saveProjects(projects: ProjectItem[]): void {
    setItem(KEYS.PROJECTS, projects);
  },
  addProject(project: ProjectItem): void {
    const list = [project, ...this.getProjects()];
    this.saveProjects(list);
  },
  updateProject(updated: ProjectItem): void {
    const list = this.getProjects().map(p => p.id === updated.id ? updated : p);
    this.saveProjects(list);
  },

  // --- Explore Later ---
  getExploreLater(): ExploreLaterItem[] {
    return getItem<ExploreLaterItem[]>(KEYS.EXPLORE_LATER, initialExploreLater);
  },
  saveExploreLater(items: ExploreLaterItem[]): void {
    setItem(KEYS.EXPLORE_LATER, items);
  },
  addExploreLater(item: ExploreLaterItem): void {
    const list = [item, ...this.getExploreLater()];
    this.saveExploreLater(list);
  },
  deleteExploreLater(id: string): void {
    const list = this.getExploreLater().filter(i => i.id !== id);
    this.saveExploreLater(list);
  },

  // --- Aptitude Topics ---
  getAptitudeTopics(): AptitudeTopic[] {
    return getItem<AptitudeTopic[]>(KEYS.APTITUDE_TOPICS, initialAptitudeTopics);
  },
  saveAptitudeTopics(topics: AptitudeTopic[]): void {
    setItem(KEYS.APTITUDE_TOPICS, topics);
  },
  updateAptitudeTopic(updated: AptitudeTopic): void {
    const list = this.getAptitudeTopics().map(a => a.id === updated.id ? updated : a);
    this.saveAptitudeTopics(list);
  },

  // --- Goals ---
  getGoals(): GoalItem[] {
    return getItem<GoalItem[]>(KEYS.GOALS, initialGoals);
  },
  saveGoals(goals: GoalItem[]): void {
    setItem(KEYS.GOALS, goals);
  },
  addGoal(goal: GoalItem): void {
    const list = [goal, ...this.getGoals()];
    this.saveGoals(list);
  },
  updateGoalStatus(id: string, status: GoalItem['status']): void {
    const list = this.getGoals().map(g => g.id === id ? { ...g, status } : g);
    this.saveGoals(list);
  },
  deleteGoal(id: string): void {
    const list = this.getGoals().filter(g => g.id !== id);
    this.saveGoals(list);
  },

  // --- Resume Analyses ---
  getResumeAnalyses(): ResumeAnalysisRecord[] {
    return getItem<ResumeAnalysisRecord[]>(KEYS.RESUME_ANALYSES, []);
  },
  addResumeAnalysis(record: ResumeAnalysisRecord): void {
    const list = [record, ...this.getResumeAnalyses()];
    setItem(KEYS.RESUME_ANALYSES, list);
  },

  // Reset to default seed
  resetAllData(): void {
    localStorage.clear();
  }
};
