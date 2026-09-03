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
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
      <h3 className="font-bold text-gray-900 text-base uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-4">
        <span>Order & Pricing Summary</span>
      </h3>

      {/* Delivery Mode Radio Options */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-gray-700">Fulfillment Method</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onDeliveryModeChange('PICKUP')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
              deliveryMode === 'PICKUP'
                ? 'border-lenstiger bg-lenstiger-50 text-lenstiger shadow-xs'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:text-black'
            }`}
          >
            <Store className="h-5 w-5 mb-1 text-lenstiger" />
            <span>Hub Pickup</span>
            <span className="text-[10px] text-gray-400 font-normal">Free</span>
          </button>

          <button
            type="button"
            onClick={() => onDeliveryModeChange('DELIVERY')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
              deliveryMode === 'DELIVERY'
                ? 'border-lenstiger bg-lenstiger-50 text-lenstiger shadow-xs'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:text-black'
            }`}
          >
            <Truck className="h-5 w-5 mb-1 text-lenstiger" />
            <span>Express Delivery</span>
            <span className="text-[10px] text-gray-400 font-normal">+₹300</span>
          </button>
        </div>
      </div>

      {/* Pricing Lines */}
      <div className="space-y-3 text-xs border-t border-gray-100 pt-4">
        <div className="flex justify-between text-gray-600">
          <span>Equipment Rental Subtotal</span>
          <span className="font-bold text-gray-900">{formatCurrency(pricing.subtotal)}</span>
        </div>

        {pricing.hasDiscount && (
          <div className="flex justify-between text-lenstiger font-bold bg-lenstiger-50 p-2.5 rounded-xl border border-lenstiger/20">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Volume Discount (10%)
            </span>
            <span>-{formatCurrency(pricing.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Fulfillment ({deliveryMode === 'DELIVERY' ? 'Doorstep Delivery' : 'Hub Pickup'})</span>
          <span className="font-bold text-gray-900">
            {pricing.deliveryFee > 0 ? formatCurrency(pricing.deliveryFee) : 'Free'}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>GST (18%)</span>
          <span className="font-bold text-gray-900">{formatCurrency(pricing.tax)}</span>
        </div>

        <div className="flex justify-between text-gray-800 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
          <span className="flex items-center gap-1 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-lenstiger" />
            Refundable Security Deposit
          </span>
          <span className="font-bold text-lenstiger">{formatCurrency(pricing.securityDeposit)}</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="border-t border-gray-100 pt-4 flex items-baseline justify-between">
        <div>
          <span className="text-xs text-gray-500 font-medium">Grand Total</span>
          <div className="text-[10px] text-gray-400">Includes 18% GST + Refundable Deposit</div>
        </div>
        <div className="text-2xl font-black text-lenstiger">
          {formatCurrency(pricing.total)}
        </div>
      </div>

      {/* Unavailable Warning */}
      {hasUnavailableItems && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
          <span>One or more items in your cart are unavailable for selected dates. Please adjust dates or remove them to proceed.</span>
        </div>
      )}

      {/* Checkout Action */}
      {!isCheckoutPage && (
        <Link href="/checkout" className="block">
          <Button
            disabled={hasUnavailableItems || pricing.total <= 0}
            className="w-full h-12 text-sm font-black bg-gold hover:bg-gold-hover text-gray-950 rounded-2xl shadow-sm flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
