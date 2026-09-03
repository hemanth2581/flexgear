// backend/src/schemas/inspection.schema.ts
import { z } from 'zod';

export const createInspectionSchema = z.object({
  rentalId: z.string().uuid(),
  hasDamage: z.boolean(),
  damageDescription: z.string().optional(),
  damageFee: z.number().min(0).default(0),
  conditionNotes: z.string().optional(),
  photoUrls: z.array(z.string()).optional().default([]),
});
