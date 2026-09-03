# FlexGear — Supabase PostgreSQL Database Schema Reference

FlexGear utilizes a robust, relational PostgreSQL database schema managed via **18 Supabase Migrations** (`supabase/migrations/001_users.sql` to `018_audit_logs.sql`).

---

## 1. Schema Migrations Map

| Migration | Table | Description |
| :--- | :--- | :--- |
| `001_users.sql` | `users` | User profile, Firebase UID mapping, phone number, and roles (`CUSTOMER`, `ADMIN`, `STAFF`) |
| `002_categories.sql` | `categories` | Equipment taxonomy (Cameras, Lenses, Lighting, Audio, Gimbals, Drones, Packages) |
| `003_equipment.sql` | `equipment` | Fleet master catalog: pricing, deposit rates, technical specs JSONB, accessories JSONB |
| `004_equipment_images.sql` | `equipment_images` | Multi-image product gallery with primary thumbnail flags |
| `005_inventory.sql` | `inventory` | Physical asset tracking with serial numbers, barcodes, vault locations, and condition states |
| `006_addresses.sql` | `addresses` | Customer delivery addresses and film set GPS coordinates (`latitude`, `longitude`) |
| `007_rentals.sql` | `rentals` | Master booking order record: booking ID, date windows, financial totals, status |
| `008_rental_items.sql` | `rental_items` | Line items linking equipment, allocated physical inventory unit, quantity, and pricing |
| `009_payments.sql` | `payments` | Stripe PaymentIntent transaction log, charge IDs, status, and metadata |
| `010_deposits.sql` | `deposits` | Collateral security deposit escrow holds, release states, and penalty deduction amounts |
| `011_inspections.sql` | `inspections` | Post-shoot return condition checklist (sensor dust, glass scratches, battery count) |
| `012_damage_reports.sql` | `damage_reports` | Granular item damage incident logs, photo evidence, and estimated repair costs |
| `013_refunds.sql` | `refunds` | Audit trail of Stripe Refund API executions returned to filmmaker payment methods |
| `014_invoices.sql` | `invoices` | Official tax invoices with itemized 18% GST (9% CGST + 9% SGST) breakdown |
| `015_wishlist.sql` | `wishlist` | Saved filmmaker gear favorites with composite unique constraints |
| `016_reviews.sql` | `reviews` | Customer gear ratings and production feedback |
| `017_notifications.sql` | `notifications` | User and administrator dispatch notifications |
| `018_audit_logs.sql` | `audit_logs` | Immutable security audit ledger for administrative overrides and status mutations |

---

## 2. Key Foreign Keys & Relationships

* `equipment.category_id` ➔ `categories.id` (`ON DELETE RESTRICT`)
* `inventory.equipment_id` ➔ `equipment.id` (`ON DELETE RESTRICT`)
* `rentals.customer_id` ➔ `users.id` (`ON DELETE RESTRICT`)
* `rental_items.rental_id` ➔ `rentals.id` (`ON DELETE CASCADE`)
* `rental_items.equipment_id` ➔ `equipment.id` (`ON DELETE RESTRICT`)
* `rental_items.inventory_id` ➔ `inventory.id` (`ON DELETE SET NULL`)
* `deposits.rental_id` ➔ `rentals.id` (`ON DELETE CASCADE`, `UNIQUE`)
* `inspections.rental_id` ➔ `rentals.id` (`ON DELETE CASCADE`)
* `refunds.rental_id` ➔ `rentals.id` (`ON DELETE CASCADE`)
* `invoices.rental_id` ➔ `rentals.id` (`ON DELETE CASCADE`, `UNIQUE`)

---

## 3. Seed Data

Run `supabase/seed.sql` to populate the database with:
* 2 Test Accounts (Customer & Operations Admin)
* 7 Master Cinema Categories
* 16 Flagship Equipment Items (Sony FX3, RED KOMODO, Canon C70, BMPCC 6K Pro, Aputure 600d, RØDE Wireless PRO, DJI Mavic 3 Pro Cine)
* 25+ Physical Serialized Inventory Units assigned to warehouse racks and vaults.
