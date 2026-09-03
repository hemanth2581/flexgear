// backend/src/routes/cart.routes.ts
import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { requireAuth } from '../middleware/auth.middleware';
import { sendSuccess } from '../utils/response';

const router = Router();

// Server-side Cart Sync endpoint (client can mirror local storage or DB)
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  return sendSuccess(res, { items: [] });
});

export default router;
