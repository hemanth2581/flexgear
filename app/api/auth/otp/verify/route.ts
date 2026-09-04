import { NextRequest, NextResponse } from 'next/server';
import { OtpService } from '@/lib/services/otp.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp, fullName, email } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Phone number and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    if (typeof otp !== 'string' || otp.trim().length !== 6) {
      return NextResponse.json(
        { success: false, error: 'OTP must be exactly 6 digits.' },
        { status: 400 }
      );
    }

    const result = await OtpService.verifyOtp(phone, otp.trim(), { fullName, email });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: result.message,
      user: result.user,
      token: result.token,
      isNewCustomer: result.isNewCustomer,
    });

    // Set secure HTTP-only session cookie
    if (result.token) {
      response.cookies.set({
        name: 'flexgear_session',
        value: result.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return response;
  } catch (error: any) {
    console.error('[API /api/auth/otp/verify] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while verifying OTP.' },
      { status: 500 }
    );
  }
}
