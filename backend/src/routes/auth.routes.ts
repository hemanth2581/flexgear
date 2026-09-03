// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Phone OTP Endpoints
router.post('/otp/send', authRateLimiter, AuthController.requestOtp);
router.post('/otp/verify', authRateLimiter, AuthController.verifyOtp);

// Supabase / JWT Session Endpoints
router.post('/verify-token', authRateLimiter, AuthController.verifyToken);
router.post('/session', authRateLimiter, AuthController.verifyToken);
router.post('/phone-login', authRateLimiter, AuthController.verifyOtp); // Compatibility alias

// User Profile & Status
router.get('/me', requireAuth, AuthController.getMe);
router.post('/logout', requireAuth, AuthController.logout);

export default router;
