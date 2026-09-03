'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    itemCount,
    pricing,
    isCartDrawerOpen,
    closeCart,
    updateItemQuantity,
    removeFromCart,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={closeCart} />

      {/* Slide-out Drawer */}
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-lenstiger text-white px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-bold headingbold text-white">Your Cart</h3>
            <span className="bg-white/20 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          </div>

          <button
            onClick={closeCart}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-100">
          {items.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-base font-bold text-gray-800">Your cart is empty</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore cameras, lenses, lighting fixtures, and audio gear to start your production rental.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  router.push('/equipment');
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lenstiger text-white font-bold text-xs hover:bg-lenstiger-hover transition"
              >
                Browse Equipment
              </button>
            </div>
          ) : (
            items.map((item) => {
              const startDateFormatted = item.startDate
                ? format(parseISO(item.startDate), 'dd MMM')
                : 'Start';
              const endDateFormatted = item.endDate
                ? format(parseISO(item.endDate), 'dd MMM')
                : 'End';

              return (
                <div key={item.equipment.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  {/* Item Image */}
                  <div className="relative w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0">
                    <Image
                      src={item.equipment.image_url || '/placeholder.jpg'}
                      alt={item.equipment.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-gray-900 line-clamp-1">
                      {item.equipment.name}
                    </h5>

                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                      <Calendar className="w-3 h-3 text-lenstiger" />
                      <span>
                        {startDateFormatted} – {endDateFormatted} ({item.days}d)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs font-black text-lenstiger">
                        {formatCurrency(item.itemSubtotal)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 text-xs">
                        <button
                          onClick={() => updateItemQuantity(item.equipment.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded-l-lg transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(item.equipment.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded-r-lg transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.equipment.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3 shrink-0">
            {/* Subtotal & Deposit summary */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Rental Subtotal</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(pricing.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-lenstiger" /> Refundable Deposit
                </span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(pricing.securityDeposit)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-1 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-lenstiger">{formatCurrency(pricing.total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  closeCart();
                  router.push('/cart');
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs text-center transition flex items-center justify-center gap-1"
              >
                <span>🛒 View Cart</span>
              </button>

              <button
                onClick={() => {
                  closeCart();
                  router.push('/checkout');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-lenstiger hover:bg-lenstiger-hover text-white font-bold text-xs text-center shadow-md transition flex items-center justify-center gap-1"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
