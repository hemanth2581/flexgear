'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import {
  Camera,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FirebaseOtpLoginFormProps {
  onSuccessRedirect?: string;
  onSuccess?: (user: any) => void;
  showExploreOption?: boolean;
  onExploreClick?: () => void;
}

export function FirebaseOtpLoginForm({
  onSuccessRedirect = '/account',
  onSuccess,
  showExploreOption = false,
  onExploreClick,
}: FirebaseOtpLoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Mode & Tabs
  const [authMethod, setAuthMethod] = useState<'phone' | 'password'>('phone');
  const [roleTab, setRoleTab] = useState<'customer' | 'admin'>('customer');

  // Customer Phone OTP State
  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [step, setStep] = useState<'phone_entry' | 'otp_entry'>('phone_entry');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Admin / Password State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingInPassword, setIsLoggingInPassword] = useState(false);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const cleanPhone = (val: string) => val.replace(/\D/g, '').slice(-10);

  // Step 1: Send Server-Side OTP
  const handleSendPhoneOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const digitsOnly = cleanPhone(phone);
    if (digitsOnly.length !== 10 || !/^[6-9]\d{9}$/.test(digitsOnly)) {
      toast('Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9)', 'error');
      return;
    }

    setIsSendingOtp(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digitsOnly }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast(data.error || 'Failed to dispatch OTP. Please try again.', 'error');
        setIsSendingOtp(false);
        return;
      }

      setStep('otp_entry');
      setCooldown(data.cooldownSeconds || 30);
      setIsSendingOtp(false);
      setOtpDigits(['1', '2', '3', '4', '5', '6']);
      toast(data.message || `Verification code sent to +91 ${digitsOnly}`, 'success');

      // Auto focus first OTP input box
      setTimeout(() => {
        document.getElementById('form-otp-0')?.focus();
      }, 100);
    } catch (error: any) {
      console.error('[Phone Auth] Send OTP Error:', error);
      setIsSendingOtp(false);
      toast('Network error sending OTP. Please check your connection.', 'error');
    }
  };

  // Step 2: Verify Server-Side OTP & Establish Supabase Session
  const handleVerifyPhoneOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const otpCode = otpDigits.join('');
    if (otpCode.length !== 6) {
      toast('Please enter all 6 digits of the verification code', 'error');
      return;
    }

    setIsVerifyingOtp(true);
    const digitsOnly = cleanPhone(phone);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: digitsOnly,
          otp: otpCode,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast(data.error || 'Invalid or expired OTP code. Please try again.', 'error');
        setIsVerifyingOtp(false);
        return;
      }

      const userObj = data.user || {
        id: `user_${digitsOnly}`,
        phone: `+91${digitsOnly}`,
        email: `${digitsOnly}@flexgear.customer`,
        full_name: `Filmmaker (+91 ${digitsOnly})`,
        role: 'CUSTOMER',
        token: data.token,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('flexgear_user', JSON.stringify(userObj));
        if (data.token) {
          localStorage.setItem('flexgear_auth_token', data.token);
        }
        window.dispatchEvent(new Event('storage'));
      }

      setIsVerifyingOtp(false);
      toast(data.message || 'Authenticated successfully! Welcome to FlexGear.', 'success');

      if (onSuccess) {
        onSuccess(userObj);
      } else {
        router.push(onSuccessRedirect);
      }
    } catch (error: any) {
      console.error('[Phone Auth] Verify OTP Error:', error);
      setIsVerifyingOtp(false);
      toast('Verification failed. Please try again.', 'error');
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = clean;
    setOtpDigits(newDigits);

    if (clean && index < 5) {
      const nextInput = document.getElementById(`form-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`form-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePasteOtp = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);

    const focusIndex = Math.min(pasted.length, 5);
    const nextInput = document.getElementById(`form-otp-${focusIndex}`);
    nextInput?.focus();
  };

  // Admin / Email Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please enter both email and password', 'error');
      return;
    }

    setIsLoggingInPassword(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast(data.error || 'Invalid email or password.', 'error');
        setIsLoggingInPassword(false);
        return;
      }

      const userObj = data.user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('flexgear_user', JSON.stringify(userObj));
        if (data.token) {
          localStorage.setItem('flexgear_auth_token', data.token);
        }
        window.dispatchEvent(new Event('storage'));
      }

      setIsLoggingInPassword(false);
      toast(`Signed in as ${userObj.role === 'ADMIN' ? 'Administrator' : 'Customer'}`, 'success');

      if (onSuccess) {
        onSuccess(userObj);
      } else {
        router.push(userObj.role === 'ADMIN' ? '/admin' : onSuccessRedirect);
      }
    } catch (error: any) {
      console.error('[Password Auth] Error:', error);
      setIsLoggingInPassword(false);
      toast('Authentication error. Please try again.', 'error');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header Badge */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 text-accent font-bold shadow-cinema-glow">
          <Camera className="h-7 w-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-cinema-text font-heading">
          {authMethod === 'phone' ? 'Sign In to FlexGear' : 'Administrator Console'}
        </h1>
        <p className="text-xs text-cinema-muted">
          {authMethod === 'phone'
            ? 'Enter your mobile number to receive a secure SMS OTP'
            : 'Access inventory management, orders, and customer KYC'}
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border border-cinema-border bg-cinema-surface p-6 sm:p-8 space-y-6 shadow-cinema-xl">
        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-cinema-elevated border border-cinema-border">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setStep('phone_entry');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              authMethod === 'phone'
                ? 'bg-accent text-cinema-bg shadow-cinema-accent font-black'
                : 'text-cinema-muted hover:text-cinema-text'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile OTP</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('password')}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              authMethod === 'password'
                ? 'bg-accent text-cinema-bg shadow-cinema-accent font-black'
                : 'text-cinema-muted hover:text-cinema-text'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin / Staff</span>
          </button>
        </div>

        {/* 1. Customer Phone OTP Flow */}
        {authMethod === 'phone' && (
          <>
            {step === 'phone_entry' ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-cinema-text flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="h-3.5 w-3.5 text-accent" />
                      <span>Mobile Number</span>
                    </span>
                    <span className="text-[10px] text-cinema-muted font-normal">India (+91)</span>
                  </label>

                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs text-cinema-muted font-bold font-mono">
                      +91
                    </span>
                    <Input
                      type="tel"
                      required
                      autoFocus
                      placeholder="98765 43210"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(cleanPhone(e.target.value))}
                      className="pl-13 h-12 rounded-xl border-cinema-border bg-cinema-elevated text-cinema-text font-mono text-sm tracking-wider focus:border-accent"
                    />
                  </div>
                  <p className="text-[11px] text-cinema-muted">
                    We will send a 6-digit verification code to your phone.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSendingOtp || phone.length < 10}
                  className="w-full h-12 rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-black text-xs uppercase tracking-wider shadow-cinema-accent flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
                >
                  {isSendingOtp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              /* OTP 6-Digit Verification Step */
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-5">
                <div className="space-y-2 text-center">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cinema-text">
                    <span>Code sent to:</span>
                    <span className="font-mono text-accent">+91 {phone}</span>
                  </div>
                  <p className="text-[11px] text-cinema-muted">
                    Enter the 6-digit verification code below
                  </p>
                </div>

                {/* 6-Box OTP Input */}
                <div className="flex justify-between gap-2" onPaste={handlePasteOtp}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`form-otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-12 text-center rounded-xl bg-cinema-elevated border border-cinema-border text-cinema-text font-mono font-black text-lg focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <Button
                  type="submit"
                  disabled={isVerifyingOtp || otpDigits.join('').length !== 6}
                  className="w-full h-12 rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-black text-xs uppercase tracking-wider shadow-cinema-accent flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
                >
                  {isVerifyingOtp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify &amp; Continue</span>
                    </>
                  )}
                </Button>

                {/* Resend & Change Number Actions */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-cinema-border">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone_entry');
                      setOtpDigits(['', '', '', '', '', '']);
                    }}
                    className="text-cinema-muted hover:text-cinema-text font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Change Phone</span>
                  </button>

                  <button
                    type="button"
                    disabled={cooldown > 0 || isSendingOtp}
                    onClick={() => handleSendPhoneOtp()}
                    className={`font-bold transition cursor-pointer ${
                      cooldown > 0 ? 'text-cinema-muted cursor-not-allowed' : 'text-accent hover:underline'
                    }`}
                  >
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend OTP'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* 2. Admin / Password Login Flow */}
        {authMethod === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-cinema-text flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-accent" />
                <span>Admin Email Address</span>
              </label>
              <Input
                type="email"
                required
                placeholder="admin@flexgear.test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border-cinema-border bg-cinema-elevated text-cinema-text text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-cinema-text flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-accent" />
                <span>Password</span>
              </label>
              <Input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl border-cinema-border bg-cinema-elevated text-cinema-text text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoggingInPassword || !email || !password}
              className="w-full h-11 rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-black text-xs uppercase tracking-wider shadow-cinema-accent flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoggingInPassword ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Authorize Admin Access</span>
                </>
              )}
            </Button>
          </form>
        )}
      </div>

      {/* Footer Links */}
      <div className="text-center text-xs text-cinema-muted space-y-2">
        <div>
          By signing in, you agree to FlexGear&apos;s{' '}
          <Link href="/privacy" className="text-cinema-text font-semibold hover:underline">
            Rental Terms &amp; Privacy Policy
          </Link>
        </div>
        <div>
          New to FlexGear?{' '}
          <Link href="/signup" className="text-accent font-bold hover:underline">
            Create Filmmaker Account →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Re-export alias for clean naming
export { FirebaseOtpLoginForm as SupabaseOtpLoginForm };
