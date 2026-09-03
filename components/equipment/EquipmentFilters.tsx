'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category, Brand } from '@/types/equipment';
import { formatCurrency } from '@/lib/utils';
import { Filter, RotateCcw, Check, Star, ShieldCheck } from 'lucide-react';

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
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Filters Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-gray-900">
          <Filter className="h-4 w-4 text-lenstiger" />
          <span>Filter Equipment</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-xs font-bold text-lenstiger hover:underline transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryClick('')}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
              selectedCategory === ''
                ? 'bg-lenstiger text-white font-bold shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === '' && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-lenstiger text-white font-bold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Brand Filter Pills */}
      <div className="space-y-3 border-t border-gray-100 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Brands
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {brands.map((brand) => {
            const isSelected = selectedBrands.includes(brand.slug);
            return (
              <button
                key={brand.id}
                onClick={() => handleBrandToggle(brand.slug)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  isSelected
                    ? 'border-lenstiger bg-lenstiger-50 text-lenstiger font-bold'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {brand.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Daily Rate Price Slider */}
      <div className="space-y-3 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Max Daily Rate
          </h4>
          <span className="text-xs font-bold text-lenstiger">
            {formatCurrency(maxPrice)}
          </span>
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
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-lenstiger"
        />

        <div className="flex justify-between text-[10px] font-medium text-gray-400">
          <span>₹500</span>
          <span>₹5,000</span>
          <span>₹10,000+</span>
        </div>
      </div>

      {/* 4. Minimum Rating Filter */}
      <div className="space-y-3 border-t border-gray-100 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Minimum Rating
        </h4>
        <div className="grid grid-cols-4 gap-1.5">
          {[4.5, 4.0, 3.5, 3.0].map((starVal) => {
            const isSelected = minRating === starVal;
            return (
              <button
                key={starVal}
                onClick={() => handleRatingClick(starVal)}
                className={`flex items-center justify-center gap-1 rounded-lg border py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-lenstiger bg-lenstiger-50 text-lenstiger font-bold'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Star className="h-3 w-3 fill-gold text-gold" />
                <span>{starVal}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Live Testing Guarantee Badge */}
      <div className="rounded-xl border border-lenstiger/20 bg-lenstiger-50 p-3 space-y-1.5 text-[11px] text-gray-700">
        <div className="flex items-center gap-1.5 text-lenstiger font-bold">
          <ShieldCheck className="h-4 w-4" />
          <span>FlexGear Guarantee</span>
        </div>
        <p className="text-[10px] leading-relaxed text-gray-600">
          Sensor swabbed, optics laser-checked, and firmware updated before every dispatch.
        </p>
      </div>
    </div>
  );
}
