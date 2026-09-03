// backend/src/routes/damage.routes.ts
import { Router, Request, Response } from 'express';
import { DamageReportModel } from '../models/DamageReport';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const rentalId = req.query.rental_id as string;
  if (rentalId) {
    const reports = await DamageReportModel.findByRentalId(rentalId);
    return sendSuccess(res, reports);
  }
  const reports = await DamageReportModel.getAll();
  return sendSuccess(res, reports);
});

router.post('/', async (req: Request, res: Response) => {
  const newReport = await DamageReportModel.create(req.body);
  return sendSuccess(res, newReport, 'Damage report recorded successfully');
});

export default router;
