// backend/src/routes/review.routes.ts
import { Router, Request, Response } from 'express';
import { ReviewModel } from '../models/Review';
import { requireAuth } from '../middleware/auth.middleware';
import { AuthenticatedRequest } from '../types/auth.types';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

router.get('/:equipmentId', async (req: Request, res: Response) => {
  const equipmentId = req.params.equipmentId as string;
  const reviews = await ReviewModel.getByEquipmentId(equipmentId);
  return sendSuccess(res, reviews);
});

router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthenticated', 401);
    const { equipmentId, rating, comment, title } = req.body;
    const review = await ReviewModel.create({
      user_id: req.user.id,
      equipment_id: equipmentId,
      rating: parseInt(rating, 10),
      comment,
      title,
      user_name: req.user.fullName,
    });
    return sendSuccess(res, review, 'Review submitted successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to submit review', 400);
  }
});

export default router;
