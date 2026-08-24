import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Thermometer, CloudRain, Wind, Cloud, MapPin, ZoomIn, ZoomOut, Maximize2, LucideIcon } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { MapLayerType } from '../types/weather';
import { formatTemperature } from '../utils/formatters';

export const WeatherMap: React.FC = () => {
  const { location, weatherData } = useWeather();
  const { tempUnit } = useSettings();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('temperature');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 7,
        zoomControl: false,
      });

      // Dark / CartoDB base tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>, OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([location.latitude, location.longitude], 7);
    }

    // Custom glowing marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    const tempFormatted = weatherData ? formatTemperature(weatherData.current.temperature, tempUnit) : '';
    const condition = weatherData ? weatherData.current.condition : '';

    const customIcon = L.divIcon({
      className: 'custom-weather-pin',
      html: `
        <div style="transform: translate(-50%, -100%);" class="flex flex-col items-center">
          <div class="px-3 py-1.5 rounded-2xl bg-slate-900/90 text-white border border-cyan-400/60 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-bold whitespace-nowrap">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>${location.name}</span>
            <span class="text-amber-400">${tempFormatted}</span>
          </div>
          <div class="w-2.5 h-2.5 bg-slate-900 border-r border-b border-cyan-400/60 transform rotate-45 -mt-1"></div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    markerRef.current = L.marker([location.latitude, location.longitude], { icon: customIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(
        `<div class="text-xs font-sans">
          <b>${location.name}</b><br/>
          <span>${condition} • ${tempFormatted}</span>
        </div>`
      );

    return () => {
      // clean up if unmounting
    };
  }, [location, weatherData, tempUnit]);

  // Handle Layer Switch
  const layers: { id: MapLayerType; label: string; icon: LucideIcon; color: string }[] = [
    { id: 'temperature', label: 'Temperature Heatmap', icon: Thermometer, color: 'text-amber-400' },
    { id: 'precipitation', label: 'Precipitation Radar', icon: CloudRain, color: 'text-cyan-400' },
    { id: 'wind', label: 'Wind Dynamics', icon: Wind, color: 'text-teal-400' },
    { id: 'clouds', label: 'Cloud Satellite', icon: Cloud, color: 'text-blue-400' },
  ];

  const handleZoom = (type: 'in' | 'out') => {
    if (mapInstanceRef.current) {
      if (type === 'in') mapInstanceRef.current.zoomIn();
      else mapInstanceRef.current.zoomOut();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
    }, 200);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl glass-panel border border-white/40 dark:border-slate-800/80 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl flex flex-col' : 'w-full h-[540px]'
      }`}
    >
      {/* Map Control Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Layer Selector */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel-glow border border-white/60 dark:border-slate-700/80 shadow-lg pointer-events-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:flex">
            <Layers size={14} className="text-cyan-400" />
            <span>Layer:</span>
          </div>

          {layers.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActiveLayer(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeLayer === id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon size={14} className={color} />
              <span>{label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Zoom & Fullscreen Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel-glow border border-white/60 dark:border-slate-700/80 shadow-lg pointer-events-auto">
          <button
            onClick={() => handleZoom('in')}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition-all"
            title="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition-all"
            title="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition-all"
            title="Toggle fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Weather Layer Visual Overlay Badge */}
      <div className="absolute bottom-4 left-4 z-20 px-3.5 py-2 rounded-2xl glass-panel-glow border border-white/60 dark:border-slate-700/80 shadow-lg pointer-events-auto flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
        <MapPin size={14} className="text-cyan-400" />
        <span>
          {location.name}, {location.country} ({location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°)
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="capitalize text-cyan-800 dark:text-cyan-300 font-bold">{activeLayer} Overlay Active</span>
      </div>

      {/* Leaflet Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px] z-10" />
    </div>
  );
};
