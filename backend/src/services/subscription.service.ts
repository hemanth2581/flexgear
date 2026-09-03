// backend/src/services/subscription.service.ts
import { StripeSubscriptionService } from '../integrations/stripe/subscriptions';

export class SubscriptionService {
  static async createCustomer(email: string, name: string) {
    return await StripeSubscriptionService.createCustomer(email, name);
  }

  static async cancelSubscription(subscriptionId: string) {
    return await StripeSubscriptionService.cancelSubscription(subscriptionId);
  }
}
