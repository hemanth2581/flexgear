'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminSidebar } from '../../components/navigation/AdminSidebar';
import { AdminHeader } from '../../components/navigation/AdminHeader';
import { Loading } from '../../components/ui/Loading';

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!admin || admin.role !== 'ADMIN') {
        router.push('/login');
      }
    }
  }, [admin, isLoading, router]);

  if (isLoading) {
    return <Loading message="Authenticating administrator session..." />;
  }

  if (!admin || admin.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-cinema-black text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
