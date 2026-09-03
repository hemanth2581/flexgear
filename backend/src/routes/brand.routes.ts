// backend/src/routes/brand.routes.ts
import { Router, Request, Response } from 'express';
import { BrandModel } from '../models/Brand';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const brands = await BrandModel.getAll();
  return sendSuccess(res, brands);
});

router.get('/:slug', async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const brand = await BrandModel.findBySlug(slug);
  if (!brand) {
    return res.status(404).json({ success: false, error: { message: 'Brand not found' } });
  }
  return sendSuccess(res, brand);
});

router.post('/', async (req: Request, res: Response) => {
  const newBrand = await BrandModel.create(req.body);
  return sendSuccess(res, newBrand, 'Brand created successfully');
});

export default router;
