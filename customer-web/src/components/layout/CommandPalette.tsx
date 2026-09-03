'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Film, Camera, Heart, Shield, ArrowRight, X } from 'lucide-react';
import { EquipmentService } from '../../services/equipment.service';
import { Equipment } from '../../types/equipment';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      EquipmentService.getAllEquipment().then((data) => {
        setEquipmentList(data);
      }).catch(() => {});
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredItems = query.trim()
    ? equipmentList.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.brand.toLowerCase().includes(query.toLowerCase()) ||
          item.category_name?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : equipmentList.slice(0, 5);

  const quickLinks = [
    { label: 'Browse Full Fleet', href: '/equipment', icon: <Camera className="w-4 h-4 text-accent" /> },
    { label: 'My Shoots & Orders', href: '/rentals', icon: <Film className="w-4 h-4 text-info" /> },
    { label: 'Gear Wishlist', href: '/wishlist', icon: <Heart className="w-4 h-4 text-rose-400" /> },
    { label: 'Security & Escrow', href: '/rentals', icon: <Shield className="w-4 h-4 text-emerald-400" /> },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length + quickLinks.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length + quickLinks.length) % (filteredItems.length + quickLinks.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < filteredItems.length) {
        const selected = filteredItems[selectedIndex];
        if (selected) {
          router.push(`/equipment/${selected.id}`);
          onClose();
        }
      } else {
        const link = quickLinks[selectedIndex - filteredItems.length];
        if (link) {
          router.push(link.href);
          onClose();
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-surface-1 border border-surface-3 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-surface-3 gap-3">
              <Search className="w-5 h-5 text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search cinema gear, lenses, lighting (e.g. Sony FX3, RED, ARRI)..."
                className="flex-1 bg-transparent text-white text-sm placeholder:text-zinc-500 focus:outline-none font-sans"
              />
              <button
                onClick={onClose}
                className="text-xs font-mono px-1.5 py-0.5 rounded bg-surface-3 text-zinc-400 border border-surface-4 hover:text-white"
              >
                ESC
              </button>
            </div>

            {/* Results Section */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredItems.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Cinema Gear
                  </div>
                  {filteredItems.map((item, idx) => {
                    const isSelected = selectedIndex === idx;
                    const dailyRate = item.daily_price || item.daily_rate || 15000;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          router.push(`/equipment/${item.id}`);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                          isSelected ? 'bg-accent/10 border border-accent/20 text-white' : 'hover:bg-surface-2 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-surface-2 border border-surface-3 flex items-center justify-center text-xs font-bold text-accent shrink-0">
                            {item.brand.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                            <div className="text-[11px] text-zinc-400">{item.brand} · {item.category_name}</div>
                          </div>
                        </div>
                        <div className="text-xs font-mono font-medium text-accent ml-3 shrink-0">
                          ₹{dailyRate.toLocaleString('en-IN')}/day
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Quick Navigation Links */}
              <div className="pt-2 border-t border-surface-3/50">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Quick Actions
                </div>
                {quickLinks.map((link, idx) => {
                  const itemIndex = filteredItems.length + idx;
                  const isSelected = selectedIndex === itemIndex;
                  return (
                    <button
                      key={link.label}
                      onClick={() => {
                        router.push(link.href);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                        isSelected ? 'bg-surface-2 border border-surface-4 text-white' : 'hover:bg-surface-2 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs">
                        {link.icon}
                        <span>{link.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer status bar */}
            <div className="px-4 py-2 bg-surface-0 border-t border-surface-3 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Navigate with <kbd className="text-zinc-400">↑</kbd> <kbd className="text-zinc-400">↓</kbd></span>
              <span>Press <kbd className="text-zinc-400">↵</kbd> to select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
