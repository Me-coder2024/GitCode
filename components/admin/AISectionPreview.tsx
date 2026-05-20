'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { cn, getTeamColor, getComplexityColor } from '@/lib/utils';
import type { AIGeneratedOutput } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface AISectionPreviewProps {
  output: AIGeneratedOutput;
  teamCount?: number;
  onConfirm?: () => void;
  onRegenerate?: () => void;
}

export default function AISectionPreview({
  output,
  teamCount,
  onConfirm,
  onRegenerate,
}: AISectionPreviewProps) {
  void teamCount;
  const [openPages, setOpenPages] = useState<Record<number, boolean>>(() => {
    // All open by default
    const map: Record<number, boolean> = {};
    output.pages.forEach((_, i) => {
      map[i] = true;
    });
    return map;
  });

  function togglePage(index: number) {
    setOpenPages((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="rounded-2xl bg-gradient-to-br from-primary to-teal-700 p-6 text-white">
        <div className="flex items-start gap-3">
          <Sparkles className="h-6 w-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-lg">AI-Generated Breakdown</h3>
            <p className="mt-1 text-sm text-white/80">{output.summary}</p>
          </div>
        </div>
      </div>

      {/* Pages */}
      <div className="space-y-4">
        {output.pages.map((page, pageIndex) => {
          const isOpen = openPages[pageIndex] ?? false;

          return (
            <div
              key={pageIndex}
              className="rounded-2xl border border-border overflow-hidden"
            >
              {/* Page Header */}
              <button
                type="button"
                onClick={() => togglePage(pageIndex)}
                className={cn(
                  'w-full flex items-center justify-between gap-3 px-5 py-4',
                  'bg-gray-50 hover:bg-gray-100 transition-colors text-left',
                )}
              >
                <div className="min-w-0">
                  <h4 className="font-semibold text-navy">{page.page_name}</h4>
                  {page.page_description && (
                    <p className="text-sm text-text-muted mt-0.5 line-clamp-1">
                      {page.page_description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-text-muted">
                    {page.sections.length} section
                    {page.sections.length !== 1 ? 's' : ''}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-text-muted" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-text-muted" />
                  )}
                </div>
              </button>

              {/* Sections */}
              {isOpen && (
                <div className="p-4 space-y-3">
                  {page.sections.map((section, sectionIndex) => {
                    const teamColor = getTeamColor(section.assigned_team_index);
                    const complexityColor = getComplexityColor(
                      section.complexity,
                    );

                    return (
                      <div
                        key={sectionIndex}
                        className="rounded-xl border border-border bg-white p-4"
                      >
                        {/* Section Header */}
                        <div className="flex items-start justify-between gap-3">
                          <h5 className="font-medium text-navy">
                            {section.section_name}
                          </h5>
                          <Badge
                            className={cn(
                              complexityColor.bg,
                              complexityColor.text,
                              'capitalize',
                            )}
                            size="sm"
                          >
                            {section.complexity}
                          </Badge>
                        </div>

                        {/* Description */}
                        {section.section_description && (
                          <p className="mt-1.5 text-sm text-text-muted">
                            {section.section_description}
                          </p>
                        )}

                        {/* UI Hints */}
                        {section.ui_hints && (
                          <div className="mt-2.5 bg-gray-50 rounded-lg p-3">
                            <p className="font-mono text-xs text-text-muted whitespace-pre-wrap">
                              {section.ui_hints}
                            </p>
                          </div>
                        )}

                        {/* Team Assignment Chip */}
                        <div className="mt-3">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border',
                              teamColor.bg,
                              teamColor.text,
                              teamColor.border,
                            )}
                          >
                            Team {section.assigned_team_index + 1}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onConfirm}
          icon={<Sparkles className="h-4 w-4" />}
        >
          Looks good — Confirm &amp; Create Project
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onRegenerate}
          icon={<RefreshCw className="h-4 w-4" />}
          className="sm:w-auto"
        >
          Regenerate
        </Button>
      </div>
    </div>
  );
}
