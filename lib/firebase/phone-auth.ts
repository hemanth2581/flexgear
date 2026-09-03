import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  UserCredential,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from './client';

/**
 * Standardizes a phone number to E.164 international format (e.g. +919876543210)
 */
export function formatE164(phone: string, countryCode = '+91'): string {
  const cleanNumber = phone.replace(/\D/g, '');
  const cleanCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;

  if (phone.startsWith('+')) {
    return `+${cleanNumber}`;
  }

  // If already contains country code prefix without + (e.g. 919876543210 with 12 digits)
  if (cleanNumber.length > 10 && cleanNumber.startsWith(cleanCode.replace('+', ''))) {
    return `+${cleanNumber}`;
  }

  return `${cleanCode}${cleanNumber}`;
}

/**
 * Creates and initializes a RecaptchaVerifier on the specified container element.
 */
export function createRecaptchaVerifier(
  containerId: string,
  options?: {
    size?: 'invisible' | 'normal' | 'compact';
    callback?: (response: any) => void;
    'expired-callback'?: () => void;
  }
): RecaptchaVerifier {
  const auth = getFirebaseAuth();

  // Clear any previous window-level verifier on this container to avoid duplicate render error
  if (typeof window !== 'undefined' && (window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch (e) {
      // ignore
    }
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: options?.size || 'invisible',
    callback: (response: any) => {
      if (options?.callback) options.callback(response);
    },
    'expired-callback': () => {
      console.warn('[Firebase Recaptcha] Token expired. Resetting verifier.');
      if (options?.['expired-callback']) options['expired-callback']();
    },
  });

  if (typeof window !== 'undefined') {
    (window as any).recaptchaVerifier = verifier;
  }

  return verifier;
}

/**
 * Triggers Firebase to send an SMS OTP to the phone number.
 */
export async function sendFirebaseOtp(
  phoneNumberE164: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const auth = getFirebaseAuth();
  return await signInWithPhoneNumber(auth, phoneNumberE164, appVerifier);
}

/**
 * Confirms the 6-digit OTP code against the Firebase ConfirmationResult.
 */
export async function confirmFirebaseOtp(
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<UserCredential> {
  return await confirmationResult.confirm(otpCode);
}

/**
 * Signs out current user from Firebase Auth.
 */
export async function signOutFirebase(): Promise<void> {
  const auth = getFirebaseAuth();
  await firebaseSignOut(auth);
}

/**
 * Maps Firebase Auth error codes to user-friendly messages.
 */
export function getFirebaseErrorMessage(error: any): string {
  const code = error?.code || '';
  const message = error?.message || '';

  switch (code) {
    case 'auth/invalid-phone-number':
      return 'The phone number is invalid. Please check the country code and digits.';
    case 'auth/missing-phone-number':
      return 'Please provide a valid phone number.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded for this Firebase project. Try using a test phone number configured in Firebase Console.';
    case 'auth/captcha-check-failed':
      return 'reCAPTCHA verification failed. Please try again or refresh the page.';
    case 'auth/invalid-verification-code':
      return 'Invalid OTP verification code. Please check the 6-digit code and try again.';
    case 'auth/code-expired':
      return 'The OTP has expired. Please request a new verification code.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Access to this account has been temporarily disabled. Please try again later.';
    case 'auth/user-disabled':
      return 'This user account has been disabled by the administrator.';
    case 'auth/operation-not-allowed':
      return 'Phone authentication is not enabled in the Firebase Console. Go to Authentication > Sign-in method > Phone to enable it.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/app-not-authorized':
      return 'Domain not authorized in Firebase Console. Add your domain (e.g. localhost) in Firebase Auth > Settings > Authorized domains.';
    default:
      if (message.includes('reCAPTCHA')) {
        return 'reCAPTCHA check failed. Please refresh and try again.';
      }
      return message || 'An error occurred during authentication. Please try again.';
  }
}
