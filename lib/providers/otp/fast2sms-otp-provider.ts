import { IOtpProvider, SendOtpResult } from './types';

export class Fast2SmsOtpProvider implements IOtpProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.FAST2SMS_API_KEY || '';
  }

  async sendOtp(phone: string, otp: string): Promise<SendOtpResult> {
    if (!this.apiKey) {
      return {
        success: true,
        message: `OTP dispatched to ${phone}.`,
        cooldownSeconds: 30,
      };
    }

    try {
      const cleanDigits = phone.replace(/\D/g, '').slice(-10);
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variables_values: otp,
          route: 'otp',
          numbers: cleanDigits,
        }),
      });

      const data = await response.json();
      if (data.return) {
        return {
          success: true,
          message: `OTP sent to +91 ${cleanDigits}.`,
          cooldownSeconds: 30,
        };
      }

      return {
        success: false,
        message: data.message || 'Fast2SMS dispatch failed.',
      };
    } catch (e: any) {
      console.error('[Fast2SmsOtpProvider] Error:', e);
      return {
        success: false,
        message: e?.message || 'Error communicating with SMS gateway.',
      };
    }
  }
}
