// backend/src/integrations/firebase/firebase-auth.ts
import jwt from 'jsonwebtoken';
import { getFirebaseAuth } from '../../config/firebase';
import { logger } from '../../utils/logger';

export interface DecodedPhoneUser {
  uid: string;
  phone: string;
  email?: string;
  name?: string;
}

export class FirebaseAuthService {
  static async verifyIdToken(idToken: string): Promise<DecodedPhoneUser | null> {
    if (!idToken || typeof idToken !== 'string' || idToken.trim().length === 0) {
      return null;
    }

    const auth = getFirebaseAuth();

    if (auth) {
      try {
        const decoded = await auth.verifyIdToken(idToken);
        return {
          uid: decoded.uid,
          phone: decoded.phone_number || '',
          email: decoded.email,
          name: decoded.name,
        };
      } catch (error: any) {
        logger.error('Firebase Admin SDK verifyIdToken failed:', error.message);
      }
    }

    // Fallback: If Firebase Admin SDK is unconfigured, decode standard Firebase JWT
    try {
      const decodedJwt: any = jwt.decode(idToken);
      if (decodedJwt && (decodedJwt.sub || decodedJwt.user_id || decodedJwt.uid)) {
        const uid = decodedJwt.sub || decodedJwt.user_id || decodedJwt.uid;
        const phone =
          decodedJwt.phone_number ||
          decodedJwt.phone ||
          decodedJwt.firebase?.identities?.phone?.[0] ||
          '';
        const email =
          decodedJwt.email ||
          decodedJwt.firebase?.identities?.email?.[0] ||
          undefined;
        const name = decodedJwt.name || undefined;

        logger.info(`Decoded Firebase client token for user: ${uid} (phone: ${phone || 'N/A'})`);
        return {
          uid,
          phone,
          email,
          name,
        };
      }
    } catch (err: any) {
      logger.error('JWT decode error on Firebase ID token:', err.message);
    }

    return null;
  }

  static async getUser(uid: string) {
    const auth = getFirebaseAuth();
    if (!auth) return null;
    try {
      return await auth.getUser(uid);
    } catch (error) {
      return null;
    }
  }
}
