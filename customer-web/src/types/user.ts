// frontend/src/types/user.ts
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  email: string;
  phone?: string | null;
  full_name: string;
  role: UserRole;
  avatar_url?: string | null;
  firebase_uid?: string | null;
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
