'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, ShieldCheck, Calendar, MapPin, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { Rental } from '../../../types/rental';
import { RentalService } from '../../../services/rental.service';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/dates';
import { getRentalStatusBadge, getDepositStatusBadge } from '../../../utils/formatters';
import { Button } from '../../../components/ui/Button';
import { Loading } from '../../../components/ui/Loading';

export default function RentalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [rental, setRental] = useState<Rental | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRental = async () => {
      setIsLoading(true);
      try {
        const res = await RentalService.getById(params.id as string);
        setRental(res);
      } catch (err) {
        console.error('Failed to load rental details', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchRental();
  }, [params.id]);

  if (isLoading || !rental) {
    return <Loading message="Generating tax invoice and rental timeline..." />;
  }

  const statusBadge = getRentalStatusBadge(rental.status);
  const depositStatus = rental.deposit?.status || 'HELD';
  const depositBadge = getDepositStatusBadge(depositStatus);

  const timelineSteps = [
    { label: 'Booking & Payment', completed: true, date: formatDate(rental.created_at) },
    { label: 'Vault Preparation', completed: ['CONFIRMED', 'READY_FOR_PICKUP', 'ACTIVE', 'RETURN_PENDING', 'COMPLETED'].includes(rental.status) },
    { label: 'Handover / Active Shoot', completed: ['ACTIVE', 'RETURN_PENDING', 'UNDER_INSPECTION', 'COMPLETED'].includes(rental.status) },
    { label: 'Inspection & Escrow Release', completed: rental.status === 'COMPLETED' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link href="/rentals" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to My Shoots
        </Link>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5 text-xs">
          <Printer className="w-3.5 h-3.5" /> Print Tax Invoice
        </Button>
      </div>

      {/* Main Invoice Card */}
      <div className="p-8 rounded-2xl bg-cinema-card border border-cinema-border space-y-8 print:border-none print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-cinema-border pb-6">
          <div>
            <div className="text-xl font-black text-white">FLEX<span className="text-primary">GEAR</span></div>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">GSTIN: 29AABCF1234F1Z8</p>
            <p className="text-xs text-zinc-400 mt-1">Film City Main Vault, Goregaon East, Mumbai 400065</p>
          </div>
          <div className="sm:text-right">
            <span className="text-xs font-mono uppercase font-bold text-primary block">Official Tax Invoice</span>
            <h2 className="text-lg font-black text-white font-mono">{rental.rental_number}</h2>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.color}`}>
              {statusBadge.label}
            </span>
          </div>
        </div>

        {/* Timeline Progress */}
        <div>
          <h3 className="text-xs font-mono uppercase font-bold text-zinc-400 mb-4">Shoot Lifecycle Tracker</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {timelineSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  step.completed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
                  <span>{step.label}</span>
                </div>
                {step.date && <p className="text-[10px] opacity-75 font-mono">{step.date}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Dates & Logistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Shoot Window</span>
            <div className="text-white font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatDate(rental.start_date)} to {formatDate(rental.end_date)} ({rental.total_days} Days)</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Handover Location</span>
            <div className="text-white font-medium flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{rental.delivery_mode === 'DELIVERY' ? 'Film Set Doorstep Delivery' : 'Hub Vault Pickup'}</span>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase font-bold text-zinc-400">Reserved Equipment</h3>
          <div className="border border-cinema-border rounded-xl overflow-hidden text-xs">
            <div className="grid grid-cols-12 bg-zinc-900/80 p-3 font-mono text-zinc-400 uppercase text-[10px] font-bold">
              <div className="col-span-6">Item Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Daily Rate</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>
            {rental.items?.map((it: any, idx: number) => (
              <div key={idx} className="grid grid-cols-12 p-3 border-t border-zinc-800/80 text-zinc-200">
                <div className="col-span-6 font-medium text-white">{it.name}</div>
                <div className="col-span-2 text-center font-mono">{it.quantity}</div>
                <div className="col-span-2 text-right font-mono">{formatCurrency(it.daily_price)}</div>
                <div className="col-span-2 text-right font-mono font-bold text-white">{formatCurrency(it.subtotal || it.daily_price * rental.total_days * it.quantity)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Math Summary */}
        <div className="border-t border-cinema-border pt-4 flex flex-col sm:flex-row justify-between gap-6">
          {/* Security Deposit Details */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex-1 space-y-2 text-xs">
            <span className="font-mono uppercase font-bold text-zinc-400 block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Security Deposit Escrow
            </span>
            <div className="flex justify-between">
              <span className="text-zinc-400">Escrow Held</span>
              <span className="text-white font-mono">{formatCurrency(rental.security_deposit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Status</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${depositBadge.color}`}>
                {depositBadge.label}
              </span>
            </div>
          </div>

          {/* Pricing Math */}
          <div className="w-full sm:w-64 space-y-2 text-xs text-zinc-400">
            <div className="flex justify-between">
              <span>Rental Subtotal</span>
              <span className="text-white font-mono">{formatCurrency(rental.subtotal)}</span>
            </div>
            {rental.discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Discounts</span>
                <span className="font-mono">-{formatCurrency(rental.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Logistics</span>
              <span className="text-white font-mono">{rental.delivery_fee > 0 ? formatCurrency(rental.delivery_fee) : '₹0'}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST (9%)</span>
              <span className="text-white font-mono">{formatCurrency(rental.tax / 2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (9%)</span>
              <span className="text-white font-mono">{formatCurrency(rental.tax / 2)}</span>
            </div>
            <div className="flex justify-between text-amber-300 font-medium pt-1 border-t border-zinc-800">
              <span>Refundable Deposit</span>
              <span className="font-mono">{formatCurrency(rental.security_deposit)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-white pt-2 border-t border-cinema-border">
              <span>Total Paid</span>
              <span className="font-mono">{formatCurrency(rental.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
