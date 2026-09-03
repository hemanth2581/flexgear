export const APP_NAME = 'Flex Gear';
export const APP_TAGLINE = 'Professional Gear. Flexible Rentals.';
export const APP_DESCRIPTION = 'Rent high-end cameras, cinema lenses, lighting, audio gear, drones, gimbals, and complete shooting kits for your next production.';

export const GST_PERCENTAGE = 0.18; // 18% GST
export const DISCOUNT_THRESHOLD = 20000; // ₹20,000 threshold for 10% discount
export const DISCOUNT_PERCENTAGE = 0.10; // 10% discount
export const DELIVERY_FEE = 300; // ₹300 for delivery mode
export const MAX_RENTAL_DAYS = 30; // Max allowed rental duration in days

export const OTP_EXPIRY_SECONDS = 300; // 5 minutes
export const OTP_COOLDOWN_SECONDS = 30; // 30 seconds resend cooldown
export const OTP_MAX_ATTEMPTS = 5;
export const MOCK_OTP_CODE = '123456';

export const RENTAL_STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PENDING: { bg: 'bg-zinc-800', text: 'text-zinc-300', border: 'border-zinc-700' },
  PAYMENT_PENDING: { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-700/50' },
  CONFIRMED: { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-700/50' },
  READY_FOR_PICKUP: { bg: 'bg-indigo-950/60', text: 'text-indigo-400', border: 'border-indigo-700/50' },
  ACTIVE: { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-700/50' },
  RETURN_PENDING: { bg: 'bg-yellow-950/60', text: 'text-yellow-400', border: 'border-yellow-700/50' },
  RETURNED: { bg: 'bg-teal-950/60', text: 'text-teal-400', border: 'border-teal-700/50' },
  CANCELLED: { bg: 'bg-rose-950/60', text: 'text-rose-400', border: 'border-rose-700/50' },
  OVERDUE: { bg: 'bg-red-950/80', text: 'text-red-300', border: 'border-red-600' },
};
