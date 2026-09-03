// backend/src/integrations/sms/index.ts
import { logger } from '../../utils/logger';

export interface ISmsProvider {
  name: string;
  sendOtp(phone: string, otp: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

/**
 * Development & Local Testing SMS Provider
 * Active when OTP_MODE=development
 */
export class DevelopmentSmsProvider implements ISmsProvider {
  name = 'development-mock';

  async sendOtp(phone: string, otp: string) {
    logger.info(`[SMS DEV-MODE] 📱 Sending OTP ${otp} to phone ${phone}`);
    return {
      success: true,
      messageId: `dev-msg-${Date.now()}`,
    };
  }
}

/**
 * Twilio SMS Provider
 */
export class TwilioSmsProvider implements ISmsProvider {
  name = 'twilio';
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';
  }

  async sendOtp(phone: string, otp: string) {
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      throw new Error('Twilio credentials not configured (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)');
    }
    try {
      // Direct REST API call to Twilio Message endpoint
      const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: phone,
            From: this.fromNumber,
            Body: `Your FlexGear verification code is: ${otp}. Valid for 10 minutes.`,
          }),
        }
      );
      const data: any = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || 'Twilio SMS dispatch failed' };
      }
      return { success: true, messageId: data.sid };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

/**
 * TextLocal SMS Provider (DLT Compliant for India)
 */
export class TextLocalSmsProvider implements ISmsProvider {
  name = 'textlocal';
  private apiKey: string;
  private sender: string;

  constructor() {
    this.apiKey = process.env.TEXTLOCAL_API_KEY || '';
    this.sender = process.env.TEXTLOCAL_SENDER || 'FLXGAR';
  }

  async sendOtp(phone: string, otp: string) {
    if (!this.apiKey) {
      throw new Error('TextLocal API key not configured (TEXTLOCAL_API_KEY)');
    }
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const response = await fetch('https://api.textlocal.in/send/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          apikey: this.apiKey,
          numbers: cleanPhone,
          sender: this.sender,
          message: `Your FlexGear Cinema verification code is ${otp}. Valid for 10 minutes.`,
        }),
      });
      const data: any = await response.json();
      if (data.status !== 'success') {
        return { success: false, error: data.errors?.[0]?.message || 'TextLocal delivery failed' };
      }
      return { success: true, messageId: data.batch_id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

/**
 * Provider Factory
 */
export const getSmsProvider = (): ISmsProvider => {
  const mode = process.env.OTP_MODE || 'development';
  const provider = process.env.SMS_PROVIDER || 'mock';

  if (mode === 'development' || provider === 'mock' || provider === 'development') {
    return new DevelopmentSmsProvider();
  }

  switch (provider.toLowerCase()) {
    case 'twilio':
      return new TwilioSmsProvider();
    case 'textlocal':
      return new TextLocalSmsProvider();
    default:
      return new DevelopmentSmsProvider();
  }
};
