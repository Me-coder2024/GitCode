'use client';

import { useState } from 'react';
import { Check, Copy, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn, copyToClipboard } from '@/lib/utils';
import type { Team } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface CreateTeamFlowProps {
  classroomId: string;
  onComplete?: (team: Team) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STEPS = ['Team Name', 'Team Size', 'Done'];

export default function CreateTeamFlow({
  classroomId,
  onComplete,
  onSuccess,
  onCancel,
}: CreateTeamFlowProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [loading, setLoading] = useState(false);
  const [createdTeam, setCreatedTeam] = useState<Team | null>(null);
  const [nameError, setNameError] = useState('');

  /* ---- Step navigation ---- */
  function handleNext() {
    if (step === 0) {
      if (name.trim().length < 3) {
        setNameError('Team name must be at least 3 characters');
        return;
      }
      setNameError('');
      setStep(1);
    } else if (step === 1) {
      handleCreate();
    }
  }

  function handleBack() {
    if (step > 0 && step < 2) setStep(step - 1);
  }

  /* ---- Create team ---- */
  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch('/api/teams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: classroomId,
          name: name.trim(),
          max_members: maxMembers,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to create team');
      }

      const data: { team: Team } = await res.json();
      setCreatedTeam(data.team);
      setStep(2);
      toast.success('Team created successfully!');
      onComplete?.(data.team);
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  /* ---- Copy helpers ---- */
  async function handleCopy(text: string, label: string) {
    const ok = await copyToClipboard(text);
    if (ok) toast.success(`${label} copied!`);
    else toast.error('Failed to copy');
  }

  /* ---- Render ---- */
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                  i < step && 'bg-primary text-white',
                  i === step && 'bg-primary text-white ring-4 ring-primary/20',
                  i > step && 'bg-gray-200 text-text-muted',
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="mt-1.5 text-xs text-text-muted">{label}</span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-3 h-0.5 w-12 rounded-full',
                  i < step ? 'bg-primary' : 'bg-gray-200',
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 0 && (
        <div className="space-y-4">
          <Input
            label="Team Name"
            placeholder="e.g. Frontend Wizards"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError('');
            }}
            error={nameError}
            autoFocus
          />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <label className="block text-sm font-medium text-navy">
            Maximum Members
          </label>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 9 }, (_, i) => i + 2).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMaxMembers(n)}
                className={cn(
                  'h-10 w-10 rounded-xl text-sm font-semibold transition-colors',
                  n === maxMembers
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-navy hover:bg-gray-200',
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-sm text-text-muted">
            Your team will allow up to{' '}
            <span className="font-semibold text-navy">{maxMembers}</span>{' '}
            members.
          </p>
        </div>
      )}

      {step === 2 && createdTeam && (
        <div className="flex flex-col items-center text-center space-y-5">
          {/* Checkmark */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-8 w-8 text-primary" />
          </div>

          <h2 className="text-2xl font-bold text-navy">Team Created!</h2>

          {/* Team Code */}
          <div className="w-full">
            <p className="text-xs text-text-muted mb-1">Team Code</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-3xl tracking-widest text-navy font-bold">
                {createdTeam.team_code}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(createdTeam.team_code, 'Team code')
                }
                className="rounded-lg p-2 text-text-muted hover:bg-gray-100 hover:text-navy transition-colors"
                aria-label="Copy team code"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Invite Link */}
          {createdTeam.invite_link && (
            <div className="w-full">
              <p className="text-xs text-text-muted mb-1">Invite Link</p>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5">
                <LinkIcon className="h-4 w-4 text-text-muted shrink-0" />
                <span className="truncate text-sm text-navy">
                  {createdTeam.invite_link}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(createdTeam.invite_link!, 'Invite link')
                  }
                  className="rounded-lg p-1.5 text-text-muted hover:bg-gray-200 hover:text-navy transition-colors shrink-0"
                  aria-label="Copy invite link"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <p className="text-sm text-text-muted">
            Share this code with your teammates
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      {step < 2 && (
        <div className="mt-8 flex items-center gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleNext}
            loading={loading}
            className="ml-auto"
          >
            {step === 1 ? 'Create Team' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  );
}
