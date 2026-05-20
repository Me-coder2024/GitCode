'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, RefreshCw, CheckCircle2, GitBranch } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import AISectionPreview from '@/components/admin/AISectionPreview'
import type { AIGeneratedOutput } from '@/types'
import toast from 'react-hot-toast'

type Step = 'form' | 'generating' | 'preview' | 'saving' | 'done'

export default function CreateProjectPage({ params }: { params: Promise<{ classroomId: string }> }) {
  const { classroomId } = use(params)
  const router = useRouter()

  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState({ name: '', description: '', important_notes: '', git_link: '' })
  const [teamCount, setTeamCount] = useState(3)
  const [aiOutput, setAiOutput] = useState<AIGeneratedOutput | null>(null)

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.git_link.trim()) {
      return toast.error('Project name and Git link are required')
    }
    setStep('generating')
    try {
      const res = await fetch('/api/groq/generate-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: form.name,
          description: form.description,
          important_notes: form.important_notes,
          team_count: teamCount,
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'AI generation failed')
      }
      const data = await res.json()
      setAiOutput(data.output ?? data)
      setStep('preview')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'AI generation failed')
      setStep('form')
    }
  }

  async function handleConfirm() {
    if (!aiOutput) return
    setStep('saving')
    try {
      const res = await fetch('/api/groq/confirm-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: classroomId,
          project_name: form.name,
          description: form.description,
          important_notes: form.important_notes,
          git_link: form.git_link,
          ai_output: aiOutput,
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Failed to save project')
      }
      const data = await res.json()
      setStep('done')
      setTimeout(() => {
        router.push(`/admin/classrooms/${classroomId}/projects/${data.project?.id ?? ''}`)
      }, 2000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save project')
      setStep('preview')
    }
  }

  return (
    <div className="max-w-3xl">
      <Link href={`/admin/classrooms/${classroomId}`} className="mb-6 inline-flex items-center gap-2 text-sm text-text-muted hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Back to Classroom
      </Link>

      {/* Step: Form */}
      {step === 'form' && (
        <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <GitBranch className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-navy">Create Project with AI</h1>
          <p className="mt-1 text-sm text-text-muted">Fill in the details and let GitCode AI generate the section breakdown.</p>

          <form onSubmit={handleGenerate} className="mt-6 space-y-4">
            <Input label="Project Name" placeholder="e.g. E-Commerce Dashboard" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">Description</label>
              <textarea
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-navy placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                rows={3}
                placeholder="What is this project about?"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">Important Notes</label>
              <textarea
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-navy placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                rows={3}
                placeholder="e.g. 5 teams total, 3 pages needed, focus on mobile-first design"
                value={form.important_notes}
                onChange={(e) => set('important_notes', e.target.value)}
              />
            </div>
            <Input label="GitHub .git Link" placeholder="https://github.com/org/repo.git" value={form.git_link} onChange={(e) => set('git_link', e.target.value)} required />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">Number of Teams: {teamCount}</label>
              <input
                type="range"
                min={1}
                max={15}
                value={teamCount}
                onChange={(e) => setTeamCount(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>1</span><span>15</span>
              </div>
            </div>
            <Button type="submit" variant="primary" fullWidth icon={<Sparkles className="h-4 w-4" />}>
              Generate with AI
            </Button>
          </form>
        </div>
      )}

      {/* Step: Generating */}
      {step === 'generating' && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-24 shadow-card text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 animate-pulse text-primary" />
          </div>
          <h2 className="text-xl font-bold text-navy">GitCode AI is analyzing your project...</h2>
          <p className="mt-2 text-text-muted">Generating pages and sections for {teamCount} teams</p>
          <div className="mt-6 flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Step: Preview */}
      {step === 'preview' && aiOutput && (
        <div className="space-y-6">
          <AISectionPreview output={aiOutput} teamCount={teamCount} />
          <div className="flex gap-3">
            <Button variant="primary" fullWidth icon={<CheckCircle2 className="h-4 w-4" />} onClick={handleConfirm}>
              Looks good — Confirm & Create Project
            </Button>
            <Button variant="outline" icon={<RefreshCw className="h-4 w-4" />} onClick={() => setStep('form')}>
              Regenerate
            </Button>
          </div>
        </div>
      )}

      {/* Step: Saving */}
      {step === 'saving' && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-24 shadow-card text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
          <p className="font-semibold text-navy">Saving project and assigning sections...</p>
        </div>
      )}

      {/* Step: Done */}
      {step === 'done' && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-24 shadow-card text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-navy">Project Created!</h2>
          <p className="mt-2 text-text-muted">Teams have been assigned their sections. Redirecting...</p>
        </div>
      )}
    </div>
  )
}
