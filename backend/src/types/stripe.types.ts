// backend/src/types/stripe.types.ts
export interface StripeCheckoutSessionResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}
