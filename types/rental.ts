import { Equipment } from './equipment';

export type RentalStatus =
  | 'PENDING'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'READY_FOR_PICKUP'
  | 'ACTIVE'
  | 'RETURN_PENDING'
  | 'RETURNED'
  | 'CANCELLED'
  | 'OVERDUE';

export type PaymentStatus = 'CREATED' | 'CAPTURED' | 'FAILED';

export type DepositStatus = 'COLLECTED' | 'REFUND_PENDING' | 'REFUNDED';

export type DeliveryMode = 'PICKUP' | 'DELIVERY';

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number | null;
  lng?: number | null;
}

export interface CartItem {
  equipment: Equipment;
  quantity: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  days: number;
  dailyPrice: number;
  weeklyPrice?: number | null;
  securityDeposit: number;
  itemSubtotal: number;
  itemDeposit: number;
  isAvailable?: boolean;
}

export interface PricingBreakdown {
  subtotal: number;
  discount: number;
  hasDiscount: boolean;
  deliveryMode: DeliveryMode;
  deliveryFee: number;
  taxableAmount: number;
  tax: number; // 18% GST
  securityDeposit: number;
  total: number;
  days: number;
  itemBreakdowns: {
    equipmentId: string;
    equipmentName: string;
    quantity: number;
    days: number;
    dailyPrice: number;
    weeklyPrice?: number | null;
    effectiveDailyRate: number;
    lineSubtotal: number;
    lineDeposit: number;
  }[];
}

export interface RentalOrder {
  id: string;
  rental_id: string; // FG-RNT-YYYYMMDD-XXXXX
  user_id: string;
  status: RentalStatus;
  start_date: string;
  end_date: string;
  total_days: number;
  delivery_mode: DeliveryMode;
  address: Address;
  subtotal: number;
  discount: number;
  delivery_fee: number;
  tax: number;
  security_deposit: number;
  total: number;
  payment_status: PaymentStatus;
  created_at: string;
  rental_items?: RentalOrderItem[];
  payments?: Payment[];
  security_deposits?: SecurityDeposit[];
}

export interface RentalOrderItem {
  id: string;
  rental_order_id: string;
  equipment_id: string;
  quantity: number;
  daily_price: number;
  subtotal: number;
  equipment?: Equipment;
}

export type RentalItem = RentalOrderItem;

export interface RentalDate {
  id: string;
  rental_order_id: string;
  equipment_id: string;
  date: string;
  units_booked: number;
}

export interface Payment {
  id: string;
  rental_order_id: string;
  provider: 'mock';
  provider_payment_id: string;
  amount: number;
  status: PaymentStatus;
  created_at: string;
}

export interface SecurityDeposit {
  id: string;
  rental_order_id: string;
  amount: number;
  status: DepositStatus;
  refunded_amount?: number;
}

export interface OtpVerificationRecord {
  id: string;
  phone: string;
  otp_hash: string;
  expires_at: string;
  attempts: number;
  verified: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  equipment_id: string;
  rental_order_id?: string | null;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export interface WishlistItem {
  id: string;
  user_id: string;
  equipment_id: string;
  created_at: string;
  equipment?: Equipment;
}
