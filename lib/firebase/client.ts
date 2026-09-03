import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAZpdY1KwV5TLeRlfgYUfXYj1fnV1Kv2HE',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'flex-gear-9d899.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'flex-gear-9d899',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'flex-gear-9d899.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '867340600012',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:867340600012:web:ebd2c6ea07ce8dc84a7869',
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your-firebase-api-key' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'your-firebase-project-id'
  );
}

export function getFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    // Server context
    if (getApps().length === 0) {
      return initializeApp(firebaseConfig);
    }
    return getApp();
  }

  // Client context
  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const currentApp = getFirebaseApp();
    auth = getAuth(currentApp);
    // Set language code if appropriate (default is user's browser language)
    auth.useDeviceLanguage();
  }
  return auth;
}

export { firebaseConfig };
