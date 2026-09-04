import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('flexgear_session')?.value;
    const authHeader = req.headers.get('authorization')?.replace('Bearer ', '');
    const token = sessionCookie || authHeader;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    // Check admin session token
    if (token.includes('_admin_')) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: '00000000-0000-0000-0000-000000000002',
          email: 'admin@flexgear.test',
          full_name: 'FlexGear Administrator',
          role: 'ADMIN',
        },
      });
    }

    // Extract user ID from session token
    const parts = token.split('_');
    const potentialId = parts[2]; // flexgear_session_{id}_{timestamp}...

    if (potentialId && isSupabaseConfigured) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('id, email, phone, full_name, role, created_at')
        .eq('id', potentialId)
        .maybeSingle();

      if (user) {
        return NextResponse.json({
          authenticated: true,
          user,
        });
      }
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: potentialId || 'customer_user',
        full_name: 'Filmmaker',
        role: 'CUSTOMER',
      },
    });
  } catch (error: any) {
    console.error('[API /api/auth/me] Error:', error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 500 }
    );
  }
}
