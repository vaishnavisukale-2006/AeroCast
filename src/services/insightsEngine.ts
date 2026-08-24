import { WeatherData, WeatherInsight } from '../types/weather';
import { formatTemperature } from '../utils/formatters';

export function generateSmartDailySummary(weatherData: Partial<WeatherData>, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  if (!weatherData.current || !weatherData.location) return 'Weather data is currently loading...';

  const loc = weatherData.location.name;
  const current = weatherData.current;
  const today = weatherData.daily?.[0];
  const maxTemp = today ? formatTemperature(today.temperatureMax, unit) : formatTemperature(current.temperature, unit);
  const minTemp = today ? formatTemperature(today.temperatureMin, unit) : '';
  const condition = current.condition.toLowerCase();
  const precipProb = current.precipitationProbability;
  const aqi = weatherData.airQuality?.category || 'Good';

  let summary = `Today in ${loc}, conditions will be ${condition} with a high of ${maxTemp}`;
  if (minTemp) summary += ` and an overnight low of ${minTemp}`;
  summary += `. `;

  if (precipProb > 50) {
    summary += `There is a high chance of rain (${precipProb}%) expected during the day. `;
  } else if (precipProb > 20) {
    summary += `A moderate chance of localized showers (${precipProb}%) is possible later today. `;
  } else {
    summary += `Dry and stable atmospheric conditions with clear skies expected. `;
  }

  summary += `Air quality is rated ${aqi}.`;
  return summary;
}

