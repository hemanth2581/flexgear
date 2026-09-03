// backend/src/controllers/inspection.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { InspectionService } from '../services/inspection.service';
import { InspectionModel } from '../models/Inspection';
import { sendSuccess, sendError } from '../utils/response';

export class InspectionController {
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { rentalId, hasDamage, damageDescription, damageFee, conditionNotes, photoUrls } = req.body;
      const inspection = await InspectionService.submitInspection({
        rentalId,
        inspectorId: req.user?.id,
        hasDamage,
        damageDescription,
        damageFee: parseFloat(damageFee) || 0,
        conditionNotes,
        photoUrls,
      });

      return sendSuccess(res, inspection, 'Return inspection report logged successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to submit inspection', 400);
    }
  }

  static async getByRental(req: AuthenticatedRequest, res: Response) {
    try {
      const rentalId = req.params.rentalId as string;
      const inspection = await InspectionService.getInspectionByRental(rentalId);
      return sendSuccess(res, inspection);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch inspection report', 500);
    }
  }

  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const list = await InspectionModel.getAll();
      return sendSuccess(res, list);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch inspections', 500);
    }
  }
}
