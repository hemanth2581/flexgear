// backend/src/middleware/auth.middleware.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, UserPayload, UserRole } from '../types/auth.types';
import { ENV } from '../config/environment';
import { sendError } from '../utils/response';
import { UserModel } from '../models/User';
import { supabase } from '../lib/supabase';

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication token required (Bearer <token>)', 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return sendError(res, 'Invalid authentication token header', 401);
  }

  // 1. App JWT Token Verification
  try {
    const decoded = jwt.verify(token, ENV.JWT.SECRET) as UserPayload;
    if (decoded && decoded.id) {
      // Re-verify user is still active in database
      const user = await UserModel.findById(decoded.id);
      if (user && user.is_active !== false) {
        req.user = {
          id: user.id,
          email: user.email,
          phone: user.phone || undefined,
          fullName: user.full_name,
          role: user.role,
        };
        return next();
      }
    }
  } catch (_) {
    // If not standard App JWT, attempt Supabase Auth JWT verification
  }

  // 2. Supabase Auth JWT Verification
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (!error && data?.user) {
      const sbUser = data.user;
      let user = await UserModel.findById(sbUser.id);
      if (!user && sbUser.email) {
        user = await UserModel.findByEmail(sbUser.email);
      }
      if (!user && sbUser.phone) {
        user = await UserModel.findByPhone(sbUser.phone);
      }

      if (!user) {
        user = await UserModel.create({
          email: sbUser.email || `${sbUser.id}@flexgear.film`,
          phone: sbUser.phone || undefined,
          full_name: sbUser.user_metadata?.full_name || 'Verified Filmmaker',
          role: (sbUser.user_metadata?.role as UserRole) || 'CUSTOMER',
        });
      }

      req.user = {
        id: user.id,
        email: user.email,
        phone: user.phone || undefined,
        fullName: user.full_name,
        role: user.role,
      };
      return next();
    }
  } catch (_) {
    // Token failed both App JWT and Supabase Auth
  }

  return sendError(res, 'Invalid or expired authentication session. Please log in again.', 401);
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return sendError(res, 'Authentication required', 401);
  }

  const allowedRoles: UserRole[] = ['ADMIN', 'SUPER_ADMIN', 'WAREHOUSE_MANAGER', 'STAFF', 'FINANCE'];
  if (!allowedRoles.includes(req.user.role)) {
    return sendError(res, 'Access denied: Admin privileges required.', 403);
  }

  return next();
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, `Access denied: Requires one of [${roles.join(', ')}] role`, 403);
    }

    return next();
  };
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  return requireAuth(req, res, next);
};
