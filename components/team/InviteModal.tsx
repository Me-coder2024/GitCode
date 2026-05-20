'use client';

import { Copy, Link as LinkIcon, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { cn, copyToClipboard } from '@/lib/utils';
import type { Team } from '@/types';

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team;
}

export default function InviteModal({
  open,
  onOpenChange,
  team,
}: InviteModalProps) {
  async function handleCopy(text: string, label: string) {
    const ok = await copyToClipboard(text);
    if (ok) toast.success(`${label} copied to clipboard!`);
    else toast.error('Failed to copy');
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Invite to ${team.name}`}
      description="Share the code or link below with your teammates"
    >
      <div className="space-y-6">
        {/* Team Code Display */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-text-muted">Team Code</p>
          <div
            className={cn(
              'bg-navy text-white font-mono text-2xl py-3 px-6 rounded-xl text-center',
              'tracking-widest select-all',
            )}
          >
            {team.team_code}
          </div>
          <Button
            variant="outline"
            fullWidth
            icon={<Copy className="h-4 w-4" />}
            onClick={() => handleCopy(team.team_code, 'Team code')}
          >
            Copy Code
          </Button>
        </div>

        {/* Invite Link */}
        {team.invite_link && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-muted">Invite Link</p>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5">
              <LinkIcon className="h-4 w-4 text-text-muted shrink-0" />
              <span className="truncate text-sm text-navy">
                {team.invite_link}
              </span>
            </div>
            <Button
              variant="outline"
              fullWidth
              icon={<Copy className="h-4 w-4" />}
              onClick={() => handleCopy(team.invite_link!, 'Invite link')}
            >
              Copy Link
            </Button>
          </div>
        )}

        {/* Share Via (Placeholder) */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-text-muted">Share via</p>
          <div className="flex items-center justify-center gap-3 py-3 rounded-xl border border-dashed border-border">
            <Share2 className="h-5 w-5 text-text-muted" />
            <span className="text-sm text-text-muted">
              More sharing options coming soon
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
