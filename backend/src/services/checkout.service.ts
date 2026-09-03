// backend/src/services/checkout.service.ts
import { calculateRentalDays } from '../utils/dates';
import { calculateRentalPricing } from '../utils/pricing';
import { generateRentalNumber } from '../utils/booking';
import { AvailabilityService } from './availability.service';
import { RentalModel } from '../models/Rental';
import { DepositModel } from '../models/Deposit';
import { PaymentModel } from '../models/Payment';
import { StripePaymentIntentService } from '../integrations/stripe/payment-intents';
import { EquipmentModel } from '../models/Equipment';

export class CheckoutService {
  static async processCheckout(params: {
    userId: string;
    userEmail: string;
    items: Array<{
      equipmentId: string;
      quantity: number;
      dailyPrice: number;
      weeklyPrice?: number | null;
      securityDeposit: number;
    }>;
    startDate: string;
    endDate: string;
    deliveryMode: 'PICKUP' | 'DELIVERY';
    deliveryAddress?: any;
    notes?: string;
  }) {
    // 1. Date Duration Check
    const durationDays = calculateRentalDays(params.startDate, params.endDate);

    // 2. Availability Check for each item
    for (const item of params.items) {
      const avail = await AvailabilityService.checkAvailability(
        item.equipmentId,
        params.startDate,
        params.endDate,
        item.quantity
      );
      if (!avail.available) {
        throw new Error(
          `Insufficient stock available for requested dates. Only ${avail.availableUnits} units available.`
        );
      }
    }

    // 3. Compute Official Server-Authoritative Pricing Breakdown
    const pricing = calculateRentalPricing(params.items, durationDays, params.deliveryMode);

    // 4. Enrich item details for history snapshot
    const itemSnapshots = [];
    for (const it of params.items) {
      const equip = await EquipmentModel.findById(it.equipmentId);
      let effectiveRate = it.dailyPrice;
      if (durationDays >= 7 && it.weeklyPrice && it.weeklyPrice > 0) {
        effectiveRate = it.weeklyPrice / 7;
      } else if (durationDays >= 7) {
        effectiveRate = it.dailyPrice * 0.85;
      }
      itemSnapshots.push({
        equipment_id: it.equipmentId,
        name: equip?.name || 'Cinema Equipment',
        thumbnail_url: equip?.thumbnail_url || '',
        quantity: it.quantity,
        daily_price: it.dailyPrice,
        subtotal: Math.round(effectiveRate * durationDays * it.quantity * 100) / 100,
      });
    }

    // 5. Create Pending Rental Record
    const rentalNumber = generateRentalNumber();
    const rental = await RentalModel.create({
      rental_number: rentalNumber,
      user_id: params.userId,
      status: 'PENDING_PAYMENT',
      start_date: params.startDate,
      end_date: params.endDate,
      total_days: durationDays,
      delivery_mode: params.deliveryMode,
      delivery_address: params.deliveryAddress || {},
      delivery_lat: params.deliveryAddress?.lat || null,
      delivery_lng: params.deliveryAddress?.lng || null,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      delivery_fee: pricing.deliveryFee,
      tax: pricing.tax,
      security_deposit: pricing.securityDeposit,
      total_amount: pricing.totalAmount,
      notes: params.notes,
      items: itemSnapshots,
    });

    // 6. Create Escrow Security Deposit Record
    await DepositModel.create({
      rental_id: rental.id,
      user_id: params.userId,
      held_amount: pricing.securityDeposit,
    });

    // 7. Create Stripe PaymentIntent
    const stripeIntent = await StripePaymentIntentService.createIntent({
      amount: pricing.totalAmount,
      rentalId: rental.id,
      customerEmail: params.userEmail,
      metadata: {
        rentalNumber: rental.rental_number,
        totalDays: String(durationDays),
      },
    });

    // 8. Create Payment Record
    await PaymentModel.create({
      rental_id: rental.id,
      user_id: params.userId,
      stripe_payment_intent_id: stripeIntent.paymentIntentId,
      amount: pricing.totalAmount,
      currency: 'inr',
      status: 'PENDING',
    });

    return {
      rental,
      pricing,
      clientSecret: stripeIntent.clientSecret,
      paymentIntentId: stripeIntent.paymentIntentId,
    };
  }
}
