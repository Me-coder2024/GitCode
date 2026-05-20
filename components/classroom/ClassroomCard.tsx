'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Classroom } from '@/types';
import Button from '@/components/ui/Button';

interface ClassroomCardProps {
  classroom: Classroom;
  onEnter?: () => void;
}

export default function ClassroomCard({ classroom, onEnter }: ClassroomCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-2xl shadow-card border border-border p-6',
        'card-hover flex flex-col',
      )}
    >
      {/* Header */}
      <h3 className="font-bold text-lg text-navy truncate">{classroom.name}</h3>

      {/* Description */}
      {classroom.description && (
        <p className="mt-1.5 text-text-muted text-sm line-clamp-2">
          {classroom.description}
        </p>
      )}

      {/* Stats Row */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm text-text-muted">
          <Users className="h-4 w-4" />
          {classroom.member_count ?? 0} members
        </span>

        <span className="bg-primary/10 text-primary font-mono text-xs px-2 py-1 rounded-lg select-all">
          {classroom.join_code}
        </span>
      </div>

      {/* Enter Button */}
      <div className="mt-auto pt-5">
        <Link href={`/classroom/${classroom.id}`} className="block">
          <Button variant="primary" fullWidth onClick={onEnter}>
            Enter Classroom
          </Button>
        </Link>
      </div>
    </div>
  );
}
