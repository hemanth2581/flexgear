import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export const revalidate = 0; // Dynamic route

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let eqQuery = supabaseAdmin
      .from('equipment')
      .select(`
        *,
        category:categories(*),
        brand:brands(*)
      `);

    if (isUuid) {
      eqQuery = eqQuery.eq('id', id);
    } else {
      eqQuery = eqQuery.eq('slug', id);
    }

    const { data: equipment, error } = await eqQuery.maybeSingle();

    if (error) {
      console.error('[API Equipment ID] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve equipment details', details: error.message },
        { status: 500 }
      );
    }

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
    }

    // Fetch related gear in the same category
    const { data: related } = await supabaseAdmin
      .from('equipment')
      .select(`
        *,
        category:categories(*),
        brand:brands(*)
      `)
      .eq('category_id', (equipment as any).category_id)
      .neq('id', (equipment as any).id)
      .eq('is_active', true)
      .limit(4);

    // Fetch reviews
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select(`
        *,
        user:users(full_name, email)
      `)
      .eq('equipment_id', (equipment as any).id)
      .order('created_at', { ascending: false });

    // Fetch inventory units
    const { data: inventory } = await supabaseAdmin
      .from('equipment_inventory')
      .select('*')
      .eq('equipment_id', (equipment as any).id);

    const availableUnits = inventory
      ? inventory.filter((inv) => inv.status === 'AVAILABLE').length
      : 0;

    return NextResponse.json({
      equipment: {
        ...equipment,
        available_units: availableUnits,
        total_units: inventory ? inventory.length : 0,
      },
      related: related || [],
      reviews: reviews || [],
    });
  } catch (error: any) {
    console.error('[API Equipment ID] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching equipment details', details: error?.message },
      { status: 500 }
    );
  }
}


