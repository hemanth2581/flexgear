# FlexGear Cinema Rental Platform — Complete API Reference

Base URL: `http://localhost:5000/api` (Local) / `https://api.flexgear.com/api` (Production)

---

## 1. Authentication (`/api/auth`)
* `POST /api/auth/verify-token` — Verify Firebase Phone OTP ID Token & establish session.
* `GET /api/auth/me` — Return current authenticated user profile & role.
* `POST /api/auth/logout` — Revoke active session.

---

## 2. Equipment & Catalog (`/api/equipment`)
* `GET /api/equipment` — Filter equipment by `category`, `brand`, `search`, `price_min`, `price_max`, `featured`.
* `GET /api/equipment/:id` — Retrieve full equipment details, specifications, and accessories.
* `GET /api/equipment/slug/:slug` — Retrieve equipment by SEO-friendly URL slug.
* `POST /api/equipment` — *(Admin)* Create new equipment model.
* `PATCH /api/equipment/:id` — *(Admin)* Update specs, pricing, or accessories.
* `DELETE /api/equipment/:id` — *(Admin)* Deactivate equipment model.

---

## 3. Categories & Brands (`/api/categories`, `/api/brands`)
* `GET /api/categories` — List all active equipment categories.
* `GET /api/categories/:slug` — Get category details by slug.
* `GET /api/brands` — List camera and gear manufacturers (*Sony, RED, ARRI, Canon, Aputure, DJI, etc.*).
* `POST /api/brands` — *(Admin)* Add new manufacturer.

---

## 4. Hub Locations (`/api/locations`)
* `GET /api/locations` — Retrieve active rental hubs (*Bengaluru, Chennai, Coimbatore*).
* `GET /api/locations/:id` — Get hub details, GPS coordinates, and contact details.

---

## 5. Availability & Date Locking (`/api/availability`)
* `GET /api/availability?equipment_id=...&start_date=...&end_date=...&quantity=...` — Real-time serialized stock availability check with date overlap engine.
* `POST /api/availability/check` — Batch availability verification.

---

## 6. Cart & Pricing Engine (`/api/cart`)
* `GET /api/cart` — Retrieve customer cart items.
* `POST /api/cart/items` — Add gear to cart with shoot date validation.
* `DELETE /api/cart/items/:id` — Remove item from cart.
* `POST /api/cart/recalculate` — Server-authoritative calculation of 18% GST, multi-day discounts, delivery, and security deposit escrow.

---

## 7. Checkout & Stripe Payments (`/api/checkout`, `/api/payments`)
* `POST /api/checkout/validate` — Validate stock, customer identity, and film set GPS delivery address.
* `POST /api/checkout/create` — Create order reservation and generate Stripe PaymentIntent `client_secret`.
* `POST /api/payments/webhook` — Idempotent Stripe webhook handler for `payment_intent.succeeded` and `charge.refunded`.

---

## 8. Rentals & Lifecycle (`/api/rentals`)
* `GET /api/rentals` — List filmmaker bookings or admin master order registry.
* `GET /api/rentals/:id` — Get order status timeline (`CONFIRMED` -> `ACTIVE` -> `RETURNED` -> `COMPLETED`).
* `PATCH /api/rentals/:id/status` — *(Admin/Staff)* Progress rental through dispatch, return, and closure.

---

## 9. Security Deposits & Refunds (`/api/deposits`, `/api/refunds`)
* `GET /api/deposits` — List escrow balances and held collateral.
* `POST /api/deposits/refund` — Release held deposit via Stripe Refund API with optional damage penalty deductions.

---

## 10. QC Return Inspections & Damage (`/api/inspections`, `/api/damage`)
* `GET /api/inspections` — Retrieve return condition reports.
* `POST /api/inspections` — Submit 7-point sensor, lens, and accessory condition checklist.
* `POST /api/damage` — Log hardware damage incidents with evidence photos and repair estimates.

---

## 11. Invoices (`/api/invoices`)
* `GET /api/invoices` — List tax invoices.
* `GET /api/invoices/:id` — View itemized 18% GST (9% CGST + 9% SGST) breakdown and HSN codes.

---

## 12. Technical Blog & Guides (`/api/blog`)
* `GET /api/blog` — List published camera rigging and cinematography guides.
* `GET /api/blog/:slug` — Retrieve full article by slug.
* `POST /api/blog` — *(Admin)* Publish new technical article.
