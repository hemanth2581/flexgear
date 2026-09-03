'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] font-mono text-xs';

    const variants = {
      primary: 'bg-accent hover:bg-accent-hover text-surface-0 shadow-lg shadow-accent/20 font-bold',
      secondary: 'bg-surface-2 hover:bg-surface-3 text-white border border-surface-3',
      outline: 'bg-transparent border border-surface-3 hover:border-surface-4 text-zinc-300 hover:text-white',
      danger: 'bg-danger/20 hover:bg-danger/30 text-danger border border-danger/30',
      success: 'bg-success/20 hover:bg-success/30 text-success border border-success/30',
      ghost: 'bg-transparent hover:bg-surface-1 text-zinc-400 hover:text-white',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-[11px]',
      md: 'px-4 py-2 text-xs',
      lg: 'px-6 py-2.5 text-xs',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';
