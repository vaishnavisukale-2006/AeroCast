import React from 'react';
import { AlertTriangle, RefreshCw, Sparkles, X } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';

export const ErrorBanner: React.FC = () => {
  const { error, refreshWeather, clearError, isLoading } = useWeather();
  const { toggleDemoMode } = useSettings();

  if (!error) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 my-4 animate-slide-up">
      <div className="relative p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-800 dark:text-rose-200">
              Weather Connection Notice
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5 max-w-xl">
              {error}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => refreshWeather()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-800 dark:text-rose-200 text-xs font-semibold transition-colors"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Retry</span>
          </button>

          <button
            onClick={() => {
              toggleDemoMode();
              clearError();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-semibold transition-colors"
          >
            <Sparkles size={13} />
            <span>Use Demo Data</span>
          </button>

          <button
            onClick={clearError}
            className="p-1.5 rounded-xl text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 transition-colors"
            title="Dismiss notice"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
