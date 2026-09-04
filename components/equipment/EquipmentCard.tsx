'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Equipment } from '@/types/equipment';
import { Calendar, ShoppingBag, Heart, Check, Sparkles, MapPin } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { format, addDays } from 'date-fns';

interface EquipmentCardProps {
  equipment: Equipment;
  onViewPricing?: (equipment: Equipment) => void;
  onWishlistToggle?: (equipmentId: string) => void;
  isWishlisted?: boolean;
  viewMode?: 'grid' | 'list';
}

export function EquipmentCard({
  equipment,
  onViewPricing,
  onWishlistToggle,
  isWishlisted = false,
  viewMode = 'grid',
}: EquipmentCardProps) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [addedDirectly, setAddedDirectly] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
    if (onWishlistToggle) {
      onWishlistToggle(equipment.id);
    }
  };

  const handleQuickCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const today = new Date();
    const startIso = format(today, 'yyyy-MM-dd');
    const endIso = format(addDays(today, 1), 'yyyy-MM-dd');
    addToCart(equipment, startIso, endIso, 1);
    setAddedDirectly(true);
    setTimeout(() => setAddedDirectly(false), 2000);
  };

  const handleOpenPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewPricing) {
      onViewPricing(equipment);
    }
  };

  const imageUrl =
    equipment.image_url ||
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group relative flex flex-col justify-between h-full bg-cinema-surface rounded-2xl p-4 sm:p-5 border border-cinema-border shadow-cinema-sm hover:shadow-cinema-lg hover:border-cinema-border-strong hover:-translate-y-1 transition-all duration-300">
      {/* Top Badges & Wishlist */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {equipment.is_featured && (
            <span className="inline-flex items-center gap-1 bg-accent/15 text-accent border border-accent/30 font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-cinema-glow">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Flagship</span>
            </span>
          )}
          {equipment.brand && (
            <span className="bg-cinema-tertiary text-cinema-text-secondary font-bold text-[10px] px-2 py-0.5 rounded-md border border-cinema-border">
              {equipment.brand.name}
            </span>
          )}
        </div>

        <button
          onClick={handleWishlistClick}
          className={`p-1.5 rounded-full transition cursor-pointer ${
            wishlisted
              ? 'bg-semantic-error/20 text-semantic-error'
              : 'bg-cinema-tertiary/70 text-cinema-text-muted hover:text-semantic-error hover:bg-cinema-card'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image Stage */}
      <Link
        href={`/equipment/${equipment.id}`}
        prefetch={true}
        className="block relative aspect-square w-full mb-3.5 rounded-xl overflow-hidden bg-cinema-bg border border-cinema-border/60 flex items-center justify-center p-3 group/img"
      >
        <Image
          src={imageUrl}
          alt={equipment.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-3 transition-transform duration-500 group-hover/img:scale-105"
        />
        {/* Availability indicator badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cinema-bg/90 backdrop-blur-sm border border-cinema-border text-[10px] text-semantic-success font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse-dot" />
          <span>In Stock</span>
        </div>
      </Link>

      {/* Product Name & Category */}
      <div className="mb-3 text-left">
        <span className="text-[11px] text-cinema-text-muted font-medium uppercase tracking-wider block mb-1">
          {equipment.category?.name || 'Cinema Equipment'}
        </span>
        <Link href={`/equipment/${equipment.id}`} prefetch={true}>
          <h3 className="text-sm sm:text-base font-bold text-cinema-text font-heading line-clamp-2 min-h-[2.75rem] group-hover:text-accent transition-colors">
            {equipment.name}
          </h3>
        </Link>
      </div>

      {/* Pricing and Action Row */}
      <div className="space-y-2.5 pt-2 border-t border-cinema-border/70">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <div className="text-xs text-cinema-text-muted">Daily Rental</div>
            <div className="text-base sm:text-lg font-black text-accent font-heading">
              ₹{equipment.daily_price?.toLocaleString()}
              <span className="text-xs text-cinema-text-muted font-normal">/day</span>
            </div>
          </div>
          {equipment.daily_price && (
            <div className="text-[11px] text-cinema-text-disabled line-through">
              ₹{Math.round(equipment.daily_price * 1.25).toLocaleString()}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenPricing}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cinema-tertiary hover:bg-accent hover:text-cinema-bg text-cinema-text font-bold text-xs transition-all active:scale-95 border border-cinema-border hover:border-accent cursor-pointer group/btn"
          >
            <Calendar className="w-3.5 h-3.5 text-accent group-hover/btn:text-cinema-bg transition-colors" />
            <span>Select Dates</span>
          </button>

          <button
            onClick={handleQuickCart}
            className={`p-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center border cursor-pointer ${
              addedDirectly
                ? 'bg-semantic-success text-white border-semantic-success'
                : 'bg-cinema-tertiary hover:bg-accent hover:text-cinema-bg text-cinema-text border-cinema-border hover:border-accent'
            }`}
            title="Add to Cart"
            aria-label="Add to Cart"
          >
            {addedDirectly ? (
              <Check className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
