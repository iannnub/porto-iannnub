import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  title: string;
  subtitle?: string;
}

/**
 * A consistent section heading component.
 */
export const SectionHeading = forwardRef<HTMLHeadingElement, SectionHeadingProps>(
  ({ title, subtitle, className, ...props }, ref) => {
    return (
      <div className={cn('mb-10 md:mb-16', className)}>
        <h2
          ref={ref}
          className="font-display text-4xl md:text-5xl uppercase tracking-wider text-primary mb-2"
          {...props}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="font-sans text-secondary text-base md:text-lg">
            {subtitle}
          </p>
        )}
        <div className="h-1 w-16 bg-accent-red mt-4 rounded-full shadow-[0_0_10px_rgba(224,40,46,0.5)]"></div>
      </div>
    );
  }
);
SectionHeading.displayName = 'SectionHeading';
