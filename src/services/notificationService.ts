import { WeatherData, NotificationPreferences } from '../types/weather';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }

  return false;
}

export function triggerWeatherNotifications(weatherData: WeatherData, prefs: NotificationPreferences) {
  if (!prefs.enabled || !('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const { alerts, current, airQuality, location } = weatherData;

  // 1. Severe Alerts
  if (prefs.severeAlerts && alerts.length > 0) {
    const alert = alerts[0];
    new Notification(`⚠️ Weather Alert: ${alert.title}`, {
      body: `${alert.description} in ${location.name}. ${alert.instruction}`,
      icon: '/favicon.ico',
    });
    return;
  }

  // 2. Heavy Rain
  if (prefs.rainAlerts && current.precipitationProbability >= 70) {
    new Notification(`🌧️ High Rain Risk in ${location.name}`, {
      body: `Precipitation probability is ${current.precipitationProbability}%. Don't forget an umbrella!`,
      icon: '/favicon.ico',
    });
    return;
  }

  // 3. Hazardous Air Quality
  if (prefs.aqiAlerts && airQuality && airQuality.aqi > 150) {
    new Notification(`🍃 Air Quality Notice: ${airQuality.category}`, {
      body: `AQI in ${location.name} is ${airQuality.aqi}. Limit prolonged outdoor exertion.`,
      icon: '/favicon.ico',
    });
  }
}
