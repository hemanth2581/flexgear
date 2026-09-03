// backend/src/services/otp.service.ts
import crypto from 'crypto';
import { getSmsProvider } from '../integrations/sms';
import { logger } from '../utils/logger';

interface OtpEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

const otpStore = new Map<string, OtpEntry>();

export class OtpService {
  /**
   * Send or resend OTP to a given phone number
   */
  static async sendOtp(phone: string): Promise<{ success: boolean; isDevelopment: boolean; devOtp?: string; message: string }> {
    const cleanPhone = phone.trim();
    const isDevelopment = (process.env.OTP_MODE || 'development') === 'development';
    const now = Date.now();

    // Rate Limiting & Cooldown (30 seconds)
    const existing = otpStore.get(cleanPhone);
    if (existing && now - existing.lastSentAt < 30000) {
      const waitSec = Math.ceil((30000 - (now - existing.lastSentAt)) / 1000);
      throw new Error(`Please wait ${waitSec} seconds before requesting a new verification code.`);
    }

    // Generate 6 digit code
    const otp = isDevelopment && !process.env.RANDOMIZE_DEV_OTP
      ? '884422'
      : crypto.randomInt(100000, 999999).toString();

    const expiresAt = now + 10 * 60 * 1000; // 10 minutes

    otpStore.set(cleanPhone, {
      otp,
      expiresAt,
      attempts: 0,
      lastSentAt: now,
    });

    const smsProvider = getSmsProvider();
    const result = await smsProvider.sendOtp(cleanPhone, otp);

    if (!result.success) {
      logger.error(`Failed to send SMS OTP to ${cleanPhone}: ${result.error}`);
      throw new Error(result.error || 'Failed to dispatch SMS verification code.');
    }

    logger.info(`[AUTH OTP] Dispatched code to ${cleanPhone} via ${smsProvider.name}`);

    return {
      success: true,
      isDevelopment,
      devOtp: isDevelopment ? otp : undefined,
      message: isDevelopment
        ? `Development OTP Mode active. Code: ${otp}`
        : `Verification code sent to ${cleanPhone}.`,
    };
  }

  /**
   * Verify an entered OTP
   */
  static async verifyOtp(phone: string, enteredOtp: string): Promise<{ success: boolean }> {
    const cleanPhone = phone.trim();
    const entry = otpStore.get(cleanPhone);
    const now = Date.now();

    // Check entry
    if (!entry) {
      // Also allow default dev OTP if in development mode
      if ((process.env.OTP_MODE || 'development') === 'development' && enteredOtp === '884422') {
        return { success: true };
      }
      throw new Error('No active verification code found for this phone number. Please request a new code.');
    }

    // Check expiration
    if (now > entry.expiresAt) {
      otpStore.delete(cleanPhone);
      throw new Error('Verification code has expired. Please request a new code.');
    }

    // Check attempts limit (max 5)
    if (entry.attempts >= 5) {
      otpStore.delete(cleanPhone);
      throw new Error('Too many failed attempts. Please request a new verification code.');
    }

    // Validate
    if (entry.otp !== enteredOtp.trim()) {
      entry.attempts += 1;
      throw new Error('Incorrect verification code. Please try again.');
    }

    // Consume OTP on success
    otpStore.delete(cleanPhone);
    return { success: true };
  }
}
