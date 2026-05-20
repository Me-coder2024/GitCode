'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Users, FolderGit2, Layers, Plus, ArrowRight, LogIn } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useClassrooms, useJoinClassroom } from '@/hooks/useClassroom'
import ClassroomCard from '@/components/classroom/ClassroomCard'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { classrooms, loading, refetch } = useClassrooms()
  const { joinClassroom, loading: joining } = useJoinClassroom()
  const [joinCode, setJoinCode] = useState('')

  // Don't render until auth is resolved
  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!joinCode.trim()) return
    const ok = await joinClassroom(joinCode.trim().toUpperCase())
    if (ok) {
      setJoinCode('')
      refetch()
    }
  }

  const stats = [
    { label: 'My Classrooms', value: classrooms.length, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'My Teams', value: 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Projects', value: 0, icon: FolderGit2, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Assigned Sections', value: 0, icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">
          Welcome back, {user?.name?.split(' ')[0] ?? 'Student'} 👋
        </h1>
        <p className="mt-1 text-text-muted">Here's what's happening in your classrooms.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-white p-5 shadow-card">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                <Icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-navy">{s.value}</p>
              <p className="text-sm text-text-muted">{s.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Classrooms grid */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-navy">My Classrooms</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />
              ))}
            </div>
          ) : classrooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white py-16 text-center">
              <BookOpen className="mb-3 h-10 w-10 text-text-muted" />
              <p className="font-medium text-navy">No classrooms yet</p>
              <p className="mt-1 text-sm text-text-muted">Join a classroom using a code from your instructor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {classrooms.map((c) => (
                <ClassroomCard key={c.id} classroom={c} />
              ))}
            </div>
          )}
        </div>

        {/* Join classroom card */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-navy">Join a Classroom</h2>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <p className="mb-4 text-sm text-text-muted">
              Enter the classroom code provided by your instructor to join.
            </p>
            <form onSubmit={handleJoin} className="space-y-3">
              <Input
                placeholder="Enter classroom code (e.g. ABC123)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={8}
              />
              <Button type="submit" variant="primary" fullWidth loading={joining} icon={<LogIn className="h-4 w-4" />}>
                Join Classroom
              </Button>
            </form>
          </div>

          {/* Quick links */}
          {classrooms.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-card">
              <h3 className="mb-3 font-semibold text-navy">Quick Access</h3>
              <div className="space-y-2">
                {classrooms.slice(0, 3).map((c) => (
                  <Link
                    key={c.id}
                    href={`/classroom/${c.id}`}
                    className="flex items-center justify-between rounded-xl p-3 text-sm hover:bg-background transition-colors"
                  >
                    <span className="font-medium text-navy truncate">{c.name}</span>
                    <ArrowRight className="h-4 w-4 text-text-muted shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
