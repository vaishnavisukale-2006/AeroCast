import {
  WeatherData,
  LocationInfo,
  HourlyForecastItem,
  DailyForecastItem,
  AirQualityData,
  WeatherAlert,
  WeatherRecommendation,
} from '../types/weather';
import {
  getWeatherDetails,
  calculateSunArc,
  getWindCompass,
  getBeaufortScale,
  getUVDetails,
} from '../utils/formatters';
import { generateSmartInsights, generateSmartDailySummary } from './insightsEngine';

export const MOCK_LOCATIONS: LocationInfo[] = [
  {
    id: 'tokyo-jp',
    name: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    admin1: 'Tokyo Prefecture',
    latitude: 35.6895,
    longitude: 139.6917,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 'new-york-us',
    name: 'New York',
    country: 'United States',
    countryCode: 'US',
    admin1: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
  },
  {
    id: 'london-gb',
    name: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    admin1: 'England',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
  },
  {
    id: 'paris-fr',
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    admin1: 'Île-de-France',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
  },
  {
    id: 'sydney-au',
    name: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    admin1: 'New South Wales',
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney',
  },
  {
    id: 'dubai-ae',
    name: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    admin1: 'Dubai',
    latitude: 25.2048,
    longitude: 55.2708,
    timezone: 'Asia/Dubai',
  },
  {
    id: 'reykjavik-is',
    name: 'Reykjavik',
    country: 'Iceland',
    countryCode: 'IS',
    admin1: 'Capital Region',
    latitude: 64.1466,
    longitude: -21.9426,
    timezone: 'Atlantic/Reykjavik',
  },
];

export function generateMockAirQuality(location: LocationInfo): AirQualityData {
  let aqi = 38;
  let category: AirQualityData['category'] = 'Good';
  let explanation = 'Air quality is satisfactory, and air pollution poses little or no risk.';
  let color = 'text-emerald-400';
  let badgeBg = 'bg-emerald-500/15 border-emerald-500/30';
  let pm25Val = 8.4;
  let pm10Val = 14.2;
  let coVal = 290;
  let no2Val = 18.5;
  let so2Val = 3.8;
  let o3Val = 42.1;

  if (location.name === 'Dubai') {
    aqi = 85;
    category = 'Moderate';
    explanation = 'Air quality is acceptable; however, moderate dust particulates may affect sensitive individuals.';
    color = 'text-amber-400';
    badgeBg = 'bg-amber-500/15 border-amber-500/30';
    pm25Val = 28.5;
    pm10Val = 62.4;
    coVal = 480;
    no2Val = 32.1;
    so2Val = 8.2;
    o3Val = 58.0;
  } else if (location.name === 'Reykjavik') {
    aqi = 18;
    category = 'Good';
    explanation = 'Pristine North Atlantic air. Ideal for all outdoor activities.';
    color = 'text-emerald-400';
    badgeBg = 'bg-emerald-500/15 border-emerald-500/30';
    pm25Val = 3.2;
    pm10Val = 6.1;
    coVal = 150;
    no2Val = 5.4;
    so2Val = 1.2;
    o3Val = 34.0;
  } else if (location.name === 'London') {
    aqi = 45;
    category = 'Good';
    explanation = 'Air quality is good. Great conditions for walking and outdoor commutes.';
    color = 'text-emerald-400';
    badgeBg = 'bg-emerald-500/15 border-emerald-500/30';
    pm25Val = 11.2;
    pm10Val = 18.5;
    coVal = 310;
    no2Val = 24.3;
    so2Val = 4.1;
    o3Val = 38.6;
  }

  return {
    aqi,
    europeanAqi: Math.round(aqi * 0.5),
    category,
    explanation,
    color,
    badgeBg,
    pm25: {
      code: 'PM2.5',
      name: 'Fine Particles',
      value: pm25Val,
      unit: 'μg/m³',
      status: pm25Val < 12 ? 'Good' : pm25Val < 35 ? 'Moderate' : 'Poor',
      maxSafe: 12.0,
      description: 'Microscopic inhalable droplets from traffic and combustion.',
    },
    pm10: {
      code: 'PM10',
      name: 'Coarse Particles',
      value: pm10Val,
      unit: 'μg/m³',
      status: pm10Val < 54 ? 'Good' : pm10Val < 154 ? 'Moderate' : 'Poor',
      maxSafe: 54.0,
      description: 'Dust, pollen, and airborne matter from streets and construction.',
    },
    co: {
      code: 'CO',
      name: 'Carbon Monoxide',
      value: coVal,
      unit: 'μg/m³',
      status: coVal < 4400 ? 'Good' : 'Moderate',
      maxSafe: 4400,
      description: 'Odorless gas produced from vehicle emissions and fuels.',
    },
    no2: {
      code: 'NO2',
      name: 'Nitrogen Dioxide',
      value: no2Val,
      unit: 'μg/m³',
      status: no2Val < 53 ? 'Good' : 'Moderate',
      maxSafe: 53.0,
      description: 'Emitted from road transport and industrial power plants.',
    },
    so2: {
      code: 'SO2',
      name: 'Sulfur Dioxide',
      value: so2Val,
      unit: 'μg/m³',
      status: so2Val < 35 ? 'Good' : 'Moderate',
      maxSafe: 35.0,
      description: 'Gaseous emissions from fossil fuel burning and refineries.',
    },
    o3: {
      code: 'O3',
      name: 'Ground-level Ozone',
      value: o3Val,
      unit: 'μg/m³',
      status: o3Val < 54 ? 'Good' : 'Moderate',
      maxSafe: 54.0,
      description: 'Formed by chemical reactions between sunlight and vehicle pollutants.',
    },
  };
}

