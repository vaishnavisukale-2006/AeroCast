import React from 'react';
import { Star, BookmarkPlus, BookmarkCheck, X } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';

export const FavoritesBar: React.FC = () => {
  const { location, selectLocation } = useWeather();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useSettings();

  const isCurrentFavorite = isFavorite(location.name) || isFavorite(location.id);

  const handleToggleCurrent = () => {
    if (isCurrentFavorite) {
      removeFavorite(location.id);
      removeFavorite(location.name);
    } else {
      addFavorite(location);
    }
  };

  if (favorites.length === 0 && !location) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
      <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 pl-1 shrink-0">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>Favorites</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {favorites.map((fav) => {
              const isSelected = fav.name.toLowerCase() === location.name.toLowerCase();
              return (
                <div
                  key={fav.id || fav.name}
                  className={`group relative flex items-center rounded-xl transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                      : 'glass-panel hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <button
                    onClick={() => selectLocation(fav)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold"
                  >
                    <span className={isSelected ? 'text-cyan-800 dark:text-cyan-300' : 'text-slate-800 dark:text-slate-200'}>
                      {fav.name}
                    </span>
                    {fav.countryCode && (
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono opacity-80">
                        {fav.countryCode}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(fav.id || fav.name);
                    }}
                    className="opacity-0 group-hover:opacity-100 pr-2 pl-0.5 text-slate-400 hover:text-rose-400 transition-opacity"
                    title="Remove from favorites"
                    aria-label={`Remove ${fav.name} from favorites`}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pin/Unpin Current Active Location Button */}
        <button
          onClick={handleToggleCurrent}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isCurrentFavorite
              ? 'bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25'
              : 'glass-panel text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400'
          }`}
          title={isCurrentFavorite ? 'Saved to Favorites' : 'Save current city to Favorites'}
        >
          {isCurrentFavorite ? (
            <>
              <BookmarkCheck size={14} className="text-amber-500" />
              <span className="hidden sm:inline">Saved</span>
            </>
          ) : (
            <>
              <BookmarkPlus size={14} />
              <span className="hidden sm:inline">Pin to Favorites</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
