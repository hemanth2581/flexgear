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
    <div className="bg-[#f3f3f3] min-h-screen text-gray-900 pb-24">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-lenstiger">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/equipment" className="hover:text-lenstiger">
            Equipment
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {equipment.category && (
            <>
              <Link href={`/equipment?category=${equipment.category.slug}`} className="hover:text-lenstiger">
                {equipment.category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          <span className="text-gray-900 font-bold truncate max-w-xs">{equipment.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
        {/* Top Product Hero: Left Gallery & Right LensTiger Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery & Images (LensTiger Style) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex items-center justify-center relative aspect-square">
              <Image
                src={selectedImage}
                alt={equipment.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-4 transition-all duration-300"
                priority
              />
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-2xl bg-white p-1 border overflow-hidden shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-lenstiger ring-2 ring-lenstiger shadow-md'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain p-1" />
                </button>
              ))}
            </div>

            {/* Quick Guarantees Pill */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-2xs flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-lenstiger shrink-0" />
                <div className="text-xs">
                  <strong className="block text-gray-900">Zero Security Deposit</strong>
                  <span className="text-gray-500 text-[11px]">Instant KYC verification</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-2xs flex items-center gap-3">
                <Truck className="w-5 h-5 text-lenstiger shrink-0" />
                <div className="text-xs">
                  <strong className="block text-gray-900">90-Min Set Delivery</strong>
                  <span className="text-gray-500 text-[11px]">Available in {selectedCity}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Price & LensTiger Inline Price Calendar */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lenstiger-50 text-lenstiger font-bold text-xs mb-2">
                <span>{equipment.brand?.name || 'Pro Brand'}</span> •{' '}
                <span>{equipment.category?.name || 'Production Gear'}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 headingbold">
                {equipment.name}
              </h1>

              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                {equipment.description}
              </p>
            </div>

            {/* Product Price Calendar Card (LensTiger Signature) */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-lenstiger text-white px-5 py-3.5 flex items-center justify-between">
                <span className="font-black text-sm flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-gold" />
                  <span>Product Price Calendar</span>
                </span>

                <div className="flex items-center gap-2">
                  <select
                    value={currentMonthDate.getMonth()}
                    onChange={(e) => handleMonthChange(Number(e.target.value))}
                    className="bg-white/15 text-white border border-white/30 rounded-lg text-xs font-semibold px-2 py-1 focus:outline-none cursor-pointer"
                  >
                    {months.map((m, idx) => (
                      <option key={m} value={idx} className="text-gray-900 bg-white">
                        {m}
                      </option>
                    ))}
                  </select>

                  <select
                    value={yearNumber}
                    onChange={(e) => handleYearChange(Number(e.target.value))}
                    className="bg-white/15 text-white border border-white/30 rounded-lg text-xs font-semibold px-2 py-1 focus:outline-none cursor-pointer"
                  >
                    {years.map((y) => (
                      <option key={y} value={y} className="text-gray-900 bg-white">
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calendar Table */}
              <div className="p-4 sm:p-5">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs font-bold text-gray-600">
                      {daysOfWeek.map((d) => (
                        <th key={d} className="py-2 px-1">
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Math.ceil((daysInMonth.length + startDayOfWeek) / 7) }).map(
                      (_, weekIdx) => (
                        <tr key={weekIdx} className="border-b border-gray-100">
                          {Array.from({ length: 7 }).map((_, dayOfWeekIdx) => {
                            const dayNumber = weekIdx * 7 + dayOfWeekIdx - startDayOfWeek + 1;
                            const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth.length;

                            if (!isValidDay) {
                              return <td key={dayOfWeekIdx} className="py-2 px-1 bg-gray-50/50" />;
                            }

                            const dateObj = new Date(yearNumber, currentMonthDate.getMonth(), dayNumber);
                            const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            const isPastDate = dateObj < cleanToday;
                            const isSelected = isDateSelected(dateObj);

                            return (
                              <td
                                key={dayOfWeekIdx}
                                onClick={() => !isPastDate && handleDateClick(dateObj)}
                                className={`calendar-day py-2 px-1 rounded-lg border border-transparent ${
                                  isPastDate ? 'disabled-day' : ''
                                } ${isSelected ? 'selected-day' : ''}`}
                              >
                                <div className="font-bold text-xs">{dayNumber}</div>
                                <div
                                  className={`text-[10px] font-bold ${
                                    isSelected
                                      ? 'text-white'
                                      : isPastDate
                                      ? 'text-gray-400'
                                      : 'text-lenstiger'
                                  }`}
                                >
                                  ₹{baseDailyPrice.toLocaleString()}
                                </div>
                                {!isPastDate && (
                                  <div
                                    className={`text-[8px] line-through ${
                                      isSelected ? 'text-white/80' : 'text-gray-400'
                                    }`}
                                  >
                                    ₹{originalDailyPrice.toLocaleString()}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {/* Duration & Price Estimate Box */}
                <div className="mt-4 p-3 rounded-2xl bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 font-medium">Rental Period:</span>{' '}
                    <strong className="text-gray-900">
                      {startDate ? format(startDate, 'dd MMM yyyy') : 'Select Start'} →{' '}
                      {endDate ? format(endDate, 'dd MMM yyyy') : 'Select End'} ({rentalDays} Days)
                    </strong>
                  </div>

                  <div className="text-right">
                    <span className="text-gray-500">Estimated Total: </span>
                    <span className="text-base font-black text-lenstiger">
                      {formatCurrency(totalRentalCost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="px-5 py-2.5 rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-white font-bold text-xs shadow-sm transition active:scale-95 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp To Rent</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-gray-950 font-black text-xs shadow-md transition active:scale-95 flex items-center gap-2"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-gray-900 headingbold flex items-center gap-2">
              <Layers className="w-5 h-5 text-lenstiger" />
              <span>Technical Specifications</span>
            </h3>

            <div className="divide-y divide-gray-100 text-xs">
              {Object.entries(specs).length > 0 ? (
                Object.entries(specs).map(([key, val]) => (
                  <div key={key} className="py-2.5 flex justify-between">
                    <span className="text-gray-500 capitalize font-medium">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-gray-900 font-bold text-right">{val}</span>
                  </div>
                ))
              ) : (
                <div className="py-2 text-gray-500">Standard manufacturer specifications apply.</div>
              )}
            </div>
          </div>

          {/* Included in Box Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-gray-900 headingbold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-lenstiger" />
              <span>What's Included in the Rental Kit</span>
            </h3>

            <ul className="space-y-3 text-xs text-gray-700">
              {includedAccessories.map((acc, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-lenstiger-50 text-lenstiger flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <span className="font-semibold">{acc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 3: Related Products Carousel/Grid */}
        {relatedEquipment.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-900 headingbold">Related Products</h2>
              <p className="text-xs text-gray-500 mt-1">Recommended gear frequently paired together</p>
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
