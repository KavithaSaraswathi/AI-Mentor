import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { StorageService } from './services/storageService';
import { UserProfile } from './types';

// Pages
import { LandingDashboard } from './pages/LandingDashboard';
import { JavaDsaPage } from './pages/JavaDsaPage';
import { AiMlPage } from './pages/AiMlPage';
import { PlacementPage } from './pages/PlacementPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { AiMentorPage } from './pages/AiMentorPage';
import { DailyProgressPage } from './pages/DailyProgressPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { RoadmapsPage } from './pages/RoadmapsPage';
import { ExploreLaterPage } from './pages/ExploreLaterPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [dataVersion, setDataVersion] = useState<number>(0);

  const handleRefreshData = () => {
    setProfile(StorageService.getProfile());
    setDataVersion(prev => prev + 1);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const getPageTitle = (tab: NavTab): { title: string; subtitle: string } => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'What should I learn or practice today?' };
      case 'java-dsa':
        return { title: 'Java + DSA Roadmap', subtitle: 'Java basics, OOP, Collections & LeetCode tracker' };
      case 'aiml':
        return { title: 'AI / ML Curriculum', subtitle: 'From Python foundation to Agentic AI and Automation' };
      case 'placement':
        return { title: 'Placement Preparation', subtitle: 'Aptitude accuracy, CS Fundamentals, Technical & HR interviews' };
      case 'resume-analyzer':
        return { title: 'Resume Analyzer', subtitle: 'ATS-style evaluation and target role keyword matching' };
      case 'ai-mentor':
        return { title: 'Personal AI Mentor', subtitle: 'Context-aware study & placement AI assistant' };
      case 'daily-progress':
        return { title: 'Daily Progress Tracker', subtitle: 'Log today\'s study topics and receive AI performance feedback' };
      case 'analytics':
        return { title: 'Progress Analytics', subtitle: 'Study time charts, problem breakdown, and streak metrics' };
      case 'resources':
        return { title: 'Resource Manager', subtitle: 'Saved external websites & learning references' };
      case 'roadmaps':
        return { title: 'Visual Roadmaps', subtitle: 'Flowchart progression for AI/ML and Placement' };
      case 'explore-later':
        return { title: 'Explore Later Vault', subtitle: 'Shiny object protection for trending AI tools' };
      case 'settings':
        return { title: 'Settings & Supabase', subtitle: 'Profile settings, Supabase SQL schema, and data backups' };
      default:
        return { title: 'AI Mentor', subtitle: 'Your personal companion' };
    }
  };

  const { title, subtitle } = getPageTitle(currentTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        isOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          title={title}
          subtitle={subtitle}
          profile={profile}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <LandingDashboard
              key={dataVersion}
              profile={profile}
              onNavigate={(tab) => setCurrentTab(tab)}
              onRefreshData={handleRefreshData}
            />
          )}

          {currentTab === 'java-dsa' && (
            <JavaDsaPage
              key={dataVersion}
              onRefreshData={handleRefreshData}
            />
          )}

          {currentTab === 'aiml' && (
            <AiMlPage
              key={dataVersion}
              onRefreshData={handleRefreshData}
            />
          )}

          {currentTab === 'placement' && (
            <PlacementPage
              key={dataVersion}
              onRefreshData={handleRefreshData}
            />
          )}

          {currentTab === 'resume-analyzer' && (
            <ResumeAnalyzerPage key={dataVersion} />
          )}

          {currentTab === 'ai-mentor' && (
            <AiMentorPage key={dataVersion} />
          )}

          {currentTab === 'daily-progress' && (
            <DailyProgressPage
              key={dataVersion}
              onRefreshData={handleRefreshData}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsPage key={dataVersion} />
          )}

          {currentTab === 'resources' && (
            <ResourcesPage
              key={dataVersion}
              onRefreshData={handleRefreshData}
            />
          )}

          {currentTab === 'roadmaps' && (
            <RoadmapsPage key={dataVersion} />
          )}

          {currentTab === 'explore-later' && (
            <ExploreLaterPage
              key={dataVersion}
              onRefreshData={handleRefreshData}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              key={dataVersion}
              profile={profile}
              onRefreshData={handleRefreshData}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