export function generateMockAlerts(location: LocationInfo, temp: number, weatherCode: number, windSpeed: number): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const now = new Date();
  const laterToday = new Date(now.getTime() + 6 * 3600 * 1000);

  if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) {
    alerts.push({
      id: `alert-storm-${location.id}`,
      title: 'Severe Thunderstorm Warning',
      severity: 'severe',
      type: 'storm',
      description: 'Active squall line accompanied by frequent lightning and localized convective gusts.',
      instruction: 'Seek sturdy shelter indoors immediately and disconnect sensitive electrical appliances.',
      startTime: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      endTime: laterToday.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      source: 'National Meteorological Service',
      icon: 'CloudLightning',
    });
  }

  if (weatherCode >= 61 && weatherCode <= 65) {
    alerts.push({
      id: `alert-rain-${location.id}`,
      title: 'Heavy Rainfall & Urban Ponding Advisory',
      severity: 'moderate',
      type: 'rain',
      description: 'Continuous moderate to heavy precipitation leading to wet road surfaces and low visibility.',
      instruction: 'Allow extra commute time, use headlights, and maintain safe braking distances.',
      startTime: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      endTime: laterToday.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      source: 'Regional Weather Center',
      icon: 'CloudRain',
    });
  }

  if (temp >= 35) {
    alerts.push({
      id: `alert-heat-${location.id}`,
      title: 'Extreme Heat & Hydration Advisory',
      severity: 'moderate',
      type: 'heat',
      description: 'Elevated daytime temperatures reaching extreme thresholds. Heat index is dangerous.',
      instruction: 'Drink abundant water, avoid direct sun exposure between 11 AM and 4 PM, and stay in cooled areas.',
      startTime: '10:00 AM',
      endTime: '06:00 PM',
      source: 'Health & Environmental Agency',
      icon: 'Sun',
    });
  }

  if (windSpeed >= 40) {
    alerts.push({
      id: `alert-wind-${location.id}`,
      title: 'High Wind & Gale Gust Warning',
      severity: 'moderate',
      type: 'wind',
      description: 'Strong atmospheric gradients producing sustained winds and sudden high gusts.',
      instruction: 'Secure loose outdoor items and exercise caution while driving tall or light vehicles.',
      startTime: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      endTime: laterToday.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      source: 'Coastal & Aviation Weather Bureau',
      icon: 'Wind',
    });
  }

  return alerts;
}

