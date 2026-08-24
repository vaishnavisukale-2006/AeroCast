import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Thermometer, Sparkles, CloudRain, Sun, SunDim, Wind } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { WeatherInsight } from '../types/weather';

export const SmartInsightsCard: React.FC = () => {
  const { weatherData } = useWeather();

  if (!weatherData || !weatherData.insights || weatherData.insights.length === 0) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp size={18} className="text-amber-400" />;
      case 'TrendingDown':
        return <TrendingDown size={18} className="text-sky-400" />;
      case 'Thermometer':
        return <Thermometer size={18} className="text-indigo-400" />;
      case 'Sparkles':
        return <Sparkles size={18} className="text-cyan-400" />;
      case 'CloudRain':
        return <CloudRain size={18} className="text-blue-400" />;
      case 'Sun':
        return <Sun size={18} className="text-amber-500" />;
      case 'SunDim':
        return <SunDim size={18} className="text-orange-400" />;
      case 'Wind':
        return <Wind size={18} className="text-teal-400" />;
      default:
        return <Lightbulb size={18} className="text-yellow-400" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
            <Lightbulb size={18} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Automated Meteorological Insights
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Machine-generated pattern analysis and behavioral forecasts
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20">
          AI Analysis
        </span>
      </div>

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {weatherData.insights.map((insight: WeatherInsight) => {
          let badgeColor = 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30';
          if (insight.impact === 'warning') {
            badgeColor = 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';
          } else if (insight.impact === 'positive') {
            badgeColor = 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30';
          }

          return (
            <div
              key={insight.id}
              className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50">
                      {renderIcon(insight.icon)}
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {insight.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium mt-1">
                  {insight.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/30 dark:border-slate-800/40 flex justify-between items-center">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                  {insight.badge}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-700 dark:text-slate-300">
                  {insight.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
