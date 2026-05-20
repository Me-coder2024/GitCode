'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Project,
  ProjectPage,
  TeamSectionAssignment,
  AIGeneratedOutput,
  GenerateSectionsRequest,
  ConfirmSectionsRequest,
} from '@/types'
import toast from 'react-hot-toast'

// ---------------------------------------------------------------------------
// useProjects — Fetch all projects for a given classroom
// ---------------------------------------------------------------------------
export function useProjects(classroomId: string) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    if (!classroomId) return

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(
        `/api/projects?classroomId=${encodeURIComponent(classroomId)}`
      )

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch projects')
      }

      const data = await res.json()
      setProjects(data.projects ?? data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch projects'
      setError(message)
      console.error('useProjects error:', err)
    } finally {
      setLoading(false)
    }
  }, [classroomId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects()
  }, [fetchProjects])

  return { projects, loading, error, refetch: fetchProjects }
}

// ---------------------------------------------------------------------------
// useProject — Fetch a single project with its pages and team assignments
// ---------------------------------------------------------------------------
export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [pages, setPages] = useState<ProjectPage[]>([])
  const [assignments, setAssignments] = useState<TeamSectionAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProject = useCallback(async () => {
    if (!projectId) return

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(
        `/api/projects?id=${encodeURIComponent(projectId)}`
      )

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch project')
      }

      const data = await res.json()
      setProject(data.project ?? null)
      setPages(data.pages ?? [])
      setAssignments(data.assignments ?? [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch project'
      setError(message)
      console.error('useProject error:', err)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProject()
  }, [fetchProject])

  return { project, pages, assignments, loading, error, refetch: fetchProject }
}

// ---------------------------------------------------------------------------
// useUpdateSectionStatus — Update the status of a team section assignment
// ---------------------------------------------------------------------------
export function useUpdateSectionStatus() {
  const [loading, setLoading] = useState(false)

  const updateStatus = useCallback(
    async (assignmentId: string, status: string): Promise<boolean> => {
      try {
        setLoading(true)

        const res = await fetch('/api/projects', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assignment_id: assignmentId, status }),
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to update section status')
        }

        toast.success('Section status updated!')
        return true
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update section status'
        toast.error(message)
        console.error('useUpdateSectionStatus error:', err)
        return false
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { updateStatus, loading }
}

// ---------------------------------------------------------------------------
// useGenerateSections — Ask Groq AI to generate project sections
// ---------------------------------------------------------------------------
export function useGenerateSections() {
  const [loading, setLoading] = useState(false)

  const generate = useCallback(
    async (data: GenerateSectionsRequest): Promise<AIGeneratedOutput | null> => {
      try {
        setLoading(true)

        const res = await fetch('/api/groq/generate-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to generate sections')
        }

        const result = await res.json()
        const output: AIGeneratedOutput = result.output ?? result

        toast.success('Sections generated successfully!')
        return output
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to generate sections'
        toast.error(message)
        console.error('useGenerateSections error:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { generate, loading }
}

// ---------------------------------------------------------------------------
// useConfirmSections — Save confirmed AI-generated sections to the database
// ---------------------------------------------------------------------------
export function useConfirmSections() {
  const [loading, setLoading] = useState(false)

  const confirm = useCallback(
    async (data: ConfirmSectionsRequest): Promise<boolean> => {
      try {
        setLoading(true)

        const res = await fetch('/api/groq/confirm-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to confirm sections')
        }

        toast.success('Project sections saved successfully!')
        return true
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to confirm sections'
        toast.error(message)
        console.error('useConfirmSections error:', err)
        return false
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { confirm, loading }
}
