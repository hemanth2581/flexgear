// backend/src/routes/user.routes.ts
import { Router, Request, Response } from 'express';
import { UserModel } from '../models/User';
import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const users = await UserModel.getAll();
  return sendSuccess(res, users);
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const user = await UserModel.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, error: { message: 'User not found' } });
  }
  return sendSuccess(res, user);
});

router.patch('/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const updatedUser = await UserModel.update(id, req.body);
  return sendSuccess(res, updatedUser, 'User updated successfully');
});

export default router;
