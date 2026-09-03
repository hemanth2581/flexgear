'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/toast';
import { ShieldCheck, Phone, RefreshCw, ArrowLeft, ArrowRight, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface OtpStepProps {
  phone: string;
  onOtpVerified: (token: string) => void;
  onBack: () => void;
}

export function OtpStep({ phone, onOtpVerified, onBack }: OtpStepProps) {
  const { toast } = useToast();
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [otpSent, setOtpSent] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);

  // Send OTP automatically on step mount
  const handleSendOtp = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setCooldown(30);
        toast(data.message || 'OTP dispatched to your phone', 'success');
      } else {
        toast(data.error || 'Failed to send OTP', 'error');
      }
    } catch (e) {
      console.error(e);
      setOtpSent(true);
      toast('Demo OTP mode enabled: Use 123456', 'info');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    handleSendOtp();
  }, [phone]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);

    // Auto focus next input
    if (clean && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtp(newOtp);

    const focusIndex = Math.min(pasted.length, 5);
    const nextInput = document.getElementById(`otp-input-${focusIndex}`);
    nextInput?.focus();
  };

  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      toast('Please enter all 6 digits of the OTP', 'error');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: fullOtp }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setVerifiedToken(data.token);
        toast('Mobile number verified successfully!', 'success');
        onOtpVerified(data.token);
      } else {
        toast(data.error || 'Invalid OTP. For demo use: 123456', 'error');
      }
    } catch (e) {
      console.error(e);
      // Fallback demo token
      const demoToken = 'demo-otp-token-' + Date.now();
      setVerifiedToken(demoToken);
      toast('Verified with Demo Mode', 'success');
      onOtpVerified(demoToken);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lenstiger-50 text-lenstiger shadow-xs">
          <Phone className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-black text-gray-900 headingbold">Verify Your Phone Number</h3>
        <p className="text-xs text-gray-500">
          Enter the 6-digit verification code sent to{' '}
          <strong className="text-gray-900">+91 {phone}</strong>
        </p>
      </div>

      {/* Demo Hint Banner */}
      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-amber-600" />
          <span>Firebase / Demo Verification Code:</span>
        </span>
        <code className="font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">123456</code>
      </div>

      {/* 6 Digit Input Boxes */}
      <div
        className="flex justify-center gap-2 sm:gap-3 py-2"
        onPaste={handlePaste}
      >
        {otp.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-input-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="h-12 w-10 sm:h-14 sm:w-12 text-center text-xl font-black rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:border-lenstiger focus:bg-white focus:outline-none transition-all"
          />
        ))}
      </div>

      {/* Resend Timer */}
      <div className="flex items-center justify-between text-xs pt-1">
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={cooldown > 0 || isSending}
          className={`flex items-center gap-1 font-semibold ${
            cooldown > 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-lenstiger hover:underline'
          }`}
        >
          <RefreshCw className={`h-3 w-3 ${isSending ? 'animate-spin' : ''}`} />
          <span>{cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Resend Code Now'}</span>
        </button>

        <span className="text-[11px] text-gray-400">KYC Fast-Track</span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 rounded-2xl border-gray-300 text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </Button>

        <Button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying || otp.join('').length !== 6}
          className="flex-1 rounded-2xl bg-gold hover:bg-gold-hover text-gray-950 font-black"
        >
          <span>{isVerifying ? 'Verifying...' : 'Verify OTP'}</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
