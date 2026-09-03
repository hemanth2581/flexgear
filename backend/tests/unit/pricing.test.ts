// backend/tests/unit/pricing.test.ts
import { describe, it, expect } from 'vitest';
import { calculateRentalPricing } from '../../src/utils/pricing';

describe('FlexGear Rental Pricing Calculation Engine', () => {
  it('should calculate standard 1-day rental pricing accurately with 18% GST', () => {
    const items = [
      {
        equipmentId: 'equip-1',
        dailyPrice: 4000,
        securityDeposit: 16000,
        quantity: 1,
      },
    ];

    const result = calculateRentalPricing(items, 1, 'PICKUP');

    expect(result.subtotal).toBe(4000);
    expect(result.discount).toBe(0);
    expect(result.deliveryFee).toBe(0);
    expect(result.tax).toBe(720); // 18% of 4000
    expect(result.cgst).toBe(360); // 9%
    expect(result.sgst).toBe(360); // 9%
    expect(result.securityDeposit).toBe(16000);
    expect(result.totalAmount).toBe(20720); // 4000 + 720 + 16000
  });

  it('should apply weekly prorated discount for rentals of 7+ days', () => {
    const items = [
      {
        equipmentId: 'equip-1',
        dailyPrice: 4000,
        weeklyPrice: 20000, // prorated daily rate = 20000/7
        securityDeposit: 16000,
        quantity: 1,
      },
    ];

    const result = calculateRentalPricing(items, 7, 'PICKUP');
    expect(result.subtotal).toBe(20000);
  });

  it('should apply volume discount when rental subtotal exceeds ₹20,000', () => {
    const items = [
      {
        equipmentId: 'equip-cinema-set',
        dailyPrice: 15000,
        securityDeposit: 30000,
        quantity: 2,
      },
    ];

    // 2 units * 15000 * 1 day = 30000 subtotal
    const result = calculateRentalPricing(items, 1, 'DELIVERY');
    expect(result.subtotal).toBe(30000);
    expect(result.discount).toBe(3000); // 10% volume discount
    expect(result.deliveryFee).toBe(500);
  });
});
