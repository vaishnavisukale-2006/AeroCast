import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Lightbulb,
  Bot,
  Wind,
  Map as MapIcon,
  GitCompare,
  Star,
  Settings,
  History,
  LucideIcon,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { NavigationTab } from '../types/weather';

interface NavbarProps {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenAiChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHistory, onOpenSettings }) => {
  const { activeTab, setActiveTab } = useWeather();

  const navItems: { id: NavigationTab; label: string; icon: LucideIcon }[] = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'forecast', label: '7-Day Outlook', icon: CalendarDays },
    { id: 'insights', label: 'Smart Insights', icon: Lightbulb },
    { id: 'ai', label: 'AeroAI Assistant', icon: Bot },
    { id: 'airquality', label: 'Air Quality', icon: Wind },
    { id: 'map', label: 'Weather Map', icon: MapIcon },
    { id: 'compare', label: 'Compare Cities', icon: GitCompare },
  ];

  return (
    <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-4">
      <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl glass-panel-glow border border-white/50 dark:border-slate-800/80 shadow-lg overflow-x-auto no-scrollbar">
        {/* Main Tab Links */}
        <div className="flex items-center gap-1.5 min-w-max">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Actions (History, Favorites quick filter, Settings) */}
        <div className="flex items-center gap-1.5 min-w-max pl-2 border-l border-slate-200/40 dark:border-slate-800/80">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold glass-panel text-slate-700 dark:text-slate-300 hover:text-cyan-800 dark:hover:text-cyan-300 hover:bg-white/60 dark:hover:bg-slate-800 transition-all"
            title="View Recent Searches"
          >
            <History size={15} />
            <span className="hidden sm:inline">History</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'favorites'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                : 'glass-panel text-slate-700 dark:text-slate-300 hover:text-amber-500'
            }`}
            title="Saved Favorite Locations"
          >
            <Star size={15} className={activeTab === 'favorites' ? 'fill-white' : 'text-amber-400'} />
            <span className="hidden sm:inline">Favorites</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800 transition-all"
            title="Dashboard Settings"
          >
            <Settings size={15} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
