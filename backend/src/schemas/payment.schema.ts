// backend/src/schemas/payment.schema.ts
import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  rentalId: z.string().uuid('Valid rental UUID is required'),
});

export const refundPaymentSchema = z.object({
  rentalId: z.string().uuid(),
  amount: z.number().positive(),
  reason: z.string().optional(),
});
