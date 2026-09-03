# FlexGear Rental Order Lifecycle

```
[ PENDING_PAYMENT ] ─── (Stripe PaymentIntent Created)
        │
        ▼ (Payment Succeeded via Webhook)
  [ CONFIRMED ] ─────── (Physical inventory units allocated)
        │
        ▼ (Technicians pack & clean gear)
[ READY_FOR_PICKUP ] ─ (Vault dispatch or driver departs)
        │
        ▼ (Filmmaker takes delivery / scan barcode)
    [ ACTIVE ] ──────── (Shooting in progress on set)
        │
        ▼ (Return date reached or customer initiates return)
 [ RETURN_PENDING ]
        │
        ▼ (Returned to Hub)
[ UNDER_INSPECTION ] ── (Sensor check, lens glass, cables, battery count)
        │
        ├──────────────────────┬──────────────────────┐
        ▼ (No Damage)          ▼ (Minor Damage)       ▼ (Major Loss)
  [ FULL_REFUND ]       [ PARTIAL_REFUND ]     [ DEPOSIT_DEDUCTION ]
  (100% Escrow back)    (Repair cost deducted) (Full deposit captured)
        │                      │                      │
        └──────────────────────┴──────────────────────┘
                               │
                               ▼
                         [ COMPLETED ]
```
