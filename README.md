# AI Mentor — Personal AI Learning & Placement Assistant

> **"Your personal learning, AI & college placement companion."**

AI Mentor answers one primary question every day:
> **« What should I learn or practice today? »**

It acts as your personalized mentor tracking **Java + DSA**, **AI/ML (from basics to Agentic AI)**, **Aptitude**, **CS Fundamentals**, **Resume ATS Alignment**, and **Daily Learning Progress**.

---

## 🌟 Core Features

1. **Rule-Based Recommendation Engine ("What Should I Do Today?")**:
   - Analyzes weak topics, inactive study areas (>7 days), low aptitude accuracy (<75%), and active roadmap modules to generate daily study recommendations.

2. **Java + DSA Roadmap & LeetCode Tracker**:
   - Full Java roadmap (Basics, OOP, Advanced Java).
   - Structured DSA roadmap (Arrays to Dynamic Programming).
   - Manual LeetCode / Coding Problem Tracker with topic, difficulty, approach, mistakes, and revision flags.
   - NeetCode 150 curated resource card with direct link and progress tracking.

3. **AI / ML to Agentic AI Progression**:
   - Structured 7-stage curriculum:
     1. Python Foundation (Python, NumPy, Pandas, Matplotlib, Statistics)
     2. Machine Learning (Supervised, Unsupervised, Scikit-Learn)
     3. Deep Learning (Neural Networks, PyTorch, CNN, Transformers)
     4. Generative AI (LLMs, Prompt Engineering, Embeddings, Vector DB, RAG)
     5. Agentic AI (LLM Tool Calling, Memory, ReAct Planning, Multi-Agent Systems)
     6. AI Automation (APIs, Webhooks, Scheduled Workflows, External Services)
     7. Advanced Agentic AI (Production Agents, Guardrails, MLOps)
   - AI/ML Portfolio Project Tracker.

4. **College Placement Hub**:
   - Aptitude Tracker (Percentages, Profit & Loss, Time & Work, Probability, DI, Logical, Verbal).
   - CS Fundamentals (DBMS, SQL, Operating Systems, Computer Networks, OOP).
   - Technical & HR Interview Question Bank + Group Discussion (GD) log.

5. **Resume Analyzer & ATS Role Evaluator**:
   - Upload resume (PDF / text) or paste text directly.
   - Target Role matching (ML Intern, Java Dev, GenAI Eng, Data Analyst).
   - ATS-Style score estimate, strong keyword matches, missing skills, and actionable bullet point suggestions.

6. **Personalized AI Mentor Chatbot**:
   - Context-aware chatbot with full awareness of your goals, weak topics, and study progress.
   - Presets for 1-hour study plans, Java interview prep, and concept explanations.
   - Upgradable to live OpenAI/Gemini APIs via Settings or `.env`.

7. **Daily Progress Logger & Analysis Engine**:
   - Log study duration, category, topic, problems solved, and confidence.
   - Instant automated feedback showing Strength, Weakness, and Suggested Next Step.

8. **Explore Later Vault (Shiny Object Protection)**:
   - Evaluates new trending frameworks (e.g. LangGraph, CrewAI, MCP) using the rule: *"Does this help my current AI roadmap or active project right now?"*

9. **Visual Roadmaps**:
   - Interactive flowchart nodes displaying Completed, In Progress, Needs Revision, and Not Started statuses.

10. **Resource Manager**:
    - Bookmark external learning links with direct "Open Resource" browser tab launching.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 5, TypeScript, Tailwind CSS, Lucide React Icons
- **Data Persistence**: Dual storage layer (LocalStorage offline-first + Supabase PostgreSQL sync)
- **AI Engine**: Rule-Based Recommendation Engine + Optional OpenAI API integration

---

## 📁 Project Structure

