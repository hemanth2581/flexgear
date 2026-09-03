// backend/tests/unit/auth_integration.test.ts
import { describe, it, expect } from 'vitest';
import { OtpService } from '../../src/services/otp.service';
import { AuthService } from '../../src/services/auth.service';
import { UserModel } from '../../src/models/User';

describe('Authentication & Phone OTP Lifecycle', () => {
  it('should request and dispatch development OTP', async () => {
    const phone = '+919876543210';
    const res = await OtpService.sendOtp(phone);
    expect(res.success).toBe(true);
    expect(res.isDevelopment).toBe(true);
    expect(res.devOtp).toBeDefined();
  });

  it('should enforce cooldown if OTP requested repeatedly within 30 seconds', async () => {
    const phone = '+919988776655';
    await OtpService.sendOtp(phone);

    await expect(OtpService.sendOtp(phone)).rejects.toThrow(/Please wait/);
  });

  it('should verify correct OTP and create/sync user profile', async () => {
    const phone = '+919123456789';
    const otpRes = await OtpService.sendOtp(phone);
    const otp = otpRes.devOtp || '884422';

    const authResult = await AuthService.verifyPhoneOtp({
      phone,
      otp,
      fullName: 'Vikram Sethi (Cinematographer)',
    });

    expect(authResult.user).toBeDefined();
    expect(authResult.user.phone).toBe(phone);
    expect(authResult.user.full_name).toBe('Vikram Sethi (Cinematographer)');
    expect(authResult.user.role).toBe('CUSTOMER');
    expect(authResult.token).toBeDefined();

    // Verify user can be fetched from UserModel
    const dbUser = await UserModel.findById(authResult.user.id);
    expect(dbUser).not.toBeNull();
    expect(dbUser?.phone).toBe(phone);
  });

  it('should grant ADMIN role when verifying admin phone numbers', async () => {
    const phone = '+919865986598';
    const otpRes = await OtpService.sendOtp(phone);
    const otp = otpRes.devOtp || '884422';

    const authResult = await AuthService.verifyPhoneOtp({
      phone,
      otp,
    });

    expect(authResult.user).toBeDefined();
    expect(authResult.user.role).toBe('ADMIN');
  });
});
