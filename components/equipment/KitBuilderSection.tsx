'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/components/providers/CartProvider';
import { useToast } from '@/components/ui/toast';
import { Camera, Disc, Sun, Mic, Navigation, Sparkles, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, addDays } from 'date-fns';

const RIG_BODIES = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    name: 'Sony FX3 Cinema Line Full-Frame',
    price: 4000,
    deposit: 16000,
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80',
    tag: '4K 120p • 15+ Stops',
  },
  {
    id: '30000000-0000-0000-0000-000000000004',
    name: 'RED Komodo 6K Cinema Camera',
    price: 7500,
    deposit: 30000,
    img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&auto=format&fit=crop&q=80',
    tag: 'Global Shutter • 6K RAW',
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    name: 'Canon EOS C70 4K Cinema Camera',
    price: 4500,
    deposit: 18000,
    img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80',
    tag: 'Super 35 DGO • Internal ND',
  },
];

const RIG_LENSES = [
  {
    id: '30000000-0000-0000-0000-000000000011',
    name: 'Sony FE 24-70mm f/2.8 GM II',
    price: 1500,
    deposit: 6000,
    img: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&auto=format&fit=crop&q=80',
    tag: 'Flagship Zoom • f/2.8 Constant',
  },
  {
    id: '30000000-0000-0000-0000-000000000012',
    name: 'Sony FE 70-200mm f/2.8 GM OSS II',
    price: 1800,
    deposit: 7200,
    img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&auto=format&fit=crop&q=80',
    tag: 'Telephoto Cine • Lightweight',
  },
  {
    id: '30000000-0000-0000-0000-000000000014',
    name: 'Sigma 24-70mm f/2.8 DG DN Art',
    price: 1200,
    deposit: 4800,
    img: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&auto=format&fit=crop&q=80',
    tag: 'High Resolution Art Glass',
  },
];

const RIG_LIGHTS = [
  {
    id: '30000000-0000-0000-0000-000000000021',
    name: 'Aputure LS 600d Pro Daylight LED',
    price: 2500,
    deposit: 10000,
    img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&auto=format&fit=crop&q=80',
    tag: '600W Daylight • Weatherproof',
  },
  {
    id: '30000000-0000-0000-0000-000000000022',
    name: 'Aputure Amaran 200x Bi-Color LED',
    price: 1000,
    deposit: 4000,
    img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&auto=format&fit=crop&q=80',
    tag: '2700K-6500K Bi-Color',
  },
];

const RIG_AUDIO = [
  {
    id: '30000000-0000-0000-0000-000000000031',
    name: 'Rode Wireless PRO Dual Mic System',
    price: 900,
    deposit: 3600,
    img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&auto=format&fit=crop&q=80',
    tag: '32-bit Float • Timecode Sync',
  },
  {
    id: '30000000-0000-0000-0000-000000000032',
    name: 'Sennheiser MKH 416 Shotgun Mic Kit',
    price: 1500,
    deposit: 6000,
    img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&auto=format&fit=crop&q=80',
    tag: 'Industry Standard Location Audio',
  },
];

