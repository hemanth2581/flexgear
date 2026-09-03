'use client';

import React from 'react';
import { useLocation, CITIES } from '@/components/providers/LocationProvider';
import { MapPin, X, Check, Building2, Sparkles } from 'lucide-react';

export function LocationModal() {
  const { selectedCity, setCity, isLocationModalOpen, closeLocationModal } = useLocation();

  if (!isLocationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeLocationModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-lenstiger-light text-lenstiger mb-3">
            <MapPin className="w-6 h-6 text-lenstiger" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 headingbold">
            Please Select a Location
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Choose your nearest production hub for local gear availability and 90-minute set delivery.
          </p>
        </div>

        {/* City Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-6">
          {CITIES.map((city) => {
            const isSelected = selectedCity.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.id}
                onClick={() => setCity(city.name)}
                className={`location-card rounded-xl p-4 flex flex-col items-center justify-center text-center relative transition-all ${
                  isSelected ? 'selected ring-2 ring-lenstiger bg-lenstiger-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-lenstiger text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}

                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mb-2 group-hover:bg-lenstiger group-hover:text-white transition">
                  <Building2 className="w-5 h-5 text-lenstiger" />
                </div>

                <span className="text-sm font-bold text-gray-900 block">{city.name}</span>
                <span className="text-[11px] text-gray-500 block mt-0.5">{city.state}</span>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 text-lenstiger font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Pickup & Doorstep Delivery in all hubs</span>
          </span>
          <button
            onClick={closeLocationModal}
            className="font-bold text-gray-700 hover:text-lenstiger transition"
          >
            Continue with {selectedCity} →
          </button>
        </div>
      </div>
    </div>
  );
}
