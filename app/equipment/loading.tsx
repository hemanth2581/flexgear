import React from 'react';

export default function EquipmentLoading() {
  return (
    <div className="min-h-screen bg-cinema-bg py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-150">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumb & Title Skeleton */}
        <div className="space-y-3">
          <div className="w-48 h-4 rounded bg-cinema-surface animate-pulse" />
          <div className="w-72 sm:w-96 h-9 rounded-xl bg-cinema-surface animate-pulse" />
          <div className="w-full max-w-xl h-4 rounded bg-cinema-surface/60 animate-pulse" />
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar Skeleton */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-cinema-surface/70 rounded-2xl p-6 border border-cinema-border/50 space-y-6 animate-pulse">
              <div className="w-28 h-5 rounded bg-cinema-tertiary" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="w-24 h-4 rounded bg-cinema-tertiary/60" />
                    <div className="w-6 h-4 rounded bg-cinema-tertiary/40" />
                  </div>
                ))}
              </div>
              <div className="w-full h-px bg-cinema-border/50" />
              <div className="w-32 h-5 rounded bg-cinema-tertiary" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="w-20 h-4 rounded bg-cinema-tertiary/60" />
                    <div className="w-5 h-4 rounded bg-cinema-tertiary/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Catalog Grid Skeleton */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Sort/Filter bar */}
            <div className="flex items-center justify-between bg-cinema-surface/50 p-4 rounded-2xl border border-cinema-border/50 animate-pulse">
              <div className="w-36 h-5 rounded bg-cinema-tertiary" />
              <div className="w-28 h-8 rounded-xl bg-cinema-tertiary" />
            </div>

            {/* Equipment Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-cinema-surface/70 rounded-2xl p-5 border border-cinema-border/50 space-y-4 animate-pulse"
                >
                  <div className="w-full aspect-square rounded-xl bg-cinema-tertiary/50" />
                  <div className="w-24 h-4 rounded bg-cinema-tertiary/60" />
                  <div className="w-full h-6 rounded bg-cinema-tertiary/80" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="w-20 h-6 rounded bg-cinema-tertiary" />
                    <div className="w-16 h-8 rounded-xl bg-accent/20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
