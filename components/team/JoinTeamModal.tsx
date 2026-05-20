'use client';

import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface JoinTeamModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  classroomId: string;
  onJoin?: (code: string) => Promise<void>;
  onJoined?: () => void;
}

export default function JoinTeamModal({
  open,
  onOpenChange,
  onClose,
  classroomId,
  onJoin,
  onJoined,
}: JoinTeamModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Keep classroomId available for potential future use
  void classroomId;

  const isValid = code.trim().length === 6;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!isValid) {
      toast.error('Please enter a valid 6-character code');
      return;
    }

    setLoading(true);
    try {
      if (onJoin) {
        await onJoin(code.trim());
      } else {
        const res = await fetch('/api/teams/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ team_code: code.trim() }),
        })
        if (!res.ok) {
          const d = await res.json().catch(() => ({}))
          throw new Error(d.error || 'Failed to join team')
        }
        toast.success('Joined team successfully!')
      }
      setCode('');
      onOpenChange?.(false);
      onClose?.();
      onJoined?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to join team';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(v) => { onOpenChange?.(v); if (!v) onClose?.(); }}
      title="Join a Team"
      description="Enter your team's 6-character invite code"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
          placeholder="ABC123"
          maxLength={6}
          className={cn(
            'w-full rounded-xl border border-border bg-white px-4 py-4',
            'text-2xl font-mono tracking-[0.3em] text-center text-navy uppercase',
            'placeholder:text-text-muted placeholder:tracking-[0.3em]',
            'focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
            'transition-colors',
          )}
          autoFocus
        />

        {code.length > 0 && !isValid && (
          <p className="text-xs text-text-muted text-center">
            {6 - code.length} more character{6 - code.length !== 1 ? 's' : ''} needed
          </p>
        )}

        {isValid && (
          <p className="text-xs text-primary text-center font-medium">
            ✓ Code looks good!
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={!isValid}
        >
          Join Team
        </Button>
      </form>
    </Modal>
  );
}
