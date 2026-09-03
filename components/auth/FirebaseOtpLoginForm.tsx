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
  User,
  Smartphone,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Key,
  ArrowLeft,
  Flame,
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
import { FirebaseConsoleGuideModal } from '@/components/auth/FirebaseConsoleGuideModal';

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 India (+91)' },
  { code: '+1', label: '🇺🇸 USA / CA (+1)' },
  { code: '+44', label: '🇬🇧 UK (+44)' },
  { code: '+971', label: '🇦🇪 UAE (+971)' },
  { code: '+65', label: '🇸🇬 Singapore (+65)' },
  { code: '+61', label: '🇦🇺 Australia (+61)' },
];

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

  // Password State
  const [email, setEmail] = useState('customer@flexgear.test');
  const [password, setPassword] = useState('password123');

  // Phone OTP State
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('9876543210');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [step, setStep] = useState<'phone_entry' | 'otp_entry'>('phone_entry');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Recaptcha verifier ref
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Guide Modal State
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Clean up recaptcha on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {}
      }
    };
  }, []);

  const switchRole = (tab: 'customer' | 'admin') => {
    setRoleTab(tab);
    if (tab === 'customer') {
      setEmail('customer@flexgear.test');
      setPassword('password123');
    } else {
      setEmail('admin@flexgear.test');
      setPassword('password123');
    }
  };

  const cleanPhone = (val: string) => val.replace(/\D/g, '');

  // Step 1: Send Firebase OTP
  const handleSendPhoneOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const digitsOnly = cleanPhone(phone);
    if (digitsOnly.length < 7) {
      toast('Please enter a valid mobile number', 'error');
      return;
    }

    const fullPhoneE164 = formatE164(digitsOnly, countryCode);
    setIsSendingOtp(true);

    try {
      if (!isFirebaseConfigured()) {
        setTimeout(() => {
          setIsSendingOtp(false);
          setStep('otp_entry');
          setCooldown(30);
          setOtpDigits(['1', '2', '3', '4', '5', '6']);
          toast(
            `Firebase Demo Mode: OTP 123456 generated for ${fullPhoneE164}. Add keys in .env.local for live SMS!`,
            'info'
          );
        }, 500);
        return;
      }

      // Initialize Firebase Recaptcha
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = createRecaptchaVerifier('root-recaptcha-container', {
          size: 'invisible',
          'expired-callback': () => {
            toast('reCAPTCHA expired. Please try again.', 'error');
          },
        });
      }

      const confirmation = await sendFirebaseOtp(fullPhoneE164, recaptchaVerifierRef.current);
      setConfirmationResult(confirmation);
      setStep('otp_entry');
      setCooldown(30);
      setIsSendingOtp(false);
      toast(`Firebase OTP sent to ${fullPhoneE164}!`, 'success');
    } catch (error: any) {
      console.error('[Firebase Phone Auth] Send OTP Error:', error);
      setIsSendingOtp(false);

      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
          recaptchaVerifierRef.current = null;
        } catch (e) {}
      }

      const userMsg = getFirebaseErrorMessage(error);
      toast(userMsg, 'error');
    }
  };

  // Step 2: Verify Firebase OTP
  const handleVerifyPhoneOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const otpCode = otpDigits.join('');
    if (otpCode.length !== 6) {
      toast('Please enter all 6 digits of the verification code', 'error');
      return;
    }

    setIsVerifyingOtp(true);
    const fullPhoneE164 = formatE164(phone, countryCode);

    try {
      let firebaseUid = `user_phone_${cleanPhone(phone)}_${Date.now()}`;
      let idToken = `mock_token_${Date.now()}`;

      if (confirmationResult && isFirebaseConfigured()) {
        const userCredential = await confirmFirebaseOtp(confirmationResult, otpCode);
        const fbUser = userCredential.user;
        firebaseUid = fbUser.uid;
        idToken = await fbUser.getIdToken();
      } else {
        if (otpCode !== '123456') {
          throw new Error('Invalid test code. Please use 123456.');
        }
      }

      const role = 'CUSTOMER';
      const userObj = {
        id: firebaseUid,
        phone: fullPhoneE164,
        email: `${cleanPhone(phone)}@flexgear.user`,
        full_name: `Filmmaker (+${countryCode.replace('+', '')} ${cleanPhone(phone)})`,
        role,
        token: idToken,
        auth_provider: 'firebase_phone',
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('flexgear_user', JSON.stringify(userObj));
      }

      setIsVerifyingOtp(false);
      toast(`Authenticated with Firebase Phone OTP! Welcome, Filmmaker.`, 'success');

      if (onSuccess) {
        onSuccess(userObj);
      } else {
        router.push(onSuccessRedirect);
      }
    } catch (error: any) {
      console.error('[Firebase Phone Auth] Verify OTP Error:', error);
      setIsVerifyingOtp(false);
      const userMsg = getFirebaseErrorMessage(error);
      toast(userMsg, 'error');
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

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please enter both email and password', 'error');
      return;
    }

    const role = email.toLowerCase().includes('admin') || roleTab === 'admin' ? 'ADMIN' : 'CUSTOMER';
    const userObj = {
      id: role === 'ADMIN' ? '00000000-0000-0000-0000-000000000002' : '00000000-0000-0000-0000-000000000001',
      email,
      full_name: role === 'ADMIN' ? 'FlexGear Admin' : 'Arjun Menon (Cinematographer)',
      role,
      token: `mock_jwt_${role.toLowerCase()}_${Date.now()}`,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('flexgear_user', JSON.stringify(userObj));
    }

    toast(`Signed in as ${role === 'ADMIN' ? 'Admin' : 'Customer'} (${email})`, 'success');
    if (onSuccess) {
      onSuccess(userObj);
    } else {
      router.push(role === 'ADMIN' ? '/admin' : onSuccessRedirect);
    }
  };

  const handleInstantLogin = (role: 'customer' | 'admin') => {
    const userObj = {
      id: role === 'admin' ? '00000000-0000-0000-0000-000000000002' : '00000000-0000-0000-0000-000000000001',
      email: role === 'admin' ? 'admin@flexgear.test' : 'customer@flexgear.test',
      full_name: role === 'admin' ? 'FlexGear Admin' : 'Arjun Menon (Cinematographer)',
      role: role.toUpperCase(),
      token: `mock_jwt_${role}_${Date.now()}`,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('flexgear_user', JSON.stringify(userObj));
    }

    toast(`Instant Sign-in as ${role.toUpperCase()}!`, 'success');
    if (onSuccess) {
      onSuccess(userObj);
    } else {
      router.push(role === 'admin' ? '/admin' : onSuccessRedirect);
    }
  };

  const fillTestPhone = () => {
    setCountryCode('+91');
    setPhone('9876543210');
    setAuthMethod('phone');
    toast('Filled Firebase test phone: +91 98765 43210 (Code: 123456)', 'info');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      {/* Invisible Recaptcha target */}
      <div id="root-recaptcha-container"></div>

      {/* Guide modal */}
      <FirebaseConsoleGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Firebase Badge & Setup Guide Button */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border border-amber-200/80 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              <span>Firebase Authentication</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded-md">
                OTP
              </span>
            </div>
            <p className="text-[11px] text-gray-600">
              Live SMS &amp; Test Numbers via Firebase Console
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 shadow-2xs transition flex items-center gap-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Console Guide</span>
        </button>
      </div>

      {/* Method Tabs: Phone OTP vs Password */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl border border-gray-200 bg-white shadow-2xs">
        <button
          type="button"
          onClick={() => {
            setAuthMethod('phone');
            setStep('phone_entry');
          }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            authMethod === 'phone'
              ? 'bg-lenstiger text-white shadow-xs'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          <Smartphone className="h-4 w-4" />
          <span>Phone OTP (Firebase)</span>
        </button>

        <button
          type="button"
          onClick={() => setAuthMethod('password')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            authMethod === 'password'
              ? 'bg-lenstiger text-white shadow-xs'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Password / Admin</span>
        </button>
      </div>

      {/* Main Form Card */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
        {authMethod === 'phone' ? (
          <div>
            {step === 'phone_entry' ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-lenstiger" />
                    <span>Mobile Phone Number</span>
                  </label>

                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-32 rounded-xl border border-gray-300 bg-gray-50/50 px-2 text-xs font-semibold text-gray-900 focus:border-lenstiger focus:outline-none"
                    >
                      {COUNTRY_CODES.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.label}
                        </option>
                      ))}
                    </select>

                    <div className="relative flex-1">
                      <Input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900 font-semibold"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Firebase will dispatch a 6-digit OTP code to verify your account.
                  </p>
                </div>

                {/* Test phone filler helper */}
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Firebase Test: <strong>+91 9876543210</strong></span>
                  </span>
                  <button
                    type="button"
                    onClick={fillTestPhone}
                    className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-md transition cursor-pointer"
                  >
                    Fill
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isSendingOtp || phone.length < 7}
                  className="w-full h-11 text-xs font-black bg-gold hover:bg-gold-hover text-gray-950 rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSendingOtp ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Sending Firebase OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification OTP</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-5">
                <div className="text-center space-y-1">
                  <div className="text-xs font-bold text-gray-800">
                    Enter 6-Digit Code Sent To
                  </div>
                  <div className="text-sm font-black text-lenstiger font-mono">
                    {formatE164(phone, countryCode)}
                  </div>
                </div>

                <div
                  className="flex justify-center gap-2 py-1"
                  onPaste={handlePasteOtp}
                >
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
                      className="h-12 w-10 sm:h-13 sm:w-11 text-center text-xl font-black rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:border-lenstiger focus:bg-white focus:outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center text-[11px] text-amber-900">
                  Firebase Test OTP: <strong className="font-mono text-amber-700 font-bold">123456</strong>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('phone_entry')}
                    className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Edit Phone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendPhoneOtp()}
                    disabled={cooldown > 0 || isSendingOtp}
                    className={`flex items-center gap-1 font-bold cursor-pointer ${
                      cooldown > 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-lenstiger hover:underline'
                    }`}
                  >
                    <RefreshCw className={`h-3 w-3 ${isSendingOtp ? 'animate-spin' : ''}`} />
                    <span>{cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend OTP'}</span>
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isVerifyingOtp || otpDigits.join('').length !== 6}
                  className="w-full h-11 text-xs font-black bg-gold hover:bg-gold-hover text-gray-950 rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isVerifyingOtp ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Verifying Firebase OTP...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Verify &amp; Sign In</span>
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-gray-100">
              <button
                type="button"
                onClick={() => switchRole('customer')}
                className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  roleTab === 'customer'
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Customer Login
              </button>
              <button
                type="button"
                onClick={() => switchRole('admin')}
                className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  roleTab === 'admin'
                    ? 'bg-white text-amber-700 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Admin Portal
              </button>
            </div>

            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-lenstiger" />
                  <span>Email Address</span>
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-lenstiger" />
                  <span>Password</span>
                </label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-xs font-black bg-gold hover:bg-gold-hover text-gray-950 rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In with Password</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}

        {/* 1-Click Demo Profiles */}
        <div className="border-t border-gray-100 pt-4 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center">
            Quick 1-Click Demo Profiles
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleInstantLogin('customer')}
              className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-lenstiger-50 hover:border-lenstiger text-xs font-bold text-gray-800 transition cursor-pointer"
            >
              🎬 Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleInstantLogin('admin')}
              className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-lenstiger-50 hover:border-lenstiger text-xs font-bold text-gray-800 transition cursor-pointer"
            >
              ⚡ Demo Admin
            </button>
          </div>
        </div>
      </div>

      {/* Explore or Signup footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-2">
        <Link href="/signup" className="text-lenstiger font-bold hover:underline">
          Create New Account
        </Link>

        {showExploreOption && onExploreClick && (
          <button
            type="button"
            onClick={onExploreClick}
            className="text-gray-600 hover:text-gray-950 font-bold underline cursor-pointer"
          >
            Explore Catalog as Guest →
          </button>
        )}
      </div>
    </div>
  );
}
