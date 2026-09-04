import { NextRequest, NextResponse } from 'next/server';
import { OtpService } from '@/lib/services/otp.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone = body?.phone;

    if (!rawPhone || typeof rawPhone !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Phone number is required.' },
        { status: 400 }
      );
    }

    if (!OtpService.isValidIndianMobile(rawPhone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).' },
        { status: 400 }
      );
    }

    const result = await OtpService.sendOtp(rawPhone);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: result.message.includes('Too many') ? 429 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      cooldownSeconds: result.cooldownSeconds || 30,
      phone: result.phone,
    });
  } catch (error: any) {
    console.error('[API /api/auth/otp/send] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to dispatch verification OTP. Please try again.' },
      { status: 500 }
    );
  }
}
