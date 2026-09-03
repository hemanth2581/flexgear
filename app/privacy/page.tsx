import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, FileText, CheckCircle2, Lock, RefreshCcw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Rental Terms | FlexGear',
  description: 'Rental agreement, KYC verification guidelines, equipment handling policies, and privacy standards at FlexGear.',
};

export default function PrivacyTermsPage() {
  return (
    <div className="bg-[#f3f3f3] min-h-screen py-10 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lenstiger-50 text-lenstiger font-bold text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FLEXGEAR RENTAL POLICIES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 headingbold">
            Terms of Service & Rental Agreement
          </h1>
          <p className="text-xs text-gray-500">
            Last Updated: August 2026 • Applicable across all FlexGear hubs (Chennai, Bengaluru, Coimbatore, Hyderabad)
          </p>

          <div className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700 space-y-6 pt-4">
            <div className="space-y-2 pt-4">
              <h2 className="text-base font-black text-gray-900 headingbold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lenstiger" />
                <span>1. KYC Verification & Identity</span>
              </h2>
              <p className="leading-relaxed text-gray-600">
                To guarantee zero-deposit equipment rentals, hirers must complete KYC verification with a valid Government ID (Aadhaar / Passport / Driving License) and professional work profile (Portfolio, IMDb, Instagram, or Company GSTIN). FlexGear reserves the right to request a refundable hold deposit if KYC criteria are incomplete.
              </p>
            </div>

            <div className="space-y-2 pt-6">
              <h2 className="text-base font-black text-gray-900 headingbold flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-lenstiger" />
                <span>2. Rental Period & Extension Policy</span>
              </h2>
              <p className="leading-relaxed text-gray-600">
                Standard 1-day rentals constitute a 24-hour cycle from the agreed pick-up / delivery timestamp. Shoot extensions must be notified via WhatsApp at least 4 hours prior to the scheduled return window to ensure no scheduling conflicts with subsequent bookings.
              </p>
            </div>

            <div className="space-y-2 pt-6">
              <h2 className="text-base font-black text-gray-900 headingbold flex items-center gap-2">
                <Lock className="w-4 h-4 text-lenstiger" />
                <span>3. Equipment Care & Insurance</span>
              </h2>
              <p className="leading-relaxed text-gray-600">
                All cameras, glass optics, and lighting fixtures are dispatched in factory-tested condition with sensor cleaning stamps. Hirers are responsible for safe custody during the rental period. Comprehensive production transit insurance covers manufacturer defects, while physical damage or water exposure remains the hirer's responsibility.
              </p>
            </div>

            <div className="space-y-2 pt-6">
              <h2 className="text-base font-black text-gray-900 headingbold flex items-center gap-2">
                <FileText className="w-4 h-4 text-lenstiger" />
                <span>4. Privacy & Data Security</span>
              </h2>
              <p className="leading-relaxed text-gray-600">
                FlexGear strictly protects your personal contact details, IDs, and billing credentials under 256-bit encryption. We never sell or share customer data with third-party advertising brokers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
