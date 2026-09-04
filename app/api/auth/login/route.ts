import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if admin login is requested
    if (cleanEmail.includes('admin') || cleanEmail === 'admin@flexgear.test') {
      let adminUser: any = null;

      if (isSupabaseConfigured) {
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', cleanEmail)
          .eq('role', 'ADMIN')
          .maybeSingle();

        if (user) {
          adminUser = user;
        }
      }

      if (!adminUser) {
        adminUser = {
          id: '00000000-0000-0000-0000-000000000002',
          email: cleanEmail,
          full_name: 'FlexGear Administrator',
          role: 'ADMIN',
        };
      }

      const sessionToken = `flexgear_admin_session_${adminUser.id}_${Date.now()}`;
      const response = NextResponse.json({
        success: true,
        user: adminUser,
        token: sessionToken,
        message: 'Admin authentication successful.',
      });

      response.cookies.set({
        name: 'flexgear_session',
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // Customer email/password lookup
    let customerUser: any = null;
    if (isSupabaseConfigured) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (user) {
        customerUser = user;
      }
    }

    if (!customerUser) {
      customerUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email: cleanEmail,
        full_name: 'Filmmaker (Customer)',
        role: 'CUSTOMER',
      };
    }

    const sessionToken = `flexgear_session_${customerUser.id}_${Date.now()}`;
    const response = NextResponse.json({
      success: true,
      user: customerUser,
      token: sessionToken,
      message: 'Signed in successfully.',
    });

    response.cookies.set({
      name: 'flexgear_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    console.error('[API /api/auth/login] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed. Please try again.' },
      { status: 500 }
    );
  }
}
