-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('student', 'admin')) DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast user lookups by Firebase UID
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON public.users(firebase_uid);

-- 2. CLASSROOMS TABLE
CREATE TABLE IF NOT EXISTS public.classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    join_code TEXT UNIQUE NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for joining classrooms via code
CREATE INDEX IF NOT EXISTS idx_classrooms_join_code ON public.classrooms(join_code);

-- 3. CLASSROOM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.classroom_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_classroom_member UNIQUE (classroom_id, user_id)
);

-- Indexes for member lookups
CREATE INDEX IF NOT EXISTS idx_classroom_members_user ON public.classroom_members(user_id);
CREATE INDEX IF NOT EXISTS idx_classroom_members_classroom ON public.classroom_members(classroom_id);

-- 4. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    team_code TEXT UNIQUE NOT NULL,
    invite_link TEXT,
    max_members INTEGER DEFAULT 5,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for looking up team codes
CREATE INDEX IF NOT EXISTS idx_teams_team_code ON public.teams(team_code);
CREATE INDEX IF NOT EXISTS idx_teams_classroom ON public.teams(classroom_id);

-- 5. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('leader', 'member')) DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_team_member UNIQUE (team_id, user_id)
);

-- Indexes for team members
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);

-- 6. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    important_notes TEXT,
    git_link TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'completed', 'archived')) DEFAULT 'active',
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_classroom ON public.projects(classroom_id);

-- 7. PROJECT PAGES TABLE
CREATE TABLE IF NOT EXISTS public.project_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    page_name TEXT NOT NULL,
    page_description TEXT,
    page_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_pages_project ON public.project_pages(project_id);

-- 8. PROJECT SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.project_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.project_pages(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    section_name TEXT NOT NULL,
    section_description TEXT,
    section_order INTEGER NOT NULL,
    ui_hints TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_sections_project ON public.project_sections(project_id);
CREATE INDEX IF NOT EXISTS idx_project_sections_page ON public.project_sections(page_id);

-- 9. TEAM SECTION ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.team_section_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.project_sections(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('assigned', 'in_progress', 'completed')) DEFAULT 'assigned',
    assigned_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_team_section UNIQUE (team_id, section_id)
);

CREATE INDEX IF NOT EXISTS idx_assignments_team ON public.team_section_assignments(team_id);
CREATE INDEX IF NOT EXISTS idx_assignments_project ON public.team_section_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_assignments_section ON public.team_section_assignments(section_id);
