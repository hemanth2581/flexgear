import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { RentalService } from '@/lib/services/rental.service';
import { RentalStatus } from '@/types/rental';
import { MockDatabaseService } from '@/lib/data/mock-db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    let order: any = null;

    try {
      const { data: dbOrder, error } = await supabaseAdmin
        .from('rental_orders')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && dbOrder) {
        order = dbOrder;
      }
    } catch (e) {
      // Fallback
    }

    if (!order) {
      order = MockDatabaseService.getRentalById(id);
    }

    if (!order) {
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 });
    }

    if (!RentalService.isValidStatusTransition(order.status as RentalStatus, 'CANCELLED')) {
      return NextResponse.json(
        { error: `Cannot cancel a rental in status: ${order.status}` },
        { status: 400 }
      );
    }

    try {
      // Update status to CANCELLED in DB
      await (supabaseAdmin
        .from('rental_orders') as any)
        .update({ status: 'CANCELLED' })
        .eq('id', id);
    } catch (e) {
      // Ignored
    }

    MockDatabaseService.updateRentalStatus(id, 'CANCELLED');

    return NextResponse.json({
      success: true,
      message: 'Rental order cancelled successfully.',
    });
  } catch (error: any) {
    console.error('[API Cancel Rental] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

