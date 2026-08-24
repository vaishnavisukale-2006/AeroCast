import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, X, Loader2, History } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { LocationInfo } from '../types/weather';
import { searchLocations } from '../services/weatherService';

export const SearchBar: React.FC = () => {
  const { location, selectLocation, useCurrentLocationGPS, searchHistory, isLoading } = useWeather();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setIsOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 320);

    return () => clearTimeout(handler);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: LocationInfo) => {
    selectLocation(loc);
    setQuery('');
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 my-4 z-40" ref={dropdownRef}>
      <div className="relative flex items-center gap-2">
        {/* Main Search Input Box */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-700 dark:text-slate-300">
            {isSearching ? <Loader2 size={18} className="animate-spin text-cyan-400" /> : <Search size={18} />}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search city, state, or coordinates (e.g. Tokyo, London, Paris)..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl glass-input text-slate-900 dark:text-slate-100 placeholder-slate-600 dark:placeholder-slate-300 text-sm md:text-base font-medium shadow-glass dark:shadow-glass-dark focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              aria-label="Clear search query"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Use My Location GPS Button */}
        <button
          onClick={useCurrentLocationGPS}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white font-medium text-xs sm:text-sm shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all whitespace-nowrap"
          title="Detect and use your current GPS location"
        >
          <Navigation size={16} className={isLoading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Use My Location</span>
        </button>
      </div>

      {/* Auto-suggest Dropdown */}
      {isOpen && (suggestions.length > 0 || (query.length >= 2 && !isSearching)) && (
        <div className="absolute left-4 right-4 sm:left-6 sm:right-6 max-w-4xl mx-auto mt-2 rounded-2xl glass-panel-glow border border-slate-200/50 dark:border-slate-700/60 shadow-2xl overflow-hidden z-50 backdrop-blur-3xl animate-slide-up">
          {suggestions.length > 0 ? (
            <ul className="max-h-72 overflow-y-auto divide-y divide-slate-100/10 dark:divide-slate-800/40 custom-scrollbar">
              {suggestions.map((item, idx) => (
                <li key={item.id || idx}>
                  <button
                    onClick={() => handleSelect(item)}
                    className={`w-full px-5 py-3.5 flex items-center justify-between text-left transition-colors ${
                      selectedIndex === idx
                        ? 'bg-cyan-500/20 text-cyan-900 dark:text-cyan-200'
                        : 'hover:bg-white/40 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-400">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.countryCode && (
                            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {item.countryCode}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          {[item.admin1, item.country].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300 hidden md:block">
                      {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 && !isSearching ? (
            <div className="p-6 text-center text-slate-700 dark:text-slate-300">
              <MapPin size={24} className="mx-auto mb-2 opacity-50 text-slate-700 dark:text-slate-300" />
              <p className="text-sm font-medium">No locations found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">Try checking for spelling errors or search for a major nearby city.</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Quick Search History Chips */}
      {searchHistory.length > 0 && !isOpen && (
        <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 pl-1">
            <History size={12} /> Recent:
          </span>
          {searchHistory.map((item) => {
            const isCurrent = item.name.toLowerCase() === location.name.toLowerCase();
            return (
              <button
                key={item.id}
                onClick={() => selectLocation(item)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'glass-panel text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/80'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
