import React from 'react';
import {
  X,
  Moon,
  Sun,
  Monitor,
  Thermometer,
  Wind,
  Gauge,
  Sparkles,
  Trash2,
  Heart,
  Bell,
  CheckCircle2,
  Bot,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { TemperatureUnit, WindSpeedUnit, PressureUnit, ThemeMode } from '../types/weather';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    tempUnit,
    setTempUnit,
    windUnit,
    setWindUnit,
    pressureUnit,
    setPressureUnit,
    theme,
    setTheme,
    isDemoMode,
    toggleDemoMode,
    favorites,
    removeFavorite,
    notifications,
    updateNotifications,
  } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-xl rounded-3xl glass-panel-glow border border-white/50 dark:border-slate-700/80 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-slate-800/80 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Dashboard Preferences
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Personalize units, notifications, themes, and intelligence options
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition-all"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {/* 1. Theme Appearance */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-3">
              <span>Theme Appearance</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { mode: 'dark', label: 'Dark Mode', icon: Moon },
                  { mode: 'light', label: 'Light Mode', icon: Sun },
                  { mode: 'system', label: 'System', icon: Monitor },
                ] as const
              ).map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode as ThemeMode)}
                  className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl font-semibold text-xs transition-all ${
                    theme === mode
                      ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-300/40'
                      : 'glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Temperature Unit */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-3">
              <Thermometer size={14} className="text-amber-500" />
              <span>Temperature Scale</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(
                [
                  { unit: 'celsius', label: 'Celsius (°C)' },
                  { unit: 'fahrenheit', label: 'Fahrenheit (°F)' },
                ] as const
              ).map(({ unit, label }) => (
                <button
                  key={unit}
                  onClick={() => setTempUnit(unit as TemperatureUnit)}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all ${
                    tempUnit === unit
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20'
                      : 'glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Wind Speed Unit */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-3">
              <Wind size={14} className="text-teal-500" />
              <span>Wind Speed Unit</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { unit: 'kmh', label: 'km/h' },
                  { unit: 'mph', label: 'mph' },
                  { unit: 'ms', label: 'm/s' },
                  { unit: 'knots', label: 'knots' },
                ] as const
              ).map(({ unit, label }) => (
                <button
                  key={unit}
                  onClick={() => setWindUnit(unit as WindSpeedUnit)}
                  className={`py-2.5 px-2 rounded-2xl text-xs font-semibold text-center transition-all ${
                    windUnit === unit
                      ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/30'
                      : 'glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Atmospheric Pressure Unit */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-3">
              <Gauge size={14} className="text-indigo-500" />
              <span>Pressure Unit</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { unit: 'hpa', label: 'hPa / mbar' },
                  { unit: 'inhg', label: 'inHg' },
                  { unit: 'mmhg', label: 'mmHg' },
                ] as const
              ).map(({ unit, label }) => (
                <button
                  key={unit}
                  onClick={() => setPressureUnit(unit as PressureUnit)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-semibold text-center transition-all ${
                    pressureUnit === unit
                      ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/30'
                      : 'glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Browser Notifications Preferences */}
          <div className="p-4 rounded-2xl glass-panel space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
                  <Bell size={16} />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                    Browser Hazard Notifications
                  </span>
                  <span className="text-xs text-slate-700 dark:text-slate-300">
                    Receive active weather and air quality alerts
                  </span>
                </div>
              </div>

              <button
                onClick={() => updateNotifications({ enabled: !notifications.enabled })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications.enabled ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                role="switch"
                aria-checked={notifications.enabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {notifications.enabled && (
              <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.severeAlerts}
                    onChange={(e) => updateNotifications({ severeAlerts: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Severe Alerts</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.rainAlerts}
                    onChange={(e) => updateNotifications({ rainAlerts: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Heavy Rain</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.aqiAlerts}
                    onChange={(e) => updateNotifications({ aqiAlerts: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Hazardous AQI</span>
                </label>
              </div>
            )}
          </div>

          {/* 6. AI Intelligence & Engine Information */}
          <div className="p-4 rounded-2xl glass-panel flex items-start gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-sm shrink-0">
              <Bot size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  AeroAI Assistant Engine
                </span>
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30">
                  <CheckCircle2 size={10} /> Active
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                Powered by integrated meteorological semantic reasoning. Uses live atmospheric sensor feeds for personalized advice.
              </p>
            </div>
          </div>

          {/* 7. Demo Mode Toggle Switch */}
          <div className="p-4 rounded-2xl glass-panel flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Demo Mode (Mock Data)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/30">
                  Offline Ready
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                Emulates comprehensive multi-city weather data without live network calls.
              </p>
            </div>

            <button
              onClick={toggleDemoMode}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isDemoMode ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              role="switch"
              aria-checked={isDemoMode}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isDemoMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 8. Saved Favorite Locations List */}
          {favorites.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-3">
                <Heart size={14} className="text-rose-500" />
                <span>Saved Favorites ({favorites.length})</span>
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                {favorites.map((fav) => (
                  <div
                    key={fav.id || fav.name}
                    className="flex items-center justify-between p-3 rounded-xl glass-panel text-xs font-medium"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white mr-2">
                        {fav.name}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {[fav.admin1, fav.country].filter(Boolean).join(', ')}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFavorite(fav.id || fav.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove favorite"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200/40 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
          <span>AeroCast Weather Intelligence • Stage 3</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
