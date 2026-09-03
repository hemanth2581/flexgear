'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PricingBreakdown, Address, DeliveryMode } from '@/types/rental';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, ArrowLeft, Smartphone, Building } from 'lucide-react';
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
    <div className="space-y-6 max-w-lg mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
      {/* Gateway Header */}
      <div className="rounded-2xl border border-lenstiger/30 bg-lenstiger-50 p-6 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-lenstiger/20 pb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lenstiger text-white font-bold">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <div className="font-extrabold text-gray-900 text-sm">FLEX <span className="text-lenstiger">PAY</span></div>
              <div className="text-[10px] text-gray-500">Secure Instant Checkout (Sandbox)</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">Amount Due</span>
            <div className="text-xl font-black text-lenstiger">
              {formatCurrency(pricing.total)}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-5 space-y-3">
          <label className="text-xs font-bold text-gray-700">Select Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center transition-all ${
                paymentMethod === 'upi'
                  ? 'border-lenstiger bg-white text-lenstiger shadow-xs'
                  : 'border-gray-200 bg-white/60 text-gray-600 hover:text-black'
              }`}
            >
              <Smartphone className="h-4 w-4 mb-1 text-lenstiger" />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center transition-all ${
                paymentMethod === 'card'
                  ? 'border-lenstiger bg-white text-lenstiger shadow-xs'
                  : 'border-gray-200 bg-white/60 text-gray-600 hover:text-black'
              }`}
            >
              <CreditCard className="h-4 w-4 mb-1 text-lenstiger" />
              <span>Debit / Credit</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center transition-all ${
                paymentMethod === 'netbanking'
                  ? 'border-lenstiger bg-white text-lenstiger shadow-xs'
                  : 'border-gray-200 bg-white/60 text-gray-600 hover:text-black'
              }`}
            >
              <Building className="h-4 w-4 mb-1 text-lenstiger" />
              <span>NetBanking</span>
            </button>
          </div>
        </div>

        {/* UPI Mock Input */}
        {paymentMethod === 'upi' && (
          <div className="mt-4 p-3 rounded-xl bg-white border border-gray-200 text-xs space-y-1">
            <span className="text-gray-500">Virtual Payment Address (VPA):</span>
            <div className="font-mono font-bold text-gray-900">{address.phone || '9876543210'}@okhdfcbank</div>
          </div>
        )}
      </div>

      {/* Security Assurance */}
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <ShieldCheck className="h-4 w-4 text-lenstiger shrink-0" />
        <span>256-Bit SSL Encrypted. Refundable deposit released within 24h of return.</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 rounded-2xl border-gray-300 text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Edit Details</span>
        </Button>

        <Button
          type="button"
          onClick={handlePayNow}
          disabled={isProcessing}
          className="flex-1 rounded-2xl bg-gold hover:bg-gold-hover text-gray-950 font-black"
        >
          <Lock className="h-3.5 w-3.5 mr-1.5" />
          <span>{isProcessing ? 'Processing Payment...' : `Pay ${formatCurrency(pricing.total)}`}</span>
        </Button>
      </div>
    </div>
  );
}
