// backend/src/integrations/stripe/webhooks.ts
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getStripe } from '../../config/stripe';
import { ENV } from '../../config/environment';
import { logger } from '../../utils/logger';
import { RentalModel } from '../../models/Rental';
import { PaymentModel } from '../../models/Payment';
import { DepositModel } from '../../models/Deposit';

export class StripeWebhookHandler {
  static async handleWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];
    const stripe = getStripe();

    let event: Stripe.Event;

    if (stripe && sig && ENV.STRIPE.WEBHOOK_SECRET) {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE.WEBHOOK_SECRET);
      } catch (err: any) {
        logger.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      // Mock event in development
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }

    logger.info(`Received Stripe Webhook event: ${event?.type}`);

    try {
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const rentalId = paymentIntent.metadata?.rentalId;

          if (rentalId) {
            await RentalModel.updateStatus(rentalId, 'CONFIRMED');
            await PaymentModel.updateStatus(paymentIntent.id, 'SUCCEEDED');
            logger.info(`Rental ${rentalId} confirmed via PaymentIntent ${paymentIntent.id}`);
          }
          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const rentalId = paymentIntent.metadata?.rentalId;
          if (rentalId) {
            await RentalModel.updateStatus(rentalId, 'PENDING_PAYMENT');
            await PaymentModel.updateStatus(paymentIntent.id, 'FAILED');
            logger.warn(`Payment failed for Rental ${rentalId}`);
          }
          break;
        }

        case 'charge.refunded': {
          const charge = event.data.object as Stripe.Charge;
          logger.info(`Refund succeeded for charge ${charge.id}`);
          break;
        }

        default:
          logger.debug(`Unhandled webhook event type: ${event.type}`);
      }

      return res.status(200).json({ received: true });
    } catch (err: any) {
      logger.error('Error processing Stripe webhook', err);
      return res.status(500).json({ error: 'Webhook handler failed' });
    }
  }
}
