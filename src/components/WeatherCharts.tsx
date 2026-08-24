import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Thermometer, Droplets, Wind, Waves } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { getRawTemperature } from '../utils/formatters';

type ChartMetric = 'temperature' | 'precipitation' | 'wind' | 'humidity';
type Timeframe = 'hourly' | 'daily';

export const WeatherCharts: React.FC = () => {
  const { weatherData } = useWeather();
  const { tempUnit, windUnit } = useSettings();
  const [metric, setMetric] = useState<ChartMetric>('temperature');
  const [timeframe, setTimeframe] = useState<Timeframe>('hourly');

  if (!weatherData) return null;

  // Prepare chart dataset
  const chartData =
    timeframe === 'hourly'
      ? weatherData.hourly.map((h) => ({
          label: h.formattedTime,
          fullTime: h.time,
          temperature: getRawTemperature(h.temperature, tempUnit),
          apparentTemperature: getRawTemperature(h.apparentTemperature, tempUnit),
          precipitation: h.precipitationProbability,
          windSpeed:
            windUnit === 'mph'
              ? Math.round(h.windSpeed * 0.621371 * 10) / 10
              : windUnit === 'ms'
              ? Math.round((h.windSpeed / 3.6) * 10) / 10
              : windUnit === 'knots'
              ? Math.round(h.windSpeed * 0.539957 * 10) / 10
              : Math.round(h.windSpeed * 10) / 10,
          humidity: h.humidity,
          condition: h.condition,
        }))
      : weatherData.daily.map((d) => ({
          label: d.shortDayName,
          fullTime: d.formattedDate,
          temperature: getRawTemperature(d.temperatureMax, tempUnit),
          temperatureMin: getRawTemperature(d.temperatureMin, tempUnit),
          precipitation: d.precipitationProbability,
          windSpeed:
            windUnit === 'mph'
              ? Math.round(d.windSpeedMax * 0.621371 * 10) / 10
              : windUnit === 'ms'
              ? Math.round((d.windSpeedMax / 3.6) * 10) / 10
              : windUnit === 'knots'
              ? Math.round(d.windSpeedMax * 0.539957 * 10) / 10
              : Math.round(d.windSpeedMax * 10) / 10,
          humidity: 60, // estimate for daily
          condition: d.condition,
        }));

  // Custom Glassmorphism Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3.5 rounded-2xl glass-panel-glow border border-white/50 dark:border-cyan-500/30 shadow-2xl backdrop-blur-2xl text-xs font-semibold">
          <div className="text-slate-700 dark:text-slate-300 font-medium mb-1 flex items-center justify-between gap-3">
            <span>{data.label}</span>
            <span className="text-[10px] text-cyan-800 dark:text-cyan-300">{data.condition}</span>
          </div>

          {metric === 'temperature' && (
            <div>
              <div className="text-base font-extrabold text-amber-500 dark:text-amber-400">
                {timeframe === 'daily' ? `High: ${data.temperature}°` : `${data.temperature}°`}
                {tempUnit === 'fahrenheit' ? 'F' : 'C'}
              </div>
              {timeframe === 'daily' && (
                <div className="text-sky-500 dark:text-sky-400 text-xs font-semibold">
                  Low: {data.temperatureMin}°{tempUnit === 'fahrenheit' ? 'F' : 'C'}
                </div>
              )}
              {timeframe === 'hourly' && data.apparentTemperature !== undefined && (
                <div className="text-slate-700 dark:text-slate-300 text-[11px] font-normal">
                  Feels like: {data.apparentTemperature}°{tempUnit === 'fahrenheit' ? 'F' : 'C'}
                </div>
              )}
            </div>
          )}

          {metric === 'precipitation' && (
            <div className="text-base font-extrabold text-cyan-800 dark:text-cyan-300">
              {data.precipitation}% probability
            </div>
          )}

          {metric === 'wind' && (
            <div className="text-base font-extrabold text-teal-800 dark:text-teal-300">
              {data.windSpeed} {windUnit}
            </div>
          )}

          {metric === 'humidity' && (
            <div className="text-base font-extrabold text-blue-800 dark:text-blue-300">
              {data.humidity}% relative humidity
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-6 shadow-xl">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
            <TrendingUp size={18} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Weather Dynamics & Trends
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Interactive temporal meteorological graphs
            </p>
          </div>
        </div>

        {/* Metric Selector Tabs & Timeframe Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric tabs */}
          <div className="flex items-center p-1 rounded-xl glass-panel text-xs font-semibold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setMetric('temperature')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                metric === 'temperature'
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Thermometer size={14} />
              <span>Temp</span>
            </button>
            <button
              onClick={() => setMetric('precipitation')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                metric === 'precipitation'
                  ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Droplets size={14} />
              <span>Precip %</span>
            </button>
            <button
              onClick={() => setMetric('wind')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                metric === 'wind'
                  ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wind size={14} />
              <span>Wind</span>
            </button>
            <button
              onClick={() => setMetric('humidity')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                metric === 'humidity'
                  ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Waves size={14} />
              <span>Humidity</span>
            </button>
          </div>

          {/* Timeframe Toggle */}
          <div className="flex items-center p-1 rounded-xl glass-panel text-xs font-semibold">
            <button
              onClick={() => setTimeframe('hourly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'hourly'
                  ? 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'daily'
                  ? 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              7 Days
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {metric === 'precipitation' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="precipBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
              <XAxis dataKey="label" stroke="rgba(148, 163, 184, 0.6)" tickLine={false} fontSize={11} />
              <YAxis
                stroke="rgba(148, 163, 184, 0.6)"
                tickLine={false}
                fontSize={11}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="precipitation" fill="url(#precipBarGrad)" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {/* Temperature Gradient */}
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                {/* Wind Gradient */}
                <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
                {/* Humidity Gradient */}
                <linearGradient id="humidityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
              <XAxis dataKey="label" stroke="rgba(148, 163, 184, 0.6)" tickLine={false} fontSize={11} />
              <YAxis stroke="rgba(148, 163, 184, 0.6)" tickLine={false} fontSize={11} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />

              {metric === 'temperature' && (
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fill="url(#tempGrad)"
                  dot={{ fill: '#f59e0b', r: 3, strokeWidth: 1, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                />
              )}

              {metric === 'wind' && (
                <Area
                  type="monotone"
                  dataKey="windSpeed"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  fill="url(#windGrad)"
                  dot={{ fill: '#14b8a6', r: 3, strokeWidth: 1, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
                />
              )}

              {metric === 'humidity' && (
                <Area
                  type="monotone"
                  dataKey="humidity"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#humidityGrad)"
                  dot={{ fill: '#3b82f6', r: 3, strokeWidth: 1, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
