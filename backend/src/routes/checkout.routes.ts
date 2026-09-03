// backend/src/routes/checkout.routes.ts
import { Router } from 'express';
import { CheckoutController } from '../controllers/checkout.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { checkoutSchema } from '../schemas/checkout.schema';

const router = Router();

router.post('/', requireAuth, validateBody(checkoutSchema), CheckoutController.checkout);

export default router;
