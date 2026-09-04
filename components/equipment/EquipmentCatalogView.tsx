'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Equipment, Category, Brand } from '@/types/equipment';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { PriceCalendarModal } from '@/components/equipment/PriceCalendarModal';
import { LayoutGrid, List, SlidersHorizontal, ArrowUpDown, X, Sparkles, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EquipmentCatalogViewProps {
  equipmentList: Equipment[];
  totalCount: number;
  categories: Category[];
  brands: Brand[];
  page: number;
  limit: number;
  sortParam: string;
}

export function EquipmentCatalogView({
  equipmentList,
  totalCount,
  categories,
  brands,
  page,
  limit,
  sortParam,
}: EquipmentCatalogViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEquipmentForPricing, setSelectedEquipmentForPricing] = useState<Equipment | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const categoryParam = searchParams.get('category');
  const brandParam = searchParams.get('brand');
  const searchParam = searchParams.get('search');
  const maxPriceParam = searchParams.get('maxPrice');
  const minRatingParam = searchParams.get('minRating');

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    params.delete('page');
    router.push(`/equipment?${params.toString()}`);
  };

  const removeFilter = (key: string, valueToRemove?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === 'brand' && valueToRemove && brandParam) {
      const remaining = brandParam
        .split(',')
        .filter((b) => b !== valueToRemove);
      if (remaining.length > 0) params.set('brand', remaining.join(','));
      else params.delete('brand');
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`/equipment?${params.toString()}`);
  };

  const handleOpenPricing = (equipment: Equipment) => {
    setSelectedEquipmentForPricing(equipment);
    setIsPricingModalOpen(true);
  };

  const activeCategory = categories.find((c) => c.slug === categoryParam);
  const activeBrandsList = brandParam ? brandParam.split(',') : [];

  return (
    <div className="space-y-6">
      {/* Top Filter Bar: View Switcher, Sort & Total */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-cinema-border bg-cinema-surface p-4 shadow-cinema-sm">
        <div className="flex items-center gap-3">
          <div className="text-xs text-cinema-text-secondary font-medium">
            Showing <strong className="text-cinema-text font-bold">{equipmentList.length}</strong> of{' '}
            <strong className="text-accent font-bold">{totalCount}</strong> rental gear items
          </div>

          {/* Quick Department Indicator */}
          {activeCategory && (
            <span className="bg-accent/15 text-accent border border-accent/30 font-bold text-xs px-2.5 py-0.5 rounded-full">
              {activeCategory.name}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          {/* Grid / List View Toggle */}
          <div className="flex items-center rounded-xl border border-cinema-border bg-cinema-bg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-accent text-cinema-bg font-bold shadow-cinema-sm'
                  : 'text-cinema-text-muted hover:text-cinema-text'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List View"
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-accent text-cinema-bg font-bold shadow-cinema-sm'
                  : 'text-cinema-text-muted hover:text-cinema-text'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-cinema-text-muted" />
            <select
              value={sortParam}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-9 rounded-xl border border-cinema-border bg-cinema-surface hover:bg-cinema-tertiary px-3 text-xs font-semibold text-cinema-text focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-cinema-surface text-cinema-text">Featured &amp; Newest</option>
              <option value="price_asc" className="bg-cinema-surface text-cinema-text">Price: Low to High</option>
              <option value="price_desc" className="bg-cinema-surface text-cinema-text">Price: High to Low</option>
              <option value="rating" className="bg-cinema-surface text-cinema-text">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(categoryParam || activeBrandsList.length > 0 || searchParam || maxPriceParam || minRatingParam) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-cinema-text-muted font-semibold">Active:</span>

          {searchParam && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-cinema-surface px-2.5 py-1 text-xs text-cinema-text border border-cinema-border">
              <span>Search: "{searchParam}"</span>
              <button onClick={() => removeFilter('search')} className="text-cinema-text-muted hover:text-cinema-text cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {categoryParam && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-accent/15 px-2.5 py-1 text-xs text-accent border border-accent/30 font-bold">
              <span>{activeCategory?.name || categoryParam}</span>
              <button onClick={() => removeFilter('category')} className="text-accent hover:text-accent-hover cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeBrandsList.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 rounded-lg bg-cinema-surface px-2.5 py-1 text-xs text-cinema-text border border-cinema-border font-medium"
            >
              <span>{b.toUpperCase()}</span>
              <button onClick={() => removeFilter('brand', b)} className="text-cinema-text-muted hover:text-cinema-text cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {maxPriceParam && Number(maxPriceParam) < 10000 && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-cinema-surface px-2.5 py-1 text-xs text-cinema-text border border-cinema-border">
              <span>Under ₹{maxPriceParam}/day</span>
              <button onClick={() => removeFilter('maxPrice')} className="text-cinema-text-muted hover:text-cinema-text cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <Link href="/equipment" className="text-xs text-accent hover:underline font-bold ml-1">
            Clear all
          </Link>
        </div>
      )}

      {/* Equipment Cards List / Grid */}
      {equipmentList.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'flex flex-col space-y-4'
          }
        >
          {equipmentList.map((gear) => (
            <EquipmentCard
              key={gear.id}
              equipment={gear}
              viewMode={viewMode}
              onViewPricing={handleOpenPricing}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-cinema-border bg-cinema-surface p-16 text-center space-y-4 shadow-cinema-sm">
          <SlidersHorizontal className="h-10 w-10 text-accent mx-auto" />
          <h3 className="text-lg font-bold text-cinema-text font-heading">No Equipment Matches Found</h3>
          <p className="text-xs text-cinema-text-secondary max-w-md mx-auto leading-relaxed">
            No equipment currently matches your combination of filters. Try clearing some filters or searching for another camera or lens model.
          </p>
          <div className="pt-2">
            <Link href="/equipment">
              <Button className="rounded-xl font-bold text-xs bg-accent hover:bg-accent-hover text-cinema-bg">
                Clear All Active Filters
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-8 border-t border-cinema-border">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isCurrent = p === page;
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', p.toString());

            return (
              <Link
                key={p}
                href={`/equipment?${params.toString()}`}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-accent text-cinema-bg shadow-cinema-accent font-black'
                    : 'border border-cinema-border bg-cinema-surface text-cinema-text hover:bg-cinema-tertiary'
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}

      {/* Price Calendar Modal */}
      <PriceCalendarModal
        equipment={selectedEquipmentForPricing}
        isOpen={isPricingModalOpen}
        onClose={() => {
          setIsPricingModalOpen(false);
          setSelectedEquipmentForPricing(null);
        }}
      />
    </div>
  );
}
