import { NextRequest, NextResponse } from 'next/server';
import { SendOtpSchema } from '@/lib/validations/schemas';
import { OtpService } from '@/lib/services/otp.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Must be a 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    const result = await OtpService.sendOtp(parsed.data.phone);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 429 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API Send OTP] Error:', error);
    return NextResponse.json(
      { error: 'Failed to dispatch verification OTP' },
      { status: 500 }
    );
  }
}
