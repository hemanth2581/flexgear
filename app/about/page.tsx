import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, Clock, Award, Users, HeartHandshake, CheckCircle2, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | FlexGear Camera & Lens Rentals',
  description: 'FlexGear is South India’s premier camera, lens, and production gear rental platform operating in Chennai, Bengaluru, Coimbatore, and Hyderabad.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#f3f3f3] min-h-screen py-10 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-lenstiger-50 text-lenstiger font-bold text-xs">
            <span>ABOUT FLEXGEAR</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 headingbold">
            Empowering Filmmakers, Creators & Production Crews
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            FlexGear is South India’s leading camera, lens, and production equipment rental company.
            With strategically located hubs across Chennai, Bengaluru, Coimbatore, and Hyderabad, we provide
            direct access to cinema-grade cameras, prime lenses, studio lighting, and audio equipment with 100% sensor-cleaned guarantee and express on-set delivery.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-lenstiger-50 text-lenstiger flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-gray-900 headingbold">90-Minute On-Set Delivery</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Express delivery directly to your shooting location, soundstage, or studio across city limits.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-lenstiger-50 text-lenstiger flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-gray-900 headingbold">Sensor-Cleaned & Calibrated</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every camera sensor, optical element, and gimbal motor undergoes multi-point testing before dispatch.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-lenstiger-50 text-lenstiger flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-gray-900 headingbold">Zero Deposit with KYC</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Verified cinematographers, agencies, and production houses enjoy instant rental release with zero hold deposit.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-lenstiger-50 text-lenstiger flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-gray-900 headingbold">24/7 Crew Support</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Round-the-clock technical helpline and WhatsApp support for mid-shoot equipment queries or emergency swaps.
            </p>
          </div>
        </div>

        {/* Our Store Hubs */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 headingbold">Our Rental Hubs</h2>
            <p className="text-xs text-gray-500">Visit our physical demo rooms to test and collect your gear</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-lenstiger font-bold text-base">
                <MapPin className="w-5 h-5" />
                <span>Chennai Hub</span>
              </div>
              <p className="text-xs text-gray-600">
                No 20, 88th Street, Ashok Nagar, Chennai - 600083
              </p>
              <div className="text-xs font-semibold text-gray-900 pt-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-lenstiger" />
                <span>+91 98840 39091</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-lenstiger font-bold text-base">
                <MapPin className="w-5 h-5" />
                <span>Bengaluru Hub</span>
              </div>
              <p className="text-xs text-gray-600">
                6/1, 1st Main Rd, BTM Layout 1st Stage, Bengaluru - 560068
              </p>
              <div className="text-xs font-semibold text-gray-900 pt-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-lenstiger" />
                <span>+91 78457 91178</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-lenstiger font-bold text-base">
                <MapPin className="w-5 h-5" />
                <span>Coimbatore Hub</span>
              </div>
              <p className="text-xs text-gray-600">
                No.22, 2nd St Ext, Gandhipuram, Coimbatore - 641012
              </p>
              <div className="text-xs font-semibold text-gray-900 pt-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-lenstiger" />
                <span>+91 88380 51796</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-lenstiger text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black headingbold">Ready for Your Next Production?</h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
            Book professional cameras and lenses online with instant date-wise pricing or chat with our rental engineers on WhatsApp.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/equipment"
              className="px-6 py-3 rounded-2xl bg-gold hover:bg-gold-hover text-gray-950 font-black text-xs shadow-md transition active:scale-95"
            >
              Explore Equipment Catalog
            </Link>
            <Link
              href="/partner"
              className="px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition active:scale-95"
            >
              Partner with FlexGear
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
