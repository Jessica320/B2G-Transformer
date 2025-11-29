import React, { useEffect, useRef } from 'react';
import { IndustrialPark } from '../types';

// Access global Leaflet variable from CDN
declare const L: any;

interface TaiwanHeatmapProps {
  userLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  className?: string;
}

// 五大工業區資料
const industrialParks: IndustrialPark[] = [
  { id: '1', name: '桃園觀音工業區', lat: 25.045, lng: 121.140, radius: 2500, description: '北部最大工業聚落，太陽能潛力高' },
  { id: '2', name: '彰化濱海工業區', lat: 24.110, lng: 120.430, radius: 4000, description: '風力資源豐富，適合綠能轉型' },
  { id: '3', name: '高雄大社工業區', lat: 22.730, lng: 120.355, radius: 1500, description: '石化重鎮，碳捕捉需求強烈' },
  { id: '4', name: '新北五股工業區', lat: 25.070, lng: 121.455, radius: 1200, description: '都市型工業區，適合屋頂光電' },
  { id: '5', name: '台中精密機械園區', lat: 24.145, lng: 120.600, radius: 1800, description: '智慧製造聚落，BEMS 需求高' },
];

export const TaiwanHeatmap: React.FC<TaiwanHeatmapProps> = ({ 
  userLocation, 
  onLocationSelect,
  className 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (mapContainerRef.current && typeof L !== 'undefined') {
      
      // Cleanup existing map if present to avoid duplicates
      if (mapInstanceRef.current) {
         mapInstanceRef.current.remove();
      }

      // Initialize Map
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([23.8, 120.9], 8);

      mapInstanceRef.current = map;

      // Add CartoDB Light basemap
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Add Zoom Control
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add Industrial Park Circles
      industrialParks.forEach(park => {
        // Circle
        L.circle([park.lat, park.lng], {
          color: '#16a34a',       // green-600
          fillColor: '#22c55e',   // green-500
          fillOpacity: 0.2,
          radius: park.radius
        }).addTo(map);

        // Label
        const icon = L.divIcon({
          className: 'custom-park-label',
          html: `<div class="bg-white/90 backdrop-blur px-2 py-1 rounded border border-green-200 text-xs font-bold text-green-800 shadow-sm whitespace-nowrap transform -translate-x-1/2">${park.name}</div>`,
          iconSize: [100, 30],
          iconAnchor: [50, 0]
        });
        L.marker([park.lat, park.lng], { icon, interactive: false }).addTo(map);
      });

      // Click event to pick location
      map.on('click', (e: any) => {
        if (onLocationSelect) {
          onLocationSelect(e.latlng.lat, e.latlng.lng, `自選位置 (${e.latlng.lat.toFixed(3)}, ${e.latlng.lng.toFixed(3)})`);
        }
      });
    }

    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, []); // Run once on mount

  // Update User Marker and View when userLocation changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && userLocation) {
      
      // Remove existing marker
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      // Add Red Marker for User
      const userIcon = L.divIcon({
        className: 'user-pin-icon',
        html: `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full">
            <div class="absolute -inset-1 bg-red-500/30 rounded-full animate-ping"></div>
            <div class="relative w-8 h-8 bg-red-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
      
      // Fly to user location
      map.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 1.5 });
    }
  }, [userLocation]);

  return (
    <div className={`relative w-full h-full bg-slate-100 overflow-hidden ${className}`}>
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg border border-slate-200 shadow-lg z-[400] text-xs">
        <div className="font-bold text-slate-800 mb-2">圖例說明</div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-green-500 opacity-50 border border-green-600"></span>
          <span className="text-slate-600">重點綠能轉型工業區</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 border border-white"></span>
          <span className="text-slate-600">您的資產位置</span>
        </div>
      </div>
    </div>
  );
};