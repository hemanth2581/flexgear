// backend/src/routes/location.routes.ts
import { Router, Request, Response } from 'express';
import { LocationModel } from '../models/Location';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const locations = await LocationModel.getAll();
  return sendSuccess(res, locations);
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const location = await LocationModel.findById(id);
  if (!location) {
    return res.status(404).json({ success: false, error: { message: 'Location not found' } });
  }
  return sendSuccess(res, location);
});

router.post('/', async (req: Request, res: Response) => {
  const newLocation = await LocationModel.create(req.body);
  return sendSuccess(res, newLocation, 'Location created successfully');
});

export default router;
