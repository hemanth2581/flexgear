'use client';

import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface DeliveryMapProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ lat, lng, onLocationChange }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center gap-1.5 text-white font-medium">
          <MapPin className="w-4 h-4 text-primary" /> Film Set Delivery Coordinates
        </span>
        <span className="font-mono text-zinc-500">
          Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
        </span>
      </div>

      <div className="relative w-full h-48 rounded-xl bg-zinc-900 border border-cinema-border overflow-hidden flex items-center justify-center">
        {/* OpenStreetMap interactive coordinates box */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e50914_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 text-center p-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary text-primary flex items-center justify-center mx-auto mb-2 animate-bounce">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-white">Film City Stage 4B / Studio Dispatch</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">GPS location pinned for door-to-set delivery van</p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => onLocationChange(19.1663, 72.8876)}
              className="px-2.5 py-1 text-[10px] font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700"
            >
              Set: Film City
            </button>
            <button
              type="button"
              onClick={() => onLocationChange(19.0760, 72.8777)}
              className="px-2.5 py-1 text-[10px] font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700"
            >
              Set: Bandra West
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
