import React from 'react';
import {
  Sun,
  Moon,
  SunMedium,
  MoonStar,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudHail,
  CloudLightning,
  Wind,
  Droplets,
  Compass,
  Gauge,
  Eye,
  SunDim,
  Sunrise,
  Sunset,
  Clock,
  Sparkles,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
  animate?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = '', size = 24, animate = false }) => {
  const baseClasses = animate ? 'transition-transform duration-300 hover:scale-110' : '';
  const combined = `${baseClasses} ${className}`;

  switch (name) {
    case 'Sun':
      return <Sun size={size} className={`${combined} text-amber-400`} />;
    case 'Moon':
      return <Moon size={size} className={`${combined} text-indigo-300`} />;
    case 'SunMedium':
      return <SunMedium size={size} className={`${combined} text-amber-400`} />;
    case 'MoonStar':
      return <MoonStar size={size} className={`${combined} text-indigo-300`} />;
    case 'CloudSun':
      return <CloudSun size={size} className={`${combined} text-amber-300`} />;
    case 'CloudMoon':
      return <CloudMoon size={size} className={`${combined} text-indigo-300`} />;
    case 'Cloud':
      return <Cloud size={size} className={`${combined} text-slate-300`} />;
    case 'CloudFog':
      return <CloudFog size={size} className={`${combined} text-slate-400`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle size={size} className={`${combined} text-cyan-300`} />;
    case 'CloudRain':
      return <CloudRain size={size} className={`${combined} text-blue-400`} />;
    case 'CloudSnow':
      return <CloudSnow size={size} className={`${combined} text-sky-200`} />;
    case 'CloudHail':
      return <CloudHail size={size} className={`${combined} text-cyan-200`} />;
    case 'CloudLightning':
      return <CloudLightning size={size} className={`${combined} text-yellow-400`} />;
    case 'Wind':
      return <Wind size={size} className={`${combined} text-teal-300`} />;
    case 'Droplets':
      return <Droplets size={size} className={`${combined} text-cyan-400`} />;
    case 'Compass':
      return <Compass size={size} className={`${combined} text-blue-400`} />;
    case 'Gauge':
      return <Gauge size={size} className={`${combined} text-indigo-400`} />;
    case 'Eye':
      return <Eye size={size} className={`${combined} text-emerald-400`} />;
    case 'SunDim':
      return <SunDim size={size} className={`${combined} text-amber-500`} />;
    case 'Sunrise':
      return <Sunrise size={size} className={`${combined} text-amber-400`} />;
    case 'Sunset':
      return <Sunset size={size} className={`${combined} text-rose-400`} />;
    case 'Clock':
      return <Clock size={size} className={`${combined} text-slate-400`} />;
    default:
      return <Sparkles size={size} className={`${combined} text-cyan-400`} />;
  }
};
