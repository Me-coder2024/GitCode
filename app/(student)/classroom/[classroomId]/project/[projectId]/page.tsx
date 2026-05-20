'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, GitBranch, ExternalLink } from 'lucide-react'
import { useProject } from '@/hooks/useProject'
import { useAuth } from '@/hooks/useAuth'
import AssignedSections from '@/components/project/AssignedSections'
import GitInstructions from '@/components/project/GitInstructions'
import Badge from '@/components/ui/Badge'

const STATUS_COLORS = {
  active: 'success',
  completed: 'primary',
  archived: 'default',
} as const

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ classroomId: string; projectId: string }>
}) {
  const { classroomId, projectId } = use(params)
  const { project, pages, assignments, loading, refetch } = useProject(projectId)
  const { user } = useAuth()

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 rounded-lg bg-gray-200" />
          <div className="h-32 rounded-2xl bg-gray-100" />
          <div className="h-48 rounded-2xl bg-gray-100" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Project not found.</p>
      </div>
    )
  }

  // Find the current user's team assignments
  const myAssignments = assignments.filter((a) => a.team?.members?.some((m) => m.user_id === user?.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/classroom/${classroomId}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-text-muted hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Classroom
      </Link>

      {/* Project header */}
      <div className="mb-6 rounded-2xl border border-border bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-navy">{project.name}</h1>
              <Badge variant={STATUS_COLORS[project.status]}>{project.status}</Badge>
            </div>
            {project.description && (
              <p className="mt-2 text-text-muted">{project.description}</p>
            )}
          </div>
          <a
            href={project.git_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-background transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View Repository
          </a>
        </div>
      </div>

      {/* Git instructions */}
      <div className="mb-6">
        <GitInstructions gitLink={project.git_link} teamName="your-team" sectionName="your-section" />
      </div>

      {/* My assigned sections */}
      <AssignedSections
        assignments={assignments}
        pages={pages}
        projectId={projectId}
        onStatusUpdate={refetch}
      />
    </div>
  )
}
