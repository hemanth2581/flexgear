// backend/src/integrations/stripe/refunds.ts
import { getStripe } from '../../config/stripe';
import { logger } from '../../utils/logger';

export class StripeRefundService {
  static async createRefund(params: {
    paymentIntentId?: string;
    amount: number; // in INR rupees
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
    metadata?: Record<string, string>;
  }): Promise<{ refundId: string; status: string }> {
    const stripe = getStripe();

    if (!stripe || !params.paymentIntentId || params.paymentIntentId.startsWith('pi_mock')) {
      const mockRefundId = `re_mock_${Date.now()}`;
      return { refundId: mockRefundId, status: 'succeeded' };
    }

    try {
      const refund = await stripe.refunds.create({
        payment_intent: params.paymentIntentId,
        amount: Math.round(params.amount * 100),
        reason: params.reason || 'requested_by_customer',
        metadata: params.metadata,
      });

      return {
        refundId: refund.id,
        status: refund.status || 'succeeded',
      };
    } catch (error) {
      logger.error('Stripe Refund execution failed', error);
      throw error;
    }
  }
}
