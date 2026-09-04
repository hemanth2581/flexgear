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
  Sparkles,
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={closeCart} />

      {/* Slide-out Drawer */}
      <div
        className="relative w-full max-w-md bg-cinema-surface h-full shadow-cinema-lg flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-cinema-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-cinema-tertiary text-cinema-text px-6 py-4 flex items-center justify-between border-b border-cinema-border">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <h3 className="text-base font-bold font-heading text-cinema-text">Production Cart</h3>
            <span className="bg-accent/15 text-accent border border-accent/30 text-xs font-black px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          </div>

          <button
            onClick={closeCart}
            className="p-1.5 text-cinema-text-muted hover:text-cinema-text hover:bg-cinema-card rounded-full transition cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 divide-y divide-cinema-border">
          {items.length === 0 ? (
            <div className="text-center py-20 px-4 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-cinema-tertiary border border-cinema-border flex items-center justify-center mx-auto text-accent">
                <ShoppingBag className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-base font-bold text-cinema-text font-heading">Your cart is empty</h4>
              <p className="text-xs text-cinema-text-secondary max-w-xs mx-auto leading-relaxed">
                Explore cameras, cine lenses, lighting packages, and wireless audio to start your production rental.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  router.push('/equipment');
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent text-cinema-bg font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition cursor-pointer shadow-cinema-sm"
              >
                Browse Catalog
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
                <div key={item.equipment.id} className="pt-3.5 first:pt-0 flex gap-3 items-center">
                  {/* Item Image */}
                  <div className="relative w-16 h-16 rounded-xl bg-cinema-bg border border-cinema-border overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <Image
                      src={item.equipment.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200'}
                      alt={item.equipment.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-cinema-text line-clamp-1">
                      {item.equipment.name}
                    </h5>

                    <div className="flex items-center gap-1.5 text-[11px] text-cinema-text-secondary mt-0.5">
                      <Calendar className="w-3 h-3 text-accent" />
                      <span>
                        {startDateFormatted} – {endDateFormatted} ({item.days}d)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-black text-accent font-heading">
                        {formatCurrency(item.itemSubtotal)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-cinema-border rounded-xl bg-cinema-tertiary text-xs">
                        <button
                          onClick={() => updateItemQuantity(item.equipment.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-cinema-text-muted hover:text-cinema-text hover:bg-cinema-card rounded-l-xl transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-cinema-text">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(item.equipment.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-cinema-text-muted hover:text-cinema-text hover:bg-cinema-card rounded-r-xl transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.equipment.id)}
                    className="p-1.5 text-cinema-text-muted hover:text-semantic-error hover:bg-semantic-error/10 rounded-lg transition cursor-pointer"
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
          <div className="border-t border-cinema-border bg-cinema-tertiary p-5 space-y-3 shrink-0">
            {/* Subtotal & Deposit summary */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-cinema-text-secondary">
                <span>Rental Subtotal</span>
                <span className="font-bold text-cinema-text">
                  {formatCurrency(pricing.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-cinema-text-secondary">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-accent" /> Refundable Deposit
                </span>
                <span className="font-bold text-cinema-text">
                  {formatCurrency(pricing.securityDeposit)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-cinema-text pt-2 border-t border-cinema-border">
                <span>Total Amount</span>
                <span className="text-accent text-base">{formatCurrency(pricing.total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => {
                  closeCart();
                  router.push('/cart');
                }}
                className="w-full py-3 px-3 rounded-xl border border-cinema-border bg-cinema-surface hover:bg-cinema-card text-cinema-text font-bold text-xs text-center transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View Cart</span>
              </button>

              <button
                onClick={() => {
                  closeCart();
                  router.push('/checkout');
                }}
                className="w-full py-3 px-3 rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-black text-xs uppercase tracking-wider text-center shadow-cinema-accent transition flex items-center justify-center gap-1 cursor-pointer"
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
