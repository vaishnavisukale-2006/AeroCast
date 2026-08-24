export type WeatherThemeType =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'fog';

export interface LocationInfo {
  id: string;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isFavorite?: boolean;
}

export interface CurrentWeather {
  temperature: number; // in Celsius (base unit)
  apparentTemperature: number; // feels like in Celsius
  weatherCode: number;
  condition: string;
  icon: string;
  theme: WeatherThemeType;
  isDay: boolean;
  time: string; // ISO string
  humidity: number; // %
  windSpeed: number; // in km/h
  windDirection: number; // in degrees 0-360
  windGusts: number; // in km/h
  surfacePressure: number; // in hPa
  visibility: number; // in meters
  uvIndex: number;
  cloudCover: number; // %
  precipitation: number; // mm
  precipitationProbability: number; // %
  dewPoint: number; // in Celsius
}

export interface HourlyForecastItem {
  time: string;
  formattedTime: string;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  condition: string;
  icon: string;
  isDay: boolean;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  uvIndex: number;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  shortDayName: string;
  formattedDate: string;
  weatherCode: number;
  condition: string;
  icon: string;
  theme: WeatherThemeType;
  temperatureMin: number;
  temperatureMax: number;
  apparentTemperatureMin: number;
  apparentTemperatureMax: number;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  hourlyBreakdown?: HourlyForecastItem[];
}

export interface SunCycleInfo {
  sunrise: string;
  sunset: string;
  sunriseFormatted: string;
  sunsetFormatted: string;
  daylightDuration: string;
  remainingDaylight: string;
  sunProgressPercent: number;
  isDaytime: boolean;
  dawnFormatted: string;
  duskFormatted: string;
}

export interface WeatherMetrics {
  humidity: number;
  dewPoint: number;
  humidityStatus: 'Dry' | 'Comfortable' | 'Humid' | 'Very Humid';
  windSpeed: number;
  windGusts: number;
  windDirection: number;
  windDirectionCompass: string;
  windScale: string;
  pressure: number;
  pressureTrend: 'rising' | 'falling' | 'steady';
  visibility: number;
  visibilityStatus: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  uvIndex: number;
  uvLevel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  uvAdvice: string;
  cloudCover: number;
  cloudStatus: 'Clear' | 'Partly Cloudy' | 'Mostly Cloudy' | 'Overcast';
}

export interface PollutantDetail {
  code: string;
  name: string;
  value: number;
  unit: string;
  status: 'Good' | 'Moderate' | 'Poor' | 'Hazardous';
  maxSafe: number;
  description: string;
}

export interface AirQualityData {
  aqi: number;
  europeanAqi?: number;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  explanation: string;
  color: string;
  badgeBg: string;
  pm25: PollutantDetail;
  pm10: PollutantDetail;
  co: PollutantDetail;
  no2: PollutantDetail;
  so2: PollutantDetail;
  o3: PollutantDetail;
}

export type AlertSeverity = 'minor' | 'moderate' | 'severe' | 'extreme';

export interface WeatherAlert {
  id: string;
  title: string;
  severity: AlertSeverity;
  type: 'rain' | 'storm' | 'heat' | 'cold' | 'wind' | 'flood' | 'air_quality' | 'fog';
  description: string;
  instruction: string;
  startTime: string;
  endTime: string;
  source: string;
  icon: string;
}

export interface WeatherRecommendation {
  id: string;
  category: 'umbrella' | 'outdoor' | 'clothing' | 'uv' | 'driving' | 'health';
  title: string;
  description: string;
  status: 'good' | 'warning' | 'caution';
  icon: string;
}

// Stage 3: Smart Insights
export interface WeatherInsight {
  id: string;
  title: string;
  description: string;
  category: 'trend' | 'rain' | 'outdoor' | 'aqi' | 'temperature' | 'extremes';
  impact: 'positive' | 'neutral' | 'warning';
  icon: string;
  badge: string;
}

// Stage 3: AI Assistant Chat Models
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  intent?: string;
}

// Stage 3: Notification Preferences
export interface NotificationPreferences {
  enabled: boolean;
  severeAlerts: boolean;
  rainAlerts: boolean;
  aqiAlerts: boolean;
  dailySummary: boolean;
}

export interface WeatherData {
  location: LocationInfo;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  sunCycle: SunCycleInfo;
  metrics: WeatherMetrics;
  airQuality?: AirQualityData;
  alerts: WeatherAlert[];
  recommendations: WeatherRecommendation[];
  insights: WeatherInsight[];
  dailySummaryText: string;
  lastUpdated: string;
  isDemoData?: boolean;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms' | 'knots';
export type PressureUnit = 'hpa' | 'inhg' | 'mmhg';
export type ThemeMode = 'dark' | 'light' | 'system';

export interface UserSettings {
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  pressureUnit: PressureUnit;
  theme: ThemeMode;
  isDemoMode: boolean;
  favorites: LocationInfo[];
  notifications: NotificationPreferences;
}

export interface GeocodingSuggestion {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  admin1?: string;
  timezone?: string;
  population?: number;
}

export type NavigationTab =
  | 'home'
  | 'forecast'
  | 'insights'
  | 'ai'
  | 'airquality'
  | 'map'
  | 'compare'
  | 'favorites'
  | 'settings';

export type MapLayerType = 'temperature' | 'precipitation' | 'wind' | 'clouds';
