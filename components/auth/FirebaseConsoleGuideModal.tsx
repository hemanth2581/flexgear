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
  AlertTriangle,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cinema-surface rounded-3xl shadow-cinema-xl border border-cinema-border text-cinema-text p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-cinema-muted hover:text-cinema-text hover:bg-cinema-elevated transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-accent/15 text-accent border border-accent/30 rounded-2xl shrink-0">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-accent/20 text-accent border border-accent/30">
                Setup Checklist
              </span>
              <span className="text-xs font-semibold text-cinema-muted">Firebase Project: flex-gear-9d899</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-cinema-text font-heading mt-1">
              Firebase Phone OTP &amp; SMS Configuration
            </h2>
            <p className="text-xs text-cinema-muted mt-0.5">
              Follow these 4 essential steps in the Firebase Console to enable live SMS and instant testing.
            </p>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-4">
          {/* Step 1: Enable Phone Provider */}
          <div className="p-4 rounded-2xl bg-cinema-elevated border border-cinema-border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-cinema-bg font-bold text-xs">
                  1
                </span>
                <h3 className="text-sm font-bold text-cinema-text">1. Enable Phone Sign-in Method</h3>
              </div>
              <a
                href="https://console.firebase.google.com/project/flex-gear-9d899/authentication/providers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline font-semibold flex items-center gap-1"
              >
                <span>Open Firebase Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-cinema-muted pl-8">
              Navigate to <strong>Authentication &gt; Sign-in method</strong> tab. Click on <strong>Phone</strong> and verify that <strong>Enable</strong> is toggled ON.
            </p>
          </div>

          {/* Step 2: SMS Region Policy (CRITICAL FIX) */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-cinema-bg font-bold text-xs">
                  2
                </span>
                <h3 className="text-sm font-bold text-cinema-text flex items-center gap-1.5">
                  <span>2. Enable SMS Region Policy (India +91)</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono">
                    Required for +91 SMS
                  </span>
                </h3>
              </div>
              <a
                href="https://console.firebase.google.com/project/flex-gear-9d899/authentication/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Settings</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-cinema-muted pl-8">
              In <strong>Authentication &gt; Settings &gt; SMS Region Policy</strong>, click <strong>Edit</strong> and ensure <strong>India (+91)</strong> is in the allowed countries list (or select &quot;Allow all regions&quot;).
            </p>
          </div>

          {/* Step 3: Authorized Domains */}
          <div className="p-4 rounded-2xl bg-cinema-elevated border border-cinema-border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-cinema-bg font-bold text-xs">
                  3
                </span>
                <h3 className="text-sm font-bold text-cinema-text">3. Add Authorized Production Domain</h3>
              </div>
              <button
                onClick={() => copyToClipboard('flexgear-rental.vercel.app', 'Vercel Domain')}
                className="text-xs text-accent hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Copy Domain</span>
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-cinema-muted pl-8">
              In <strong>Authentication &gt; Settings &gt; Authorized domains</strong>, click <strong>Add domain</strong> and enter: <code className="bg-cinema-bg text-accent px-1.5 py-0.5 rounded text-[11px] font-mono border border-cinema-border">flexgear-rental.vercel.app</code>.
            </p>
          </div>

          {/* Step 4: Add Test Phone Numbers */}
          <div className="p-4 rounded-2xl bg-cinema-elevated border border-cinema-border space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-cinema-bg font-bold text-xs">
                4
              </span>
              <h3 className="text-sm font-bold text-cinema-text">
                4. Test Phone Numbers (Zero-Cost &amp; Instant)
              </h3>
            </div>
            <p className="text-xs text-cinema-muted pl-8">
              Under <strong>Authentication &gt; Sign-in method &gt; Phone &gt; &quot;Phone numbers for testing&quot;</strong>, add test credentials to test instantly without consuming SMS quotas:
            </p>
            <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 bg-cinema-bg rounded-xl border border-cinema-border flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-cinema-muted">Test Phone Number</div>
                  <div className="text-xs font-mono font-bold text-cinema-text">+91 98765 43210</div>
                </div>
                <button
                  onClick={() => copyToClipboard('+919876543210', 'Test Phone')}
                  className="p-1.5 text-cinema-muted hover:text-cinema-text hover:bg-cinema-elevated rounded-lg cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 bg-cinema-bg rounded-xl border border-cinema-border flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-cinema-muted">Fixed Test OTP</div>
                  <div className="text-xs font-mono font-bold text-accent">123456</div>
                </div>
                <button
                  onClick={() => copyToClipboard('123456', 'Test OTP')}
                  className="p-1.5 text-cinema-muted hover:text-cinema-text hover:bg-cinema-elevated rounded-lg cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-cinema-border">
          <div className="flex items-center gap-1.5 text-xs text-cinema-muted">
            <CheckCircle2 className="w-4 h-4 text-semantic-success" />
            <span>Works with both live SMS &amp; instant test numbers</span>
          </div>
          <Button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-bold text-xs px-5 shadow-cinema-accent"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
