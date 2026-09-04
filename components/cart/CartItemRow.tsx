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
          ? 'border-semantic-error/40 bg-semantic-error/10'
          : 'border-cinema-border bg-cinema-surface hover:border-cinema-border-strong hover:shadow-cinema-sm'
      }`}
    >
      {/* Product Image & Meta */}
      <div className="flex items-start sm:items-center gap-4 flex-1">
        <div className="relative h-20 w-24 sm:h-24 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-cinema-bg border border-cinema-border flex items-center justify-center p-1">
          <Image
            src={item.equipment.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80'}
            alt={item.equipment.name}
            fill
            sizes="120px"
            className="object-contain p-1"
          />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
              {item.equipment.brand?.name || 'Pro Brand'}
            </span>
            {item.isAvailable === false && (
              <Badge variant="destructive" className="text-[10px] py-0 bg-semantic-error text-white">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Unavailable on Selected Dates
              </Badge>
            )}
          </div>

          <Link
            href={`/equipment/${item.equipment.id}`}
            className="font-bold text-cinema-text text-base hover:text-accent transition-colors line-clamp-1 font-heading"
          >
            {item.equipment.name}
          </Link>

          <div className="text-xs text-cinema-text-secondary flex items-center gap-2">
            <span>
              Rate: <strong className="text-accent">{formatCurrency(item.dailyPrice)}/day</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-cinema-text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Deposit: {formatCurrency(item.securityDeposit)}
            </span>
          </div>

          {/* Date Picker Range on Cart */}
          <div className="flex flex-wrap items-center gap-2 pt-1.5">
            <div className="flex items-center gap-1.5 bg-cinema-tertiary px-3 py-1.5 rounded-xl border border-cinema-border text-xs text-cinema-text">
              <Calendar className="h-3.5 w-3.5 text-accent" />
              <input
                type="date"
                value={item.startDate}
                onChange={(e) => onUpdateDates(item.equipment.id, e.target.value, item.endDate)}
                className="bg-transparent text-xs text-cinema-text font-semibold focus:outline-none cursor-pointer"
              />
              <span className="text-cinema-text-muted">➔</span>
              <input
                type="date"
                min={item.startDate}
                value={item.endDate}
                onChange={(e) => onUpdateDates(item.equipment.id, item.startDate, e.target.value)}
                className="bg-transparent text-xs text-cinema-text font-semibold focus:outline-none cursor-pointer"
              />
            </div>
            <span className="text-xs font-bold text-accent">
              {item.days} {item.days === 1 ? 'Day' : 'Days'}
            </span>
          </div>
        </div>
      </div>

      {/* Quantity & Subtotal & Delete */}
      <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-cinema-border">
        {/* Quantity */}
        <div className="flex items-center border border-cinema-border rounded-xl bg-cinema-tertiary">
          <button
            onClick={() => onUpdateQuantity(item.equipment.id, item.quantity - 1)}
            className="px-2.5 py-1 text-cinema-text-muted hover:text-cinema-text hover:bg-cinema-card rounded-l-xl transition cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-7 text-center text-xs font-bold text-cinema-text">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.equipment.id, item.quantity + 1)}
            className="px-2.5 py-1 text-cinema-text-muted hover:text-cinema-text hover:bg-cinema-card rounded-r-xl transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Line Total */}
        <div className="text-right min-w-[100px]">
          <div className="text-base font-black text-accent font-heading">
            {formatCurrency(item.itemSubtotal)}
          </div>
          <div className="text-[10px] text-cinema-text-muted">
            + {formatCurrency(item.itemDeposit)} dep.
          </div>
        </div>

        {/* Remove */}
        <button
          onClick={() => onRemove(item.equipment.id)}
          className="p-2 rounded-xl text-cinema-text-muted hover:text-semantic-error hover:bg-semantic-error/10 transition-colors cursor-pointer"
          title="Remove from cart"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
