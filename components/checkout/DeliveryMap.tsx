'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface DeliveryMapProps {
  lat?: number | null;
  lng?: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

export function DeliveryMap({ lat, lng, onLocationSelect }: DeliveryMapProps) {
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: lat || 12.9716, // Default to Bengaluru
    lng: lng || 77.5946,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSimulatePin = (offsetLat: number, offsetLng: number) => {
    const newCoords = {
      lat: Number((coords.lat + offsetLat).toFixed(6)),
      lng: Number((coords.lng + offsetLng).toFixed(6)),
    };
    setCoords(newCoords);
    onLocationSelect(newCoords.lat, newCoords.lng);
  };

  if (!mounted) {
    return (
      <div className="h-48 w-full rounded-xl bg-zinc-950 flex items-center justify-center text-xs text-zinc-500 border border-zinc-800">
        Loading OpenStreetMap...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-zinc-300 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-amber-400" />
          <span>Pin Delivery Location (OpenStreetMap)</span>
        </label>
        <span className="text-[11px] text-zinc-400 font-mono">
          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </span>
      </div>

      {/* Simulated Leaflet / OpenStreetMap Canvas with interactive coordinates */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl border border-zinc-800 bg-slate-950/90 shadow-inner flex flex-col items-center justify-center p-4">
        {/* Grid pattern resembling map tiles */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#f59e0b 1px, transparent 1px), radial-gradient(#38bdf8 1px, #09090b 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        <div className="relative z-10 text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-bounce">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="text-xs font-semibold text-white">
            Delivery Set Location Selected
          </div>
          <p className="text-[11px] text-zinc-400 max-w-xs">
            OpenStreetMap Coordinate Tag: Lat {coords.lat}, Lng {coords.lng}
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleSimulatePin(0.002, 0.002)}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium border border-zinc-700"
            >
              Adjust Pin +
            </button>
            <button
              type="button"
              onClick={() => handleSimulatePin(-0.002, -0.002)}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium border border-zinc-700"
            >
              Adjust Pin -
            </button>
            <button
              type="button"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    const lat = Number(pos.coords.latitude.toFixed(6));
                    const lng = Number(pos.coords.longitude.toFixed(6));
                    setCoords({ lat, lng });
                    onLocationSelect(lat, lng);
                  });
                }
              }}
              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-semibold border border-amber-500/30 flex items-center gap-1"
            >
              <Navigation className="h-3 w-3" />
              Use My GPS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
