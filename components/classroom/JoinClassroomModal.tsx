'use client';

import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface JoinClassroomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (code: string) => Promise<void>;
}

export default function JoinClassroomModal({
  open,
  onOpenChange,
  onJoin,
}: JoinClassroomModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();

    if (!trimmed) {
      toast.error('Please enter a join code');
      return;
    }

    setLoading(true);
    try {
      await onJoin(trimmed);
      setCode('');
      onOpenChange(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to join classroom';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Join a Classroom"
      description="Enter the classroom join code provided by your instructor"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ENTER CODE"
          maxLength={12}
          className={cn(
            'w-full rounded-xl border border-border bg-white px-4 py-3',
            'text-lg font-mono tracking-widest text-center text-navy uppercase',
            'placeholder:text-text-muted placeholder:tracking-widest',
            'focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
            'transition-colors',
          )}
          autoFocus
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={!code.trim()}
        >
          Join Classroom
        </Button>
      </form>
    </Modal>
  );
}
