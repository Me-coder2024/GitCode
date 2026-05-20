'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, GitBranch, ExternalLink, Users, CheckCircle2, Clock, Circle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import type { Project, Team, TeamSectionAssignment, ProjectPage } from '@/types'

type Filter = 'all' | 'in_progress' | 'completed'

export default function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ classroomId: string; projectId: string }>
}) {
  const { classroomId, projectId } = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [pages, setPages] = useState<ProjectPage[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [assignments, setAssignments] = useState<TeamSectionAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    fetch(`/api/projects?id=${projectId}`)
      .then((r) => r.json())
      .then((d) => {
        setProject(d.project ?? null)
        setPages(d.pages ?? [])
        setTeams(d.teams ?? [])
        setAssignments(d.assignments ?? [])
      })
      .finally(() => setLoading(false))
  }, [projectId])

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 rounded-lg bg-gray-200" />
        <div className="h-40 rounded-2xl bg-gray-100" />
      </div>
    )
  }

  if (!project) return <p className="text-text-muted">Project not found.</p>

  const totalSections = assignments.length
  const completedSections = assignments.filter((a) => a.status === 'completed').length
  const progress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0

  const statusIcon = { assigned: Circle, in_progress: Clock, completed: CheckCircle2 }
  const statusColor = { assigned: 'text-text-muted', in_progress: 'text-amber-500', completed: 'text-green-500' }

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/admin/classrooms/${classroomId}`} className="mb-4 inline-flex items-center gap-2 text-sm text-text-muted hover:text-navy">
          <ArrowLeft className="h-4 w-4" /> Back to Classroom
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <GitBranch className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy">{project.name}</h1>
              {project.description && <p className="text-sm text-text-muted">{project.description}</p>}
            </div>
            <Badge variant={project.status === 'active' ? 'success' : 'default'}>{project.status}</Badge>
          </div>
          <a href={project.git_link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-background transition-colors">
            <ExternalLink className="h-4 w-4" /> Repository
          </a>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-navy">Overall Progress</h2>
          <span className="text-2xl font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-sm text-text-muted">{completedSections} of {totalSections} sections completed</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'in_progress', 'completed'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors capitalize ${
              filter === f ? 'bg-primary text-white' : 'bg-white border border-border text-text-muted hover:text-navy'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Teams & Sections */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-navy flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> All Teams & Sections
        </h2>
        {teams.length === 0 ? (
          <p className="text-text-muted">No teams assigned yet.</p>
        ) : (
          teams.map((team) => {
            const teamAssignments = assignments.filter(
              (a) => a.team_id === team.id && (filter === 'all' || a.status === filter)
            )
            if (filter !== 'all' && teamAssignments.length === 0) return null
            return (
              <div key={team.id} className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-navy">{team.name}</span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-mono text-primary">{team.team_code}</span>
                    <span className="text-sm text-text-muted">{team.member_count ?? 0} members</span>
                  </div>
                  <span className="text-sm text-text-muted">
                    {assignments.filter((a) => a.team_id === team.id && a.status === 'completed').length}/
                    {assignments.filter((a) => a.team_id === team.id).length} done
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {teamAssignments.length === 0 ? (
                    <p className="px-6 py-4 text-sm text-text-muted">No sections match this filter.</p>
                  ) : (
                    teamAssignments.map((a) => {
                      const Icon = statusIcon[a.status]
                      return (
                        <div key={a.id} className="flex items-center gap-4 px-6 py-3">
                          <Icon className={`h-4 w-4 shrink-0 ${statusColor[a.status]}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-navy truncate">
                              {a.section?.section_name ?? 'Section'}
                            </p>
                            <p className="text-xs text-text-muted truncate">
                              {a.section?.section_description}
                            </p>
                          </div>
                          <Badge variant={a.status === 'completed' ? 'success' : a.status === 'in_progress' ? 'warning' : 'default'}>
                            {a.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
