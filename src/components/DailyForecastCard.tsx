import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { formatTemperature } from '../utils/formatters';
import { WeatherIcon } from './WeatherIcons';

export const DailyForecastCard: React.FC = () => {
  const { weatherData, setSelectedForecastDay } = useWeather();
  const { tempUnit } = useSettings();

  if (!weatherData || !weatherData.daily.length) return null;

  // Calculate week min and max across all 7 days for accurate proportional range bars
  const weekMin = Math.min(...weatherData.daily.map((d) => d.temperatureMin));
  const weekMax = Math.max(...weatherData.daily.map((d) => d.temperatureMax));
  const tempRange = Math.max(weekMax - weekMin, 1);

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-6 shadow-xl h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
            <Calendar size={18} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              7-Day Forecast
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Click any day for 24-hour detailed breakdown
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Rows List */}
      <div className="space-y-3 flex-1">
        {weatherData.daily.map((day, idx) => {
          const isToday = idx === 0;

          // Compute left and right percentages for the range progress bar
          const leftPercent = Math.max(0, Math.min(100, ((day.temperatureMin - weekMin) / tempRange) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((day.temperatureMax - weekMin) / tempRange) * 100));
          const barWidth = Math.max(8, rightPercent - leftPercent);

          return (
            <div
              key={day.date || idx}
              onClick={() => setSelectedForecastDay(day)}
              className={`flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${
                isToday
                  ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border border-cyan-500/30 hover:border-cyan-400/60'
                  : 'bg-white/20 dark:bg-slate-900/20 hover:bg-white/50 dark:hover:bg-slate-800/50 border border-white/10 dark:border-slate-800/30'
              }`}
              title="Click to view detailed hourly breakdown"
            >
              {/* Day & Date */}
              <div className="w-24 sm:w-28 shrink-0">
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{day.dayName}</span>
                  {isToday && (
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-800 dark:text-cyan-300">
                      Now
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  {day.formattedDate}
                </div>
              </div>

              {/* Icon & Rain Chance */}
              <div className="flex items-center gap-2 w-28 sm:w-32 shrink-0">
                <div className="p-1.5 rounded-xl bg-white/40 dark:bg-slate-800/40">
                  <WeatherIcon name={day.icon} size={22} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[85px]">
                    {day.condition}
                  </div>
                  {day.precipitationProbability > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-cyan-800 dark:text-cyan-300 font-medium">
                      <Droplets size={10} className="text-cyan-400" />
                      <span>{day.precipitationProbability}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Temperature Min, Range Visual Bar, and Temperature Max */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                {/* Min Temp */}
                <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 w-9 text-right">
                  {formatTemperature(day.temperatureMin, tempUnit)}
                </span>

                {/* Range Gradient Bar */}
                <div className="hidden sm:block flex-1 max-w-[120px] h-2 bg-slate-200/50 dark:bg-slate-800/70 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-amber-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidth}%`,
                    }}
                  />
                </div>

                {/* Max Temp */}
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white w-9 text-left">
                  {formatTemperature(day.temperatureMax, tempUnit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
