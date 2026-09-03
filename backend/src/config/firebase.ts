// backend/src/config/firebase.ts
import * as admin from 'firebase-admin';
import { ENV } from './environment';
import { logger } from '../utils/logger';

let firebaseApp: admin.app.App | null = null;

try {
  if (ENV.FIREBASE.PROJECT_ID && ENV.FIREBASE.CLIENT_EMAIL && ENV.FIREBASE.PRIVATE_KEY) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: ENV.FIREBASE.PROJECT_ID,
        clientEmail: ENV.FIREBASE.CLIENT_EMAIL,
        privateKey: ENV.FIREBASE.PRIVATE_KEY,
      }),
    });
    logger.info('Firebase Admin SDK initialized successfully.');
  } else {
    logger.info('Firebase Admin credentials not fully provided. Mock/Development Auth mode active.');
  }
} catch (error) {
  logger.warn('Firebase Admin SDK initialization failed, falling back to mock verification.', error);
}

export const getFirebaseAuth = () => {
  if (firebaseApp) {
    return admin.auth(firebaseApp);
  }
  return null;
};

export const isFirebaseInitialized = () => firebaseApp !== null;
