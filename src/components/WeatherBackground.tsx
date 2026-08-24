import React from 'react';
import { WeatherThemeType } from '../types/weather';

interface WeatherBackgroundProps {
  theme?: WeatherThemeType;
  isDay?: boolean;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ theme = 'clear-day', isDay = true }) => {
  // Determine gradient based on theme and day/night
  let gradientClass = 'from-slate-950 via-slate-900 to-slate-950';

  switch (theme) {
    case 'clear-day':
      gradientClass = 'from-sky-900 via-blue-950 to-slate-950 dark:from-slate-950 dark:via-blue-950/60 dark:to-slate-950';
      break;
    case 'clear-night':
      gradientClass = 'from-indigo-950 via-slate-950 to-slate-950 dark:from-slate-950 dark:via-indigo-950/40 dark:to-slate-950';
      break;
    case 'partly-cloudy-day':
      gradientClass = 'from-blue-900 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950';
      break;
    case 'partly-cloudy-night':
      gradientClass = 'from-slate-900 via-indigo-950 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950';
      break;
    case 'cloudy':
      gradientClass = 'from-slate-800 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950';
      break;
    case 'rain':
    case 'drizzle':
      gradientClass = 'from-cyan-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-cyan-950/40 dark:to-slate-950';
      break;
    case 'thunderstorm':
      gradientClass = 'from-indigo-950 via-purple-950 to-slate-950 dark:from-slate-950 dark:via-purple-950/40 dark:to-slate-950';
      break;
    case 'snow':
      gradientClass = 'from-cyan-950 via-sky-950 to-slate-950 dark:from-slate-950 dark:via-cyan-950/30 dark:to-slate-950';
      break;
    case 'fog':
      gradientClass = 'from-slate-800 via-zinc-900 to-slate-950 dark:from-slate-950 dark:via-zinc-900 dark:to-slate-950';
      break;
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-1000">
      {/* Dynamic Gradient Base */}
      <div className={`absolute inset-0 bg-gradient-to-b ${gradientClass} transition-all duration-1000`} />

      {/* Atmospheric Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Sunny Day Ambient Sun Glow */}
      {isDay && (theme === 'clear-day' || theme === 'partly-cloudy-day') && (
        <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-amber-400/15 blur-3xl animate-pulse-slow" />
      )}

      {/* Clear Night Stars */}
      {!isDay && (theme === 'clear-night' || theme === 'partly-cloudy-night') && (
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-12 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute top-24 right-1/3 w-1.5 h-1.5 bg-blue-200 rounded-full opacity-80" />
          <div className="absolute top-48 left-1/6 w-1 h-1 bg-white rounded-full opacity-60" />
          <div className="absolute top-16 right-1/6 w-1 h-1 bg-amber-100 rounded-full opacity-70" />
          <div className="absolute top-36 right-1/2 w-1.5 h-1.5 bg-indigo-200 rounded-full opacity-85" />
          <div className="absolute top-72 left-1/3 w-1 h-1 bg-white rounded-full opacity-50" />
        </div>
      )}

      {/* Rain Droplets Effect */}
      {(theme === 'rain' || theme === 'drizzle' || theme === 'thunderstorm') && (
        <div className="absolute inset-0 opacity-40 overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-blue-500 rounded-full animate-rain"
              style={{
                left: `${(i * 5.8) + 2}%`,
                height: `${Math.random() * 40 + 60}px`,
                animationDelay: `${(i * 0.15) % 1.5}s`,
                animationDuration: `${0.8 + (i % 5) * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Snow Particles Effect */}
      {theme === 'snow' && (
        <div className="absolute inset-0 opacity-60 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bg-white rounded-full animate-snow blur-[0.5px]"
              style={{
                left: `${(i * 5) + 2}%`,
                width: `${(i % 3) * 2 + 3}px`,
                height: `${(i % 3) * 2 + 3}px`,
                animationDelay: `${(i * 0.4) % 4}s`,
                animationDuration: `${5 + (i % 4)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Thunderstorm Lightning Flash */}
      {theme === 'thunderstorm' && (
        <div className="absolute inset-0 bg-indigo-300/10 animate-lightning pointer-events-none" />
      )}

      {/* Cloud Drift Layer */}
      {(theme === 'cloudy' || theme === 'partly-cloudy-day' || theme === 'partly-cloudy-night' || theme === 'fog') && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 -left-40 w-[600px] h-64 bg-slate-400/20 blur-3xl rounded-full animate-clouds" />
          <div className="absolute top-60 -right-40 w-[700px] h-72 bg-blue-300/10 blur-3xl rounded-full animate-clouds" style={{ animationDelay: '5s' }} />
        </div>
      )}

      {/* Fine Noise Texture Overlay for Premium Finish */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
