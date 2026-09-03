# FlexGear Database Schema & Entity Relationships

The FlexGear PostgreSQL relational database is structured into 16 normalized tables:

```
USER
 │
 ├── ADDRESS (Home & Studio addresses)
 ├── WISHLIST (Saved gear)
 ├── REVIEW (Equipment ratings & feedback)
 ├── NOTIFICATION (System & return alerts)
 └── RENTAL (Order root)
         │
         ├── RENTAL_ITEM ── EQUIPMENT ── CATEGORY
         │                      │
         │                      ├── EQUIPMENT_IMAGES
         │                      └── INVENTORY (Physical serials)
         │
         ├── PAYMENT (Stripe charge records)
         ├── DEPOSIT (Escrow hold & refund state)
         ├── INSPECTION (Return damage reports)
         └── INVOICE (GST 18% tax breakdown)
```

## Migration Index

| File | Table | Purpose |
| :--- | :--- | :--- |
| `001_users.sql` | `users` | Filmmaker & admin accounts with Firebase UID mapping |
| `002_categories.sql` | `categories` | Cameras, Lenses, Lighting, Audio, Gimbals, Drones, Kits |
| `003_equipment.sql` | `equipment` | Equipment catalog with specifications, pricing & deposits |
| `004_equipment_images.sql` | `equipment_images` | Multi-image gallery URLs for gear |
| `005_inventory.sql` | `inventory` | Serialized physical units, barcode & maintenance status |
| `006_rentals.sql` | `rentals` | Root booking order with dates, delivery & pricing |
| `007_rental_items.sql` | `rental_items` | Itemized line items linked to equipment & serials |
| `008_payments.sql` | `payments` | Stripe PaymentIntent IDs, amounts & transaction states |
| `009_deposits.sql` | `deposits` | Security deposit escrow records, refund IDs & deductions |
| `010_inspections.sql` | `inspections` | Condition reports, photos & damage assessments |
| `011_wishlist.sql` | `wishlist` | Saved gear by filmmaker |
| `012_addresses.sql` | `addresses` | Studio, stage & production delivery locations |
| `013_reviews.sql` | `reviews` | Equipment star ratings and shoot reviews |
| `014_invoices.sql` | `invoices` | Official GST tax invoices with CGST/SGST/IGST breakdown |
| `015_notifications.sql` | `notifications` | Status updates, return alerts & refund confirmations |
| `016_subscriptions.sql` | `subscriptions` | Pro Filmmaker membership and recurring discounts |
