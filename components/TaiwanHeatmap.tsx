
import React, { useEffect, useRef, useState } from 'react';
import { IndustrialPark } from '../types';
import { Layers, Locate } from 'lucide-react';

// Access global Leaflet variable from CDN
declare const L: any;

interface TaiwanHeatmapProps {
  userLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  className?: string;
  isScanning?: boolean; // New prop for visual effect
}

const industrialParks: IndustrialPark[] = [
  { id: '1', name: '桃園觀音工業區', lat: 25.045, lng: 121.140, radius: 2500, description: '北部最大工業聚落' },
  { id: '2', name: '彰化濱海工業區', lat: 24.110, lng: 120.430, radius: 4000, description: '風力資源豐富' },
  { id: '3', name: '高雄大社工業區', lat: 22.730, lng: 120.355, radius: 1500, description: '石化重鎮' },
  { id: '4', name: '新北五股工業區', lat: 25.070, lng: 121.455, radius: 1200, description: '都市型工業區' },
  { id: '5', name: '台中精密機械園區', lat: 24.145, lng: 120.600, radius: 1800, description: '智慧製造聚落' },
];

export const TaiwanHeatmap: React.FC<TaiwanHeatmapProps> = ({ 
  userLocation, 
  onLocationSelect,
  className,
  isScanning = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'street'>('satellite');

  useEffect(() => {
    if (mapContainerRef.current && typeof L !== 'undefined') {
      
      if (mapInstanceRef.current) mapInstanceRef.current.remove();

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([23.8, 120.9], 8);

      mapInstanceRef.current = map;

      // Add Zoom Control
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add Industrial Parks
      industrialParks.forEach(park => {
        L.circle([park.lat, park.lng], {
          color: '#22c55e',       
          fillColor: '#22c55e',   
          fillOpacity: 0.2,
          weight: 2,
          radius: park.radius
        }).addTo(map);

        const icon = L.divIcon({
          className: 'custom-park-label',
          html: `<div class="bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-green-500/50 text-[11px] font-bold text-green-300 shadow-sm whitespace-nowrap transform -translate-x-1/2 flex items-center gap-1">🏭 ${park.name}</div>`,
          iconSize: [120, 30],
          iconAnchor: [60, -10]
        });
        L.marker([park.lat, park.lng], { icon, interactive: false }).addTo(map);
      });

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
  }, []);

  // Layer Switching Effect
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove all tile layers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (activeLayer === 'satellite') {
      // Esri World Imagery (Satellite)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Esri'
      }).addTo(map);
      
      // Add Hybrid Labels overlay
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);
    } else {
      // CartoDB Light (Street)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);
    }
  }, [activeLayer]);

  // Update User Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && userLocation) {
      if (userMarkerRef.current) userMarkerRef.current.remove();

      const userIcon = L.divIcon({
        className: 'user-pin-icon',
        html: `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full">
            <div class="absolute -inset-2 bg-red-500/30 rounded-full animate-ping"></div>
            <div class="relative w-8 h-8 bg-red-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
      map.flyTo([userLocation.lat, userLocation.lng], 16, { duration: 1.5 });
    }
  }, [userLocation]);

  return (
    <div className={`relative w-full h-full bg-slate-900 overflow-hidden ${className}`}>
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />
      
      {/* Scanning Effect Overlay */}
      {isScanning && (
        <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute inset-0 bg-green-500/10 mix-blend-overlay"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-green-400/50 shadow-[0_0_20px_rgba(74,222,128,1)] animate-[scan_1.5s_linear_infinite]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
            
            {/* HUD Elements */}
            <div className="absolute top-8 left-8 text-green-400 font-mono text-xs">
                <div>LAT: {userLocation?.lat.toFixed(6) || '---'}</div>
                <div>LNG: {userLocation?.lng.toFixed(6) || '---'}</div>
                <div className="mt-2 text-green-300 animate-pulse">Scanning Grid...</div>
            </div>
        </div>
      )}

      {/* Layer Control */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
         <button 
           onClick={() => setActiveLayer(activeLayer === 'satellite' ? 'street' : 'satellite')}
           className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg hover:bg-white transition-colors text-slate-700"
           title="切換地圖模式"
         >
           <Layers className="w-5 h-5" />
         </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur p-3 rounded-lg border border-slate-700 shadow-lg z-[400] text-xs text-white">
        <div className="font-bold mb-2 text-slate-300 border-b border-slate-600 pb-1">Geo-AI 衛星分析</div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500"></span>
          <span className="text-slate-300">重點轉型工業區</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 border border-white"></span>
          <span className="text-slate-300">您的目標資產</span>
        </div>
      </div>

      <style>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
