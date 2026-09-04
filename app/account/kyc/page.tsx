'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Upload, CheckCircle2, AlertCircle, FileText, Sparkles, Building2, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function KycVerificationPage() {
  const [docType, setDocType] = useState<'AADHAAR' | 'GSTIN' | 'PAN' | 'PASSPORT' | 'FILM_GUILD'>('AADHAAR');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          docType,
          docNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit KYC verification.');
      }

      setIsVerified(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-3xl border border-cinema-border bg-cinema-card p-6 sm:p-8 space-y-4 shadow-cinema">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent border border-accent/30 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Zero-Deposit Privilege</span>
            </div>
            <h2 className="text-xl font-black text-cinema-text headingbold">
              Filmmaker &amp; Studio KYC Verification
            </h2>
            <p className="text-xs text-cinema-muted">
              Verify your identity to unlock zero-deposit equipment rentals, priority dispatch, and instant set delivery.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl border border-cinema-border bg-cinema-elevated p-4 space-y-1">
            <div className="text-xs font-bold text-cinema-text">₹0 Security Deposit</div>
            <div className="text-[11px] text-cinema-muted">Rent high-end cinema packages without large upfront escrow holds.</div>
          </div>
          <div className="rounded-2xl border border-cinema-border bg-cinema-elevated p-4 space-y-1">
            <div className="text-xs font-bold text-cinema-text">90-Min Fast-Track Dispatch</div>
            <div className="text-[11px] text-cinema-muted">Pre-cleared credentials enable immediate set delivery across all active hubs.</div>
          </div>
          <div className="rounded-2xl border border-cinema-border bg-cinema-elevated p-4 space-y-1">
            <div className="text-xs font-bold text-cinema-text">Official GST Invoicing</div>
            <div className="text-[11px] text-cinema-muted">Automated 18% GST input tax credit breakdown for production tax returns.</div>
          </div>
        </div>
      </div>

      {/* KYC Form or Verified State */}
      <div className="rounded-3xl border border-cinema-border bg-cinema-card p-6 sm:p-8 shadow-cinema">
        {isVerified ? (
          <div className="p-8 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-semantic-success/15 border border-semantic-success/30 text-semantic-success flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-cinema-text headingbold">KYC Verified Successfully!</h3>
            <p className="text-xs text-cinema-muted leading-relaxed">
              Your identity credentials for <strong>{fullName}</strong> ({docType}: {docNumber}) have been verified. Zero-deposit instant rental privileges are now active on your account.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/account">
                <Button variant="outline" className="text-xs font-bold border-cinema-border hover:bg-cinema-elevated">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/equipment">
                <Button className="bg-accent hover:bg-accent-hover text-cinema-bg font-black text-xs">
                  Book Cinema Gear →
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-cinema-border pb-4">
              <h3 className="text-base font-bold text-cinema-text headingbold">Submit Identity Details</h3>
              <p className="text-xs text-cinema-muted">Please provide your government or professional production credentials.</p>
            </div>

            {/* Document Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-cinema-text">Select Document Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: 'AADHAAR', label: 'Aadhaar Card' },
                  { id: 'GSTIN', label: 'Company GSTIN' },
                  { id: 'PAN', label: 'PAN Card' },
                  { id: 'PASSPORT', label: 'Passport' },
                  { id: 'FILM_GUILD', label: 'Film Union / Guild' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDocType(item.id as any)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition cursor-pointer text-center ${
                      docType === item.id
                        ? 'bg-accent/15 text-accent border-accent shadow-sm'
                        : 'bg-cinema-elevated text-cinema-muted border-cinema-border hover:text-cinema-text'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-cinema-text">Legal Full Name / Entity Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-cinema-muted absolute left-3 top-3" />
                  <Input
                    type="text"
                    required
                    placeholder="As printed on document"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-9 bg-cinema-elevated border-cinema-border text-cinema-text"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-cinema-text">Contact Mobile Number *</label>
                <Input
                  type="tel"
                  required
                  placeholder="+91 98840 39091"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-cinema-elevated border-cinema-border text-cinema-text font-mono"
                />
              </div>
            </div>

            {/* Document Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-cinema-text">
                {docType === 'AADHAAR'
                  ? 'Aadhaar Number (12 Digits)'
                  : docType === 'GSTIN'
                  ? '15-Digit GSTIN Number'
                  : docType === 'PAN'
                  ? 'PAN Number (10 Characters)'
                  : docType === 'PASSPORT'
                  ? 'Passport Number'
                  : 'Guild / Union Membership ID'} *
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-cinema-muted absolute left-3 top-3" />
                <Input
                  type="text"
                  required
                  placeholder={
                    docType === 'AADHAAR'
                      ? 'e.g. 5421 8934 1092'
                      : docType === 'GSTIN'
                      ? 'e.g. 33AAAAA0000A1Z5'
                      : 'e.g. ABCDE1234F'
                  }
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="pl-9 bg-cinema-elevated border-cinema-border text-cinema-text font-mono uppercase"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-semantic-error/15 border border-semantic-error/30 text-semantic-error text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-black text-xs uppercase tracking-wider shadow-cinema cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying Credentials...' : 'Submit & Verify KYC Tier →'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
