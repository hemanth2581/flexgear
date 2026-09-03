import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';
import { EquipmentFilterSchema } from '@/lib/validations/schemas';

export const revalidate = 0; // Dynamic route

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const brandsParam = searchParams.get('brand');
    const brandsArray = brandsParam ? brandsParam.split(',') : undefined;

    const query = {
      category: searchParams.get('category') || undefined,
      brand: brandsArray,
      maxPrice: searchParams.get('maxPrice') || undefined,
      minRating: searchParams.get('minRating') || undefined,
      search: searchParams.get('search') || undefined,
      availableOnly: searchParams.get('availableOnly') || undefined,
      sort: searchParams.get('sort') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '12',
    };

    const parsed = EquipmentFilterSchema.safeParse(query);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid filter parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { category, brand, maxPrice, minRating, search, sort, page, limit } = parsed.data;

    let dbQuery = supabaseAdmin
      .from('equipment')
      .select(`
        *,
        category:categories(*),
        brand:brands(*)
      `, { count: 'exact' })
      .eq('is_active', true);

    // Filter by category slug if provided
    if (category && category !== 'all') {
      const { data: catData } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', category)
        .maybeSingle();

      if (catData) {
        dbQuery = dbQuery.eq('category_id', catData.id);
      }
    }

    // Filter by brand slugs if provided
    if (brand && Array.isArray(brand) && brand.length > 0) {
      const { data: brandData } = await supabaseAdmin
        .from('brands')
        .select('id')
        .in('slug', brand);

      if (brandData && brandData.length > 0) {
        dbQuery = dbQuery.in('brand_id', brandData.map((b) => b.id));
      }
    }

    // Apply price filter
    if (maxPrice) {
      dbQuery = dbQuery.lte('daily_price', maxPrice);
    }

    // Apply min rating
    if (minRating) {
      dbQuery = dbQuery.gte('rating', minRating);
    }

    // Apply search query
    if (search) {
      dbQuery = dbQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        dbQuery = dbQuery.order('daily_price', { ascending: true });
        break;
      case 'price_desc':
        dbQuery = dbQuery.order('daily_price', { ascending: false });
        break;
      case 'rating':
        dbQuery = dbQuery.order('rating', { ascending: false });
        break;
      case 'newest':
      default:
        dbQuery = dbQuery.order('created_at', { ascending: false });
        break;
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    dbQuery = dbQuery.range(from, to);

    const { data: equipment, count, error } = await dbQuery;

    if (error) {
      console.error('[API Equipment] Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve equipment catalog', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      equipment: equipment || [],
      total: count || (equipment ? equipment.length : 0),
      page,
      limit,
      totalPages: Math.ceil(((count || (equipment ? equipment.length : 0))) / limit),
    });
  } catch (error: any) {
    console.error('[API Equipment] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching equipment', details: error?.message },
      { status: 500 }
    );
  }
}


