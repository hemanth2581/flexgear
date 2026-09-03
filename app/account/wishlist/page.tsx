import React from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/server';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { Heart, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 0;

export default async function WishlistPage() {
  let wishlistItems: any[] = [];

  try {
    const { data } = await supabaseAdmin
      .from('wishlist_items')
      .select(`
        *,
        equipment:equipment (
          *,
          category:categories(*),
          brand:brands(*)
        )
      `);

    if (data) wishlistItems = data;
  } catch (e) {
    console.warn('Wishlist fetch error:', e);
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 headingbold flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            <span>Saved Production Wishlist</span>
          </h2>
          <p className="text-xs text-gray-500">Cameras and gear bookmarked for future projects</p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="py-12 text-center space-y-4">
          <Heart className="h-10 w-10 text-gray-300 mx-auto" />
          <div className="text-sm font-bold text-gray-900">Your Wishlist is Empty</div>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Click the heart icon on any camera or lens in the catalog to save it to your project kit.
          </p>
          <Link href="/equipment">
            <Button size="sm" className="font-black text-xs bg-gold hover:bg-gold-hover text-gray-950 rounded-xl px-6">
              <Camera className="h-4 w-4 mr-1.5" />
              <span>Explore Catalog</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <EquipmentCard
              key={item.equipment.id}
              equipment={item.equipment}
              isWishlisted={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
