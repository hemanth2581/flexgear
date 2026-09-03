// backend/src/controllers/wishlist.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { WishlistModel } from '../models/Wishlist';
import { sendSuccess, sendError } from '../utils/response';

export class WishlistController {
  static async getMyWishlist(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 401);
      const list = await WishlistModel.getByUserId(req.user.id);
      return sendSuccess(res, list);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch wishlist', 500);
    }
  }

  static async add(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 401);
      const { equipmentId } = req.body;
      if (!equipmentId) return sendError(res, 'equipmentId is required', 400);

      const item = await WishlistModel.add(req.user.id, equipmentId);
      return sendSuccess(res, item, 'Item added to wishlist', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to add item to wishlist', 400);
    }
  }

  static async remove(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 401);
      const equipmentId = req.params.equipmentId as string;
      await WishlistModel.remove(req.user.id, equipmentId);
      return sendSuccess(res, null, 'Item removed from wishlist');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to remove wishlist item', 400);
    }
  }
}
