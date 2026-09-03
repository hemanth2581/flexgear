// backend/src/routes/refund.routes.ts
import { Router, Request, Response } from 'express';
import { RefundModel } from '../models/Refund';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const rentalId = req.query.rental_id as string;
  if (rentalId) {
    const refunds = await RefundModel.findByRentalId(rentalId);
    return sendSuccess(res, refunds);
  }
  const refunds = await RefundModel.getAll();
  return sendSuccess(res, refunds);
});

router.post('/', async (req: Request, res: Response) => {
  const newRefund = await RefundModel.create(req.body);
  return sendSuccess(res, newRefund, 'Stripe refund executed successfully');
});

export default router;
