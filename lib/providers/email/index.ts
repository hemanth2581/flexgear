import { IEmailProvider } from './types';
import { MockEmailProvider } from './mock-email-provider';

export * from './types';
export * from './mock-email-provider';

let cachedEmailProvider: IEmailProvider | null = null;

export function getEmailProvider(): IEmailProvider {
  if (cachedEmailProvider) return cachedEmailProvider;

  const mode = process.env.EMAIL_MODE || 'mock';
  switch (mode.toLowerCase()) {
    case 'mock':
    default:
      cachedEmailProvider = new MockEmailProvider();
      return cachedEmailProvider;
  }
}
