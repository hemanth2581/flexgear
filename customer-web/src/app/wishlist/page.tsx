'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Film, ArrowRight } from 'lucide-react';
import { WishlistService } from '../../services/wishlist.service';
import { EquipmentCard } from '../../components/equipment/EquipmentCard';

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const data = await WishlistService.getWishlist();
        setItems(data);
      } catch (err) {
        console.error('Failed to load wishlist', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Saved Gear Vault
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Bookmarked cinema cameras, anamorphic primes, and lighting rigs for upcoming productions.
          </p>
        </div>
        <Link href="/equipment">
          <button className="px-4 py-2 bg-surface-2 hover:bg-surface-3 border border-surface-3 hover:border-surface-4 text-xs font-semibold text-white rounded-xl transition-all">
            Browse All Gear
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-2xl shimmer-bg border border-surface-3" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-2xl bg-surface-1 border border-surface-3">
          <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center mx-auto text-zinc-600 mb-3">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-display text-white">Your Saved Gear Vault is Empty</h3>
          <p className="text-xs text-zinc-400 mt-1 mb-6">Click the heart icon on any gear card in the catalog to bookmark it.</p>
          <Link href="/equipment">
            <button className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-surface-0 font-bold text-xs rounded-xl transition-all shadow-md shadow-accent/10">
              Explore Fleet Catalog
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            item.equipment && <EquipmentCard key={item.id} equipment={item.equipment} />
          ))}
        </div>
      )}
    </div>
  );
}
