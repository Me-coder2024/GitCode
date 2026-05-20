'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import CreateTeamFlow from '@/components/team/CreateTeamFlow'

export default function CreateTeamPage({ params }: { params: Promise<{ classroomId: string }> }) {
  const { classroomId } = use(params)
  const router = useRouter()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <CreateTeamFlow
        classroomId={classroomId}
        onSuccess={() => router.push(`/classroom/${classroomId}`)}
        onCancel={() => router.push(`/classroom/${classroomId}`)}
      />
    </div>
  )
}
