'use client';

import React from 'react';
import { Search, RotateCcw, Check, SlidersHorizontal, Command } from 'lucide-react';

interface FilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedBrands: string[];
  toggleBrand: (brand: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (val: boolean) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  openCommandPalette: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Departments' },
  { id: 'cameras', label: 'Cinema Cameras' },
  { id: 'lenses', label: 'Cine Lenses' },
  { id: 'lighting', label: 'Lighting & Grip' },
  { id: 'audio', label: 'Field Audio' },
  { id: 'stabilizers', label: 'Gimbals & Support' },
  { id: 'kits', label: 'Turnkey Packages' },
];

const BRANDS = [
  'ARRI',
  'RED',
  'Sony',
  'Canon',
  'Cooke',
  'Zeiss',
  'Aputure',
  'DJI',
  'Sennheiser',
  'Blackmagic',
];

export const CatalogFilterSidebar: React.FC<FilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedBrands,
  toggleBrand,
  priceRange,
  setPriceRange,
  onlyAvailable,
  setOnlyAvailable,
  clearFilters,
  activeFilterCount,
  openCommandPalette,
}) => {
  return (
    <aside className="w-full lg:w-72 shrink-0 bg-surface-1/80 backdrop-blur-xl border border-surface-3 rounded-2xl p-5 sticky top-20 self-start space-y-6">
      {/* Sidebar Header & Clear button */}
      <div className="flex items-center justify-between border-b border-surface-3/50 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          <span className="text-sm font-bold font-display text-white">Filter Fleet</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-accent text-surface-0 text-[10px] font-mono font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Prominent Search Input with ⌘K Badge */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-500">Search Rig</label>
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search model, mount..."
            className="w-full bg-surface-0 border border-surface-3 rounded-xl pl-9 pr-14 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent"
          />
          <button
            onClick={openCommandPalette}
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-surface-2 px-1.5 py-0.5 rounded border border-surface-3 text-zinc-400 hover:text-white flex items-center gap-0.5"
          >
            <Command className="w-2.5 h-2.5" />K
          </button>
        </div>
      </div>

      {/* Category Pills List */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-500">Department</label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                  isSelected
                    ? 'bg-accent text-surface-0 font-bold shadow-md shadow-accent/20'
                    : 'text-zinc-400 hover:text-white hover:bg-surface-2'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Checkboxes */}
      <div className="space-y-2 pt-2 border-t border-surface-3/50">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-500">Manufacturer</label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
          {BRANDS.map((brand) => {
            const isChecked = selectedBrands.includes(brand);
            return (
              <button
                key={brand}
                type="button"
                onClick={() => toggleBrand(brand)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  isChecked
                    ? 'bg-surface-2 border-accent/50 text-white'
                    : 'bg-surface-0/60 border-surface-3 text-zinc-400 hover:text-white hover:border-surface-4'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                    isChecked ? 'bg-accent border-accent text-surface-0' : 'border-zinc-700 bg-surface-1'
                  }`}
                >
                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span className="truncate">{brand}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual Price Range Slider */}
      <div className="space-y-2 pt-2 border-t border-surface-3/50">
        <div className="flex items-center justify-between text-xs font-mono">
          <label className="uppercase tracking-wider text-zinc-500">Max Daily Rate</label>
          <span className="text-accent font-bold">₹{priceRange[1].toLocaleString('en-IN')}/day</span>
        </div>
        <input
          type="range"
          min={2000}
          max={60000}
          step={1000}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-accent cursor-pointer bg-surface-3 rounded-lg h-1.5"
        />
        <div className="flex justify-between text-[10px] font-mono text-zinc-600">
          <span>₹2,000</span>
          <span>₹60,000+</span>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="pt-2 border-t border-surface-3/50">
        <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-xl bg-surface-0/60 border border-surface-3 hover:border-surface-4 transition-all">
          <span className="text-xs font-medium text-zinc-300">Only Available Now</span>
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center p-0.5 ${
              onlyAvailable ? 'bg-accent' : 'bg-surface-3'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                onlyAvailable ? 'translate-x-3.5' : 'translate-x-0'
              }`}
            />
          </div>
        </label>
      </div>
    </aside>
  );
};
