// backend/src/types/rental.types.ts
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

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED';

export type DepositStatus =
  | 'HELD'
  | 'INSPECTION_PENDING'
  | 'FULL_REFUND'
  | 'PARTIAL_REFUND'
  | 'DEDUCTION'
  | 'REFUNDED';
