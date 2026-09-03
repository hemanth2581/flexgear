# FlexGear Payment & Escrow Architecture

## Payment Flow Architecture

```
Customer
    │
    ▼
Checkout Page (Select Items + Dates + Delivery Mode)
    │
    ▼
Frontend (`POST /api/checkout`)
    │
    ├── Verify Firebase User Session
    ├── Verify Physical Serial Units Available
    ├── Calculate Pricing (Rental + Weekly Disc + 18% GST + Security Deposit)
    └── Create Pending Rental & Deposit Records
             │
             ▼
        Stripe API (`stripe.paymentIntents.create`)
             │
             ▼
        Returns `clientSecret` & `paymentIntentId`
             │
             ▼
    Frontend mounts Stripe 3D Secure Elements
             │
             ▼
    Customer submits Card Payment
             │
             ▼
    Stripe Webhook (`POST /api/payments/webhook`)
             │
             ├── Verify `stripe-signature` Header
             ├── On `payment_intent.succeeded`:
             │     Update Rental: `CONFIRMED`
             │     Update Payment: `SUCCEEDED`
             │     Deposit State: `HELD` in Escrow
             └── Emit Customer Notification
```

## Security Deposit & Refund Workflow

```
Shoot Completed & Gear Returned to Hub
                  ↓
Technician / Admin Inspection (`POST /api/inspections`)
                  ↓
          Damage Detected?
          ┌───────┴───────┐
          │               │
         NO              YES
          │               │
          ▼               ▼
     Full Refund      Calculate Damage / Late Deduction
   (100% Escrow)          (Deduction Fee + Reason)
          │               │
          └───────┬───────┘
                  ▼
Stripe Refund API (`stripe.refunds.create`)
                  ↓
Webhook updates Deposit status to `FULL_REFUND` or `PARTIAL_REFUND`
                  ↓
Rental order transitioned to `COMPLETED`
```
