import { IOtpProvider } from './types';
import { MockOtpProvider } from './mock-otp-provider';

export * from './types';
export * from './mock-otp-provider';

let cachedOtpProvider: IOtpProvider | null = null;

export function getOtpProvider(): IOtpProvider {
  if (cachedOtpProvider) return cachedOtpProvider;

  const mode = process.env.OTP_MODE || 'mock';
  switch (mode.toLowerCase()) {
    case 'mock':
    default:
      cachedOtpProvider = new MockOtpProvider();
      return cachedOtpProvider;
  }
}
