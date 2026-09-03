import { NextRequest, NextResponse } from 'next/server';
import { AvailabilityQuerySchema } from '@/lib/validations/schemas';
import { InventoryService } from '@/lib/services/inventory.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = {
      equipmentId: searchParams.get('equipmentId'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      quantity: searchParams.get('quantity') || '1',
    };

    const parsed = AvailabilityQuerySchema.safeParse(query);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { equipmentId, startDate, endDate, quantity } = parsed.data;

    const result = await InventoryService.checkAvailability(
      equipmentId,
      startDate,
      endDate,
      quantity
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API Availability] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error checking availability' },
      { status: 500 }
    );
  }
}
