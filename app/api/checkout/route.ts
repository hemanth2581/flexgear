import { NextRequest, NextResponse } from 'next/server';
import { CheckoutRequestSchema } from '@/lib/validations/schemas';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';
import { PricingService, PricingItemInput } from '@/lib/services/pricing.service';
import { InventoryService } from '@/lib/services/inventory.service';
import { RentalService } from '@/lib/services/rental.service';
import { OtpService } from '@/lib/services/otp.service';
import { getPaymentProvider } from '@/lib/providers/payment';
import { getDatesArray } from '@/lib/utils';
import { MockDatabaseService, MOCK_EQUIPMENT } from '@/lib/data/mock-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid checkout request data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { items, deliveryMode, address, otpToken, userId } = parsed.data;

    // 1. Verify OTP Token
    if (!OtpService.isValidOtpToken(address.phone, otpToken)) {
      return NextResponse.json(
        { error: 'Phone number verification is required or token is invalid.' },
        { status: 403 }
      );
    }

    // 2. Fetch equipment specs & daily price for calculations
    const equipmentIds = items.map((i) => i.equipmentId);
    const equipmentMap = new Map<string, any>();

    if (isSupabaseConfigured) {
      try {
        const { data: dbEquipment } = await supabaseAdmin
          .from('equipment')
          .select('*')
          .in('id', equipmentIds);

        if (dbEquipment && dbEquipment.length > 0) {
          dbEquipment.forEach((eq: any) => equipmentMap.set(eq.id, eq));
        }
      } catch (e) {
        // Fallback
      }
    }

    // Populate missing from mock data
    equipmentIds.forEach((id) => {
      if (!equipmentMap.has(id)) {
        const mockEq = MOCK_EQUIPMENT.find((e) => e.id === id);
        if (mockEq) equipmentMap.set(id, mockEq);
      }
    });

    // 3. Authoritative availability verification
    for (const item of items) {
      const avail = await InventoryService.checkAvailability(
        item.equipmentId,
        item.startDate,
        item.endDate,
        item.quantity
      );

      if (!avail.available) {
        const eqName = equipmentMap.get(item.equipmentId)?.name || 'Equipment';
        return NextResponse.json(
          {
            error: `Item "${eqName}" is no longer available for the selected dates (${item.startDate} to ${item.endDate}).`,
          },
          { status: 409 }
        );
      }
    }

    // 4. Server-Side Pricing Recalculation
    const pricingInputs: PricingItemInput[] = items.map((item) => {
      const eq = equipmentMap.get(item.equipmentId);
      return {
        equipmentId: item.equipmentId,
        equipmentName: eq?.name || 'Pro Gear',
        quantity: item.quantity,
        startDate: item.startDate,
        endDate: item.endDate,
        dailyPrice: eq?.daily_price || 0,
        weeklyPrice: eq?.weekly_price,
        securityDeposit: eq?.security_deposit || 0,
      };
    });

    const pricing = PricingService.calculatePricing(pricingInputs, deliveryMode);

    // Determine overall start and end dates
    const startDates = items.map((i) => i.startDate).sort();
    const endDates = items.map((i) => i.endDate).sort().reverse();
    const primaryStart = startDates[0];
    const primaryEnd = endDates[0];

    const tempRentalId = RentalService.generateRentalId();
    const effectiveUserId = userId || '00000000-0000-0000-0000-000000000001'; // Default guest/demo user

    let orderId = `ord-${Date.now()}`;
    let insertedInDb = false;

    if (isSupabaseConfigured) {
      try {
        // 5. Insert Rental Order into DB
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('rental_orders')
        .insert({
          rental_id: tempRentalId,
          user_id: effectiveUserId,
          status: 'PAYMENT_PENDING',
          start_date: primaryStart,
          end_date: primaryEnd,
          total_days: pricing.days,
          delivery_mode: deliveryMode,
          address: address as any,
          subtotal: pricing.subtotal,
          discount: pricing.discount,
          delivery_fee: pricing.deliveryFee,
          tax: pricing.tax,
          security_deposit: pricing.securityDeposit,
          total: pricing.total,
          payment_status: 'CREATED',
        })
        .select()
        .single();

      if (!orderError && orderData) {
        orderId = (orderData as any).id;
        insertedInDb = true;

        // 6. Insert Rental Items
        const rentalItemsToInsert = items.map((item) => {
          const eq = equipmentMap.get(item.equipmentId);
          const days = pricing.days;
          return {
            rental_order_id: orderId,
            equipment_id: item.equipmentId,
            quantity: item.quantity,
            daily_price: eq?.daily_price || 0,
            subtotal: (eq?.daily_price || 0) * days * item.quantity,
          };
        });

        await supabaseAdmin
          .from('rental_items')
          .insert(rentalItemsToInsert);

        // 7. Lock Rental Dates
        const rentalDatesToInsert: any[] = [];
        items.forEach((item) => {
          const dates = getDatesArray(item.startDate, item.endDate);
          dates.forEach((d) => {
            rentalDatesToInsert.push({
              rental_order_id: orderId,
              equipment_id: item.equipmentId,
              date: d,
              units_booked: item.quantity,
            });
          });
        });

        if (rentalDatesToInsert.length > 0) {
          await supabaseAdmin
            .from('rental_dates')
            .insert(rentalDatesToInsert);
        }

        // 8. Insert Security Deposit Record
        if (pricing.securityDeposit > 0) {
          await supabaseAdmin
            .from('security_deposits')
            .insert({
              rental_order_id: orderId,
              amount: pricing.securityDeposit,
              status: 'COLLECTED',
              refunded_amount: 0,
            });
        }
      }
    } catch (e) {
      console.warn('[API Checkout] Supabase insert error:', e);
    }
  }

    // 9. Create Payment Order with Provider
    const paymentProvider = getPaymentProvider();
    const paymentOrder = await paymentProvider.createOrder({
      rentalOrderId: orderId,
      amount: pricing.total,
      customerPhone: address.phone,
      customerEmail: address.email,
    });

    if (insertedInDb) {
      try {
        await supabaseAdmin.from('payments').insert({
          rental_order_id: orderId,
          provider: 'mock',
          provider_payment_id: paymentOrder.paymentId,
          amount: pricing.total,
          status: 'CAPTURED',
        });
      } catch (e) {
        // Ignored
      }
    }

    return NextResponse.json({
      success: true,
      rentalOrderId: orderId,
      rentalId: tempRentalId,
      paymentOrderId: paymentOrder.paymentId,
      pricing,
    });
  } catch (error: any) {
    console.error('[API Checkout] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating your rental order' },
      { status: 500 }
    );
  }
}

