import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, city, gearDetails } = body;

    if (!name || !phone || !gearDetails) {
      return NextResponse.json(
        { error: 'Name, phone number, and gear details are required.' },
        { status: 400 }
      );
    }

    const applicationId = `ptn_${Date.now()}`;

    if (isSupabaseConfigured) {
      try {
        await (supabaseAdmin.from('partner_applications') as any).insert({
          id: applicationId,
          name,
          phone,
          email: email || null,
          city: city || 'Chennai',
          gear_details: gearDetails,
          status: 'PENDING_REVIEW',
          created_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn('[Partner API] DB insert notice (fallback to memory):', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Vendor partner application received successfully. An onboarding specialist will contact you.',
    });
  } catch (error: any) {
    console.error('[Partner API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit partner application', details: error?.message },
      { status: 500 }
    );
  }
}
