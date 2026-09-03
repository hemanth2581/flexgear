// backend/src/schemas/checkout.schema.ts
import { z } from 'zod';

export const checkoutItemSchema = z.object({
  equipmentId: z.string().uuid(),
  quantity: z.number().int().positive(),
  dailyPrice: z.number().positive(),
  weeklyPrice: z.number().positive().optional().nullable(),
  securityDeposit: z.number().min(0),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, 'At least 1 item is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  deliveryMode: z.enum(['PICKUP', 'DELIVERY']),
  deliveryAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    street: z.string().min(3),
    landmark: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(5),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).optional(),
  notes: z.string().optional(),
});
