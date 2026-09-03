import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { ProductDetailView } from '@/components/equipment/ProductDetailView';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface EquipmentDetailsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EquipmentDetailsPageProps): Promise<Metadata> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id);
    let query = supabaseAdmin
      .from('equipment')
      .select('name, description, image_url, daily_price');

    if (isUuid) {
      query = query.eq('id', params.id);
    } else {
      query = query.eq('slug', params.id);
    }

    const { data: equipment } = await query.maybeSingle();

    if (!equipment) {
      return { title: 'Equipment Not Found | FlexGear' };
    }

    return {
      title: `${equipment.name} Rental (₹${Number(equipment.daily_price).toLocaleString('en-IN')}/day) | FlexGear Cinema Rentals`,
      description: equipment.description,
      openGraph: {
        title: `${equipment.name} — Cinema & Shooting Equipment Rental`,
        description: equipment.description,
        images: [{ url: equipment.image_url }],
      },
    };
  } catch (e) {
    return { title: 'Equipment Rental | FlexGear' };
  }
}

export default async function EquipmentDetailsPage({ params }: EquipmentDetailsPageProps) {
  const { id } = params;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  let query = supabaseAdmin
    .from('equipment')
    .select(`
      *,
      category:categories(*),
      brand:brands(*)
    `);

  if (isUuid) {
    query = query.eq('id', id);
  } else {
    query = query.eq('slug', id);
  }

  const { data: equipment, error } = await query.maybeSingle();

  if (error || !equipment) {
    notFound();
  }

  // Fetch related gear from the same category
  const { data: related } = await supabaseAdmin
    .from('equipment')
    .select(`
      *,
      category:categories(*),
      brand:brands(*)
    `)
    .eq('category_id', equipment.category_id)
    .neq('id', equipment.id)
    .eq('is_active', true)
    .limit(4);

  // Fetch physical inventory availability
  const { data: inventory } = await supabaseAdmin
    .from('equipment_inventory')
    .select('status')
    .eq('equipment_id', equipment.id);

  const availableCount = inventory
    ? inventory.filter((inv) => inv.status === 'AVAILABLE').length
    : 0;

  const enrichedEquipment = {
    ...equipment,
    available_units: availableCount,
    total_units: inventory ? inventory.length : 0,
  };

  return (
    <ProductDetailView
      equipment={enrichedEquipment as any}
      relatedEquipment={(related as any) || []}
    />
  );
}

