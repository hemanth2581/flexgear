import { IOtpProvider, SendOtpResult } from './types';
import { MOCK_OTP_CODE } from '@/lib/constants';

export class MockOtpProvider implements IOtpProvider {
  async sendOtp(phone: string, otp: string): Promise<SendOtpResult> {
    const isMock = process.env.OTP_MODE === 'mock' || !process.env.OTP_MODE;
    const finalOtp = isMock ? MOCK_OTP_CODE : otp;

    console.log(`\n======================================================`);
    console.log(`[MOCK OTP SERVICE] Verification Code Dispatch`);
    console.log(`Recipient Phone : +91 ${phone}`);
    console.log(`OTP Code        : ${finalOtp}`);
    console.log(`Mode            : ${process.env.OTP_MODE || 'mock'}`);
    console.log(`Valid Duration  : 5 Minutes (Fixed demo code: ${MOCK_OTP_CODE})`);
    console.log(`======================================================\n`);

    return {
      success: true,
      message: `OTP sent successfully to +91 ${phone}. (Mock OTP: ${finalOtp})`,
      cooldownSeconds: 30,
    };
  }
}
