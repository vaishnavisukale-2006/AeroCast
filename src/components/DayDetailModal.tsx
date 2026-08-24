import React from 'react';
import { X, Calendar, Droplets, Wind, Sun, Sunrise, Sunset, ArrowUp, ArrowDown } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { formatTemperature, formatWindSpeed } from '../utils/formatters';
import { WeatherIcon } from './WeatherIcons';

export const DayDetailModal: React.FC = () => {
  const { selectedForecastDay, setSelectedForecastDay } = useWeather();
  const { tempUnit, windUnit } = useSettings();

  if (!selectedForecastDay) return null;

  const day = selectedForecastDay;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl rounded-3xl glass-panel-glow border border-white/50 dark:border-slate-700/80 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-slate-800/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{day.dayName}</span>
                <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 font-mono font-medium text-slate-700 dark:text-slate-300">
                  {day.formattedDate}
                </span>
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Detailed 24-hour meteorological outlook
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedForecastDay(null)}
            className="p-2 rounded-2xl glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition-all"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Hero Day Summary */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50">
              <WeatherIcon name={day.icon} size={48} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {day.condition}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm font-semibold">
                <span className="flex items-center text-rose-500 font-bold">
                  <ArrowUp size={14} className="mr-0.5" />
                  {formatTemperature(day.temperatureMax, tempUnit)}
                </span>
                <span className="flex items-center text-sky-500 font-bold">
                  <ArrowDown size={14} className="mr-0.5" />
                  {formatTemperature(day.temperatureMin, tempUnit)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-800/50">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">Rain Chance</span>
              <span className="text-base font-extrabold text-cyan-800 dark:text-cyan-300">
                {day.precipitationProbability}%
              </span>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-white/50 dark:bg-slate-800/50">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">Precipitation</span>
              <span className="text-base font-extrabold text-blue-800 dark:text-blue-300">
                {day.precipitationSum} mm
              </span>
            </div>
          </div>
        </div>

        {/* Hourly Breakdown for that day */}
        {day.hourlyBreakdown && day.hourlyBreakdown.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              Hourly Progression on {day.dayName}
            </h3>
            <div className="flex gap-2.5 overflow-x-auto custom-scrollbar pb-3">
              {day.hourlyBreakdown.map((h, i) => (
                <div
                  key={i}
                  className="shrink-0 flex flex-col items-center justify-between w-20 py-3 px-1.5 rounded-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-800/40"
                >
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{h.formattedTime}</span>
                  <div className="my-1.5">
                    <WeatherIcon name={h.icon} size={22} />
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatTemperature(h.temperature, tempUnit)}
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] font-semibold text-cyan-800 dark:text-cyan-300 mt-1">
                    <Droplets size={9} />
                    <span>{h.precipitationProbability}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold mb-1">
              <Wind size={14} className="text-teal-400" />
              <span>Max Wind</span>
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {formatWindSpeed(day.windSpeedMax, windUnit)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold mb-1">
              <Sun size={14} className="text-amber-500" />
              <span>Max UV</span>
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {day.uvIndexMax} / 11+
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold mb-1">
              <Sunrise size={14} className="text-amber-400" />
              <span>Sunrise</span>
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {day.sunrise}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold mb-1">
              <Sunset size={14} className="text-rose-400" />
              <span>Sunset</span>
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {day.sunset}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-200/40 dark:border-slate-800/80">
          <button
            onClick={() => setSelectedForecastDay(null)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
