import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';
import { calculateDays } from '../../utils/dates';
import { Button } from '../ui/Button';

export const CartSummary: React.FC = () => {
  const { items, startDate, endDate, deliveryMode } = useCart();
  const duration = calculateDays(startDate, endDate);

  const rawSubtotal = items.reduce((sum, i) => sum + i.equipment.daily_price * i.quantity * duration, 0);
  const totalDeposit = items.reduce((sum, i) => sum + i.equipment.security_deposit * i.quantity, 0);
  
  // Weekly discount simulation
  const weeklyDiscount = duration >= 7 ? rawSubtotal * 0.15 : 0;
  const volumeDiscount = (rawSubtotal - weeklyDiscount) > 20000 ? (rawSubtotal - weeklyDiscount) * 0.10 : 0;
  const totalDiscount = weeklyDiscount + volumeDiscount;

  const deliveryFee = deliveryMode === 'DELIVERY' ? 500 : 0;
  const taxable = Math.max(0, rawSubtotal - totalDiscount + deliveryFee);
  const gst = Math.round(taxable * 0.18);
  const grandTotal = taxable + gst + totalDeposit;

  return (
    <div className="p-6 rounded-2xl bg-cinema-card border border-cinema-border space-y-5">
      <h3 className="text-base font-bold text-white tracking-wide border-b border-cinema-border pb-3">
        Shoot Cost Estimate
      </h3>

      <div className="space-y-2 text-xs text-zinc-400">
        <div className="flex justify-between">
          <span>Shoot Duration</span>
          <span className="text-white font-mono font-bold">{duration} Day{duration > 1 ? 's' : ''}</span>
        </div>
        <div className="flex justify-between">
          <span>Rental Subtotal ({items.length} gear)</span>
          <span className="text-white font-mono">{formatCurrency(rawSubtotal)}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="flex justify-between text-emerald-400 font-semibold">
            <span>Special Shoot Discounts</span>
            <span className="font-mono">-{formatCurrency(totalDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Delivery / Pickup</span>
          <span className="text-white font-mono">{deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Free Hub Pickup'}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (18% Input Credit)</span>
          <span className="text-white font-mono">{formatCurrency(gst)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-zinc-800/80 text-amber-300 font-medium">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> 100% Refundable Deposit</span>
          <span className="font-mono">{formatCurrency(totalDeposit)}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-cinema-border flex items-baseline justify-between">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-zinc-400 block">Total Due Today</span>
          <span className="text-xs text-zinc-500 font-mono">(Includes Escrow Deposit)</span>
        </div>
        <span className="text-2xl font-black text-white">{formatCurrency(grandTotal)}</span>
      </div>

      <Link href="/checkout" className="block">
        <Button className="w-full gap-2 shadow-xl shadow-primary/30" size="lg" disabled={items.length === 0}>
          Proceed to Checkout <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
};
