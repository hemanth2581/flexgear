import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, User, Share2, Tag, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';

interface BlogPostProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  return {
    title: `${params.slug.replace(/-/g, ' ').toUpperCase()} | FlexGear Guides`,
    description: 'Technical cinema gear guide and field breakdown from FlexGear.',
  };
}

export default function BlogPostDetailPage({ params }: BlogPostProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all guides
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            Field Production Guide
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            How to Rig the Sony FX3 for Solo Run-and-Gun Cinema Commercials
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-400 pt-2 border-b border-neutral-800 pb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>Vikram Sundaram (Head of Camera Operations)</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span>August 28, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-500" />
              <span>6 min read</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop&q=80"
            alt="Sony FX3 Cinema Rig"
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-invert max-w-none space-y-6 text-neutral-300 text-lg leading-relaxed">
          <p className="text-xl text-neutral-200 font-medium">
            The Sony FX3 has fundamentally altered the indie commercial and music video filmmaking landscape. Compact yet boasting a 12.1MP full-frame BSI sensor with 15+ stops of dynamic range, it delivers cinema-grade pictures in an ultra-portable form factor.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">1. Power Distribution: V-Mount vs Internal NP-FZ100</h2>
          <p>
            While internal NP-FZ100 batteries offer around 90 minutes of continuous 4K 60p recording, swapping batteries on a busy shoot breaks cadence and requires recalibrating gimbals.
            By mounting a micro V-mount battery (such as the FXLION 98Wh Nano Two) via D-Tap to USB-C PD, you unlock over 6 hours of continuous runtime while simultaneously powering on-camera monitors and wireless focus motors.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">2. Monitoring & Low-Latency Video Transmission</h2>
          <p>
            Pairing the FX3 with the Hollyland Mars 4K transmitter allows client video village and the director to view uncompressed color accurate feeds with less than 0.06s latency. The top XLR handle also provides 2 phantom-powered balanced audio lines directly into 24-bit 4-channel audio tracks.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">3. Recommended Rental Kit Pairing</h2>
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              FlexGear Recommended Rig Kit
            </h3>
            <ul className="list-disc list-inside space-y-2 text-neutral-300 text-base">
              <li>Sony FX3 Full-Frame Cinema Line Body with XLR Top Handle</li>
              <li>Sony FE 24-70mm f/2.8 GM II Zoom Lens</li>
              <li>DJI RS 3 Pro Gimbal Stabilizer Combo</li>
              <li>2x FXLION Nano Two 98Wh V-Mount Batteries</li>
              <li>Type A 160GB TOUGH CFexpress High-Speed Cards</li>
            </ul>
            <div className="pt-2">
              <Link
                href="/equipment"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-neutral-950 font-bold text-sm hover:bg-amber-400 transition-colors"
              >
                Browse & Rent This Package
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
