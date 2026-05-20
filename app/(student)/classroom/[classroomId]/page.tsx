'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { Users, FolderGit2, Plus, UserPlus, ArrowRight, GitBranch } from 'lucide-react'
import { useClassroom } from '@/hooks/useClassroom'
import TeamCard from '@/components/team/TeamCard'
import ProjectCard from '@/components/project/ProjectCard'
import Button from '@/components/ui/Button'
import JoinTeamModal from '@/components/team/JoinTeamModal'

export default function ClassroomDetailPage({ params }: { params: Promise<{ classroomId: string }> }) {
  const { classroomId } = use(params)
  const { classroom, teams, projects, loading, refetch } = useClassroom(classroomId)
  const [activeTab, setActiveTab] = useState<'teams' | 'projects'>('teams')
  const [joinTeamOpen, setJoinTeamOpen] = useState(false)

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 rounded-lg bg-gray-200" />
          <div className="h-4 w-96 rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-2xl bg-gray-100" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!classroom) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Classroom not found.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">{classroom.name}</h1>
          {classroom.description && (
            <p className="mt-1 text-text-muted">{classroom.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Users className="h-3.5 w-3.5" />
              {classroom.member_count ?? 0} members
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-mono text-text-muted">
              Code: {classroom.join_code}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {(['teams', 'projects'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-colors capitalize ${
              activeTab === tab ? 'bg-white text-navy shadow-sm' : 'text-text-muted hover:text-navy'
            }`}
          >
            {tab === 'teams' ? <Users className="h-4 w-4" /> : <FolderGit2 className="h-4 w-4" />}
            {tab} ({tab === 'teams' ? teams.length : projects.length})
          </button>
        ))}
      </div>

      {/* Teams tab */}
      {activeTab === 'teams' && (
        <div>
          <div className="mb-4 flex flex-wrap gap-3">
            <Link href={`/classroom/${classroomId}/teams/create`}>
              <Button variant="primary" icon={<Plus className="h-4 w-4" />}>Create Team</Button>
            </Link>
            <Button variant="outline" icon={<UserPlus className="h-4 w-4" />} onClick={() => setJoinTeamOpen(true)}>
              Join Team
            </Button>
          </div>

          {teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white py-16 text-center">
              <Users className="mb-3 h-10 w-10 text-text-muted" />
              <p className="font-medium text-navy">No teams yet</p>
              <p className="mt-1 text-sm text-text-muted">Create a team or join one with a team code.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} classroomId={classroomId} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Projects tab */}
      {activeTab === 'projects' && (
        <div>
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white py-16 text-center">
              <GitBranch className="mb-3 h-10 w-10 text-text-muted" />
              <p className="font-medium text-navy">No projects yet</p>
              <p className="mt-1 text-sm text-text-muted">Your instructor will create projects for this classroom.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} classroomId={classroomId} />
              ))}
            </div>
          )}
        </div>
      )}

      <JoinTeamModal
        open={joinTeamOpen}
        onClose={() => setJoinTeamOpen(false)}
        classroomId={classroomId}
        onJoined={refetch}
      />
    </div>
  )
}
