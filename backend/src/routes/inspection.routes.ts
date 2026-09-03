// backend/src/routes/inspection.routes.ts
import { Router } from 'express';
import { InspectionController } from '../controllers/inspection.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { createInspectionSchema } from '../schemas/inspection.schema';

const router = Router();

router.get('/', requireAuth, requireAdmin, InspectionController.getAll);
router.post('/', requireAuth, requireAdmin, validateBody(createInspectionSchema), InspectionController.create);
router.get('/:rentalId', requireAuth, InspectionController.getByRental);

export default router;
