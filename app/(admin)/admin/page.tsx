'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  UsersRound,
  FolderGit2,
  Layers,
  TrendingUp,
  Plus,
  Eye,
  Settings,
  ArrowRight,
  Clock,
  CheckCircle2,
  UserPlus,
  GitPullRequest,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import type { AdminStats } from '@/types'
import Button from '@/components/ui/Button'

// ── Demo activity data ────────────────────────────────────────────────
const DEMO_ACTIVITIES = [
  {
    id: '1',
    icon: UserPlus,
    iconBg: 'bg-primary/10 text-primary',
    description: 'Sarah Chen joined Classroom "CS 301 — Web Dev"',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    icon: CheckCircle2,
    iconBg: 'bg-green-100 text-green-600',
    description: 'Team Alpha completed "Hero Section" in Portfolio Project',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    icon: GitPullRequest,
    iconBg: 'bg-purple-100 text-purple-600',
    description: 'New project "E-Commerce Dashboard" created in CS 401',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    icon: UsersRound,
    iconBg: 'bg-blue-100 text-blue-600',
    description: 'Team Bravo was formed in Classroom "CS 301 — Web Dev"',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    icon: UserPlus,
    iconBg: 'bg-primary/10 text-primary',
    description: 'Mike Johnson joined Classroom "CS 401 — Advanced React"',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    icon: CheckCircle2,
    iconBg: 'bg-green-100 text-green-600',
    description: 'Team Delta completed "Auth Flow" in E-Commerce Dashboard',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    icon: GitPullRequest,
    iconBg: 'bg-purple-100 text-purple-600',
    description: 'New project "Chat App" created in CS 301',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
]

// ── Stat cards config ─────────────────────────────────────────────────
const STAT_CARDS = [
  {
    label: 'Total Students',
    key: 'total_students' as const,
    icon: Users,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    change: '+12%',
  },
  {
    label: 'Total Teams',
    key: 'total_teams' as const,
    icon: UsersRound,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    change: '+8%',
  },
  {
    label: 'Total Projects',
    key: 'total_projects' as const,
    icon: FolderGit2,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    change: '+5%',
  },
  {
    label: 'Active Sections',
    key: 'active_sections' as const,
    icon: Layers,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    change: '+24%',
  },
]

// ── Quick actions config ──────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    title: 'Create Classroom',
    description: 'Set up a new classroom and invite students to join.',
    icon: Plus,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    href: '/admin/classrooms/create',
    buttonLabel: 'Create',
  },
  {
    title: 'View All Teams',
    description: 'Browse and manage all teams across your classrooms.',
    icon: UsersRound,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    href: '/admin/teams',
    buttonLabel: 'View Teams',
  },
  {
    title: 'Manage Projects',
    description: 'Track progress and manage AI-generated project sections.',
    icon: FolderGit2,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    href: '/admin/projects',
    buttonLabel: 'View Projects',
  },
  {
    title: 'Platform Settings',
    description: 'Configure your platform preferences and integrations.',
    icon: Settings,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    href: '/admin/settings',
    buttonLabel: 'Settings',
  },
]

// ── Loading skeleton ──────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-8 w-64 rounded-lg bg-gray-200" />
        <div className="mt-2 h-4 w-80 rounded bg-gray-200" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-border p-6 shadow-card"
          >
            <div className="h-12 w-12 rounded-xl bg-gray-200" />
            <div className="mt-4 h-8 w-16 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Quick actions skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-border p-6 shadow-card"
          >
            <div className="h-10 w-10 rounded-xl bg-gray-200" />
            <div className="mt-3 h-5 w-40 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-56 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin')
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats ?? data)
        } else {
          // Use demo values if API isn't ready
          setStats({
            total_students: 156,
            total_teams: 32,
            total_projects: 12,
            active_sections: 84,
          })
        }
      } catch {
        // Fallback to demo values
        setStats({
          total_students: 156,
          total_teams: 32,
          total_projects: 12,
          active_sections: 84,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-navy">Admin Dashboard</h1>
        </div>
        <p className="mt-2 text-text-muted">
          Overview of your GitCode platform
        </p>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon
          const value = stats ? stats[card.key] : 0

          return (
            <div
              key={card.key}
              className="bg-white rounded-2xl border border-border p-6 shadow-card"
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  card.iconBg
                )}
              >
                <Icon className={cn('h-6 w-6', card.iconColor)} />
              </div>

              <p className="mt-4 text-3xl font-bold text-navy">
                {value.toLocaleString()}
              </p>

              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm text-text-muted">{card.label}</span>
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  {card.change}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-semibold text-navy mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon

            return (
              <div
                key={action.title}
                className="bg-white rounded-2xl border border-border p-6 shadow-card flex flex-col"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                      action.iconBg
                    )}
                  >
                    <Icon className={cn('h-5 w-5', action.iconColor)} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-navy">{action.title}</h3>
                    <p className="mt-1 text-sm text-text-muted">
                      {action.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <Link href={action.href}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<ArrowRight className="h-4 w-4" />}
                    >
                      {action.buttonLabel}
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Recent Activity ───────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-semibold text-navy mb-4">
          Recent Activity
        </h2>

        <div className="bg-white rounded-2xl border border-border shadow-card divide-y divide-border">
          {DEMO_ACTIVITIES.map((activity) => {
            const Icon = activity.icon

            return (
              <div
                key={activity.id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                    activity.iconBg
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <p className="flex-1 text-sm text-navy min-w-0">
                  {activity.description}
                </p>

                <span className="shrink-0 text-xs text-text-muted flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
