'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import type { AIGeneratedOutput } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import AISectionPreview from '@/components/admin/AISectionPreview';

interface CreateProjectFormProps {
  classroomId: string;
  teamCount: number;
  onComplete?: () => void;
}

const STEP_LABELS = ['Details', 'AI Generation', 'Preview', 'Done'];

export default function CreateProjectForm({
  classroomId,
  teamCount,
  onComplete,
}: CreateProjectFormProps) {
  const [step, setStep] = useState(0);

  // Step 1 fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [importantNotes, setImportantNotes] = useState('');
  const [gitLink, setGitLink] = useState('');

  // AI
  const [generating, setGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState<AIGeneratedOutput | null>(null);

  // Confirm
  const [confirming, setConfirming] = useState(false);

  /* ---- Step validation ---- */
  const step1Valid = name.trim().length > 0 && gitLink.trim().length > 0;

  /* ---- AI Generation ---- */
  async function handleGenerate() {
    setGenerating(true);
    setStep(1);
    try {
      const res = await fetch('/api/groq/generate-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: name.trim(),
          description: description.trim(),
          important_notes: importantNotes.trim(),
          team_count: teamCount,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'AI generation failed');
      }

      const data = await res.json();
      setAiOutput(data as AIGeneratedOutput);
      setStep(2);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Generation failed';
      toast.error(message);
      setStep(0);
    } finally {
      setGenerating(false);
    }
  }

  /* ---- Confirm & Create ---- */
  async function handleConfirm() {
    if (!aiOutput) return;
    setConfirming(true);
    try {
      const res = await fetch('/api/projects/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: classroomId,
          project_name: name.trim(),
          description: description.trim(),
          important_notes: importantNotes.trim(),
          git_link: gitLink.trim(),
          ai_output: aiOutput,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to create project');
      }

      setStep(3);
      toast.success('Project created successfully!');
      onComplete?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setConfirming(false);
    }
  }

  /* ---- Render ---- */
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={cn(
                'text-xs font-medium',
                i <= step ? 'text-primary' : 'text-text-muted',
              )}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Details */}
      {step === 0 && (
        <div className="space-y-5">
          <Input
            label="Project Name"
            placeholder="e.g. E-Commerce Dashboard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <Textarea
            label="Description"
            placeholder="Describe the project and its goals..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Textarea
            label="Important Notes"
            placeholder="Any constraints, tech stack requirements, or special instructions..."
            value={importantNotes}
            onChange={(e) => setImportantNotes(e.target.value)}
          />
          <Input
            label="Git Repository Link"
            placeholder="https://github.com/org/repo"
            value={gitLink}
            onChange={(e) => setGitLink(e.target.value)}
          />

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              disabled={!step1Valid}
              icon={<Sparkles className="h-4 w-4" />}
              onClick={handleGenerate}
            >
              Generate with AI
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: AI Generation */}
      {step === 1 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-navy">
            GitCode AI is analyzing your project...
          </h3>
          <p className="text-sm text-text-muted max-w-md">
            Breaking down your project into pages, sections, and assigning them
            to {teamCount} teams.
          </p>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 2 && aiOutput && (
        <div>
          <AISectionPreview
            output={aiOutput}
            onConfirm={handleConfirm}
            onRegenerate={handleGenerate}
          />
          {confirming && (
            <div className="mt-4 text-center text-sm text-text-muted">
              Creating project...
            </div>
          )}
        </div>
      )}

      {/* Step 4: Success */}
      {step === 3 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-navy">Project Created!</h2>
          <p className="text-sm text-text-muted max-w-md">
            Teams have been notified and can now view their assigned sections.
          </p>
        </div>
      )}

      {/* Back button for preview step */}
      {step === 2 && (
        <div className="mt-6 flex justify-start">
          <Button
            variant="ghost"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => setStep(0)}
          >
            Back to Details
          </Button>
        </div>
      )}
    </div>
  );
}
