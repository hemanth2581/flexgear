'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Film, ShieldCheck, Sparkles, Check, ArrowLeft } from 'lucide-react';
import { LoginForm } from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950 font-sans">
      {/* Background Image Container with cinematic overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cinema-lens-login-bg.jpg"
          alt="Cinematic Camera Lens Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 filter brightness-75 contrast-110 motion-safe:transition-transform motion-safe:duration-1000"
        />
        {/* Multi-layered cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/60 to-zinc-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.85)_100%)]" />
      </div>

      {/* Ambient optical glow highlights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-20 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link 
          href="/" 
          className="flex items-center gap-2 group transition-transform duration-200 hover:scale-105"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 group-hover:border-amber-500/50 shadow-lg shadow-amber-500/10 transition-all">
            <Film className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white font-display">
            FLEX<span className="text-amber-400">GEAR</span>
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white backdrop-blur-md transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-28 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Side: Cinematic Branding & Value Propositions (Desktop View) */}
        <div className="hidden lg:flex flex-col max-w-lg text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono w-fit backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>INDIA'S PREMIER CINEMA GEAR NETWORK</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight font-display">
            The Filmmaker’s <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
              Rental Vault.
            </span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Instant booking for ARRI ALEXA 35, RED V-Raptor, Sony Venice 2, Cookes, and Cooke/Zeiss Master Primes with automated deposit escrow and 24/7 technical support.
          </p>

          <div className="space-y-3 pt-2">
            {[
              '100% Calibrated & Sensor-Inspected Equipment',
              'Fast Phone SMS Verification — No Passwords Needed',
              'Insured Transport & Same-Day Production Dispatch',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center gap-4 text-xs font-mono text-zinc-400">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-400">DP</div>
              <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-400">DIR</div>
              <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400">PROD</div>
            </div>
            <span>Trusted by 4,500+ Directors &amp; Cinematographers</span>
          </div>
        </div>

        {/* Right Side: Glassmorphism Login Card */}
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>

      {/* Bottom Footer Note */}
      <footer className="absolute bottom-4 left-0 right-0 z-20 text-center text-[11px] font-mono text-zinc-500 pointer-events-none">
        FlexGear Cinema Equipment Platform &bull; Secured with 256-Bit SSL &bull; Supabase Auth
      </footer>
    </div>
  );
}
