'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Users, FolderGit2, ChevronDown, ChevronUp } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import type { Classroom, Team, Project } from '@/types'

export default function AdminClassroomDetailPage({ params }: { params: Promise<{ classroomId: string }> }) {
  const { classroomId } = use(params)
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/classrooms?id=${classroomId}`)
      .then((r) => r.json())
      .then((d) => {
        setClassroom(d.classroom ?? null)
        setTeams(d.teams ?? [])
        setProjects(d.projects ?? [])
      })
      .finally(() => setLoading(false))
  }, [classroomId])

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 rounded-lg bg-gray-200" />
        <div className="h-40 rounded-2xl bg-gray-100" />
      </div>
    )
  }

  if (!classroom) return <p className="text-text-muted">Classroom not found.</p>

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/classrooms" className="mb-4 inline-flex items-center gap-2 text-sm text-text-muted hover:text-navy">
          <ArrowLeft className="h-4 w-4" /> All Classrooms
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy">{classroom.name}</h1>
            {classroom.description && <p className="mt-1 text-text-muted">{classroom.description}</p>}
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Users className="h-3.5 w-3.5" /> {classroom.member_count ?? 0} members
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-mono text-text-muted">
                {classroom.join_code}
              </span>
            </div>
          </div>
          <Link href={`/admin/classrooms/${classroomId}/projects/create`}>
            <Button variant="primary" icon={<Plus className="h-4 w-4" />}>Create Project</Button>
          </Link>
        </div>
      </div>

      {/* Teams */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-navy flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> Teams ({teams.length})
        </h2>
        {teams.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border bg-white py-10 text-center">
            <p className="text-text-muted">No teams have been created yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {teams.map((team) => (
              <div key={team.id} className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
                <button
                  className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-background transition-colors"
                  onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-navy">{team.name}</span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-mono font-medium text-primary">
                      {team.team_code}
                    </span>
                    <span className="text-sm text-text-muted">{team.member_count ?? 0}/{team.max_members} members</span>
                  </div>
                  {expandedTeam === team.id ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
                </button>
                {expandedTeam === team.id && (
                  <div className="border-t border-border px-6 py-4">
                    {team.members && team.members.length > 0 ? (
                      <div className="space-y-2">
                        {team.members.map((m) => (
                          <div key={m.id} className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {m.user?.name?.[0] ?? '?'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-navy">{m.user?.name ?? 'Unknown'}</p>
                              <p className="text-xs text-text-muted">{m.user?.email}</p>
                            </div>
                            <Badge variant={m.role === 'leader' ? 'primary' : 'default'} className="ml-auto">
                              {m.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text-muted">No members yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-navy flex items-center gap-2">
          <FolderGit2 className="h-5 w-5 text-primary" /> Projects ({projects.length})
        </h2>
        {projects.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border bg-white py-10 text-center">
            <p className="text-text-muted">No projects yet.</p>
            <Link href={`/admin/classrooms/${classroomId}/projects/create`} className="mt-3 inline-block">
              <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>Create First Project</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <div key={p.id} className="rounded-2xl border border-border bg-white p-5 shadow-card">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-navy">{p.name}</h3>
                  <Badge variant={p.status === 'active' ? 'success' : 'default'}>{p.status}</Badge>
                </div>
                {p.description && <p className="mt-1 text-sm text-text-muted line-clamp-2">{p.description}</p>}
                <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
                  <span>{p.section_count ?? 0} sections</span>
                  <span>·</span>
                  <span>{p.team_count ?? 0} teams</span>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href={`/admin/classrooms/${classroomId}/projects/${p.id}`}>
                    <Button variant="outline" size="sm">View Project</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
