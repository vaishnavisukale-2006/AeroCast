import React, { useState, useEffect } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { useSettings } from './context/SettingsContext';
import { WeatherBackground } from './components/WeatherBackground';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { FavoritesBar } from './components/FavoritesBar';
import { SmartDailySummary } from './components/SmartDailySummary';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecastCard } from './components/HourlyForecastCard';
import { DailyForecastCard } from './components/DailyForecastCard';
import { SunMoonCycleCard } from './components/SunMoonCycleCard';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { WeatherCharts } from './components/WeatherCharts';
import { AirQualityCard } from './components/AirQualityCard';
import { WeatherAlertsCard } from './components/WeatherAlertsCard';
import { WeatherRecommendationsCard } from './components/WeatherRecommendationsCard';
import { SmartInsightsCard } from './components/SmartInsightsCard';
import { WeatherMap } from './components/WeatherMap';
import { CompareWeatherView } from './components/CompareWeatherView';
import { DayDetailModal } from './components/DayDetailModal';
import { SearchHistoryModal } from './components/SearchHistoryModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { SettingsModal } from './components/SettingsModal';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ErrorBanner } from './components/ErrorBanner';
import { triggerWeatherNotifications } from './services/notificationService';
import { Star, MapPin, Trash2, ArrowRight, Bot, Sparkles } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { weatherData, isLoading, activeTab, setActiveTab, selectLocation } = useWeather();
  const { favorites, removeFavorite, notifications } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const currentTheme = weatherData?.current.theme || 'clear-day';
  const isDay = weatherData?.current.isDay ?? true;

  // Trigger browser notifications if enabled and alerts present
  useEffect(() => {
    if (weatherData && notifications.enabled) {
      triggerWeatherNotifications(weatherData, notifications);
    }
  }, [weatherData, notifications]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Dynamic Animated Atmospheric Background */}
      <WeatherBackground theme={currentTheme} isDay={isDay} />

      {/* Main Content Area */}
      <div className="w-full flex-1">
        {/* Top Header */}
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAiChat={() => setIsAiChatOpen(true)}
        />

        {/* Global Tabbed Navigation Bar */}
        <Navbar
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAiChat={() => setIsAiChatOpen(true)}
        />

        {/* Search Bar (shown on home, forecast, insights, airquality, map) */}
        {activeTab !== 'compare' && activeTab !== 'favorites' && activeTab !== 'ai' && (
          <SearchBar />
        )}

        {/* Favorites Carousel Bar */}
        <FavoritesBar />

        {/* Smart Daily Narrative Summary Banner */}
        {activeTab === 'home' && !isLoading && weatherData && (
          <SmartDailySummary />
        )}

        {/* Friendly Error Banner if any */}
        <ErrorBanner />

        {/* Dashboard Body with Dynamic Tab Rendering */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-6">
          {isLoading && !weatherData ? (
            <SkeletonLoader />
          ) : weatherData ? (
            <div className="animate-fade-in space-y-6">
              {/* TAB 1: MAIN DASHBOARD */}
              {activeTab === 'home' && (
                <div className="space-y-6">
                  {/* Top Hero & Daily Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    {/* Main Hero Card (2 cols) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                      <CurrentWeatherCard />
                      <HourlyForecastCard />
                    </div>

                    {/* 7-Day Forecast & Sun Cycle (1 col) */}
                    <div className="flex flex-col gap-6">
                      <DailyForecastCard />
                      <SunMoonCycleCard />
                    </div>
                  </div>

                  {/* Weather Alerts & Warnings */}
                  <WeatherAlertsCard />

                  {/* Today's Recommendations */}
                  <WeatherRecommendationsCard />

                  {/* Smart Meteorological Insights */}
                  <SmartInsightsCard />

                  {/* Air Quality Overview */}
                  <AirQualityCard />

                  {/* Interactive Visual Charts */}
                  <WeatherCharts />

                  {/* Weather Statistics Grid (6 Cards) */}
                  <div className="space-y-3">
                    <div className="px-1">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Atmospheric Metrics & Statistics
                      </h2>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        Comprehensive multi-sensor environmental parameters
                      </p>
                    </div>
                    <WeatherMetricsGrid />
                  </div>
                </div>
              )}

              {/* TAB 2: DETAILED 7-DAY OUTLOOK */}
              {activeTab === 'forecast' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <DailyForecastCard />
                      <HourlyForecastCard />
                    </div>
                    <div className="space-y-6">
                      <SunMoonCycleCard />
                      <WeatherRecommendationsCard />
                    </div>
                  </div>
                  <WeatherCharts />
                </div>
              )}

              {/* TAB 3: SMART INSIGHTS */}
              {activeTab === 'insights' && (
                <div className="space-y-6">
                  <SmartDailySummary />
                  <SmartInsightsCard />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <WeatherRecommendationsCard />
                    <WeatherAlertsCard />
                  </div>
                  <WeatherCharts />
                </div>
              )}

              {/* TAB 4: AI ASSISTANT EMBEDDED VIEW */}
              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25">
                        <Bot size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          AeroAI Weather Intelligence Assistant
                        </h2>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          Ask natural questions regarding rainfall, clothing, outdoor activities, and air quality
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsAiChatOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md shadow-cyan-500/25"
                    >
                      <Sparkles size={16} />
                      <span>Open Chat Window</span>
                    </button>
                  </div>

                  <SmartInsightsCard />
                  <WeatherRecommendationsCard />
                </div>
              )}

              {/* TAB 5: AIR QUALITY & PARTICULATES */}
              {activeTab === 'airquality' && (
                <div className="space-y-6">
                  <AirQualityCard />
                  <WeatherRecommendationsCard />
                  <WeatherMetricsGrid />
                </div>
              )}

              {/* TAB 6: INTERACTIVE WEATHER MAP */}
              {activeTab === 'map' && (
                <div className="space-y-6">
                  <WeatherMap />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CurrentWeatherCard />
                    <AirQualityCard />
                  </div>
                </div>
              )}

              {/* TAB 7: MULTI-CITY COMPARISON */}
              {activeTab === 'compare' && (
                <div className="space-y-6">
                  <CompareWeatherView />
                </div>
              )}

              {/* TAB 8: SAVED FAVORITES */}
              {activeTab === 'favorites' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
                        <Star size={22} className="fill-amber-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          Saved Favorite Locations ({favorites.length})
                        </h2>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          Quick access to your curated world locations
                        </p>
                      </div>
                    </div>

                    {favorites.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favorites.map((fav) => (
                          <div
                            key={fav.id || fav.name}
                            className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/50 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all flex flex-col justify-between"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-800 dark:text-cyan-400">
                                  <MapPin size={18} />
                                </div>
                                <div>
                                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                    {fav.name}
                                  </h3>
                                  <p className="text-xs text-slate-700 dark:text-slate-300">
                                    {[fav.admin1, fav.country].filter(Boolean).join(', ')}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => removeFavorite(fav.id || fav.name)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                title="Remove favorite"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                selectLocation(fav);
                                setActiveTab('home');
                              }}
                              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-800 dark:text-cyan-300 font-bold text-xs transition-colors"
                            >
                              <span>View Weather Dashboard</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-700 dark:text-slate-300">
                        <Star size={36} className="mx-auto mb-2 opacity-30 text-slate-700 dark:text-slate-300" />
                        <p className="text-sm font-semibold">No favorites saved yet</p>
                        <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                          Pin your favorite cities from the dashboard to quickly monitor them here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      {/* Floating AI Assistant Trigger Button (Bottom Right) */}
      <button
        onClick={() => setIsAiChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all hover:scale-110 active:scale-95 flex items-center gap-2 group border border-white/30"
        title="Open AeroAI Weather Assistant"
        aria-label="Open AeroAI Weather Assistant"
      >
        <Bot size={24} className="group-hover:rotate-12 transition-transform" />
        <span className="hidden md:inline font-bold text-xs pr-1">Ask AeroAI</span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-slate-900 animate-ping" />
      </button>

      {/* AI Assistant Chat Modal */}
      <AiAssistantModal isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />

      {/* Advanced Day Detail Modal (7-Day deep dive) */}
      <DayDetailModal />

      {/* Search History Modal */}
      <SearchHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Dashboard Footer */}
      <footer className="w-full border-t border-slate-200/40 dark:border-slate-800/80 py-6 mt-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">AeroCast Intelligence</span>
            <span>•</span>
            <span>Stage 3 Production Release</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Open-Meteo & Air Quality Feed</span>
            <span>•</span>
            <span>AeroAI Natural Weather Engine</span>
            <span>•</span>
            <span>Interactive Weather Map</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <SettingsProvider>
      <WeatherProvider>
        <DashboardContent />
      </WeatherProvider>
    </SettingsProvider>
  );
}

export default App;
