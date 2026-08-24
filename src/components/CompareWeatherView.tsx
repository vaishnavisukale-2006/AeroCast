import React, { useEffect, useState } from 'react';
import {
  GitCompare,
  Plus,
  Trash2,
  Droplets,
  Wind,
  Sun,
  ShieldCheck,
  CloudRain,
  Loader2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { LocationInfo, WeatherData } from '../types/weather';
import { fetchComparisonData, searchLocations } from '../services/weatherService';
import { MOCK_LOCATIONS } from '../services/mockData';
import { formatTemperature, formatWindSpeed } from '../utils/formatters';
import { WeatherIcon } from './WeatherIcons';

export const CompareWeatherView: React.FC = () => {
  const { comparisonLocations, setComparisonLocations } = useWeather();
  const { tempUnit, windUnit, isDemoMode } = useSettings();
  const [dataList, setDataList] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddCity, setShowAddCity] = useState(false);

  // Fetch comparison data when comparisonLocations change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchComparisonData(comparisonLocations, isDemoMode)
      .then((res) => {
        if (isMounted) {
          setDataList(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [comparisonLocations, isDemoMode]);

  // Debounced search for adding new city
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchLocations(searchQuery);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddCity = (loc: LocationInfo) => {
    if (comparisonLocations.some((c) => c.name.toLowerCase() === loc.name.toLowerCase())) {
      setShowAddCity(false);
      setSearchQuery('');
      return;
    }
    if (comparisonLocations.length >= 3) {
      // replace last
      setComparisonLocations([comparisonLocations[0], comparisonLocations[1], loc]);
    } else {
      setComparisonLocations([...comparisonLocations, loc]);
    }
    setShowAddCity(false);
    setSearchQuery('');
  };

  const handleRemoveCity = (id: string) => {
    if (comparisonLocations.length <= 2) {
      return; // Keep at least 2 cities for comparison
    }
    setComparisonLocations(comparisonLocations.filter((c) => c.id !== id && c.name !== id));
  };

  // Prepare comparison chart dataset
  const chartData = dataList.map((item) => ({
    name: item.location.name,
    temperature: Math.round(item.current.temperature),
    humidity: item.current.humidity,
    windSpeed: Math.round(item.current.windSpeed),
    aqi: item.airQuality?.aqi ?? 40,
    precipitation: item.current.precipitationProbability,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
            <GitCompare size={22} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Multi-City Meteorological Comparison
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Comparative analysis across 2–3 global territories simultaneously
            </p>
          </div>
        </div>

        {/* Add City Button */}
        <div className="relative">
          <button
            onClick={() => setShowAddCity(!showAddCity)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all"
          >
            <Plus size={16} />
            <span>Add / Change City</span>
          </button>

          {/* Search Dropdown Modal */}
          {showAddCity && (
            <div className="absolute right-0 mt-2 w-80 p-3 rounded-2xl glass-panel-glow border border-white/60 dark:border-slate-700/80 shadow-2xl z-50 backdrop-blur-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city to compare..."
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                autoFocus
              />

              {isSearching && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 size={18} className="animate-spin text-cyan-400" />
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="mt-2 max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                  {searchResults.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => handleAddCity(res)}
                      className="w-full px-3 py-2 text-left rounded-lg text-xs font-semibold hover:bg-cyan-500/15 hover:text-cyan-800 dark:hover:text-cyan-300 transition-colors flex justify-between items-center"
                    >
                      <span>{res.name}</span>
                      <span className="text-[10px] text-slate-700 dark:text-slate-300">{res.country}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Presets */}
              <div className="mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Popular Presets
                </span>
                <div className="flex flex-wrap gap-1">
                  {MOCK_LOCATIONS.slice(0, 5).map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleAddCity(loc)}
                      className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-white/40 dark:bg-slate-800/60 hover:bg-cyan-500/20 text-slate-800 dark:text-slate-200"
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-3xl glass-panel">
          <Loader2 size={36} className="animate-spin text-cyan-400 mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Fetching comparative meteorological datasets...
          </p>
        </div>
      ) : (
        <>
          {/* Side-by-Side City Comparison Cards Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-${dataList.length} gap-6`}>
            {dataList.map((item) => {
              const aqi = item.airQuality?.aqi ?? 40;
              return (
                <div
                  key={item.location.id}
                  className="relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 p-6 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* City Header */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">
                          {item.location.name}
                        </h3>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          {[item.location.admin1, item.location.country].filter(Boolean).join(', ')}
                        </p>
                      </div>

                      {dataList.length > 2 && (
                        <button
                          onClick={() => handleRemoveCity(item.location.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove from comparison"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    {/* Temp & Condition */}
                    <div className="flex items-center justify-between my-4 p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50">
                      <div>
                        <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                          {formatTemperature(item.current.temperature, tempUnit)}
                        </div>
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                          {item.current.condition}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/40 dark:bg-slate-800/50">
                        <WeatherIcon name={item.current.icon} size={36} />
                      </div>
                    </div>

                    {/* Metric Comparison Rows */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/30 dark:bg-slate-900/30">
                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                          <Droplets size={14} className="text-cyan-400" />
                          <span>Humidity</span>
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.current.humidity}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/30 dark:bg-slate-900/30">
                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                          <Wind size={14} className="text-teal-400" />
                          <span>Wind Speed</span>
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatWindSpeed(item.current.windSpeed, windUnit)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/30 dark:bg-slate-900/30">
                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                          <CloudRain size={14} className="text-blue-400" />
                          <span>Rain Chance</span>
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.current.precipitationProbability}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/30 dark:bg-slate-900/30">
                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                          <ShieldCheck size={14} className="text-emerald-400" />
                          <span>Air Quality (AQI)</span>
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md ${
                            aqi <= 50
                              ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                              : aqi <= 100
                              ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                              : 'bg-rose-500/20 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          {aqi}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/30 dark:bg-slate-900/30">
                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                          <Sun size={14} className="text-amber-500" />
                          <span>UV Radiation</span>
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.current.uvIndex} / 11+
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Multi-Metric Comparison Chart */}
          <div className="p-6 rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Cross-City Comparative Metric Bars
            </h3>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                  <XAxis dataKey="name" stroke="rgba(148, 163, 184, 0.6)" fontSize={12} />
                  <YAxis stroke="rgba(148, 163, 184, 0.6)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="temperature" name="Temp (°)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="humidity" name="Humidity (%)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="precipitation" name="Rain Chance (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="aqi" name="AQI" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
