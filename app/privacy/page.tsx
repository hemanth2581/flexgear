import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, FileText, CheckCircle2, Lock, RefreshCcw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Rental Terms | FlexGear',
  description: 'Rental agreement, KYC verification guidelines, equipment handling policies, and privacy standards at FlexGear.',
};

export default function PrivacyTermsPage() {
  return (
    <div className="bg-cinema-bg min-h-screen py-10 text-cinema-text">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="bg-cinema-card rounded-3xl p-8 sm:p-12 border border-cinema-border shadow-cinema space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FLEXGEAR RENTAL POLICIES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-cinema-text headingbold">
            Terms of Service &amp; Rental Agreement
          </h1>
          <p className="text-xs text-cinema-muted">
            Last Updated: August 2026 • Applicable across all FlexGear hubs (Chennai, Bengaluru, Coimbatore, Hyderabad, Kochi, Mumbai)
          </p>

          <div className="divide-y divide-cinema-border text-xs sm:text-sm text-cinema-muted space-y-6 pt-4">
            <div className="space-y-2 pt-4">
              <h2 className="text-base font-black text-cinema-text headingbold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>1. KYC Verification &amp; Identity</span>
              </h2>
              <p className="leading-relaxed text-cinema-muted">
                To guarantee zero-deposit equipment rentals, hirers must complete KYC verification with a valid Government ID (Aadhaar / Passport / Driving License) and professional work profile (Portfolio, IMDb, Instagram, or Company GSTIN). FlexGear reserves the right to request a refundable hold deposit if KYC criteria are incomplete.
              </p>
            </div>

            <div className="space-y-2 pt-6">
              <h2 className="text-base font-black text-cinema-text headingbold flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-accent" />
                <span>2. Rental Period &amp; Extension Policy</span>
              </h2>
              <p className="leading-relaxed text-cinema-muted">
                Standard 1-day rentals constitute a 24-hour cycle from the agreed pick-up / delivery timestamp. Shoot extensions must be notified via WhatsApp at least 4 hours prior to the scheduled return window to ensure no scheduling conflicts with subsequent bookings.
              </p>
            </div>

            <div className="space-y-2 pt-6">
              <h2 className="text-base font-black text-cinema-text headingbold flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent" />
                <span>3. Equipment Care &amp; Insurance</span>
              </h2>
              <p className="leading-relaxed text-cinema-muted">
                All cameras, glass optics, and lighting fixtures are dispatched in factory-tested condition with sensor cleaning stamps. Hirers are responsible for safe custody during the rental period. Comprehensive production transit insurance covers manufacturer defects, while physical damage or water exposure remains the hirer's responsibility.
              </p>
            </div>

            <div className="space-y-2 pt-6">
              <h2 className="text-base font-black text-cinema-text headingbold flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <span>4. Privacy &amp; Data Security</span>
              </h2>
              <p className="leading-relaxed text-cinema-muted">
                FlexGear strictly protects your personal contact details, IDs, and billing credentials under 256-bit encryption. We never sell or share customer data with third-party advertising brokers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
