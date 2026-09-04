'use client';

import React from 'react';
import Link from 'next/link';
import { PricingBreakdown, DeliveryMode } from '@/types/rental';
import { formatCurrency } from '@/lib/utils';
import { Truck, Store, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartSummaryProps {
  pricing: PricingBreakdown;
  deliveryMode: DeliveryMode;
  onDeliveryModeChange: (mode: DeliveryMode) => void;
  hasUnavailableItems?: boolean;
  isCheckoutPage?: boolean;
}

export function CartSummary({
  pricing,
  deliveryMode,
  onDeliveryModeChange,
  hasUnavailableItems = false,
  isCheckoutPage = false,
}: CartSummaryProps) {
  return (
    <div className="rounded-3xl border border-cinema-border bg-cinema-surface p-6 shadow-cinema-sm space-y-6">
      <h3 className="font-bold text-cinema-text text-sm uppercase tracking-wider flex items-center gap-2 border-b border-cinema-border pb-4 font-heading">
        <span>Order &amp; Pricing Summary</span>
      </h3>

      {/* Delivery Mode Radio Options */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-cinema-text-secondary uppercase tracking-wider">
          Fulfillment Method
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onDeliveryModeChange('PICKUP')}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              deliveryMode === 'PICKUP'
                ? 'border-accent bg-accent/15 text-accent shadow-cinema-sm'
                : 'border-cinema-border bg-cinema-tertiary text-cinema-text-secondary hover:text-cinema-text hover:border-cinema-border-strong'
            }`}
          >
            <Store className="h-5 w-5 mb-1 text-accent" />
            <span>Hub Pickup</span>
            <span className="text-[10px] text-cinema-text-muted font-normal">Free</span>
          </button>

          <button
            type="button"
            onClick={() => onDeliveryModeChange('DELIVERY')}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              deliveryMode === 'DELIVERY'
                ? 'border-accent bg-accent/15 text-accent shadow-cinema-sm'
                : 'border-cinema-border bg-cinema-tertiary text-cinema-text-secondary hover:text-cinema-text hover:border-cinema-border-strong'
            }`}
          >
            <Truck className="h-5 w-5 mb-1 text-accent" />
            <span>Express Delivery</span>
            <span className="text-[10px] text-cinema-text-muted font-normal">+₹300</span>
          </button>
        </div>
      </div>

      {/* Pricing Lines */}
      <div className="space-y-3 text-xs border-t border-cinema-border pt-4">
        <div className="flex justify-between text-cinema-text-secondary">
          <span>Equipment Rental Subtotal</span>
          <span className="font-bold text-cinema-text">{formatCurrency(pricing.subtotal)}</span>
        </div>

        {pricing.hasDiscount && (
          <div className="flex justify-between text-accent font-bold bg-accent/10 p-2.5 rounded-xl border border-accent/20">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Volume Discount (10%)
            </span>
            <span>-{formatCurrency(pricing.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-cinema-text-secondary">
          <span>Fulfillment ({deliveryMode === 'DELIVERY' ? '90-Min On-Set Delivery' : 'Hub Pickup'})</span>
          <span className="font-bold text-cinema-text">
            {pricing.deliveryFee > 0 ? formatCurrency(pricing.deliveryFee) : 'Free'}
          </span>
        </div>

        <div className="flex justify-between text-cinema-text-secondary">
          <span>GST (18%)</span>
          <span className="font-bold text-cinema-text">{formatCurrency(pricing.tax)}</span>
        </div>

        <div className="flex justify-between text-cinema-text bg-cinema-tertiary p-3 rounded-xl border border-cinema-border">
          <span className="flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="h-4 w-4 text-accent" />
            Refundable Security Deposit
          </span>
          <span className="font-bold text-accent">{formatCurrency(pricing.securityDeposit)}</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="border-t border-cinema-border pt-4 flex items-baseline justify-between">
        <div>
          <span className="text-xs text-cinema-text-muted font-medium">Grand Total</span>
          <div className="text-[10px] text-cinema-text-disabled">Includes 18% GST + Refundable Deposit</div>
        </div>
        <div className="text-2xl font-black text-accent font-heading">
          {formatCurrency(pricing.total)}
        </div>
      </div>

      {/* Unavailable Warning */}
      {hasUnavailableItems && (
        <div className="rounded-2xl bg-semantic-error/15 border border-semantic-error/30 p-3 text-xs text-semantic-error flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-semantic-error mt-0.5" />
          <span>One or more items in your cart are unavailable for selected dates. Please adjust dates or remove them to proceed.</span>
        </div>
      )}

      {/* Checkout Action */}
      {!isCheckoutPage && (
        <Link href="/checkout" className="block">
          <Button
            disabled={hasUnavailableItems || pricing.total <= 0}
            className="w-full h-12 text-xs uppercase tracking-wider font-black bg-accent hover:bg-accent-hover text-cinema-bg rounded-xl shadow-cinema-accent flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
