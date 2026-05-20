'use client';

import { Layers, Users, Play, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project, TeamSectionAssignment } from '@/types';

interface ProjectStatsProps {
  project: Project;
  assignments: TeamSectionAssignment[];
}

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export default function ProjectStats({
  project,
  assignments,
}: ProjectStatsProps) {
  const totalSections = project.section_count ?? assignments.length;
  const assignedCount = assignments.filter(
    (a) => a.status === 'assigned',
  ).length;
  const inProgressCount = assignments.filter(
    (a) => a.status === 'in_progress',
  ).length;
  const completedCount = assignments.filter(
    (a) => a.status === 'completed',
  ).length;

  const progress =
    totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

  const stats: StatItem[] = [
    {
      label: 'Total Sections',
      value: totalSections,
      icon: <Layers className="h-5 w-5" />,
      color: 'text-primary bg-primary/10',
    },
    {
      label: 'Assigned',
      value: assignedCount,
      icon: <Users className="h-5 w-5" />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'In Progress',
      value: inProgressCount,
      icon: <Play className="h-5 w-5" />,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-green-600 bg-green-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-2xl shadow-card border border-border p-5"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  stat.color,
                )}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">{stat.value}</p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-navy">Overall Progress</h3>
          <span className="text-2xl font-bold text-primary">{progress}%</span>
        </div>
        <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-text-muted">
          {completedCount} of {totalSections} sections completed
        </p>
      </div>
    </div>
  );
}
