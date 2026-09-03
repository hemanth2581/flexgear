// backend/tests/unit/deposit.test.ts
import { describe, it, expect } from 'vitest';
import { DepositService } from '../../src/services/deposit.service';
import { DepositModel } from '../../src/models/Deposit';

describe('Security Deposit & Refund Service', () => {
  it('should process full refund when no damages are recorded', async () => {
    const rentalId = 'rent-test-deposit-01';
    await DepositModel.create({
      rental_id: rentalId,
      user_id: 'usr-01',
      held_amount: 16000,
    });

    const result = await DepositService.refundDeposit({
      rentalId,
      deductedAmount: 0,
    });

    expect(result?.status).toBe('FULL_REFUND');
    expect(result?.refunded_amount).toBe(16000);
    expect(result?.deducted_amount).toBe(0);
  });

  it('should process partial refund with damage deduction', async () => {
    const rentalId = 'rent-test-deposit-02';
    await DepositModel.create({
      rental_id: rentalId,
      user_id: 'usr-01',
      held_amount: 20000,
    });

    const result = await DepositService.refundDeposit({
      rentalId,
      deductedAmount: 3000,
      deductionReason: 'Lens front element scratch',
    });

    expect(result?.status).toBe('PARTIAL_REFUND');
    expect(result?.refunded_amount).toBe(17000);
    expect(result?.deducted_amount).toBe(3000);
  });
});
