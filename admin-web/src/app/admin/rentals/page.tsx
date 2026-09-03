'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Film, Search, Filter, CheckCircle2, Truck, RefreshCw, AlertCircle, ArrowRight, ShieldCheck, Sparkles, User, Calendar } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { adminApiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Loading } from '../../../components/ui/Loading';

export default function AdminRentalsPage() {
  const { token } = useAdminAuth();
  const [rentals, setRentals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchRentals = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient('/admin/rentals', { token: token || undefined });
      setRentals(res.rentals || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleUpdateStatus = async (rentalId: string, newStatus: string) => {
    try {
      await adminApiClient(`/admin/rentals/${rentalId}/status`, {
        method: 'PATCH',
        token: token || undefined,
        body: JSON.stringify({ status: newStatus }),
      });
      fetchRentals();
    } catch (err: any) {
      alert(err.message || 'Failed to update shoot status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge variant="success">Confirmed &amp; Paid</Badge>;
      case 'READY_FOR_PICKUP':
        return <Badge variant="accent">Ready for Pickup</Badge>;
      case 'HANDED_OVER':
      case 'ACTIVE':
        return <Badge variant="info">On Set (Filming)</Badge>;
      case 'RETURN_REQUESTED':
      case 'RETURNED':
        return <Badge variant="warning">Returned / In QC</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Shoot Completed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const filtered = rentals.filter((r) => {
    const matchesSearch =
      (r.rental_number || r.booking_id || r.id || '')?.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-3/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              Filming Shoots &amp; Order Queue
            </h1>
            <Badge variant="accent">{rentals.length} Total Bookings</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Manage production timelines, gear dispatch handovers, return QC checklists, and deposit settlement.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchRentals} className="gap-1.5 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
        </Button>
      </div>

      {/* Filter and Status Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search booking code (e.g. FG-2026-9042), filmmaker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-3.5 h-3.5" />}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
          {['ALL', 'CONFIRMED', 'READY_FOR_PICKUP', 'ACTIVE', 'RETURNED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider text-[10px] font-bold transition-all ${
                selectedStatus === st
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'bg-surface-1 border-surface-3 text-zinc-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Rentals Table */}
      {isLoading ? (
        <Loading message="Loading shoot rental orders..." />
      ) : (
        <div className="rounded-2xl border border-surface-3 bg-surface-1 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2/60 text-zinc-400 font-mono uppercase text-[10px] border-b border-surface-3">
                <tr>
                  <th className="px-5 py-3.5">Booking Code</th>
                  <th className="px-5 py-3.5">Filmmaker / Studio</th>
                  <th className="px-5 py-3.5">Shoot Schedule</th>
                  <th className="px-5 py-3.5">Fulfillment</th>
                  <th className="px-5 py-3.5">Gross Total</th>
                  <th className="px-5 py-3.5">Escrow Hold</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3/60 text-zinc-300 font-sans">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-2/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-accent flex items-center gap-2">
                      <Film className="w-3.5 h-3.5 text-accent" />
                      <span>{r.rental_number || r.booking_id || r.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{r.user?.full_name || 'Production Lead'}</span>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">{r.user?.phone || '+91 9876543210'}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono">
                      <div className="text-zinc-200 font-bold">{r.start_date} to {r.end_date}</div>
                      <div className="text-[10px] text-zinc-500">{r.total_days || 3} Shoot Days</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono uppercase text-zinc-400">
                      {r.delivery_mode === 'DELIVERY' ? 'Set Dispatch (+₹500)' : 'Vault Pickup'}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      ₹{Number(r.total_amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-accent font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                      <span>₹{Number(r.security_deposit || 0).toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(r.status)}</td>
                    <td className="px-5 py-3.5 text-right font-mono">
                      <div className="flex items-center justify-end gap-2">
                        {r.status === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(r.id, 'READY_FOR_PICKUP')}
                            className="text-[10px] py-1 px-2.5 bg-accent hover:bg-accent-hover text-surface-0"
                          >
                            Mark Ready
                          </Button>
                        )}
                        {r.status === 'READY_FOR_PICKUP' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleUpdateStatus(r.id, 'HANDED_OVER')}
                            className="text-[10px] py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Hand Over to DP
                          </Button>
                        )}
                        {(r.status === 'HANDED_OVER' || r.status === 'ACTIVE') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(r.id, 'RETURN_REQUESTED')}
                            className="text-[10px] py-1 px-2.5 text-amber-400 border-amber-500/30"
                          >
                            Receive Return
                          </Button>
                        )}
                        {(r.status === 'RETURN_REQUESTED' || r.status === 'RETURNED') && (
                          <Link href="/admin/inspections">
                            <Button size="sm" className="text-[10px] py-1 px-2.5 gap-1 bg-accent text-surface-0 font-bold">
                              <Sparkles className="w-3 h-3" /> QC Inspection
                            </Button>
                          </Link>
                        )}
                        {r.status === 'COMPLETED' && (
                          <Badge variant="success">Settled &amp; Closed</Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-zinc-500 font-mono">
                      <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-3 text-accent">
                        <Film className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-white font-display">No Orders in Queue</div>
                      <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                        There are currently 0 rental bookings. When a customer places a rental order, it will appear here.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
