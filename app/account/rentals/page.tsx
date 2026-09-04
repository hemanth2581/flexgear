import React from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/server';
import { formatCurrency, RENTAL_STATUS_COLORS } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, Clock, Eye, Film } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { MockDatabaseService } from '@/lib/data/mock-db';

export const revalidate = 0;

export default async function MyRentalsPage() {
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
    console.warn('DB fetch error on MyRentalsPage:', e);
  }

  if (rentals.length === 0) {
    rentals = MockDatabaseService.getAllRentals();
  }

  return (
    <div className="rounded-3xl border border-cinema-border bg-cinema-card p-6 sm:p-8 space-y-6 shadow-cinema">
      <div className="flex items-center justify-between border-b border-cinema-border pb-4">
        <div>
          <h2 className="text-xl font-black text-cinema-text headingbold">All Production Bookings</h2>
          <p className="text-xs text-cinema-muted">Complete history of your equipment rentals and tax invoices</p>
        </div>
      </div>

      <div className="rounded-2xl border border-cinema-border overflow-hidden">
        <Table>
          <TableHeader className="bg-cinema-elevated">
            <TableRow className="border-cinema-border text-xs">
              <TableHead className="font-bold text-cinema-text">Rental ID</TableHead>
              <TableHead className="font-bold text-cinema-text">Equipment Booked</TableHead>
              <TableHead className="font-bold text-cinema-text">Dates &amp; Days</TableHead>
              <TableHead className="font-bold text-cinema-text">Status</TableHead>
              <TableHead className="font-bold text-cinema-text">Deposit Status</TableHead>
              <TableHead className="font-bold text-cinema-text">Total Paid</TableHead>
              <TableHead className="font-bold text-cinema-text text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs divide-y divide-cinema-border">
            {rentals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-cinema-muted text-xs">
                  You have not placed any equipment rental bookings yet.
                </TableCell>
              </TableRow>
            ) : (
              rentals.map((order) => (
                <TableRow key={order.id} className="border-cinema-border hover:bg-cinema-elevated/60">
                  <TableCell className="font-mono text-xs font-bold text-cinema-text">
                    <Link href={`/rentals/${order.id}`} className="hover:text-accent">
                      {order.rental_id || order.id.slice(0, 8)}
                    </Link>
                  </TableCell>

                  <TableCell>
                    {(order.rental_items || []).map((item: any, idx: number) => (
                      <div key={idx} className="font-semibold text-cinema-text line-clamp-1">
                        {item.equipment?.name || 'Pro Cinema Gear'} (×{item.quantity})
                      </div>
                    ))}
                  </TableCell>

                  <TableCell>
                    <div className="text-cinema-muted">
                      {format(parseISO(order.start_date), 'dd MMM yyyy')} - {format(parseISO(order.end_date), 'dd MMM yyyy')}
                    </div>
                    <div className="text-[10px] text-cinema-muted/60">{order.total_days} Days Duration</div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold border-cinema-border text-cinema-text">
                      {order.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-cinema-muted">
                    {formatCurrency(order.security_deposit || 0)}
                  </TableCell>

                  <TableCell className="font-black text-accent">
                    {formatCurrency(order.total || 0)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Link href={`/rentals/${order.id}`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-accent hover:bg-accent/15">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        <span>View</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
