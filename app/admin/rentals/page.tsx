import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/server';
import { RentalTable } from '@/components/admin/RentalTable';
import { FileText, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function AdminRentalsPage() {
  let rentals: any[] = [];

  try {
    const { data, error } = await supabaseAdmin
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
    console.warn('DB rentals fetch error:', e);
  }


  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-400" />
            <span>Rental Order Lifecycle & Escrow Control</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Advance bookings: Confirmed ➔ Ready for Pickup ➔ Active (Shoot) ➔ Return Inspection ➔ Refund Deposit.
          </p>
        </div>
      </div>

      {/* Interactive Admin Rental Table */}
      <RentalTable initialRentals={rentals} />
    </div>
  );
}
