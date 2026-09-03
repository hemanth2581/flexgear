'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Equipment } from '@/types/equipment';
import { useCart } from '@/components/providers/CartProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import { formatCurrency } from '@/lib/utils';
import {
  X,
  Calendar as CalendarIcon,
  ShoppingCart,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { format, addDays, isBefore, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isPast } from 'date-fns';

interface PriceCalendarModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PriceCalendarModal({ equipment, isOpen, onClose }: PriceCalendarModalProps) {
  const { addToCart } = useCart();
  const { selectedCityData } = useLocation();

  const today = new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(today);
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(addDays(today, 1));
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStartDate(today);
      setEndDate(addDays(today, 1));
      setCurrentMonthDate(today);
      setAddedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen || !equipment) return null;

  const monthName = format(currentMonthDate, 'MMMM');
  const yearNumber = currentMonthDate.getFullYear();

  const handleMonthChange = (monthIdx: number) => {
    const newDate = new Date(yearNumber, monthIdx, 1);
    setCurrentMonthDate(newDate);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(year, currentMonthDate.getMonth(), 1);
    setCurrentMonthDate(newDate);
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonthDate),
    end: endOfMonth(currentMonthDate),
  });

  const startDayOfWeek = getDay(startOfMonth(currentMonthDate)); // 0 for Sunday
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Handle date selection
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

  // Calculate rental days & cost
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

  // WhatsApp click handler
  const handleWhatsApp = () => {
    const startStr = startDate ? format(startDate, 'dd MMM yyyy') : format(today, 'dd MMM yyyy');
    const endStr = endDate ? format(endDate, 'dd MMM yyyy') : format(addDays(today, 1), 'dd MMM yyyy');
    const msg = encodeURIComponent(
      `Hi FlexGear, I am interested in renting ${equipment.name} in ${selectedCityData.name} from ${startStr} to ${endStr} (${rentalDays} days). Is it available?`
    );
    const phone = selectedCityData.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone || '919884039091'}?text=${msg}`, '_blank');
  };

  // Add to Cart handler
  const handleAddToCart = () => {
    const startIso = format(startDate || today, 'yyyy-MM-dd');
    const endIso = format(endDate || addDays(today, 1), 'yyyy-MM-dd');
    addToCart(equipment, startIso, endIso, 1);
    setAddedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [yearNumber, yearNumber + 1];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-lenstiger text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gold" />
            <h4 className="text-lg font-bold text-white headingbold">Price Calendar</h4>
          </div>

          <div className="flex items-center gap-2">
            {/* Month Dropdown */}
            <select
              value={currentMonthDate.getMonth()}
              onChange={(e) => handleMonthChange(Number(e.target.value))}
              className="bg-white/15 text-white border border-white/30 rounded-lg text-xs font-semibold px-2.5 py-1.5 focus:outline-none focus:bg-white/25 cursor-pointer"
            >
              {months.map((m, idx) => (
                <option key={m} value={idx} className="text-gray-900 bg-white">
                  {m}
                </option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              value={yearNumber}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="bg-white/15 text-white border border-white/30 rounded-lg text-xs font-semibold px-2.5 py-1.5 focus:outline-none focus:bg-white/25 cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y} className="text-gray-900 bg-white">
                  {y}
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition ml-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Snapshot */}
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg bg-white border border-gray-200 overflow-hidden shrink-0">
              <Image
                src={equipment.image_url || '/placeholder.jpg'}
                alt={equipment.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <h5 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                {equipment.name}
              </h5>
              <div className="text-xs text-gray-500">
                Location Hub: <span className="font-semibold text-lenstiger">{selectedCityData.name}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">Starting from</div>
            <div className="text-sm font-extrabold text-lenstiger">
              {formatCurrency(baseDailyPrice)}/day
            </div>
          </div>
        </div>

        {/* Calendar Grid Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          <div className="mb-2 text-center text-xs text-gray-500 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-lenstiger inline-block" /> Selected Dates
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" /> Available
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <span className="w-3 h-3 rounded-full bg-gray-100 inline-block" /> Past / Unavailable
            </span>
          </div>

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
                        return <td key={dayOfWeekIdx} className="py-2.5 px-1 bg-gray-50/50" />;
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
                          <div className="font-bold text-xs sm:text-sm">{dayNumber}</div>
                          <div
                            className={`text-[11px] font-bold ${
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
                              className={`text-[9px] line-through ${
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

          {/* Selected Summary Card */}
          <div className="mt-4 p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-gray-500 font-medium">Selected Duration:</span>{' '}
              <strong className="text-gray-900">
                {startDate ? format(startDate, 'dd MMM yyyy') : 'Select Start'}{' '}
                {endDate ? `→ ${format(endDate, 'dd MMM yyyy')}` : ''} ({rentalDays} Day{rentalDays > 1 ? 's' : ''})
              </strong>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-gray-500">Estimated Total: </span>
                <span className="text-base font-black text-lenstiger">
                  {formatCurrency(totalRentalCost)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-gray-100/90 border-t border-gray-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <ShieldCheck className="w-4 h-4 text-lenstiger" />
            <span>100% Tested Gear & Verified Sensors</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* WhatsApp to Buy / Inquire */}
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-white font-bold text-xs shadow-sm transition active:scale-95"
            >
              <span className="text-sm font-black">WhatsApp To Rent</span>
            </button>

            {/* Rent Now / Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-gray-950 font-black text-xs shadow-md transition active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{addedSuccess ? 'Added to Cart!' : 'Rent Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
