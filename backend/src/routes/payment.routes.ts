// backend/src/routes/payment.routes.ts
import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { StripeWebhookHandler } from '../integrations/stripe/webhooks';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { createPaymentIntentSchema, refundPaymentSchema } from '../schemas/payment.schema';

const router = Router();

// Create Stripe PaymentIntent for a pending rental
router.post('/create-payment-intent', requireAuth, validateBody(createPaymentIntentSchema), PaymentController.createIntent);

// Payment history
router.get('/history', requireAuth, PaymentController.getHistory);

// Admin refunds
router.post('/refund', requireAuth, requireAdmin, validateBody(refundPaymentSchema), PaymentController.refund);

// Stripe Webhook Endpoint (raw body handled in app.ts)
router.post('/webhook', StripeWebhookHandler.handleWebhook);

export default router;
