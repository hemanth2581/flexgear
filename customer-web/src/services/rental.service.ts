// frontend/src/services/rental.service.ts
import { apiClient } from '../lib/api';
import { Rental } from '../types/rental';

export class RentalService {
  static async getMyRentals(): Promise<Rental[]> {
    return await apiClient<Rental[]>('/rentals');
  }

  static async getById(id: string): Promise<Rental> {
    return await apiClient<Rental>(`/rentals/${id}`);
  }

  static async checkout(data: {
    items: Array<{
      equipmentId: string;
      quantity: number;
      dailyPrice: number;
      weeklyPrice?: number | null;
      securityDeposit: number;
    }>;
    startDate: string;
    endDate: string;
    deliveryMode: 'PICKUP' | 'DELIVERY';
    deliveryAddress?: any;
    notes?: string;
  }): Promise<{ rental: Rental; clientSecret: string; paymentIntentId: string; pricing: any }> {
    return await apiClient('/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async requestReturn(rentalId: string): Promise<Rental> {
    return await apiClient<Rental>(`/rentals/${rentalId}/return`, {
      method: 'POST',
    });
  }
}
