// backend/src/controllers/auth.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { UserModel } from '../models/User';

export class AuthController {
  /**
   * Request Phone OTP
   */
  static async requestOtp(req: AuthenticatedRequest, res: Response) {
    try {
      const phone = req.body.phone;
      if (!phone) {
        return sendError(res, 'Phone number is required.', 400);
      }
      const result = await AuthService.requestPhoneOtp(phone);
      return res.status(200).json({
        success: true,
        isDevelopment: result.isDevelopment,
        devOtp: result.devOtp,
        message: result.message,
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to send verification code.', 400);
    }
  }

  /**
   * Verify Phone OTP
   */
  static async verifyOtp(req: AuthenticatedRequest, res: Response) {
    try {
      const { phone, otp, fullName, email } = req.body;
      if (!phone || !otp) {
        return sendError(res, 'Phone number and verification OTP code are required.', 400);
      }
      const result = await AuthService.verifyPhoneOtp({
        phone,
        otp,
        fullName,
        email,
      });

      return res.status(200).json({
        success: true,
        user: result.user,
        profile: result.user,
        token: result.token,
        isNewUser: result.isNewUser,
        message: 'Phone verified successfully.',
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Invalid or expired OTP code.', 400);
    }
  }

  /**
   * Verify Supabase Session Token
   */
  static async verifyToken(req: AuthenticatedRequest, res: Response) {
    try {
      const token = req.body.token || req.body.accessToken;
      if (!token) {
        return sendError(res, 'Authentication token is required.', 400);
      }
      const result = await AuthService.verifySupabaseToken(token);
      return res.status(200).json({
        success: true,
        user: result.user,
        profile: result.user,
        token: result.token,
        message: 'Authentication session verified.',
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Authentication verification failed.', 401);
    }
  }

  /**
   * Get Current Authenticated User Profile
   */
  static async getMe(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthenticated', 401);
    }
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User profile not found', 404);
    }
    return sendSuccess(res, user);
  }

  /**
   * Logout
   */
  static async logout(req: AuthenticatedRequest, res: Response) {
    return sendSuccess(res, null, 'Logged out successfully');
  }
}
