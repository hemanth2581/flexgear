import { describe, it, expect } from 'vitest';
import { calculateRentalDays, isValidRentalDateRange } from '@/lib/utils';
import { addDays, format, subDays } from 'date-fns';

describe('Rental Date Calculations & Validation (Rule 2)', () => {
  it('calculates calendar duration accurately (Sept 15 to Sept 18 = 3 days)', () => {
    const days = calculateRentalDays('2026-09-15', '2026-09-18');
    expect(days).toBe(3);
  });

  it('rejects past start dates', () => {
    const pastStart = format(subDays(new Date(), 2), 'yyyy-MM-dd');
    const futureEnd = format(addDays(new Date(), 3), 'yyyy-MM-dd');

    const result = isValidRentalDateRange(pastStart, futureEnd);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('past');
  });

  it('rejects end date before or equal to start date', () => {
    const start = format(addDays(new Date(), 2), 'yyyy-MM-dd');
    const end = format(addDays(new Date(), 1), 'yyyy-MM-dd');

    const result = isValidRentalDateRange(start, end);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('strictly after');
  });

  it('rejects rental durations exceeding 30 days', () => {
    const start = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    const end = format(addDays(new Date(), 35), 'yyyy-MM-dd'); // 34 days

    const result = isValidRentalDateRange(start, end, 30);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Maximum rental duration is 30 days');
  });

  it('accepts valid future rental date ranges', () => {
    const start = format(addDays(new Date(), 2), 'yyyy-MM-dd');
    const end = format(addDays(new Date(), 6), 'yyyy-MM-dd'); // 4 days

    const result = isValidRentalDateRange(start, end, 30);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});
