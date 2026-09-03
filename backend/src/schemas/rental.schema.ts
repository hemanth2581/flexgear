// backend/src/schemas/rental.schema.ts
import { z } from 'zod';

export const updateRentalStatusSchema = z.object({
  status: z.enum([
    'PENDING_PAYMENT',
    'CONFIRMED',
    'READY_FOR_PICKUP',
    'PICKED_UP',
    'ACTIVE',
    'RETURN_DUE',
    'RETURN_PENDING',
    'UNDER_INSPECTION',
    'OVERDUE',
    'COMPLETED',
    'CANCELLED',
  ]),
  notes: z.string().optional(),
});

export const availabilityQuerySchema = z.object({
  equipmentId: z.string().uuid('Valid equipment UUID required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  quantity: z.coerce.number().int().positive().default(1),
});
