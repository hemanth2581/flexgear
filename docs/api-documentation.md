# FlexGear REST API Documentation

Base Endpoint: `http://localhost:5000/api`

## Authentication (`/api/auth`)

- `POST /api/auth/verify-firebase`: Accepts `{ idToken, phone, fullName }`, verifies with Firebase Admin SDK, and returns `{ user, token }`.
- `GET /api/auth/me`: Returns currently authenticated filmmaker profile (requires `Bearer <token>`).
- `POST /api/auth/logout`: Invalidates session.

## Equipment Fleet (`/api/equipment` & `/api/categories`)

- `GET /api/equipment`: List equipment with query filters (`category`, `brand`, `search`, `minPrice`, `maxPrice`, `featured`, `page`, `limit`).
- `GET /api/equipment/:id`: Detailed specs, accessories, available physical units.
- `POST /api/equipment`: Admin-only gear creation.
- `GET /api/categories`: List all 7 gear departments.

## Inventory & Availability (`/api/availability`)

- `POST /api/availability`: Checks physical stock collision for date window `{ equipmentId, startDate, endDate, quantity }`.

## Shoot Bookings & Checkout (`/api/checkout` & `/api/rentals`)

- `POST /api/checkout`: Validates items, calculates server pricing, generates pending rental + deposit record, and creates a Stripe `PaymentIntent`.
- `GET /api/rentals`: List customer shoot orders.
- `GET /api/rentals/:id`: Retrieve single rental with itemized breakdown and deposit status.
- `POST /api/rentals/:id/return`: Customer requests equipment return handover.
- `PATCH /api/rentals/:id/status`: Admin updates lifecycle status (`CONFIRMED`, `READY_FOR_PICKUP`, `ACTIVE`, `COMPLETED`).

## Payments, Deposits & Refunds (`/api/payments` & `/api/deposits`)

- `POST /api/payments/create-payment-intent`: Creates Stripe `PaymentIntent` with client secret.
- `POST /api/payments/webhook`: Listens to Stripe webhook events (`payment_intent.succeeded`, `charge.refunded`).
- `GET /api/deposits`: Admin list of held escrow deposits.
- `POST /api/deposits/refund`: Issues Stripe refund for held escrow, records damage deductions, and marks shoot as `COMPLETED`.

## Admin Operations (`/api/admin`)

- `GET /api/admin/dashboard`: Returns KPIs, gross revenue, active shoots, and monthly chart telemetry.
- `GET /api/admin/equipment`: Equipment CRUD table.
- `GET /api/admin/inventory`: Physical serial numbers and calibration health.
- `GET /api/admin/rentals`: All fleet bookings with operational actions.
