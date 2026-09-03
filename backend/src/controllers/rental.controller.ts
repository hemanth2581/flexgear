// backend/src/controllers/rental.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { RentalService } from '../services/rental.service';
import { sendSuccess, sendError } from '../utils/response';

export class RentalController {
  static async getMyRentals(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthenticated', 401);
      const rentals = await RentalService.getRentalsByUser(req.user.id);
      return sendSuccess(res, rentals);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch rentals', 500);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const rental = await RentalService.getRentalById(id);
      if (!rental) return sendError(res, 'Rental order not found', 404);

      // Verify ownership unless admin
      if (req.user?.role !== 'ADMIN' && req.user?.id !== rental.user_id) {
        return sendError(res, 'Unauthorized to view this rental', 403);
      }

      return sendSuccess(res, rental);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve rental details', 500);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const { status, notes } = req.body;
      const updated = await RentalService.updateStatus(id, status, notes);
      if (!updated) return sendError(res, 'Rental not found', 404);
      return sendSuccess(res, updated, 'Rental status updated');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update rental status', 500);
    }
  }

  static async requestReturn(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const updated = await RentalService.updateStatus(id, 'RETURN_PENDING', 'Customer marked equipment as returned/ready for handover');
      return sendSuccess(res, updated, 'Return request initiated. Equipment ready for inspection.');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to process return request', 500);
    }
  }
}
