'use client';

import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, MapPin, Percent, DollarSign } from 'lucide-react';

export default function AdminSettingsPage() {
  const [cgstRate, setCgstRate] = useState(9);
  const [sgstRate, setSgstRate] = useState(9);
  const [weeklyDiscountRate, setWeeklyDiscountRate] = useState(15);
  const [volumeDiscountRate, setVolumeDiscountRate] = useState(10);
  const [autoDepositRefund, setAutoDepositRefund] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-500" />
          Rental House Engine Settings
        </h1>
        <p className="text-sm text-neutral-400">
          Configure server-authoritative GST tax parameters, shoot discount tiers, and automated deposit refund workflows.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          Platform configuration updated successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tax Configuration */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-amber-400" />
            GST Tax Rates (India Configuration)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">CGST Rate (%)</label>
              <input
                type="number"
                value={cgstRate}
                onChange={(e) => setCgstRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">SGST Rate (%)</label>
              <input
                type="number"
                value={sgstRate}
                onChange={(e) => setSgstRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
          <p className="text-xs text-neutral-500">
            Combined GST rate applied: {cgstRate + sgstRate}% (HSN Code: 997314 — Film Equipment Rental Services)
          </p>
        </div>

        {/* Shoot Duration Discounts */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            Dynamic Shoot Duration & Multi-Gear Discounts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">7+ Day Shoot Discount (%)</label>
              <input
                type="number"
                value={weeklyDiscountRate}
                onChange={(e) => setWeeklyDiscountRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Multi-Item Bundle Discount (%)</label>
              <input
                type="number"
                value={volumeDiscountRate}
                onChange={(e) => setVolumeDiscountRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Deposit Escrow Automation */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Security Deposit Escrow Policy
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoDepositRefund}
              onChange={(e) => setAutoDepositRefund(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-800 text-amber-500 focus:ring-0 bg-neutral-950"
            />
            <div>
              <div className="text-sm font-semibold text-white">Enable Automated Stripe Deposit Refund on Passed QC</div>
              <div className="text-xs text-neutral-400">
                When a technician marks return QC inspection as PASSED with 0 damage, trigger instant Stripe Refund API call without manual intervention.
              </div>
            </div>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
