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
        'bg-[#1B1B26] text-primary border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
      outline:
        'border border-white/15 bg-[#12121A] text-secondary hover:text-white hover:border-white/30 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
      blue: 'bg-[#172136] text-accent-blue-glow border border-accent-blue/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]',
      red: 'bg-[#2C141A] text-accent-red-glow border border-accent-red/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-sans transition-colors',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
