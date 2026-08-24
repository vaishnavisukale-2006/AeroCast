import React from 'react';
import { AlertOctagon, ShieldCheck, Clock, ShieldAlert } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { WeatherIcon } from './WeatherIcons';

export const WeatherAlertsCard: React.FC = () => {
  const { weatherData } = useWeather();

  if (!weatherData) return null;

  const { alerts } = weatherData;

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <AlertOctagon size={18} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Meteorological Warnings & Alerts
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Real-time atmospheric hazards and safety advisories
            </p>
          </div>
        </div>

        {alerts.length > 0 ? (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            {alerts.length} Active {alerts.length === 1 ? 'Alert' : 'Alerts'}
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            All Clear
          </span>
        )}
      </div>

      {/* Alerts List or Peaceful Empty State */}
      {alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const isSevere = alert.severity === 'severe' || alert.severity === 'extreme';

            return (
              <div
                key={alert.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isSevere
                    ? 'bg-rose-500/10 border-rose-500/30 shadow-lg shadow-rose-500/5'
                    : 'bg-amber-500/10 border-amber-500/30 shadow-lg shadow-amber-500/5'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-xl ${
                        isSevere ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      <WeatherIcon name={alert.icon} size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{alert.title}</span>
                        <span
                          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                            isSevere
                              ? 'bg-rose-500 text-white'
                              : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 mt-0.5">
                        <span>Source: {alert.source}</span>
                      </p>
                    </div>
                  </div>

                  {/* Time validity */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium bg-white/40 dark:bg-slate-900/40 px-3 py-1 rounded-xl self-start">
                    <Clock size={13} className="text-slate-400" />
                    <span>
                      {alert.startTime} – {alert.endTime}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium my-2">
                  {alert.description}
                </p>

                <div className="mt-3 p-3 rounded-xl bg-white/50 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800 flex items-start gap-2 text-xs">
                  <ShieldAlert size={15} className={isSevere ? 'text-rose-400 shrink-0 mt-0.5' : 'text-amber-400 shrink-0 mt-0.5'} />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Safety Instruction: </span>
                    <span className="text-slate-700 dark:text-slate-300">{alert.instruction}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                No active weather alerts
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                Atmospheric conditions are stable with no extreme hazard events detected for this region.
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 shrink-0">
            Stable Conditions
          </div>
        </div>
      )}
    </div>
  );
};
