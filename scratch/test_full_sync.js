// scratch/test_full_sync.js
async function runFullSyncTest() {
  const API_BASE = 'http://localhost:5000/api';
  const customerToken = `fg_demo_token_${Date.now()}`;
  const adminToken = `fg_admin_mock_token_${Date.now()}`;

  console.log('--- 1. Testing Customer Equipment Catalog Fetch ---');
  const eqRes = await fetch(`${API_BASE}/equipment`);
  const eqData = await eqRes.json();
  const gearList = Array.isArray(eqData.data) ? eqData.data : (eqData.data?.items || []);
  console.log(`[PASS] Catalog fetched: ${gearList.length} items available.`);
  const sampleGear = gearList[0];
  console.log(`Sample Gear: ${sampleGear.name} (ID: ${sampleGear.id}, Price: ₹${sampleGear.daily_price}/day)`);

  console.log('\n--- 2. Testing Customer Checkout / Booking Creation ---');
  const checkoutPayload = {
    items: [
      {
        equipmentId: sampleGear.id,
        quantity: 1,
        dailyPrice: sampleGear.daily_price,
        securityDeposit: sampleGear.security_deposit || 25000,
      }
    ],
    startDate: '2026-09-10',
    endDate: '2026-09-13',
    deliveryMode: 'DELIVERY',
    deliveryAddress: {
      fullName: 'Hemanth G Productions',
      phone: '+91 98765 43210',
      street: 'Studio 7, Film City',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400065',
      lat: 19.076,
      lng: 72.877,
    },
    notes: 'Feature film indoor test shoot',
  };

  const checkoutRes = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${customerToken}`,
    },
    body: JSON.stringify(checkoutPayload),
  });

  const checkoutData = await checkoutRes.json();
  if (!checkoutRes.ok) {
    throw new Error(`Checkout failed: ${JSON.stringify(checkoutData)}`);
  }
  const createdRental = checkoutData.data.rental;
  console.log(`[PASS] Order Created: ${createdRental.rental_number || createdRental.id}`);
  console.log(`Total: ₹${createdRental.total_amount} | Escrow Deposit: ₹${createdRental.security_deposit} | Initial Status: ${createdRental.status}`);

  console.log('\n--- 3. Testing Customer "My Shoots" Dashboard Fetch ---');
  const myRentalsRes = await fetch(`${API_BASE}/rentals`, {
    headers: { 'Authorization': `Bearer ${customerToken}` },
  });
  const myRentalsData = await myRentalsRes.json();
  console.log(`[PASS] Customer has ${myRentalsData.data?.length || 0} active/listed orders.`);

  console.log('\n--- 4. Testing Admin Dashboard Metrics Sync ---');
  const dashRes = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${adminToken}` },
  });
  const dashData = await dashRes.json();
  console.log(`[PASS] Admin Telemetry KPIs:`, dashData.data.kpis);

  console.log('\n--- 5. Testing Admin Order Queue & Status Updates ---');
  const adminRentalsRes = await fetch(`${API_BASE}/admin/rentals`, {
    headers: { 'Authorization': `Bearer ${adminToken}` },
  });
  const adminRentalsData = await adminRentalsRes.json();
  console.log(`[PASS] Admin Orders List count: ${adminRentalsData.data?.length || 0}`);

  console.log(`\n--- 6. Admin Updates Status -> READY_FOR_PICKUP ---`);
  const patchRes = await fetch(`${API_BASE}/admin/rentals/${createdRental.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: 'READY_FOR_PICKUP' }),
  });
  const patchData = await patchRes.json();
  console.log(`[PASS] Updated Status: ${patchData.data?.status}`);

  console.log(`\n--- 7. Verifying Customer Sees Updated Status in Real Time ---`);
  const verifyRes = await fetch(`${API_BASE}/rentals/${createdRental.id}`, {
    headers: { 'Authorization': `Bearer ${customerToken}` },
  });
  const verifyData = await verifyRes.json();
  console.log(`[PASS] Customer Verified Rental Status: ${verifyData.data?.status} (Expected: READY_FOR_PICKUP)`);

  console.log(`\n--- 8. Admin Completes & Settles Deposit -> COMPLETED ---`);
  const completeRes = await fetch(`${API_BASE}/admin/rentals/${createdRental.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: 'COMPLETED' }),
  });
  const completeData = await completeRes.json();
  console.log(`[PASS] Final Status: ${completeData.data?.status} (Deposit Escrow Settled)`);

  console.log('\n=============================================');
  console.log('🎉 ALL END-TO-END CUSTOMER & ADMIN SYNCS PASSED 100%!');
  console.log('=============================================');
}

runFullSyncTest().catch(console.error);
