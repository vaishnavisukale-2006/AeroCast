import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { WeatherIcon } from './WeatherIcons';

export const WeatherRecommendationsCard: React.FC = () => {
  const { weatherData } = useWeather();

  if (!weatherData) return null;

  const { recommendations } = weatherData;

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Today&rsquo;s Recommendations
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Personalized activity and lifestyle advice based on atmospheric parameters
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20">
          Smart Guidance
        </span>
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {recommendations.map((rec) => {
          let statusBadge = (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <CheckCircle2 size={11} />
              Optimal
            </span>
          );

          if (rec.status === 'warning') {
            statusBadge = (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                <AlertTriangle size={11} />
                Caution
              </span>
            );
          } else if (rec.status === 'caution') {
            statusBadge = (
              <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                <AlertCircle size={11} />
                Advisory
              </span>
            );
          }

          return (
            <div
              key={rec.id || rec.title}
              className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
                    <WeatherIcon name={rec.icon} size={18} />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {rec.title}
                  </h3>
                </div>
                {statusBadge}
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium mt-1">
                {rec.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