export function generateMockRecommendations(
  temp: number,
  weatherCode: number,
  precipProb: number,
  uvIndex: number,
  windSpeed: number,
  aqi: number
): WeatherRecommendation[] {
  const recs: WeatherRecommendation[] = [];

  // 1. Umbrella
  if (precipProb > 40 || weatherCode >= 51) {
    recs.push({
      id: 'rec-umbrella',
      category: 'umbrella',
      title: 'Carry an Umbrella',
      description: `High precipitation probability (${precipProb}%). Keep rain protection handy when stepping out.`,
      status: 'warning',
      icon: 'CloudRain',
    });
  } else {
    recs.push({
      id: 'rec-umbrella',
      category: 'umbrella',
      title: 'No Umbrella Needed',
      description: 'Precipitation chance is low today. Clear skies or light cloud cover expected.',
      status: 'good',
      icon: 'Sun',
    });
  }

  // 2. Outdoor Activities
  if (weatherCode >= 95 || windSpeed > 50 || aqi > 150) {
    recs.push({
      id: 'rec-outdoor',
      category: 'outdoor',
      title: 'Limit Outdoor Activities',
      description: 'Inclement atmospheric conditions detected. Indoor exercise and activities recommended.',
      status: 'caution',
      icon: 'ShieldAlert',
    });
  } else if (temp >= 15 && temp <= 26 && precipProb < 30) {
    recs.push({
      id: 'rec-outdoor',
      category: 'outdoor',
      title: 'Ideal for Outdoor Sports',
      description: 'Optimal temperature, mild breeze, and crisp visibility for running, cycling, or walking.',
      status: 'good',
      icon: 'Sparkles',
    });
  } else {
    recs.push({
      id: 'rec-outdoor',
      category: 'outdoor',
      title: 'Moderate Outdoor Conditions',
      description: 'Outdoor activities are viable. Check regional forecasts before long journeys.',
      status: 'good',
      icon: 'Sun',
    });
  }

  // 3. Clothing
  if (temp < 10) {
    recs.push({
      id: 'rec-clothing',
      category: 'clothing',
      title: 'Wear Warm Thermal Layers',
      description: 'Cold temperatures outside. A heavy coat, scarf, and insulated gloves are advised.',
      status: 'caution',
      icon: 'CloudSnow',
    });
  } else if (temp < 18) {
    recs.push({
      id: 'rec-clothing',
      category: 'clothing',
      title: 'Wear a Light Jacket or Sweater',
      description: 'Mild to brisk conditions. Layering provides comfort throughout temperature shifts.',
      status: 'good',
      icon: 'Wind',
    });
  } else {
    recs.push({
      id: 'rec-clothing',
      category: 'clothing',
      title: 'Light, Breathable Fabrics',
      description: 'Warm and comfortable climate. Cotton and loose apparel are most comfortable.',
      status: 'good',
      icon: 'Sun',
    });
  }

  // 4. UV Protection
  if (uvIndex >= 6) {
    recs.push({
      id: 'rec-uv',
      category: 'uv',
      title: 'Apply High SPF Sunscreen',
      description: `UV Index is high (${uvIndex}). Apply SPF 50+ sunscreen, wear UV sunglasses and a brimmed hat.`,
      status: 'warning',
      icon: 'SunDim',
    });
  } else if (uvIndex >= 3) {
    recs.push({
      id: 'rec-uv',
      category: 'uv',
      title: 'Moderate UV Levels',
      description: `UV Index is ${uvIndex}. Wear sunglasses and SPF 30+ if staying in direct midday sun.`,
      status: 'good',
      icon: 'Sun',
    });
  } else {
    recs.push({
      id: 'rec-uv',
      category: 'uv',
      title: 'Minimal UV Exposure',
      description: 'UV radiation is low. No special sun protective gear strictly needed today.',
      status: 'good',
      icon: 'SunMedium',
    });
  }

  // 5. Driving / Commute
  if (weatherCode === 45 || weatherCode === 48) {
    recs.push({
      id: 'rec-driving',
      category: 'driving',
      title: 'Dense Fog: Drive Carefully',
      description: 'Visibility significantly reduced. Use low-beam fog lights and increase braking distance.',
      status: 'warning',
      icon: 'CloudFog',
    });
  } else if (precipProb > 50) {
    recs.push({
      id: 'rec-driving',
      category: 'driving',
      title: 'Slick Roads & Water Ponding',
      description: 'Reduced tire traction on wet asphalt. Watch for spray from heavy vehicles.',
      status: 'caution',
      icon: 'CloudRain',
    });
  } else {
    recs.push({
      id: 'rec-driving',
      category: 'driving',
      title: 'Optimal Driving Conditions',
      description: 'Dry roadways, excellent sight lines, and smooth driving environment.',
      status: 'good',
      icon: 'Eye',
    });
  }

  return recs;
}

