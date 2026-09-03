import { NextRequest, NextResponse } from 'next/server';
import { VerifyOtpSchema } from '@/lib/validations/schemas';
import { OtpService } from '@/lib/services/otp.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = VerifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input. Please provide a 10-digit phone number and 6-digit OTP code.' },
        { status: 400 }
      );
    }

    const { phone, otp } = parsed.data;
    const result = await OtpService.verifyOtp(phone, otp);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API Verify OTP] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error verifying OTP' },
      { status: 500 }
    );
  }
}
