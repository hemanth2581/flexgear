import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Navigation } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rental Hubs & Vault Locations | FlexGear',
  description: 'Pick up and return cinema equipment at FlexGear Master Hubs across Bengaluru, Chennai, and Coimbatore with on-set delivery options.',
};

const locations = [
  {
    city: 'Bengaluru',
    name: 'FlexGear Bengaluru Master Vault',
    state: 'Karnataka',
    address: '42 Indiranagar 100ft Road, Stage 2, Bengaluru, Karnataka 560038',
    phone: '+91 80 4910 8820',
    email: 'blr.hub@flexgear.com',
    hours: 'Monday – Sunday: 6:00 AM – 11:00 PM',
    mapQuery: 'Indiranagar+Bengaluru',
    features: ['Cleanroom Sensor Cleaning Bay', 'Full Optical Collimation Bench', '24/7 Early Shoot Pickup Lockers', 'On-Set Emergency Runner Dispatch'],
  },
  {
    city: 'Chennai',
    name: 'FlexGear Chennai Cine Hub',
    state: 'Tamil Nadu',
    address: '15 Sterling Road, Nungambakkam, Chennai, Tamil Nadu 600034',
    phone: '+91 44 3892 1100',
    email: 'chn.hub@flexgear.com',
    hours: 'Monday – Sunday: 6:00 AM – 10:30 PM',
    mapQuery: 'Nungambakkam+Chennai',
    features: ['High-Speed V-Mount Charging Wall', 'Anamorphic Lens Projection Bay', 'Kollywood Film City Delivery Van', 'Dedicated Sound Checkout Suite'],
  },
  {
    city: 'Coimbatore',
    name: 'FlexGear Coimbatore Studio Depot',
    state: 'Tamil Nadu',
    address: '88 Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004',
    phone: '+91 422 2590 334',
    email: 'cbe.hub@flexgear.com',
    hours: 'Monday – Saturday: 7:00 AM – 9:30 PM',
    mapQuery: 'Peelamedu+Coimbatore',
    features: ['Commercial Lighting Studio Grid', 'Drone Test Flight Arena', 'Same-Day Ooty & Valparai Hill Dispatch', 'Cinema Grip & C-Stand Rentals'],
  },
];

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            South India Master Vaults
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            FlexGear Rental Hubs
          </h1>
          <p className="text-neutral-400 text-lg">
            Pick up prepped gear directly from our climate-controlled vault facilities or request direct-to-set temperature-controlled van delivery.
          </p>
        </div>

        {/* Hubs List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {locations.map((loc) => (
            <div
              key={loc.city}
              className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-6 hover:border-amber-500/40 transition-all duration-300"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Navigation className="w-3.5 h-3.5" />
                  {loc.city} Master Hub
                </div>
                <h2 className="text-xl font-bold text-white">{loc.name}</h2>
                <p className="text-sm text-neutral-400">{loc.address}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-neutral-800/80 text-xs text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{loc.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{loc.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{loc.hours}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-neutral-800/80">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Hub Facilities:</span>
                <ul className="space-y-1.5">
                  {loc.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
