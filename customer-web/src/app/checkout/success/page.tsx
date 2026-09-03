'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Film, Download, ArrowRight, PackageCheck, Calendar } from 'lucide-react';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const rentalId = searchParams.get('rentalId') || 'FG-2026-84920';
  const paymentIntent = searchParams.get('paymentIntent') || 'pi_3Pq9Z2Lkd81';

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      {/* Animated Checkmark with Pulse Ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="relative w-20 h-20 mx-auto mb-6"
      >
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
        <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-2xl">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-2">
          Booking Authorized &amp; Units Reserved
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Shoot Booking Confirmed!
        </h1>
        <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto">
          Your camera equipment and flight cases are locked in the vault and being prepared by certified technicians.
        </p>

        {/* Large Monospace Order Number */}
        <div className="my-8 p-6 rounded-2xl bg-surface-1 border border-surface-3 text-left space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-surface-3/50 pb-3">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Order Number</span>
            <span className="text-base font-mono font-bold text-accent tracking-wider">
              {rentalId.startsWith('FG-') ? rentalId : `FG-2026-${rentalId.slice(0, 5).toUpperCase()}`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-zinc-500 block">Stripe Escrow Intent</span>
              <span className="text-white font-medium truncate block">{paymentIntent}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block">Deposit Status</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Held in Escrow
              </span>
            </div>
          </div>

          {/* Timeline of What's Next */}
          <div className="pt-3 border-t border-surface-3/50 space-y-2 text-xs font-mono">
            <span className="text-[10px] uppercase text-zinc-500 block">What happens next:</span>
            <div className="flex items-center gap-2 text-zinc-300">
              <PackageCheck className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>1. Technician pre-shoot sensor collimation &amp; packing</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Calendar className="w-3.5 h-3.5 text-info shrink-0" />
              <span>2. Delivery van dispatched to your set on shoot morning</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/rentals" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3 bg-accent hover:bg-accent-hover text-surface-0 font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] shadow-md shadow-accent/20">
              <Film className="w-4 h-4" /> View My Shoots Dashboard
            </button>
          </Link>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-3 bg-surface-1 hover:bg-surface-2 border border-surface-3 hover:border-surface-4 text-zinc-300 hover:text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 font-mono"
          >
            <Download className="w-3.5 h-3.5" /> Download Tax Invoice (PDF)
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs font-mono text-zinc-500">Loading receipt...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
