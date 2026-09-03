// backend/src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Unhandled Error caught by middleware:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err.name === 'ZodError') {
    return sendError(res, 'Validation error', 422, err.errors);
  }

  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return sendError(res, err.message || 'Unauthorized access', 401);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, statusCode);
};
