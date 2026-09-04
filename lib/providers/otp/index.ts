import { IOtpProvider } from './types';
import { MockOtpProvider } from './mock-otp-provider';
import { TwilioOtpProvider } from './twilio-otp-provider';
import { Fast2SmsOtpProvider } from './fast2sms-otp-provider';

export * from './types';
export * from './mock-otp-provider';
export * from './twilio-otp-provider';
export * from './fast2sms-otp-provider';

let cachedOtpProvider: IOtpProvider | null = null;

export function getOtpProvider(): IOtpProvider {
  if (cachedOtpProvider) return cachedOtpProvider;

  const mode = (process.env.OTP_MODE || process.env.SMS_PROVIDER || '').toLowerCase();

  if (mode === 'twilio' || process.env.TWILIO_ACCOUNT_SID) {
    cachedOtpProvider = new TwilioOtpProvider();
    return cachedOtpProvider;
  }

  if (mode === 'fast2sms' || process.env.FAST2SMS_API_KEY) {
    cachedOtpProvider = new Fast2SmsOtpProvider();
    return cachedOtpProvider;
  }

  cachedOtpProvider = new MockOtpProvider();
  return cachedOtpProvider;
}
