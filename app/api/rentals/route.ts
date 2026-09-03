import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');


    let query = supabaseAdmin
      .from('rental_orders')
      .select(`
        *,
        rental_items (
          *,
          equipment:equipment (
            id,
            name,
            image_url,
            brand:brands(name)
          )
        ),
        payments (*),
        security_deposits (*)
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: rentals, error } = await query;

    if (error) {
      console.error('[API Rentals] Query error:', error);
      return NextResponse.json({ error: 'Failed to fetch rentals' }, { status: 500 });
    }

    return NextResponse.json({ rentals: rentals || [] });
  } catch (error: any) {
    console.error('[API Rentals] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
