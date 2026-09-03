import { IPaymentProvider, CreatePaymentOrderParams, PaymentOrderResult, VerifyPaymentResult } from './types';
import { generateRandomAlphanumeric } from '@/lib/utils';

// In-memory mock registry of created orders
const mockOrdersRegistry = new Map<string, { amount: number; status: 'CREATED' | 'CAPTURED' | 'FAILED' }>();

export class MockPaymentProvider implements IPaymentProvider {
  async createOrder(params: CreatePaymentOrderParams): Promise<PaymentOrderResult> {
    const paymentId = `mock_pay_${Date.now()}_${generateRandomAlphanumeric(6)}`;
    
    mockOrdersRegistry.set(paymentId, {
      amount: params.amount,
      status: 'CREATED',
    });

    console.log(`\n======================================================`);
    console.log(`[MOCK PAYMENT GATEWAY] Order Created`);
    console.log(`Payment ID      : ${paymentId}`);
    console.log(`Rental Order ID : ${params.rentalOrderId}`);
    console.log(`Total Amount    : ₹${params.amount}`);
    console.log(`Gateway Status  : CREATED`);
    console.log(`======================================================\n`);

    return {
      paymentId,
      amount: params.amount,
      currency: params.currency || 'INR',
      status: 'CREATED',
    };
  }

  async verifyPayment(paymentId: string, expectedAmount: number): Promise<VerifyPaymentResult> {
    console.log(`\n======================================================`);
    console.log(`[MOCK PAYMENT GATEWAY] Verifying Payment`);
    console.log(`Payment ID      : ${paymentId}`);
    console.log(`Expected Amount : ₹${expectedAmount}`);

    const existing = mockOrdersRegistry.get(paymentId);

    // If order exists in memory or starts with valid mock prefix
    if (!existing && !paymentId.startsWith('mock_pay_')) {
      console.log(`Verification   : FAILED (Payment ID Not Found)`);
      console.log(`======================================================\n`);
      return {
        verified: false,
        paymentId,
        amount: 0,
        status: 'FAILED',
        errorMessage: 'Invalid or unknown payment ID',
      };
    }

    const recordedAmount = existing ? existing.amount : expectedAmount;

    if (Math.abs(recordedAmount - expectedAmount) > 0.01) {
      console.log(`Verification   : FAILED (Amount mismatch: recorded ₹${recordedAmount} vs expected ₹${expectedAmount})`);
      console.log(`======================================================\n`);
      return {
        verified: false,
        paymentId,
        amount: recordedAmount,
        status: 'FAILED',
        errorMessage: 'Payment amount mismatch',
      };
    }

    if (existing) {
      existing.status = 'CAPTURED';
    }

    console.log(`Verification   : SUCCESS (Payment CAPTURED)`);
    console.log(`======================================================\n`);

    return {
      verified: true,
      paymentId,
      amount: expectedAmount,
      status: 'CAPTURED',
    };
  }
}
