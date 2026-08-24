import { TemperatureUnit, WindSpeedUnit, PressureUnit, WeatherThemeType } from '../types/weather';

// WMO Weather interpretation codes (WW)
// Code 0: Clear sky
// Code 1, 2, 3: Mainly clear, partly cloudy, and overcast
// Code 45, 48: Fog and depositing rime fog
// Code 51, 53, 55: Drizzle: Light, moderate, and dense intensity
// Code 56, 57: Freezing Drizzle: Light and dense intensity
// Code 61, 63, 65: Rain: Slight, moderate and heavy intensity
// Code 66, 67: Freezing Rain: Light and heavy intensity
// Code 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
// Code 77: Snow grains
// Code 80, 81, 82: Rain showers: Slight, moderate, and violent
// Code 85, 86: Snow showers slight and heavy
// Code 95: Thunderstorm: Slight or moderate
// Code 96, 99: Thunderstorm with slight and heavy hail

export interface WeatherCodeDetails {
  condition: string;
  iconName: string;
  theme: WeatherThemeType;
  description: string;
}

export function getWeatherDetails(code: number, isDay: boolean = true): WeatherCodeDetails {
  switch (code) {
    case 0:
      return {
        condition: isDay ? 'Clear Sky' : 'Clear Night',
        iconName: isDay ? 'Sun' : 'Moon',
        theme: isDay ? 'clear-day' : 'clear-night',
        description: 'Crisp and clear atmospheric conditions',
      };
    case 1:
      return {
        condition: isDay ? 'Mainly Sunny' : 'Mainly Clear',
        iconName: isDay ? 'SunMedium' : 'MoonStar',
        theme: isDay ? 'clear-day' : 'clear-night',
        description: 'Mostly clear with plenty of visibility',
      };
    case 2:
      return {
        condition: isDay ? 'Partly Cloudy' : 'Partly Cloudy',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        theme: isDay ? 'partly-cloudy-day' : 'partly-cloudy-night',
        description: 'Scattered clouds with intermittent sunshine',
      };
    case 3:
      return {
        condition: 'Overcast',
        iconName: 'Cloud',
        theme: 'cloudy',
        description: 'Dense cloud canopy covering the sky',
      };
    case 45:
    case 48:
      return {
        condition: 'Foggy',
        iconName: 'CloudFog',
        theme: 'fog',
        description: 'Reduced visibility due to dense fog layers',
      };
    case 51:
    case 53:
    case 55:
      return {
        condition: 'Drizzle',
        iconName: 'CloudDrizzle',
        theme: 'drizzle',
        description: 'Fine light mist and drizzle drops',
      };
    case 56:
    case 57:
      return {
        condition: 'Freezing Drizzle',
        iconName: 'CloudHail',
        theme: 'snow',
        description: 'Supercooled drizzle freezing on contact',
      };
    case 61:
      return {
        condition: 'Light Rain',
        iconName: 'CloudRain',
        theme: 'rain',
        description: 'Gentle steady rainfall',
      };
    case 63:
      return {
        condition: 'Moderate Rain',
        iconName: 'CloudRain',
        theme: 'rain',
        description: 'Moderate steady precipitation',
      };
    case 65:
      return {
        condition: 'Heavy Rain',
        iconName: 'CloudRain',
        theme: 'rain',
        description: 'Heavy downpour with high accumulation',
      };
    case 66:
    case 67:
      return {
        condition: 'Freezing Rain',
        iconName: 'CloudHail',
        theme: 'snow',
        description: 'Icy precipitation creating slick surfaces',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        condition: 'Snow Fall',
        iconName: 'CloudSnow',
        theme: 'snow',
        description: 'Soft crystalline snowfall accumulation',
      };
    case 80:
    case 81:
    case 82:
      return {
        condition: 'Rain Showers',
        iconName: 'CloudRain',
        theme: 'rain',
        description: 'Passing intense rain showers',
      };
    case 85:
    case 86:
      return {
        condition: 'Snow Showers',
        iconName: 'CloudSnow',
        theme: 'snow',
        description: 'Occasional brisk snow squalls',
      };
    case 95:
      return {
        condition: 'Thunderstorm',
        iconName: 'CloudLightning',
        theme: 'thunderstorm',
        description: 'Active electrical thunderstorm with thunder & lightning',
      };
    case 96:
    case 99:
      return {
        condition: 'Severe Storm & Hail',
        iconName: 'CloudLightning',
        theme: 'thunderstorm',
        description: 'Severe electrical storm with hail formation',
      };
    default:
      return {
        condition: 'Partly Cloudy',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        theme: isDay ? 'partly-cloudy-day' : 'partly-cloudy-night',
        description: 'Normal seasonal weather patterns',
      };
  }
}

// Temperature conversions
export function formatTemperature(celsius: number, unit: TemperatureUnit, showUnit: boolean = true): string {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return '--';
  const val = unit === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius;
  const rounded = Math.round(val);
  return showUnit ? `${rounded}°${unit === 'fahrenheit' ? 'F' : 'C'}` : `${rounded}°`;
}

export function getRawTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round(((celsius * 9) / 5 + 32) * 10) / 10;
  }
  return Math.round(celsius * 10) / 10;
}

