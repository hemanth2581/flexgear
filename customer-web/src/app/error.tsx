'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Customer portal error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/30 flex items-center justify-center text-danger mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="text-xs font-mono uppercase tracking-widest text-danger font-semibold mb-2">
        System Interruption
      </div>
      <h1 className="text-3xl font-bold font-display text-white tracking-tight">
        Something went wrong on set
      </h1>
      <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
        An error occurred while loading this page. Our technical crew has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 px-5 py-2.5 bg-surface-1 hover:bg-surface-2 border border-surface-3 text-accent hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" /> Try Again
      </button>
    </div>
  );
}
