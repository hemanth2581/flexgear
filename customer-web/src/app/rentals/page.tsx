'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Film,
  Calendar,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Heart,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Rental } from '../../types/rental';
import { RentalService } from '../../services/rental.service';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/dates';

export default function CustomerRentalsPage() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const data = await RentalService.getMyRentals();
      setRentals(data);
    } catch (err) {
      console.error('Failed to load rentals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleRequestReturn = async (rentalId: string) => {
    setActionLoadingId(rentalId);
    try {
      await RentalService.requestReturn(rentalId);
      await fetchRentals();
    } catch (err) {
      console.error('Failed to request return', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Metrics calculation
  const activeShoots = rentals.filter((r) => ['ACTIVE', 'PICKED_UP'].includes(r.status)).length;
  const upcomingShoots = rentals.filter((r) => ['CONFIRMED', 'PENDING'].includes(r.status)).length;
  const completedShoots = rentals.filter((r) => r.status === 'COMPLETED').length;
  const totalSpent = rentals.reduce((sum, r) => sum + (r.total_amount || 0), 0);

  // Filter by tab
  const filteredRentals = rentals.filter((r) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ACTIVE') return ['ACTIVE', 'PICKED_UP'].includes(r.status);
    if (activeTab === 'UPCOMING') return ['CONFIRMED', 'PENDING'].includes(r.status);
    if (activeTab === 'COMPLETED') return r.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return r.status === 'CANCELLED';
    return true;
  });

  const wishlistMini = [
    {
      id: 'red-komodo',
      name: 'RED KOMODO-X 6K Cinema Camera',
      daily: 22000,
      image: 'https://images.unsplash.com/photo-1589872765507-6f813958742b?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'cooke-primes',
      name: 'Cooke Full Frame Plus Prime Set',
      daily: 35000,
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'aputure-600c',
      name: 'Aputure Electro Storm CS15 Point Source Light',
      daily: 14000,
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white tracking-tight">
            Filmmaker Command Center
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Monitor active production shoot logistics, check-in statuses, and instant Stripe deposit refunds.
          </p>
        </div>
        <Link href="/equipment">
          <button className="px-4 py-2.5 bg-accent hover:bg-accent-hover text-surface-0 font-bold text-xs rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-accent/10">
            <Film className="w-4 h-4" /> Book More Gear
          </button>
        </Link>
      </div>

      {/* 4 Overview Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-1 border border-surface-3 relative overflow-hidden">
          <div className="text-xs font-mono uppercase text-zinc-500 mb-1">Active on Set</div>
          <div className="text-3xl font-bold font-mono text-emerald-400">{activeShoots}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Units deployed to set</div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-1 border border-surface-3 relative overflow-hidden">
          <div className="text-xs font-mono uppercase text-zinc-500 mb-1">Upcoming Shoots</div>
          <div className="text-3xl font-bold font-mono text-info">{upcomingShoots}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Reserved in vault</div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-1 border border-surface-3 relative overflow-hidden">
          <div className="text-xs font-mono uppercase text-zinc-500 mb-1">Completed Wraps</div>
          <div className="text-3xl font-bold font-mono text-zinc-300">{completedShoots}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Deposit refunded 100%</div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-1 border border-surface-3 relative overflow-hidden">
          <div className="text-xs font-mono uppercase text-zinc-500 mb-1">Total Production Spent</div>
          <div className="text-2xl font-bold font-mono text-accent">{formatCurrency(totalSpent)}</div>
          <div className="text-[11px] text-zinc-500 mt-1">GST tax invoice enabled</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-3/60 pb-3 overflow-x-auto text-xs font-mono">
        {(['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl transition-all font-medium ${
              activeTab === tab
                ? 'bg-accent text-surface-0 font-bold shadow-md shadow-accent/20'
                : 'text-zinc-400 hover:text-white hover:bg-surface-2'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Rental Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl shimmer-bg border border-surface-3" />
          ))}
        </div>
      ) : filteredRentals.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl bg-surface-1 border border-surface-3">
          <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold font-display text-white">No Shoots in this Category</h3>
          <p className="text-xs text-zinc-400 mt-1 mb-4">You have no orders matching the selected status.</p>
          <Link href="/equipment">
            <button className="px-4 py-2 bg-surface-2 hover:bg-surface-3 border border-surface-3 text-accent text-xs font-bold rounded-xl transition-all">
              Explore Available Fleet
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRentals.map((rental) => {
            const isActive = ['ACTIVE', 'PICKED_UP'].includes(rental.status);
            return (
              <motion.div
                key={rental.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-surface-1 border border-surface-3 hover:border-surface-4 transition-all space-y-4 shadow-lg"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-3/50 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-accent">
                      {rental.rental_number || `FG-2026-${rental.id.slice(0, 5).toUpperCase()}`}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 animate-pulse'
                          : rental.status === 'COMPLETED'
                          ? 'bg-info/10 border-info/30 text-info'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {rental.status}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-zinc-500">
                    Booked on {formatDate(rental.created_at)}
                  </span>
                </div>

                {/* 3-Column Content Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  {/* Shoot Dates */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">Shoot Dates &amp; Mode</span>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Calendar className="w-4 h-4 text-accent shrink-0" />
                      <span>{formatDate(rental.start_date)} → {formatDate(rental.end_date)}</span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      {rental.delivery_mode === 'DELIVERY' ? 'Van Set Delivery' : 'Vault Pickup'}
                    </p>
                  </div>

                  {/* Gear Items */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">Reserved Equipment</span>
                    {rental.items && rental.items.length > 0 ? (
                      rental.items.map((it: any, idx: number) => (
                        <div key={idx} className="text-white truncate font-medium">
                          • {it.quantity}× {it.name || 'Cinema Camera Package'}
                        </div>
                      ))
                    ) : (
                      <span className="text-zinc-300">• Cinema Camera Fleet Rig</span>
                    )}
                  </div>

                  {/* Financials & Escrow */}
                  <div className="space-y-1 md:text-right">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">Total Paid (with Escrow)</span>
                    <div className="text-base font-bold font-mono text-white">
                      {formatCurrency(rental.total_amount)}
                    </div>
                    <div className="text-[11px] text-amber-400 flex items-center md:justify-end gap-1 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" /> Escrow: {formatCurrency(rental.security_deposit)}
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-3 border-t border-surface-3/50 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] font-mono text-zinc-500">
                    {rental.status === 'COMPLETED'
                      ? 'QC Inspection Clean • 100% Escrow Released'
                      : 'Security deposit held in Stripe escrow'}
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive && (
                      <button
                        onClick={() => handleRequestReturn(rental.id)}
                        disabled={actionLoadingId === rental.id}
                        className="px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 border border-surface-3 text-xs font-medium text-white flex items-center gap-1.5 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-accent" />
                        <span>{actionLoadingId === rental.id ? 'Requesting...' : 'Request Wrap Return'}</span>
                      </button>
                    )}
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 border border-surface-3 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Tax Invoice</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Saved Gear Wishlist Vault */}
      <div className="p-6 rounded-2xl bg-surface-1 border border-surface-3 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-3/50 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <h3 className="text-sm font-bold font-display text-white">Saved Gear Vault (Wishlist)</h3>
          </div>
          <Link href="/equipment" className="text-xs font-mono text-accent hover:underline">
            Browse All Gear
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {wishlistMini.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-surface-0/60 border border-surface-3 flex items-center justify-between gap-3 hover:border-surface-4 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-surface-2 overflow-hidden border border-surface-3 shrink-0">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{item.name}</div>
                  <div className="text-[11px] font-mono text-accent">{formatCurrency(item.daily)}/day</div>
                </div>
              </div>
              <Link href="/equipment">
                <button className="p-2 rounded-lg bg-accent text-surface-0 hover:bg-accent-hover font-bold text-xs shrink-0 transition-all">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
