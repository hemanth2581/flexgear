// backend/src/controllers/availability.controller.ts
import { Request, Response } from 'express';
import { AvailabilityService } from '../services/availability.service';
import { sendSuccess, sendError } from '../utils/response';

export class AvailabilityController {
  static async check(req: Request, res: Response) {
    try {
      const { equipmentId, startDate, endDate, quantity = 1 } = req.body;
      const result = await AvailabilityService.checkAvailability(
        equipmentId,
        startDate,
        endDate,
        quantity
      );
      return sendSuccess(res, result);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to check inventory availability', 400);
    }
  }
}
