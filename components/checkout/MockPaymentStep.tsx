'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PricingBreakdown, Address, DeliveryMode } from '@/types/rental';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, ArrowLeft, Smartphone, Building, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MockPaymentStepProps {
  rentalOrderId: string;
  paymentOrderId: string;
  pricing: PricingBreakdown;
  address: Address;
  deliveryMode: DeliveryMode;
  onBack: () => void;
  onSuccess: (rentalId: string) => void;
}

export function MockPaymentStep({
  rentalOrderId,
  paymentOrderId,
  pricing,
  address,
  deliveryMode,
  onBack,
  onSuccess,
}: MockPaymentStepProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const handlePayNow = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: paymentOrderId,
          rentalOrderId: rentalOrderId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast('Payment Captured Successfully!', 'success');
        onSuccess(data.rentalId || rentalOrderId);
      } else {
        toast(data.error || 'Payment verification failed', 'error');
        setIsProcessing(false);
      }
    } catch (e) {
      console.error('Payment error:', e);
      toast('Payment error occurred. Using mock confirmation fallback.', 'info');
      onSuccess(rentalOrderId);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto bg-cinema-surface p-6 sm:p-8 rounded-3xl border border-cinema-border shadow-cinema-sm text-cinema-text">
      {/* Gateway Header */}
      <div className="rounded-2xl border border-cinema-border bg-cinema-tertiary p-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-cinema-border pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 border border-accent/30 text-accent font-bold">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <div className="font-black text-cinema-text text-sm font-heading">FLEX<span className="text-accent">PAY</span></div>
              <div className="text-[10px] text-cinema-text-muted">Instant Escrow Checkout</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-cinema-text-muted">Amount Due</span>
            <div className="text-xl font-black text-accent font-heading">
              {formatCurrency(pricing.total)}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-5 space-y-3">
          <label className="text-xs font-bold text-cinema-text-secondary uppercase tracking-wider">
            Select Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center transition-all cursor-pointer ${
                paymentMethod === 'upi'
                  ? 'border-accent bg-accent/15 text-accent shadow-cinema-sm'
                  : 'border-cinema-border bg-cinema-surface text-cinema-text-secondary hover:text-cinema-text hover:border-cinema-border-strong'
              }`}
            >
              <Smartphone className="h-4 w-4 mb-1 text-accent" />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center transition-all cursor-pointer ${
                paymentMethod === 'card'
                  ? 'border-accent bg-accent/15 text-accent shadow-cinema-sm'
                  : 'border-cinema-border bg-cinema-surface text-cinema-text-secondary hover:text-cinema-text hover:border-cinema-border-strong'
              }`}
            >
              <CreditCard className="h-4 w-4 mb-1 text-accent" />
              <span>Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center transition-all cursor-pointer ${
                paymentMethod === 'netbanking'
                  ? 'border-accent bg-accent/15 text-accent shadow-cinema-sm'
                  : 'border-cinema-border bg-cinema-surface text-cinema-text-secondary hover:text-cinema-text hover:border-cinema-border-strong'
              }`}
            >
              <Building className="h-4 w-4 mb-1 text-accent" />
              <span>NetBanking</span>
            </button>
          </div>
        </div>

        {/* UPI Mock Input */}
        {paymentMethod === 'upi' && (
          <div className="mt-4 p-3.5 rounded-xl bg-cinema-surface border border-cinema-border text-xs space-y-1">
            <span className="text-cinema-text-muted">Virtual Payment Address (VPA):</span>
            <div className="font-mono font-bold text-cinema-text">{address.phone || '9876543210'}@okhdfcbank</div>
          </div>
        )}
      </div>

      {/* Security Assurance */}
      <div className="flex items-center gap-2 text-xs text-cinema-text-secondary bg-cinema-tertiary p-3 rounded-2xl border border-cinema-border">
        <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
        <span>256-Bit SSL Encrypted. Refundable deposit released within 24h of return.</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 rounded-xl border-cinema-border bg-cinema-tertiary text-cinema-text hover:bg-cinema-card"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Edit Details</span>
        </Button>

        <Button
          type="button"
          onClick={handlePayNow}
          disabled={isProcessing}
          className="flex-1 rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-black uppercase text-xs tracking-wider shadow-cinema-accent"
        >
          <Lock className="h-3.5 w-3.5 mr-1.5" />
          <span>{isProcessing ? 'Processing Payment...' : `Pay ${formatCurrency(pricing.total)}`}</span>
        </Button>
      </div>
    </div>
  );
}
