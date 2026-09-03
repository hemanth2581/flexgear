# FlexGear — Authentication & Security Architecture

FlexGear implements **Firebase Phone Authentication with real SMS One-Time Passwords (OTP)** combined with a cryptographically signed JWT session system and role-based access control (RBAC).

---

## 1. Authentication Lifecycle

```
[CUSTOMER / ADMIN WEB]              [FIREBASE AUTH]               [EXPRESS BACKEND]             [SUPABASE DB]
        │                                  │                              │                             │
        │─── 1. Phone + Recaptcha ────────▶│                              │                             │
        │◀── 2. SMS OTP Delivered ─────────│                              │                             │
        │                                  │                              │                             │
        │─── 3. Submit OTP Code ──────────▶│                              │                             │
        │◀── 4. Firebase ID Token ─────────│                              │                             │
        │                                                                 │                             │
        │─── 5. POST /api/auth/session (idToken + phone) ────────────────▶│                             │
        │                                                                 │─── 6. Verify ID Token ─────▶│
        │                                                                 │◀── 7. Decoded Claims ───────│
        │                                                                 │                             │
        │                                                                 │─── 8. Find or Create User ─▶│
        │                                                                 │◀── 9. User Record + Role ───│
        │                                                                 │                             │
        │◀── 10. Return { token: JWT, user: { role: 'CUSTOMER'|'ADMIN' } }│                             │
```

---

## 2. Role-Based Access Control (RBAC)

FlexGear enforces two distinct permission tiers:
1. **`CUSTOMER`**: Can browse catalog, calculate pricing, reserve gear, pin shoot locations on OpenStreetMap, pay via Stripe, view own rentals and GST tax invoices.
2. **`ADMIN`**: Full operational control. Can manage equipment fleet, physical serials, update shoot lifecycle states, conduct return QC check, and trigger Stripe security deposit refunds.

### Backend Middleware Enforcement
* `authenticate`: Validates `Authorization: Bearer <jwt_token>` header.
* `requireRole(['ADMIN'])`: Restricts `/api/admin/*` endpoints. Returns `403 Forbidden` if a customer attempts to access administrative resources.
