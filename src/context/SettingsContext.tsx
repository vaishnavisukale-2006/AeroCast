import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserSettings,
  TemperatureUnit,
  WindSpeedUnit,
  PressureUnit,
  ThemeMode,
  LocationInfo,
  NotificationPreferences,
} from '../types/weather';
import { MOCK_LOCATIONS } from '../services/mockData';
import { requestNotificationPermission } from '../services/notificationService';

interface SettingsContextType extends UserSettings {
  setTempUnit: (unit: TemperatureUnit) => void;
  setWindUnit: (unit: WindSpeedUnit) => void;
  setPressureUnit: (unit: PressureUnit) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setIsDemoMode: (enabled: boolean) => void;
  toggleDemoMode: () => void;
  addFavorite: (loc: LocationInfo) => void;
  removeFavorite: (locId: string) => void;
  isFavorite: (locId: string) => boolean;
  updateNotifications: (prefs: Partial<NotificationPreferences>) => Promise<void>;
}

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  enabled: false,
  severeAlerts: true,
  rainAlerts: true,
  aqiAlerts: true,
  dailySummary: false,
};

const DEFAULT_SETTINGS: UserSettings = {
  tempUnit: 'celsius',
  windUnit: 'kmh',
  pressureUnit: 'hpa',
  theme: 'dark',
  isDemoMode: false,
  favorites: [MOCK_LOCATIONS[0], MOCK_LOCATIONS[1], MOCK_LOCATIONS[2]],
  notifications: DEFAULT_NOTIFICATIONS,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('aerocast_settings');
      if (saved) {
        return {
          ...DEFAULT_SETTINGS,
          ...JSON.parse(saved),
          notifications: { ...DEFAULT_NOTIFICATIONS, ...(JSON.parse(saved).notifications || {}) },
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem('aerocast_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Apply dark/light class to document element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  const setTempUnit = (tempUnit: TemperatureUnit) => setSettings((s) => ({ ...s, tempUnit }));
  const setWindUnit = (windUnit: WindSpeedUnit) => setSettings((s) => ({ ...s, windUnit }));
  const setPressureUnit = (pressureUnit: PressureUnit) => setSettings((s) => ({ ...s, pressureUnit }));
  const setTheme = (theme: ThemeMode) => setSettings((s) => ({ ...s, theme }));

  const toggleTheme = () => {
    setSettings((s) => ({
      ...s,
      theme: s.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const setIsDemoMode = (isDemoMode: boolean) => setSettings((s) => ({ ...s, isDemoMode }));
  const toggleDemoMode = () => setSettings((s) => ({ ...s, isDemoMode: !s.isDemoMode }));

  const addFavorite = (loc: LocationInfo) => {
    setSettings((s) => {
      if (s.favorites.some((f) => f.name.toLowerCase() === loc.name.toLowerCase() && f.country === loc.country)) {
        return s;
      }
      return { ...s, favorites: [...s.favorites, loc] };
    });
  };

  const removeFavorite = (locId: string) => {
    setSettings((s) => ({
      ...s,
      favorites: s.favorites.filter((f) => f.id !== locId && f.name !== locId),
    }));
  };

  const isFavorite = (locId: string) => {
    return settings.favorites.some((f) => f.id === locId || f.name.toLowerCase() === locId.toLowerCase());
  };

  const updateNotifications = async (prefs: Partial<NotificationPreferences>) => {
    if (prefs.enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        setSettings((s) => ({
          ...s,
          notifications: { ...s.notifications, ...prefs, enabled: false },
        }));
        return;
      }
    }

    setSettings((s) => ({
      ...s,
      notifications: { ...s.notifications, ...prefs },
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setTempUnit,
        setWindUnit,
        setPressureUnit,
        setTheme,
        toggleTheme,
        setIsDemoMode,
        toggleDemoMode,
        addFavorite,
        removeFavorite,
        isFavorite,
        updateNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
