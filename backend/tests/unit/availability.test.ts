// backend/tests/unit/availability.test.ts
import { describe, it, expect } from 'vitest';
import { AvailabilityService } from '../../src/services/availability.service';

describe('Availability Service', () => {
  it('should verify available stock for cinema cameras', async () => {
    const equipId = '30000000-0000-0000-0000-000000000001'; // Sony FX3
    const res = await AvailabilityService.checkAvailability(equipId, '2026-10-01', '2026-10-05', 1);

    expect(res.available).toBe(true);
    expect(res.totalUnits).toBeGreaterThanOrEqual(1);
    expect(res.availableUnits).toBeGreaterThanOrEqual(1);
  });

  it('should reject request when requested quantity exceeds inventory count', async () => {
    const equipId = '30000000-0000-0000-0000-000000000001';
    const res = await AvailabilityService.checkAvailability(equipId, '2026-10-01', '2026-10-05', 999);

    expect(res.available).toBe(false);
  });
});
