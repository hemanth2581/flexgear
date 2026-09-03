'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, MapPin, Phone, Mail, Youtube, Instagram, Facebook, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';
import { useLocation } from '@/components/providers/LocationProvider';

export function Footer() {
  const { setCity } = useLocation();

  return (
    <footer className="bg-black text-white pt-14 pb-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Logo & About Us */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-lenstiger flex items-center justify-center text-white">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white headingbold">
                FLEX<span className="text-gold">GEAR</span>
              </span>
            </Link>

            <div className="space-y-2">
              <h5 className="text-sm font-bold text-white uppercase tracking-wider">About Us</h5>
              <p className="text-xs text-gray-400 leading-relaxed">
                FlexGear is a Premium Camera, Lens & Production Gear Rental Company located in the cities of Chennai, Bengaluru, Coimbatore & Hyderabad. 100% verified equipment and express on-set delivery.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-lenstiger hover:border-lenstiger transition"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-lenstiger hover:border-lenstiger transition"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-lenstiger hover:border-lenstiger transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h5>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link href="/about" className="hover:text-lenstiger-light transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/equipment" className="hover:text-lenstiger-light transition">
                  All Rental Gear
                </Link>
              </li>
              <li>
                <Link href="/equipment?mode=used" className="hover:text-lenstiger-light transition">
                  Buy / Sell Used Gear
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-lenstiger-light transition">
                  Partner with FlexGear
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-lenstiger-light transition">
                  Privacy Policy & Terms
                </Link>
              </li>
            </ul>

            {/* Mobile App Callout */}
            <div className="pt-2">
              <h6 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-gold" />
                <span>Download Mobile App</span>
              </h6>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 text-xs">
                <span className="font-bold text-white">Google Play</span> • Android App Ready
              </div>
            </div>
          </div>

          {/* Column 3: My Account */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">My Account</h5>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link href="/cart" className="hover:text-lenstiger-light transition">
                  View Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-lenstiger-light transition">
                  Client Login / Register
                </Link>
              </li>
              <li>
                <Link href="/rentals" className="hover:text-lenstiger-light transition">
                  Booking History & Invoices
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-lenstiger-light transition">
                  KYC Verification Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-lenstiger-light transition">
                  Contact Support 24/7
                </Link>
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-400 space-y-1">
              <div className="font-bold text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-lenstiger" />
                <span>Zero Security Deposit</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Verified professionals enjoy instant equipment release with zero hold deposit.
              </p>
            </div>
          </div>

          {/* Column 4: Store Hubs & Contact */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">Get In Touch</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-lenstiger shrink-0 mt-0.5" />
                <span>
                  <strong className="text-gray-200">Chennai Hub:</strong> No 20, 88th Street, Ashok Nagar, Chennai - 600083
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-lenstiger shrink-0 mt-0.5" />
                <span>
                  <strong className="text-gray-200">Bengaluru Hub:</strong> 6/1, 1st Main Rd, BTM Layout, Bengaluru - 560068
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-lenstiger shrink-0 mt-0.5" />
                <span>
                  <strong className="text-gray-200">Coimbatore Hub:</strong> No.22, 2nd St Ext, Gandhipuram, Coimbatore - 641012
                </span>
              </li>
              <li className="flex items-center gap-2 pt-2 text-gray-300">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Chennai: +91 98840 39091</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Bengaluru: +91 78457 91178</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Coimbatore: +91 88380 51796</span>
              </li>
              <li className="flex items-center gap-2 pt-1 text-gray-300">
                <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>contact@flexgear.rentals</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Copyright © 2026{' '}
            <span className="text-lenstiger font-bold">FlexGear Rentals</span>. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <button onClick={() => setCity('Chennai')} className="hover:text-lenstiger">
              Chennai
            </button>
            <span>•</span>
            <button onClick={() => setCity('Bengaluru')} className="hover:text-lenstiger">
              Bengaluru
            </button>
            <span>•</span>
            <button onClick={() => setCity('Coimbatore')} className="hover:text-lenstiger">
              Coimbatore
            </button>
            <span>•</span>
            <button onClick={() => setCity('Hyderabad')} className="hover:text-lenstiger">
              Hyderabad
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
