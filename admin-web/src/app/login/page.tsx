'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ShieldCheck,
  Phone,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Loader2,
  Film,
  Server,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { requestPhoneOtp, verifyPhoneOtp, loginWithEmailPassword } = useAdminAuth();

  const [authMethod, setAuthMethod] = useState<'PHONE' | 'EMAIL'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countdown, setCountdown] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devInfo, setDevInfo] = useState<string | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Focus first OTP field when entering OTP step
  useEffect(() => {
    if (step === 'OTP') {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    }
  }, [step]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDevInfo(null);

    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setError('Please enter a valid administrator phone number (e.g. 9865986598).');
      return;
    }

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${cleanPhone}`;

    setIsLoading(true);
    try {
      const res = await requestPhoneOtp(formattedPhone);
      if (res.isDevelopment && res.devOtp) {
        setDevInfo(`Development OTP Mode: Use code ${res.devOtp}`);
        const digits = res.devOtp.split('').slice(0, 6);
        setOtp([...digits, ...Array(6 - digits.length).fill('')]);
      } else {
        setOtp(['', '', '', '', '', '']);
      }
      setStep('OTP');
      setCountdown(30);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

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
      await verifyPhoneOtp(formattedPhone, cleanOtp);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Admin authentication failed. Administrator privileges required.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid administrator email.');
      return;
    }
    if (!password) {
      setError('Please enter your administrator password.');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmailPassword(email.trim(), password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950 font-sans">
      {/* Background Image Container with deep cinematic lighting */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cinema-rig-admin-bg.jpg"
          alt="Cinema Production Rig Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 filter brightness-[0.70] contrast-110"
        />
        {/* Layered dark studio vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-zinc-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/70 to-zinc-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.9)_100%)]" />
      </div>

      {/* Atmospheric backlights */}
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white font-display">
                FLEX<span className="text-amber-400">GEAR</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300 font-mono">
                STUDIO OPS
              </span>
            </div>
          </div>
        </div>

        <Link
          href="http://localhost:3000"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white backdrop-blur-md transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Customer Portal</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-20 sm:py-24">
        {/* Glassmorphic Admin Security Card */}
        <div className="relative rounded-3xl bg-zinc-950/85 backdrop-blur-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] p-7 sm:p-9 text-white">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/30 text-amber-400 shadow-inner mb-3">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
              FlexGear
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Admin Portal
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Executive Fleet Operations &bull; Return QC &bull; RBAC Protected
            </p>
          </div>

          {/* Development Security Badge */}
          <div className="mb-5 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-mono text-[11px] leading-tight">
              Verified Admin RBAC: 9865986598 / 6305269032
            </span>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Dev OTP Notification */}
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
                setAuthMethod('PHONE');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMethod === 'PHONE'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              📱 Phone SMS OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('EMAIL');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMethod === 'EMAIL'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ✉️ Email &amp; Password
            </button>
          </div>

          {authMethod === 'PHONE' ? (
            step === 'PHONE' ? (
              /* PHONE ENTRY */
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Administrator Phone Number
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
                      placeholder="98659 86598"
                      required
                      autoFocus
                      className="flex-1 bg-zinc-900/70 border border-zinc-700/80 rounded-r-xl px-3.5 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phoneNumber.length < 8}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Requesting Security Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Security Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* 6-DIGIT OTP VERIFICATION */
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="text-center">
                  <span className="text-xs text-zinc-400">
                    Security code dispatched to <span className="text-white font-mono">+91 {phoneNumber}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('PHONE');
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
                    Enter 6-Digit Verification Code
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
                    {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Security Code'}
                  </button>
                  <span className="text-zinc-500 text-[11px]">Strict RBAC</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length < 6}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating Privileges...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Credentials &amp; Enter Studio</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )
          ) : (
            /* EMAIL / PASSWORD FORM */
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Administrator Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@flexgear.film"
                    required
                    className="w-full bg-zinc-900/70 border border-zinc-700/80 rounded-xl px-3.5 py-3 pl-10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-all"
                  />
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Master Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-zinc-900/70 border border-zinc-700/80 rounded-xl px-3.5 py-3 pl-10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono transition-all"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
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
                    <span>Verifying Access...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate Administrator</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security Footer */}
          <div className="mt-7 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500">
            <Server className="w-3.5 h-3.5 text-amber-400" />
            <span>Encrypted Studio Gateway &bull; Server-Enforced RBAC</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 z-20 text-center text-[11px] font-mono text-zinc-500 pointer-events-none">
        FlexGear Executive Studio &bull; Authorized Production Personnel Only
      </footer>
    </div>
  );
}
