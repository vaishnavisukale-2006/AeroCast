import React, { useState, useEffect } from 'react';
import { CloudLightning, Moon, Sun, Settings, Sparkles, RefreshCw, Bot } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { formatLocalTime, formatLocalDate } from '../utils/formatters';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenAiChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenAiChat }) => {
  const { location, weatherData, refreshWeather, isLoading } = useWeather();
  const { tempUnit, setTempUnit, theme, toggleTheme, isDemoMode } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isDemo = weatherData?.isDemoData || isDemoMode;

  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 border border-cyan-300/30">
              <CloudLightning className="text-white w-6 h-6 animate-pulse-slow" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-cyan-200 bg-clip-text text-transparent">
                  AeroCast
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                  Intel v1.0
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 hidden sm:block">
                Precision Atmospheric Intelligence
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl glass-panel text-slate-800 dark:text-slate-200 hover:text-cyan-500 transition-colors"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl glass-panel text-slate-800 dark:text-slate-200 hover:text-cyan-500 transition-colors"
              title="Settings"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Localized Live Clock & City Timestamp */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl glass-panel text-slate-800 dark:text-slate-200 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <span className="font-medium text-slate-700 dark:text-slate-300">Local Time: </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {formatLocalTime(currentTime, location.timezone)}
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-700 dark:text-slate-300">
            {formatLocalDate(currentTime, location.timezone)}
          </span>
        </div>

        {/* Header Right Action Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Demo Mode Indicator Badge */}
          {isDemo && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold animate-pulse">
              <Sparkles size={14} className="text-amber-400" />
              <span>Demo Mode</span>
            </div>
          )}

          {/* Quick Temp Unit Toggle */}
          <div className="flex items-center p-1 rounded-xl glass-panel text-xs font-semibold">
            <button
              onClick={() => setTempUnit('celsius')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                tempUnit === 'celsius'
                  ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/40'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setTempUnit('fahrenheit')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                tempUnit === 'fahrenheit'
                  ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/40'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Quick AI Assistant Trigger */}
          {onOpenAiChat && (
            <button
              onClick={onOpenAiChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all active:scale-95"
              title="Open AeroAI Weather Assistant"
            >
              <Bot size={15} />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          )}

          {/* Quick Refresh Button */}
          <button
            onClick={() => refreshWeather()}
            disabled={isLoading}
            className={`p-2.5 rounded-xl glass-panel text-slate-800 dark:text-slate-200 hover:text-cyan-500 transition-all ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
            }`}
            title="Refresh Live Data"
            aria-label="Refresh Live Data"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin text-cyan-400' : ''} />
          </button>

          {/* Dark / Light Toggle (Desktop) */}
          <button
            onClick={toggleTheme}
            className="hidden md:flex p-2.5 rounded-xl glass-panel text-slate-800 dark:text-slate-200 hover:text-cyan-500 hover:scale-105 active:scale-95 transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-400" />}
          </button>

          {/* Settings Modal Button (Desktop) */}
          <button
            onClick={onOpenSettings}
            className="hidden md:flex p-2.5 rounded-xl glass-panel text-slate-800 dark:text-slate-200 hover:text-cyan-500 hover:scale-105 active:scale-95 transition-all"
            title="Settings & Preferences"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
