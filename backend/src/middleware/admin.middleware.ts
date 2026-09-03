// backend/src/middleware/admin.middleware.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { sendError } from '../utils/response';

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return sendError(res, 'Authentication required', 401);
  }

  if (req.user.role !== 'ADMIN') {
    return sendError(res, 'Access denied. Administrator privileges required.', 403);
  }

  next();
};
