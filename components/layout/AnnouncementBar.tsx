'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        'relative w-full bg-navy py-2.5 text-center text-sm text-white',
      )}
    >
      <p className="px-10">
        Collaborate, Build, Ship —{' '}
        <span className="font-bold text-primary">GitCode</span> is your
        team&apos;s coding classroom
      </p>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-white/70 hover:text-white transition-colors focus-ring"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
