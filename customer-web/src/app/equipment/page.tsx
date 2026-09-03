'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Sparkles, Filter, Grid3X3 } from 'lucide-react';
import { Equipment } from '../../types/equipment';
import { EquipmentService } from '../../services/equipment.service';
import { EquipmentCard } from '../../components/equipment/EquipmentCard';
import { CatalogFilterSidebar } from '../../components/equipment/CatalogFilterSidebar';
import { CommandPalette } from '../../components/layout/CommandPalette';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 60000]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    EquipmentService.getAllEquipment()
      .then((data) => {
        setEquipment(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrands([]);
    setPriceRange([0, 60000]);
    setOnlyAvailable(false);
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    selectedBrands.length +
    (priceRange[1] < 60000 ? 1 : 0) +
    (onlyAvailable ? 1 : 0);

  // Filter items
  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' ||
      item.category_id?.toLowerCase() === selectedCategory.toLowerCase() ||
      item.category_name?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'cameras' && item.name.toLowerCase().includes('fx') || item.name.toLowerCase().includes('komodo') || item.name.toLowerCase().includes('alexa') || item.name.toLowerCase().includes('c70')) ||
      (selectedCategory === 'lenses' && item.name.toLowerCase().includes('prime') || item.name.toLowerCase().includes('lens') || item.name.toLowerCase().includes('anamorphic') || item.name.toLowerCase().includes('cooke') || item.name.toLowerCase().includes('sigma')) ||
      (selectedCategory === 'lighting' && item.name.toLowerCase().includes('aputure') || item.name.toLowerCase().includes('nanlite') || item.name.toLowerCase().includes('light')) ||
      (selectedCategory === 'audio' && item.name.toLowerCase().includes('mic') || item.name.toLowerCase().includes('sennheiser') || item.name.toLowerCase().includes('audio') || item.name.toLowerCase().includes('rode')) ||
      (selectedCategory === 'stabilizers' && item.name.toLowerCase().includes('ronin') || item.name.toLowerCase().includes('gimbal')) ||
      (selectedCategory === 'kits' && item.name.toLowerCase().includes('kit') || item.name.toLowerCase().includes('package'));

    const matchesBrand =
      selectedBrands.length === 0 ||
      selectedBrands.some((b) => item.brand.toLowerCase().includes(b.toLowerCase()) || item.name.toLowerCase().includes(b.toLowerCase()));

    const rate = item.daily_rate || item.daily_price || 0;
    const matchesPrice = rate >= priceRange[0] && rate <= priceRange[1];

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  // Sort items
  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    const rateA = a.daily_rate || a.daily_price || 0;
    const rateB = b.daily_rate || b.daily_price || 0;
    if (sortBy === 'price-asc') return rateA - rateB;
    if (sortBy === 'price-desc') return rateB - rateA;
    if (sortBy === 'newest') return (b.id || '').localeCompare(a.id || '');
    return (b.rating || 4.9) - (a.rating || 4.9);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-1 border border-surface-3 text-xs font-mono font-medium text-zinc-300 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Calibrated &amp; Sensor Tested</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Cinema Fleet &amp; Optics Vault
        </h1>
        <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
          Production-tested cinema bodies, anamorphic lenses, lighting packages, and wireless sound units. Inspected prior to each shoot.
        </p>
      </div>

      {/* Main Layout: Sidebar Left, Grid Right */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden w-full flex items-center justify-between p-3 rounded-xl bg-surface-1 border border-surface-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-white"
          >
            <Filter className="w-4 h-4 text-accent" />
            <span>Filters ({activeFilterCount})</span>
          </button>
          <span className="text-xs font-mono text-zinc-500">
            {sortedEquipment.length} items
          </span>
        </div>

        {/* Desktop Sidebar / Mobile Collapsible */}
        <div className={`${mobileFilterOpen ? 'block' : 'hidden'} lg:block w-full lg:w-72`}>
          <CatalogFilterSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBrands={selectedBrands}
            toggleBrand={toggleBrand}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onlyAvailable={onlyAvailable}
            setOnlyAvailable={setOnlyAvailable}
            clearFilters={clearFilters}
            activeFilterCount={activeFilterCount}
            openCommandPalette={() => setIsCommandOpen(true)}
          />
        </div>

        {/* Equipment Results Column */}
        <div className="flex-1 w-full space-y-6">
          {/* Top Bar: Count & Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-1/50 border border-surface-3">
            <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-zinc-500" />
              <span>
                Showing <strong className="text-white font-bold">{sortedEquipment.length}</strong> of{' '}
                <span className="text-zinc-500">{equipment.length} items</span>
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-mono text-zinc-500 shrink-0">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-surface-2 border border-surface-3 text-white text-xs font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent"
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Grid of Equipment Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 rounded-2xl shimmer-bg border border-surface-3" />
              ))}
            </div>
          ) : sortedEquipment.length === 0 ? (
            <div className="text-center py-20 bg-surface-1 rounded-2xl border border-surface-3 p-8">
              <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center mx-auto text-zinc-500 mb-4">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-display text-white">No Equipment Found</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                No fleet units match your current filter selection. Try clearing or expanding your criteria.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-surface-2 hover:bg-surface-3 text-accent text-xs font-semibold rounded-xl border border-surface-3 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {sortedEquipment.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                  >
                    <EquipmentCard equipment={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </div>
  );
}

export default function EquipmentCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs font-mono text-zinc-500">
          Loading Fleet Vault...
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
