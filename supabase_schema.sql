-- Zenith Database Schema

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT NOT NULL DEFAULT 'Design',
  status TEXT DEFAULT 'Active',
  progress INTEGER DEFAULT 0,
  color TEXT DEFAULT 'from-violet-500 to-indigo-600',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  column_id TEXT NOT NULL DEFAULT 'todo',
  tags TEXT[] DEFAULT '{}',
  due_date TEXT DEFAULT 'Nov 16',
  progress INTEGER DEFAULT 0,
  total INTEGER DEFAULT 10,
  color TEXT DEFAULT 'bg-white',
  position FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Enable RLS (Disable for ease of Dev Setup, Enable and configure policies before production)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
