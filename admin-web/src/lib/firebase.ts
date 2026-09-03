// admin-web/src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAZpdY1KwV5TLeRlfgYUfXYj1fnV1Kv2HE',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'flex-gear-9d899.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'flex-gear-9d899',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'flex-gear-9d899.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '867340600012',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:867340600012:web:ebd2c6ea07ce8dc84a7869',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export const getOrInitRecaptcha = (containerId: string = 'recaptcha-container'): RecaptchaVerifier | null => {
  if (typeof window === 'undefined') return null;

  try {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          console.warn('reCAPTCHA expired');
        },
      });
    }
    return window.recaptchaVerifier;
  } catch (err) {
    console.error('Error initializing RecaptchaVerifier in admin-web:', err);
    return null;
  }
};

export const sendPhoneOtp = async (phoneNumber: string, appVerifier: any): Promise<ConfirmationResult> => {
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};
