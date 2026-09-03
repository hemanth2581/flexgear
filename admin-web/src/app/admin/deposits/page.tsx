'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Undo2, CheckCircle2, AlertTriangle, RefreshCw, ArrowRight, Lock } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { adminApiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Loading } from '../../../components/ui/Loading';

export default function AdminDepositsPage() {
  const { token } = useAdminAuth();
  const [deposits, setDeposits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refund Form State
  const [refundForm, setRefundForm] = useState({
    deductionAmount: 0,
    deductionReason: '',
  });

  const fetchDeposits = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient('/admin/deposits', { token: token || undefined });
      setDeposits(res.deposits || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleOpenRefund = (dep: any) => {
    setSelectedDeposit(dep);
    setRefundForm({
      deductionAmount: 0,
      deductionReason: '',
    });
    setIsModalOpen(true);
  };

  const handleExecuteRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeposit) return;
    setIsSubmitting(true);

    try {
      await adminApiClient(`/admin/deposits/${selectedDeposit.id}/refund`, {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify({
          deductedAmount: Number(refundForm.deductionAmount),
          deductionReason: refundForm.deductionReason,
        }),
      });
      setIsModalOpen(false);
      fetchDeposits();
    } catch (err: any) {
      alert(err.message || 'Stripe deposit release failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HELD':
        return <Badge variant="accent">Escrow Held in Stripe</Badge>;
      case 'INSPECTION_PENDING':
        return <Badge variant="warning">QC Inspection Pending</Badge>;
      case 'FULL_REFUND':
      case 'REFUNDED':
        return <Badge variant="success">100% Refund Released</Badge>;
      case 'PARTIAL_REFUND':
      case 'DEDUCTION':
        return <Badge variant="danger">Partial Refund / Fee Deducted</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-3/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              Security Escrow &amp; Stripe Collateral Holds
            </h1>
            <Badge variant="accent">Stripe API Live</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Manage damage collateral deposits held in Stripe escrow, perform return QC reconciliations, and trigger instant card reversals.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDeposits} className="gap-1.5 text-xs font-mono">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Escrow
        </Button>
      </div>

      {isLoading ? (
        <Loading message="Fetching Stripe deposit escrow records..." />
      ) : (
        <div className="rounded-2xl border border-surface-3 bg-surface-1 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2/60 text-zinc-400 font-mono uppercase text-[10px] border-b border-surface-3">
                <tr>
                  <th className="px-5 py-3.5">Deposit Escrow ID</th>
                  <th className="px-5 py-3.5">Held Collateral</th>
                  <th className="px-5 py-3.5">Refunded Amount</th>
                  <th className="px-5 py-3.5">Damage Deductions</th>
                  <th className="px-5 py-3.5">Escrow Status</th>
                  <th className="px-5 py-3.5 text-right">Stripe Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3/60 text-zinc-300 font-sans">
                {deposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-surface-2/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                      <span>{dep.id?.slice(0, 12)}...</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-accent">
                      ₹{Number(dep.held_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-emerald-400 font-semibold">
                      ₹{Number(dep.refunded_amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-rose-400 font-semibold">
                      ₹{Number(dep.deducted_amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(dep.status)}</td>
                    <td className="px-5 py-3.5 text-right font-mono">
                      {dep.status === 'HELD' || dep.status === 'INSPECTION_PENDING' ? (
                        <Button
                          size="sm"
                          onClick={() => handleOpenRefund(dep)}
                          className="text-[10px] py-1 px-2.5 bg-emerald-500 hover:bg-emerald-400 text-surface-0 gap-1.5"
                        >
                          <Undo2 className="w-3 h-3" /> Release Deposit
                        </Button>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-mono">Settled &amp; Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stripe Refund Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Stripe Escrow Release &amp; Inspection Settlement"
        maxWidth="max-w-md"
      >
        {selectedDeposit && (
          <form onSubmit={handleExecuteRefund} className="space-y-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-surface-0 border border-surface-3 space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Total Escrow Held:</span>
                <span className="font-mono font-bold text-accent">
                  ₹{Number(selectedDeposit.held_amount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Refund Calculation:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{(Number(selectedDeposit.held_amount) - Number(refundForm.deductionAmount)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Input
              label="Damage / Cleaning Penalty Deduction (₹ INR)"
              type="number"
              min={0}
              max={selectedDeposit.held_amount}
              value={refundForm.deductionAmount}
              onChange={(e) => setRefundForm({ ...refundForm, deductionAmount: Number(e.target.value) })}
              placeholder="0 for 100% full refund"
            />

            {refundForm.deductionAmount > 0 && (
              <Input
                label="Deduction Reason (Sent to Customer)"
                value={refundForm.deductionReason}
                onChange={(e) => setRefundForm({ ...refundForm, deductionReason: e.target.value })}
                placeholder="e.g. Front lens element smudge cleaning fee / lost lens cap"
                required
              />
            )}

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-surface-0 font-bold"
            >
              Trigger Stripe Refund API
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
