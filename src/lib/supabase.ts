import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase'));

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const SUPABASE_SQL_SCHEMA = `-- Execute this SQL script in Supabase SQL Editor to create all required tables

-- 1. Profiles Table
create table if not exists public.profiles (
  id text primary key,
  name text not null,
  email text,
  learning_style text,
  goals jsonb default '[]'::jsonb,
  current_role_target text,
  streak_days integer default 0,
  last_active_date date default current_date,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Topics Table (Java, DSA, AI/ML, CS Fundamentals)
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

-- 3. Problems Table (LeetCode / Coding Tracker)
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

-- 4. Daily Progress Logs Table
create table if not exists public.daily_progress (
  id text primary key,
  date date not null,
  category text,
  topic text,
  description text,
  duration_minutes integer default 0,
  problems_solved integer default 0,
  notes text,
  confidence text default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now())
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

-- 6. Projects Table (AI/ML & Tech Projects)
create table if not exists public.projects (
  id text primary key,
  name text not null,
  category text,
  description text,
  technologies jsonb default '[]'::jsonb,
  status text default 'Idea',
  github_url text,
  demo_url text,
  what_learned text,
  problems_faced text,
  future_improvements text
);

-- 7. Explore Later Table
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

-- 8. Resume Analysis Table
create table if not exists public.resume_analysis (
  id text primary key,
  resume_name text,
  target_role text,
  score integer default 0,
  strengths jsonb default '[]'::jsonb,
  weaknesses jsonb default '[]'::jsonb,
  missing_skills jsonb default '[]'::jsonb,
  suggestions jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 9. Aptitude Topics Table
create table if not exists public.aptitude_topics (
  id text primary key,
  name text not null,
  category text,
  questions_attempted integer default 0,
  questions_solved integer default 0,
  accuracy numeric default 0.0,
  time_taken_minutes integer default 0,
  weak_subtopics jsonb default '[]'::jsonb,
  last_practiced date
);

-- 10. Goals Table
create table if not exists public.goals (
  id text primary key,
  title text not null,
  category text,
  deadline date,
  status text default 'Active'
);
`;
