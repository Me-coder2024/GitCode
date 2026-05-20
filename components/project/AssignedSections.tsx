'use client';

import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TeamSectionAssignment, ProjectPage } from '@/types';
import SectionCard from '@/components/project/SectionCard';

interface AssignedSectionsProps {
  assignments: TeamSectionAssignment[];
  pages?: ProjectPage[];
  projectId?: string;
  onUpdateStatus?: (id: string, status: string) => void;
  onStatusUpdate?: () => void;
}

export default function AssignedSections({
  assignments,
  pages,
  projectId,
  onUpdateStatus,
  onStatusUpdate,
}: AssignedSectionsProps) {
  void pages; void projectId;
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-navy">
            My Team&apos;s Assigned Sections
          </h2>
        </div>
        <span
          className={cn(
            'bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full',
          )}
        >
          {assignments.length}
        </span>
      </div>

      {/* Content */}
      {assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-2xl border border-border">
          <Layers className="h-10 w-10 text-text-muted/40 mb-3" />
          <p className="text-sm text-text-muted">No sections assigned yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <SectionCard
              key={assignment.id}
              section={assignment.section!}
              assignment={assignment}
              pageName={assignment.section?.page?.page_name}
              onUpdateStatus={
                onUpdateStatus
                  ? (status) => onUpdateStatus(assignment.id, status)
                  : onStatusUpdate
                  ? () => onStatusUpdate()
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
