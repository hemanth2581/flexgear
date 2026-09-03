// backend/src/routes/blog.routes.ts
import { Router, Request, Response } from 'express';
import { BlogModel } from '../models/Blog';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const posts = await BlogModel.getAll();
  return sendSuccess(res, posts);
});

router.get('/:slug', async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const post = await BlogModel.findBySlug(slug);
  if (!post) {
    return res.status(404).json({ success: false, error: { message: 'Blog article not found' } });
  }
  return sendSuccess(res, post);
});

router.post('/', async (req: Request, res: Response) => {
  const newPost = await BlogModel.create(req.body);
  return sendSuccess(res, newPost, 'Article published successfully');
});

export default router;
