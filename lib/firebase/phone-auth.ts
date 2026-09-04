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

  // 1. Check for SMS Region Policy restriction in the error message or payload
  if (
    message.includes('SMS unable to be sent until this region enabled') ||
    message.includes('SMS Region Policy') ||
    message.includes('region enabled by the app developer')
  ) {
    return 'Firebase SMS Region Policy: SMS delivery to India (+91) / this region is not enabled yet. In Firebase Console, go to Authentication > Settings > SMS Region Policy and enable India (+91) or your region.';
  }

  switch (code) {
    case 'auth/invalid-phone-number':
      return 'The phone number is invalid. Please check the country code (+91) and 10-digit number.';
    case 'auth/missing-phone-number':
      return 'Please provide a valid 10-digit phone number.';
    case 'auth/quota-exceeded':
      return 'Firebase SMS quota reached. You can also configure instant test phone numbers in Firebase Console > Sign-in method > Phone.';
    case 'auth/captcha-check-failed':
      return 'reCAPTCHA verification failed. Please refresh the page and try again.';
    case 'auth/invalid-verification-code':
      return 'Invalid OTP verification code. Please check the 6-digit code and try again.';
    case 'auth/code-expired':
      return 'The OTP verification code has expired. Please request a new code.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Access from this device has been temporarily rate-limited. Please wait a moment and try again.';
    case 'auth/user-disabled':
      return 'This user account has been disabled by the administrator.';
    case 'auth/operation-not-allowed':
      if (message.includes('region') || message.includes('SMS')) {
        return 'Firebase SMS Region Policy: SMS delivery to India (+91) is not enabled. In Firebase Console, go to Authentication > Settings > SMS Region Policy and add India (+91).';
      }
      return 'Phone authentication or SMS region is not enabled in Firebase Console. Go to Authentication > Sign-in method > Phone and verify Phone is enabled and SMS Region Policy allows India (+91).';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/app-not-authorized':
    case 'auth/unauthorized-domain':
      return 'Domain not authorized in Firebase Console. Add "flexgear-rental.vercel.app" in Firebase Console > Authentication > Settings > Authorized domains.';
    default:
      if (message.includes('reCAPTCHA')) {
        return 'reCAPTCHA security check failed. Please refresh and try again.';
      }
      return message || 'An unexpected authentication error occurred. Please try again.';
  }
}
