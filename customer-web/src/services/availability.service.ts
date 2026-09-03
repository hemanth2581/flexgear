// frontend/src/services/availability.service.ts
import { apiClient } from '../lib/api';

export class AvailabilityService {
  static async check(equipmentId: string, startDate: string, endDate: string, quantity = 1) {
    return await apiClient('/availability', {
      method: 'POST',
      body: JSON.stringify({ equipmentId, startDate, endDate, quantity }),
    });
  }
}
