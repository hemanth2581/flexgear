'use client';

import React from 'react';
import Link from 'next/link';
import { Camera } from 'lucide-react';
import { FirebaseOtpLoginForm } from '@/components/auth/FirebaseOtpLoginForm';

export default function LoginPage() {
  return (
    <div className="bg-[#f3f3f3] min-h-screen py-12 text-gray-900">
      <div className="mx-auto max-w-md px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-lenstiger text-white font-bold shadow-sm">
            <Camera className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 headingbold">FlexGear Client Sign In</h1>
          <p className="text-xs text-gray-500">
            Authenticate securely via Firebase OTP or account credentials.
          </p>
        </div>

        {/* Unified Firebase OTP & Password Form */}
        <FirebaseOtpLoginForm onSuccessRedirect="/account" />

        {/* Footer info */}
        <div className="text-center text-xs text-gray-500">
          New to FlexGear?{' '}
          <Link href="/signup" className="text-lenstiger font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
