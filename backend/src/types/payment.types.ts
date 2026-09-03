// backend/src/types/payment.types.ts
export interface CreatePaymentIntentPayload {
  rentalId: string;
  amount: number;
  currency?: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface RefundPayload {
  paymentId?: string;
  rentalId: string;
  amount: number;
  reason?: string;
  deductionNotes?: string;
}
