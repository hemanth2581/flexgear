'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/toast';
import { ShieldCheck, Phone, RefreshCw, ArrowLeft, ArrowRight, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      const demoToken = 'demo-otp-token-' + Date.now();
      setVerifiedToken(demoToken);
      toast('Verified with Demo Mode', 'success');
      onOtpVerified(demoToken);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-cinema-surface p-6 sm:p-8 rounded-3xl border border-cinema-border shadow-cinema-sm space-y-6 max-w-md mx-auto text-cinema-text">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30 text-accent shadow-cinema-glow">
          <Phone className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-black text-cinema-text font-heading">Verify Your Phone Number</h3>
        <p className="text-xs text-cinema-text-secondary">
          Enter the 6-digit verification code sent to{' '}
          <strong className="text-cinema-text font-mono">+91 {phone}</strong>
        </p>
      </div>

      {/* Demo Hint Banner */}
      <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/25 text-xs text-accent flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Demo Verification Code:</span>
        </span>
        <code className="font-mono font-bold bg-accent/20 px-2 py-0.5 rounded-lg">123456</code>
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
            className="h-12 w-10 sm:h-14 sm:w-12 text-center text-xl font-black rounded-2xl border border-cinema-border bg-cinema-tertiary text-cinema-text focus:border-accent focus:bg-cinema-card focus:outline-none transition-all font-mono"
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
              ? 'text-cinema-text-muted cursor-not-allowed'
              : 'text-accent hover:underline cursor-pointer'
          }`}
        >
          <RefreshCw className={`h-3 w-3 ${isSending ? 'animate-spin' : ''}`} />
          <span>{cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Resend Code Now'}</span>
        </button>

        <span className="text-[11px] text-accent font-semibold">Zero-Deposit KYC</span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 rounded-xl border-cinema-border bg-cinema-tertiary text-cinema-text hover:bg-cinema-card"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </Button>

        <Button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying || otp.join('').length !== 6}
          className="flex-1 rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-black uppercase text-xs tracking-wider shadow-cinema-accent"
        >
          <span>{isVerifying ? 'Verifying...' : 'Verify OTP'}</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
