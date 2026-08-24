import {
  LocationInfo,
  WeatherData,
  HourlyForecastItem,
  DailyForecastItem,
  GeocodingSuggestion,
  AirQualityData,
} from '../types/weather';
import {
  getWeatherDetails,
  calculateSunArc,
  getWindCompass,
  getBeaufortScale,
  getUVDetails,
  formatLocalTime,
} from '../utils/formatters';
import {
  generateMockWeatherData,
  generateMockAirQuality,
  generateMockAlerts,
  generateMockRecommendations,
  MOCK_LOCATIONS,
} from './mockData';
import { generateSmartInsights, generateSmartDailySummary } from './insightsEngine';

const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const OPEN_METEO_AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function fetchLiveAirQuality(location: LocationInfo): Promise<AirQualityData> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: [
      'european_aqi',
      'us_aqi',
      'pm10',
      'pm2_5',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
      'ozone',
    ].join(','),
  });

  const response = await fetch(`${OPEN_METEO_AIR_QUALITY_URL}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Air quality API failed');
  }

  const data = await response.json();
  const current = data.current || {};

  const usAqi = current.us_aqi ?? Math.round((current.european_aqi || 25) * 1.8);
  const euroAqi = current.european_aqi ?? Math.round(usAqi * 0.5);

  let category: AirQualityData['category'] = 'Good';
  let explanation = 'Air quality is satisfactory, and air pollution poses little or no risk.';
  let color = 'text-emerald-400';
  let badgeBg = 'bg-emerald-500/15 border-emerald-500/30';

  if (usAqi > 300) {
    category = 'Hazardous';
    explanation = 'Health warning of emergency conditions: everyone is more likely to be affected.';
    color = 'text-purple-400';
    badgeBg = 'bg-purple-500/15 border-purple-500/30';
  } else if (usAqi > 200) {
    category = 'Very Unhealthy';
    explanation = 'Health alert: everyone may experience more serious health effects.';
    color = 'text-rose-400';
    badgeBg = 'bg-rose-500/15 border-rose-500/30';
  } else if (usAqi > 150) {
    category = 'Unhealthy';
    explanation = 'Some members of the general public may experience health effects; sensitive groups may experience more serious effects.';
    color = 'text-red-400';
    badgeBg = 'bg-red-500/15 border-red-500/30';
  } else if (usAqi > 100) {
    category = 'Unhealthy for Sensitive Groups';
    explanation = 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.';
    color = 'text-orange-400';
    badgeBg = 'bg-orange-500/15 border-orange-500/30';
  } else if (usAqi > 50) {
    category = 'Moderate';
    explanation = 'Air quality is acceptable. However, there may be some health concern for a very small number of people.';
    color = 'text-amber-400';
    badgeBg = 'bg-amber-500/15 border-amber-500/30';
  }

  const pm25Val = current.pm2_5 ?? 9.5;
  const pm10Val = current.pm10 ?? 16.0;
  const coVal = current.carbon_monoxide ?? 320;
  const no2Val = current.nitrogen_dioxide ?? 21.0;
  const so2Val = current.sulphur_dioxide ?? 4.5;
  const o3Val = current.ozone ?? 45.0;

  return {
    aqi: usAqi,
    europeanAqi: euroAqi,
    category,
    explanation,
    color,
    badgeBg,
    pm25: {
      code: 'PM2.5',
      name: 'Fine Particles',
      value: Math.round(pm25Val * 10) / 10,
      unit: 'μg/m³',
      status: pm25Val < 12 ? 'Good' : pm25Val < 35 ? 'Moderate' : 'Poor',
      maxSafe: 12.0,
      description: 'Microscopic inhalable droplets from traffic, combustion, and industry.',
    },
    pm10: {
      code: 'PM10',
      name: 'Coarse Particles',
      value: Math.round(pm10Val * 10) / 10,
      unit: 'μg/m³',
      status: pm10Val < 54 ? 'Good' : pm10Val < 154 ? 'Moderate' : 'Poor',
      maxSafe: 54.0,
      description: 'Dust, pollen, and airborne matter from streets and construction.',
    },
    co: {
      code: 'CO',
      name: 'Carbon Monoxide',
      value: Math.round(coVal),
      unit: 'μg/m³',
      status: coVal < 4400 ? 'Good' : 'Moderate',
      maxSafe: 4400,
      description: 'Odorless gas produced from vehicle emissions and combustion fuels.',
    },
    no2: {
      code: 'NO2',
      name: 'Nitrogen Dioxide',
      value: Math.round(no2Val * 10) / 10,
      unit: 'μg/m³',
      status: no2Val < 53 ? 'Good' : 'Moderate',
      maxSafe: 53.0,
      description: 'Emitted from road transport, vehicle engines, and power plants.',
    },
    so2: {
      code: 'SO2',
      name: 'Sulfur Dioxide',
      value: Math.round(so2Val * 10) / 10,
      unit: 'μg/m³',
      status: so2Val < 35 ? 'Good' : 'Moderate',
      maxSafe: 35.0,
      description: 'Gaseous emissions from fossil fuel burning and industrial smelting.',
    },
    o3: {
      code: 'O3',
      name: 'Ground-level Ozone',
      value: Math.round(o3Val * 10) / 10,
      unit: 'μg/m³',
      status: o3Val < 54 ? 'Good' : 'Moderate',
      maxSafe: 54.0,
      description: 'Secondary pollutant formed by sunlight reacting with vehicle gases.',
    },
  };
}

export async function fetchLiveWeatherData(location: LocationInfo): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    timezone: location.timezone || 'auto',
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'dew_point_2m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    forecast_days: '8',
  });

  const response = await fetch(`${OPEN_METEO_FORECAST_URL}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Weather service responded with status ${response.status}`);
  }

  const data = await response.json();
  
  // Try fetching live air quality in parallel
  let airQuality: AirQualityData | undefined;
  try {
    airQuality = await fetchLiveAirQuality(location);
  } catch {
    airQuality = generateMockAirQuality(location);
  }

  return parseOpenMeteoResponse(data, location, airQuality);
}

function parseOpenMeteoResponse(data: any, location: LocationInfo, airQuality?: AirQualityData): WeatherData {
  const current = data.current || {};
  const hourly = data.hourly || {};
  const daily = data.daily || {};

  const weatherCode = current.weather_code ?? 0;
  const isDay = current.is_day === 1;
  const details = getWeatherDetails(weatherCode, isDay);

  // Find index of current hour in hourly data
  const nowIso = new Date().toISOString();
  const currentHourTimeStr = nowIso.slice(0, 13);
  let startHourIdx = 0;
  if (hourly.time && Array.isArray(hourly.time)) {
    const idx = hourly.time.findIndex((t: string) => t.startsWith(currentHourTimeStr));
    if (idx !== -1) startHourIdx = idx;
  }

  // Build next 24 hours
  const hourlyItems: HourlyForecastItem[] = [];
  const totalHours = Math.min(24, (hourly.time?.length || 0) - startHourIdx);

  for (let i = 0; i < totalHours; i++) {
    const idx = startHourIdx + i;
    const timeStr = hourly.time[idx];
    const isHourDay = hourly.is_day ? hourly.is_day[idx] === 1 : true;
    const hourCode = hourly.weather_code ? hourly.weather_code[idx] : 0;
    const hourDetails = getWeatherDetails(hourCode, isHourDay);

    const d = new Date(timeStr);
    const formattedTime = i === 0 ? 'Now' : d.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    hourlyItems.push({
      time: timeStr,
      formattedTime,
      temperature: hourly.temperature_2m ? hourly.temperature_2m[idx] : 0,
      apparentTemperature: hourly.apparent_temperature ? hourly.apparent_temperature[idx] : 0,
      weatherCode: hourCode,
      condition: hourDetails.condition,
      icon: hourDetails.iconName,
      isDay: isHourDay,
      precipitationProbability: hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0,
      precipitation: hourly.precipitation ? hourly.precipitation[idx] : 0,
      windSpeed: hourly.wind_speed_10m ? hourly.wind_speed_10m[idx] : 0,
      windDirection: hourly.wind_direction_10m ? hourly.wind_direction_10m[idx] : 0,
      humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[idx] : 0,
      uvIndex: hourly.uv_index ? hourly.uv_index[idx] : 0,
    });
  }

  // Build 7-day forecast
  const dailyItems: DailyForecastItem[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const totalDays = Math.min(7, daily.time?.length || 0);

  for (let d = 0; d < totalDays; d++) {
    const dayDateStr = daily.time[d];
    const dayDate = new Date(dayDateStr + 'T12:00:00');
    const dayCode = daily.weather_code ? daily.weather_code[d] : 0;
    const dayDetails = getWeatherDetails(dayCode, true);

    const sunriseStr = daily.sunrise ? daily.sunrise[d] : '';
    const sunsetStr = daily.sunset ? daily.sunset[d] : '';

    // Generate day hourly breakdown from hourly dataset (24h slice)
    const dayHourly: HourlyForecastItem[] = [];
    const dayStartIdx = d * 24;
    for (let h = 0; h < 24 && dayStartIdx + h < (hourly.time?.length || 0); h += 2) {
      const hIdx = dayStartIdx + h;
      const hTime = hourly.time[hIdx];
      const hDate = new Date(hTime);
      const isHDay = hourly.is_day ? hourly.is_day[hIdx] === 1 : true;
      const hCode = hourly.weather_code ? hourly.weather_code[hIdx] : 0;
      const hDet = getWeatherDetails(hCode, isHDay);

      dayHourly.push({
        time: hTime,
        formattedTime: hDate.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
        temperature: hourly.temperature_2m ? hourly.temperature_2m[hIdx] : 0,
        apparentTemperature: hourly.apparent_temperature ? hourly.apparent_temperature[hIdx] : 0,
        weatherCode: hCode,
        condition: hDet.condition,
        icon: hDet.iconName,
        isDay: isHDay,
        precipitationProbability: hourly.precipitation_probability ? hourly.precipitation_probability[hIdx] : 0,
        precipitation: hourly.precipitation ? hourly.precipitation[hIdx] : 0,
        windSpeed: hourly.wind_speed_10m ? hourly.wind_speed_10m[hIdx] : 0,
        windDirection: hourly.wind_direction_10m ? hourly.wind_direction_10m[hIdx] : 0,
        humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[hIdx] : 0,
        uvIndex: hourly.uv_index ? hourly.uv_index[hIdx] : 0,
      });
    }

    dailyItems.push({
      date: dayDateStr,
      dayName: d === 0 ? 'Today' : dayNames[dayDate.getDay()],
      shortDayName: d === 0 ? 'Today' : shortDays[dayDate.getDay()],
      formattedDate: dayDate.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      weatherCode: dayCode,
      condition: dayDetails.condition,
      icon: dayDetails.iconName,
      theme: dayDetails.theme,
      temperatureMin: daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[d]) : 0,
      temperatureMax: daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[d]) : 0,
      apparentTemperatureMin: daily.apparent_temperature_min ? Math.round(daily.apparent_temperature_min[d]) : 0,
      apparentTemperatureMax: daily.apparent_temperature_max ? Math.round(daily.apparent_temperature_max[d]) : 0,
      precipitationProbability: daily.precipitation_probability_max ? daily.precipitation_probability_max[d] : 0,
      precipitationSum: daily.precipitation_sum ? daily.precipitation_sum[d] : 0,
      windSpeedMax: daily.wind_speed_10m_max ? Math.round(daily.wind_speed_10m_max[d]) : 0,
      uvIndexMax: daily.uv_index_max ? Math.round(daily.uv_index_max[d]) : 0,
      sunrise: sunriseStr ? formatLocalTime(sunriseStr, location.timezone) : '06:00 AM',
      sunset: sunsetStr ? formatLocalTime(sunsetStr, location.timezone) : '07:30 PM',
      hourlyBreakdown: dayHourly,
    });
  }

  const todaySunrise = daily.sunrise ? daily.sunrise[0] : new Date().toISOString();
  const todaySunset = daily.sunset ? daily.sunset[0] : new Date().toISOString();
  const sunArc = calculateSunArc(todaySunrise, todaySunset, new Date());

  const currentUv = hourlyItems[0]?.uvIndex || (daily.uv_index_max ? daily.uv_index_max[0] : 2);
  const uvDetails = getUVDetails(currentUv);

  const humidity = current.relative_humidity_2m ?? 55;
  let humStatus: 'Dry' | 'Comfortable' | 'Humid' | 'Very Humid' = 'Comfortable';
  if (humidity < 30) humStatus = 'Dry';
  else if (humidity > 75) humStatus = 'Very Humid';
  else if (humidity > 60) humStatus = 'Humid';

  const cloudPercent = current.cloud_cover ?? 20;
  let cloudStatus: 'Clear' | 'Partly Cloudy' | 'Mostly Cloudy' | 'Overcast' = 'Clear';
  if (cloudPercent < 20) cloudStatus = 'Clear';
  else if (cloudPercent < 50) cloudStatus = 'Partly Cloudy';
  else if (cloudPercent < 80) cloudStatus = 'Mostly Cloudy';
  else cloudStatus = 'Overcast';

  const currentWind = current.wind_speed_10m ?? 12;
  const currentDir = current.wind_direction_10m ?? 180;
  const visMeters = current.visibility ?? 10000;
  const currentTemp = current.temperature_2m ?? 20;

  const resolvedAQI = airQuality || generateMockAirQuality(location);
  const alerts = generateMockAlerts(location, currentTemp, weatherCode, currentWind);
  const recommendations = generateMockRecommendations(
    currentTemp,
    weatherCode,
    hourlyItems[0]?.precipitationProbability || 0,
    currentUv,
    currentWind,
    resolvedAQI.aqi
  );

  const partialData: Partial<WeatherData> = {
    location,
    current: {
      temperature: currentTemp,
      apparentTemperature: current.apparent_temperature ?? 20,
      weatherCode,
      condition: details.condition,
      icon: details.iconName,
      theme: details.theme,
      isDay,
      time: current.time || new Date().toISOString(),
      humidity,
      windSpeed: currentWind,
      windDirection: currentDir,
      windGusts: current.wind_gusts_10m ?? Math.round(currentWind * 1.3),
      surfacePressure: current.surface_pressure ? Math.round(current.surface_pressure) : 1013,
      visibility: visMeters,
      uvIndex: currentUv,
      cloudCover: cloudPercent,
      precipitation: current.precipitation ?? 0,
      precipitationProbability: hourlyItems[0]?.precipitationProbability || 0,
      dewPoint: current.dew_point_2m ? Math.round(current.dew_point_2m) : Math.round(currentTemp - (100 - humidity) / 5),
    },
    daily: dailyItems,
    airQuality: resolvedAQI,
  };

  const insights = generateSmartInsights(partialData);
  const dailySummaryText = generateSmartDailySummary(partialData);

  return {
    location,
    isDemoData: false,
    lastUpdated: new Date().toISOString(),
    current: {
      temperature: currentTemp,
      apparentTemperature: current.apparent_temperature ?? 20,
      weatherCode,
      condition: details.condition,
      icon: details.iconName,
      theme: details.theme,
      isDay,
      time: current.time || new Date().toISOString(),
      humidity,
      windSpeed: currentWind,
      windDirection: currentDir,
      windGusts: current.wind_gusts_10m ?? Math.round(currentWind * 1.3),
      surfacePressure: current.surface_pressure ? Math.round(current.surface_pressure) : 1013,
      visibility: visMeters,
      uvIndex: currentUv,
      cloudCover: cloudPercent,
      precipitation: current.precipitation ?? 0,
      precipitationProbability: hourlyItems[0]?.precipitationProbability || 0,
      dewPoint: current.dew_point_2m ? Math.round(current.dew_point_2m) : Math.round(currentTemp - (100 - humidity) / 5),
    },
    hourly: hourlyItems,
    daily: dailyItems,
    sunCycle: {
      sunrise: todaySunrise,
      sunset: todaySunset,
      sunriseFormatted: formatLocalTime(todaySunrise, location.timezone),
      sunsetFormatted: formatLocalTime(todaySunset, location.timezone),
      daylightDuration: sunArc.durationText,
      remainingDaylight: sunArc.remainingText,
      sunProgressPercent: sunArc.progress,
      isDaytime: sunArc.isDay,
      dawnFormatted: '05:30 AM',
      duskFormatted: '08:00 PM',
    },
    metrics: {
      humidity,
      dewPoint: current.dew_point_2m ? Math.round(current.dew_point_2m) : Math.round(currentTemp - (100 - humidity) / 5),
      humidityStatus: humStatus,
      windSpeed: currentWind,
      windGusts: current.wind_gusts_10m ?? Math.round(currentWind * 1.3),
      windDirection: currentDir,
      windDirectionCompass: getWindCompass(currentDir),
      windScale: getBeaufortScale(currentWind),
      pressure: current.surface_pressure ? Math.round(current.surface_pressure) : 1013,
      pressureTrend: 'steady',
      visibility: visMeters,
      visibilityStatus: visMeters >= 9000 ? 'Excellent' : visMeters >= 5000 ? 'Good' : 'Moderate',
      uvIndex: currentUv,
      uvLevel: uvDetails.level,
      uvAdvice: uvDetails.advice,
      cloudCover: cloudPercent,
      cloudStatus,
    },
    airQuality: resolvedAQI,
    alerts,
    recommendations,
    insights,
    dailySummaryText,
  };
}

export async function searchLocations(query: string): Promise<LocationInfo[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const url = `${OPEN_METEO_GEOCODING_URL}?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('Geocoding request failed');

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: GeocodingSuggestion) => ({
      id: `${item.id}-${item.latitude.toFixed(2)}-${item.longitude.toFixed(2)}`,
      name: item.name,
      country: item.country || '',
      countryCode: item.countryCode || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
    }));
  } catch {
    return MOCK_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        loc.country.toLowerCase().includes(trimmed.toLowerCase()) ||
        loc.admin1?.toLowerCase().includes(trimmed.toLowerCase())
    );
  }
}

export async function getWeatherData(location: LocationInfo, forceDemo: boolean = false): Promise<WeatherData> {
  if (forceDemo) {
    return generateMockWeatherData(location);
  }

  try {
    return await fetchLiveWeatherData(location);
  } catch {
    const mock = generateMockWeatherData(location);
    mock.isDemoData = true;
    return mock;
  }
}

export async function fetchComparisonData(locations: LocationInfo[], forceDemo: boolean = false): Promise<WeatherData[]> {
  const promises = locations.map((loc) => getWeatherData(loc, forceDemo));
  return Promise.all(promises);
}
