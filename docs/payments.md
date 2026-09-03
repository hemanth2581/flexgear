# FlexGear — Payments, Escrow & Refund Architecture

FlexGear implements an enterprise Stripe payment and collateral escrow workflow to protect high-value cinema hardware while providing frictionless checkout for cinematographers.

---

## 1. Two-Component Billing Structure

Every rental transaction consists of two distinct components:
1. **Rental Charges (Non-Refundable Base)**:
   * `Base Rental Fee` = `Daily Price × Quantity × Shoot Days`
   * `Multi-Day Shoot Discount`: 15% off for rentals of 7+ days
   * `Volume Shoot Discount`: 10% off for carts exceeding ₹20,000
   * `Doorstep Set Delivery Fee`: ₹500
   * `GST (Goods & Services Tax)`: 18% Total (9% CGST + 9% SGST)
2. **Security Deposit (Refundable Escrow)**:
   * High-value collateral held in escrow for the duration of the filming shoot.
   * 100% refundable upon post-shoot return inspection.

---

## 2. Stripe PaymentIntent Lifecycle

```
[CUSTOMER CHECKOUT]                [EXPRESS BACKEND]                  [STRIPE GATEWAY]
        │                                  │                                 │
        │─── 1. POST /api/checkout/quote ─▶│                                 │
        │◀── 2. Verified Pricing Breakdown─│                                 │
        │                                  │                                 │
        │─── 3. POST /checkout/intent ────▶│                                 │
        │                                  │─── 4. stripe.paymentIntents ───▶│
        │                                  │◀── 5. clientSecret + Intent ID ─│
        │◀── 6. Return clientSecret ───────│                                 │
        │                                                                    │
        │─── 7. stripe.confirmCardPayment(clientSecret) ────────────────────▶│
        │◀── 8. Payment Succeeded (Charges Captured) ────────────────────────│
        │                                                                    │
        │─── 9. POST /api/checkout/confirm ─────────────────────────────────▶│
        │◀── 10. Booking Order Created + Physical Serials Reserved ──────────│
```

---

## 3. Post-Shoot Quality Inspection & Deposit Release

1. **Return Checklist**: Admin inspects camera body, sensor hot pixels, lens glass elements, and battery counts in `admin-web`.
2. **Deposit Settlement**:
   * **Full Refund (Zero Damage)**: Admin clicks "Release Deposit" ➔ Backend triggers `stripe.refunds.create({ payment_intent: stripe_payment_intent_id, amount: held_amount })`.
   * **Damage / Penalty Deduction**: Admin enters deduction penalty ➔ Backend calculates `refund_amount = held_amount - deduction_amount` and executes partial refund via Stripe API.
3. **Audit Ledger**: The refund transaction ID and deduction reasons are immutably logged to `deposits`, `refunds`, and `audit_logs` tables.
