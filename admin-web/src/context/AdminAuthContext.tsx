'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApiClient } from '../lib/api';
import { supabase } from '../lib/supabase';

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  phone?: string;
  role: 'ADMIN' | 'SUPER_ADMIN' | 'STAFF' | 'WAREHOUSE_MANAGER';
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  requestPhoneOtp: (phone: string) => Promise<{ success: boolean; isDevelopment: boolean; devOtp?: string; message: string }>;
  verifyPhoneOtp: (phone: string, otp: string) => Promise<void>;
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('flexgear_admin_token');
    const storedAdmin = localStorage.getItem('flexgear_admin_user');

    if (storedToken) {
      setToken(storedToken);
      if (storedAdmin) {
        try {
          setAdmin(JSON.parse(storedAdmin));
        } catch (_) {}
      }

      adminApiClient('/auth/me', { token: storedToken })
        .then((userData) => {
          if (userData && (userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN' || userData.role === 'STAFF')) {
            setAdmin(userData);
            localStorage.setItem('flexgear_admin_user', JSON.stringify(userData));
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const requestPhoneOtp = async (phone: string) => {
    return await adminApiClient('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  };

  const verifyPhoneOtp = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      const response = await adminApiClient('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });

      const user = response.user || response.profile;
      if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'STAFF')) {
        throw new Error('Access denied: This phone number is not registered with Administrator privileges.');
      }

      setAdmin(user);
      setToken(response.token);
      localStorage.setItem('flexgear_admin_token', response.token);
      localStorage.setItem('flexgear_admin_user', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmailPassword = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // First authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw new Error(error.message);
      }

      const sessionToken = data.session?.access_token;
      if (!sessionToken) {
        throw new Error('Authentication session token missing.');
      }

      // Verify role with backend
      const response = await adminApiClient('/auth/verify-token', {
        method: 'POST',
        body: JSON.stringify({ token: sessionToken }),
      });

      const user = response.user;
      if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'STAFF')) {
        await supabase.auth.signOut();
        throw new Error('Access denied: Your account is not authorized for the Admin Studio.');
      }

      setAdmin(user);
      setToken(response.token || sessionToken);
      localStorage.setItem('flexgear_admin_token', response.token || sessionToken);
      localStorage.setItem('flexgear_admin_user', JSON.stringify(user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('flexgear_admin_token');
    localStorage.removeItem('flexgear_admin_user');
    supabase.auth.signOut().catch(() => {});
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isLoading,
        requestPhoneOtp,
        verifyPhoneOtp,
        loginWithEmailPassword,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};
