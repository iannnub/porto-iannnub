import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SectionWrapperProps extends HTMLMotionProps<'section'> {
  id: string;
}

/**
 * A wrapper for all main page sections ensuring consistent spacing and max-width.
 */
export const SectionWrapper = forwardRef<HTMLElement, SectionWrapperProps>(
  ({ id, className, children, ...props }, ref) => {
    return (
      <motion.section
        id={id}
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          'w-full max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-32 relative z-10',
          className
        )}
        {...props}
      >
        {children}
      </motion.section>
    );
  }
);
SectionWrapper.displayName = 'SectionWrapper';
