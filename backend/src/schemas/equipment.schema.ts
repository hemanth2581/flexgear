// backend/src/schemas/equipment.schema.ts
import { z } from 'zod';

export const createEquipmentSchema = z.object({
  categoryId: z.string().uuid('Valid category UUID is required'),
  brand: z.string().min(1, 'Brand is required'),
  name: z.string().min(2, 'Name is required'),
  model: z.string().optional(),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(10, 'Detailed description is required'),
  dailyPrice: z.number().positive('Daily price must be > 0'),
  weeklyPrice: z.number().positive().optional().nullable(),
  monthlyPrice: z.number().positive().optional().nullable(),
  securityDeposit: z.number().min(0, 'Security deposit cannot be negative'),
  replacementValue: z.number().positive('Replacement value is required'),
  thumbnailUrl: z.string().url('Thumbnail URL is required'),
  isFeatured: z.boolean().optional().default(false),
  specs: z.record(z.any()).optional().default({}),
  includedAccessories: z.array(z.string()).optional().default([]),
});

export const updateEquipmentSchema = createEquipmentSchema.partial();
