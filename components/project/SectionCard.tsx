'use client';

import { Check, Play } from 'lucide-react';
import { cn, getStatusColor } from '@/lib/utils';
import type { ProjectSection, TeamSectionAssignment } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface SectionCardProps {
  section: ProjectSection;
  assignment?: TeamSectionAssignment;
  onUpdateStatus?: (status: string) => void;
  pageName?: string;
}

export default function SectionCard({
  section,
  assignment,
  onUpdateStatus,
  pageName,
}: SectionCardProps) {
  const currentStatus = assignment?.status ?? 'assigned';
  const statusColors = getStatusColor(currentStatus);

  const borderClass =
    currentStatus === 'completed'
      ? 'border-l-green-500'
      : currentStatus === 'in_progress'
        ? 'border-l-accent-yellow'
        : 'border-l-primary';

  return (
    <div
      className={cn(
        'bg-card rounded-2xl shadow-card border border-border p-6',
        'border-l-4',
        borderClass,
      )}
    >
      {/* Breadcrumb + Title */}
      <div>
        {pageName && (
          <p className="text-xs text-text-muted mb-1">
            {pageName} <span className="mx-1">›</span>
          </p>
        )}
        <h4 className="font-semibold text-navy">{section.section_name}</h4>
      </div>

      {/* Description */}
      {section.section_description && (
        <p className="mt-2 text-sm text-text-muted line-clamp-3">
          {section.section_description}
        </p>
      )}

      {/* UI Hints */}
      {section.ui_hints && (
        <div className="mt-3 bg-gray-50 rounded-lg p-3">
          <p className="font-mono text-xs text-text-muted whitespace-pre-wrap">
            {section.ui_hints}
          </p>
        </div>
      )}

      {/* Footer: Status + Action */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <Badge
          className={cn(statusColors.bg, statusColors.text, 'capitalize')}
          size="sm"
        >
          {currentStatus.replace('_', ' ')}
        </Badge>

        {currentStatus === 'assigned' && onUpdateStatus && (
          <Button
            variant="primary"
            size="sm"
            icon={<Play className="h-3.5 w-3.5" />}
            onClick={() => onUpdateStatus('in_progress')}
          >
            Start Working
          </Button>
        )}

        {currentStatus === 'in_progress' && onUpdateStatus && (
          <Button
            variant="primary"
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            icon={<Check className="h-3.5 w-3.5" />}
            onClick={() => onUpdateStatus('completed')}
          >
            Mark Complete
          </Button>
        )}

        {currentStatus === 'completed' && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
            <Check className="h-4 w-4" />
            Completed
          </span>
        )}
      </div>
    </div>
  );
}
