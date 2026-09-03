'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const brandLogos = [
    'ARRI',
    'RED DIGITAL CINEMA',
    'SONY CINE',
    'CANON CINEMA EOS',
    'DJI PRO',
    'APUTURE',
    'RØDE AUDIO',
    'BLACKMAGIC DESIGN',
    'COOKE OPTICS',
    'ZEISS CINEMA',
  ];

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden pt-16 pb-8 border-b border-surface-3 bg-surface-0">
      {/* Subtle Animated Gradient Mesh Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="ambient-amber-glow -top-20 left-1/4 animate-[pulse-subtle_8s_ease-in-out_infinite]" />
        <div className="ambient-blue-glow top-1/3 -right-20 animate-[pulse-subtle_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181B_1px,transparent_1px),linear-gradient(to_bottom,#18181B_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex-1 flex flex-col items-center justify-center py-12">
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-1/90 border border-surface-3 text-xs font-medium text-zinc-300 mb-8 backdrop-blur-xl shadow-2xl"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-zinc-300">Live Cinema Fleet Available for Production</span>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-muted text-accent border border-accent/20">
            Instant Dispatch
          </span>
        </motion.div>

        {/* Large Cinematic Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight max-w-4xl mx-auto leading-[1.05] mb-6"
        >
          Professional Cinema Equipment.{' '}
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            On Demand.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Rent ARRI, RED, Sony FX series, Cooke anamorphic primes, and pro lighting. Direct Firebase OTP authorization, verified film set GPS delivery, and 100% refundable deposit escrow.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link href="/equipment" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-accent hover:bg-accent-hover text-surface-0 font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-accent/20">
              Browse Equipment <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-surface-1 hover:bg-surface-2 text-zinc-300 hover:text-white border border-surface-3 hover:border-surface-4 font-semibold text-sm rounded-xl transition-all duration-200 active:scale-[0.98]">
              How It Works
            </button>
          </a>
        </motion.div>
      </div>

      {/* Brand Logos Infinite Marquee */}
      <div className="relative w-full overflow-hidden py-8 border-t border-surface-3/50 bg-surface-1/30">
        <div className="flex w-[200%] animate-marquee">
          <div className="flex justify-around w-full shrink-0 gap-8">
            {brandLogos.map((brand, i) => (
              <span
                key={`b1-${i}`}
                className="text-xs font-mono font-bold tracking-widest text-zinc-600 uppercase hover:text-zinc-400 transition-colors"
              >
                {brand}
              </span>
            ))}
          </div>
          <div className="flex justify-around w-full shrink-0 gap-8">
            {brandLogos.map((brand, i) => (
              <span
                key={`b2-${i}`}
                className="text-xs font-mono font-bold tracking-widest text-zinc-600 uppercase hover:text-zinc-400 transition-colors"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="flex justify-center pt-2">
        <a
          href="#how-it-works"
          aria-label="Scroll down to How It Works"
          className="text-zinc-600 hover:text-zinc-400 transition-colors flex flex-col items-center gap-1 text-[11px] font-mono"
        >
          <ChevronDown className="w-4 h-4 animate-bounce text-zinc-500" />
        </a>
      </div>
    </section>
  );
};
