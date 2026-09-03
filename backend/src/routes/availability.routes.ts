// backend/src/routes/availability.routes.ts
import { Router } from 'express';
import { AvailabilityController } from '../controllers/availability.controller';
import { validateBody } from '../middleware/validation.middleware';
import { availabilityQuerySchema } from '../schemas/rental.schema';

const router = Router();

router.post('/', validateBody(availabilityQuerySchema), AvailabilityController.check);

export default router;
