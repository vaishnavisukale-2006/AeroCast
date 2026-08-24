import React from 'react';
import { MapPin, ArrowUp, ArrowDown, Droplets, Wind, Compass, Sun, ShieldAlert, Sparkles } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { formatTemperature, formatWindSpeed, formatPressure, formatVisibility, formatLocalDate } from '../utils/formatters';
import { WeatherIcon } from './WeatherIcons';

export const CurrentWeatherCard: React.FC = () => {
  const { location, weatherData } = useWeather();
  const { tempUnit, windUnit, pressureUnit } = useSettings();

  if (!weatherData) return null;

  const { current, daily, metrics, isDemoData } = weatherData;
  const today = daily[0];

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel-glow border border-white/40 dark:border-cyan-500/20 p-6 sm:p-8 md:p-10 shadow-2xl transition-all">
      {/* Ambient background glow orb */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-600/10 dark:bg-blue-600/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between gap-8">
        {/* Top Header: Location, Region, Date, and Badges */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center justify-center p-1.5 rounded-xl bg-cyan-500/15 text-cyan-800 dark:text-cyan-400">
                <MapPin size={18} />
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {location.name}
              </h1>
              {location.countryCode && (
                <span className="px-2 py-0.5 text-xs font-bold font-mono rounded-lg bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                  {location.countryCode}
                </span>
              )}
            </div>

            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {[location.admin1, location.country].filter(Boolean).join(', ')} •{' '}
              <span className="text-slate-700 dark:text-slate-300 font-normal">
                {formatLocalDate(current.time, location.timezone)}
              </span>
            </p>
          </div>

          {/* Condition Pills & Demo Badge */}
          <div className="flex flex-wrap items-center gap-2">
            {isDemoData && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                <Sparkles size={12} className="text-amber-400" />
                Demo Data
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Live Forecast
            </span>
          </div>
        </div>

        {/* Center: Massive Temperature & Weather Icon Display */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 my-2">
          {/* Temperature and High/Low */}
          <div className="flex items-baseline gap-4">
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 dark:from-white dark:via-slate-100 dark:to-cyan-200 bg-clip-text text-transparent drop-shadow-sm">
              {formatTemperature(current.temperature, tempUnit)}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">
                Feels like{' '}
                <span className="text-slate-900 dark:text-white font-bold">
                  {formatTemperature(current.apparentTemperature, tempUnit)}
                </span>
              </div>

              {today && (
                <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
                  <span className="flex items-center text-rose-500 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                    <ArrowUp size={14} className="mr-0.5" />
                    {formatTemperature(today.temperatureMax, tempUnit)}
                  </span>
                  <span className="flex items-center text-sky-500 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
                    <ArrowDown size={14} className="mr-0.5" />
                    {formatTemperature(today.temperatureMin, tempUnit)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Condition Icon & Condition Text */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative flex items-center justify-center p-4 rounded-3xl bg-gradient-to-tr from-white/30 to-white/10 dark:from-slate-800/60 dark:to-slate-900/60 border border-white/40 dark:border-white/10 shadow-lg animate-float">
              <WeatherIcon name={current.icon} size={68} className="drop-shadow-md" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {current.condition}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-xs mt-0.5">
                {current.precipitationProbability > 40
                  ? `${current.precipitationProbability}% chance of precipitation today`
                  : 'Favorable conditions with calm atmospheric pressure'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Quick-Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-200/40 dark:border-slate-800/80">
          {/* Humidity */}
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-1">
              <Droplets size={14} className="text-cyan-400" />
              <span>Humidity</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {current.humidity}%
            </div>
            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              Dew: {formatTemperature(current.dewPoint, tempUnit)}
            </div>
          </div>

          {/* Wind */}
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-1">
              <Wind size={14} className="text-teal-400" />
              <span>Wind Speed</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {formatWindSpeed(current.windSpeed, windUnit)}
            </div>
            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
              <Compass size={11} className="text-blue-400" />
              {metrics.windDirectionCompass} ({current.windDirection}°)
            </div>
          </div>

          {/* Pressure */}
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-1">
              <Sun size={14} className="text-amber-400" />
              <span>Pressure</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {formatPressure(current.surfacePressure, pressureUnit)}
            </div>
            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium capitalize">
              {metrics.pressureTrend}
            </div>
          </div>

          {/* Visibility */}
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-1">
              <ShieldAlert size={14} className="text-emerald-400" />
              <span>Visibility</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {formatVisibility(current.visibility, tempUnit)}
            </div>
            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              {metrics.visibilityStatus}
            </div>
          </div>

          {/* UV Index */}
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-1">
              <Sun size={14} className="text-amber-500" />
              <span>UV Index</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{current.uvIndex}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                current.uvIndex <= 2 ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' :
                current.uvIndex <= 5 ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300' :
                current.uvIndex <= 7 ? 'bg-orange-500/20 text-orange-800 dark:text-orange-300' :
                'bg-rose-500/20 text-rose-800 dark:text-rose-300'
              }`}>
                {metrics.uvLevel}
              </span>
            </div>
            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              Max: {today?.uvIndexMax ?? current.uvIndex}
            </div>
          </div>

          {/* Cloud Cover */}
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-1">
              <Droplets size={14} className="text-blue-400" />
              <span>Cloud Cover</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {current.cloudCover}%
            </div>
            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate">
              {metrics.cloudStatus}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