export function generateSmartInsights(weatherData: Partial<WeatherData>, unit: 'celsius' | 'fahrenheit' = 'celsius'): WeatherInsight[] {
  const insights: WeatherInsight[] = [];
  if (!weatherData.current || !weatherData.daily || weatherData.daily.length === 0) return insights;

  const daily = weatherData.daily;
  const today = daily[0];
  const tomorrow = daily[1];

  // 1. Temperature Trend / Day-to-Day Comparison
  if (tomorrow) {
    const tempDiff = Math.round(tomorrow.temperatureMax - today.temperatureMax);
    if (tempDiff >= 2) {
      insights.push({
        id: 'insight-temp-rise',
        title: 'Warming Trend Ahead',
        description: `Tomorrow will be warmer than today by approximately ${Math.abs(tempDiff)}°C (reaching ${formatTemperature(tomorrow.temperatureMax, unit)}).`,
        category: 'trend',
        impact: 'positive',
        icon: 'TrendingUp',
        badge: `+${Math.abs(tempDiff)}°C Tomorrow`,
      });
    } else if (tempDiff <= -2) {
      insights.push({
        id: 'insight-temp-drop',
        title: 'Cooling Down Tomorrow',
        description: `Temperatures will drop by ${Math.abs(tempDiff)}°C tomorrow with maximum highs around ${formatTemperature(tomorrow.temperatureMax, unit)}.`,
        category: 'trend',
        impact: 'neutral',
        icon: 'TrendingDown',
        badge: `-${Math.abs(tempDiff)}°C Drop`,
      });
    } else {
      insights.push({
        id: 'insight-temp-steady',
        title: 'Consistent Temperatures',
        description: `Steady thermal profile across the next 48 hours hovering around ${formatTemperature(today.temperatureMax, unit)}.`,
        category: 'trend',
        impact: 'positive',
        icon: 'Thermometer',
        badge: 'Stable Outlook',
      });
    }
  }

  // 2. Best Day of the Week for Outdoor Activities
  let bestDay = daily[0];
  let bestScore = -999;

  daily.forEach((d) => {
    // Score based on moderate temperature (20-25°C), low rain chance, low wind
    let score = 100 - d.precipitationProbability;
    const tempOptimal = 22;
    score -= Math.abs(d.temperatureMax - tempOptimal) * 4;
    score -= d.windSpeedMax * 0.5;

    if (score > bestScore) {
      bestScore = score;
      bestDay = d;
    }
  });

  if (bestDay) {
    insights.push({
      id: 'insight-best-day',
      title: `Best Day: ${bestDay.dayName}`,
      description: `${bestDay.dayName} (${bestDay.formattedDate}) will offer the most favorable outdoor conditions with ${bestDay.condition.toLowerCase()}, highs of ${formatTemperature(bestDay.temperatureMax, unit)}, and only ${bestDay.precipitationProbability}% rain chance.`,
      category: 'outdoor',
      impact: 'positive',
      icon: 'Sparkles',
      badge: 'Ideal For Outdoor',
    });
  }

  // 3. Precipitation Window & Accumulation
  const rainDays = daily.filter((d) => d.precipitationProbability > 40);
  if (rainDays.length > 0) {
    const nextRain = rainDays[0];
    insights.push({
      id: 'insight-rain-window',
      title: 'Rain Probability Window',
      description: `Elevated precipitation probability detected on ${nextRain.dayName} (${nextRain.precipitationProbability}% chance with ~${nextRain.precipitationSum} mm precipitation).`,
      category: 'rain',
      impact: 'warning',
      icon: 'CloudRain',
      badge: `${nextRain.precipitationProbability}% Rain on ${nextRain.shortDayName}`,
    });
  } else {
    insights.push({
      id: 'insight-dry-spell',
      title: 'Extended Dry Weather',
      description: 'Zero significant rainfall systems forecast over the next 7 days. Excellent for travel and outdoor projects.',
      category: 'rain',
      impact: 'positive',
      icon: 'Sun',
      badge: 'Dry Week Ahead',
    });
  }

  // 4. Coolest / Warmest Day of the Week
  let coolestDay = daily[0];
  let warmestDay = daily[0];

  daily.forEach((d) => {
    if (d.temperatureMin < coolestDay.temperatureMin) coolestDay = d;
    if (d.temperatureMax > warmestDay.temperatureMax) warmestDay = d;
  });

  insights.push({
    id: 'insight-extremes',
    title: 'Weekly Temperature Range',
    description: `Warmest day: ${warmestDay.dayName} (${formatTemperature(warmestDay.temperatureMax, unit)}). Coolest night: ${coolestDay.dayName} (${formatTemperature(coolestDay.temperatureMin, unit)}).`,
    category: 'extremes',
    impact: 'neutral',
    icon: 'SunDim',
    badge: `Min ${formatTemperature(coolestDay.temperatureMin, unit)} / Max ${formatTemperature(warmestDay.temperatureMax, unit)}`,
  });

  // 5. Air Quality & Atmospheric Health
  if (weatherData.airQuality) {
    const aqi = weatherData.airQuality;
    if (aqi.aqi <= 50) {
      insights.push({
        id: 'insight-aqi-good',
        title: 'Pristine Air Quality',
        description: `Current AQI is ${aqi.aqi} (${aqi.category}). Optimal conditions for cardio, ventilation, and outdoor exercise.`,
        category: 'aqi',
        impact: 'positive',
        icon: 'Wind',
        badge: 'Clean Air',
      });
    } else {
      insights.push({
        id: 'insight-aqi-caution',
        title: 'Moderate Air Particulates',
        description: `Current AQI is ${aqi.aqi} (${aqi.category}). Sensitive individuals may consider moderating prolonged heavy exertion.`,
        category: 'aqi',
        impact: 'warning',
        icon: 'Wind',
        badge: `AQI ${aqi.aqi}`,
      });
    }
  }

  // 6. Diurnal Temperature Swing (Day vs Night)
  const diurnalSwing = Math.round(today.temperatureMax - today.temperatureMin);
  if (diurnalSwing >= 8) {
    insights.push({
      id: 'insight-diurnal',
      title: 'High Day/Night Temperature Swing',
      description: `A significant ${diurnalSwing}°C thermal swing today. High of ${formatTemperature(today.temperatureMax, unit)} dropping to ${formatTemperature(today.temperatureMin, unit)} tonight. Layering recommended.`,
      category: 'temperature',
      impact: 'neutral',
      icon: 'Thermometer',
      badge: `${diurnalSwing}°C Daily Swing`,
    });
  }

  return insights;
}
