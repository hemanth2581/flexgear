import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { InvoiceService } from '@/lib/services/invoice.service';
import { formatCurrency, RENTAL_STATUS_COLORS } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Camera,
  Sparkles,
  Printer,
  ChevronRight,
  Package,
  Wrench,
  AlertCircle,
  MapPin,
  Calendar,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { PrintInvoiceButton } from '@/components/rentals/PrintInvoiceButton';


export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface RentalDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function RentalDetailsPage({ params }: RentalDetailsPageProps) {
  const { id } = params;
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

    const { data } = await query.maybeSingle();
    if (data) order = data;
  } catch (e) {
    console.warn('DB fetch error on rental detail page:', e);
  }

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-[#f3f3f3] min-h-screen py-10 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/account" className="text-xs text-lenstiger font-bold hover:underline">
                ← Back to Account
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 headingbold">
              Booking {order.rental_id || order.id}
            </h1>
            <p className="text-xs text-gray-500">
              Reserved on {format(parseISO(order.created_at || new Date().toISOString()), 'dd MMM yyyy, hh:mm a')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs font-bold border-gray-300">
              {order.status}
            </Badge>
            <PrintInvoiceButton orderId={order.id} rentalId={order.rental_id} />
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Main Info (8 cols) */}
          <div className="md:col-span-8 space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-base font-black text-gray-900 headingbold">Reserved Equipment Items</h2>
              <div className="divide-y divide-gray-100">
                {order.rental_items?.map((item: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-gray-900">{item.equipment?.name}</div>
                      <div className="text-gray-500">
                        {order.start_date} → {order.end_date} • Qty: {item.quantity} • {formatCurrency(item.daily_price)}/day
                      </div>
                    </div>
                    <div className="font-black text-lenstiger">
                      {formatCurrency(item.subtotal || item.daily_price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logistics Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
              <h2 className="text-base font-black text-gray-900 headingbold flex items-center gap-2">
                <Truck className="w-5 h-5 text-lenstiger" />
                <span>Delivery & Contact Details</span>
              </h2>
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>Client Name:</strong> {order.address?.fullName || 'Valued Client'}</div>
                <div><strong>Mobile Phone:</strong> +91 {order.address?.phone || '9884039091'}</div>
                <div><strong>Fulfillment Mode:</strong> {order.delivery_mode === 'DELIVERY' ? 'Doorstep Delivery' : 'Hub Pickup'}</div>
                <div><strong>Set Address:</strong> {order.address?.line1}, {order.address?.city || 'Chennai'} - {order.address?.pincode}</div>
              </div>
            </div>
          </div>

          {/* Pricing Sidebar (4 cols) */}
          <div className="md:col-span-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Billing Summary</h3>
            <div className="space-y-2 text-xs divide-y divide-gray-100">
              <div className="flex justify-between text-gray-600 pt-2">
                <span>Rental Subtotal</span>
                <span className="font-semibold text-gray-900">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 pt-2">
                <span>Fulfillment Fee</span>
                <span className="font-semibold text-gray-900">{formatCurrency(order.delivery_fee)}</span>
              </div>
              <div className="flex justify-between text-gray-600 pt-2">
                <span>GST (18%)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-gray-600 pt-2">
                <span>Refundable Deposit</span>
                <span className="font-semibold text-gray-900">{formatCurrency(order.security_deposit)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3">
                <span className="font-bold text-gray-900">Total Paid</span>
                <span className="font-black text-lg text-lenstiger">{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/919884039091"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
