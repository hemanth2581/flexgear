// backend/src/config/stripe.ts
import Stripe from 'stripe';
import { ENV } from './environment';
import { logger } from '../utils/logger';

let stripeClient: Stripe | null = null;

if (ENV.STRIPE.SECRET_KEY && !ENV.STRIPE.SECRET_KEY.includes('mock')) {
  try {
    stripeClient = new Stripe(ENV.STRIPE.SECRET_KEY, {
      apiVersion: '2025-01-27.acacia' as any,
      typescript: true,
    });
    logger.info('Stripe SDK initialized with live/test secret key.');
  } catch (error) {
    logger.warn('Stripe SDK initialization failed. Fallback to mock Stripe service active.', error);
  }
} else {
  logger.info('Using Mock Stripe Provider for local development & automated testing.');
}

export const getStripe = () => stripeClient;
export const isStripeActive = () => stripeClient !== null;
