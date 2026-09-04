'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Equipment } from '@/types/equipment';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { PriceCalendarModal } from '@/components/equipment/PriceCalendarModal';
import { useCart } from '@/components/providers/CartProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import { formatCurrency } from '@/lib/utils';
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Check,
  ShoppingCart,
  Calendar as CalendarIcon,
  Sparkles,
  Phone,
  Layers,
  Wrench,
  CheckCircle2,
  Camera,
  ArrowRight,
} from 'lucide-react';
import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

interface ProductDetailViewProps {
  equipment: Equipment;
  relatedEquipment: Equipment[];
}

export function ProductDetailView({ equipment, relatedEquipment }: ProductDetailViewProps) {
  const { addToCart } = useCart();
  const { selectedCity, selectedCityData } = useLocation();

  const today = new Date();
  const [selectedImage, setSelectedImage] = useState<string>(equipment.image_url);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(today);
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(addDays(today, 1));
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);

  // Modal for related products
  const [modalEquipment, setModalEquipment] = useState<Equipment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthName = format(currentMonthDate, 'MMMM');
  const yearNumber = currentMonthDate.getFullYear();

  const handleMonthChange = (monthIdx: number) => {
    setCurrentMonthDate(new Date(yearNumber, monthIdx, 1));
  };

  const handleYearChange = (year: number) => {
    setCurrentMonthDate(new Date(year, currentMonthDate.getMonth(), 1));
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonthDate),
    end: endOfMonth(currentMonthDate),
  });

  const startDayOfWeek = getDay(startOfMonth(currentMonthDate));
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (date: Date) => {
    const cleanDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (cleanDate < cleanToday) return;

    if (!startDate || (startDate && endDate && !isSelectingEnd)) {
      setStartDate(cleanDate);
      setEndDate(null);
      setIsSelectingEnd(true);
    } else if (isSelectingEnd && startDate) {
      if (cleanDate < startDate) {
        setStartDate(cleanDate);
        setEndDate(startDate);
      } else if (isSameDay(cleanDate, startDate)) {
        setEndDate(addDays(cleanDate, 1));
      } else {
        setEndDate(cleanDate);
      }
      setIsSelectingEnd(false);
    }
  };

  const isDateSelected = (date: Date) => {
    if (!startDate) return false;
    const cleanDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (endDate) {
      return cleanDate >= startDate && cleanDate <= endDate;
    }
    return isSameDay(cleanDate, startDate);
  };

  const calculateDays = () => {
    if (!startDate) return 1;
    if (!endDate) return 1;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const rentalDays = calculateDays();
  const baseDailyPrice = equipment.daily_price;
  const originalDailyPrice = Math.round(baseDailyPrice * 1.25);
  const totalRentalCost = baseDailyPrice * rentalDays;

  const handleAddToCart = () => {
    const startIso = format(startDate || today, 'yyyy-MM-dd');
    const endIso = format(endDate || addDays(today, 1), 'yyyy-MM-dd');
    addToCart(equipment, startIso, endIso, 1);
    setAddedToCartSuccess(true);
    setTimeout(() => setAddedToCartSuccess(false), 2500);
  };

  const handleWhatsApp = () => {
    const startStr = startDate ? format(startDate, 'dd MMM yyyy') : format(today, 'dd MMM yyyy');
    const endStr = endDate ? format(endDate, 'dd MMM yyyy') : format(addDays(today, 1), 'dd MMM yyyy');
    const msg = encodeURIComponent(
      `Hi FlexGear, I would like to rent ${equipment.name} in ${selectedCity} from ${startStr} to ${endStr} (${rentalDays} days). Is this available?`
    );
    const phone = selectedCityData.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone || '919884039091'}?text=${msg}`, '_blank');
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = [yearNumber, yearNumber + 1];

  const galleryImages = [
    equipment.image_url,
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
  ];

  const specs = (equipment.specs as Record<string, string>) || {};
  const includedAccessories = Array.isArray(equipment.included_accessories)
    ? equipment.included_accessories
    : ['Main Camera Body / Fixture', '2x High-Capacity Batteries', 'Dual Fast Charger', 'Pelican Rugged Flight Case'];

  return (
    <div className="bg-cinema-bg min-h-screen text-cinema-text pb-24">
      {/* Breadcrumb Bar */}
      <div className="bg-cinema-surface border-b border-cinema-border py-3 px-4 shadow-cinema-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-cinema-text-muted">
          <Link href="/" className="hover:text-accent transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/equipment" className="hover:text-accent transition">
            Equipment
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {equipment.category && (
            <>
              <Link href={`/equipment?category=${equipment.category.slug}`} className="hover:text-accent transition">
                {equipment.category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          <span className="text-cinema-text font-bold truncate max-w-xs">{equipment.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
        {/* Top Product Hero: Left Gallery & Right Price Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery & Images */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-cinema-surface rounded-3xl p-8 border border-cinema-border shadow-cinema-md flex items-center justify-center relative aspect-square">
              <Image
                src={selectedImage}
                alt={equipment.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6 transition-all duration-300"
                priority
              />
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cinema-bg/90 backdrop-blur-sm border border-cinema-border text-xs text-semantic-success font-semibold">
                <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse-dot" />
                <span>Verified Available in {selectedCity}</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-2xl bg-cinema-surface p-1 border overflow-hidden shrink-0 transition-all cursor-pointer ${
                    selectedImage === img
                      ? 'border-accent ring-2 ring-accent/30 shadow-cinema-accent'
                      : 'border-cinema-border hover:border-cinema-border-strong'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain p-1" />
                </button>
              ))}
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-cinema-surface rounded-2xl p-4 border border-cinema-border shadow-cinema-sm flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
                <div className="text-xs">
                  <strong className="block text-cinema-text">Zero Security Deposit</strong>
                  <span className="text-cinema-text-muted text-[11px]">Instant KYC approval</span>
                </div>
              </div>

              <div className="bg-cinema-surface rounded-2xl p-4 border border-cinema-border shadow-cinema-sm flex items-center gap-3">
                <Truck className="w-5 h-5 text-accent shrink-0" />
                <div className="text-xs">
                  <strong className="block text-cinema-text">90-Min On-Set Delivery</strong>
                  <span className="text-cinema-text-muted text-[11px]">Available across {selectedCity}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Price & Date-wise Price Calendar */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent font-bold text-xs mb-3 border border-accent/30 shadow-cinema-glow">
                <span>{equipment.brand?.name || 'Pro Brand'}</span> •{' '}
                <span>{equipment.category?.name || 'Production Gear'}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-cinema-text font-heading">
                {equipment.name}
              </h1>

              <p className="text-xs sm:text-sm text-cinema-text-secondary mt-2.5 leading-relaxed">
                {equipment.description}
              </p>
            </div>

            {/* Product Price Calendar Card */}
            <div className="bg-cinema-surface rounded-3xl border border-cinema-border shadow-cinema-md overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-cinema-tertiary border-b border-cinema-border text-cinema-text px-6 py-4 flex items-center justify-between">
                <span className="font-bold text-sm flex items-center gap-2 font-heading">
                  <CalendarIcon className="w-4 h-4 text-accent" />
                  <span>Select Shoot Dates &amp; Check Rates</span>
                </span>

                <div className="flex items-center gap-2">
                  <select
                    value={currentMonthDate.getMonth()}
                    onChange={(e) => handleMonthChange(Number(e.target.value))}
                    className="bg-cinema-surface text-cinema-text border border-cinema-border rounded-xl text-xs font-semibold px-2.5 py-1 focus:outline-none cursor-pointer"
                  >
                    {months.map((m, idx) => (
                      <option key={m} value={idx} className="text-cinema-text bg-cinema-surface">
                        {m}
                      </option>
                    ))}
                  </select>

                  <select
                    value={yearNumber}
                    onChange={(e) => handleYearChange(Number(e.target.value))}
                    className="bg-cinema-surface text-cinema-text border border-cinema-border rounded-xl text-xs font-semibold px-2.5 py-1 focus:outline-none cursor-pointer"
                  >
                    {years.map((y) => (
                      <option key={y} value={y} className="text-cinema-text bg-cinema-surface">
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calendar Table */}
              <div className="p-5">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="border-b border-cinema-border text-xs font-bold text-cinema-text-muted">
                      {daysOfWeek.map((d) => (
                        <th key={d} className="py-2.5 px-1 font-heading">
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Math.ceil((daysInMonth.length + startDayOfWeek) / 7) }).map(
                      (_, weekIdx) => (
                        <tr key={weekIdx} className="border-b border-cinema-border/40">
                          {Array.from({ length: 7 }).map((_, dayOfWeekIdx) => {
                            const dayNumber = weekIdx * 7 + dayOfWeekIdx - startDayOfWeek + 1;
                            const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth.length;

                            if (!isValidDay) {
                              return <td key={dayOfWeekIdx} className="py-2 px-1 bg-cinema-bg/30" />;
                            }

                            const dateObj = new Date(yearNumber, currentMonthDate.getMonth(), dayNumber);
                            const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            const isPastDate = dateObj < cleanToday;
                            const isSelected = isDateSelected(dateObj);

                            return (
                              <td
                                key={dayOfWeekIdx}
                                onClick={() => !isPastDate && handleDateClick(dateObj)}
                                className={`py-2 px-1 rounded-xl transition-all cursor-pointer ${
                                  isPastDate ? 'opacity-30 cursor-not-allowed' : 'hover:bg-cinema-tertiary'
                                } ${isSelected ? 'bg-accent text-cinema-bg font-black shadow-cinema-sm' : ''}`}
                              >
                                <div className={`font-bold text-xs ${isSelected ? 'text-cinema-bg font-black' : 'text-cinema-text'}`}>
                                  {dayNumber}
                                </div>
                                <div
                                  className={`text-[10px] font-bold ${
                                    isSelected
                                      ? 'text-cinema-bg'
                                      : isPastDate
                                      ? 'text-cinema-text-disabled'
                                      : 'text-accent'
                                  }`}
                                >
                                  ₹{baseDailyPrice.toLocaleString()}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {/* Duration & Price Estimate Box */}
                <div className="mt-5 p-4 rounded-2xl bg-cinema-tertiary border border-cinema-border flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-cinema-text-muted">Rental Period:</span>{' '}
                    <strong className="text-cinema-text">
                      {startDate ? format(startDate, 'dd MMM yyyy') : 'Select Start'} →{' '}
                      {endDate ? format(endDate, 'dd MMM yyyy') : 'Select End'} ({rentalDays} Days)
                    </strong>
                  </div>

                  <div className="text-right">
                    <span className="text-cinema-text-muted">Estimated Total: </span>
                    <span className="text-lg font-black text-accent font-heading">
                      {formatCurrency(totalRentalCost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 bg-cinema-tertiary/50 border-t border-cinema-border flex items-center justify-end gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="px-5 py-3 rounded-xl bg-semantic-success hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Reservation</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-black text-xs uppercase tracking-wider shadow-cinema-accent transition active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{addedToCartSuccess ? 'Added to Cart!' : 'Rent Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Technical Specifications & Included in Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Specifications Card */}
          <div className="bg-cinema-surface rounded-3xl p-6 sm:p-8 border border-cinema-border shadow-cinema-sm space-y-4">
            <h3 className="text-lg font-black text-cinema-text font-heading flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent" />
              <span>Technical Specifications</span>
            </h3>

            <div className="divide-y divide-cinema-border text-xs">
              {Object.entries(specs).length > 0 ? (
                Object.entries(specs).map(([key, val]) => (
                  <div key={key} className="py-2.5 flex justify-between">
                    <span className="text-cinema-text-muted capitalize font-medium">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-cinema-text font-bold text-right">{val}</span>
                  </div>
                ))
              ) : (
                <div className="py-2 text-cinema-text-muted">Standard manufacturer specifications apply.</div>
              )}
            </div>
          </div>

          {/* Included in Box Card */}
          <div className="bg-cinema-surface rounded-3xl p-6 sm:p-8 border border-cinema-border shadow-cinema-sm space-y-4">
            <h3 className="text-lg font-black text-cinema-text font-heading flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span>What's Included in the Rental Kit</span>
            </h3>

            <ul className="space-y-3 text-xs text-cinema-text-secondary">
              {includedAccessories.map((acc, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <span className="font-semibold text-cinema-text">{acc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 3: Related Products Grid */}
        {relatedEquipment.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-cinema-text font-heading">Frequently Paired Equipment</h2>
              <p className="text-xs text-cinema-text-secondary">Recommended optical lenses, rigs, and accessories</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {relatedEquipment.map((gear) => (
                <EquipmentCard
                  key={gear.id}
                  equipment={gear}
                  onViewPricing={(eq) => {
                    setModalEquipment(eq);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal for Related Products */}
      <PriceCalendarModal
        equipment={modalEquipment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalEquipment(null);
        }}
      />
    </div>
  );
}
