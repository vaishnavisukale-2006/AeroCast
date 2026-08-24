import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { generateSmartDailySummary } from '../services/insightsEngine';

export const SmartDailySummary: React.FC = () => {
  const { weatherData, setActiveTab } = useWeather();
  const { tempUnit } = useSettings();

  if (!weatherData) return null;

  const summary = weatherData.dailySummaryText || generateSmartDailySummary(weatherData, tempUnit);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl glass-panel-glow border border-white/50 dark:border-cyan-500/25 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Glow accent */}
        <div className="absolute -left-12 -top-12 w-32 h-32 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 shrink-0 mt-0.5">
            <Sparkles size={18} className="animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] uppercase tracking-widest font-extrabold text-cyan-800 dark:text-cyan-400">
                Daily Intelligence Narrative
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {weatherData.location.name}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed max-w-4xl">
              {summary}
            </p>
          </div>
        </div>

        {/* Action Link to AI Assistant */}
        <button
          onClick={() => setActiveTab('ai')}
          className="relative z-10 shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/60 dark:bg-slate-800/80 hover:bg-cyan-500/20 text-cyan-900 dark:text-cyan-300 border border-white/40 dark:border-slate-700/60 font-bold text-xs shadow-sm transition-all self-start sm:self-center"
        >
          <span>Ask AeroAI</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
