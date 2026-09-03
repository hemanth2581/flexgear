// backend/src/services/refund.service.ts
import { StripeRefundService } from '../integrations/stripe/refunds';

export class RefundService {
  static async issueRefund(params: {
    paymentIntentId?: string;
    amount: number;
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
    metadata?: Record<string, string>;
  }) {
    return await StripeRefundService.createRefund(params);
  }
}
