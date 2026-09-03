// frontend/src/types/rental.ts
export type RentalStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'ACTIVE'
  | 'RETURN_DUE'
  | 'RETURN_PENDING'
  | 'UNDER_INSPECTION'
  | 'OVERDUE'
  | 'COMPLETED'
  | 'CANCELLED';

export type DepositStatus =
  | 'HELD'
  | 'INSPECTION_PENDING'
  | 'FULL_REFUND'
  | 'PARTIAL_REFUND'
  | 'DEDUCTION'
  | 'REFUNDED';

export interface RentalItem {
  id?: string;
  equipment_id: string;
  name: string;
  thumbnail_url: string;
  quantity: number;
  daily_price: number;
  subtotal: number;
}

export interface Rental {
  id: string;
  rental_number: string;
  user_id: string;
  status: RentalStatus;
  start_date: string;
  end_date: string;
  total_days: number;
  delivery_mode: 'PICKUP' | 'DELIVERY';
  delivery_address: Record<string, any>;
  delivery_lat?: number;
  delivery_lng?: number;
  subtotal: number;
  discount: number;
  delivery_fee: number;
  tax: number;
  security_deposit: number;
  total_amount: number;
  notes?: string;
  created_at: string;
  items?: RentalItem[];
  deposit?: any;
}
