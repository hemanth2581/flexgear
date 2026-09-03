// customer-web/src/services/auth.service.ts
import { apiClient } from '../lib/api';
import { User, AuthResponse } from '../types/user';
import { supabase } from '../lib/supabase';

export interface RequestOtpResponse {
  success: boolean;
  isDevelopment: boolean;
  devOtp?: string;
  message: string;
}

export class AuthService {
  /**
   * Request Phone OTP via backend / Supabase
   */
  static async requestOtp(phone: string): Promise<RequestOtpResponse> {
    // Try backend API first
    try {
      return await apiClient<RequestOtpResponse>('/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
    } catch (err) {
      // Direct Supabase OTP fallback if configured
      try {
        const { error } = await supabase.auth.signInWithOtp({ phone });
        if (error) throw error;
        return {
          success: true,
          isDevelopment: false,
          message: `Verification code dispatched to ${phone}`,
        };
      } catch (sbErr: any) {
        throw new Error(sbErr.message || 'Failed to request verification code');
      }
    }
  }

  /**
   * Verify Phone OTP
   */
  static async verifyOtp(params: {
    phone: string;
    otp: string;
    fullName?: string;
    email?: string;
  }): Promise<AuthResponse> {
    return await apiClient<AuthResponse>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Verify Supabase Session Token
   */
  static async verifySessionToken(token: string): Promise<AuthResponse> {
    return await apiClient<AuthResponse>('/auth/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  static async getMe(token?: string): Promise<User> {
    return await apiClient<User>('/auth/me', { token });
  }

  static async logout(): Promise<void> {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
      await supabase.auth.signOut();
    } catch (_) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('flexgear_token');
      localStorage.removeItem('flexgear_user');
    }
  }
}
