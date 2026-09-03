'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Plus, Check, Star } from 'lucide-react';
import { Equipment } from '../../types/equipment';
import { formatCurrency } from '../../utils/currency';
import { useCart } from '../../context/CartContext';

export const EquipmentCard: React.FC<{ equipment: Equipment }> = ({ equipment }) => {
  const { addItem, items } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isInCart = items?.some((i) => i.equipment.id === equipment.id) ?? false;

  const dailyPrice = equipment.daily_price || equipment.daily_rate || 15000;
  const weeklyDailyEquivalent = Math.round(dailyPrice * 0.85); // 15% weekly discount

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(equipment);
  };

  return (
    <div className="group rounded-2xl bg-surface-1 border border-surface-3 hover:border-surface-4 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1 relative">
      <div>
        {/* Aspect-Video Image Header */}
        <div className="relative aspect-video w-full overflow-hidden bg-surface-2">
          <img
            src={equipment.thumbnail_url || equipment.image_url || 'https://images.unsplash.com/photo-1589872765507-6f813958742b?auto=format&fit=crop&w=800&q=80'}
            alt={equipment.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent opacity-80" />

          {/* Top Left Availability Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-0/80 backdrop-blur-md border border-surface-3 text-[10px] font-mono font-medium text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Available</span>
          </div>

          {/* Top Right Wishlist Heart Button */}
          <button
            onClick={toggleWishlist}
            aria-label="Toggle Wishlist"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-0/80 backdrop-blur-md border border-surface-3 flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition-all active:scale-90"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-5 pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              {equipment.category_name || 'Cinema Body'}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-mono text-accent">
              <Star className="w-3 h-3 fill-current" />
              <span>{(equipment.rating || 4.9).toFixed(1)}</span>
            </div>
          </div>

          <Link href={`/equipment/${equipment.id || equipment.slug}`}>
            <h3 className="text-base font-semibold font-display text-white group-hover:text-accent transition-colors line-clamp-1">
              {equipment.name}
            </h3>
          </Link>

          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            {equipment.brand}
          </p>

          <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
            {equipment.description}
          </p>
        </div>
      </div>

      {/* Pricing & Booking Row */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-surface-3/50 flex items-center justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono text-accent">
                {formatCurrency(dailyPrice)}
              </span>
              <span className="text-xs text-zinc-500 font-mono">/day</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
              <span className="line-through">{formatCurrency(dailyPrice)}</span>
              <span className="text-emerald-400 font-semibold">{formatCurrency(weeklyDailyEquivalent)} (7+ d)</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-sans transition-all flex items-center gap-1.5 active:scale-[0.98] ${
              isInCart
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-surface-2 hover:bg-surface-3 border border-surface-3 hover:border-surface-4 text-white'
            }`}
          >
            {isInCart ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5 text-accent" />}
            {isInCart ? 'In Cart' : 'Rent'}
          </button>
        </div>

        <Link href={`/equipment/${equipment.id || equipment.slug}`} className="block">
          <button className="w-full py-2 bg-surface-2 hover:bg-surface-3 border border-surface-3 hover:border-surface-4 text-zinc-300 hover:text-white text-xs font-medium rounded-xl transition-all">
            View Technical Specs
          </button>
        </Link>
      </div>
    </div>
  );
};
