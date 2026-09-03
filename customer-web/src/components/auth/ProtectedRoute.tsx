'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../ui/Loading';

export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requireAdmin?: boolean;
}> = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (requireAdmin && user.role !== 'ADMIN') {
        router.push('/equipment');
      }
    }
  }, [user, isLoading, requireAdmin, router]);

  if (isLoading) {
    return <Loading message="Authenticating session..." />;
  }

  if (!user || (requireAdmin && user.role !== 'ADMIN')) {
    return null;
  }

  return <>{children}</>;
};
