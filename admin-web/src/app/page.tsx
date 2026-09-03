'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Loading } from '../components/ui/Loading';

export default function AdminIndexPage() {
  const router = useRouter();
  const { admin, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading) {
      if (admin && admin.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [admin, isLoading, router]);

  return <Loading message="Redirecting to Admin Studio..." />;
}
