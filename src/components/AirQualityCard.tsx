import React from 'react';
import { Wind, ShieldCheck, Activity } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export const AirQualityCard: React.FC = () => {
  const { weatherData } = useWeather();

  if (!weatherData || !weatherData.airQuality) return null;

  const aqiData = weatherData.airQuality;
  const aqiVal = aqiData.aqi;

  // Semicircular Gauge needle calculation (0 to 300 scale mapped to 180 degrees)
  const clampedAqi = Math.min(300, Math.max(0, aqiVal));
  const gaugeAngle = (clampedAqi / 300) * 180 - 90; // -90 deg (left) to +90 deg (right)

  const pollutants = [
    aqiData.pm25,
    aqiData.pm10,
    aqiData.o3,
    aqiData.no2,
    aqiData.so2,
    aqiData.co,
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
            <Wind size={22} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Air Quality & Environmental Index
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Continuous atmospheric particulate and chemical surveillance
            </p>
          </div>
        </div>

        {/* Category Status Pill */}
        <div className={`px-4 py-1.5 rounded-full font-bold text-xs border ${aqiData.badgeBg} ${aqiData.color}`}>
          {aqiData.category}
        </div>
      </div>

      {/* Main AQI Gauge & Summary Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-8 pb-6 border-b border-slate-200/40 dark:border-slate-800/80">
        {/* Semicircle Gauge Visual */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-56 h-28 overflow-hidden flex items-end justify-center">
            {/* Semicircle Color Track */}
            <div className="w-56 h-56 rounded-full border-[14px] border-slate-200/40 dark:border-slate-800 absolute top-0" />
            <svg viewBox="0 0 200 100" className="w-52 h-26 absolute top-0 overflow-visible">
              <defs>
                <linearGradient id="aqiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="25%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="75%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <path
                d="M 15 95 A 85 85 0 0 1 185 95"
                fill="none"
                stroke="url(#aqiGrad)"
                strokeWidth="14"
                strokeLinecap="round"
              />
            </svg>

            {/* Gauge Needle */}
            <div
              className="absolute bottom-0 w-1.5 h-20 bg-slate-900 dark:bg-white rounded-full origin-bottom transform transition-transform duration-1000 shadow-md"
              style={{ transform: `rotate(${gaugeAngle}deg)` }}
            />
            {/* Center Pivot Circle */}
            <div className="absolute bottom-0 w-5 h-5 rounded-full bg-slate-900 dark:bg-white border-4 border-cyan-500 shadow-lg" />
          </div>

          {/* AQI Score Output */}
          <div className="text-center mt-3">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {aqiVal}
            </span>
            <span className="text-xs uppercase font-bold text-slate-700 dark:text-slate-300 block tracking-widest">
              US AQI
            </span>
          </div>
        </div>

        {/* Explanation & Health Advice Box */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/50 border border-white/30 dark:border-slate-800/60">
            <div className="flex items-center gap-2 mb-1 text-slate-900 dark:text-white font-bold text-sm">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Health Outlook</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              &ldquo;{aqiData.explanation}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/30 dark:bg-slate-900/30">
              <span className="text-slate-700 dark:text-slate-300 font-semibold block">European AQI</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {aqiData.europeanAqi || Math.round(aqiVal * 0.5)} / 100
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/30 dark:bg-slate-900/30">
              <span className="text-slate-700 dark:text-slate-300 font-semibold block">Primary Risk Factor</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                {aqiVal > 50 ? 'PM2.5 Particles' : 'None Detected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Detailed Pollutant Cards */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-1.5">
          <Activity size={15} />
          <span>Core Atmospheric Pollutants</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {pollutants.map((item) => {
            const percentOfSafe = Math.min(100, Math.round((item.value / item.maxSafe) * 100));
            const isSafe = item.status === 'Good';

            return (
              <div
                key={item.code}
                className="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white font-mono">
                    {item.code}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                      isSafe
                        ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="my-1">
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {item.value}{' '}
                    <span className="text-[10px] font-normal text-slate-700 dark:text-slate-300">{item.unit}</span>
                  </div>
                  <div className="text-[10px] text-slate-700 dark:text-slate-300 truncate" title={item.name}>
                    {item.name}
                  </div>
                </div>

                {/* Micro Progress Bar vs Max Safe */}
                <div className="w-full mt-2">
                  <div className="w-full h-1.5 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isSafe ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${percentOfSafe}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-700 dark:text-slate-300 mt-1 block">
                    Safe limit: {item.maxSafe}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
