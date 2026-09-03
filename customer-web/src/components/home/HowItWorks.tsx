'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Calendar, Truck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: <Camera className="w-6 h-6 text-accent" />,
      title: 'Choose Your Gear',
      desc: 'Browse calibrated cinema bodies, anamorphic lenses, lighting kits, and sound packages tested by certified lens technicians.',
    },
    {
      num: '02',
      icon: <Calendar className="w-6 h-6 text-info" />,
      title: 'Set Your Shoot Dates',
      desc: 'Lock shoot dates with real-time multi-day discounts (15% off 7+ days) and transparent refundable security deposit hold.',
    },
    {
      num: '03',
      icon: <Truck className="w-6 h-6 text-emerald-400" />,
      title: 'We Deliver to Your Set',
      desc: 'Drop exact GPS coordinates or choose vault pickup. Handed over with live digital QC condition reports.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 border-b border-surface-3 bg-surface-1/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="text-xs font-mono uppercase tracking-widest text-accent font-semibold mb-3">
            Seamless Logistics
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white tracking-tight">
            Engineered for Production Speed
          </h2>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            Zero bureaucratic rental paperwork. Direct mobile OTP authorization and instant deposit release on wrap.
          </p>
        </div>

        {/* 3-Step Horizontal Timeline */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connecting Line on Desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-gradient-to-r from-surface-3 via-surface-4 to-surface-3 z-0" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative z-10 bg-surface-1 border border-surface-3 rounded-2xl p-8 hover:border-surface-4 transition-all duration-300 group"
            >
              {/* Giant Step Number Background */}
              <div className="absolute top-4 right-6 text-7xl font-bold font-mono text-zinc-900 select-none group-hover:text-zinc-800 transition-colors">
                {step.num}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center mb-6 shadow-inner relative z-10">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold font-display text-white mb-2 relative z-10">
                {step.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed relative z-10">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
