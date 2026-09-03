// backend/src/utils/pricing.ts
export interface PriceItemInput {
  equipmentId: string;
  dailyPrice: number;
  weeklyPrice?: number | null;
  securityDeposit: number;
  quantity: number;
}

export interface PricingBreakdown {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  cgst: number;
  sgst: number;
  securityDeposit: number;
  totalAmount: number;
  durationDays: number;
}

export const calculateRentalPricing = (
  items: PriceItemInput[],
  durationDays: number,
  deliveryMode: 'PICKUP' | 'DELIVERY' = 'PICKUP',
  proDiscountPercent: number = 0
): PricingBreakdown => {
  let subtotal = 0;
  let totalDeposit = 0;

  for (const item of items) {
    let itemDailyRate = item.dailyPrice;

    // Prorate duration discount tiers: 3+ days (10%), 7+ days (15%), 14+ days (20%)
    if (durationDays >= 14) {
      itemDailyRate = item.dailyPrice * 0.80;
    } else if (durationDays >= 7 && item.weeklyPrice && item.weeklyPrice > 0) {
      itemDailyRate = Math.min(item.weeklyPrice / 7, item.dailyPrice * 0.85);
    } else if (durationDays >= 7) {
      itemDailyRate = item.dailyPrice * 0.85;
    } else if (durationDays >= 3) {
      itemDailyRate = item.dailyPrice * 0.90;
    }

    const itemTotal = itemDailyRate * durationDays * item.quantity;
    subtotal += itemTotal;
    totalDeposit += item.securityDeposit * item.quantity;
  }

  // Volume discount: 10% on rental subtotal over ₹20,000
  let discount = 0;
  if (subtotal > 20000) {
    discount += subtotal * 0.10;
  }

  // Pro Filmmaker membership discount
  if (proDiscountPercent > 0) {
    discount += (subtotal - discount) * (proDiscountPercent / 100);
  }

  // Delivery fee
  const deliveryFee = deliveryMode === 'DELIVERY' ? 500 : 0;

  // 18% GST (9% CGST + 9% SGST) calculated on net rental charge + delivery
  const taxableAmount = Math.max(0, subtotal - discount + deliveryFee);
  const tax = Math.round(taxableAmount * 0.18 * 100) / 100;
  const cgst = Math.round((tax / 2) * 100) / 100;
  const sgst = Math.round((tax - cgst) * 100) / 100;

  // Grand total including refundable deposit
  const totalAmount = Math.round((taxableAmount + tax + totalDeposit) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    deliveryFee,
    tax,
    cgst,
    sgst,
    securityDeposit: Math.round(totalDeposit * 100) / 100,
    totalAmount,
    durationDays,
  };
};
