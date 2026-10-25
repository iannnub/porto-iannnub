import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'blue' | 'red';
}

/**
 * A small liquid glass badge/pill component for skills or tags.
 * Strictly gradient-free.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default:
        'bg-white/[0.06] text-primary border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]',
      outline:
        'border border-white/15 text-secondary hover:text-white hover:border-white/30 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]',
      blue: 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]',
      red: 'bg-accent-red/15 text-accent-red border border-accent-red/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-sans backdrop-blur-md transition-colors',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
