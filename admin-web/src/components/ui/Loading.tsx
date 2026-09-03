import React from 'react';

export const Loading: React.FC<{ message?: string; variant?: 'spinner' | 'skeleton' }> = ({
  message = 'Syncing telemetry...',
  variant = 'spinner',
}) => {
  if (variant === 'skeleton') {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white/[0.03] rounded-2xl border border-white/[0.06]" />
          ))}
        </div>
        <div className="h-72 bg-white/[0.03] rounded-2xl border border-white/[0.06]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 animate-in fade-in duration-200">
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute w-5 h-5 rounded-full bg-primary/20 animate-ping" />
      </div>
      <p className="mt-4 text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
        {message}
      </p>
    </div>
  );
};

