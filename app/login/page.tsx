'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Sparkles } from 'lucide-react';
import { FirebaseOtpLoginForm } from '@/components/auth/FirebaseOtpLoginForm';

export default function LoginPage() {
  return (
    <div className="bg-cinema-bg min-h-screen py-16 text-cinema-text">
      <div className="mx-auto max-w-md px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 text-accent font-bold shadow-cinema-glow">
            <Camera className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-cinema-text font-heading">
            FlexGear Sign In
          </h1>
          <p className="text-xs text-cinema-text-secondary">
            Authenticate securely via instant Phone OTP or production credentials.
          </p>
        </div>

        {/* Unified Firebase OTP & Password Form */}
        <FirebaseOtpLoginForm onSuccessRedirect="/account" />

        {/* Footer info */}
        <div className="text-center text-xs text-cinema-text-muted">
          New to FlexGear?{' '}
          <Link href="/signup" className="text-accent font-bold hover:underline">
            Create an Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
