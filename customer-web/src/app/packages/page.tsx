import React from 'react';
import Link from 'next/link';
import { Film, CheckCircle2, ShieldCheck, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Curated Production Packages & Kits | FlexGear',
  description: 'Turnkey cinema equipment bundles for commercial shoots, documentaries, music videos, and indie feature films.',
};

const packages = [
  {
    id: 'indie-cinema-creator-bundle',
    name: 'Indie Cinema Creator Master Package',
    tagline: 'The complete indie commercial kit with Sony FX3, GM glass, RS3 Pro gimbal & wireless audio',
    dailyPrice: 8500,
    weeklyPrice: 42500,
    savings: 'Save ₹3,500/day vs individual items',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    badge: 'Most Popular',
    includes: [
      'Sony FX3 Cinema Camera Body + XLR Top Handle',
      'Sony FE 24-70mm f/2.8 GM II Lens',
      'DJI RS 3 Pro Gimbal Stabilizer Combo',
      'RØDE Wireless PRO Dual-Channel Mic System',
      'Aputure 300d II Daylight LED + Light Dome',
      '2x 150Wh V-Mount Batteries + D-Tap Rig',
      '2x 160GB Type A CFexpress Cards',
    ],
  },
  {
    id: 'documentary-run-and-gun-kit',
    name: 'Documentary Run & Gun Audio-Visual Kit',
    tagline: 'Lightweight, ultra-reliable 4K 10-bit setup with Canon C70 & shotgun boom audio',
    dailyPrice: 7200,
    weeklyPrice: 36000,
    savings: 'Save ₹2,800/day vs individual items',
    image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    badge: 'Doc DP Pick',
    includes: [
      'Canon EOS C70 4K Cinema Camera (RF Mount)',
      'Canon RF 24-70mm f/2.8 L IS USM Lens',
      'Sennheiser MKH 416 Shotgun Mic + K-Tek Carbon Boom',
      'Zoom F6 32-Bit Float 6-Channel Field Recorder',
      '4x BP-A60 High-Capacity Batteries',
      '2x 256GB V90 SDXC Cards + Dual Charger',
    ],
  },
  {
    id: 'aerial-cine-commercial-bundle',
    name: 'Aerial & Commercial Lighting Master Package',
    tagline: 'Mavic 3 Pro Cine ProRes drone paired with Aputure 600d daylight powerhouse',
    dailyPrice: 9800,
    weeklyPrice: 49000,
    savings: 'Save ₹4,200/day vs individual items',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    badge: 'Commercial Grade',
    includes: [
      'DJI Mavic 3 Pro Cine (1TB Internal Apple ProRes)',
      'DJI RC Pro Remote Controller + 3x Flight Batteries',
      'Aputure LS 600d Pro Daylight LED (98,500 Lux)',
      'Aputure Light Dome 150 + Heavy C-Stand',
      'Nanlite PavoTube II 30X RGBWW 4ft Tube 2-Light Kit',
      'Pelican Waterproof Transport Flight Cases',
    ],
  },
];

export default function ProductionPackagesPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Turnkey Production Solutions
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Curated Cinema Packages
          </h1>
          <p className="text-neutral-400 text-lg">
            Battle-tested camera, lens, lighting, audio, and stabilization bundles configured for seamless on-set compatibility and massive rental savings.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5"
            >
              <div>
                <div className="relative h-60 bg-neutral-800">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-amber-500 text-neutral-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {pkg.badge}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{pkg.name}</h2>
                    <p className="text-neutral-400 text-sm">{pkg.tagline}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Daily Rate</span>
                      <div className="text-2xl font-extrabold text-amber-400">₹{pkg.dailyPrice.toLocaleString('en-IN')}<span className="text-xs text-neutral-400 font-normal">/day</span></div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-emerald-400 font-medium">{pkg.savings}</span>
                      <div className="text-xs text-neutral-400">Weekly: ₹{pkg.weeklyPrice.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs uppercase tracking-wider font-semibold text-neutral-300 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-amber-400" />
                      What's Included:
                    </span>
                    <ul className="space-y-2">
                      {pkg.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/equipment`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                >
                  Configure Dates & Book
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