export function generateMockWeatherData(location: LocationInfo): WeatherData {
  const now = new Date();
  const currentHour = now.getHours();

  let baseTemp = 22;
  let baseCode = 1;
  let baseHumidity = 58;
  let baseWind = 14;

  if (location.name === 'Reykjavik') {
    baseTemp = 6;
    baseCode = 71;
    baseHumidity = 80;
    baseWind = 26;
  } else if (location.name === 'Dubai') {
    baseTemp = 36;
    baseCode = 0;
    baseHumidity = 35;
    baseWind = 12;
  } else if (location.name === 'London') {
    baseTemp = 18;
    baseCode = 61;
    baseHumidity = 78;
    baseWind = 18;
  } else if (location.name === 'Tokyo') {
    baseTemp = 24;
    baseCode = 2;
    baseHumidity = 62;
    baseWind = 15;
  } else if (location.name === 'New York') {
    baseTemp = 21;
    baseCode = 1;
    baseHumidity = 55;
    baseWind = 16;
  } else if (location.name === 'Sydney') {
    baseTemp = 23;
    baseCode = 0;
    baseHumidity = 60;
    baseWind = 19;
  }

  const isDayNow = currentHour >= 6 && currentHour <= 19;
  const currentDetails = getWeatherDetails(baseCode, isDayNow);

  // Generate 24-hour forecast
  const hourly: HourlyForecastItem[] = [];
  for (let i = 0; i < 24; i++) {
    const forecastTime = new Date(now.getTime() + i * 3600 * 1000);
    const hour = forecastTime.getHours();
    const isHourDay = hour >= 6 && hour <= 19;
    const tempOffset = Math.sin(((hour - 4) / 24) * Math.PI * 2) * 5;
    const temp = Math.round((baseTemp + tempOffset) * 10) / 10;
    const apparentTemp = Math.round((temp + (baseHumidity > 70 ? 2 : -1)) * 10) / 10;

    let hourCode = baseCode;
    if (i > 8 && i < 14 && baseCode === 1) hourCode = 2;
    const details = getWeatherDetails(hourCode, isHourDay);
    const precipProb = baseCode >= 51 ? Math.min(85, 30 + i * 2) : Math.max(5, (hour % 4) * 6);

    hourly.push({
      time: forecastTime.toISOString(),
      formattedTime: i === 0 ? 'Now' : forecastTime.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
      temperature: temp,
      apparentTemperature: apparentTemp,
      weatherCode: hourCode,
      condition: details.condition,
      icon: details.iconName,
      isDay: isHourDay,
      precipitationProbability: precipProb,
      precipitation: precipProb > 40 ? 1.4 : 0,
      windSpeed: Math.round((baseWind + Math.sin(i) * 4) * 10) / 10,
      windDirection: (210 + i * 8) % 360,
      humidity: Math.min(98, Math.max(30, Math.round(baseHumidity - tempOffset * 2))),
      uvIndex: isHourDay ? Math.max(0, Math.round(Math.sin(((hour - 6) / 13) * Math.PI) * 8)) : 0,
    });
  }

  // Generate 7-day forecast with daily hourly breakdown
  const daily: DailyForecastItem[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let d = 0; d < 7; d++) {
    const dayDate = new Date(now.getTime() + d * 24 * 3600 * 1000);
    const dayCode = (baseCode + (d % 3 === 0 ? 1 : 0)) % 96;
    const details = getWeatherDetails(dayCode, true);
    const dayMin = Math.round(baseTemp - 4 + Math.sin(d) * 2);
    const dayMax = Math.round(baseTemp + 5 + Math.cos(d) * 3);

    // Create 24h breakdown for each day
    const dayHourly: HourlyForecastItem[] = [];
    for (let h = 0; h < 24; h += 2) {
      const hDate = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), h);
      const isHDay = h >= 6 && h <= 19;
      const hOffset = Math.sin(((h - 4) / 24) * Math.PI * 2) * (dayMax - dayMin) * 0.5;
      const hTemp = Math.round(((dayMax + dayMin) / 2 + hOffset) * 10) / 10;
      const hDetails = getWeatherDetails(dayCode, isHDay);

      dayHourly.push({
        time: hDate.toISOString(),
        formattedTime: hDate.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
        temperature: hTemp,
        apparentTemperature: hTemp,
        weatherCode: dayCode,
        condition: hDetails.condition,
        icon: hDetails.iconName,
        isDay: isHDay,
        precipitationProbability: dayCode >= 51 ? 70 : 15,
        precipitation: dayCode >= 51 ? 0.8 : 0,
        windSpeed: baseWind + (d % 2),
        windDirection: 200,
        humidity: baseHumidity,
        uvIndex: isHDay ? Math.max(0, Math.round(Math.sin(((h - 6) / 13) * Math.PI) * 7)) : 0,
      });
    }

    daily.push({
      date: dayDate.toISOString().split('T')[0],
      dayName: d === 0 ? 'Today' : dayNames[dayDate.getDay()],
      shortDayName: d === 0 ? 'Today' : shortDays[dayDate.getDay()],
      formattedDate: dayDate.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      weatherCode: dayCode,
      condition: details.condition,
      icon: details.iconName,
      theme: details.theme,
      temperatureMin: dayMin,
      temperatureMax: dayMax,
      apparentTemperatureMin: dayMin - 1,
      apparentTemperatureMax: dayMax + 1,
      precipitationProbability: dayCode >= 51 ? 75 : Math.round(15 + (d * 7) % 30),
      precipitationSum: dayCode >= 51 ? 4.2 : 0,
      windSpeedMax: Math.round(baseWind + 4 + d),
      uvIndexMax: Math.max(3, 7 - (d % 3)),
      sunrise: '06:14 AM',
      sunset: '07:48 PM',
      hourlyBreakdown: dayHourly,
    });
  }

  const sunriseIso = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 14).toISOString();
  const sunsetIso = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 48).toISOString();
  const sunArc = calculateSunArc(sunriseIso, sunsetIso, now);
  const uvDetails = getUVDetails(hourly[0].uvIndex);

  let humStatus: 'Dry' | 'Comfortable' | 'Humid' | 'Very Humid' = 'Comfortable';
  if (baseHumidity < 30) humStatus = 'Dry';
  else if (baseHumidity > 75) humStatus = 'Very Humid';
  else if (baseHumidity > 60) humStatus = 'Humid';

  let cloudStatus: 'Clear' | 'Partly Cloudy' | 'Mostly Cloudy' | 'Overcast' = 'Clear';
  const cloudPercent = baseCode === 0 ? 8 : baseCode === 1 ? 25 : baseCode === 2 ? 50 : 90;
  if (cloudPercent < 20) cloudStatus = 'Clear';
  else if (cloudPercent < 50) cloudStatus = 'Partly Cloudy';
  else if (cloudPercent < 80) cloudStatus = 'Mostly Cloudy';
  else cloudStatus = 'Overcast';

  const visibilityMeters = baseCode === 45 ? 1200 : baseCode >= 61 ? 7500 : 10000;
  const airQuality = generateMockAirQuality(location);
  const alerts = generateMockAlerts(location, baseTemp, baseCode, baseWind);
  const recommendations = generateMockRecommendations(
    baseTemp,
    baseCode,
    hourly[0].precipitationProbability,
    hourly[0].uvIndex,
    baseWind,
    airQuality.aqi
  );

  const partialData: Partial<WeatherData> = {
    location,
    current: {
      temperature: hourly[0].temperature,
      apparentTemperature: hourly[0].apparentTemperature,
      weatherCode: baseCode,
      condition: currentDetails.condition,
      icon: currentDetails.iconName,
      theme: currentDetails.theme,
      isDay: isDayNow,
      time: now.toISOString(),
      humidity: baseHumidity,
      windSpeed: baseWind,
      windDirection: 215,
      windGusts: Math.round(baseWind * 1.4),
      surfacePressure: 1014,
      visibility: visibilityMeters,
      uvIndex: hourly[0].uvIndex,
      cloudCover: cloudPercent,
      precipitation: baseCode >= 51 ? 1.2 : 0,
      precipitationProbability: hourly[0].precipitationProbability,
      dewPoint: Math.round(baseTemp - (100 - baseHumidity) / 5),
    },
    daily,
    airQuality,
  };

  const insights = generateSmartInsights(partialData);
  const dailySummaryText = generateSmartDailySummary(partialData);

  return {
    location,
    isDemoData: true,
    lastUpdated: now.toISOString(),
    current: {
      temperature: hourly[0].temperature,
      apparentTemperature: hourly[0].apparentTemperature,
      weatherCode: baseCode,
      condition: currentDetails.condition,
      icon: currentDetails.iconName,
      theme: currentDetails.theme,
      isDay: isDayNow,
      time: now.toISOString(),
      humidity: baseHumidity,
      windSpeed: baseWind,
      windDirection: 215,
      windGusts: Math.round(baseWind * 1.4),
      surfacePressure: 1014,
      visibility: visibilityMeters,
      uvIndex: hourly[0].uvIndex,
      cloudCover: cloudPercent,
      precipitation: baseCode >= 51 ? 1.2 : 0,
      precipitationProbability: hourly[0].precipitationProbability,
      dewPoint: Math.round(baseTemp - (100 - baseHumidity) / 5),
    },
    hourly,
    daily,
    sunCycle: {
      sunrise: sunriseIso,
      sunset: sunsetIso,
      sunriseFormatted: '06:14 AM',
      sunsetFormatted: '07:48 PM',
      daylightDuration: sunArc.durationText,
      remainingDaylight: sunArc.remainingText,
      sunProgressPercent: sunArc.progress,
      isDaytime: sunArc.isDay,
      dawnFormatted: '05:46 AM',
      duskFormatted: '08:16 PM',
    },
    metrics: {
      humidity: baseHumidity,
      dewPoint: Math.round(baseTemp - (100 - baseHumidity) / 5),
      humidityStatus: humStatus,
      windSpeed: baseWind,
      windGusts: Math.round(baseWind * 1.4),
      windDirection: 215,
      windDirectionCompass: getWindCompass(215),
      windScale: getBeaufortScale(baseWind),
      pressure: 1014,
      pressureTrend: 'steady',
      visibility: visibilityMeters,
      visibilityStatus: visibilityMeters >= 9000 ? 'Excellent' : visibilityMeters >= 6000 ? 'Good' : 'Moderate',
      uvIndex: hourly[0].uvIndex,
      uvLevel: uvDetails.level,
      uvAdvice: uvDetails.advice,
      cloudCover: cloudPercent,
      cloudStatus,
    },
    airQuality,
    alerts,
    recommendations,
    insights,
    dailySummaryText,
  };
}
