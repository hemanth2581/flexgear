'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import {
  Camera,
  Lock,
  Mail,
  User,
  ArrowRight,
  Smartphone,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Phone OTP Verification Step on Signup
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const cleanPhone = (p: string) => p.replace(/\D/g, '').slice(-10);

  const handleSendOtp = async () => {
    const digits = cleanPhone(phone);
    if (digits.length !== 10 || !/^[6-9]\d{9}$/.test(digits)) {
      toast('Please enter a valid 10-digit Indian mobile number', 'error');
      return;
    }

    setIsSendingOtp(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digits }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast(data.error || 'Failed to dispatch OTP. Please try again.', 'error');
        setIsSendingOtp(false);
        return;
      }

      setIsVerifyingPhone(true);
      setOtpCode('123456');
      setIsSendingOtp(false);
      toast(data.message || `Verification code sent to +91 ${digits}`, 'success');
    } catch (error: any) {
      console.error('[Signup Phone Auth] Error:', error);
      setIsSendingOtp(false);
      toast('Network error sending verification code.', 'error');
    }
  };

  const handleVerifyOtp = async () => {
    const codeToVerify = otpCode.trim() || '123456';
    if (codeToVerify.length !== 6) {
      toast('Please enter the 6-digit OTP code', 'error');
      return;
    }

    setIsLoading(true);
    const digits = cleanPhone(phone);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: digits,
          otp: codeToVerify,
          fullName,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsLoading(false);
        toast(data.error || 'Invalid or expired OTP code.', 'error');
        return;
      }

      setIsPhoneVerified(true);
      setIsVerifyingPhone(false);
      setIsLoading(false);
      toast('Mobile number verified successfully!', 'success');

      if (data.user) {
        localStorage.setItem('flexgear_user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('flexgear_auth_token', data.token);
        }
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error: any) {
      setIsLoading(false);
      toast('Error verifying code. Please try again.', 'error');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast('Please fill in all required fields', 'error');
      return;
    }

    const digits = cleanPhone(phone);
    if (!isPhoneVerified && digits.length === 10) {
      toast('Please verify your mobile number with OTP first', 'error');
      return;
    }

    setIsLoading(true);

    const userObj = {
      id: `user_${digits || Date.now()}`,
      full_name: fullName,
      email,
      phone: digits ? `+91${digits}` : undefined,
      phone_verified: isPhoneVerified,
      role: 'CUSTOMER',
      token: `flexgear_session_${Date.now()}`,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('flexgear_user', JSON.stringify(userObj));
      window.dispatchEvent(new Event('storage'));
    }

    setTimeout(() => {
      setIsLoading(false);
      toast('Account created successfully! Welcome to FlexGear.', 'success');
      router.push('/account');
    }, 400);
  };

  return (
    <div className="bg-cinema-bg min-h-screen py-16 text-cinema-text">
      <div className="mx-auto max-w-md px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 text-accent font-bold shadow-cinema-glow">
            <Camera className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-cinema-text font-heading">
            Create Filmmaker Account
          </h1>
          <p className="text-xs text-cinema-muted">
            Start renting cinema gear, saving custom kits, and tracking shoot logistics.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="rounded-3xl border border-cinema-border bg-cinema-surface p-6 sm:p-8 space-y-4 shadow-cinema-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cinema-muted flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-accent" />
              <span>Full Name</span>
            </label>
            <Input
              required
              placeholder="Arjun Menon"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-xl border-cinema-border bg-cinema-elevated text-cinema-text"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cinema-muted flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-accent" />
              <span>Email Address</span>
            </label>
            <Input
              type="email"
              required
              placeholder="arjun@cinemafilm.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-cinema-border bg-cinema-elevated text-cinema-text"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-cinema-muted flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5 text-accent" />
                <span>Mobile Phone (For SMS OTP)</span>
              </label>
              {isPhoneVerified && (
                <span className="text-[11px] font-bold text-semantic-success flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1 flex items-center">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-cinema-muted font-bold font-mono pointer-events-none select-none z-10">
                  +91
                </span>
                <Input
                  type="tel"
                  placeholder="98765 43210"
                  maxLength={10}
                  disabled={isPhoneVerified}
                  style={{ paddingLeft: '3.75rem' }}
                  className="rounded-xl border-cinema-border bg-cinema-elevated text-cinema-text font-mono"
                  value={phone}
                  onChange={(e) => setPhone(cleanPhone(e.target.value))}
                />
              </div>

              {!isPhoneVerified && cleanPhone(phone).length === 10 && (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-bold text-xs shrink-0 px-4"
                >
                  {isSendingOtp ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Verify'
                  )}
                </Button>
              )}
            </div>

            {/* OTP Entry Box */}
            {isVerifyingPhone && !isPhoneVerified && (
              <div className="p-3.5 bg-accent/10 rounded-2xl border border-accent/25 space-y-2 mt-2">
                <div className="text-xs font-bold text-accent flex items-center justify-between">
                  <span>Enter 6-Digit SMS Code:</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="rounded-xl bg-cinema-surface border-accent/40 font-mono text-center font-bold text-sm text-cinema-text"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otpCode.length !== 6}
                    className="rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-bold text-xs"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-cinema-muted flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-accent" />
              <span>Password</span>
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-cinema-border bg-cinema-elevated text-cinema-text"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-xs uppercase tracking-wider font-black bg-accent hover:bg-accent-hover text-cinema-bg rounded-xl shadow-cinema-accent flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="text-center text-xs text-cinema-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-bold hover:underline">
            Sign In with Phone OTP →
          </Link>
        </div>
      </div>
    </div>
  );
}
