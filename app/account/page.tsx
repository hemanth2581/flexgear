import React from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/server';
import { formatCurrency, RENTAL_STATUS_COLORS } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Film, Calendar, ShieldCheck, Clock, ArrowRight, Printer, CheckCircle2, Shield, Eye, Heart, Camera } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { MockDatabaseService } from '@/lib/data/mock-db';

export const revalidate = 0; // Dynamic

export default async function AccountDashboardPage() {
  let rentals: any[] = [];

  try {
    const { data } = await supabaseAdmin
      .from('rental_orders')
      .select(`
        *,
        rental_items (
          *,
          equipment:equipment (
            id,
            name,
            image_url,
            daily_price,
            brand:brands(name)
          )
        ),
        payments (*),
        security_deposits (*)
      `)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) rentals = data;
  } catch (e) {
    console.warn('DB fetch error on account page:', e);
  }

  if (rentals.length === 0) {
    rentals = MockDatabaseService.getAllRentals();
  }

  const activeRentals = rentals.filter((r) => r.status === 'ACTIVE');
  const upcomingRentals = rentals.filter((r) => r.status === 'CONFIRMED' || r.status === 'READY_FOR_PICKUP');
  const completedRentals = rentals.filter((r) => r.status === 'RETURNED');

  const totalEscrow = rentals
    .filter((r) => r.status !== 'RETURNED' && r.status !== 'CANCELLED')
    .reduce((acc, r) => acc + (r.security_deposit || 0), 0);

  return (
    <div className="space-y-8">
      {/* KYC Status Banner */}
      <div className="rounded-3xl border border-cinema-border bg-cinema-card p-6 shadow-cinema flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent border border-accent/30 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-cinema-text headingbold">Verified Cinematographer KYC Tier</h2>
              <Badge className="bg-accent text-cinema-bg font-black text-[10px]">
                Active &amp; Verified
              </Badge>
            </div>
            <p className="text-xs text-cinema-muted mt-0.5">
              Government ID verified (Aadhaar &amp; Production GST) • Eligible for instant zero-deposit gear dispatch
            </p>
          </div>
        </div>

        <div className="text-right sm:border-l sm:border-cinema-border sm:pl-6 shrink-0">
          <div className="text-[10px] uppercase font-bold text-cinema-muted">Current Deposit in Escrow</div>
          <div className="text-xl font-black text-accent font-mono">{formatCurrency(totalEscrow)}</div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-cinema-border bg-cinema-card p-5 space-y-1 shadow-cinema">
          <div className="flex items-center justify-between text-xs text-cinema-muted font-semibold uppercase">
            <span>Upcoming Shoots</span>
            <Calendar className="h-4 w-4 text-accent" />
          </div>
          <div className="text-3xl font-black text-cinema-text">{upcomingRentals.length}</div>
          <div className="text-[11px] text-cinema-muted">Confirmed &amp; Ready for Pickup</div>
        </div>

        <div className="rounded-3xl border border-cinema-border bg-cinema-card p-5 space-y-1 shadow-cinema">
          <div className="flex items-center justify-between text-xs text-cinema-muted font-semibold uppercase">
            <span>Active on Set</span>
            <Film className="h-4 w-4 text-accent" />
          </div>
          <div className="text-3xl font-black text-accent">{activeRentals.length}</div>
          <div className="text-[11px] text-cinema-muted">Currently deployed equipment</div>
        </div>

        <div className="rounded-3xl border border-cinema-border bg-cinema-card p-5 space-y-1 shadow-cinema">
          <div className="flex items-center justify-between text-xs text-cinema-muted font-semibold uppercase">
            <span>Completed Rentals</span>
            <Clock className="h-4 w-4 text-cinema-muted" />
          </div>
          <div className="text-3xl font-black text-cinema-text">{completedRentals.length}</div>
          <div className="text-[11px] text-cinema-muted">Past shoot productions</div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="rounded-3xl border border-cinema-border bg-cinema-card p-6 shadow-cinema space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-cinema-text headingbold">Recent Equipment Bookings</h3>
            <p className="text-xs text-cinema-muted">Manage your active reservations and download GST tax invoices</p>
          </div>
          <Link href="/account/rentals" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="rounded-2xl border border-cinema-border overflow-hidden">
          <Table>
            <TableHeader className="bg-cinema-elevated">
              <TableRow className="border-cinema-border text-xs">
                <TableHead className="font-bold text-cinema-text">Booking ID</TableHead>
                <TableHead className="font-bold text-cinema-text">Shoot Schedule</TableHead>
                <TableHead className="font-bold text-cinema-text">Status</TableHead>
                <TableHead className="font-bold text-cinema-text">Deposit</TableHead>
                <TableHead className="font-bold text-cinema-text text-right">Total (Incl. Tax)</TableHead>
                <TableHead className="font-bold text-cinema-text text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs divide-y divide-cinema-border">
              {rentals.slice(0, 5).map((r) => (
                <TableRow key={r.id} className="border-cinema-border hover:bg-cinema-elevated/60">
                  <TableCell className="font-mono font-bold text-cinema-text">
                    <Link href={`/rentals/${r.id}`} className="hover:text-accent">
                      {r.rental_id || r.id.slice(0, 8)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-cinema-muted">
                    {r.start_date} → {r.end_date}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold text-[10px] border-cinema-border text-cinema-text">
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-cinema-muted">
                    {formatCurrency(r.security_deposit || 0)}
                  </TableCell>
                  <TableCell className="text-right font-black text-accent">
                    {formatCurrency(r.total || 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/rentals/${r.id}`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-accent hover:bg-accent/15">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        <span>View</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
