'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Calendar, Truck, Store } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItemRow } from '../../components/cart/CartItem';
import { CartSummary } from '../../components/cart/CartSummary';
import { Button } from '../../components/ui/Button';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    startDate,
    endDate,
    setDates,
    deliveryMode,
    setDeliveryMode,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Your Production Kit is Empty</h2>
        <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto">
          Explore cinema cameras, cine lenses, studio lights, and sound rigs to build your rental package.
        </p>
        <div className="mt-8">
          <Link href="/equipment">
            <Button size="lg" className="gap-2">
              Browse Equipment Fleet
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Your Filming Package</h1>
          <p className="text-xs text-zinc-400 mt-1">Review reserved camera units and configure delivery logistics.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-500 hover:text-rose-400 transition-colors font-mono"
        >
          Clear Package
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Logistics Configuration Box */}
          <div className="p-5 rounded-2xl bg-cinema-card border border-cinema-border space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Shoot Schedule & Handover Mode
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-zinc-400 block mb-1">Shoot Start / Pickup</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setDates(e.target.value, endDate)}
                  className="w-full bg-zinc-900 border border-cinema-border rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block mb-1">Shoot Wrap / Return</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setDates(startDate, e.target.value)}
                  className="w-full bg-zinc-900 border border-cinema-border rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Delivery Toggle */}
            <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryMode('PICKUP')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  deliveryMode === 'PICKUP'
                    ? 'bg-primary/10 border-primary text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Store className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-xs font-bold block">Hub Vault Pickup</span>
                  <span className="text-[10px] text-zinc-400">Free • Film City Hub</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMode('DELIVERY')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  deliveryMode === 'DELIVERY'
                    ? 'bg-primary/10 border-primary text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-xs font-bold block">Doorstep Set Delivery</span>
                  <span className="text-[10px] text-zinc-400">₹500 • GPS set drop</span>
                </div>
              </button>
            </div>
          </div>

          {/* Cart Item Rows */}
          <div className="space-y-3">
            {items.map((item) => (
              <CartItemRow
                key={item.equipment.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <Link href="/equipment" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white pt-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Add More Production Gear
          </Link>
        </div>

        {/* Summary Column */}
        <div className="lg:col-span-4">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
