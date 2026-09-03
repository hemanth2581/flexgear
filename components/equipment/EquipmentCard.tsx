'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Equipment } from '@/types/equipment';
import { formatCurrency } from '@/lib/utils';
import { Calendar, ShoppingBag, Heart, Scale, Check, ShieldCheck, Zap } from 'lucide-react';
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
    <div className="group relative flex flex-col justify-between h-full bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
      {/* Top Badges & Wishlist */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-1">
          {equipment.is_featured && (
            <span className="bg-gold text-gray-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-md shadow-sm">
              Popular
            </span>
          )}
          {equipment.brand && (
            <span className="bg-gray-100 text-gray-700 font-bold text-[10px] px-2 py-0.5 rounded-md border border-gray-200">
              {equipment.brand.name}
            </span>
          )}
        </div>

        <button
          onClick={handleWishlistClick}
          className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition ${
            wishlisted
              ? 'bg-rose-50 text-rose-500'
              : 'bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <Link href={`/equipment/${equipment.id}`} className="block relative aspect-square w-full mb-3 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-2">
        <Image
          src={imageUrl}
          alt={equipment.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Product Name */}
      <div className="mb-2">
        <Link href={`/equipment/${equipment.id}`}>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 min-h-[2.75rem] hover:text-lenstiger transition-colors">
            {equipment.name}
          </h3>
        </Link>
        <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
          {equipment.category?.name || 'Production Gear'}
        </span>
      </div>

      {/* Horizontal Divider */}
      <hr className="my-2.5 border-gray-100" />

      {/* Bottom Action Row (View Pricing Button + Cart Button) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* View Pricing Button */}
          <button
            onClick={handleOpenPricing}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-lenstiger hover:text-white text-gray-800 font-bold text-xs transition-all active:scale-95 group/btn"
          >
            <Calendar className="w-3.5 h-3.5 text-lenstiger group-hover/btn:text-white transition-colors" />
            <span>View Pricing</span>
          </button>

          {/* Quick Cart Button */}
          <button
            onClick={handleQuickCart}
            className={`p-2 rounded-xl transition-all active:scale-95 flex items-center justify-center ${
              addedDirectly
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 hover:bg-gold hover:text-gray-950 text-gray-700'
            }`}
            title="Add to Cart"
            aria-label="Add to Cart"
          >
            {addedDirectly ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Daily Rate Tag */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-lenstiger bg-lenstiger-50 py-1.5 rounded-lg border border-lenstiger/10">
          <span>₹{equipment.daily_price.toLocaleString()}/day</span>
          <span className="text-[10px] text-gray-400 font-normal line-through">
            ₹{Math.round(equipment.daily_price * 1.25).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
