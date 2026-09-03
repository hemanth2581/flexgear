// backend/src/integrations/stripe/subscriptions.ts
import { getStripe } from '../../config/stripe';
import { logger } from '../../utils/logger';

export class StripeSubscriptionService {
  static async createCustomer(email: string, name: string) {
    const stripe = getStripe();
    if (!stripe) {
      return { id: `cus_mock_${Date.now()}` };
    }
    return await stripe.customers.create({ email, name });
  }

  static async cancelSubscription(subscriptionId: string) {
    const stripe = getStripe();
    if (!stripe) {
      return { id: subscriptionId, status: 'canceled' };
    }
    return await stripe.subscriptions.cancel(subscriptionId);
  }
}
