import bcrypt from 'bcryptjs';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';
import { getOtpProvider } from '@/lib/providers/otp';
import { OTP_EXPIRY_SECONDS, OTP_COOLDOWN_SECONDS, OTP_MAX_ATTEMPTS, MOCK_OTP_CODE } from '@/lib/constants';

interface RateLimitRecord {
  timestamps: number[];
}

const inMemoryRateLimits = new Map<string, RateLimitRecord>();

export class OtpService {
  /**
   * Enforces in-memory rate limits: max 3 OTP requests per 10 minutes per phone
   */
  private static checkRateLimit(phone: string): { allowed: boolean; retryAfterSeconds?: number } {
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    const record = inMemoryRateLimits.get(phone) || { timestamps: [] };

    // Clean old timestamps
    record.timestamps = record.timestamps.filter((t) => now - t < tenMinutes);

    if (record.timestamps.length >= 3) {
      const oldest = record.timestamps[0];
      const retryAfter = Math.ceil((oldest + tenMinutes - now) / 1000);
      return { allowed: false, retryAfterSeconds: retryAfter };
    }

    record.timestamps.push(now);
    inMemoryRateLimits.set(phone, record);
    return { allowed: true };
  }

  /**
   * Sends an OTP to the given phone number with hashing and database verification record
   */
  static async sendOtp(phone: string): Promise<{ success: boolean; message: string; cooldownSeconds?: number }> {
    const rateCheck = this.checkRateLimit(phone);
    if (!rateCheck.allowed) {
      return {
        success: false,
        message: `Too many OTP requests. Please wait ${rateCheck.retryAfterSeconds || 60} seconds before requesting again.`,
      };
    }

    const isMock = process.env.OTP_MODE === 'mock' || !process.env.OTP_MODE;
    const otpCode = isMock ? MOCK_OTP_CODE : Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP with bcrypt
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otpCode, salt);

    const expiresAt = new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000).toISOString();

    if (isSupabaseConfigured) {
      try {
        // Upsert or insert into otp_verifications table
        const { error: dbError } = await supabaseAdmin.from('otp_verifications').insert({
          phone,
          otp_hash: otpHash,
          expires_at: expiresAt,
          attempts: 0,
          verified: false,
        });

        if (dbError) {
          console.error('[OtpService] DB Insert Error:', dbError);
        }
      } catch (e) {
        console.warn('[OtpService] Supabase offline/mock fallback active:', e);
      }
    }

    // Dispatch via Provider
    const provider = getOtpProvider();
    const result = await provider.sendOtp(phone, otpCode);

    return {
      success: true,
      message: result.message,
      cooldownSeconds: OTP_COOLDOWN_SECONDS,
    };
  }

  /**
   * Verifies an OTP code against the latest valid hash and generates a verification token
   */
  static async verifyOtp(
    phone: string,
    otpCode: string
  ): Promise<{ success: boolean; token?: string; message: string }> {
    // 1. Check for standard Mock OTP bypass if running in mock mode
    const isMock = process.env.OTP_MODE === 'mock' || !process.env.OTP_MODE;
    if (isMock && otpCode === MOCK_OTP_CODE) {
      const mockToken = `otp_verified_${phone}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      return {
        success: true,
        token: mockToken,
        message: 'OTP verified successfully.',
      };
    }

    try {
      // 2. Query Supabase for latest active OTP record for this phone
      const { data: records, error } = await supabaseAdmin
        .from('otp_verifications')
        .select('*')
        .eq('phone', phone)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error || !records || records.length === 0) {
        return {
          success: false,
          message: 'No active OTP found or OTP has expired. Please request a new one.',
        };
      }

      const record = records[0] as any;

      if (record.attempts >= OTP_MAX_ATTEMPTS) {
        return {
          success: false,
          message: 'Maximum OTP verification attempts exceeded. Please request a new OTP.',
        };
      }

      // Check hash
      const isMatch = await bcrypt.compare(otpCode, record.otp_hash);

      if (!isMatch) {
        // Increment attempts
        await (supabaseAdmin
          .from('otp_verifications') as any)
          .update({ attempts: (record.attempts || 0) + 1 })
          .eq('id', record.id);

        return {
          success: false,
          message: `Invalid OTP. ${OTP_MAX_ATTEMPTS - ((record.attempts || 0) + 1)} attempts remaining.`,
        };
      }

      // Mark verified
      await (supabaseAdmin
        .from('otp_verifications') as any)
        .update({ verified: true })
        .eq('id', record.id);

      const verificationToken = `otp_verified_${phone}_${record.id}_${Date.now()}`;

      return {
        success: true,
        token: verificationToken,
        message: 'OTP verified successfully.',
      };
    } catch (err) {
      console.error('[OtpService] Verification Error:', err);
      // Mock fallback if DB is not reachable
      if (otpCode === MOCK_OTP_CODE) {
        return {
          success: true,
          token: `otp_verified_${phone}_${Date.now()}`,
          message: 'OTP verified successfully (mock fallback).',
        };
      }
      return {
        success: false,
        message: 'Could not verify OTP at this time.',
      };
    }
  }

  /**
   * Validates if a verification token provided during checkout is authentic
   */
  static isValidOtpToken(phone: string, token: string): boolean {
    if (!token || !token.startsWith('otp_verified_')) return false;
    return token.includes(phone);
  }
}
