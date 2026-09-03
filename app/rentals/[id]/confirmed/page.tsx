import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { InvoiceService } from '@/lib/services/invoice.service';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, LayoutDashboard, Calendar, Truck, ShieldCheck, Camera, Sparkles, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { PrintInvoiceButton } from '@/components/rentals/PrintInvoiceButton';
import { MockDatabaseService } from '@/lib/data/mock-db';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface ConfirmedPageProps {
  params: {
    id: string;
  };
}

export default async function ConfirmedPage({ params }: ConfirmedPageProps) {
  const { id } = params;

  // Search by either rental_id or UUID
  const isRentalIdFormat = id.startsWith('FG-RNT-');

  let order: any = null;

  try {
    let query = supabaseAdmin
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
      `);

    if (isRentalIdFormat) {
      query = query.eq('rental_id', id);
    } else {
      query = query.eq('id', id);
    }

    const { data } = await query.single();
    if (data) order = data;
  } catch (e) {
    console.warn('DB fetch error on confirmed page:', e);
  }

  // Check in mock database
  if (!order) {
    order = MockDatabaseService.getRentalById(id);
  }

  // Fallback demo order mock if freshly generated ID without DB connection
  if (!order) {
    order = {
      id: id,
      rental_id: isRentalIdFormat ? id : `FG-RNT-${format(new Date(), 'yyyyMMdd')}-8K9DF`,
      status: 'CONFIRMED',
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: format(new Date(Date.now() + 3 * 86400000), 'yyyy-MM-dd'),
      total_days: 3,
      delivery_mode: 'DELIVERY',
      address: {
        fullName: 'Arjun Menon',
        phone: '9884039091',
        email: 'production@cinema.test',
        line1: 'Studio 4, Film City',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600083',
      },
      subtotal: 12000,
      discount: 0,
      delivery_fee: 300,
      tax: 2214,
      security_deposit: 16000,
      total: 30514,
      payment_status: 'CAPTURED',
      created_at: new Date().toISOString(),
      rental_items: [
        {
          quantity: 1,
          daily_price: 4000,
          subtotal: 12000,
          equipment: {
            name: 'Sony FX3 Full-Frame Cinema Camera',
            brand: { name: 'Sony' },
            image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
          },
        },
      ],
    };
  }

  return (
    <div className="bg-[#f3f3f3] min-h-screen py-10 text-gray-900">
      <div className="mx-auto max-w-3xl px-4 space-y-8">
        {/* Success Splash Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-lenstiger-50 text-lenstiger shadow-xs">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lenstiger-50 text-lenstiger font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BOOKING CONFIRMED & DISPATCHED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 headingbold">
              Your Gear is Reserved!
            </h1>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Order ID <strong className="text-gray-900 font-mono">{order.rental_id || order.id}</strong> is locked.
              Our production engineer will contact you on WhatsApp shortly for dispatch tracking.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <PrintInvoiceButton orderId={order.id} rentalId={order.rental_id} />

            <Link href="/account">
              <Button variant="outline" className="rounded-2xl border-gray-300 text-gray-700 font-semibold">
                <LayoutDashboard className="h-4 w-4 mr-2 text-lenstiger" />
                <span>My Bookings</span>
              </Button>
            </Link>

            <Link href="/equipment">
              <Button className="rounded-2xl bg-gold hover:bg-gold-hover text-gray-950 font-black">
                <Camera className="h-4 w-4 mr-2" />
                <span>Explore More Gear</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Details Breakdown Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-black text-gray-900 headingbold border-b border-gray-100 pb-3 flex items-center justify-between">
            <span>Rental Schedule & Gear</span>
            <span className="text-xs font-bold text-lenstiger uppercase">
              {order.delivery_mode === 'DELIVERY' ? 'Doorstep Delivery' : 'Hub Pickup'}
            </span>
          </h2>

          {/* Dates & Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-gray-700">
                <Calendar className="h-3.5 w-3.5 text-lenstiger" />
                <span>Rental Dates</span>
              </div>
              <div className="font-semibold text-gray-900 text-sm">
                {order.start_date} → {order.end_date}
              </div>
              <div className="text-gray-500">{order.total_days || 1} Production Days</div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-gray-700">
                <Truck className="h-3.5 w-3.5 text-lenstiger" />
                <span>Fulfillment Location</span>
              </div>
              <div className="font-semibold text-gray-900 text-sm">
                {order.address?.fullName || 'Valued Client'}
              </div>
              <div className="text-gray-500 line-clamp-1">
                {order.address?.line1}, {order.address?.city || 'Chennai'}
              </div>
            </div>
          </div>

          {/* Equipment List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Reserved Equipment</h3>
            <div className="divide-y divide-gray-100">
              {order.rental_items?.map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-gray-900">{item.equipment?.name}</div>
                    <div className="text-gray-500">Qty: {item.quantity} • Rate: {formatCurrency(item.daily_price)}/day</div>
                  </div>
                  <div className="font-black text-lenstiger">
                    {formatCurrency(item.subtotal || item.daily_price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Rental Subtotal</span>
              <span className="font-semibold text-gray-900">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Fulfillment Fee</span>
              <span className="font-semibold text-gray-900">{formatCurrency(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (18%)</span>
              <span className="font-semibold text-gray-900">{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Refundable Security Deposit</span>
              <span className="font-semibold text-gray-900">{formatCurrency(order.security_deposit)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
              <span className="font-bold text-gray-900 text-sm">Grand Total Paid</span>
              <span className="font-black text-xl text-lenstiger">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Support Box */}
        <div className="rounded-3xl border border-lenstiger/20 bg-lenstiger-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-gray-900 text-sm">Need On-Set Assistance?</h3>
            <p className="text-xs text-gray-600">Our technical dispatch helpline is live 24/7 on WhatsApp.</p>
          </div>
          <a
            href="https://wa.me/919884039091"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-2xl bg-whatsapp hover:bg-whatsapp-hover text-white font-bold text-xs flex items-center gap-2 shadow-xs transition shrink-0"
          >
            <Phone className="w-4 h-4" />
            <span>Chat with Dispatch</span>
          </a>
        </div>
      </div>
    </div>
  );
}
