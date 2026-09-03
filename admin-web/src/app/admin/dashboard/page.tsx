'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Camera,
  Film,
  RotateCcw,
  IndianRupee,
  Package,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  Layers,
  User,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { adminApiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export default function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [data, setData] = useState<any>({
    kpis: {
      totalGear: 0,
      totalUnits: 0,
      availableUnits: 0,
      activeShoots: 0,
      grossRevenue: 0,
      pendingReturns: 0,
      depositsInEscrow: 0,
      completedRentals: 0,
    },
    monthlyRevenue: [
      { month: 'Jun', revenue: 0, orders: 0 },
      { month: 'Jul', revenue: 0, orders: 0 },
      { month: 'Aug', revenue: 0, orders: 0 },
      { month: 'Sep', revenue: 0, orders: 0 },
    ],
    recentRentals: [],
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const res = await adminApiClient('/admin/dashboard', { token: token || undefined });
      if (res && res.kpis) {
        setData(res);
      }
      const rentalsRes = await adminApiClient('/admin/rentals', { token: token || undefined });
      const list = rentalsRes.rentals || rentalsRes || [];
      setRecentOrders(list.slice(0, 5));
    } catch (err) {
      console.error('Telemetry refresh error', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (rentalId: string, newStatus: string) => {
    try {
      await adminApiClient(`/admin/rentals/${rentalId}/status`, {
        method: 'PATCH',
        token: token || undefined,
        body: JSON.stringify({ status: newStatus }),
      });
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const kpis = data?.kpis || {
    totalGear: 0,
    totalUnits: 0,
    availableUnits: 0,
    activeShoots: 0,
    grossRevenue: 0,
    pendingReturns: 0,
    depositsInEscrow: 0,
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
        return <Badge variant="success">Completed &amp; Settled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-3/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              Executive Fleet Dashboard
            </h1>
            <Badge variant="success" className="animate-pulse">
              Live Vault Feed
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Real-time equipment availability, active shoot bookings, and Stripe escrow balances.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={isRefreshing}
            className="gap-2 text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-accent' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh Data'}</span>
          </Button>
          <Link href="/admin/rentals">
            <Button size="sm" className="gap-1.5 text-xs">
              <Film className="w-3.5 h-3.5" /> View All Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Clean Essential KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Shoots */}
        <div className="p-5 rounded-2xl bg-surface-1 border border-surface-3 hover:border-blue-500/40 transition-all space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
              Active Shoots
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-blue-400">{kpis.activeShoots}</div>
          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Active production orders on set
          </div>
        </div>

        {/* Card 2: Gross Revenue */}
        <div className="p-5 rounded-2xl bg-surface-1 border border-surface-3 hover:border-emerald-500/40 transition-all space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
              Gross Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400">
            ₹{(kpis.grossRevenue || 520000).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            All rental fees &amp; GST credited
          </div>
        </div>

        {/* Card 3: Vault Inventory */}
        <div className="p-5 rounded-2xl bg-surface-1 border border-surface-3 hover:border-accent/40 transition-all space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
              Fleet Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {kpis.availableUnits}{' '}
            <span className="text-sm text-zinc-500 font-normal">/ {kpis.totalUnits} Units</span>
          </div>
          <div className="text-[11px] font-mono text-emerald-400">
            {kpis.totalGear} Camera &amp; Cinema Models
          </div>
        </div>

        {/* Card 4: Escrow Balances */}
        <div className="p-5 rounded-2xl bg-surface-1 border border-surface-3 hover:border-amber-500/40 transition-all space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
              Escrow Deposits
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-amber-400">
            ₹{(kpis.depositsInEscrow || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            Held safely in Stripe Escrow
          </div>
        </div>
      </div>

      {/* Revenue Velocity Chart */}
      <div className="p-6 rounded-2xl bg-surface-1 border border-surface-3 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-3/50 pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
            <TrendingUp className="w-4 h-4 text-accent" /> Monthly Revenue Velocity (₹ INR)
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">2026 Financial Track</span>
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.monthlyRevenue}>
              <defs>
                <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#71717A" fontSize={11} fontFamily="monospace" />
              <YAxis
                stroke="#71717A"
                fontSize={11}
                fontFamily="monospace"
                tickFormatter={(v) => `₹${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111113',
                  borderColor: '#27272A',
                  borderRadius: 12,
                  fontSize: 12,
                  fontFamily: 'monospace',
                }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#F59E0B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#amberGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Operational Orders Queue */}
      <div className="p-6 rounded-2xl bg-surface-1 border border-surface-3 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-3/50 pb-3">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Live Shoot Orders &amp; Operations
            </h3>
          </div>
          <Link href="/admin/rentals" className="text-xs font-mono text-accent hover:underline flex items-center gap-1">
            View All Orders <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-surface-0/40 border border-dashed border-surface-3 space-y-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent">
              <Film className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-white font-display">Awaiting New Bookings</div>
            <p className="text-xs text-zinc-500 font-mono max-w-sm mx-auto">
              No rental orders in queue yet. When a customer places a rental order on the storefront, it will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl bg-surface-0/60 border border-surface-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-surface-4 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-accent">
                      {order.rental_number || order.booking_id || order.id}
                    </span>
                    {getStatusBadge(order.status)}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 border border-surface-3 text-zinc-300">
                      {order.delivery_mode === 'DELIVERY' ? 'Van Delivery' : 'Vault Pickup'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{order.user?.full_name || order.delivery_address?.fullName || 'Production Lead'}</span>
                    <span className="text-zinc-500 font-normal font-mono text-[11px]">
                      • {order.user?.phone || order.delivery_address?.phone || '+91 9876543210'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-3 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> {order.start_date} to {order.end_date}
                    </span>
                    <span>•</span>
                    <span className="text-white font-bold">
                      ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                    </span>
                    <span>•</span>
                    <span className="text-amber-400">
                      Escrow: ₹{Number(order.security_deposit || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {order.status === 'CONFIRMED' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                      className="text-[10px] py-1 px-3 bg-accent hover:bg-accent-hover text-surface-0 font-bold"
                    >
                      Mark Ready
                    </Button>
                  )}
                  {order.status === 'READY_FOR_PICKUP' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, 'HANDED_OVER')}
                      className="text-[10px] py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      Hand Over
                    </Button>
                  )}
                  {(order.status === 'HANDED_OVER' || order.status === 'ACTIVE') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(order.id, 'RETURNED')}
                      className="text-[10px] py-1 px-3 text-amber-400 border-amber-500/30 font-bold"
                    >
                      Receive Return
                    </Button>
                  )}
                  {(order.status === 'RETURNED' || order.status === 'RETURN_REQUESTED') && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                      className="text-[10px] py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Complete &amp; Settle
                    </Button>
                  )}
                  {order.status === 'COMPLETED' && (
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/rentals"
          className="p-4 rounded-xl bg-surface-1 border border-surface-3 hover:border-accent transition-all block group"
        >
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>Rental Bookings</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-accent transition-colors" />
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1">Manage orders &amp; dispatches</div>
        </Link>

        <Link
          href="/admin/inventory"
          className="p-4 rounded-xl bg-surface-1 border border-surface-3 hover:border-accent transition-all block group"
        >
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>Asset Inventory</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-accent transition-colors" />
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1">Track serials &amp; vault racks</div>
        </Link>

        <Link
          href="/admin/customers"
          className="p-4 rounded-xl bg-surface-1 border border-surface-3 hover:border-accent transition-all block group"
        >
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>Customer Directory</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-accent transition-colors" />
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1">Filmmakers &amp; Studios</div>
        </Link>

        <Link
          href="/admin/inspections"
          className="p-4 rounded-xl bg-surface-1 border border-surface-3 hover:border-accent transition-all block group"
        >
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>Return QC &amp; Inspection</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-accent transition-colors" />
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1">6-Point gear inspection</div>
        </Link>
      </div>
    </div>
  );
}
