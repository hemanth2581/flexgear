// backend/src/services/deposit.service.ts
import { DepositModel } from '../models/Deposit';
import { StripeRefundService } from '../integrations/stripe/refunds';
import { NotificationModel } from '../models/Notification';
import { RentalModel } from '../models/Rental';

export class DepositService {
  static async getDepositByRental(rentalId: string) {
    return await DepositModel.findByRentalId(rentalId);
  }

  static async refundDeposit(params: {
    rentalId: string;
    deductedAmount: number;
    deductionReason?: string;
  }) {
    const deposit = await DepositModel.findByRentalId(params.rentalId);
    if (!deposit) throw new Error('Security deposit record not found for this rental.');

    const refundAmount = Math.max(0, deposit.held_amount - params.deductedAmount);

    let stripeRefundId = 'mock_re_12345';
    if (refundAmount > 0) {
      const stripeRes = await StripeRefundService.createRefund({
        amount: refundAmount,
        reason: 'requested_by_customer',
        metadata: { rentalId: params.rentalId, type: 'SECURITY_DEPOSIT_REFUND' },
      });
      stripeRefundId = stripeRes.refundId;
    }

    const updatedDeposit = await DepositModel.processRefund(
      params.rentalId,
      params.deductedAmount,
      params.deductionReason,
      stripeRefundId
    );

    // Update rental status to COMPLETED
    await RentalModel.updateStatus(params.rentalId, 'COMPLETED');

    // Notify customer
    await NotificationModel.create({
      user_id: deposit.user_id,
      title: 'Security Deposit Processed',
      message: params.deductedAmount > 0
        ? `₹${refundAmount} refunded. ₹${params.deductedAmount} was deducted (${params.deductionReason || 'Damage/Late fee'}).`
        : `Full ₹${refundAmount} security deposit has been refunded to your payment method.`,
      type: 'DEPOSIT_REFUND',
      link_url: `/rentals/${params.rentalId}`,
    });

    return updatedDeposit;
  }
}
