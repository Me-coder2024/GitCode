'use client';

import { type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ModalSize = 'sm' | 'md' | 'lg';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  children: ReactNode;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export default function Modal({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  children,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-in" />

        {/* Content */}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2',
            'bg-white rounded-2xl shadow-modal p-6',
            'animate-scale-in focus:outline-none',
            sizeClasses[size],
          )}
        >
          {/* Header */}
          {(title || description) && (
            <div className="mb-4">
              {title && (
                <Dialog.Title className="text-xl font-bold text-navy">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="mt-1 text-sm text-text-muted">
                  {description}
                </Dialog.Description>
              )}
            </div>
          )}

          {/* Body */}
          {children}

          {/* Close button */}
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted hover:bg-gray-100 hover:text-navy transition-colors focus-ring"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
