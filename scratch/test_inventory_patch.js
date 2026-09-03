// scratch/test_inventory_patch.js
async function testInventoryPatch() {
  const adminToken = `fg_admin_mock_token_${Date.now()}`;
  const unitId = 'inv-fx3-01';

  console.log(`--- Testing PATCH /api/admin/inventory/${unitId}/status ---`);
  const res = await fetch(`http://localhost:5000/api/admin/inventory/${unitId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: 'MAINTENANCE' }),
  });

  const data = await res.json();
  console.log(`Status Code: ${res.status}`);
  console.log(`Response:`, data);

  if (res.ok && data.data?.status === 'MAINTENANCE') {
    console.log('\n✅ SUCCESS: Inventory status successfully updated to MAINTENANCE!');
  } else {
    throw new Error('Inventory status update failed');
  }

  // Restore back to AVAILABLE
  const restoreRes = await fetch(`http://localhost:5000/api/admin/inventory/${unitId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: 'AVAILABLE' }),
  });
  const restoreData = await restoreRes.json();
  console.log(`Restored status:`, restoreData.data?.status);
}

testInventoryPatch().catch(console.error);
