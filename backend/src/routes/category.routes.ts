// backend/src/routes/category.routes.ts
import { Router, Request, Response } from 'express';
import { CategoryModel } from '../models/Category';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const categories = await CategoryModel.getAll();
  return sendSuccess(res, categories);
});

router.get('/:slug', async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const category = await CategoryModel.findBySlug(slug);
  return sendSuccess(res, category);
});

export default router;
