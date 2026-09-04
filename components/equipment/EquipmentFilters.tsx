'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category, Brand } from '@/types/equipment';
import { formatCurrency } from '@/lib/utils';
import { Filter, RotateCcw, Check, Star, ShieldCheck, Camera, Layers } from 'lucide-react';

interface EquipmentFiltersProps {
  categories: Category[];
  brands: Brand[];
}

export function EquipmentFilters({ categories, brands }: EquipmentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local filter states initialized from URL
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll('brand').length > 0
      ? searchParams.getAll('brand')
      : searchParams.get('brand')?.split(',') || []
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 10000
  );
  const [minRating, setMinRating] = useState<number>(
    searchParams.get('minRating') ? Number(searchParams.get('minRating')) : 0
  );
  const [availableOnly, setAvailableOnly] = useState<boolean>(
    searchParams.get('availableOnly') === 'true'
  );

  // Sync state if URL changes externally
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    const brandsFromUrl = searchParams.get('brand');
    setSelectedBrands(brandsFromUrl ? brandsFromUrl.split(',') : []);
    if (searchParams.get('maxPrice')) {
      setMaxPrice(Number(searchParams.get('maxPrice')));
    }
    if (searchParams.get('minRating')) {
      setMinRating(Number(searchParams.get('minRating')));
    }
    setAvailableOnly(searchParams.get('availableOnly') === 'true');
  }, [searchParams]);

  // Apply filters to URL
  const applyFilters = (overrides?: {
    category?: string;
    brands?: string[];
    maxPrice?: number;
    minRating?: number;
    availableOnly?: boolean;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    const cat = overrides?.category !== undefined ? overrides.category : selectedCategory;
    const brs = overrides?.brands !== undefined ? overrides.brands : selectedBrands;
    const price = overrides?.maxPrice !== undefined ? overrides.maxPrice : maxPrice;
    const rating = overrides?.minRating !== undefined ? overrides.minRating : minRating;
    const avail = overrides?.availableOnly !== undefined ? overrides.availableOnly : availableOnly;

    if (cat) params.set('category', cat);
    else params.delete('category');

    if (brs.length > 0) params.set('brand', brs.join(','));
    else params.delete('brand');

    if (price < 10000) params.set('maxPrice', price.toString());
    else params.delete('maxPrice');

    if (rating > 0) params.set('minRating', rating.toString());
    else params.delete('minRating');

    if (avail) params.set('availableOnly', 'true');
    else params.delete('availableOnly');

    // Reset pagination to page 1 on filter update
    params.delete('page');

    router.push(`/equipment?${params.toString()}`);
  };

  const handleCategoryClick = (slug: string) => {
    const newCat = selectedCategory === slug ? '' : slug;
    setSelectedCategory(newCat);
    applyFilters({ category: newCat });
  };

  const handleBrandToggle = (brandSlug: string) => {
    const updated = selectedBrands.includes(brandSlug)
      ? selectedBrands.filter((b) => b !== brandSlug)
      : [...selectedBrands, brandSlug];
    setSelectedBrands(updated);
    applyFilters({ brands: updated });
  };

  const handlePriceChange = (newPrice: number) => {
    setMaxPrice(newPrice);
  };

  const handlePriceCommit = () => {
    applyFilters({ maxPrice });
  };

  const handleRatingClick = (rating: number) => {
    const newRating = minRating === rating ? 0 : rating;
    setMinRating(newRating);
    applyFilters({ minRating: newRating });
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setMaxPrice(10000);
    setMinRating(0);
    setAvailableOnly(false);

    const params = new URLSearchParams();
    const search = searchParams.get('search');
    if (search) params.set('search', search);

    router.push(`/equipment?${params.toString()}`);
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    selectedBrands.length > 0 ||
    maxPrice < 10000 ||
    minRating > 0 ||
    availableOnly;

  return (
    <div className="space-y-6 rounded-2xl border border-cinema-border bg-cinema-surface p-5 shadow-cinema-sm">
      {/* Filters Header */}
      <div className="flex items-center justify-between border-b border-cinema-border pb-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-cinema-text font-heading">
          <Filter className="h-4 w-4 text-accent" />
          <span>Filter Equipment</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-xs font-bold text-accent hover:underline transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories Department Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-accent font-heading">
          Departments
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryClick('')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedCategory === ''
                ? 'bg-accent text-cinema-bg font-black shadow-cinema-sm'
                : 'text-cinema-text-secondary hover:bg-cinema-tertiary hover:text-cinema-text'
            }`}
          >
            <span>All Departments</span>
            {selectedCategory === '' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-accent text-cinema-bg font-black shadow-cinema-sm'
                    : 'text-cinema-text-secondary hover:bg-cinema-tertiary hover:text-cinema-text'
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands Filter */}
      {brands.length > 0 && (
        <div className="space-y-3 border-t border-cinema-border pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-accent font-heading">
            Brands &amp; Optics
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {brands.map((brand) => {
              const isChecked = selectedBrands.includes(brand.slug);
              return (
                <label
                  key={brand.id}
                  className="flex items-center space-x-2.5 text-xs text-cinema-text-secondary hover:text-cinema-text cursor-pointer py-1 select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandToggle(brand.slug)}
                    className="h-4 w-4 rounded bg-cinema-tertiary border-cinema-border text-accent focus:ring-accent accent-accent cursor-pointer"
                  />
                  <span className={isChecked ? 'font-bold text-cinema-text' : ''}>
                    {brand.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Price Filter */}
      <div className="space-y-3 border-t border-cinema-border pt-4">
        <div className="flex items-center justify-between text-xs">
          <h4 className="font-bold uppercase tracking-wider text-accent font-heading">Max Daily Price</h4>
          <span className="font-bold text-cinema-text">₹{maxPrice.toLocaleString()}/day</span>
        </div>

        <input
          type="range"
          min="500"
          max="10000"
          step="500"
          value={maxPrice}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          onMouseUp={handlePriceCommit}
          onTouchEnd={handlePriceCommit}
          className="w-full h-1.5 bg-cinema-tertiary rounded-lg appearance-none cursor-pointer accent-accent"
        />

        <div className="flex justify-between text-[10px] text-cinema-text-muted">
          <span>₹500</span>
          <span>₹10,000+</span>
        </div>
      </div>

      {/* Minimum Rating Filter */}
      <div className="space-y-3 border-t border-cinema-border pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-accent font-heading">
          Rating
        </h4>
        <div className="flex items-center gap-1.5">
          {[5, 4, 3].map((stars) => {
            const isSelected = minRating === stars;
            return (
              <button
                key={stars}
                onClick={() => handleRatingClick(stars)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? 'border-accent bg-accent/15 text-accent shadow-cinema-sm'
                    : 'border-cinema-border bg-cinema-tertiary text-cinema-text-secondary hover:border-cinema-border-strong hover:text-cinema-text'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{stars}+</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust Callout */}
      <div className="p-3.5 rounded-xl bg-cinema-tertiary/60 border border-cinema-border text-xs text-cinema-text-secondary space-y-1">
        <div className="font-bold text-cinema-text flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span>Zero-Deposit KYC</span>
        </div>
        <p className="text-[11px] text-cinema-text-muted leading-relaxed">
          Verified filmmakers enjoy instant gear dispatch with zero security hold.
        </p>
      </div>
    </div>
  );
}
