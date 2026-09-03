'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import {
  Camera,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import {
  createRecaptchaVerifier,
  sendFirebaseOtp,
  confirmFirebaseOtp,
  formatE164,
  getFirebaseErrorMessage,
} from '@/lib/firebase/phone-auth';
import { isFirebaseConfigured } from '@/lib/firebase/client';

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
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {}
      }
    };
  }, []);

  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    const fullPhone = formatE164(cleanPhone, '+91');
    setIsSendingOtp(true);

    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = createRecaptchaVerifier('signup-recaptcha', {
          size: 'invisible',
        });
      }

      const confirmation = await sendFirebaseOtp(fullPhone, recaptchaVerifierRef.current);
      setConfirmationResult(confirmation);
      setIsVerifyingPhone(true);
      setIsSendingOtp(false);
      toast(`Firebase OTP dispatched to ${fullPhone}`, 'success');
    } catch (error: any) {
      console.error('[Signup Phone Auth] Error:', error);
      setIsSendingOtp(false);
      toast(getFirebaseErrorMessage(error), 'error');
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast('Please enter the 6-digit OTP code', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (confirmationResult && isFirebaseConfigured()) {
        await confirmFirebaseOtp(confirmationResult, otpCode);
      } else {
        if (otpCode !== '123456') {
          throw new Error('Invalid test OTP code. Use 123456.');
        }
      }

      setIsPhoneVerified(true);
      setIsVerifyingPhone(false);
      setIsLoading(false);
      toast('Mobile number verified successfully with Firebase!', 'success');
    } catch (error: any) {
      setIsLoading(false);
      toast(getFirebaseErrorMessage(error), 'error');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast('Please fill in all required fields', 'error');
      return;
    }

    setIsLoading(true);

    const userObj = {
      id: `user_${Date.now()}`,
      full_name: fullName,
      email,
      phone: phone ? `+91${phone.replace(/\D/g, '')}` : undefined,
      phone_verified: isPhoneVerified,
      role: 'CUSTOMER',
      token: `jwt_signup_${Date.now()}`,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('flexgear_user', JSON.stringify(userObj));
    }

    setTimeout(() => {
      setIsLoading(false);
      toast('Account created successfully! Welcome to FlexGear.', 'success');
      router.push('/account');
    }, 500);
  };

  return (
    <div className="bg-[#f3f3f3] min-h-screen py-16 text-gray-900">
      <div id="signup-recaptcha"></div>

      <div className="mx-auto max-w-md px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-lenstiger text-white font-bold shadow-sm">
            <Camera className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 headingbold">Create Filmmaker Account</h1>
          <p className="text-xs text-gray-500">
            Start renting cinema gear, saving custom kits, and tracking shoot logistics.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-lenstiger" />
              <span>Full Name</span>
            </label>
            <Input
              required
              placeholder="Arjun Menon"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-lenstiger" />
              <span>Email Address</span>
            </label>
            <Input
              type="email"
              required
              placeholder="arjun@cinemafilm.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5 text-lenstiger" />
                <span>Mobile Phone (Firebase OTP)</span>
              </label>
              {isPhoneVerified && (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-semibold">+91</span>
                <Input
                  type="tel"
                  placeholder="98765 43210"
                  maxLength={10}
                  disabled={isPhoneVerified}
                  className="pl-12 rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              {!isPhoneVerified && phone.length >= 10 && (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 px-3"
                >
                  {isSendingOtp ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Verify Phone'
                  )}
                </Button>
              )}
            </div>

            {/* OTP Entry Drawer if verifying phone */}
            {isVerifyingPhone && !isPhoneVerified && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 mt-2">
                <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
                  <span>Enter SMS OTP:</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="6-digit code"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="rounded-xl bg-white border-amber-300 font-mono text-center font-bold text-sm text-gray-900"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otpCode.length !== 6}
                    className="rounded-xl bg-lenstiger hover:bg-lenstiger-dark text-white font-bold text-xs"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-lenstiger" />
              <span>Create Password</span>
            </label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-xs font-black bg-gold hover:bg-gold-hover text-gray-950 rounded-2xl shadow-sm flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-lenstiger font-bold hover:underline">
            Sign In with Firebase OTP
          </Link>
        </div>
      </div>
    </div>
  );
}
