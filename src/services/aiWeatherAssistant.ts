import { WeatherData, ChatMessage } from '../types/weather';
import { formatTemperature, formatWindSpeed } from '../utils/formatters';

export function getInitialGreeting(weatherData: WeatherData | null): ChatMessage {
  const cityName = weatherData?.location.name || 'your city';
  const temp = weatherData ? Math.round(weatherData.current.temperature) : 20;
  const condition = weatherData?.current.condition.toLowerCase() || 'clear';

  return {
    id: 'msg-welcome',
    sender: 'assistant',
    text: `Hello! I'm **AeroAI**, your personal weather intelligence assistant. 

Currently in **${cityName}**, it's **${temp}°C** with **${condition}**. How can I help you plan your day?`,
    timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    suggestions: [
      'Will it rain today?',
      'What should I wear today?',
      'Is tomorrow good for outdoor activities?',
      'Which day this week will be the coolest?',
      'Compare today with tomorrow',
      'What is the air quality like?',
    ],
  };
}

export function processWeatherQuery(query: string, weatherData: WeatherData | null): ChatMessage {
  const q = query.toLowerCase().trim();
  const timeStr = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (!weatherData) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: "I'm currently waiting for weather data to load. Please select a city or refresh and try again!",
      timestamp: timeStr,
    };
  }

  const current = weatherData.current;
  const loc = weatherData.location.name;
  const today = weatherData.daily[0];
  const tomorrow = weatherData.daily[1];
  const aqi = weatherData.airQuality;
  const unit = 'celsius';

  // 1. Rain / Precipitation Query
  if (q.includes('rain') || q.includes('shower') || q.includes('precipitation') || q.includes('wet')) {
    const rainChance = current.precipitationProbability;
    const isRainingNow = current.weatherCode >= 51 && current.weatherCode <= 67;

    if (isRainingNow) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `🌧️ **Yes, precipitation is currently occurring in ${loc}** (${current.condition}). 

The rain probability is **${rainChance}%** with high humidity (${current.humidity}%). Expect wet surfaces and reduced visibility.`,
        timestamp: timeStr,
        suggestions: ['Should I carry an umbrella?', 'What should I wear today?'],
      };
    }

    if (rainChance >= 40) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `🌧️ **There is a high chance of rain today in ${loc} (${rainChance}%)**. 

Precipitation is likely, especially during peak atmospheric moisture hours. I recommend keeping rain gear handy!`,
        timestamp: timeStr,
        suggestions: ['Should I carry an umbrella?', 'When will it rain?'],
      };
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `☀️ **Rain is unlikely today in ${loc}**. 

The current precipitation probability is only **${rainChance}%** with ${current.condition.toLowerCase()}. You can enjoy dry outdoor conditions!`,
      timestamp: timeStr,
      suggestions: ['Is tomorrow good for outdoor activities?', 'What should I wear?'],
    };
  }

  // 2. Umbrella Query
  if (q.includes('umbrella')) {
    const rainChance = current.precipitationProbability;
    if (rainChance > 35 || current.weatherCode >= 51) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `☔ **Yes, you should definitely carry an umbrella!** 

There is a **${rainChance}% probability of rain** in ${loc} today with ${current.condition.toLowerCase()}. Don't get caught in the downpour!`,
        timestamp: timeStr,
        suggestions: ['Will it rain tomorrow?', 'What should I wear?'],
      };
    }
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `☂️ **No umbrella needed today!** 

The precipitation probability is low (**${rainChance}%**) with ${current.condition.toLowerCase()} skies.`,
      timestamp: timeStr,
      suggestions: ['What should I wear?', 'Is tomorrow good for sports?'],
    };
  }

  // 3. Clothing / What to wear
  if (q.includes('wear') || q.includes('jacket') || q.includes('clothing') || q.includes('outfit') || q.includes('clothes')) {
    const temp = current.temperature;
    let advice = '';

    if (temp < 10) {
      advice = `🧥 **Wear warm layers, a heavy coat, and gloves**. It's quite cold in ${loc} at **${formatTemperature(temp, unit)}** (feels like ${formatTemperature(current.apparentTemperature, unit)}).`;
    } else if (temp < 18) {
      advice = `🧣 **A light jacket, sweater, or hoodie is recommended**. The current temperature is **${formatTemperature(temp, unit)}** with a mild breeze of ${formatWindSpeed(current.windSpeed, 'kmh')}.`;
    } else if (temp < 27) {
      advice = `👕 **Comfortable, breathable clothes (t-shirt/jeans)** are ideal. It's a pleasant **${formatTemperature(temp, unit)}** in ${loc}.`;
    } else {
      advice = `🩳 **Light, breathable cotton fabrics, sunglasses, and sun protection** are best. It's warm at **${formatTemperature(temp, unit)}**.`;
    }

    if (current.precipitationProbability > 40) {
      advice += ` Also bring a waterproof jacket or umbrella due to a ${current.precipitationProbability}% chance of rain.`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: advice,
      timestamp: timeStr,
      suggestions: ['Will it rain today?', 'What is the UV index?'],
    };
  }

  // 4. Outdoor Activities & Sports
  if (q.includes('outdoor') || q.includes('running') || q.includes('cycling') || q.includes('sport') || q.includes('walk') || q.includes('exercise')) {
    const isTomorrow = q.includes('tomorrow');
    const targetDay = isTomorrow && tomorrow ? tomorrow : today;
    const dayLabel = isTomorrow ? 'Tomorrow' : 'Today';

    const temp = targetDay.temperatureMax;
    const rain = targetDay.precipitationProbability;
    const isGood = rain < 30 && temp >= 14 && temp <= 28;

    if (isGood) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `🏃‍♂️ **${dayLabel} is fantastic for outdoor activities!** 

In ${loc}, expect **${targetDay.condition}**, comfortable highs of **${formatTemperature(temp, unit)}**, and only a **${rain}%** chance of rain.`,
        timestamp: timeStr,
        suggestions: ['Which day this week will be the coolest?', 'What is the air quality?'],
      };
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `⚠️ **Outdoor conditions for ${dayLabel.toLowerCase()} are sub-optimal.** 

Expect **${targetDay.condition}** with a **${rain}% rain probability** and highs around **${formatTemperature(temp, unit)}**. Consider indoor workouts or check for dry morning hours.`,
      timestamp: timeStr,
      suggestions: ['Which day is best for outdoor sports?', 'Will it rain today?'],
    };
  }

  // 5. Which day this week is the coolest / warmest
  if (q.includes('coolest') || q.includes('coldest') || q.includes('warmest') || q.includes('hottest')) {
    const isCoolest = q.includes('coolest') || q.includes('coldest');
    let target = weatherData.daily[0];

    weatherData.daily.forEach((d) => {
      if (isCoolest && d.temperatureMin < target.temperatureMin) target = d;
      if (!isCoolest && d.temperatureMax > target.temperatureMax) target = d;
    });

    if (isCoolest) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `❄️ **${target.dayName} (${target.formattedDate}) will be the coolest day this week.** 

Overnight low drops to **${formatTemperature(target.temperatureMin, unit)}** with daytime highs of **${formatTemperature(target.temperatureMax, unit)}** and ${target.condition.toLowerCase()}.`,
        timestamp: timeStr,
        suggestions: ['When is the warmest day?', 'Compare today with tomorrow'],
      };
    } else {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `🔥 **${target.dayName} (${target.formattedDate}) will be the warmest day this week.** 

Daytime highs will reach **${formatTemperature(target.temperatureMax, unit)}** with ${target.condition.toLowerCase()}.`,
        timestamp: timeStr,
        suggestions: ['Which day this week will be the coolest?', 'Will it rain this week?'],
      };
    }
  }

  // 6. Compare Today vs Tomorrow
  if (q.includes('compare') || (q.includes('today') && q.includes('tomorrow'))) {
    if (!tomorrow) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Tomorrow forecast is currently loading.',
        timestamp: timeStr,
      };
    }

    const tempDiff = Math.round(tomorrow.temperatureMax - today.temperatureMax);
    const trendText =
      tempDiff > 0
        ? `warmer by ${tempDiff}°C`
        : tempDiff < 0
        ? `cooler by ${Math.abs(tempDiff)}°C`
        : 'about the same temperature';

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `📊 **Today vs Tomorrow in ${loc}:**

• **Today**: ${today.condition}, High ${formatTemperature(today.temperatureMax, unit)}, Low ${formatTemperature(today.temperatureMin, unit)}, Rain ${today.precipitationProbability}%
• **Tomorrow**: ${tomorrow.condition}, High ${formatTemperature(tomorrow.temperatureMax, unit)}, Low ${formatTemperature(tomorrow.temperatureMin, unit)}, Rain ${tomorrow.precipitationProbability}%

**Summary**: Tomorrow will be **${trendText}** with ${tomorrow.precipitationProbability > today.precipitationProbability ? 'a higher' : 'a lower or equal'} chance of rain.`,
      timestamp: timeStr,
      suggestions: ['Is tomorrow good for outdoor activities?', 'What should I wear tomorrow?'],
    };
  }

  // 7. Air Quality Query
  if (q.includes('air quality') || q.includes('aqi') || q.includes('pollution') || q.includes('smog') || q.includes('clean air')) {
    if (aqi) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `🍃 **Air Quality in ${loc} is ${aqi.category} (AQI ${aqi.aqi})**. 

${aqi.explanation}
• **PM2.5**: ${aqi.pm25.value} μg/m³ (${aqi.pm25.status})
• **PM10**: ${aqi.pm10.value} μg/m³ (${aqi.pm10.status})
• **Ozone**: ${aqi.o3.value} μg/m³`,
        timestamp: timeStr,
        suggestions: ['Is it safe for outdoor exercise?', 'What is the UV index?'],
      };
    }
  }

  // 8. UV Index Query
  if (q.includes('uv') || q.includes('sun') || q.includes('sunscreen')) {
    const uv = current.uvIndex;
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `☀️ **Current UV Index in ${loc} is ${uv} (${weatherData.metrics.uvLevel})**. 

${weatherData.metrics.uvAdvice}
Max UV index today reaches **${today?.uvIndexMax ?? uv}**.`,
      timestamp: timeStr,
      suggestions: ['What should I wear?', 'Will it rain today?'],
    };
  }

  // 9. Wind / Storm Query
  if (q.includes('wind') || q.includes('storm') || q.includes('breeze') || q.includes('gale')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `💨 **Wind in ${loc} is blowing at ${formatWindSpeed(current.windSpeed, 'kmh')} from the ${weatherData.metrics.windDirectionCompass} (${current.windDirection}°)**. 

Gusts are reaching **${formatWindSpeed(current.windGusts, 'kmh')}** (${weatherData.metrics.windScale}).`,
      timestamp: timeStr,
      suggestions: ['Are there any weather alerts?', 'What should I wear?'],
    };
  }

  // 10. Default Smart Summary Response
  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: `🌤️ In **${loc}**, the current temperature is **${formatTemperature(current.temperature, unit)}** (${current.condition}) with **${current.humidity}% humidity** and a **${current.precipitationProbability}% precipitation probability**. 

Today's forecast reaches a high of **${formatTemperature(today?.temperatureMax ?? current.temperature, unit)}**. Feel free to ask about rain, clothing, sports, or air quality!`,
    timestamp: timeStr,
    suggestions: [
      'Will it rain today?',
      'What should I wear today?',
      'Is tomorrow good for outdoor activities?',
      'Which day this week will be the coolest?',
    ],
  };
}
