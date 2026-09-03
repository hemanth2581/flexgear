// backend/src/controllers/payment.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { PaymentService } from '../services/payment.service';
import { PaymentModel } from '../models/Payment';
import { sendSuccess, sendError } from '../utils/response';

export class PaymentController {
  static async createIntent(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 401);
      const { rentalId } = req.body;
      const result = await PaymentService.createIntentForRental(rentalId, req.user.email);
      return sendSuccess(res, result);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to create payment intent', 400);
    }
  }

  static async getHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const history = await PaymentModel.getAll();
      return sendSuccess(res, history);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch payments', 500);
    }
  }

  static async refund(req: AuthenticatedRequest, res: Response) {
    try {
      const { rentalId, amount, reason } = req.body;
      const refund = await PaymentService.processRefund(rentalId, amount, reason);
      return sendSuccess(res, refund, 'Refund issued successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Refund failed', 400);
    }
  }
}
