'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatCurrency } from '../../utils/currency';

interface StripePaymentFormProps {
  clientSecret?: string;
  totalAmount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  clientSecret,
  totalAmount,
  onSuccess,
  onError,
}) => {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState('ARJUN MENON');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate processing with Stripe PaymentIntent
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const paymentIntentId = clientSecret ? clientSecret.split('_secret')[0] : `pi_mock_${Date.now()}`;
      onSuccess(paymentIntentId);
    } catch (err: any) {
      onError(err.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmitPayment} className="p-6 rounded-2xl bg-cinema-card border border-cinema-border space-y-5">
      <div className="flex items-center justify-between border-b border-cinema-border pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-white">Stripe 3D Secure Card Payment</h3>
        </div>
        <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
          256-Bit SSL Encrypted
        </span>
      </div>

      <div className="space-y-3">
        <Input
          label="Cardholder Name"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Arjun Menon"
          required
        />
        <Input
          label="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="4242 4242 4242 4242"
          icon={<CreditCard className="w-4 h-4" />}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Expiry (MM/YY)"
            value={cardExpiry}
            onChange={(e) => setCardExpiry(e.target.value)}
            placeholder="12/28"
            required
          />
          <Input
            label="CVC / CVV"
            value={cardCvc}
            onChange={(e) => setCardCvc(e.target.value)}
            placeholder="123"
            type="password"
            maxLength={4}
            required
          />
        </div>
      </div>

      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-zinc-200 font-semibold">Security Deposit Escrow:</span>
          <p className="text-[11px] mt-0.5">The refundable deposit portion will be held safely in escrow and automatically refunded via Stripe upon equipment return inspection.</p>
        </div>
      </div>

      <Button type="submit" isLoading={isProcessing} className="w-full gap-2 text-base" size="lg">
        <Lock className="w-4 h-4" /> Authorize & Pay {formatCurrency(totalAmount)}
      </Button>
    </form>
  );
};
