// backend/src/controllers/deposit.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { DepositService } from '../services/deposit.service';
import { DepositModel } from '../models/Deposit';
import { sendSuccess, sendError } from '../utils/response';

export class DepositController {
  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const deposits = await DepositModel.getAll();
      return sendSuccess(res, deposits);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch deposits', 500);
    }
  }

  static async refund(req: AuthenticatedRequest, res: Response) {
    try {
      let rentalId = req.body.rentalId as string;
      const depositId = req.params.id as string;

      if (!rentalId && depositId) {
        const dep = await DepositModel.findById(depositId);
        if (dep) rentalId = dep.rental_id;
      }

      if (!rentalId && depositId) {
        rentalId = depositId;
      }

      const { deductedAmount, deductionReason } = req.body;
      const updated = await DepositService.refundDeposit({
        rentalId,
        deductedAmount: parseFloat(deductedAmount) || 0,
        deductionReason,
      });
      return sendSuccess(res, updated, 'Deposit processed and refunded successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Deposit processing failed', 400);
    }
  }
}
