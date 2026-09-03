import { describe, it, expect } from 'vitest';
import { PricingService, PricingItemInput } from '@/lib/services/pricing.service';

describe('PricingService — Authoritative Server Pricing Engine', () => {
  it('calculates standard daily subtotal accurately for short rentals (< 7 days)', () => {
    const items: PricingItemInput[] = [
      {
        equipmentId: 'eq-1',
        equipmentName: 'Sony FX3',
        quantity: 1,
        startDate: '2026-09-15',
        endDate: '2026-09-18', // 3 days
        dailyPrice: 4000,
        weeklyPrice: 20000,
        securityDeposit: 16000,
      },
    ];

    const pricing = PricingService.calculatePricing(items, 'PICKUP');

    // Subtotal = 4000 * 3 = 12000
    expect(pricing.subtotal).toBe(12000);
    // Subtotal <= 20000, so no discount
    expect(pricing.hasDiscount).toBe(false);
    expect(pricing.discount).toBe(0);
    // Studio pickup fee = 0
    expect(pricing.deliveryFee).toBe(0);
    // Tax = 18% of 12000 = 2160
    expect(pricing.tax).toBe(2160);
    // Deposit = 16000
    expect(pricing.securityDeposit).toBe(16000);
    // Total = 12000 + 2160 + 16000 = 30160
    expect(pricing.total).toBe(30160);
  });

  it('switches to prorated weekly pricing when duration is >= 7 days', () => {
    const items: PricingItemInput[] = [
      {
        equipmentId: 'eq-1',
        equipmentName: 'Sony FX3',
        quantity: 1,
        startDate: '2026-09-10',
        endDate: '2026-09-17', // 7 days
        dailyPrice: 4000, // standard daily would be 28,000
        weeklyPrice: 21000, // weekly rate prorated: 21000 / 7 = 3000/day -> 21,000 for 7 days
        securityDeposit: 16000,
      },
    ];

    const pricing = PricingService.calculatePricing(items, 'PICKUP');

    // Subtotal should be 21,000 (weekly prorated) instead of 28,000
    expect(pricing.subtotal).toBe(21000);
    // Subtotal > 20000 triggers 10% discount: 10% of 21000 = 2100
    expect(pricing.hasDiscount).toBe(true);
    expect(pricing.discount).toBe(2100);
    // Taxable base = 21000 - 2100 = 18900
    // Tax = 18% of 18900 = 3402
    expect(pricing.tax).toBe(3402);
    // Total = 18900 + 3402 + 16000 = 38302
    expect(pricing.total).toBe(38302);
  });

  it('correctly applies ₹300 delivery fee and calculates GST on net amount', () => {
    const items: PricingItemInput[] = [
      {
        equipmentId: 'eq-mic',
        equipmentName: 'Rode Wireless GO II',
        quantity: 2,
        startDate: '2026-09-20',
        endDate: '2026-09-22', // 2 days
        dailyPrice: 1200,
        securityDeposit: 4800,
      },
    ];

    const pricing = PricingService.calculatePricing(items, 'DELIVERY');

    // Subtotal = 1200 * 2 days * 2 qty = 4800
    expect(pricing.subtotal).toBe(4800);
    expect(pricing.deliveryFee).toBe(300);
    // Taxable base = 4800 + 300 = 5100
    // GST 18% of 5100 = 918
    expect(pricing.tax).toBe(918);
    // Deposit = 4800 * 2 = 9600
    expect(pricing.securityDeposit).toBe(9600);
    // Grand Total = 5100 + 918 + 9600 = 15618
    expect(pricing.total).toBe(15618);
  });
});
