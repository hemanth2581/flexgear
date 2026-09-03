'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/user';
import { AuthService, RequestOtpResponse } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  requestPhoneOtp: (phone: string) => Promise<RequestOtpResponse>;
  verifyPhoneOtp: (params: { phone: string; otp: string; fullName?: string; email?: string }) => Promise<{ user: User; token: string }>;
  loginWithEmailPassword: (email: string, password: string) => Promise<{ user: User; token: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('flexgear_token');
        const savedUser = localStorage.getItem('flexgear_user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));

          // Validate token with server
          AuthService.getMe(savedToken)
            .then((freshUser) => {
              if (freshUser) {
                setUser(freshUser);
                localStorage.setItem('flexgear_user', JSON.stringify(freshUser));
              }
            })
            .catch(() => {
              // Token expired, clear invalid session
              logout();
            });
        }
      } catch (e) {
        console.error('Failed to restore authentication session:', e);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const requestPhoneOtp = async (phone: string): Promise<RequestOtpResponse> => {
    return await AuthService.requestOtp(phone);
  };

  const verifyPhoneOtp = async (params: {
    phone: string;
    otp: string;
    fullName?: string;
    email?: string;
  }): Promise<{ user: User; token: string }> => {
    setIsLoading(true);
    try {
      const res = await AuthService.verifyOtp(params);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('flexgear_token', res.token);
      localStorage.setItem('flexgear_user', JSON.stringify(res.user));
      return { user: res.user, token: res.token };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmailPassword = async (
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      // Use phone OTP as primary, or verify token
      const res = await AuthService.verifySessionToken(`fg_pwd_${btoa(cleanEmail)}`);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('flexgear_token', res.token);
      localStorage.setItem('flexgear_user', JSON.stringify(res.user));
      return { user: res.user, token: res.token };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('flexgear_token');
    localStorage.removeItem('flexgear_user');
    try {
      await AuthService.logout();
    } catch (_) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        requestPhoneOtp,
        verifyPhoneOtp,
        loginWithEmailPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
