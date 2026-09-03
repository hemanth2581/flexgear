'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { EquipmentService } from '../../services/equipment.service';
import { Equipment } from '../../types/equipment';

export const FeaturedCarousel: React.FC = () => {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    EquipmentService.getAllEquipment()
      .then((data) => {
        // Pick flagship items or top 6
        setItems(data.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const targetIndex = Math.max(0, Math.min(index, items.length - 1));
    setActiveIndex(targetIndex);
    const cardWidth = 360;
    scrollContainerRef.current.scrollTo({
      left: targetIndex * cardWidth,
      behavior: 'smooth',
    });
  };

  if (loading && items.length === 0) {
    return (
      <section className="py-24 border-b border-surface-3 bg-surface-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-48 shimmer-bg rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 shimmer-bg rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 border-b border-surface-3 bg-surface-0 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-accent font-semibold mb-2">
              Cinema Masterpieces
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white tracking-tight">
              Flagship Fleet Units
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Top-requested industry rigs available for immediate shoot booking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous flagship gear"
              className="p-2.5 rounded-xl bg-surface-1 border border-surface-3 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex >= items.length - 3}
              aria-label="Next flagship gear"
              className="p-2.5 rounded-xl bg-surface-1 border border-surface-3 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, idx) => {
            const dailyRate = item.daily_price || item.daily_rate || 15000;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="min-w-[320px] sm:min-w-[360px] max-w-[360px] snap-start bg-surface-1 border border-surface-3 hover:border-surface-4 rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between relative"
              >
                {/* Subtle Amber Glow Bleed on Hover */}
                <div className="absolute -bottom-10 inset-x-0 h-20 bg-accent/20 filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* Image Section */}
                  <div className="relative aspect-video w-full bg-surface-2 overflow-hidden">
                    <img
                      src={item.thumbnail_url || item.image_url || 'https://images.unsplash.com/photo-1589872765507-6f813958742b?auto=format&fit=crop&w=800&q=80'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-0/80 backdrop-blur-md border border-surface-3 text-[10px] font-mono text-zinc-300 font-semibold uppercase">
                      {item.brand}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                      CALIBRATED
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                      {item.category_name || 'Cinema Body'}
                    </div>
                    <h3 className="text-base font-bold font-display text-white group-hover:text-accent transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Pricing & Booking CTA */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-surface-3/50 mt-4">
                  <div>
                    <span className="text-xs text-zinc-500 block">Daily rate</span>
                    <span className="text-base font-bold font-mono text-white">
                      ₹{dailyRate.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Link href={`/equipment/${item.id}`}>
                    <button className="px-4 py-2 bg-accent hover:bg-accent-hover text-surface-0 font-bold text-xs rounded-xl transition-all active:scale-[0.98] flex items-center gap-1.5 shadow-md shadow-accent/10">
                      Book Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                activeIndex === i ? 'w-6 bg-accent' : 'w-1.5 bg-surface-3 hover:bg-surface-4'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
