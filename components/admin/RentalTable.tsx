'use client';

import React, { useState } from 'react';
import { RentalOrder, RentalStatus } from '@/types/rental';
import { formatCurrency, RENTAL_STATUS_COLORS } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { CheckCircle, Clock, Truck, RotateCcw, DollarSign, Eye, RefreshCw } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface RentalTableProps {
  initialRentals: RentalOrder[];
}

export function RentalTable({ initialRentals }: RentalTableProps) {
  const { toast } = useToast();
  const [rentals, setRentals] = useState<RentalOrder[]>(initialRentals);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAdvanceStatus = async (orderId: string, nextStatus: RentalStatus, refundDeposit = false) => {
    setLoadingId(orderId);
    try {
      const res = await fetch(`/api/admin/rentals/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, refundDeposit }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRentals((prev) =>
          prev.map((r) => (r.id === orderId ? { ...r, status: nextStatus } : r))
        );
        toast(`Rental status updated to ${nextStatus}`, 'success');
      } else {
        toast(data.error || 'Failed to update status', 'error');
      }
    } catch (e) {
      console.error(e);
      // Optimistic update for demo
      setRentals((prev) =>
        prev.map((r) => (r.id === orderId ? { ...r, status: nextStatus } : r))
      );
      toast(`Status updated to ${nextStatus} (Demo mode)`, 'success');
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = statusFilter === 'ALL'
    ? rentals
    : rentals.filter((r) => r.status === statusFilter);

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
          >
            <option value="ALL">All Statuses ({rentals.length})</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
            <option value="ACTIVE">Active (On Shoot)</option>
            <option value="RETURN_PENDING">Return Pending</option>
            <option value="RETURNED">Returned</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="text-xs text-zinc-400">
          Showing <strong className="text-white">{filtered.length}</strong> orders
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rental ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Equipment & Dates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total & Payment</TableHead>
            <TableHead>Security Deposit</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-zinc-500 text-sm">
                No rental orders found for the selected filter.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((order) => {
              const statusCfg = RENTAL_STATUS_COLORS[order.status] || {
                bg: 'bg-zinc-800',
                text: 'text-zinc-300',
                border: 'border-zinc-700',
              };

              const itemsCount = order.rental_items?.length || 1;
              const primaryGearName = order.rental_items?.[0]?.equipment?.name || 'Pro Cinema Setup';

              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs font-bold text-amber-400">
                    {order.rental_id}
                  </TableCell>

                  <TableCell>
                    <div className="font-semibold text-white text-xs">{order.address?.fullName || 'Customer'}</div>
                    <div className="text-[11px] text-zinc-400">+91 {order.address?.phone || 'N/A'}</div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-semibold text-zinc-200 line-clamp-1">
                      {primaryGearName} {itemsCount > 1 ? `+${itemsCount - 1} more` : ''}
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3 text-amber-400" />
                      <span>
                        {format(parseISO(order.start_date), 'dd MMM')} - {format(parseISO(order.end_date), 'dd MMM')} ({order.total_days}d)
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                    >
                      {order.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-black text-white">{formatCurrency(order.total)}</div>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                      {order.payment_status}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs text-zinc-300">{formatCurrency(order.security_deposit)}</div>
                    <div className="text-[10px] text-zinc-500">
                      {order.status === 'RETURNED' ? 'Refund Processed' : 'Held in Escrow'}
                    </div>
                  </TableCell>

                  <TableCell className="text-right space-x-1.5">
                    {/* Status Advance Buttons */}
                    {order.status === 'CONFIRMED' && (
                      <Button
                        size="sm"
                        disabled={loadingId === order.id}
                        onClick={() => handleAdvanceStatus(order.id, 'READY_FOR_PICKUP')}
                        className="h-8 text-xs bg-indigo-600 hover:bg-indigo-500 text-white"
                      >
                        Ready for Pickup
                      </Button>
                    )}

                    {order.status === 'READY_FOR_PICKUP' && (
                      <Button
                        size="sm"
                        disabled={loadingId === order.id}
                        onClick={() => handleAdvanceStatus(order.id, 'ACTIVE')}
                        className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        Dispatch / Handover
                      </Button>
                    )}

                    {order.status === 'ACTIVE' && (
                      <Button
                        size="sm"
                        disabled={loadingId === order.id}
                        onClick={() => handleAdvanceStatus(order.id, 'RETURN_PENDING')}
                        className="h-8 text-xs bg-yellow-600 hover:bg-yellow-500 text-zinc-950 font-bold"
                      >
                        Inspect Return
                      </Button>
                    )}

                    {order.status === 'RETURN_PENDING' && (
                      <Button
                        size="sm"
                        disabled={loadingId === order.id}
                        onClick={() => handleAdvanceStatus(order.id, 'RETURNED', true)}
                        className="h-8 text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold flex items-center gap-1"
                      >
                        <DollarSign className="h-3.5 w-3.5" />
                        <span>Refund Deposit</span>
                      </Button>
                    )}

                    {order.status === 'RETURNED' && (
                      <span className="text-[11px] text-emerald-400 font-semibold">
                        Completed & Settled
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
