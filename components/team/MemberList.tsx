'use client';

import { Crown } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import type { TeamMember } from '@/types';
import Badge from '@/components/ui/Badge';

interface MemberListProps {
  members: TeamMember[];
}

export default function MemberList({ members }: MemberListProps) {
  // Sort leaders first
  const sorted = [...members].sort((a, b) => {
    if (a.role === 'leader' && b.role !== 'leader') return -1;
    if (a.role !== 'leader' && b.role === 'leader') return 1;
    return 0;
  });

  return (
    <div className="space-y-2">
      {sorted.map((member) => {
        const isLeader = member.role === 'leader';

        return (
          <div
            key={member.id}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-3',
              'border border-border bg-white transition-colors hover:bg-gray-50',
            )}
          >
            {/* Avatar */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {getInitials(member.user?.name)}
              {isLeader && (
                <Crown className="absolute -top-1 -right-1 h-3.5 w-3.5 text-accent-yellow fill-accent-yellow" />
              )}
            </div>

            {/* Name */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-navy truncate">
                {member.user?.name ?? 'Unknown Member'}
              </p>
              {member.user?.email && (
                <p className="text-xs text-text-muted truncate">
                  {member.user.email}
                </p>
              )}
            </div>

            {/* Role Badge */}
            <Badge
              variant={isLeader ? 'primary' : 'outline'}
              size="sm"
            >
              {isLeader ? 'Leader' : 'Member'}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
