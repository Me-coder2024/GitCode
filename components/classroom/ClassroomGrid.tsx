'use client';

import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Classroom } from '@/types';
import ClassroomCard from '@/components/classroom/ClassroomCard';

interface ClassroomGridProps {
  classrooms: Classroom[];
}

export default function ClassroomGrid({ classrooms }: ClassroomGridProps) {
  if (classrooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-navy">No classrooms yet</h3>
        <p className="mt-1 text-sm text-text-muted max-w-sm">
          Join your first classroom to get started
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-6',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      )}
    >
      {classrooms.map((classroom) => (
        <ClassroomCard key={classroom.id} classroom={classroom} />
      ))}
    </div>
  );
}
