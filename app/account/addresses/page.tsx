import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/server';
import { MapPin, Plus, Home, Building2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 0;

export default async function AddressesPage() {
  let addresses: any[] = [];

  try {
    const { data } = await supabaseAdmin.from('addresses').select('*');
    if (data) addresses = data;
  } catch (e) {
    console.warn('Addresses fetch error:', e);
  }

  if (addresses.length === 0) {
    addresses = [
      {
        id: '1',
        full_name: 'Arjun Menon (Main Production Studio)',
        phone: '9884039091',
        line1: 'No 20, 88th Street, Ashok Nagar',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600083',
      },
      {
        id: '2',
        full_name: 'Studio 4 / Film City Stage',
        phone: '7845791178',
        line1: '6/1, 1st Main Rd, BTM Layout 1st Stage',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560068',
      },
    ];
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 headingbold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-lenstiger" />
            <span>Saved Shoot & Studio Addresses</span>
          </h2>
          <p className="text-xs text-gray-500">Manage destination sets for express gear delivery</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5 space-y-3 relative group hover:border-lenstiger hover:bg-white transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-lenstiger flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5" />
                <span>Production Set</span>
              </span>
              <span className="text-[10px] font-bold bg-lenstiger-50 text-lenstiger px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-bold text-gray-900 text-sm">{addr.full_name}</div>
              <div className="text-gray-600">{addr.line1}</div>
              <div className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</div>
              <div className="text-gray-700 font-semibold flex items-center gap-1 pt-1">
                <Phone className="h-3 w-3 text-lenstiger" />
                <span>+91 {addr.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
