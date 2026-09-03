import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { MOCK_WISHLIST, MOCK_EQUIPMENT } from '@/lib/data/mock-db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '00000000-0000-0000-0000-000000000001';

    try {
      const { data: wishlist, error } = await supabaseAdmin
        .from('wishlist_items')
        .select(`
          *,
          equipment:equipment (
            *,
            category:categories(*),
            brand:brands(*)
          )
        `)
        .eq('user_id', userId);

      if (!error && wishlist && wishlist.length > 0) {
        return NextResponse.json({ wishlist });
      }
    } catch (e) {
      // Fallback
    }

    const fallbackWishlist = Array.from(MOCK_WISHLIST).map((eqId) => {
      const eq = MOCK_EQUIPMENT.find((e) => e.id === eqId);
      return {
        id: `wish-${eqId}`,
        user_id: userId,
        equipment_id: eqId,
        created_at: new Date().toISOString(),
        equipment: eq,
      };
    });

    return NextResponse.json({ wishlist: fallbackWishlist });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { equipmentId, userId = '00000000-0000-0000-0000-000000000001' } = body;

    if (!equipmentId) {
      return NextResponse.json({ error: 'equipmentId is required' }, { status: 400 });
    }

    try {
      await (supabaseAdmin.from('wishlist_items') as any).upsert(
        {
          user_id: userId,
          equipment_id: equipmentId,
        },
        { onConflict: 'user_id,equipment_id' }
      );
    } catch (e) {
      // Fallback
    }

    MOCK_WISHLIST.add(equipmentId);

    return NextResponse.json({ success: true, message: 'Added to wishlist' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const equipmentId = searchParams.get('equipmentId');
    const userId = searchParams.get('userId') || '00000000-0000-0000-0000-000000000001';

    if (!equipmentId) {
      return NextResponse.json({ error: 'equipmentId is required' }, { status: 400 });
    }

    try {
      await supabaseAdmin
        .from('wishlist_items')
        .delete()
        .eq('user_id', userId)
        .eq('equipment_id', equipmentId);
    } catch (e) {
      // Fallback
    }

    MOCK_WISHLIST.delete(equipmentId);

    return NextResponse.json({ success: true, message: 'Removed from wishlist' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


