'use client';

import React from 'react';
import { Camera, ShieldCheck, Award, Headphones } from 'lucide-react';

export const TrustSignals: React.FC = () => {
  const signals = [
    {
      icon: <Camera className="w-5 h-5 text-accent" />,
      title: '500+ Equipment Units',
      subtitle: 'ARRI, RED, Sony, Canon, Cooke & Zeiss',
    },
    {
      icon: <Award className="w-5 h-5 text-info" />,
      title: 'ISO 9001 Warehouse',
      subtitle: 'Clean-room collimated and sensor tested',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: 'Fully Insured Rigs',
      subtitle: 'Comprehensive transit & on-set coverage',
    },
    {
      icon: <Headphones className="w-5 h-5 text-amber-400" />,
      title: '24/7 Set Support',
      subtitle: 'Dedicated technician dispatch line',
    },
  ];

  return (
    <section className="py-12 border-b border-surface-3 bg-surface-1/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {signals.map((sig, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface-1 border border-surface-3">
              <div className="p-3 rounded-lg bg-surface-2 border border-surface-3 shrink-0">
                {sig.icon}
              </div>
              <div>
                <div className="text-sm font-bold font-display text-white">{sig.title}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{sig.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
