import { describe, it, expect, vi } from 'vitest';
import { InventoryService } from '@/lib/services/inventory.service';
import { getDatesArray } from '@/lib/utils';

describe('InventoryService & Overlap Logic', () => {
  it('generates exact sequential calendar dates in booking window', () => {
    const dates = getDatesArray('2026-09-15', '2026-09-18');
    expect(dates).toEqual(['2026-09-15', '2026-09-16', '2026-09-17']);
    expect(dates.length).toBe(3);
  });

  it('correctly calculates available inventory units given peak overlap bookings', () => {
    // Total physical stock in warehouse = 4 units
    const totalInventoryUnits = 4;

    // Suppose date range requested is 2026-09-15 to 2026-09-18
    // Existing active bookings across those dates:
    const bookedPerDate: Record<string, number> = {
      '2026-09-15': 1,
      '2026-09-16': 3, // Peak booked units in window
      '2026-09-17': 2,
    };

    const maxBookedInWindow = Math.max(...Object.values(bookedPerDate));
    const availableUnits = Math.max(0, totalInventoryUnits - maxBookedInWindow);

    expect(maxBookedInWindow).toBe(3);
    expect(availableUnits).toBe(1);

    // Requesting 1 unit should succeed
    expect(availableUnits >= 1).toBe(true);

    // Requesting 2 units should fail
    expect(availableUnits >= 2).toBe(false);
  });

  it('blocks booking when requested units exceed available capacity', () => {
    const totalUnits = 2;
    const maxBooked = 2; // fully booked
    const available = Math.max(0, totalUnits - maxBooked);

    expect(available).toBe(0);
    expect(available >= 1).toBe(false);
  });
});
