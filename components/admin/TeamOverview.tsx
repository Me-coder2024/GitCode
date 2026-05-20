'use client';

import { useState } from 'react';
import { Users, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { cn, getStatusColor } from '@/lib/utils';
import type { Team, TeamSectionAssignment } from '@/types';
import Badge from '@/components/ui/Badge';

interface TeamOverviewProps {
  teams: Team[];
  assignments: TeamSectionAssignment[];
}

export default function TeamOverview({ teams, assignments }: TeamOverviewProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggleExpand(teamId: string) {
    setExpanded((prev) => ({ ...prev, [teamId]: !prev[teamId] }));
  }

  function getTeamAssignments(teamId: string) {
    return assignments.filter((a) => a.team_id === teamId);
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {teams.map((team) => {
        const teamAssignments = getTeamAssignments(team.id);
        const completedCount = teamAssignments.filter(
          (a) => a.status === 'completed',
        ).length;
        const totalCount = teamAssignments.length;
        const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        const isOpen = expanded[team.id] ?? false;

        return (
          <div
            key={team.id}
            className="bg-card rounded-2xl shadow-card border border-border p-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-navy truncate">{team.name}</h3>
              <span className="inline-flex items-center gap-1 text-sm text-text-muted">
                <Users className="h-4 w-4" />
                {team.member_count ?? team.members?.length ?? 0}
              </span>
            </div>

            {/* Progress */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-text-muted">Progress</span>
                <span className="font-medium text-navy">
                  {completedCount}/{totalCount}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Sections Toggle */}
            {teamAssignments.length > 0 && (
              <button
                type="button"
                onClick={() => toggleExpand(team.id)}
                className="mt-3 flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                <Layers className="h-3.5 w-3.5" />
                {teamAssignments.length} section
                {teamAssignments.length !== 1 ? 's' : ''}
                {isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            )}

            {/* Expanded Sections */}
            {isOpen && (
              <div className="mt-3 space-y-2">
                {teamAssignments.map((assignment) => {
                  const status = getStatusColor(assignment.status);
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2"
                    >
                      <span className="text-sm text-navy truncate">
                        {assignment.section?.section_name ?? 'Section'}
                      </span>
                      <Badge
                        className={cn(
                          status.bg,
                          status.text,
                          'capitalize whitespace-nowrap',
                        )}
                        size="sm"
                      >
                        {assignment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
