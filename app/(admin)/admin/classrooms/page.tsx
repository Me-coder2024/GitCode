'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, School, Users, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { Classroom } from '@/types'

export default function AdminClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/classrooms?all=true')
      .then((r) => r.json())
      .then((d) => setClassrooms(d.classrooms ?? []))
      .catch(() => setClassrooms([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Classrooms</h1>
          <p className="mt-1 text-text-muted">Manage all classrooms on the platform.</p>
        </div>
        <Link href="/admin/classrooms/create">
          <Button variant="primary" icon={<Plus className="h-4 w-4" />}>Create Classroom</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />)}
        </div>
      ) : classrooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white py-20 text-center">
          <School className="mb-3 h-12 w-12 text-text-muted" />
          <p className="font-semibold text-navy">No classrooms yet</p>
          <p className="mt-1 text-sm text-text-muted">Create your first classroom to get started.</p>
          <Link href="/admin/classrooms/create" className="mt-4">
            <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>Create Classroom</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-md transition-shadow">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <School className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-navy">{c.name}</h3>
              {c.description && <p className="mt-1 text-sm text-text-muted line-clamp-2">{c.description}</p>}
              <div className="mt-3 flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                  <Users className="h-3.5 w-3.5" />
                  {c.member_count ?? 0} members
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-mono text-text-muted">
                  {c.join_code}
                </span>
              </div>
              <div className="mt-4 flex justify-end">
                <Link href={`/admin/classrooms/${c.id}`}>
                  <Button variant="outline" size="sm" icon={<ArrowRight className="h-4 w-4" />}>Manage</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
