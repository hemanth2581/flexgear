import { z } from 'zod';

export const PhoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number');

export const SendOtpSchema = z.object({
  phone: PhoneSchema,
});

export const VerifyOtpSchema = z.object({
  phone: PhoneSchema,
  otp: z.string().trim().length(6, 'OTP must be exactly 6 digits'),
});

export const AddressSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: PhoneSchema,
  line1: z.string().trim().min(5, 'Address line must be at least 5 characters'),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
});

export const CartItemInputSchema = z.object({
  equipmentId: z.string().min(1, 'Invalid equipment ID'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD'),
});

export const CheckoutRequestSchema = z.object({
  items: z.array(CartItemInputSchema).min(1, 'Cart cannot be empty'),
  deliveryMode: z.enum(['PICKUP', 'DELIVERY']),
  address: AddressSchema,
  otpToken: z.string().min(1, 'OTP verification is required'),
  userId: z.string().min(1, 'Valid user ID required').optional(),
});

export const VerifyPaymentSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  rentalOrderId: z.string().min(1, 'Rental order ID is required'),
});

export const AvailabilityQuerySchema = z.object({
  equipmentId: z.string().min(1, 'Valid equipment ID is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD'),
  quantity: z.coerce.number().int().positive().default(1),
});

export const EquipmentFilterSchema = z.object({
  category: z.string().optional(),
  brand: z.union([z.string(), z.array(z.string())]).optional(),
  maxPrice: z.coerce.number().positive().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  search: z.string().optional(),
  availableOnly: z.coerce.boolean().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sort: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(12),
});

export const ReviewCreateSchema = z.object({
  equipmentId: z.string().min(1, 'Invalid equipment ID'),
  rentalOrderId: z.string().min(1, 'Invalid rental order ID').optional(),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().trim().min(5, 'Comment must be at least 5 characters'),
});

export const AdminStatusUpdateSchema = z.object({
  status: z.enum([
    'PENDING',
    'PAYMENT_PENDING',
    'CONFIRMED',
    'READY_FOR_PICKUP',
    'ACTIVE',
    'RETURN_PENDING',
    'RETURNED',
    'CANCELLED',
    'OVERDUE',
  ]),
  refundDeposit: z.boolean().optional(),
});
