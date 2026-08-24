import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LocationInfo, WeatherData, DailyForecastItem, NavigationTab } from '../types/weather';
import { getWeatherData } from '../services/weatherService';
import { MOCK_LOCATIONS } from '../services/mockData';
import { useSettings } from './SettingsContext';

interface WeatherContextType {
  location: LocationInfo;
  weatherData: WeatherData | null;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  searchHistory: LocationInfo[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedForecastDay: DailyForecastItem | null;
  setSelectedForecastDay: (day: DailyForecastItem | null) => void;
  comparisonLocations: LocationInfo[];
  setComparisonLocations: React.Dispatch<React.SetStateAction<LocationInfo[]>>;
  selectLocation: (loc: LocationInfo) => Promise<void>;
  refreshWeather: () => Promise<void>;
  useCurrentLocationGPS: () => Promise<void>;
  removeFromHistory: (locId: string) => void;
  clearHistory: () => void;
  clearError: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

const DEFAULT_LOCATION: LocationInfo = MOCK_LOCATIONS[0]; // Tokyo

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDemoMode } = useSettings();
  const [location, setLocation] = useState<LocationInfo>(() => {
    try {
      const saved = localStorage.getItem('aerocast_last_location');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_LOCATION;
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedForecastDay, setSelectedForecastDay] = useState<DailyForecastItem | null>(null);
  const [comparisonLocations, setComparisonLocations] = useState<LocationInfo[]>([
    MOCK_LOCATIONS[0], // Tokyo
    MOCK_LOCATIONS[1], // New York
    MOCK_LOCATIONS[2], // London
  ]);

  const [searchHistory, setSearchHistory] = useState<LocationInfo[]>(() => {
    try {
      const saved = localStorage.getItem('aerocast_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [MOCK_LOCATIONS[0], MOCK_LOCATIONS[1], MOCK_LOCATIONS[2]];
  });

  const loadWeather = useCallback(
    async (targetLocation: LocationInfo, showLoader = true) => {
      if (showLoader) setIsLoading(true);
      setError(null);

      try {
        const data = await getWeatherData(targetLocation, isDemoMode);
        setWeatherData(data);
        setLocation(targetLocation);

        try {
          localStorage.setItem('aerocast_last_location', JSON.stringify(targetLocation));
        } catch {
          // ignore
        }
      } catch (err: any) {
        setError(err.message || 'Unable to fetch weather data for this location.');
      } finally {
        setIsLoading(false);
      }
    },
    [isDemoMode]
  );

  useEffect(() => {
    loadWeather(location);
  }, [loadWeather]);

  const selectLocation = async (newLocation: LocationInfo) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter((p) => p.name.toLowerCase() !== newLocation.name.toLowerCase());
      const updated = [newLocation, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('aerocast_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    await loadWeather(newLocation);
  };

  const refreshWeather = async () => {
    await loadWeather(location, false);
  };

  const removeFromHistory = (locId: string) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item.id !== locId && item.name !== locId);
      try {
        localStorage.setItem('aerocast_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('aerocast_history');
    } catch {
      // ignore
    }
  };

  const useCurrentLocationGPS = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const gpsLocation: LocationInfo = {
          id: `gps-${pos.coords.latitude.toFixed(2)}-${pos.coords.longitude.toFixed(2)}`,
          name: 'Current Location',
          country: 'GPS Detected',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
        };
        await selectLocation(gpsLocation);
      },
      (err) => {
        setIsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location access was denied. Please search for your city or enable browser location.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('GPS position is currently unavailable. Please search manually.');
        } else if (err.code === err.TIMEOUT) {
          setError('GPS location request timed out. Please try again.');
        } else {
          setError('Unable to detect current location. Reverting to default city.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const clearError = () => setError(null);

  return (
    <WeatherContext.Provider
      value={{
        location,
        weatherData,
        isLoading,
        isSearching,
        error,
        searchHistory,
        activeTab,
        setActiveTab,
        selectedForecastDay,
        setSelectedForecastDay,
        comparisonLocations,
        setComparisonLocations,
        selectLocation,
        refreshWeather,
        useCurrentLocationGPS,
        removeFromHistory,
        clearHistory,
        clearError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
