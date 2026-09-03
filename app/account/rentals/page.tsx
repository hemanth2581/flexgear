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
    <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 headingbold">All Production Bookings</h2>
          <p className="text-xs text-gray-500">Complete history of your equipment rentals and tax invoices</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="border-gray-200 text-xs">
              <TableHead className="font-bold text-gray-700">Rental ID</TableHead>
              <TableHead className="font-bold text-gray-700">Equipment Booked</TableHead>
              <TableHead className="font-bold text-gray-700">Dates & Days</TableHead>
              <TableHead className="font-bold text-gray-700">Status</TableHead>
              <TableHead className="font-bold text-gray-700">Deposit Status</TableHead>
              <TableHead className="font-bold text-gray-700">Total Paid</TableHead>
              <TableHead className="font-bold text-gray-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs divide-y divide-gray-100">
            {rentals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-500 text-xs">
                  You have not placed any equipment rental bookings yet.
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

                  <TableCell>
                    {(order.rental_items || []).map((item: any, idx: number) => (
                      <div key={idx} className="font-semibold text-gray-900 line-clamp-1">
                        {item.equipment?.name || 'Pro Cinema Gear'} (×{item.quantity})
                      </div>
                    ))}
                  </TableCell>

                  <TableCell>
                    <div className="text-gray-700">
                      {format(parseISO(order.start_date), 'dd MMM yyyy')} - {format(parseISO(order.end_date), 'dd MMM yyyy')}
                    </div>
                    <div className="text-[10px] text-gray-400">{order.total_days} Days Duration</div>
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
