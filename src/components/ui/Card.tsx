import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  withHoverEffect?: boolean;
}

/**
 * A liquid glass container card component with authentic specular highlights and optional hover feedback.
 * Strictly gradient-free.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, withHoverEffect = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-white/10 bg-[#12121A]/80 backdrop-blur-xl text-primary overflow-hidden relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_8px_24px_rgba(0,0,0,0.35)]',
          withHoverEffect &&
            'transition-all duration-300 hover:border-white/20 hover:bg-[#181824]/90 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_16px_36px_rgba(0,0,0,0.5)] hover:-translate-y-0.5',
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
