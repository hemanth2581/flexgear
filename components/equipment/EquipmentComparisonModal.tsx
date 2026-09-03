'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Equipment } from '@/types/equipment';
import { formatCurrency } from '@/lib/utils';
import { X, ArrowRight, Check, Star, Shield, Scale, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function EquipmentComparisonModal() {
  const [comparedItems, setComparedItems] = useState<Equipment[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadItems = () => {
      try {
        const stored = localStorage.getItem('flexgear_comparison');
        if (stored) {
          setComparedItems(JSON.parse(stored));
        }
      } catch (e) {}
    };

    loadItems();

    const handleStorageChange = () => loadItems();
    window.addEventListener('flexgear_comparison_updated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('flexgear_comparison_updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleRemove = (id: string) => {
    const updated = comparedItems.filter((item) => item.id !== id);
    setComparedItems(updated);
    localStorage.setItem('flexgear_comparison', JSON.stringify(updated));
    window.dispatchEvent(new Event('flexgear_comparison_updated'));
  };

  const handleClear = () => {
    setComparedItems([]);
    localStorage.removeItem('flexgear_comparison');
    window.dispatchEvent(new Event('flexgear_comparison_updated'));
    setIsOpen(false);
  };

  if (comparedItems.length === 0) return null;

  return (
    <>
      {/* Floating Comparison Dock at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/40 bg-zinc-950/90 px-4 py-3 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Scale className="h-4 w-4" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-white">Compare Gear</div>
              <div className="text-[10px] text-zinc-400">{comparedItems.length} of 4 selected</div>
            </div>
          </div>

          {/* Item Thumbnails */}
          <div className="flex items-center -space-x-2 overflow-hidden px-1">
            {comparedItems.map((item) => (
              <div
                key={item.id}
                className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border-2 border-zinc-900 bg-zinc-800 shadow-md group"
              >
                <Image
                  src={item.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&auto=format&fit=crop&q=80'}
                  alt={item.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
                <button
                  onClick={() => handleRemove(item.id)}
                  aria-label="Remove item"
                  className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-2">
            <Button
              size="sm"
              onClick={() => setIsOpen(true)}
              className="rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 h-9 text-xs"
            >
              <span>Compare Specs ({comparedItems.length})</span>
            </Button>
            <button
              onClick={handleClear}
              className="text-[11px] font-medium text-zinc-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Side-by-Side Equipment Comparison</h3>
                  <p className="text-xs text-zinc-400">Compare technical specifications, optics, codecs, and daily rental pricing</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleClear}
                  className="text-xs font-semibold text-zinc-400 hover:text-zinc-200"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Comparison Grid Table */}
            <div className="flex-1 overflow-auto py-6">
              <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${comparedItems.length}, minmax(220px, 1fr))` }}>
                {/* Column 0: Headers */}
                <div className="space-y-4 text-xs font-bold text-zinc-400 pt-36">
                  <div className="h-10 flex items-center border-b border-zinc-800/60">Daily Rate</div>
                  <div className="h-10 flex items-center border-b border-zinc-800/60">Weekly Rate</div>
                  <div className="h-10 flex items-center border-b border-zinc-800/60">Security Deposit</div>
                  <div className="h-10 flex items-center border-b border-zinc-800/60">Rating & Reviews</div>
                  <div className="h-10 flex items-center border-b border-zinc-800/60">Sensor / Optics</div>
                  <div className="h-10 flex items-center border-b border-zinc-800/60">Mount</div>
                  <div className="h-10 flex items-center border-b border-zinc-800/60">Max Resolution</div>
                  <div className="h-10 flex items-center border-b border-zinc-800/60">Dynamic Range</div>
                  <div className="h-10 flex items-center border-b border-zinc-800/60">Weight</div>
                  <div className="h-20 flex items-center border-b border-zinc-800/60">Included Accessories</div>
                </div>

                {/* Items Columns */}
                {comparedItems.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 space-y-4 flex flex-col">
                    {/* Item Top Card */}
                    <div className="h-32 flex flex-col justify-between">
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-zinc-950 mb-2">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="absolute right-1.5 top-1.5 rounded-full bg-zinc-950/80 p-1 text-zinc-400 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <h4 className="font-bold text-white text-xs line-clamp-2">{item.name}</h4>
                    </div>

                    {/* Rates */}
                    <div className="h-10 flex items-center border-b border-zinc-800/60 text-sm font-black text-amber-400">
                      {formatCurrency(item.daily_price)} <span className="text-[10px] text-zinc-500 font-normal ml-1">/ day</span>
                    </div>

                    <div className="h-10 flex items-center border-b border-zinc-800/60 text-xs font-semibold text-zinc-300">
                      {item.weekly_price ? formatCurrency(item.weekly_price) : formatCurrency(item.daily_price * 5)}
                    </div>

                    <div className="h-10 flex items-center border-b border-zinc-800/60 text-xs text-zinc-300">
                      {formatCurrency(item.security_deposit)}
                    </div>

                    <div className="h-10 flex items-center border-b border-zinc-800/60 text-xs text-white gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{item.rating?.toFixed(1) || '4.9'}</span>
                      <span className="text-zinc-500 text-[10px]">({item.review_count || 30})</span>
                    </div>

                    <div className="h-10 flex items-center border-b border-zinc-800/60 text-xs text-zinc-200 font-mono">
                      {item.specs?.sensor || 'Custom Cinema Standard'}
                    </div>

                    <div className="h-10 flex items-center border-b border-zinc-800/60 text-xs text-zinc-200">
                      {item.specs?.mount || 'Native Mount / Universal'}
                    </div>

                    <div className="h-10 flex items-center border-b border-zinc-800/60 text-xs text-amber-300 font-semibold">
                      {item.specs?.resolution || '4K UHD / DCI'}
                    </div>

                    <div className="h-10 flex items-center border-b border-zinc-800/60 text-xs text-zinc-200">
                      {item.specs?.dynamic_range || '15+ Stops'}
                    </div>

                    <div className="h-10 flex items-center border-b border-zinc-800/60 text-xs text-zinc-300 font-mono">
                      {item.specs?.weight || 'Pro Standard'}
                    </div>

                    <div className="h-20 flex items-center border-b border-zinc-800/60 text-[11px] text-zinc-400 overflow-y-auto">
                      {(item.included_accessories || []).slice(0, 3).join(', ')}
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 mt-auto">
                      <Link href={`/equipment/${item.id}`} onClick={() => setIsOpen(false)}>
                        <Button className="w-full rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 h-9">
                          <span>View & Rent</span>
                          <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
