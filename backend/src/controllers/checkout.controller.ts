// backend/src/controllers/checkout.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { CheckoutService } from '../services/checkout.service';
import { sendSuccess, sendError } from '../utils/response';

export class CheckoutController {
  static async checkout(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Authentication required for checkout', 401);
      }

      const { items, startDate, endDate, deliveryMode, deliveryAddress, notes } = req.body;

      const result = await CheckoutService.processCheckout({
        userId: req.user.id,
        userEmail: req.user.email,
        items,
        startDate,
        endDate,
        deliveryMode,
        deliveryAddress,
        notes,
      });

      return sendSuccess(res, result, 'Rental booking created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Checkout failed', 400);
    }
  }
}
