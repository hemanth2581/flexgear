import React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-cinema-bg py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-150">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero skeleton */}
        <div className="w-full h-64 sm:h-80 rounded-3xl bg-cinema-surface/60 border border-cinema-border/50 animate-pulse relative overflow-hidden flex flex-col items-center justify-center p-6 space-y-4">
          <div className="w-32 h-6 rounded-full bg-cinema-tertiary/80 animate-pulse" />
          <div className="w-3/4 max-w-xl h-10 rounded-xl bg-cinema-tertiary/60 animate-pulse" />
          <div className="w-1/2 max-w-md h-5 rounded-lg bg-cinema-tertiary/40 animate-pulse" />
        </div>

        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-cinema-surface/60 rounded-2xl p-5 border border-cinema-border/40 space-y-4 animate-pulse"
            >
              <div className="w-full aspect-square rounded-xl bg-cinema-tertiary/40" />
              <div className="w-20 h-4 rounded-md bg-cinema-tertiary/50" />
              <div className="w-full h-5 rounded-md bg-cinema-tertiary/60" />
              <div className="w-24 h-6 rounded-md bg-cinema-tertiary/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
