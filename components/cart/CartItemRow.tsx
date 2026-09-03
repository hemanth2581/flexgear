'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from '@/types/rental';
import { formatCurrency } from '@/lib/utils';
import { Trash2, Calendar, AlertTriangle, ShieldCheck, Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (equipmentId: string, qty: number) => void;
  onUpdateDates: (equipmentId: string, startDate: string, endDate: string) => void;
  onRemove: (equipmentId: string) => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onUpdateDates,
  onRemove,
}: CartItemRowProps) {
  return (
    <div
      className={`relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border p-4 sm:p-5 transition-all ${
        item.isAvailable === false
          ? 'border-rose-300 bg-rose-50'
          : 'border-gray-200 bg-white hover:shadow-md'
      }`}
    >
      {/* Product Image & Meta */}
      <div className="flex items-start sm:items-center gap-4 flex-1">
        <div className="relative h-20 w-24 sm:h-24 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-200">
          <Image
            src={item.equipment.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'}
            alt={item.equipment.name}
            fill
            sizes="120px"
            className="object-contain p-2"
          />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-lenstiger uppercase tracking-wider">
              {item.equipment.brand?.name || 'Pro Brand'}
            </span>
            {item.isAvailable === false && (
              <Badge variant="destructive" className="text-[10px] py-0 bg-rose-500 text-white">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Unavailable on Selected Dates
              </Badge>
            )}
          </div>

          <Link
            href={`/equipment/${item.equipment.id}`}
            className="font-bold text-gray-900 text-base hover:text-lenstiger transition-colors line-clamp-1"
          >
            {item.equipment.name}
          </Link>

          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>
              Rate: <strong className="text-gray-900">{formatCurrency(item.dailyPrice)}/day</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-gray-500">
              <ShieldCheck className="h-3.5 w-3.5 text-lenstiger" />
              Deposit: {formatCurrency(item.securityDeposit)}
            </span>
          </div>

          {/* Date Picker Range on Cart */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200 text-xs text-gray-800">
              <Calendar className="h-3.5 w-3.5 text-lenstiger" />
              <input
                type="date"
                value={item.startDate}
                onChange={(e) => onUpdateDates(item.equipment.id, e.target.value, item.endDate)}
                className="bg-transparent text-xs text-gray-800 font-semibold focus:outline-none cursor-pointer"
              />
              <span className="text-gray-400">➔</span>
              <input
                type="date"
                min={item.startDate}
                value={item.endDate}
                onChange={(e) => onUpdateDates(item.equipment.id, item.startDate, e.target.value)}
                className="bg-transparent text-xs text-gray-800 font-semibold focus:outline-none cursor-pointer"
              />
            </div>
            <span className="text-xs font-bold text-lenstiger">
              {item.days} {item.days === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </div>
      </div>

      {/* Quantity & Subtotal & Delete */}
      <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
        {/* Quantity */}
        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
          <button
            onClick={() => onUpdateQuantity(item.equipment.id, item.quantity - 1)}
            className="px-2.5 py-1 text-gray-600 hover:text-black hover:bg-gray-200 rounded-l-xl transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-7 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.equipment.id, item.quantity + 1)}
            className="px-2.5 py-1 text-gray-600 hover:text-black hover:bg-gray-200 rounded-r-xl transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Line Total */}
        <div className="text-right min-w-[100px]">
          <div className="text-base font-black text-lenstiger">
            {formatCurrency(item.itemSubtotal)}
          </div>
          <div className="text-[10px] text-gray-400">
            + {formatCurrency(item.itemDeposit)} dep.
          </div>
        </div>

        {/* Remove */}
        <button
          onClick={() => onRemove(item.equipment.id)}
          className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Remove from cart"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
