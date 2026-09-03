export interface CreatePaymentOrderParams {
  rentalOrderId: string;
  amount: number;
  currency?: string;
  customerPhone?: string;
  customerEmail?: string;
}

export interface PaymentOrderResult {
  paymentId: string;
  amount: number;
  currency: string;
  status: 'CREATED' | 'CAPTURED' | 'FAILED';
}

export interface VerifyPaymentResult {
  verified: boolean;
  paymentId: string;
  amount: number;
  status: 'CREATED' | 'CAPTURED' | 'FAILED';
  errorMessage?: string;
}

export interface IPaymentProvider {
  createOrder(params: CreatePaymentOrderParams): Promise<PaymentOrderResult>;
  verifyPayment(paymentId: string, expectedAmount: number): Promise<VerifyPaymentResult>;
}
