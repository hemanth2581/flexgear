import React, { Suspense } from 'react';
import { supabaseAdmin } from '@/lib/supabase/server';
import { EquipmentFilters } from '@/components/equipment/EquipmentFilters';
import { EquipmentCatalogView } from '@/components/equipment/EquipmentCatalogView';
import { Category, Brand, Equipment } from '@/types/equipment';
import { Sparkles, SlidersHorizontal, Camera } from 'lucide-react';

export const revalidate = 60; // ISR cache with background revalidation

interface EquipmentPageProps {
  searchParams: {
    category?: string;
    brand?: string;
    maxPrice?: string;
    minRating?: string;
    search?: string;
    availableOnly?: string;
    sort?: string;
    page?: string;
  };
}

export default async function EquipmentPage({ searchParams }: EquipmentPageProps) {
  const categoryParam = searchParams.category;
  const brandParam = searchParams.brand ? searchParams.brand.split(',') : undefined;
  const maxPriceParam = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const minRatingParam = searchParams.minRating ? Number(searchParams.minRating) : undefined;
  const searchParam = searchParams.search;
  const sortParam = searchParams.sort || 'newest';
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const limit = 12;

  let categories: Category[] = [];
  let brands: Brand[] = [];
  let equipmentList: Equipment[] = [];
  let totalCount = 0;

  try {
    const [catRes, brandRes] = await Promise.all([
      supabaseAdmin.from('categories').select('*').eq('is_active', true).order('name'),
      supabaseAdmin.from('brands').select('*').order('name'),
    ]);

    if (catRes.data && catRes.data.length > 0) categories = catRes.data;
    if (brandRes.data && brandRes.data.length > 0) brands = brandRes.data;

    let query = supabaseAdmin
      .from('equipment')
      .select(
        `
        *,
        category:categories(*),
        brand:brands(*)
      `,
        { count: 'exact' }
      )
      .eq('is_active', true);

    if (categoryParam && categoryParam !== 'all') {
      const { data: catData } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', categoryParam)
        .maybeSingle();

      if (catData) {
        query = query.eq('category_id', catData.id);
      }
    }

    if (brandParam && brandParam.length > 0) {
      const { data: brandData } = await supabaseAdmin
        .from('brands')
        .select('id')
        .in('slug', brandParam);

      if (brandData && brandData.length > 0) {
        query = query.in('brand_id', brandData.map((b) => b.id));
      }
    }

    if (maxPriceParam) {
      query = query.lte('daily_price', maxPriceParam);
    }

    if (minRatingParam) {
      query = query.gte('rating', minRatingParam);
    }

    if (searchParam) {
      query = query.or(`name.ilike.%${searchParam}%,description.ilike.%${searchParam}%`);
    }

    switch (sortParam) {
      case 'price_asc':
        query = query.order('daily_price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('daily_price', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: eqData, count } = await query;
    if (eqData) {
      equipmentList = eqData as any;
      totalCount = count || equipmentList.length;
    }
  } catch (e) {
    console.error('Equipment query error:', e);
  }

  return (
    <div className="bg-cinema-bg min-h-screen text-cinema-text">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="space-y-3 border-b border-cinema-border pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 shadow-cinema-glow">
            <Camera className="w-3.5 h-3.5" />
            <span>Live Production Inventory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-cinema-text font-heading tracking-tight">
            Cinema Equipment Catalog
          </h1>

          <p className="text-xs sm:text-sm text-cinema-text-secondary max-w-2xl leading-relaxed">
            Rent calibrated cinema bodies, fast anamorphic primes, studio lighting fixtures, 32-bit float audio, and professional camera stabilizers.
          </p>
        </div>

        {/* Main Grid with Left Sidebar Filters */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<div className="h-64 rounded-2xl bg-cinema-surface animate-pulse border border-cinema-border" />}>
              <EquipmentFilters categories={categories} brands={brands} />
            </Suspense>
          </div>

          {/* Right Equipment Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="h-96 rounded-2xl bg-cinema-surface animate-pulse border border-cinema-border" />}>
              <EquipmentCatalogView
                equipmentList={equipmentList}
                totalCount={totalCount}
                categories={categories}
                brands={brands}
                page={page}
                limit={limit}
                sortParam={sortParam}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
