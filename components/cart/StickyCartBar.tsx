'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/components/providers/CartProvider';
import { ShoppingCart, Handshake, Flame } from 'lucide-react';

export function StickyCartBar() {
  const { itemCount, openCart } = useCart();

  return (
    <>
      {/* Floating Partner with FlexGear Pill */}
      <Link href="/partner" className="partner-btn group">
        <Handshake className="w-4 h-4" />
        <span>Partner with FlexGear</span>
      </Link>

      {/* Floating Sell/Buy Used Gear Pill */}
      <Link href="/equipment?mode=used" className="sell-product-btn group">
        <Flame className="w-4 h-4 text-gold" />
        <span>Sell / Buy Gear</span>
      </Link>

      {/* Bottom Sticky Cart Bar */}
      {itemCount > 0 && (
        <div className="cart-bar animate-in slide-in-from-bottom duration-300">
          <div className="cart-bar-inner">
            <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-white">
              <ShoppingCart className="w-5 h-5 text-gold" />
              <span>
                {itemCount} {itemCount === 1 ? 'Item' : 'Items'} Selected
              </span>
            </div>

            <button
              onClick={openCart}
              className="cart-btn-white shadow-md cursor-pointer uppercase font-black"
            >
              VIEW CART
            </button>
          </div>
        </div>
      )}
    </>
  );
}
