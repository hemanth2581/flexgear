// backend/src/services/pricing.service.ts
import { calculateRentalPricing, PriceItemInput, PricingBreakdown } from '../utils/pricing';

export class PricingService {
  static computePricing(
    items: PriceItemInput[],
    durationDays: number,
    deliveryMode: 'PICKUP' | 'DELIVERY' = 'PICKUP',
    proDiscountPercent = 0
  ): PricingBreakdown {
    return calculateRentalPricing(items, durationDays, deliveryMode, proDiscountPercent);
  }
}
