'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/components/providers/CartProvider';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';
import { ShoppingBag, ArrowLeft, RefreshCw, Trash2, Camera } from 'lucide-react';
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
      <div className="bg-[#f3f3f3] min-h-screen py-20 px-4">
        <div className="mx-auto max-w-2xl bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-sm space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-lenstiger-50 text-lenstiger shadow-xs">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 headingbold">Your Rental Cart is Empty</h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              Explore our professional catalog of cameras, cinema lenses, lighting, and shooting bundles in your city.
            </p>
          </div>
          <Link href="/equipment">
            <Button size="lg" className="rounded-2xl font-black bg-gold hover:bg-gold-hover text-gray-950 px-8 shadow-sm">
              <Camera className="h-4 w-4 mr-2" />
              <span>Browse All Equipment</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f3f3] min-h-screen py-8 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 headingbold">Rental Equipment Cart</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Review equipment, customize rental days, and preview total costs with 18% GST and refundable deposit.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => recheckCartAvailability()}
              disabled={isCheckingAvailability}
              className="text-xs border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isCheckingAvailability ? 'animate-spin' : ''}`} />
              <span>Re-check Live Stock</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl"
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
                className="inline-flex items-center gap-1.5 text-xs font-bold text-lenstiger hover:underline"
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
