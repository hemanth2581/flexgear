// frontend/src/services/payment.service.ts
import { apiClient } from '../lib/api';

export class PaymentService {
  static async createIntent(rentalId: string) {
    return await apiClient('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ rentalId }),
    });
  }
}
