# FlexGear Physical Asset & Inventory Architecture

## 1. Separation of Catalog Model vs Physical Assets

In professional cinema equipment rental houses, an **Equipment Catalog Item** (e.g. *Sony FX3 Full-Frame Cinema Line Camera*) represents the generic product definition with specifications, pricing tiers, and accessories.

Conversely, a **Physical Inventory Unit** represents an individual serialized camera brain, lens, or light fixture in the warehouse with its own serial number, barcode, rack location, and condition history.

```
┌────────────────────────────────────────────────────────┐
│            EQUIPMENT (Catalog Definition)             │
│            id: 30000000-0000-0000-0000-000000000001    │
│            name: "Sony FX3 Cinema Camera"             │
│            daily_price: ₹4,000 / deposit: ₹16,000      │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│     INVENTORY ASSET 1     │ │     INVENTORY ASSET 2     │
│  serial: FX3-SN-8829101   │ │  serial: FX3-SN-8829102   │
│  barcode: BAR-FX3-01      │ │  barcode: BAR-FX3-02      │
│  rack: Hub Alpha - Rack A1│ │  rack: Hub Alpha - Rack A1│
│  status: AVAILABLE        │ │  status: RENTED           │                                                                                                       
│  condition: EXCELLENT     │ │  condition: EXCELLENT     │
└───────────────────────────┘ └───────────────────────────┘
```

---

## 2. Date Overlap & Concurrency Reservation Algorithm

When a customer searches for availability between `start_date` and `end_date`:

1. **Active Overlap Condition**:
   $$\text{Existing Start Date} \le \text{Requested End Date} \quad \text{AND} \quad \text{Existing End Date} \ge \text{Requested Start Date}$$
2. Exclude any orders in `CANCELLED`, `REJECTED`, or `DRAFT` status.
3. Count total physical units with status in `('AVAILABLE', 'RENTED')` minus active overlapping bookings.
4. If $\text{Available Units} \ge \text{Requested Quantity}$, reservation succeeds with a database transaction lock (`SELECT ... FOR UPDATE`).
5. Otherwise, the booking request is rejected with a `400 PRODUCT_UNAVAILABLE` error.

---

## 3. Physical Asset Condition States

| Status | Definition | Available for Rent? |
| :--- | :--- | :--- |
| `AVAILABLE` | Cleaned, QC passed, stored in hub vault rack | ✅ Yes |
| `RESERVED` | Allocated to a confirmed upcoming shoot order | ⏳ Booked for window |
| `RENTED` | In possession of DP / on active film set | ❌ No |
| `MAINTENANCE` | Undergoing optical collimation, sensor wet cleaning, or firmware update | ❌ No |
| `DAMAGED` | Awaiting replacement parts or structural repair | ❌ No |
| `RETIRED` | Decommissioned from fleet | ❌ No |

---

## 4. Multi-Point QC Return Inspection

Upon return to the hub, warehouse technicians perform a 7-point hardware inspection:
1. **Camera Sensor**: UV lamp inspection for micro-dust, laser burns, or oil spots.
2. **Optics & Glass**: Scratch, fungus, or coating degradation checks.
3. **Connectors & Ports**: HDMI, 12G-SDI, Mini-XLR, and USB-C PD pins.
4. **Mechanical & Mount**: Lens locking lever, cage screw threads, gimbal motors.
5. **Battery Health**: Load testing and capacity verification.
6. **Accessories Checklist**: XLR top handles, chargers, cables, and flight cases.
7. **Functional Boot Test**: 4K 120p continuous record buffer test.
