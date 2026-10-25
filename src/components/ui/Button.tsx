import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A reusable button component with iOS-style tactile feedback, variant and size support.
 * Strictly gradient-free.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary:
        'bg-accent-red text-white hover:bg-red-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_16px_rgba(224,40,46,0.45)]',
      secondary:
        'bg-accent-blue text-white hover:bg-blue-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_16px_rgba(45,108,223,0.35)]',
      outline:
        'border border-accent-blue text-primary hover:bg-accent-blue/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_2px_8px_rgba(45,108,223,0.2)]',
      ghost: 'text-secondary hover:text-primary hover:bg-white/5',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-sans font-medium transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue disabled:opacity-50 disabled:pointer-events-none select-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
