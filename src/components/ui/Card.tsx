import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  withHoverEffect?: boolean;
}

/**
 * An elevated dark container card component with crisp borders and optional hover feedback.
 * Strictly gradient-free.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, withHoverEffect = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-white/10 bg-[#12121A] text-primary overflow-hidden relative shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.35)]',
          withHoverEffect &&
            'transition-[transform,border-color,background-color] duration-200 hover:border-white/20 hover:bg-[#181824] hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
