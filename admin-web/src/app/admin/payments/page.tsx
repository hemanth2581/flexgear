'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Search, ExternalLink, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { adminApiClient } from '../../../lib/api';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Loading } from '../../../components/ui/Loading';

export default function AdminPaymentsPage() {
  const { token } = useAdminAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient('/payments', { token: token || undefined });
      setPayments(res.payments || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cinema-border pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Stripe PaymentIntents &amp; Transactions</h1>
          <p className="text-xs text-zinc-400 mt-1">Live credit card, UPI, and netbanking charges processed via Stripe Gateway.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchPayments} className="gap-1.5 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Transactions
        </Button>
      </div>

      {isLoading ? (
        <Loading message="Querying Stripe payment transactions..." />
      ) : (
        <div className="rounded-xl border border-cinema-border bg-cinema-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 text-zinc-400 font-mono uppercase text-[10px] border-b border-cinema-border">
                <tr>
                  <th className="px-4 py-3">Stripe PaymentIntent ID</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Gateway</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cinema-border text-zinc-300">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-primary" /> {p.stripe_payment_intent_id || p.id}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">₹{Number(p.amount).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-mono uppercase text-zinc-400">{p.payment_type || 'RENTAL'}</td>
                    <td className="px-4 py-3">
                      <Badge variant="success">{p.status || 'SUCCEEDED'}</Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-zinc-400">Stripe Payments India</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
