import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { InvoiceService } from '@/lib/services/invoice.service';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, LayoutDashboard, Calendar, Truck, ShieldCheck, Camera, Sparkles, Phone, ArrowRight } from 'lucide-react';
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
    <div className="bg-cinema-bg min-h-screen py-10 text-cinema-text">
      <div className="mx-auto max-w-3xl px-4 space-y-8">
        {/* Success Splash Card */}
        <div className="rounded-3xl border border-cinema-border bg-cinema-card p-8 text-center shadow-cinema space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-semantic-success/15 border border-semantic-success/30 text-semantic-success shadow-xs">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BOOKING CONFIRMED &amp; DISPATCHED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-cinema-text headingbold">
              Your Gear is Reserved!
            </h1>
            <p className="text-xs text-cinema-muted max-w-md mx-auto">
              Order ID <strong className="text-cinema-text font-mono">{order.rental_id || order.id}</strong> is locked.
              Our production engineer will contact you on WhatsApp shortly for dispatch tracking.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <PrintInvoiceButton orderId={order.id} rentalId={order.rental_id} />

            <Link href="/account">
              <Button variant="outline" className="rounded-2xl border-cinema-border text-cinema-text hover:bg-cinema-elevated font-semibold text-xs">
                <LayoutDashboard className="h-4 w-4 mr-2 text-accent" />
                <span>My Bookings</span>
              </Button>
            </Link>

            <Link href="/equipment">
              <Button className="rounded-2xl bg-accent hover:bg-accent-hover text-cinema-bg font-black text-xs">
                <Camera className="h-4 w-4 mr-2" />
                <span>Explore More Gear</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Details Breakdown Card */}
        <div className="rounded-3xl border border-cinema-border bg-cinema-card p-6 sm:p-8 shadow-cinema space-y-6">
          <h2 className="text-base font-black text-cinema-text headingbold border-b border-cinema-border pb-3 flex items-center justify-between">
            <span>Rental Schedule &amp; Gear</span>
            <span className="text-xs font-bold text-accent uppercase">
              {order.delivery_mode === 'DELIVERY' ? 'Doorstep Delivery' : 'Hub Pickup'}
            </span>
          </h2>

          {/* Dates & Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-cinema-elevated border border-cinema-border space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cinema-muted">
                <Calendar className="h-3.5 w-3.5 text-accent" />
                <span>Rental Dates</span>
              </div>
              <div className="font-semibold text-cinema-text text-sm">
                {order.start_date} → {order.end_date}
              </div>
              <div className="text-cinema-muted">{order.total_days || 1} Production Days</div>
            </div>

            <div className="p-4 rounded-2xl bg-cinema-elevated border border-cinema-border space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cinema-muted">
                <Truck className="h-3.5 w-3.5 text-accent" />
                <span>Fulfillment Location</span>
              </div>
              <div className="font-semibold text-cinema-text text-sm">
                {order.address?.fullName || 'Valued Client'}
              </div>
              <div className="text-cinema-muted line-clamp-1">
                {order.address?.line1}, {order.address?.city || 'Chennai'}
              </div>
            </div>
          </div>

          {/* Equipment List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cinema-muted">Reserved Equipment</h3>
            <div className="divide-y divide-cinema-border">
              {order.rental_items?.map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-cinema-text">{item.equipment?.name || 'Cinema Gear Package'}</div>
                    <div className="text-cinema-muted">Qty: {item.quantity} • Rate: {formatCurrency(item.daily_price)}/day</div>
                  </div>
                  <div className="font-black text-accent">
                    {formatCurrency(item.subtotal || item.daily_price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-cinema-border pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-cinema-muted">
              <span>Rental Subtotal</span>
              <span className="font-semibold text-cinema-text">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-cinema-muted">
              <span>Fulfillment Fee</span>
              <span className="font-semibold text-cinema-text">{formatCurrency(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between text-cinema-muted">
              <span>GST (18%)</span>
              <span className="font-semibold text-cinema-text">{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between text-cinema-muted">
              <span>Refundable Security Deposit</span>
              <span className="font-semibold text-cinema-text">{formatCurrency(order.security_deposit)}</span>
            </div>
            <div className="border-t border-cinema-border pt-3 flex justify-between items-baseline">
              <span className="font-bold text-cinema-text text-sm">Grand Total Paid</span>
              <span className="font-black text-xl text-accent">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Support Box */}
        <div className="rounded-3xl border border-cinema-border bg-cinema-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-cinema">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-cinema-text text-sm">Need On-Set Assistance?</h3>
            <p className="text-xs text-cinema-muted">Our technical dispatch helpline is live 24/7 on WhatsApp.</p>
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
