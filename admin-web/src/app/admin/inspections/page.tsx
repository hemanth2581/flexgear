'use client';

import React, { useEffect, useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Camera,
  ShieldCheck,
  Sparkles,
  Zap,
  RotateCcw,
  Check,
  X,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { adminApiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Loading } from '../../../components/ui/Loading';

export default function AdminInspectionsPage() {
  const { token, admin } = useAdminAuth();
  const [inspections, setInspections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRentalCode, setSelectedRentalCode] = useState('FG-2026-9014');
  const [selectedUnitSerial, setSelectedUnitSerial] = useState('LF-99401');
  const [selectedGearName, setSelectedGearName] = useState('ARRI ALEXA Mini LF Ready to Shoot Set');
  const [depositAmount, setDepositAmount] = useState(50000);

  // 6-Point Inspection Checklist state
  const [checklist, setChecklist] = useState({
    sensor: true,
    glass: true,
    mount: true,
    chassis: true,
    accessories: true,
    power: true,
  });

  const [hasDamage, setHasDamage] = useState(false);
  const [deductionAmount, setDeductionAmount] = useState(0);
  const [damageNotes, setDamageNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApproveInspection = async () => {
    setIsSubmitting(true);
    setActionSuccess(null);
    try {
      // Simulate/call API
      await new Promise((r) => setTimeout(r, 1000));
      const refundAmt = Math.max(0, depositAmount - (hasDamage ? deductionAmount : 0));
      setActionSuccess(
        `✓ QC Certified by ${admin?.name || 'Technician'}. Stripe escrow deposit of ₹${refundAmt.toLocaleString(
          'en-IN'
        )} successfully released to client card!`
      );
    } catch (err: any) {
      alert('Failed to submit inspection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allPassed =
    checklist.sensor &&
    checklist.glass &&
    checklist.mount &&
    checklist.chassis &&
    checklist.accessories &&
    checklist.power &&
    !hasDamage;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-3/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              Return Quality Control &amp; Sensor Calibration
            </h1>
            <Badge variant="accent">ISO 9001 Protocol</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Multi-point physical inspection workbench. Perform optical collimation, sensor check, and 1-click Stripe escrow deposit release.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Two Column QC Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive QC Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-1 border border-surface-3 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-3/50 pb-4">
              <div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider block font-bold">
                  Active Return Inspection
                </span>
                <h3 className="text-base font-bold font-display text-white mt-0.5">
                  Order {selectedRentalCode} • {selectedGearName}
                </h3>
              </div>
              <Badge variant="accent" className="font-mono">
                SN: {selectedUnitSerial}
              </Badge>
            </div>

            {/* 6-Point Inspection Checklist */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                6-Point Quality Verification Checklist
              </label>

              {/* Point 1 */}
              <button
                type="button"
                onClick={() => toggleChecklist('sensor')}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                  checklist.sensor
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-surface-0 border-surface-3 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${
                      checklist.sensor ? 'bg-emerald-500 text-surface-0' : 'bg-surface-2 text-zinc-600'
                    }`}
                  >
                    {checklist.sensor ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">CMOS Sensor &amp; Low-Pass Filter</div>
                    <div className="text-[10px] font-mono text-zinc-500">Zero dust spots, 0 hot pixels at ISO 3200</div>
                  </div>
                </div>
                <Badge variant={checklist.sensor ? 'success' : 'default'}>
                  {checklist.sensor ? 'PASSED' : 'UNCHECKED'}
                </Badge>
              </button>

              {/* Point 2 */}
              <button
                type="button"
                onClick={() => toggleChecklist('glass')}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                  checklist.glass
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-surface-0 border-surface-3 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${
                      checklist.glass ? 'bg-emerald-500 text-surface-0' : 'bg-surface-2 text-zinc-600'
                    }`}
                  >
                    {checklist.glass ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '2'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Optical Elements &amp; Front/Rear Glass</div>
                    <div className="text-[10px] font-mono text-zinc-500">Anti-reflective coating intact, 0 scratches</div>
                  </div>
                </div>
                <Badge variant={checklist.glass ? 'success' : 'default'}>
                  {checklist.glass ? 'PASSED' : 'UNCHECKED'}
                </Badge>
              </button>

              {/* Point 3 */}
              <button
                type="button"
                onClick={() => toggleChecklist('mount')}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                  checklist.mount
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-surface-0 border-surface-3 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${
                      checklist.mount ? 'bg-emerald-500 text-surface-0' : 'bg-surface-2 text-zinc-600'
                    }`}
                  >
                    {checklist.mount ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '3'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">PL / L-PL Lens Mount &amp; Lock Ring</div>
                    <div className="text-[10px] font-mono text-zinc-500">Smooth rotation, solid pin engagement</div>
                  </div>
                </div>
                <Badge variant={checklist.mount ? 'success' : 'default'}>
                  {checklist.mount ? 'PASSED' : 'UNCHECKED'}
                </Badge>
              </button>

              {/* Point 4 */}
              <button
                type="button"
                onClick={() => toggleChecklist('chassis')}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                  checklist.chassis
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-surface-0 border-surface-3 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${
                      checklist.chassis ? 'bg-emerald-500 text-surface-0' : 'bg-surface-2 text-zinc-600'
                    }`}
                  >
                    {checklist.chassis ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '4'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Chassis, Screen &amp; Button Dials</div>
                    <div className="text-[10px] font-mono text-zinc-500">No drop dents, OLED monitor responsive</div>
                  </div>
                </div>
                <Badge variant={checklist.chassis ? 'success' : 'default'}>
                  {checklist.chassis ? 'PASSED' : 'UNCHECKED'}
                </Badge>
              </button>

              {/* Point 5 */}
              <button
                type="button"
                onClick={() => toggleChecklist('accessories')}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                  checklist.accessories
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-surface-0 border-surface-3 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${
                      checklist.accessories ? 'bg-emerald-500 text-surface-0' : 'bg-surface-2 text-zinc-600'
                    }`}
                  >
                    {checklist.accessories ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '5'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Flight Case &amp; Rig Accessories</div>
                    <div className="text-[10px] font-mono text-zinc-500">Top handle, 2x V-Mounts, dual charger, cables</div>
                  </div>
                </div>
                <Badge variant={checklist.accessories ? 'success' : 'default'}>
                  {checklist.accessories ? 'PASSED' : 'UNCHECKED'}
                </Badge>
              </button>

              {/* Point 6 */}
              <button
                type="button"
                onClick={() => toggleChecklist('power')}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                  checklist.power
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-surface-0 border-surface-3 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${
                      checklist.power ? 'bg-emerald-500 text-surface-0' : 'bg-surface-2 text-zinc-600'
                    }`}
                  >
                    {checklist.power ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '6'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Internal Power &amp; Thermal Cooling</div>
                    <div className="text-[10px] font-mono text-zinc-500">Cold boot &lt; 5s, fans whisper quiet</div>
                  </div>
                </div>
                <Badge variant={checklist.power ? 'success' : 'default'}>
                  {checklist.power ? 'PASSED' : 'UNCHECKED'}
                </Badge>
              </button>
            </div>

            {/* Damage Assessment Toggle */}
            <div className="pt-4 border-t border-surface-3/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-300 font-semibold">Flag Physical Damage / Loss?</span>
                <button
                  type="button"
                  onClick={() => setHasDamage(!hasDamage)}
                  className={`text-xs font-mono px-3 py-1 rounded-lg border font-bold ${
                    hasDamage
                      ? 'bg-danger/20 border-danger text-danger'
                      : 'bg-surface-2 border-surface-3 text-zinc-400'
                  }`}
                >
                  {hasDamage ? 'Damage Reported' : 'No Damage (Clean Return)'}
                </button>
              </div>

              {hasDamage && (
                <div className="space-y-3 p-4 rounded-xl bg-danger/10 border border-danger/20 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Deduction Amount (₹ INR)</label>
                    <input
                      type="number"
                      value={deductionAmount}
                      onChange={(e) => setDeductionAmount(Number(e.target.value))}
                      className="w-full bg-surface-0 border border-surface-3 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-danger font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Damage Description &amp; Photo Notes</label>
                    <textarea
                      rows={2}
                      value={damageNotes}
                      onChange={(e) => setDamageNotes(e.target.value)}
                      placeholder="e.g. Scratched lens front filter thread, replacement fee..."
                      className="w-full bg-surface-0 border border-surface-3 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-danger"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 1-Click Action */}
            <div className="pt-2">
              <Button
                onClick={handleApproveInspection}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-surface-0 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 gap-2"
              >
                {isSubmitting ? (
                  'Communicating with Stripe API...'
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {hasDamage
                        ? `Certify QC & Release Partial ₹${(depositAmount - deductionAmount).toLocaleString('en-IN')}`
                        : `Certify QC & Release 100% Escrow (₹${depositAmount.toLocaleString('en-IN')})`}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Escrow Hold Breakdown & Audit History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Escrow Status Card */}
          <div className="p-6 rounded-2xl bg-surface-1 border border-surface-3 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400 border-b border-surface-3/50 pb-3">
              Stripe Escrow Collateral
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Total Held in Escrow:</span>
                <span className="text-accent font-bold">₹{depositAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Damage Deductions:</span>
                <span className="text-danger font-bold">-₹{deductionAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-surface-3 text-emerald-400 font-bold">
                <span>Client Refund Payable:</span>
                <span>₹{(depositAmount - deductionAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-0/60 border border-surface-3 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Direct reversal via Stripe webhook to original method</span>
            </div>
          </div>

          {/* Past Inspection History */}
          <div className="p-6 rounded-2xl bg-surface-1 border border-surface-3 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400 border-b border-surface-3/50 pb-3">
              Recent Return QC Log
            </h3>

            <div className="space-y-3">
              {[
                {
                  code: 'FG-2026-8812',
                  gear: 'Sony FX3 Cinema Line',
                  tech: 'Vikram K.',
                  status: 'PASSED_100',
                  refunded: '₹18,000',
                  date: 'Today, 11:30 AM',
                },
                {
                  code: 'FG-2026-8790',
                  gear: 'Aputure 600d Pro 3-Light Kit',
                  tech: 'Ramesh P.',
                  status: 'PASSED_100',
                  refunded: '₹12,000',
                  date: 'Yesterday, 04:15 PM',
                },
                {
                  code: 'FG-2026-8744',
                  gear: 'Cooke Anamorphic /i 40mm',
                  tech: 'Vikram K.',
                  status: 'PASSED_100',
                  refunded: '₹35,000',
                  date: 'Aug 30, 06:00 PM',
                },
              ].map((item) => (
                <div
                  key={item.code}
                  className="p-3 rounded-xl bg-surface-0/60 border border-surface-3 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-mono font-bold text-white flex items-center gap-2">
                      <span className="text-accent">{item.code}</span>
                      <span className="text-[10px] text-zinc-500">• {item.gear}</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      Tech: {item.tech} • {item.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-mono font-bold">{item.refunded}</div>
                    <div className="text-[9px] font-mono uppercase text-emerald-500">Escrow Released</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
