'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, ArrowLeft } from 'lucide-react'
import { useJoinTeam } from '@/hooks/useTeam'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Link from 'next/link'

export default function JoinTeamPage({ params }: { params: Promise<{ classroomId: string }> }) {
  const { classroomId } = use(params)
  const router = useRouter()
  const { joinTeam, loading } = useJoinTeam()
  const [code, setCode] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    const ok = await joinTeam(code.trim().toUpperCase())
    if (ok) router.push(`/classroom/${classroomId}`)
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <Link href={`/classroom/${classroomId}`} className="mb-6 inline-flex items-center gap-2 text-sm text-text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Back to Classroom
      </Link>

      <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <UserPlus className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-navy">Join a Team</h1>
        <p className="mt-1 text-sm text-text-muted">Enter the 6-character team code shared by your teammate.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Team Code"
            placeholder="e.g. ABC123"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="font-mono text-lg tracking-widest text-center"
          />
          <Button type="submit" variant="primary" fullWidth loading={loading} icon={<UserPlus className="h-4 w-4" />}>
            Join Team
          </Button>
        </form>
      </div>
    </div>
  )
}