export function KitBuilderSection() {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [selectedBody, setSelectedBody] = useState(RIG_BODIES[0]);
  const [selectedLens, setSelectedLens] = useState(RIG_LENSES[0]);
  const [selectedLight, setSelectedLight] = useState<typeof RIG_LIGHTS[0] | null>(RIG_LIGHTS[0]);
  const [selectedAudio, setSelectedAudio] = useState<typeof RIG_AUDIO[0] | null>(RIG_AUDIO[0]);

  // Calculate prices
  const rawDailyTotal =
    selectedBody.price +
    selectedLens.price +
    (selectedLight ? selectedLight.price : 0) +
    (selectedAudio ? selectedAudio.price : 0);

  const rawDepositTotal =
    selectedBody.deposit +
    selectedLens.deposit +
    (selectedLight ? selectedLight.deposit : 0) +
    (selectedAudio ? selectedAudio.deposit : 0);

  // 15% Bundle Discount
  const discountedDaily = Math.round(rawDailyTotal * 0.85);
  const bundleSavings = rawDailyTotal - discountedDaily;

  const handleAddBundleToCart = () => {
    const today = new Date();
    const startDate = format(today, 'yyyy-MM-dd');
    const endDate = format(addDays(today, 2), 'yyyy-MM-dd');

    // Add selected camera body
    addToCart(
      {
        id: selectedBody.id,
        name: selectedBody.name,
        slug: selectedBody.name.toLowerCase().replace(/ /g, '-'),
        daily_price: selectedBody.price,
        security_deposit: selectedBody.deposit,
        image_url: selectedBody.img,
        rating: 4.95,
        review_count: 40,
        is_featured: true,
        is_active: true,
        category_id: '20000000-0000-0000-0000-000000000001',
        brand_id: '10000000-0000-0000-0000-000000000001',
        specs: {},
        included_accessories: [],
        created_at: new Date().toISOString(),
        description: 'Selected Cinema Rig Body',
      },
      startDate,
      endDate,
      1
    );

    // Add selected lens
    addToCart(
      {
        id: selectedLens.id,
        name: selectedLens.name,
        slug: selectedLens.name.toLowerCase().replace(/ /g, '-'),
        daily_price: selectedLens.price,
        security_deposit: selectedLens.deposit,
        image_url: selectedLens.img,
        rating: 4.9,
        review_count: 28,
        is_featured: true,
        is_active: true,
        category_id: '20000000-0000-0000-0000-000000000002',
        brand_id: '10000000-0000-0000-0000-000000000001',
        specs: {},
        included_accessories: [],
        created_at: new Date().toISOString(),
        description: 'Selected Cinema Rig Optics',
      },
      startDate,
      endDate,
      1
    );

    // Add selected light if any
    if (selectedLight) {
      addToCart(
        {
          id: selectedLight.id,
          name: selectedLight.name,
          slug: selectedLight.name.toLowerCase().replace(/ /g, '-'),
          daily_price: selectedLight.price,
          security_deposit: selectedLight.deposit,
          image_url: selectedLight.img,
          rating: 4.9,
          review_count: 25,
          is_featured: true,
          is_active: true,
          category_id: '20000000-0000-0000-0000-000000000003',
          brand_id: '10000000-0000-0000-0000-000000000011',
          specs: {},
          included_accessories: [],
          created_at: new Date().toISOString(),
          description: 'Selected Studio Lighting',
        },
        startDate,
        endDate,
        1
      );
    }

    // Add selected audio if any
    if (selectedAudio) {
      addToCart(
        {
          id: selectedAudio.id,
          name: selectedAudio.name,
          slug: selectedAudio.name.toLowerCase().replace(/ /g, '-'),
          daily_price: selectedAudio.price,
          security_deposit: selectedAudio.deposit,
          image_url: selectedAudio.img,
          rating: 4.9,
          review_count: 32,
          is_featured: true,
          is_active: true,
          category_id: '20000000-0000-0000-0000-000000000004',
          brand_id: '10000000-0000-0000-0000-000000000015',
          specs: {},
          included_accessories: [],
          created_at: new Date().toISOString(),
          description: 'Selected Production Audio',
        },
        startDate,
        endDate,
        1
      );
    }

    toast('🎉 Complete custom production rig added to cart with 15% bundle discount!', 'success');
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 mb-2">
            <Zap className="h-3.5 w-3.5" />
            <span>Interactive Rig Configurator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Build Your Custom Production Rig
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl mt-1">
            Pick your camera body, lens, lighting fixture, and audio gear. Automatically unlock 15% bundle savings.
          </p>
        </div>

        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-bold px-3 py-1.5 self-start md:self-auto">
          ⚡ 15% Instant Package Discount
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Step Selector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Camera Body */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-zinc-950 font-black text-xs">
                  1
                </span>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Camera className="h-4 w-4 text-amber-400" />
                  <span>Choose Cinema Camera Body</span>
                </h3>
              </div>
              <span className="text-[11px] text-zinc-400">Required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {RIG_BODIES.map((body) => {
                const isSelected = selectedBody.id === body.id;
                return (
                  <button
                    key={body.id}
                    onClick={() => setSelectedBody(body)}
                    className={`flex flex-col text-left rounded-xl border p-3 transition-all duration-200 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                        : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                    }`}
                  >
                    <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-zinc-900 mb-2">
                      <Image src={body.img} alt={body.name} fill sizes="160px" className="object-cover" />
                      {isSelected && (
                        <div className="absolute right-1.5 top-1.5 rounded-full bg-amber-500 p-0.5 text-zinc-950">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{body.name}</div>
                    <div className="text-[10px] text-amber-400/90 font-medium">{body.tag}</div>
                    <div className="mt-2 text-xs font-black text-white">
                      {formatCurrency(body.price)} <span className="text-[10px] text-zinc-500 font-normal">/day</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Cine Optics */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-zinc-950 font-black text-xs">
                  2
                </span>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Disc className="h-4 w-4 text-amber-400" />
                  <span>Choose Prime or Cine Zoom Lens</span>
                </h3>
              </div>
              <span className="text-[11px] text-zinc-400">Required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {RIG_LENSES.map((lens) => {
                const isSelected = selectedLens.id === lens.id;
                return (
                  <button
                    key={lens.id}
                    onClick={() => setSelectedLens(lens)}
                    className={`flex flex-col text-left rounded-xl border p-3 transition-all duration-200 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                        : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                    }`}
                  >
                    <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-zinc-900 mb-2">
                      <Image src={lens.img} alt={lens.name} fill sizes="160px" className="object-cover" />
                      {isSelected && (
                        <div className="absolute right-1.5 top-1.5 rounded-full bg-amber-500 p-0.5 text-zinc-950">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{lens.name}</div>
                    <div className="text-[10px] text-amber-400/90 font-medium">{lens.tag}</div>
                    <div className="mt-2 text-xs font-black text-white">
                      {formatCurrency(lens.price)} <span className="text-[10px] text-zinc-500 font-normal">/day</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Lighting & Audio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Lighting */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span>Add Studio Lighting</span>
                </h3>
                {selectedLight && (
                  <button onClick={() => setSelectedLight(null)} className="text-[10px] text-zinc-400 hover:text-rose-400">
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {RIG_LIGHTS.map((light) => {
                  const isSelected = selectedLight?.id === light.id;
                  return (
                    <button
                      key={light.id}
                      onClick={() => setSelectedLight(isSelected ? null : light)}
                      className={`flex items-center gap-3 w-full rounded-xl border p-2.5 text-left transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                      }`}
                    >
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-900 shrink-0">
                        <Image src={light.img} alt={light.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{light.name}</div>
                        <div className="text-[10px] text-zinc-400">{light.tag}</div>
                      </div>
                      <div className="text-xs font-bold text-amber-400 shrink-0">
                        +{formatCurrency(light.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audio */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Mic className="h-4 w-4 text-amber-400" />
                  <span>Add Location Audio</span>
                </h3>
                {selectedAudio && (
                  <button onClick={() => setSelectedAudio(null)} className="text-[10px] text-zinc-400 hover:text-rose-400">
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {RIG_AUDIO.map((audio) => {
                  const isSelected = selectedAudio?.id === audio.id;
                  return (
                    <button
                      key={audio.id}
                      onClick={() => setSelectedAudio(isSelected ? null : audio)}
                      className={`flex items-center gap-3 w-full rounded-xl border p-2.5 text-left transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                      }`}
                    >
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-900 shrink-0">
                        <Image src={audio.img} alt={audio.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{audio.name}</div>
                        <div className="text-[10px] text-zinc-400">{audio.tag}</div>
                      </div>
                      <div className="text-xs font-bold text-amber-400 shrink-0">
                        +{formatCurrency(audio.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Summary & 1-Click Booking */}
        <div className="rounded-2xl border border-amber-500/30 bg-zinc-900/90 p-6 space-y-6 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Configured Rig Summary</span>
              <Badge className="bg-amber-500 text-zinc-950 font-black text-[10px]">
                4-Piece Kit
              </Badge>
            </div>

            {/* Configured Item List */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="truncate pr-2 font-medium">📷 {selectedBody.name}</span>
                <span className="font-bold text-white shrink-0">{formatCurrency(selectedBody.price)}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="truncate pr-2 font-medium">🔍 {selectedLens.name}</span>
                <span className="font-bold text-white shrink-0">{formatCurrency(selectedLens.price)}</span>
              </div>
              {selectedLight && (
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="truncate pr-2 font-medium">💡 {selectedLight.name}</span>
                  <span className="font-bold text-white shrink-0">{formatCurrency(selectedLight.price)}</span>
                </div>
              )}
              {selectedAudio && (
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="truncate pr-2 font-medium">🎙️ {selectedAudio.name}</span>
                  <span className="font-bold text-white shrink-0">{formatCurrency(selectedAudio.price)}</span>
                </div>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Standard Daily Rate</span>
                <span className="line-through">{formatCurrency(rawDailyTotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Package Bundle Discount (15%)</span>
                <span>-{formatCurrency(bundleSavings)}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Total Refundable Security Deposit</span>
                <span>{formatCurrency(rawDepositTotal)}</span>
              </div>
            </div>

            {/* Total Daily Rate Highlight */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 flex items-baseline justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase text-zinc-400">Net Rig Rental Rate</div>
                <div className="text-[10px] text-zinc-500">Per shoot day</div>
              </div>
              <div className="text-2xl font-black text-amber-400">
                {formatCurrency(discountedDaily)}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={handleAddBundleToCart}
              className="w-full rounded-xl py-6 font-black text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 fill-current" />
              <span>Book Complete Rig Package</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Includes Pelican flight cases & all spare cables</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
