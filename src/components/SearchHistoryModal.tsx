import React from 'react';
import { X, History, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { LocationInfo } from '../types/weather';

interface SearchHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchHistoryModal: React.FC<SearchHistoryModalProps> = ({ isOpen, onClose }) => {
  const { searchHistory, selectLocation, removeFromHistory, clearHistory, location } = useWeather();

  if (!isOpen) return null;

  const handleSelect = (loc: LocationInfo) => {
    selectLocation(loc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-3xl glass-panel-glow border border-white/50 dark:border-slate-700/80 shadow-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto custom-scrollbar animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Search History
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Your previously searched cities and territories
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition-all"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* History List */}
        {searchHistory.length > 0 ? (
          <div className="space-y-2.5">
            {searchHistory.map((item) => {
              const isCurrent = item.name.toLowerCase() === location.name.toLowerCase();

              return (
                <div
                  key={item.id || item.name}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/40'
                      : 'glass-panel hover:bg-white/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <button
                    onClick={() => handleSelect(item)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{item.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-semibold">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {[item.admin1, item.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSelect(item)}
                      className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                      title="Load weather"
                    >
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => removeFromHistory(item.id || item.name)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove from history"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Clear All History Button */}
            <div className="pt-4 flex justify-between items-center border-t border-slate-200/40 dark:border-slate-800/80">
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 size={14} />
                <span>Clear All History</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-700 dark:text-slate-300">
            <History size={32} className="mx-auto mb-2 opacity-40 text-slate-700 dark:text-slate-300" />
            <p className="text-sm font-semibold">No recent searches</p>
            <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
              Cities you search for will appear here for one-click access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
