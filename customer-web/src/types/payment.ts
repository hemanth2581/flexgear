// frontend/src/types/payment.ts
export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED';

export interface Payment {
  id: string;
  rental_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: string;
  created_at: string;
}

export type DepositStatus =
  | 'HELD'
  | 'INSPECTION_PENDING'
  | 'FULL_REFUND'
  | 'PARTIAL_REFUND'
  | 'DEDUCTION'
  | 'REFUNDED';

export interface Deposit {
  id: string;
  rental_id: string;
  held_amount: number;
  deducted_amount: number;
  refunded_amount: number;
  status: DepositStatus;
  deduction_reason?: string;
  refunded_at?: string;
}

export interface Inspection {
  id: string;
  rental_id: string;
  has_damage: boolean;
  damage_description?: string;
  damage_fee: number;
  condition_notes?: string;
  photo_urls: string[];
  is_completed: boolean;
  completed_at?: string;
}
