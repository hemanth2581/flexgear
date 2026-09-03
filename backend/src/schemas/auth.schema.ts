// backend/src/schemas/auth.schema.ts
import { z } from 'zod';

export const firebaseVerifySchema = z.object({
  idToken: z.string().min(10).optional(),
  id_token: z.string().min(10).optional(),
  firebase_uid: z.string().optional(),
  phone: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().email().optional(),
}).refine(data => Boolean(data.idToken || data.id_token), {
  message: 'Firebase ID Token is required',
  path: ['idToken'],
});

export const loginSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  avatarUrl: z.string().url().optional(),
});
