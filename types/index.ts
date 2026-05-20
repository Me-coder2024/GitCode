// ==========================================
// GitCode TypeScript Interfaces
// ==========================================

// --- User ---
export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: 'student' | 'admin';
  created_at: string;
}

// --- Classroom ---
export interface Classroom {
  id: string;
  name: string;
  description: string | null;
  join_code: string;
  created_by: string;
  created_at: string;
  member_count?: number;
}

// --- Classroom Member ---
export interface ClassroomMember {
  id: string;
  classroom_id: string;
  user_id: string;
  joined_at: string;
  user?: User;
}

// --- Team ---
export interface Team {
  id: string;
  classroom_id: string;
  name: string;
  team_code: string;
  invite_link: string | null;
  max_members: number;
  created_by: string;
  created_at: string;
  member_count?: number;
  members?: TeamMember[];
}

// --- Team Member ---
export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'leader' | 'member';
  joined_at: string;
  user?: User;
}

// --- Project ---
export interface Project {
  id: string;
  classroom_id: string;
  name: string;
  description: string | null;
  important_notes: string | null;
  git_link: string;
  status: 'active' | 'completed' | 'archived';
  created_by: string;
  created_at: string;
  pages?: ProjectPage[];
  section_count?: number;
  team_count?: number;
}

// --- Project Page ---
export interface ProjectPage {
  id: string;
  project_id: string;
  page_name: string;
  page_description: string | null;
  page_order: number;
  created_at: string;
  sections?: ProjectSection[];
}

// --- Project Section ---
export interface ProjectSection {
  id: string;
  page_id: string;
  project_id: string;
  section_name: string;
  section_description: string | null;
  section_order: number;
  ui_hints: string | null;
  created_at: string;
  page?: ProjectPage;
}

// --- Team Section Assignment ---
export interface TeamSectionAssignment {
  id: string;
  team_id: string;
  section_id: string;
  project_id: string;
  status: 'assigned' | 'in_progress' | 'completed';
  assigned_at: string;
  section?: ProjectSection;
  team?: Team;
}

// --- AI Generated Output ---
export interface AIGeneratedSection {
  section_name: string;
  section_description: string;
  ui_hints: string;
  complexity: 'easy' | 'medium' | 'hard';
  assigned_team_index: number;
}

export interface AIGeneratedPage {
  page_name: string;
  page_description: string;
  sections: AIGeneratedSection[];
}

export interface AIGeneratedOutput {
  pages: AIGeneratedPage[];
  summary: string;
}

// --- API Request/Response Types ---
export interface CreateClassroomRequest {
  name: string;
  description?: string;
}

export interface JoinClassroomRequest {
  join_code: string;
}

export interface CreateTeamRequest {
  classroom_id: string;
  name: string;
  max_members: number;
}

export interface JoinTeamRequest {
  team_code: string;
}

export interface CreateProjectRequest {
  classroom_id: string;
  name: string;
  description: string;
  important_notes: string;
  git_link: string;
}

export interface GenerateSectionsRequest {
  project_name: string;
  description: string;
  important_notes: string;
  team_count: number;
}

export interface ConfirmSectionsRequest {
  classroom_id: string;
  project_name: string;
  description: string;
  important_notes: string;
  git_link: string;
  ai_output: AIGeneratedOutput;
}

export interface UpdateSectionStatusRequest {
  assignment_id: string;
  status: 'assigned' | 'in_progress' | 'completed';
}

// --- Dashboard Stats ---
export interface DashboardStats {
  classrooms: number;
  teams: number;
  active_projects: number;
  assigned_sections: number;
}

export interface AdminStats {
  total_students: number;
  total_teams: number;
  total_projects: number;
  active_sections: number;
}
