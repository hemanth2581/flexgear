'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/components/providers/CartProvider';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';
import { ShoppingBag, ArrowLeft, RefreshCw, Trash2, Camera, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const {
    items,
    deliveryMode,
    setDeliveryMode,
    updateItemQuantity,
    updateItemDates,
    removeFromCart,
    clearCart,
    pricing,
    isCheckingAvailability,
    recheckCartAvailability,
  } = useCart();

  const hasUnavailableItems = items.some((item) => item.isAvailable === false);

  if (items.length === 0) {
    return (
      <div className="bg-cinema-bg min-h-screen py-24 px-4 text-cinema-text">
        <div className="mx-auto max-w-2xl bg-cinema-surface rounded-3xl p-12 text-center border border-cinema-border shadow-cinema-md space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cinema-tertiary border border-cinema-border text-accent shadow-cinema-glow">
            <ShoppingBag className="h-10 w-10 text-accent" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-cinema-text font-heading">
              Your Rental Cart is Empty
            </h1>
            <p className="text-xs sm:text-sm text-cinema-text-secondary max-w-md mx-auto leading-relaxed">
              Explore our professional catalog of cameras, cinema lenses, lighting, and shooting bundles in your city.
            </p>
          </div>
          <Link href="/equipment">
            <Button size="lg" className="rounded-xl font-black bg-accent hover:bg-accent-hover text-cinema-bg px-8 shadow-cinema-accent">
              <Camera className="h-4 w-4 mr-2" />
              <span>Browse Cinema Equipment</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cinema-bg min-h-screen py-10 text-cinema-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cinema-border pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 shadow-cinema-glow mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production Order</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-cinema-text font-heading">
              Rental Equipment Cart
            </h1>
            <p className="text-xs sm:text-sm text-cinema-text-secondary mt-1">
              Review selected gear, customize shoot dates, and verify total costs with 18% GST and refundable deposit.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => recheckCartAvailability()}
              disabled={isCheckingAvailability}
              className="text-xs border-cinema-border bg-cinema-surface text-cinema-text hover:bg-cinema-tertiary rounded-xl"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 text-accent ${isCheckingAvailability ? 'animate-spin' : ''}`} />
              <span>Re-check Live Stock</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-xs text-semantic-error hover:bg-semantic-error/10 hover:text-semantic-error rounded-xl"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              <span>Empty Cart</span>
            </Button>
          </div>
        </div>

        {/* Cart Layout Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Items List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <CartItemRow
                key={item.equipment.id}
                item={item}
                onUpdateQuantity={updateItemQuantity}
                onUpdateDates={updateItemDates}
                onRemove={removeFromCart}
              />
            ))}

            <div className="pt-2">
              <Link
                href="/equipment"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Continue Adding More Gear</span>
              </Link>
            </div>
          </div>

          {/* Pricing Summary (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <CartSummary
              pricing={pricing}
              deliveryMode={deliveryMode}
              onDeliveryModeChange={setDeliveryMode}
              hasUnavailableItems={hasUnavailableItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
