// backend/src/routes/notification.routes.ts
import { Router, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { AuthenticatedRequest } from '../types/auth.types';
import { NotificationService } from '../services/notification.service';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthenticated', 401);
    const notifications = await NotificationService.getUserNotifications(req.user.id);
    return sendSuccess(res, notifications);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch notifications', 500);
  }
});

router.patch('/:id/read', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await NotificationService.markNotificationRead(id);
    return sendSuccess(res, null, 'Notification marked as read');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update notification', 500);
  }
});

export default router;
