import React from 'react';
import { Sunrise, Sunset, Sun } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export const SunMoonCycleCard: React.FC = () => {
  const { weatherData } = useWeather();

  if (!weatherData) return null;

  const { sunCycle } = weatherData;
  const progress = sunCycle.sunProgressPercent;

  // Compute SVG arc coordinate based on progress (0 to 100)
  // Arc path: M 30 110 A 110 75 0 0 1 250 110 (width 280, height 130)
  // Parametric angle for semi-ellipse: angle from PI (180deg) to 0 (0deg)
  const angle = Math.PI - (progress / 100) * Math.PI;
  const cx = 140;
  const rx = 110;
  const ry = 75;
  const cy = 110;

  const sunX = cx + rx * Math.cos(angle);
  const sunY = cy - ry * Math.sin(angle);

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-6 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Sun size={18} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Sun & Daylight Cycle
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Solar position and twilight tracking
            </p>
          </div>
        </div>

        {/* Daylight Remaining Pill */}
        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25">
          {sunCycle.remainingDaylight}
        </div>
      </div>

      {/* SVG Solar Arc Visualization */}
      <div className="relative flex items-center justify-center my-4 py-2">
        <svg viewBox="0 0 280 130" className="w-full max-w-[280px] overflow-visible">
          <defs>
            <linearGradient id="sunArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="sunFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background Arc Path (Dashed) */}
          <path
            d="M 30 110 A 110 75 0 0 1 250 110"
            fill="none"
            stroke="currentColor"
            className="text-slate-300 dark:text-slate-800"
            strokeWidth="2.5"
            strokeDasharray="5 5"
          />

          {/* Horizon Line */}
          <line
            x1="10"
            y1="110"
            x2="270"
            y2="110"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="1.5"
          />

          {/* Sun Marker Position */}
          {sunCycle.isDaytime ? (
            <g transform={`translate(${sunX}, ${sunY})`}>
              <circle r="12" fill="#f59e0b" opacity="0.25" className="animate-pulse" />
              <circle r="7" fill="#f59e0b" filter="url(#glow)" />
              <circle r="3.5" fill="#fff" />
            </g>
          ) : (
            <g transform={`translate(${sunX}, ${sunY})`}>
              <circle r="6" fill="#818cf8" opacity="0.8" />
              <circle r="3" fill="#c7d2fe" />
            </g>
          )}

          {/* Sunrise Endpoint Marker */}
          <circle cx="30" cy="110" r="3.5" fill="#f59e0b" />
          {/* Sunset Endpoint Marker */}
          <circle cx="250" cy="110" r="3.5" fill="#f43f5e" />
        </svg>

        {/* Center Daylight Duration Text */}
        <div className="absolute bottom-1 text-center">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block">
            Daylight Duration
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            {sunCycle.daylightDuration}
          </span>
        </div>
      </div>

      {/* Bottom Times: Sunrise & Sunset */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/40 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/30 dark:bg-slate-900/30">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
            <Sunrise size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold block">
              Sunrise
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {sunCycle.sunriseFormatted}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/30 dark:bg-slate-900/30">
          <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
            <Sunset size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold block">
              Sunset
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {sunCycle.sunsetFormatted}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
