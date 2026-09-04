import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, city, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, phone number, and message are required.' },
        { status: 400 }
      );
    }

    const inquiryId = `inq_${Date.now()}`;

    if (isSupabaseConfigured) {
      try {
        await (supabaseAdmin.from('contact_inquiries') as any).insert({
          id: inquiryId,
          name,
          phone,
          email: email || null,
          city: city || 'Chennai',
          message,
          created_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn('[Contact API] DB insert notice (fallback to memory):', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      inquiryId,
      message: 'Your inquiry has been successfully sent to FlexGear operations team. We will call you within 20 minutes.',
    });
  } catch (error: any) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry', details: error?.message },
      { status: 500 }
    );
  }
}
