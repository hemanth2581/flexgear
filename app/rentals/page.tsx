import React from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/server';
import { formatCurrency, RENTAL_STATUS_COLORS } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, Clock, Eye, Film, Camera, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';


export const revalidate = 0;

export default async function AllRentalsPage() {
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

    if (data) rentals = data;
  } catch (e) {
    console.warn('DB fetch error on AllRentalsPage:', e);
  }

  return (
    <div className="bg-[#f3f3f3] min-h-screen py-10 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 headingbold">All Production Bookings</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              View active shoot reservations, confirmed orders, and downloadable GST tax invoices.
            </p>
          </div>

          <Link href="/equipment">
            <Button className="rounded-2xl font-black text-xs bg-gold hover:bg-gold-hover text-gray-950 px-6 shadow-sm">
              <Camera className="h-4 w-4 mr-1.5" />
              <span>Book More Gear</span>
            </Button>
          </Link>
        </div>

        {/* Orders Table */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="border-gray-200 text-xs">
                  <TableHead className="font-bold text-gray-700">Rental ID</TableHead>
                  <TableHead className="font-bold text-gray-700">Equipment Booked</TableHead>
                  <TableHead className="font-bold text-gray-700">Shoot Dates</TableHead>
                  <TableHead className="font-bold text-gray-700">Status</TableHead>
                  <TableHead className="font-bold text-gray-700">Deposit Status</TableHead>
                  <TableHead className="font-bold text-gray-700">Total Paid</TableHead>
                  <TableHead className="font-bold text-gray-700 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs divide-y divide-gray-100">
                {rentals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500 text-xs">
                      No active or past production bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rentals.map((order) => (
                    <TableRow key={order.id} className="border-gray-100 hover:bg-gray-50/60">
                      <TableCell className="font-mono text-xs font-bold text-gray-900">
                        <Link href={`/rentals/${order.id}`} className="hover:text-lenstiger">
                          {order.rental_id || order.id.slice(0, 8)}
                        </Link>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900 max-w-[220px] truncate">
                        {order.rental_items?.[0]?.equipment?.name || 'Pro Cinema Package'}
                        {order.rental_items?.length > 1 && ` (+${order.rental_items.length - 1} more)`}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {order.start_date} → {order.end_date}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-bold border-gray-300">
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatCurrency(order.security_deposit || 0)}
                      </TableCell>
                      <TableCell className="font-black text-lenstiger">
                        {formatCurrency(order.total || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/rentals/${order.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-lenstiger hover:bg-lenstiger-50">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            <span>Details</span>
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
      </div>
    </div>
  );
}
