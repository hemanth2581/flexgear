import { NextRequest, NextResponse } from 'next/server';
import { VerifyPaymentSchema } from '@/lib/validations/schemas';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getPaymentProvider } from '@/lib/providers/payment';
import { getEmailProvider } from '@/lib/providers/email';
import { RentalService } from '@/lib/services/rental.service';
import { MockDatabaseService } from '@/lib/data/mock-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifyPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid verification payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { paymentId, rentalOrderId } = parsed.data;

    let order: any = null;

    try {
      // 1. Fetch rental order from DB
      const { data: dbOrder, error: orderError } = await supabaseAdmin
        .from('rental_orders')
        .select('*')
        .eq('id', rentalOrderId)
        .single();

      if (!orderError && dbOrder) {
        order = dbOrder;
      }
    } catch (e) {
      // Fallback to mock
    }

    if (!order) {
      order = MockDatabaseService.getRentalById(rentalOrderId);
    }

    if (!order) {
      // Create minimal mock order context if demo ID
      order = {
        id: rentalOrderId,
        rental_id: RentalService.generateRentalId(),
        total: 10000,
        security_deposit: 8000,
        start_date: '2026-09-01',
        end_date: '2026-09-04',
        total_days: 3,
        address: { fullName: 'Valued Filmmaker', email: 'customer@flexgear.test' },
      };
    }

    // 2. Server-side payment verification
    const paymentProvider = getPaymentProvider();
    const verification = await paymentProvider.verifyPayment(paymentId, order.total || 10000);

    if (!verification.verified) {
      return NextResponse.json(
        { error: verification.errorMessage || 'Payment verification failed' },
        { status: 400 }
      );
    }

    // 3. Generate definitive unique Rental ID: FG-RNT-YYYYMMDD-XXXXX
    const confirmedRentalId = order.rental_id && order.rental_id.startsWith('FG-RNT-')
      ? order.rental_id
      : RentalService.generateRentalId();

    try {
      // 4. Update rental_orders status to CONFIRMED
      await (supabaseAdmin
        .from('rental_orders') as any)
        .update({
          rental_id: confirmedRentalId,
          status: 'CONFIRMED',
          payment_status: 'CAPTURED',
        })
        .eq('id', rentalOrderId);

      // 5. Update payments table
      await (supabaseAdmin
        .from('payments') as any)
        .update({
          status: 'CAPTURED',
        })
        .eq('rental_order_id', rentalOrderId);

      // 6. Record security deposit as COLLECTED
      await (supabaseAdmin
        .from('security_deposits') as any)
        .insert({
          rental_order_id: rentalOrderId,
          amount: order.security_deposit || 0,
          status: 'COLLECTED',
        });
    } catch (e) {
      console.warn('[API Payments Verify] Supabase DB offline/mock update:', e);
    }

    // Update in-memory mock store
    MockDatabaseService.updateRentalStatus(rentalOrderId, 'CONFIRMED');

    // 7. Dispatch Confirmation Email via Mock Email Provider
    try {
      const emailProvider = getEmailProvider();
      const customerEmail = (order.address as any)?.email || 'customer@flexgear.test';
      const customerName = (order.address as any)?.fullName || 'Valued Filmmaker';

      await emailProvider.sendEmail({
        to: customerEmail,
        subject: `Rental Confirmed: ${confirmedRentalId} - Flex Gear`,
        html: `
          <h2>Hi ${customerName},</h2>
          <p>Your equipment rental has been successfully confirmed and scheduled.</p>
          <p><strong>Rental ID:</strong> ${confirmedRentalId}</p>
          <p><strong>Period:</strong> ${order.start_date} to ${order.end_date} (${order.total_days} Days)</p>
          <p><strong>Total Paid:</strong> ₹${order.total} (includes refundable deposit ₹${order.security_deposit})</p>
          <p>Thank you for choosing Flex Gear for your production!</p>
        `,
      });
    } catch (e) {
      console.warn('Email dispatch warning:', e);
    }

    return NextResponse.json({
      success: true,
      rentalId: confirmedRentalId,
      orderId: rentalOrderId,
      paymentStatus: 'CAPTURED',
    });
  } catch (error: any) {
    console.error('[API Payments Verify] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error verifying payment' },
      { status: 500 }
    );
  }
}

