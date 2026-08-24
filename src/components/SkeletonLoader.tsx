import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-pulse">
      {/* Search & Favorites Skeleton */}
      <div className="h-14 w-full max-w-4xl mx-auto rounded-2xl glass-panel bg-slate-200/40 dark:bg-slate-800/40" />
      <div className="h-8 w-80 rounded-xl glass-panel bg-slate-200/30 dark:bg-slate-800/30" />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hero Card + Hourly + Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Card Skeleton */}
          <div className="h-80 rounded-3xl glass-panel bg-slate-200/40 dark:bg-slate-800/40 p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-8 w-48 rounded-xl bg-slate-300/40 dark:bg-slate-700/40" />
                <div className="h-4 w-32 rounded-lg bg-slate-300/30 dark:bg-slate-700/30" />
              </div>
              <div className="h-8 w-24 rounded-full bg-slate-300/30 dark:bg-slate-700/30" />
            </div>

            <div className="flex items-center justify-between">
              <div className="h-20 w-44 rounded-2xl bg-slate-300/50 dark:bg-slate-700/50" />
              <div className="h-16 w-16 rounded-full bg-slate-300/40 dark:bg-slate-700/40" />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-slate-300/30 dark:bg-slate-700/30" />
              ))}
            </div>
          </div>

          {/* Hourly Forecast Skeleton */}
          <div className="h-52 rounded-3xl glass-panel bg-slate-200/40 dark:bg-slate-800/40 p-6 flex flex-col justify-between">
            <div className="h-6 w-36 rounded-lg bg-slate-300/40 dark:bg-slate-700/40 mb-4" />
            <div className="flex gap-3 overflow-hidden">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-32 w-24 shrink-0 rounded-2xl bg-slate-300/30 dark:bg-slate-700/30" />
              ))}
            </div>
          </div>

          {/* Chart Skeleton */}
          <div className="h-80 rounded-3xl glass-panel bg-slate-200/40 dark:bg-slate-800/40 p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-6 w-48 rounded-lg bg-slate-300/40 dark:bg-slate-700/40" />
              <div className="h-8 w-44 rounded-xl bg-slate-300/30 dark:bg-slate-700/30" />
            </div>
            <div className="h-52 w-full rounded-2xl bg-slate-300/20 dark:bg-slate-700/20" />
          </div>
        </div>

        {/* Right 1 Col: 7-Day Forecast + Sun Cycle */}
        <div className="space-y-6">
          <div className="h-96 rounded-3xl glass-panel bg-slate-200/40 dark:bg-slate-800/40 p-6 flex flex-col justify-between">
            <div className="h-6 w-36 rounded-lg bg-slate-300/40 dark:bg-slate-700/40 mb-4" />
            <div className="space-y-3">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-10 rounded-xl bg-slate-300/30 dark:bg-slate-700/30" />
              ))}
            </div>
          </div>

          <div className="h-64 rounded-3xl glass-panel bg-slate-200/40 dark:bg-slate-800/40 p-6">
            <div className="h-6 w-36 rounded-lg bg-slate-300/40 dark:bg-slate-700/40 mb-4" />
            <div className="h-32 rounded-2xl bg-slate-300/20 dark:bg-slate-700/20" />
          </div>
        </div>
      </div>
    </div>
  );
};
