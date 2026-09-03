'use client';

import React from 'react';
import Link from 'next/link';
import { Film, ShieldCheck, Zap, RotateCcw, MapPin, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-surface-3 bg-surface-0 text-zinc-400 text-sm">
      {/* Guarantees Trust Bar */}
      <div className="border-b border-surface-3 py-10 bg-surface-1/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-surface-2 border border-surface-3 text-accent shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-display">Zero-Risk Escrow</h4>
              <p className="text-xs text-zinc-500 mt-0.5">100% deposit refund on clean inspection</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-surface-2 border border-surface-3 text-accent shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-display">Instant Verification</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Direct Firebase Phone OTP security</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-surface-2 border border-surface-3 text-emerald-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-display">Sensor Calibrated</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Checked by certified ARRI/Sony tech</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-surface-2 border border-surface-3 text-info shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-display">Doorstep Set Delivery</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Drop GPS coordinates straight to set</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-2 border border-surface-3 flex items-center justify-center text-accent">
              <Film className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-white">
              FLEX<span className="text-accent">GEAR</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
            The cinema industry standard equipment rental platform. Providing high-end production houses and cinematographers with RED, ARRI, Sony Cine, Canon RF, Cooke optics, and studio lighting with instant escrow release.
          </p>
          
          {/* Newsletter Input */}
          <div className="pt-2">
            <div className="text-xs text-zinc-300 font-semibold mb-2">Subscribe to Fleet Updates</div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="producer@studio.film"
                className="flex-1 bg-surface-1 border border-surface-3 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-accent hover:bg-accent-hover text-surface-0 font-semibold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0"
              >
                Join <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-display">Cinema Fleet</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/equipment?category=cameras" className="text-zinc-400 hover:text-white transition-colors">Cinema Camera Bodies</Link></li>
            <li><Link href="/equipment?category=lenses" className="text-zinc-400 hover:text-white transition-colors">Prime & Anamorphic Lenses</Link></li>
            <li><Link href="/equipment?category=lighting" className="text-zinc-400 hover:text-white transition-colors">Aputure & Pro Lighting</Link></li>
            <li><Link href="/equipment?category=audio" className="text-zinc-400 hover:text-white transition-colors">32-Bit Float Audio Mics</Link></li>
            <li><Link href="/equipment?category=kits" className="text-zinc-400 hover:text-white transition-colors">Complete Production Kits</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-display">Client Portal</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/rentals" className="text-zinc-400 hover:text-white transition-colors">My Shoot Bookings</Link></li>
            <li><Link href="/profile" className="text-zinc-400 hover:text-white transition-colors">Security Deposit Escrow</Link></li>
            <li><Link href="/profile" className="text-zinc-400 hover:text-white transition-colors">Official GST Tax Invoices</Link></li>
            <li><Link href="/wishlist" className="text-zinc-400 hover:text-white transition-colors">Saved Gear Vault</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-display">Vault Hub</h4>
          <p className="text-xs text-zinc-400 mb-2 leading-relaxed">
            Main Fleet Vault: Film City, Goregaon East, Mumbai 400065
          </p>
          <p className="text-xs text-zinc-400 font-mono">Emergency: +91 98765 43210</p>
          <p className="text-xs text-zinc-500 mt-3 font-mono">support@flexgear.film</p>
        </div>
      </div>

      <div className="border-t border-surface-3 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600 font-mono">
          <div>© {new Date().getFullYear()} FlexGear Cinema Technologies. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/equipment" className="hover:text-zinc-400 transition-colors">Terms of Rental</Link>
            <span>·</span>
            <Link href="/equipment" className="hover:text-zinc-400 transition-colors">Damage Waiver Policy</Link>
            <span>·</span>
            <Link href="/equipment" className="hover:text-zinc-400 transition-colors">Security Escrow</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
