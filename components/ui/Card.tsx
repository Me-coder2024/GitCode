import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'hoverable' | 'bordered';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** Tailwind border-color class for left accent, e.g. "border-primary" */
  borderColor?: string;
  children: ReactNode;
}

export default function Card({
  variant = 'default',
  borderColor = 'border-primary',
  className,
  children,
  onClick,
  ...rest
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card rounded-2xl shadow-card border border-border p-6',
        variant === 'hoverable' && 'card-hover cursor-pointer',
        variant === 'bordered' && `border-l-4 ${borderColor}`,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
