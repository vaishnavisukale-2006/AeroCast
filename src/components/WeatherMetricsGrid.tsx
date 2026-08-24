import React from 'react';
import { Droplets, Wind, Gauge, Eye, Sun, Cloud, Compass } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import {
  formatTemperature,
  formatWindSpeed,
  formatPressure,
  formatVisibility,
  getUVDetails,
} from '../utils/formatters';

export const WeatherMetricsGrid: React.FC = () => {
  const { weatherData } = useWeather();
  const { tempUnit, windUnit, pressureUnit } = useSettings();

  if (!weatherData) return null;

  const { current, metrics } = weatherData;
  const uvInfo = getUVDetails(current.uvIndex);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. Humidity & Dew Point */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
              <Droplets size={18} />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Humidity
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20">
            {metrics.humidityStatus}
          </span>
        </div>

        <div className="my-3">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {current.humidity}%
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
            The dew point is currently {formatTemperature(current.dewPoint, tempUnit)}
          </p>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${current.humidity}%` }}
          />
        </div>
      </div>

      {/* 2. Wind & Direction */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-800 dark:text-teal-400">
              <Wind size={18} />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Wind Conditions
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20">
            {metrics.windScale}
          </span>
        </div>

        <div className="flex items-center justify-between my-3">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {formatWindSpeed(current.windSpeed, windUnit)}
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
              Gusts up to {formatWindSpeed(current.windGusts, windUnit)}
            </p>
          </div>

          {/* Animated Direction Compass */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 rounded-full border border-teal-500/30 flex items-center justify-center bg-teal-500/5">
              <div
                className="transform transition-transform duration-700"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              >
                <Compass size={22} className="text-teal-400" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">
              {metrics.windDirectionCompass} ({current.windDirection}°)
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
          Atmospheric surface vector (10m altitude)
        </div>
      </div>

      {/* 3. UV Index */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Sun size={18} />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              UV Radiation
            </span>
          </div>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${uvInfo.color}`}>
            {metrics.uvLevel}
          </span>
        </div>

        <div className="my-3">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {current.uvIndex} <span className="text-base font-medium text-slate-700 dark:text-slate-300">/ 11+</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 line-clamp-2">
            {metrics.uvAdvice}
          </p>
        </div>

        {/* UV Spectrum Gradient Bar */}
        <div className="relative w-full h-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-purple-600 overflow-hidden">
          <div
            className="absolute top-0 bottom-0 w-2.5 bg-white border border-slate-900 rounded-full -ml-1 transition-all duration-500"
            style={{ left: `${Math.min(100, Math.max(0, (current.uvIndex / 11) * 100))}%` }}
          />
        </div>
      </div>

      {/* 4. Atmospheric Pressure */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-800 dark:text-indigo-400">
              <Gauge size={18} />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Pressure
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border border-indigo-500/20 capitalize">
            {metrics.pressureTrend}
          </span>
        </div>

        <div className="my-3">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {formatPressure(current.surfacePressure, pressureUnit)}
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
            {current.surfacePressure >= 1013 ? 'High pressure barometric system' : 'Low pressure atmospheric cell'}
          </p>
        </div>

        <div className="w-full h-2 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(20, ((current.surfacePressure - 960) / 90) * 100))}%` }}
          />
        </div>
      </div>

      {/* 5. Visibility */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-400">
              <Eye size={18} />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Visibility
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
            {metrics.visibilityStatus}
          </span>
        </div>

        <div className="my-3">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {formatVisibility(current.visibility, tempUnit)}
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
            {current.visibility >= 9000
              ? 'Clear horizon with optimal sight line'
              : 'Mild haze or mist slightly affecting distance'}
          </p>
        </div>

        <div className="w-full h-2 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(10, (current.visibility / 10000) * 100))}%` }}
          />
        </div>
      </div>

      {/* 6. Cloud Coverage */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-800 dark:text-blue-400">
              <Cloud size={18} />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Cloud Cover
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-500/20">
            {metrics.cloudStatus}
          </span>
        </div>

        <div className="my-3">
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {current.cloudCover}%
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
            {current.cloudCover > 60 ? 'Thick stratus / cumulonimbus coverage' : 'Scattered high-altitude cirrus clouds'}
          </p>
        </div>

        <div className="w-full h-2 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${current.cloudCover}%` }}
          />
        </div>
      </div>
    </div>
  );
};
