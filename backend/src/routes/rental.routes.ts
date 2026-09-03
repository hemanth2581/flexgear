// backend/src/routes/rental.routes.ts
import { Router } from 'express';
import { RentalController } from '../controllers/rental.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { updateRentalStatusSchema } from '../schemas/rental.schema';

const router = Router();

// Customer views own rental orders
router.get('/', requireAuth, RentalController.getMyRentals);

// Single rental details by ID
router.get('/:id', requireAuth, RentalController.getById);

// Customer initiates equipment return request
router.post('/:id/return', requireAuth, RentalController.requestReturn);

// Admin or Staff updates rental status (e.g. CONFIRMED -> READY_FOR_PICKUP -> ACTIVE)
router.patch('/:id/status', requireAuth, requireAdmin, validateBody(updateRentalStatusSchema), RentalController.updateStatus);

export default router;
