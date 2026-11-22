import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SectionWrapperProps extends HTMLAttributes<HTMLElement> {
  id: string;
}

/**
 * A wrapper for all main page sections ensuring consistent spacing, max-width, and content-visibility isolation.
 */
export const SectionWrapper = forwardRef<HTMLElement, SectionWrapperProps>(
  ({ id, className, children, ...props }, ref) => {
    const isHero = id === 'hero';

    return (
      <section
        id={id}
        ref={ref}
        className={cn(
          'w-full max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28 relative z-10',
          !isHero && 'cv-auto',
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);
SectionWrapper.displayName = 'SectionWrapper';
