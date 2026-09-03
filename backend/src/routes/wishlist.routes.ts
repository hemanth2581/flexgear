// backend/src/routes/wishlist.routes.ts
import { Router } from 'express';
import { WishlistController } from '../controllers/wishlist.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, WishlistController.getMyWishlist);
router.post('/', requireAuth, WishlistController.add);
router.delete('/:equipmentId', requireAuth, WishlistController.remove);

export default router;
