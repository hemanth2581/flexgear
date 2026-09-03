// backend/src/integrations/stripe/payment-intents.ts
import { getStripe } from '../../config/stripe';
import { logger } from '../../utils/logger';

export class StripePaymentIntentService {
  static async createIntent(params: {
    amount: number; // in INR rupees
    rentalId: string;
    customerEmail: string;
    metadata?: Record<string, string>;
  }): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const stripe = getStripe();

    if (!stripe) {
      // Mock payment intent for local testing
      const mockId = `pi_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return {
        paymentIntentId: mockId,
        clientSecret: `${mockId}_secret_mock`,
      };
    }

    try {
      const amountInPaise = Math.round(params.amount * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPaise,
        currency: 'inr',
        automatic_payment_methods: { enabled: true },
        metadata: {
          rentalId: params.rentalId,
          customerEmail: params.customerEmail,
          ...(params.metadata || {}),
        },
      });

      return {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret || '',
      };
    } catch (error) {
      logger.error('Stripe PaymentIntent creation failed', error);
      throw error;
    }
  }

  static async retrieveIntent(paymentIntentId: string) {
    const stripe = getStripe();
    if (!stripe) {
      return { id: paymentIntentId, status: 'succeeded', amount: 3547000 };
    }
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  }
}
