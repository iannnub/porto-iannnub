import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'blue' | 'red';
}

/**
 * A small badge/pill component for skills or tags.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-elevated-2 text-primary',
      outline: 'border border-accent-line text-secondary hover:text-white hover:border-white/20 transition-all',
      blue: 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:shadow-[0_0_10px_rgba(45,108,223,0.3)]',
      red: 'bg-accent-red/10 text-accent-red border border-accent-red/20 hover:shadow-[0_0_10px_rgba(224,40,46,0.3)]',
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
