import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function CheckoutFailedPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h1 className="text-2xl font-black text-white">Payment Unsuccessful</h1>
      <p className="text-xs text-zinc-400 mt-2">
        The card transaction could not be authorized. No funds or deposits were charged.
      </p>

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/checkout">
          <Button size="md" className="gap-2">
            Retry Payment
          </Button>
        </Link>
        <Link href="/cart">
          <Button variant="outline" size="md">
            Review Cart
          </Button>
        </Link>
      </div>
    </div>
  );
}
