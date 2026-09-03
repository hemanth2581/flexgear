import React from 'react';
import { Camera, ShieldCheck, Award, Users, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About FlexGear | Cinema Equipment Rental Platform',
  description: 'Learn about FlexGear, our rigorous cleanroom gear preparation standards, and our mission to empower cinematographers across India.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            Empowering Visual Storytellers
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Built by Cinematographers, Engineered for Sets.
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed">
            FlexGear is South India's premier cinema, camera, lighting, and audio rental ecosystem. We eliminate gear anxiety on production sets through certified optical collimation, sensor cleanliness guarantees, and frictionless online bookings.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">100%</div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Tested Before Dispatch</div>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">1,200+</div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Shoots Powered</div>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">3 Hubs</div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Bengaluru, Chennai, CBE</div>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">4.96 ★</div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider">Filmmaker Rating</div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Cleanroom Prep Quality</h2>
            <p className="text-sm text-neutral-400">
              Every sensor is inspected under high-magnification UV lamps and wet-cleaned in ISO-certified clean benches prior to pack-out.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Transparent Escrow Deposits</h2>
            <p className="text-sm text-neutral-400">
              Zero hassle security deposit holding with automated Stripe refunds within 2 hours of equipment return and QC check.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">24/7 Set Concierge</h2>
            <p className="text-sm text-neutral-400">
              Need an extra V-mount battery, wireless video transmitter, or macro tube on set at 2 AM? Our emergency runners dispatch on demand.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-amber-500/10 border border-amber-500/30 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready for your next production?</h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm">
            Reserve cameras, fast lenses, lighting grids, and sound packages with live real-time inventory locking.
          </p>
          <div>
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-neutral-950 font-bold text-sm hover:bg-amber-400 transition-colors"
            >
              Explore Equipment Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
