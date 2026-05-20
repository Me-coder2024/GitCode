'use client';

import { GitBranch, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn, copyToClipboard } from '@/lib/utils';

interface GitInstructionsProps {
  gitLink: string;
  teamName: string;
  sectionName: string;
}

export default function GitInstructions({
  gitLink,
  teamName,
  sectionName,
}: GitInstructionsProps) {
  const safeBranch = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const branchName = `team-${safeBranch(teamName)}/${safeBranch(sectionName)}`;

  const commands = [
    `git clone ${gitLink}`,
    `git pull origin main`,
    `git checkout -b ${branchName}`,
    `git push origin ${branchName}`,
  ];

  async function handleCopy(text: string) {
    const ok = await copyToClipboard(text);
    if (ok) toast.success('Command copied!');
    else toast.error('Failed to copy');
  }

  return (
    <div className={cn('bg-navy rounded-2xl p-6')}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <GitBranch className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">
          Git Workflow for Your Team
        </h3>
      </div>

      {/* Command Lines */}
      <div className="space-y-2">
        {commands.map((cmd, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center justify-between gap-3',
              'bg-white/5 rounded-lg px-4 py-3',
            )}
          >
            <code className="font-mono text-sm text-white truncate">
              <span className="text-primary mr-2">$</span>
              {cmd}
            </code>
            <button
              type="button"
              onClick={() => handleCopy(cmd)}
              className="shrink-0 rounded-md p-1.5 text-primary hover:text-white transition-colors"
              aria-label={`Copy command: ${cmd}`}
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
