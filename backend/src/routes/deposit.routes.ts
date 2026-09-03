// backend/src/routes/deposit.routes.ts
import { Router } from 'express';
import { DepositController } from '../controllers/deposit.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { processDepositRefundSchema } from '../schemas/deposit.schema';

const router = Router();

router.get('/', requireAuth, requireAdmin, DepositController.getAll);
router.post('/refund', requireAuth, requireAdmin, validateBody(processDepositRefundSchema), DepositController.refund);

export default router;
