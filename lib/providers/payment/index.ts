import { IPaymentProvider } from './types';
import { MockPaymentProvider } from './mock-payment-provider';

export * from './types';
export * from './mock-payment-provider';

let cachedPaymentProvider: IPaymentProvider | null = null;

export function getPaymentProvider(): IPaymentProvider {
  if (cachedPaymentProvider) return cachedPaymentProvider;

  const mode = process.env.PAYMENT_MODE || 'mock';
  switch (mode.toLowerCase()) {
    case 'mock':
    default:
      cachedPaymentProvider = new MockPaymentProvider();
      return cachedPaymentProvider;
  }
}
