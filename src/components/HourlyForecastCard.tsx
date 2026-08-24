import React, { useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Droplets, Wind } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { formatTemperature, formatWindSpeed } from '../utils/formatters';
import { WeatherIcon } from './WeatherIcons';

export const HourlyForecastCard: React.FC = () => {
  const { weatherData } = useWeather();
  const { tempUnit, windUnit } = useSettings();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!weatherData || !weatherData.hourly.length) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-6 shadow-xl">
      {/* Header with Title and Scroll buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
            <Clock size={18} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Hourly Forecast
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Next 24 hours atmospheric progression
            </p>
          </div>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition-all"
            title="Scroll left"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition-all"
            title="Scroll right"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-3 pt-1 scroll-smooth"
      >
        {weatherData.hourly.map((hour, idx) => {
          const isNow = idx === 0;
          return (
            <div
              key={hour.time || idx}
              className={`shrink-0 flex flex-col items-center justify-between w-24 sm:w-28 py-3.5 px-2 rounded-2xl transition-all ${
                isNow
                  ? 'bg-gradient-to-b from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 shadow-md shadow-cyan-500/10'
                  : 'bg-white/30 dark:bg-slate-900/30 hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/20 dark:border-slate-800/40'
              }`}
            >
              {/* Hour time */}
              <span className={`text-xs font-semibold ${isNow ? 'text-cyan-800 dark:text-cyan-300' : 'text-slate-700 dark:text-slate-300'}`}>
                {hour.formattedTime}
              </span>

              {/* Weather Icon */}
              <div className="my-2.5 transform transition-transform hover:scale-110">
                <WeatherIcon name={hour.icon} size={30} />
              </div>

              {/* Temperature */}
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {formatTemperature(hour.temperature, tempUnit)}
              </span>

              {/* Rain Chance % */}
              <div className="flex items-center gap-1 mt-2 text-[11px] font-semibold text-cyan-800 dark:text-cyan-300">
                <Droplets size={11} className={hour.precipitationProbability > 30 ? 'text-cyan-400 fill-cyan-400' : 'text-slate-400'} />
                <span>{hour.precipitationProbability}%</span>
              </div>

              {/* Wind mini tag */}
              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-700 dark:text-slate-300">
                <Wind size={10} className="text-teal-400" />
                <span>{formatWindSpeed(hour.windSpeed, windUnit, false)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
