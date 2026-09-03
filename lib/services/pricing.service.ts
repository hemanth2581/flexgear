import { DeliveryMode, PricingBreakdown } from '@/types/rental';
import { GST_PERCENTAGE, DISCOUNT_THRESHOLD, DISCOUNT_PERCENTAGE, DELIVERY_FEE } from '@/lib/constants';
import { calculateRentalDays } from '@/lib/utils';

export interface PricingItemInput {
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  startDate: string;
  endDate: string;
  dailyPrice: number;
  weeklyPrice?: number | null;
  securityDeposit: number;
}

export class PricingService {
  /**
   * Recalculates full pricing breakdown purely from authoritative DB figures.
   * Client-sent prices are strictly ignored.
   */
  static calculatePricing(
    items: PricingItemInput[],
    deliveryMode: DeliveryMode = 'PICKUP'
  ): PricingBreakdown {
    let subtotal = 0;
    let totalSecurityDeposit = 0;
    let maxDays = 0;

    const itemBreakdowns = items.map((item) => {
      const days = calculateRentalDays(item.startDate, item.endDate);
      if (days > maxDays) maxDays = days;

      // Pricing logic: If duration >= 7 days and weeklyPrice exists, prorate the weekly price
      let effectiveDailyRate = item.dailyPrice;
      let lineSubtotal = 0;

      if (days >= 7 && item.weeklyPrice && item.weeklyPrice > 0) {
        // Prorated daily rate based on weekly package (weekly_price / 7)
        effectiveDailyRate = item.weeklyPrice / 7;
        lineSubtotal = effectiveDailyRate * days * item.quantity;
      } else {
        lineSubtotal = item.dailyPrice * days * item.quantity;
      }

      const lineDeposit = item.securityDeposit * item.quantity;

      subtotal += lineSubtotal;
      totalSecurityDeposit += lineDeposit;

      return {
        equipmentId: item.equipmentId,
        equipmentName: item.equipmentName,
        quantity: item.quantity,
        days,
        dailyPrice: item.dailyPrice,
        weeklyPrice: item.weeklyPrice,
        effectiveDailyRate: Math.round(effectiveDailyRate),
        lineSubtotal: Math.round(lineSubtotal),
        lineDeposit: Math.round(lineDeposit),
      };
    });

    subtotal = Math.round(subtotal);
    totalSecurityDeposit = Math.round(totalSecurityDeposit);

    // Rule: 10% automated discount if subtotal > ₹20,000
    const hasDiscount = subtotal > DISCOUNT_THRESHOLD;
    const discount = hasDiscount ? Math.round(subtotal * DISCOUNT_PERCENTAGE) : 0;

    // Delivery fee
    const deliveryFee = deliveryMode === 'DELIVERY' ? DELIVERY_FEE : 0;

    // Taxable base = subtotal - discount + delivery fee
    const taxableAmount = Math.max(0, subtotal - discount + deliveryFee);

    // 18% GST
    const tax = Math.round(taxableAmount * GST_PERCENTAGE);

    // Total = (subtotal - discount + deliveryFee) + tax + refundable deposit
    const total = taxableAmount + tax + totalSecurityDeposit;

    return {
      subtotal,
      discount,
      hasDiscount,
      deliveryMode,
      deliveryFee,
      taxableAmount,
      tax,
      securityDeposit: totalSecurityDeposit,
      total,
      days: maxDays,
      itemBreakdowns,
    };
  }
}