// Wind conversions (base is km/h)
export function formatWindSpeed(kmh: number, unit: WindSpeedUnit, showUnit: boolean = true): string {
  if (kmh === undefined || kmh === null || isNaN(kmh)) return '--';
  let val = kmh;
  let unitLabel = 'km/h';

  switch (unit) {
    case 'mph':
      val = kmh * 0.621371;
      unitLabel = 'mph';
      break;
    case 'ms':
      val = kmh / 3.6;
      unitLabel = 'm/s';
      break;
    case 'knots':
      val = kmh * 0.539957;
      unitLabel = 'kts';
      break;
    case 'kmh':
    default:
      val = kmh;
      unitLabel = 'km/h';
      break;
  }

  const formatted = Math.round(val * 10) / 10;
  return showUnit ? `${formatted} ${unitLabel}` : `${formatted}`;
}

// Pressure conversions (base is hPa / mbar)
export function formatPressure(hpa: number, unit: PressureUnit, showUnit: boolean = true): string {
  if (hpa === undefined || hpa === null || isNaN(hpa)) return '--';
  let val = hpa;
  let unitLabel = 'hPa';

  switch (unit) {
    case 'inhg':
      val = hpa * 0.02953;
      unitLabel = 'inHg';
      break;
    case 'mmhg':
      val = hpa * 0.750062;
      unitLabel = 'mmHg';
      break;
    case 'hpa':
    default:
      val = hpa;
      unitLabel = 'hPa';
      break;
  }

  const formatted = unit === 'inhg' ? val.toFixed(2) : Math.round(val);
  return showUnit ? `${formatted} ${unitLabel}` : `${formatted}`;
}

// Visibility formatting (base in meters)
export function formatVisibility(meters: number, unit: TemperatureUnit): string {
  if (meters === undefined || meters === null || isNaN(meters)) return '--';
  if (unit === 'fahrenheit') {
    const miles = (meters / 1609.34).toFixed(1);
    return `${miles} mi`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

// Wind compass direction
export function getWindCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16;
  return directions[index];
}

// Beaufort scale naming
export function getBeaufortScale(kmh: number): string {
  if (kmh < 2) return 'Calm';
  if (kmh < 6) return 'Light Air';
  if (kmh < 12) return 'Light Breeze';
  if (kmh < 20) return 'Gentle Breeze';
  if (kmh < 29) return 'Moderate Breeze';
  if (kmh < 39) return 'Fresh Breeze';
  if (kmh < 50) return 'Strong Breeze';
  if (kmh < 62) return 'Near Gale';
  if (kmh < 75) return 'Gale';
  if (kmh < 89) return 'Strong Gale';
  return 'Storm Force';
}

// UV Index category and health protection advice
export function getUVDetails(uv: number): { level: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme'; advice: string; color: string } {
  if (uv <= 2) {
    return {
      level: 'Low',
      advice: 'Minimal sun hazard. Safe to enjoy outdoor activities without special protection.',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    };
  }
  if (uv <= 5) {
    return {
      level: 'Moderate',
      advice: 'Moderate hazard. Wear sunglasses and SPF 30+ sunscreen if out in direct sun.',
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    };
  }
  if (uv <= 7) {
    return {
      level: 'High',
      advice: 'High hazard. Seek shade during midday hours, wear UV hat, sunglasses & sunscreen.',
      color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    };
  }
  if (uv <= 10) {
    return {
      level: 'Very High',
      advice: 'Very high hazard. Minimize midday sun exposure. Extra skin and eye protection essential.',
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    };
  }
  return {
    level: 'Extreme',
    advice: 'Extreme hazard! Take all precautions. Unprotected skin can burn in minutes.',
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  };
}

// Format local time
export function formatLocalTime(isoString: string | Date, timezone?: string): string {
  try {
    const date = typeof isoString === 'string' ? new Date(isoString) : isoString;
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    }).format(date);
  } catch {
    const d = new Date(isoString);
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
}

export function formatLocalDate(isoString: string | Date, timezone?: string): string {
  try {
    const date = typeof isoString === 'string' ? new Date(isoString) : isoString;
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: timezone,
    }).format(date);
  } catch {
    return 'Today';
  }
}

export function calculateSunArc(sunriseIso: string, sunsetIso: string, currentTime: Date = new Date()): {
  progress: number;
  isDay: boolean;
  remainingText: string;
  durationText: string;
} {
  const rise = new Date(sunriseIso).getTime();
  const set = new Date(sunsetIso).getTime();
  const now = currentTime.getTime();

  const totalDaylightMs = Math.max(set - rise, 1000);
  const durationHours = Math.floor(totalDaylightMs / (1000 * 60 * 60));
  const durationMins = Math.floor((totalDaylightMs % (1000 * 60 * 60)) / (1000 * 60));
  const durationText = `${durationHours}h ${durationMins}m`;

  if (now < rise) {
    const msUntilRise = rise - now;
    const hrs = Math.floor(msUntilRise / (1000 * 60 * 60));
    const mins = Math.floor((msUntilRise % (1000 * 60 * 60)) / (1000 * 60));
    return {
      progress: 0,
      isDay: false,
      remainingText: `Sunrise in ${hrs}h ${mins}m`,
      durationText,
    };
  }

  if (now > set) {
    return {
      progress: 100,
      isDay: false,
      remainingText: 'Nighttime',
      durationText,
    };
  }

  const elapsedMs = now - rise;
  const progress = Math.min(Math.max((elapsedMs / totalDaylightMs) * 100, 0), 100);
  const remainingMs = set - now;
  const remHrs = Math.floor(remainingMs / (1000 * 60 * 60));
  const remMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    progress: Math.round(progress),
    isDay: true,
    remainingText: `${remHrs}h ${remMins}m remaining`,
    durationText,
  };
}
