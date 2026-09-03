import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AdminStatusUpdateSchema } from '@/lib/validations/schemas';
import { MockDatabaseService } from '@/lib/data/mock-db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const parsed = AdminStatusUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid status parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { status, refundDeposit } = parsed.data;

    let updatedOrder: any = null;

    try {
      // 1. Update rental order status in DB
      const { data: dbOrder, error: orderError } = await (supabaseAdmin
        .from('rental_orders') as any)
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (!orderError && dbOrder) {
        updatedOrder = dbOrder;

        // 2. If status is RETURNED or refundDeposit is requested, update deposit status
        if (refundDeposit || status === 'RETURNED') {
          await (supabaseAdmin
            .from('security_deposits') as any)
            .update({
              status: 'REFUNDED',
              refunded_amount: updatedOrder.security_deposit,
            })
            .eq('rental_order_id', id);
        } else if (status === 'RETURN_PENDING') {
          await (supabaseAdmin
            .from('security_deposits') as any)
            .update({
              status: 'REFUND_PENDING',
            })
            .eq('rental_order_id', id);
        }
      }
    } catch (e) {
      // Fallback
    }

    // Always update mock DB as well
    const mockOrder = MockDatabaseService.updateRentalStatus(id, status, refundDeposit);
    if (!updatedOrder) {
      updatedOrder = mockOrder;
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: `Rental status updated to ${status}`,
    });
  } catch (error: any) {
    console.error('[API Admin Status] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

