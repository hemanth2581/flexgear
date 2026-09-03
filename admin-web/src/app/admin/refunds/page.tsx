'use client';

import React, { useEffect, useState } from 'react';
import { Undo2, Search, ExternalLink, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { adminApiClient } from '../../../lib/api';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Loading } from '../../../components/ui/Loading';

export default function AdminRefundsPage() {
  const { token } = useAdminAuth();
  const [refunds, setRefunds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRefunds = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient('/refunds', { token: token || undefined });
      setRefunds(res.refunds || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cinema-border pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Stripe Escrow Refund Logs</h1>
          <p className="text-xs text-zinc-400 mt-1">Audit log of all security deposit payouts returned back to customer credit cards.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchRefunds} className="gap-1.5 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Refunds
        </Button>
      </div>

      {isLoading ? (
        <Loading message="Loading Stripe refund logs..." />
      ) : (
        <div className="rounded-xl border border-cinema-border bg-cinema-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 text-zinc-400 font-mono uppercase text-[10px] border-b border-cinema-border">
                <tr>
                  <th className="px-4 py-3">Stripe Refund ID</th>
                  <th className="px-4 py-3">Amount Credited</th>
                  <th className="px-4 py-3">Audit Reason</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cinema-border text-zinc-300">
                {refunds.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 font-mono">
                      No refunds issued yet. Deposits are held safely in escrow.
                    </td>
                  </tr>
                ) : (
                  refunds.map((r) => (
                    <tr key={r.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-white flex items-center gap-2">
                        <Undo2 className="w-3.5 h-3.5 text-emerald-400" /> {r.stripe_refund_id || r.id}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400">₹{Number(r.amount).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-zinc-400">{r.reason || 'Deposit release post-inspection'}</td>
                      <td className="px-4 py-3">
                        <Badge variant="success">SUCCEEDED</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
