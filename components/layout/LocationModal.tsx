'use client';

import React from 'react';
import { useLocation, CITIES } from '@/components/providers/LocationProvider';
import { MapPin, X, Check, Building2, Sparkles } from 'lucide-react';

export function LocationModal() {
  const { selectedCity, setCity, isLocationModalOpen, closeLocationModal } = useLocation();

  if (!isLocationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-cinema-surface rounded-2xl shadow-2xl p-6 sm:p-8 text-center border border-cinema-border animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeLocationModal}
          className="absolute top-4 right-4 p-2 text-cinema-text-muted hover:text-cinema-text hover:bg-cinema-tertiary rounded-full transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/15 text-accent mb-3 border border-accent/30 shadow-cinema-glow">
            <MapPin className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-cinema-text tracking-tight font-heading">
            Select Your Production Hub
          </h3>
          <p className="text-sm text-cinema-text-secondary mt-1 max-w-md mx-auto">
            Choose your nearest hub for real-time inventory availability, immediate store pickup, and 90-minute on-set delivery.
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
                className={`rounded-xl p-4 flex flex-col items-center justify-center text-center relative transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-accent bg-accent/10 shadow-cinema-accent'
                    : 'bg-cinema-tertiary/70 border-cinema-border hover:border-cinema-border-strong hover:bg-cinema-card'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-cinema-bg shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}

                <div className="w-10 h-10 rounded-xl bg-cinema-bg/80 flex items-center justify-center text-accent mb-2.5 border border-cinema-border">
                  <Building2 className="w-5 h-5 text-accent" />
                </div>

                <span className="text-sm font-bold text-cinema-text block">{city.name}</span>
                <span className="text-[11px] text-cinema-text-muted block mt-0.5">{city.state}</span>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-cinema-border flex items-center justify-between text-xs text-cinema-text-secondary">
          <span className="flex items-center gap-1.5 text-accent font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Pickup & On-Set Delivery</span>
          </span>
          <button
            onClick={closeLocationModal}
            className="font-bold text-accent hover:text-accent-hover transition cursor-pointer"
          >
            Continue in {selectedCity} →
          </button>
        </div>
      </div>
    </div>
  );
}

