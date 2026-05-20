'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, School, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function CreateClassroomPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', join_code: generateCode() })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Classroom name is required')
    setLoading(true)
    try {
      const res = await fetch('/api/classrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', ...form }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Failed to create classroom')
      }
      const data = await res.json()
      toast.success('Classroom created!')
      router.push(`/admin/classrooms/${data.classroom?.id ?? ''}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create classroom')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <Link href="/admin/classrooms" className="mb-6 inline-flex items-center gap-2 text-sm text-text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Back to Classrooms
      </Link>

      <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <School className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-navy">Create Classroom</h1>
        <p className="mt-1 text-sm text-text-muted">Set up a new classroom for your students.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Classroom Name"
            placeholder="e.g. CS 301 — Web Development"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Description (optional)</label>
            <textarea
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-navy placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              rows={3}
              placeholder="Brief description of this classroom..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">Join Code</label>
            <div className="flex gap-2">
              <Input
                value={form.join_code}
                onChange={(e) => set('join_code', e.target.value.toUpperCase())}
                maxLength={8}
                className="font-mono tracking-widest"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<RefreshCw className="h-4 w-4" />}
                onClick={() => set('join_code', generateCode())}
              >
                Regenerate
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" loading={loading} fullWidth>
              Create Classroom
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
