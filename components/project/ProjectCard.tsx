'use client';

import Link from 'next/link';
import { Layers, Users, GitBranch } from 'lucide-react';
import { cn, getStatusColor, truncate } from '@/lib/utils';
import type { Project } from '@/types';
import Badge from '@/components/ui/Badge';

interface ProjectCardProps {
  project: Project;
  classroomId?: string;
}

export default function ProjectCard({ project, classroomId }: ProjectCardProps) {
  const status = getStatusColor(project.status);

  const href = classroomId
    ? `/classroom/${classroomId}/project/${project.id}`
    : '#';

  return (
    <Link href={href} className="block">
      <div
        className={cn(
          'bg-card rounded-2xl shadow-card border border-border p-6',
          'card-hover flex flex-col h-full',
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-navy truncate">{project.name}</h3>
          <Badge
            className={cn(status.bg, status.text, 'capitalize')}
            size="sm"
          >
            {project.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Description */}
        {project.description && (
          <p className="mt-2 text-text-muted text-sm line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Layers className="h-4 w-4" />
            {project.section_count ?? 0} sections
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {project.team_count ?? 0} teams
          </span>
        </div>

        {/* Git Link */}
        {project.git_link && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
            <GitBranch className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{truncate(project.git_link, 40)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
