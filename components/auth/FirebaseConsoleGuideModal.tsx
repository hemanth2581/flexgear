'use client';

import React from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Key,
  Globe,
  CheckCircle2,
  Copy,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

interface FirebaseConsoleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FirebaseConsoleGuideModal({ isOpen, onClose }: FirebaseConsoleGuideModalProps) {
  const { toast } = useToast();

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast(`${label} copied to clipboard!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-gray-200 text-gray-900 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl shrink-0">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800">
                Setup Guide
              </span>
              <span className="text-xs font-semibold text-gray-400">Firebase Console</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 headingbold mt-1">
              How to Configure Firebase Phone OTP
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Follow these simple steps in the Firebase Console to enable phone authentication and instant testing.
            </p>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-4">
          {/* Step 1: Enable Phone Provider */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-lenstiger text-white font-bold text-xs">
                  1
                </span>
                <h3 className="text-sm font-bold text-gray-900">Enable Phone Sign-in Provider</h3>
              </div>
              <a
                href="https://console.firebase.google.com/project/_/authentication/providers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-lenstiger hover:underline font-semibold flex items-center gap-1"
              >
                <span>Open Firebase Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-gray-600 pl-8">
              In Firebase Console, navigate to <strong>Build &gt; Authentication &gt; Sign-in method</strong> tab. Click on <strong>Phone</strong> and toggle <strong>Enable</strong>.
            </p>
          </div>

          {/* Step 2: Add Test Phone Numbers */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs">
                2
              </span>
              <h3 className="text-sm font-bold text-gray-900">
                Add Test Phone Numbers (Zero-Cost &amp; Instant)
              </h3>
            </div>
            <p className="text-xs text-gray-600 pl-8">
              Under the Phone provider settings in Firebase Console, expand <strong>&quot;Phone numbers for testing&quot;</strong>. You can add test credentials so you never burn SMS quota during development:
            </p>
            <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Phone Number</div>
                  <div className="text-xs font-mono font-bold text-gray-900">+91 98765 43210</div>
                </div>
                <button
                  onClick={() => copyToClipboard('+919876543210', 'Test Phone')}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Test OTP Code</div>
                  <div className="text-xs font-mono font-bold text-amber-600">123456</div>
                </div>
                <button
                  onClick={() => copyToClipboard('123456', 'Test OTP')}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Authorized Domains */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-lenstiger text-white font-bold text-xs">
                3
              </span>
              <h3 className="text-sm font-bold text-gray-900">Check Authorized Domains</h3>
            </div>
            <p className="text-xs text-gray-600 pl-8">
              In <strong>Authentication &gt; Settings &gt; Authorized domains</strong>, verify that <code className="bg-gray-200 px-1 py-0.5 rounded text-[11px] font-mono">localhost</code> is listed (it is added by default).
            </p>
          </div>

          {/* Step 4: Environment Variables */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-lenstiger text-white font-bold text-xs">
                4
              </span>
              <h3 className="text-sm font-bold text-gray-900">Add Web App Keys in .env.local</h3>
            </div>
            <p className="text-xs text-gray-600 pl-8">
              Go to <strong>Project Settings (gear icon) &gt; General &gt; Your apps &gt; Web app (&lt;/&gt;)</strong> and paste into <code className="bg-gray-200 px-1 py-0.5 rounded text-[11px] font-mono">.env.local</code>:
            </p>
            <div className="pl-8">
              <pre className="p-3 bg-gray-900 text-gray-100 text-[11px] font-mono rounded-xl overflow-x-auto">
{`NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abcdef`}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Works with both live SMS &amp; Test Numbers</span>
          </div>
          <Button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-lenstiger hover:bg-lenstiger-dark text-white font-bold text-xs px-5"
          >
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
}
