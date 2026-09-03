'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Film,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { requestPhoneOtp, verifyPhoneOtp, loginWithEmailPassword } = useAuth();

  const [authMethod, setAuthMethod] = useState<'PHONE_OTP' | 'EMAIL_PASSWORD'>('PHONE_OTP');

  // Phone OTP States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpStep, setOtpStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [devInfo, setDevInfo] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Email States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Focus first OTP input when step changes
  useEffect(() => {
    if (otpStep === 'OTP') {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    }
  }, [otpStep]);

  // Send Phone OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDevInfo(null);

    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${cleanPhone}`;

    setIsLoading(true);
    try {
      const res = await requestPhoneOtp(formattedPhone);
      if (res.isDevelopment && res.devOtp) {
        setDevInfo(`Development OTP Mode: Code is ${res.devOtp}`);
        const digits = res.devOtp.split('').slice(0, 6);
        setOtp([...digits, ...Array(6 - digits.length).fill('')]);
      } else {
        setOtp(['', '', '', '', '', '']);
      }
      setOtpStep('OTP');
      setCountdown(30);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch verification code. Please check your phone number.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    // Auto-advance
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Verify Phone OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanOtp = otp.join('');
    if (cleanOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${cleanPhone}`;

    setIsLoading(true);
    try {
      await verifyPhoneOtp({
        phone: formattedPhone,
        otp: cleanOtp,
        fullName: fullName.trim() || undefined,
      });
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Incorrect or expired verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid studio email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmailPassword(cleanEmail, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full mx-auto">
      {/* Outer ambient glow */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Card Container */}
      <div className="relative rounded-3xl bg-zinc-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-6 sm:p-8 text-white">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 text-amber-400 shadow-inner mb-3">
            <Film className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight text-white">
            Filmmaker Portal
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Access Cinema Fleet &bull; Reserve Production Kits
          </p>
        </div>

        {/* Development Auth Badge */}
        <div className="mb-5 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-mono text-[11px] leading-tight">
            Development Mode: Phone SMS OTP Ready
          </span>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Dev OTP Hint Banner */}
        {devInfo && (
          <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
            <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{devInfo}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-zinc-900/90 border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('PHONE_OTP');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              authMethod === 'PHONE_OTP'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📱 Phone SMS OTP
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('EMAIL_PASSWORD');
              setError(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              authMethod === 'EMAIL_PASSWORD'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ✉️ Email Login
          </button>
        </div>

        {authMethod === 'PHONE_OTP' ? (
          otpStep === 'PHONE' ? (
            /* STEP 1: PHONE NUMBER ENTRY */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-zinc-700/80 bg-zinc-900/90 text-zinc-300 text-xs font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    required
                    autoFocus
                    className="flex-1 bg-zinc-900/70 border border-zinc-700/80 rounded-r-xl px-3.5 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Director / DP Name (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Arjun Menon"
                    className="w-full bg-zinc-900/70 border border-zinc-700/80 rounded-xl px-3.5 py-3 pl-10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-all"
                  />
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: 6-DIGIT OTP VERIFICATION */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <span className="text-xs text-zinc-400">
                  Verification code sent to <span className="text-white font-mono">+91 {phoneNumber}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep('PHONE');
                    setOtp(['', '', '', '', '', '']);
                    setError(null);
                  }}
                  disabled={isLoading}
                  className="text-xs text-amber-400 hover:underline block mx-auto mt-1"
                >
                  Change phone number
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-2.5 uppercase tracking-wider text-center">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpInputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-10 sm:w-11 h-12 text-center text-lg font-bold bg-zinc-900/90 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono px-1">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={countdown > 0 || isLoading}
                  className="text-zinc-400 hover:text-amber-400 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend Code'}
                </button>
                <span className="text-zinc-500 text-[11px]">Instant Verification</span>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.join('').length < 6}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <span>Verify &amp; Enter Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )
        ) : (
          /* EMAIL / PASSWORD LOGIN */
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                Production House / Studio Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@studio.film"
                  required
                  className="w-full bg-zinc-900/70 border border-zinc-700/80 rounded-xl px-3.5 py-3 pl-10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-all"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-zinc-900/70 border border-zinc-700/80 rounded-xl px-3.5 py-3 pl-10 pr-10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono transition-all"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Security / SSL Badge */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Supabase Authenticated &bull; Encrypted Session</span>
        </div>
      </div>
    </div>
  );
};
