'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import type { Team } from '@/types';
import Button from '@/components/ui/Button';

interface TeamCardProps {
  team: Team;
  classroomId?: string;
  onViewSections?: () => void;
}

export default function TeamCard({ team, classroomId, onViewSections }: TeamCardProps) {
  const visibleMembers = (team.members ?? []).slice(0, 5);
  const extraCount = (team.members?.length ?? 0) - 5;

  return (
    <div
      className={cn(
        'bg-card rounded-2xl shadow-card border border-border p-6',
        'card-hover flex flex-col',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-navy truncate">{team.name}</h3>
        <span className="shrink-0 bg-primary text-white font-mono text-xs px-2.5 py-1 rounded-full">
          {team.team_code}
        </span>
      </div>

      {/* Member Avatars */}
      {visibleMembers.length > 0 && (
        <div className="mt-4 flex items-center -space-x-2">
          {visibleMembers.map((member) => (
            <div
              key={member.id}
              title={member.user?.name ?? 'Member'}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold ring-2 ring-white"
            >
              {getInitials(member.user?.name)}
            </div>
          ))}
          {extraCount > 0 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-text-muted text-xs font-semibold ring-2 ring-white">
              +{extraCount}
            </div>
          )}
        </div>
      )}

      {/* Member Count */}
      <div className="mt-4 flex items-center gap-1.5 text-sm text-text-muted">
        <Users className="h-4 w-4" />
        {team.member_count ?? team.members?.length ?? 0}/{team.max_members} members
      </div>

      {/* Actions */}
      <div className="mt-auto pt-5">
        {classroomId ? (
          <Link href={`/classroom/${classroomId}`}>
            <Button variant="outline" fullWidth onClick={onViewSections}>View Sections</Button>
          </Link>
        ) : (
          <Button variant="outline" fullWidth onClick={onViewSections}>View Sections</Button>
        )}
      </div>
    </div>
  );
}
