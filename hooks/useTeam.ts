'use client'

import { useEffect, useState, useCallback } from 'react'
import { Team, CreateTeamRequest } from '@/types'
import toast from 'react-hot-toast'

// ---------------------------------------------------------------------------
// useTeams — Fetch all teams for a given classroom
// ---------------------------------------------------------------------------
export function useTeams(classroomId: string) {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeams = useCallback(async () => {
    if (!classroomId) return

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(
        `/api/teams?classroomId=${encodeURIComponent(classroomId)}`
      )

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch teams')
      }

      const data = await res.json()
      setTeams(data.teams ?? data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch teams'
      setError(message)
      console.error('useTeams error:', err)
    } finally {
      setLoading(false)
    }
  }, [classroomId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTeams()
  }, [fetchTeams])

  return { teams, loading, error, refetch: fetchTeams }
}

// ---------------------------------------------------------------------------
// useCreateTeam — Create a new team in a classroom
// ---------------------------------------------------------------------------
export function useCreateTeam() {
  const [loading, setLoading] = useState(false)

  const createTeam = useCallback(
    async (data: CreateTeamRequest): Promise<Team | null> => {
      try {
        setLoading(true)

        const res = await fetch('/api/teams/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to create team')
        }

        const result = await res.json()
        const team: Team = result.team ?? result

        toast.success(`Team "${team.name}" created! Code: ${team.team_code}`)
        return team
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create team'
        toast.error(message)
        console.error('useCreateTeam error:', err)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { createTeam, loading }
}

// ---------------------------------------------------------------------------
// useJoinTeam — Join an existing team using a team code
// ---------------------------------------------------------------------------
export function useJoinTeam() {
  const [loading, setLoading] = useState(false)

  const joinTeam = useCallback(async (code: string): Promise<boolean> => {
    try {
      setLoading(true)

      const res = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_code: code }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to join team')
      }

      toast.success('Successfully joined the team!')
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join team'
      toast.error(message)
      console.error('useJoinTeam error:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { joinTeam, loading }
}
