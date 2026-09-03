// backend/src/services/payment.service.ts
import { PaymentModel } from '../models/Payment';
import { RentalModel } from '../models/Rental';
import { StripePaymentIntentService } from '../integrations/stripe/payment-intents';
import { StripeRefundService } from '../integrations/stripe/refunds';

export class PaymentService {
  static async createIntentForRental(rentalId: string, customerEmail: string) {
    const rental = await RentalModel.findById(rentalId);
    if (!rental) throw new Error('Rental not found');

    const intent = await StripePaymentIntentService.createIntent({
      amount: rental.total_amount,
      rentalId: rental.id,
      customerEmail,
    });

    await PaymentModel.create({
      rental_id: rental.id,
      user_id: rental.user_id,
      stripe_payment_intent_id: intent.paymentIntentId,
      amount: rental.total_amount,
      status: 'PENDING',
    });

    return intent;
  }

  static async processRefund(rentalId: string, amount: number, reason?: string) {
    const rental = await RentalModel.findById(rentalId);
    if (!rental) throw new Error('Rental not found');

    const refund = await StripeRefundService.createRefund({
      amount,
      reason: 'requested_by_customer',
      metadata: { rentalId },
    });

    return refund;
  }
}
