// backend/src/routes/invoice.routes.ts
import { Router, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { AuthenticatedRequest } from '../types/auth.types';
import { InvoiceService } from '../services/invoice.service';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

router.get('/:rentalId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rentalId = req.params.rentalId as string;
    const invoice = await InvoiceService.getInvoiceByRental(rentalId);
    if (!invoice) return sendError(res, 'Invoice not found', 404);
    return sendSuccess(res, invoice);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch invoice', 500);
  }
});

export default router;
