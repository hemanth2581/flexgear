// backend/src/routes/equipment.routes.ts
import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { createEquipmentSchema } from '../schemas/equipment.schema';

const router = Router();

// Public catalog listing with filtering
router.get('/', EquipmentController.getAll);

// Public equipment detail by ID or Slug
router.get('/:id', EquipmentController.getById);

// Admin-only create gear
router.post('/', requireAuth, requireAdmin, validateBody(createEquipmentSchema), EquipmentController.create);

export default router;
