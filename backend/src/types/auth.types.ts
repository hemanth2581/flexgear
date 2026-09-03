// backend/src/types/auth.types.ts
import { Request } from 'express';

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'STAFF' | 'WAREHOUSE_MANAGER' | 'FINANCE';

export interface UserPayload {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  role: UserRole;
  firebaseUid?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}
