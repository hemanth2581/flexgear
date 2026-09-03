import React from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../../services/cart.service';
import { formatCurrency } from '../../utils/currency';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, q: number) => void;
  onRemove: (id: string) => void;
}

export const CartItemRow: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const imgSrc =
    item.equipment.thumbnail_url ||
    item.equipment.image_url ||
    'https://images.unsplash.com/photo-1589872765507-6f813958742b?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-1 border border-surface-3 gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-2 shrink-0 border border-surface-3">
          <Image
            src={imgSrc}
            alt={item.equipment.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 block">{item.equipment.brand}</span>
          <h4 className="text-sm font-bold text-white truncate">{item.equipment.name}</h4>
          <span className="text-xs font-mono text-accent">{formatCurrency(item.equipment.daily_price || item.equipment.daily_rate || 15000)} /day</span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center border border-surface-3 rounded-lg bg-surface-2 overflow-hidden">
          <button
            onClick={() => onUpdateQuantity(item.equipment.id, item.quantity - 1)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-surface-3 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-mono font-bold text-white">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.equipment.id, item.quantity + 1)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-surface-3 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-right min-w-[80px]">
          <span className="text-sm font-bold font-mono text-white block">
            {formatCurrency((item.equipment.daily_price || item.equipment.daily_rate || 15000) * item.quantity)}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Deposit: {formatCurrency((item.equipment.security_deposit || 25000) * item.quantity)}</span>
        </div>

        <button
          onClick={() => onRemove(item.equipment.id)}
          className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
