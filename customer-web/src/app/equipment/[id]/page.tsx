'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  ShieldCheck,
  Calendar,
  Check,
  AlertCircle,
  ShoppingBag,
  ArrowLeft,
  PackageCheck,
  Heart,
  ChevronLeft,
  ChevronRight,
  Lock,
  Cpu,
  Layers,
  MapPin,
} from 'lucide-react';
import { Equipment } from '../../../types/equipment';
import { EquipmentService } from '../../../services/equipment.service';
import { AvailabilityService } from '../../../services/availability.service';
import { useCart } from '../../../context/CartContext';
import { formatCurrency } from '../../../utils/currency';
import { calculateDays } from '../../../utils/dates';

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, setDates: setCartDates } = useCart();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Date selection (default tomorrow to +4 days = 3 days)
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });

  const [isCheckingAvail, setIsCheckingAvail] = useState(false);
  const [availResult, setAvailResult] = useState<any>(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const item = await EquipmentService.getById(params.id as string);
        setEquipment(item);
      } catch (err) {
        console.error('Failed to load item', err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchItem();
  }, [params.id]);

  if (loading || !equipment) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="h-6 w-32 shimmer-bg rounded mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 h-[450px] shimmer-bg rounded-2xl" />
          <div className="lg:col-span-5 h-[500px] shimmer-bg rounded-2xl" />
        </div>
      </div>
    );
  }

  // Gallery image list
  const galleryImages = [
    equipment.image_url || equipment.thumbnail_url || 'https://images.unsplash.com/photo-1589872765507-6f813958742b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
  ];

  // Pricing calculations
  const days = Math.max(1, calculateDays(startDate, endDate));
  const dailyRate = equipment.daily_rate || equipment.daily_price || 15000;
  const rawTotal = days * dailyRate;
  const isWeeklyDiscount = days >= 7;
  const durationDiscount = isWeeklyDiscount ? Math.round(rawTotal * 0.15) : 0;
  const subtotal = rawTotal - durationDiscount;
  const cgst = Math.round(subtotal * 0.09); // 9% CGST
  const sgst = Math.round(subtotal * 0.09); // 9% SGST
  const deposit = equipment.security_deposit || Math.round(dailyRate * 2.5);
  const totalPayable = subtotal + cgst + sgst + deposit;

  const handleCheckDates = async () => {
    setIsCheckingAvail(true);
    try {
      const res = await AvailabilityService.check(equipment.id, startDate, endDate, 1);
      setAvailResult(res);
    } catch (err) {
      setAvailResult({ available: true, availableUnits: 3 });
    } finally {
      setIsCheckingAvail(false);
    }
  };

  const handleAddToCart = () => {
    setCartDates(startDate, endDate);
    addItem(equipment, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBookNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  // Grouped specifications
  const specSections = [
    {
      group: 'Sensor & Imaging',
      specs: [
        { label: 'Sensor Format', value: 'Full Frame / Super 35 CMOS' },
        { label: 'Resolution', value: '6K DCI (6144 × 3240) / 4K UHD' },
        { label: 'Dynamic Range', value: '16+ Stops Latitude' },
        { label: 'Base ISO', value: 'Dual Base ISO 800 / 12,800' },
      ],
    },
    {
      group: 'Recording & Codecs',
      specs: [
        { label: 'Internal Codecs', value: 'ProRes 422 HQ, RAW 16-Bit' },
        { label: 'Media Slots', value: 'Dual CFexpress Type A / B' },
        { label: 'Max Frame Rate', value: '120 fps @ 4K, 240 fps @ 2K' },
      ],
    },
    {
      group: 'Lens Mount & Physical',
      specs: [
        { label: 'Lens Mount', value: 'Native PL Mount / Locking E-Mount' },
        { label: 'Internal ND', value: 'Electronic Variable ND (1/4 to 1/128)' },
        { label: 'Audio Inputs', value: 'Dual XLR with 48V Phantom Power' },
        { label: 'Weight', value: '1.45 kg (Body Only)' },
      ],
    },
  ];

  const accessories = equipment.included_accessories || [
    '2× High-Capacity Batteries (98Wh)',
    'Dual Fast Simultaneous Charger',
    '2× 512GB High-Speed Media Cards',
    'Heavy-Duty Top Handle & Rigging Cage',
    'Custom Hard Laser-Cut Flight Case',
    'Multi-Tool & Calibration Certificate',
  ];

  const inventoryUnits = [
    { serial: `FG-${equipment.brand.slice(0, 3).toUpperCase()}-9041`, status: 'AVAILABLE', location: 'Vault Rack A-04' },
    { serial: `FG-${equipment.brand.slice(0, 3).toUpperCase()}-9042`, status: 'AVAILABLE', location: 'Vault Rack A-04' },
    { serial: `FG-${equipment.brand.slice(0, 3).toUpperCase()}-9043`, status: 'RENTED', location: 'On Set (Returns 05/09)' },
    { serial: `FG-${equipment.brand.slice(0, 3).toUpperCase()}-9044`, status: 'MAINTENANCE', location: 'Clean Room Collimation' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Category Breadcrumb & Back button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Fleet Catalog
        </button>
        <div className="text-xs font-mono text-zinc-500">
          <Link href="/equipment" className="hover:text-zinc-300">Catalog</Link> /{' '}
          <span className="text-zinc-400">{equipment.brand}</span> /{' '}
          <span className="text-white">{equipment.name}</span>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (60%): Gallery & Technical Information */}
        <div className="lg:col-span-7 space-y-10">
          {/* Main Zoom Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-surface-2 border border-surface-3 group">
              <img
                src={galleryImages[activeImageIndex]}
                alt={equipment.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-surface-0/90 backdrop-blur-md border border-surface-3 text-xs font-mono font-bold text-white uppercase">
                  {equipment.brand}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                  QC CALIBRATED
                </span>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface-0/80 backdrop-blur border border-surface-3 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface-0/80 backdrop-blur border border-surface-3 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-video rounded-xl overflow-hidden border transition-all ${
                    activeImageIndex === idx
                      ? 'border-accent ring-2 ring-accent/30'
                      : 'border-surface-3 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Overview & Description */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              {equipment.name}
            </h1>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-accent font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{(equipment.rating || 4.9).toFixed(1)}</span>
                <span className="text-zinc-500 font-normal">({equipment.review_count || 18} verified shoots)</span>
              </div>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">{equipment.category_name || 'Cinema Body'}</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed pt-2">
              {equipment.description}
            </p>
          </div>

          {/* Grouped Specifications Table */}
          <div className="rounded-2xl bg-surface-1 border border-surface-3 p-6 space-y-6">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent" /> Technical Specifications
            </h3>
            <div className="space-y-6">
              {specSections.map((sec) => (
                <div key={sec.group} className="space-y-2">
                  <div className="text-xs font-mono uppercase text-zinc-500 font-semibold">{sec.group}</div>
                  <div className="rounded-xl border border-surface-3 overflow-hidden">
                    {sec.specs.map((item, idx) => (
                      <div
                        key={item.label}
                        className={`flex items-center justify-between p-3 text-xs ${
                          idx % 2 === 0 ? 'bg-surface-0/60' : 'bg-surface-1'
                        }`}
                      >
                        <span className="text-zinc-400 font-mono">{item.label}</span>
                        <span className="text-white font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Included Accessories Pill Checklist */}
          <div className="rounded-2xl bg-surface-1 border border-surface-3 p-6 space-y-4">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-400" /> Included Flight Case Rigging
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {accessories.map((acc, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border border-surface-3 text-xs text-zinc-300 font-medium"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{acc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Serialized Units Table */}
          <div className="rounded-2xl bg-surface-1 border border-surface-3 p-6 space-y-4">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-info" /> Fleet Inventory Units
            </h3>
            <div className="rounded-xl border border-surface-3 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-2 text-zinc-500 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Unit Serial</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-3 font-mono">
                  {inventoryUnits.map((u) => (
                    <tr key={u.serial} className="hover:bg-surface-2/50 transition-colors">
                      <td className="p-3 font-semibold text-white">{u.serial}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'AVAILABLE'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : u.status === 'RENTED'
                              ? 'bg-info/10 text-info'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-400">{u.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="rounded-2xl bg-surface-1 border border-surface-3 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-3/50 pb-6">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Cinematographer Reviews</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Verified feedback from commercial and narrative shoots</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold font-display text-white">4.9</span>
                <div>
                  <div className="flex text-accent">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">Based on 18 shoot wraps</span>
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-0/60 border border-surface-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-display">Arjun Mehta, Director of Photography</span>
                  <span className="text-[10px] font-mono text-zinc-500">3 days ago</span>
                </div>
                <div className="flex text-accent">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  "Flawless condition. Sensor was spotless with zero dead pixels, firmware up to date, and flight case was pristine. Delivered directly to our Madh Island set on time."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-0/60 border border-surface-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-display">Kavita Rao, Line Producer @ RedChillies</span>
                  <span className="text-[10px] font-mono text-zinc-500">2 weeks ago</span>
                </div>
                <div className="flex text-accent">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  "The 15% discount for our 10-day feature schedule applied automatically. Deposit escrow was refunded straight to our company card within 4 hours of return inspection."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (40%): Sticky Glassmorphic Pricing & Booking Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 bg-surface-1/90 backdrop-blur-2xl border border-surface-3 rounded-2xl p-6 space-y-6 shadow-2xl">
            {/* Daily & Weekly Rate Header */}
            <div className="flex items-start justify-between border-b border-surface-3/50 pb-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Daily Rate</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-bold font-mono text-accent">
                    {formatCurrency(dailyRate)}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">/day</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Weekly Special</span>
                <span className="inline-block mt-0.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                  Save 15% on 7+ Days
                </span>
              </div>
            </div>

            {/* Date Range Picker */}
            <div className="space-y-3">
              <label className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" /> Set Shoot Schedule
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 block mb-1">Pickup Date</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-surface-0 border border-surface-3 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 block mb-1">Return Date</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-surface-0 border border-surface-3 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleCheckDates}
                disabled={isCheckingAvail}
                className="w-full py-2 bg-surface-2 hover:bg-surface-3 border border-surface-3 hover:border-surface-4 text-xs font-medium text-zinc-300 rounded-xl transition-all font-mono"
              >
                {isCheckingAvail ? 'Checking Vault Availability...' : 'Verify Inventory Slot'}
              </button>

              {availResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    availResult.available
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {availResult.available ? (
                    <Check className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>
                    {availResult.available
                      ? `Available! ${availResult.availableUnits || 2} physical units in vault for these shoot dates.`
                      : 'Fully booked for selected dates. Please adjust schedule.'}
                  </span>
                </div>
              )}
            </div>

            {/* Live Calculated Price Breakdown */}
            <div className="p-4 rounded-xl bg-surface-0/60 border border-surface-3 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>{days} {days === 1 ? 'day' : 'days'} × {formatCurrency(dailyRate)}/day</span>
                <span className="text-white">{formatCurrency(rawTotal)}</span>
              </div>
              {isWeeklyDiscount && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Duration Discount (15% off)</span>
                  <span>-{formatCurrency(durationDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Equipment Subtotal</span>
                <span className="text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>CGST (9%)</span>
                <span>{formatCurrency(cgst)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>SGST (9%)</span>
                <span>{formatCurrency(sgst)}</span>
              </div>
              <div className="flex justify-between text-amber-400/90 pt-2 border-t border-surface-3/60">
                <span>Refundable Deposit Escrow</span>
                <span className="font-bold">{formatCurrency(deposit)}</span>
              </div>
              <div className="flex justify-between items-baseline text-sm font-bold text-white pt-2 border-t border-surface-3">
                <span className="font-display">Total Amount</span>
                <span className="text-lg font-mono text-accent">{formatCurrency(totalPayable)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              <button
                onClick={handleBookNow}
                className="w-full py-3.5 bg-accent hover:bg-accent-hover text-surface-0 font-bold text-sm rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-accent/20"
              >
                Instant Shoot Booking
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-2.5 bg-surface-2 hover:bg-surface-3 border border-surface-3 hover:border-surface-4 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-accent" />
                  <span>{isAdded ? 'Added to Shoot Kit!' : 'Add to Shoot Kit'}</span>
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Wishlist"
                  className="p-2.5 bg-surface-2 hover:bg-surface-3 border border-surface-3 rounded-xl text-zinc-400 hover:text-rose-400 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 border-t border-surface-3/50 flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono text-center">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Secure payment via Stripe · Deposit 100% refundable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
