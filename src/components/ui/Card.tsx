import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  withHoverEffect?: boolean;
}

/**
 * A container card component with optional hover styling.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, withHoverEffect = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-accent-line bg-elevated text-primary overflow-hidden relative',
          withHoverEffect && 'transition-colors hover:bg-elevated-2 hover:border-accent-blue/50',
          className
        )}
        {...props}
      >
        {/* Optional halftone texture overlay could go here */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
Card.displayName = 'Card';
