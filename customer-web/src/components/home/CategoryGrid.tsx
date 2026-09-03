'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const categories = [
    {
      name: 'Cinema Cameras',
      slug: 'cameras',
      count: '14 Units',
      desc: 'ARRI Alexa Mini LF, RED V-Raptor, Sony FX6 / FX3',
      image: 'https://images.unsplash.com/photo-1589872765507-6f813958742b?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Anamorphic & Cine Primes',
      slug: 'lenses',
      count: '28 Sets',
      desc: 'Cooke Full Frame Plus, Zeiss Supreme, Atlas Orion',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Studio & Location Lighting',
      slug: 'lighting',
      count: '32 Kits',
      desc: 'Aputure 1200d Pro, Nanlite Forza, Astera Titan Tubes',
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Field Audio & Wireless',
      slug: 'audio',
      count: '18 Systems',
      desc: 'Sound Devices 833, Sennheiser MKH 416, Wisycom',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Gimbals & Motion Control',
      slug: 'stabilizers',
      count: '12 Systems',
      desc: 'DJI Ronin 2, Tilta Hydra Alien, Steadicam M-2',
      image: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Turnkey Production Packages',
      slug: 'kits',
      count: '8 Bundles',
      desc: 'Complete camera, optics, grip, power & monitoring combos',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section className="py-24 border-b border-surface-3 bg-surface-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-accent font-semibold mb-2">
              Curated Cinema Fleet
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white tracking-tight">
              Browse by Department
            </h2>
          </div>
          <Link
            href="/equipment"
            className="text-xs font-mono font-semibold text-accent hover:text-accent-hover flex items-center gap-1.5 transition-colors"
          >
            View All Categories <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Link
                href={`/equipment?category=${cat.slug}`}
                className="group relative block h-72 rounded-2xl overflow-hidden border border-surface-3 hover:border-surface-4 transition-all duration-300 shadow-lg"
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Dark Cinematic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-surface-0/60 to-surface-0/20 group-hover:via-surface-0/40 transition-colors duration-300" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-full bg-surface-0/80 backdrop-blur-md border border-surface-3 text-[10px] font-mono text-zinc-300 font-semibold">
                    {cat.count}
                  </span>
                </div>

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-0/60 backdrop-blur-md border border-surface-3 flex items-center justify-center text-zinc-400 group-hover:text-accent group-hover:border-accent/30 transition-all">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

                {/* Bottom Content with Hover Shift */}
                <div className="absolute bottom-0 inset-x-0 p-6 transform group-hover:-translate-y-1 transition-transform duration-300">
                  <h3 className="text-xl font-bold font-display text-white group-hover:text-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
