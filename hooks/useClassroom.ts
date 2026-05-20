'use client'

import { useEffect, useState, useCallback } from 'react'
import { Classroom, Team, Project } from '@/types'
import toast from 'react-hot-toast'

// ---------------------------------------------------------------------------
// useClassrooms — Fetch all classrooms the current user belongs to
// ---------------------------------------------------------------------------
export function useClassrooms() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClassrooms = useCallback(async () => {
    try {
      await Promise.resolve()
      setLoading(true)
      setError(null)

      const res = await fetch('/api/classrooms')

      if (res.status === 401) {
        // Not authenticated yet — return empty, don't set error
        setClassrooms([])
        return
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch classrooms')
      }

      const data = await res.json()
      setClassrooms(data.classrooms ?? data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch classrooms'
      setError(message)
      console.error('useClassrooms error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClassrooms()
  }, [fetchClassrooms])

  return { classrooms, loading, error, refetch: fetchClassrooms }
}

// ---------------------------------------------------------------------------
// useClassroom — Fetch a single classroom by ID, along with its teams & projects
// ---------------------------------------------------------------------------
export function useClassroom(id: string) {
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClassroom = useCallback(async () => {
    if (!id) return

    try {
      await Promise.resolve()
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/classrooms?id=${encodeURIComponent(id)}`)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch classroom')
      }

      const data = await res.json()
      setClassroom(data.classroom ?? null)
      setTeams(data.teams ?? [])
      setProjects(data.projects ?? [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch classroom'
      setError(message)
      console.error('useClassroom error:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClassroom()
  }, [fetchClassroom])

  return { classroom, teams, projects, loading, error, refetch: fetchClassroom }
}

// ---------------------------------------------------------------------------
// useJoinClassroom — Join a classroom using an invite code
// ---------------------------------------------------------------------------
export function useJoinClassroom() {
  const [loading, setLoading] = useState(false)

  const joinClassroom = useCallback(async (code: string): Promise<boolean> => {
    try {
      setLoading(true)

      const res = await fetch('/api/classrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', join_code: code }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to join classroom')
      }

      toast.success('Successfully joined the classroom!')
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join classroom'
      toast.error(message)
      console.error('useJoinClassroom error:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { joinClassroom, loading }
}
