// backend/src/schemas/deposit.schema.ts
import { z } from 'zod';

export const processDepositRefundSchema = z.object({
  rentalId: z.string().uuid(),
  deductedAmount: z.number().min(0).default(0),
  deductionReason: z.string().optional(),
});
