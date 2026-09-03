// backend/tests/unit/booking_lifecycle.test.ts
import { describe, it, expect } from 'vitest';
import { CheckoutService } from '../../src/services/checkout.service';
import { RentalModel } from '../../src/models/Rental';
import { DepositService } from '../../src/services/deposit.service';
import { InspectionService } from '../../src/services/inspection.service';

describe('Complete End-to-End Booking Lifecycle', () => {
  it('should execute full shoot workflow: checkout -> active -> return -> QC -> deposit release', async () => {
    // 1. Customer initiates checkout validation & order creation
    const checkoutRes = await CheckoutService.processCheckout({
      userId: '00000000-0000-0000-0000-000000000001',
      userEmail: 'customer@flexgear.test',
      items: [
        {
          equipmentId: '30000000-0000-0000-0000-000000000001', // Sony FX3
          quantity: 1,
          dailyPrice: 4000,
          securityDeposit: 16000,
        },
      ],
      startDate: '2026-10-15',
      endDate: '2026-10-18',
      deliveryMode: 'PICKUP',
      notes: 'Indie music video shoot',
    });

    expect(checkoutRes.rental).toBeDefined();
    expect(checkoutRes.rental.id).toBeDefined();
    expect(checkoutRes.rental.status).toBe('PENDING_PAYMENT');
    expect(checkoutRes.paymentIntentId).toBeDefined();

    const rentalId = checkoutRes.rental.id;

    // 2. Admin prepares and hands over gear to DP (ACTIVE state)
    const activeRental = await RentalModel.updateStatus(rentalId, 'ACTIVE');
    expect(activeRental?.status).toBe('ACTIVE');

    // 3. Customer completes shoot and returns equipment to warehouse
    const returnedRental = await RentalModel.updateStatus(rentalId, 'RETURNED');
    expect(returnedRental?.status).toBe('RETURNED');

    // 4. Warehouse technician performs multi-point return QC inspection
    const inspection = await InspectionService.submitInspection({
      rentalId: rentalId,
      inspectorId: '00000000-0000-0000-0000-000000000002',
      hasDamage: false,
      damageFee: 0,
      conditionNotes: 'Pristine return. Sensor zero dust, XLR handle and cables returned complete.',
      photoUrls: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
    });
    expect(inspection.id).toBeDefined();
    expect(inspection.has_damage).toBe(false);

    // 5. Admin releases security deposit escrow via Stripe Refund
    const depositRelease = await DepositService.refundDeposit({
      rentalId: rentalId,
      deductedAmount: 0,
      deductionReason: 'Pristine condition return',
    });
    expect(depositRelease?.status).toBe('FULL_REFUND');
    expect(depositRelease?.deducted_amount).toBe(0);

    // 6. Check that order status was completed
    const completedRental = await RentalModel.findById(rentalId);
    expect(completedRental?.status).toBe('COMPLETED');
  });
});
