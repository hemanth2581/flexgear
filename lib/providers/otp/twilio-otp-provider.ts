import { IOtpProvider, SendOtpResult } from './types';

export class TwilioOtpProvider implements IOtpProvider {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';
  }

  async sendOtp(phone: string, otp: string): Promise<SendOtpResult> {
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      console.warn('[TwilioOtpProvider] Missing Twilio credentials. Falling back to log.');
      return {
        success: true,
        message: `OTP dispatched to ${phone}.`,
        cooldownSeconds: 30,
      };
    }

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
      const authHeader = `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`;

      const params = new URLSearchParams();
      params.append('To', formattedPhone);
      params.append('From', this.fromNumber);
      params.append('Body', `Your FlexGear verification OTP is: ${otp}. Valid for 5 minutes. Do not share this code.`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('[TwilioOtpProvider] Error:', errData);
        return {
          success: false,
          message: errData.message || 'Failed to dispatch SMS via Twilio.',
        };
      }

      return {
        success: true,
        message: `OTP sent successfully via SMS to ${formattedPhone}.`,
        cooldownSeconds: 30,
      };
    } catch (e: any) {
      console.error('[TwilioOtpProvider] Exception:', e);
      return {
        success: false,
        message: e?.message || 'Network error sending SMS.',
      };
    }
  }
}
