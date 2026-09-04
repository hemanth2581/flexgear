'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, MapPin, Phone, Mail, Youtube, Instagram, Facebook, ShieldCheck, Sparkles, Smartphone, ArrowUpRight, Award, Clock, Truck } from 'lucide-react';
import { useLocation } from '@/components/providers/LocationProvider';

export function Footer() {
  const { setCity } = useLocation();

  return (
    <footer className="bg-cinema-bg text-cinema-text pt-16 pb-24 border-t border-cinema-border relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-accent/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Trust Pillars Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-cinema-surface border border-cinema-border mb-12 shadow-cinema-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-cinema-text">Optical Calibration</div>
              <div className="text-[11px] text-cinema-text-muted">Sensor cleaned & tested</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-cinema-text">90-Min On-Set Delivery</div>
              <div className="text-[11px] text-cinema-text-muted">Direct to production sets</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-cinema-text">Zero-Deposit KYC</div>
              <div className="text-[11px] text-cinema-text-muted">For verified creators</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-cinema-text">24/7 Shoot Hotline</div>
              <div className="text-[11px] text-cinema-text-muted">Emergency backup gear</div>
            </div>
          </div>
        </div>

        {/* Multi-Column Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: Brand Story & Hubs */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cinema-surface border border-cinema-border-strong flex items-center justify-center text-accent shadow-cinema-sm">
                <Camera className="w-5 h-5 text-accent" />
              </div>
              <span className="text-2xl font-black tracking-tight text-cinema-text font-heading flex items-center leading-none">
                FLEX<span className="text-accent">GEAR</span>
              </span>
            </Link>

            <p className="text-xs text-cinema-text-secondary leading-relaxed max-w-sm">
              FlexGear is South India’s premier cinema camera, anamorphic lens, and film production gear rental marketplace. Built for independent filmmakers, production houses, and commercial directors across Chennai, Bengaluru, Coimbatore, and Hyderabad.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-cinema-surface border border-cinema-border flex items-center justify-center text-cinema-text-muted hover:text-accent hover:border-accent transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-cinema-surface border border-cinema-border flex items-center justify-center text-cinema-text-muted hover:text-accent hover:border-accent transition"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-cinema-surface border border-cinema-border flex items-center justify-center text-cinema-text-muted hover:text-accent hover:border-accent transition"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Explore Cinema Gear */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-accent uppercase tracking-widest font-heading">Cinema Catalog</h5>
            <ul className="space-y-2 text-xs text-cinema-text-secondary">
              <li>
                <Link href="/equipment?category=cameras" className="hover:text-accent transition">
                  Cinema &amp; Mirrorless Cameras
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=lenses" className="hover:text-accent transition">
                  Cinema Primes &amp; Zooms
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=lighting" className="hover:text-accent transition">
                  Aputure &amp; Nanlite Studio LEDs
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=audio" className="hover:text-accent transition">
                  Sennheiser &amp; Rode 32-Bit Audio
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=gimbals" className="hover:text-accent transition">
                  DJI Ronin Gimbals &amp; Sliders
                </Link>
              </li>
              <li>
                <Link href="/equipment?category=kits" className="hover:text-accent transition">
                  Full Production Shooting Kits
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Policies */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-accent uppercase tracking-widest font-heading">Company &amp; Trust</h5>
            <ul className="space-y-2 text-xs text-cinema-text-secondary">
              <li>
                <Link href="/about" className="hover:text-accent transition">
                  About FlexGear
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-accent transition flex items-center gap-1 text-accent font-semibold">
                  <span>Partner With FlexGear</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/account/kyc" className="hover:text-accent transition">
                  Zero-Deposit KYC Process
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition">
                  Contact &amp; Studio Quotes
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition">
                  Rental Policy &amp; Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Production Hubs */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-accent uppercase tracking-widest font-heading">Hub Locations</h5>
            <ul className="space-y-2.5 text-xs text-cinema-text-secondary">
              <li className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-cinema-text font-bold">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>Chennai Hub</span>
                </div>
                <div className="text-[11px] text-cinema-text-muted pl-5">Ashok Nagar • +91 98840 39091</div>
              </li>
              <li className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-cinema-text font-bold">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>Bengaluru Hub</span>
                </div>
                <div className="text-[11px] text-cinema-text-muted pl-5">BTM Layout • +91 78457 91178</div>
              </li>
              <li className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-cinema-text font-bold">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>Coimbatore Hub</span>
                </div>
                <div className="text-[11px] text-cinema-text-muted pl-5">Gandhipuram • +91 88380 51796</div>
              </li>
              <li className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-cinema-text font-bold">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>Hyderabad Hub</span>
                </div>
                <div className="text-[11px] text-cinema-text-muted pl-5">Jubilee Hills • +91 98840 39091</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Location Switcher */}
        <div className="pt-8 border-t border-cinema-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cinema-text-muted">
          <p>
            © 2026 <strong className="text-cinema-text font-bold">FlexGear Rentals</strong>. All Rights Reserved. Professional Cinema Equipment.
          </p>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-cinema-text-disabled">Active Hub:</span>
            {['Chennai', 'Bengaluru', 'Coimbatore', 'Hyderabad'].map((city, idx) => (
              <React.Fragment key={city}>
                {idx > 0 && <span className="text-cinema-border">•</span>}
                <button
                  onClick={() => setCity(city)}
                  className="text-cinema-text-secondary hover:text-accent font-semibold transition cursor-pointer"
                >
                  {city}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
