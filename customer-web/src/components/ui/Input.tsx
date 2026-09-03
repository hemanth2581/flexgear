'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-mono text-zinc-400">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={twMerge(
              clsx(
                'w-full bg-surface-1 text-white border border-surface-3 rounded-xl px-3.5 py-2.5 text-xs placeholder-zinc-500 focus:outline-none focus:border-accent transition-all',
                icon && 'pl-10',
                error && 'border-danger focus:border-danger',
                className
              )
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-mono text-danger mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