```
AI Placement assistent/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── vite-env.d.ts
    ├── types/
    │   └── index.ts
    ├── lib/
    │   └── supabase.ts
    ├── services/
    │   ├── seedData.ts
    │   ├── storageService.ts
    │   └── aiService.ts
    ├── components/
    │   ├── Sidebar.tsx
    │   ├── Header.tsx
    │   ├── ProgressBar.tsx
    │   └── StatusBadge.tsx
    └── pages/
        ├── LandingDashboard.tsx
        ├── JavaDsaPage.tsx
        ├── AiMlPage.tsx
        ├── PlacementPage.tsx
        ├── DailyProgressPage.tsx
        ├── AnalyticsPage.tsx
        ├── ResourcesPage.tsx
        ├── RoadmapsPage.tsx
        ├── ExploreLaterPage.tsx
        ├── ResumeAnalyzerPage.tsx
        ├── AiMentorPage.tsx
        └── SettingsPage.tsx
```

---

## ⚙️ How to Run Locally

1. **Clone or open project folder**:
   ```bash
   cd "AI Placement assistent"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.

---

## 🗄️ Supabase Database Setup (Optional)

1. Sign up at [Supabase](https://supabase.com) and create a new project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy the SQL script below (or click **"Copy Supabase SQL Schema"** inside the app Settings page) and run it:

```sql
-- 1. Profiles Table
create table if not exists public.profiles (
  id text primary key,
  name text not null,
  email text,
  learning_style text,
  goals jsonb default '[]'::jsonb,
  current_role_target text,
  streak_days integer default 0,
  last_active_date date default current_date
);

-- 2. Topics Table
create table if not exists public.topics (
  id text primary key,
  category text not null,
  name text not null,
  sub_section text,
  status text default 'Not Started',
  progress integer default 0,
  notes text default '',
  started_at date,
  completed_at date,
  last_studied date,
  topic_order integer default 0
);

-- 3. Problems Table
create table if not exists public.problems (
  id text primary key,
  name text not null,
  platform text default 'LeetCode',
  url text,
  topic text,
  pattern text,
  difficulty text default 'Easy',
  status text default 'Not Attempted',
  date_solved date,
  time_taken_minutes integer,
  approach text,
  mistakes text,
  notes text,
  needs_revision boolean default false
);

-- 4. Daily Progress Table
create table if not exists public.daily_progress (
  id text primary key,
  date date not null,
  category text,
  topic text,
  description text,
  duration_minutes integer default 0,
  problems_solved integer default 0,
  notes text,
  confidence text default 'medium'
);

-- 5. Resources Table
create table if not exists public.resources (
  id text primary key,
  name text not null,
  category text,
  url text not null,
  description text,
  priority text default 'Medium',
  notes text
);

-- 6. Explore Later Table
create table if not exists public.explore_later (
  id text primary key,
  technology text not null,
  description text,
  reason text,
  url text,
  priority text default 'Medium',
  notes text,
  date_added date default current_date
);
```

4. Add environment variables to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 🚀 How to Use Core Features

### 1. How to Add Daily Progress
1. Click **Daily Progress** in the sidebar navigation.
2. Fill out the **"What did you learn today?"** form (Category, Topic, Duration, Problems Solved, Description).
3. Click **Save Entry & Generate Analysis**.
4. View your instant AI feedback showing session strength, potential weaknesses, and suggested next steps!

### 2. How to Add Coding Problems
1. Navigate to **Java + DSA** -> **LeetCode / Problem Tracker**.
2. Click **+ Add Problem**.
3. Enter problem name, topic, difficulty (Easy/Medium/Hard), status, and notes.

### 3. How to Add External Resources
1. Navigate to **Resources**.
2. Click **Save New Resource**.
3. Input resource name, category, and URL. Click **Open Resource** to test launching it in a new tab.

---

## 🔮 Extending AI Capabilities (Future Roadmap)

- **Version 1 (Current MVP)**: Rule-based recommendation engine, offline LocalStorage, static ATS scoring, and contextual mentor prompt templates.
- **Version 2 (LLM Integration)**: Add OpenAI/Gemini API key in Settings for real-time natural language answers.
- **Version 3 (RAG & Vector Search)**: Store user notes and PDFs in ChromaDB/Supabase Vector for retrieval-augmented chatbot Q&A.
- **Version 4 (Agentic AI & Tool Calling)**: Equip the AI Mentor subagents with function calls (`getProgress()`, `addProblem()`, `recommendTopic()`).
