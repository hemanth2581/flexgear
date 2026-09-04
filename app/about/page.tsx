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
    <div className="bg-cinema-bg min-h-screen py-10 text-cinema-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <div className="bg-cinema-card rounded-3xl p-8 sm:p-12 border border-cinema-border shadow-cinema text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold text-xs">
            <span>ABOUT FLEXGEAR</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cinema-text headingbold">
            Empowering Filmmakers, Creators &amp; Production Crews
          </h1>
          <p className="text-sm sm:text-base text-cinema-muted leading-relaxed">
            FlexGear is South India’s leading camera, lens, and production equipment rental company.
            With strategically located hubs across Chennai, Bengaluru, Coimbatore, and Hyderabad, we provide
            direct access to cinema-grade cameras, prime lenses, studio lighting, and audio equipment with 100% sensor-cleaned guarantee and express on-set delivery.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-cinema-card rounded-3xl p-6 border border-cinema-border shadow-cinema space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center border border-accent/30">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-cinema-text headingbold">90-Minute On-Set Delivery</h3>
            <p className="text-xs text-cinema-muted leading-relaxed">
              Express delivery directly to your shooting location, soundstage, or studio across city limits.
            </p>
          </div>

          <div className="bg-cinema-card rounded-3xl p-6 border border-cinema-border shadow-cinema space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center border border-accent/30">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-cinema-text headingbold">Sensor-Cleaned &amp; Calibrated</h3>
            <p className="text-xs text-cinema-muted leading-relaxed">
              Every camera sensor, optical element, and gimbal motor undergoes multi-point testing before dispatch.
            </p>
          </div>

          <div className="bg-cinema-card rounded-3xl p-6 border border-cinema-border shadow-cinema space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center border border-accent/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-cinema-text headingbold">Zero Deposit with KYC</h3>
            <p className="text-xs text-cinema-muted leading-relaxed">
              Verified cinematographers, agencies, and production houses enjoy instant rental release with zero hold deposit.
            </p>
          </div>

          <div className="bg-cinema-card rounded-3xl p-6 border border-cinema-border shadow-cinema space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center border border-accent/30">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-cinema-text headingbold">24/7 Crew Support</h3>
            <p className="text-xs text-cinema-muted leading-relaxed">
              Round-the-clock technical helpline and WhatsApp support for mid-shoot equipment queries or emergency swaps.
            </p>
          </div>
        </div>

        {/* Our Store Hubs */}
        <div className="bg-cinema-card rounded-3xl p-8 sm:p-10 border border-cinema-border shadow-cinema space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-cinema-text headingbold">Our Rental Hubs</h2>
            <p className="text-xs text-cinema-muted">Visit our physical demo rooms to test and collect your gear</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-cinema-elevated border border-cinema-border space-y-2">
              <div className="flex items-center gap-2 text-accent font-bold text-base">
                <MapPin className="w-5 h-5" />
                <span>Chennai Hub</span>
              </div>
              <p className="text-xs text-cinema-muted">
                No 20, 88th Street, Ashok Nagar, Chennai - 600083
              </p>
              <div className="text-xs font-semibold text-cinema-text pt-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>+91 98840 39091</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-cinema-elevated border border-cinema-border space-y-2">
              <div className="flex items-center gap-2 text-accent font-bold text-base">
                <MapPin className="w-5 h-5" />
                <span>Bengaluru Hub</span>
              </div>
              <p className="text-xs text-cinema-muted">
                6/1, 1st Main Rd, BTM Layout 1st Stage, Bengaluru - 560068
              </p>
              <div className="text-xs font-semibold text-cinema-text pt-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>+91 78457 91178</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-cinema-elevated border border-cinema-border space-y-2">
              <div className="flex items-center gap-2 text-accent font-bold text-base">
                <MapPin className="w-5 h-5" />
                <span>Coimbatore Hub</span>
              </div>
              <p className="text-xs text-cinema-muted">
                No.22, 2nd St Ext, Gandhipuram, Coimbatore - 641012
              </p>
              <div className="text-xs font-semibold text-cinema-text pt-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>+91 88380 51796</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="hero-cinema-gradient border border-cinema-border rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-cinema">
          <h2 className="text-2xl sm:text-3xl font-black headingbold text-cinema-text">Ready for Your Next Production?</h2>
          <p className="text-xs sm:text-sm text-cinema-muted max-w-xl mx-auto">
            Book professional cameras and lenses online with instant date-wise pricing or chat with our rental engineers on WhatsApp.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/equipment"
              className="px-6 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-cinema-bg font-black text-xs shadow-md transition active:scale-95 cursor-pointer"
            >
              Explore Equipment Catalog
            </Link>
            <Link
              href="/partner"
              className="px-6 py-3 rounded-2xl bg-cinema-elevated hover:bg-cinema-border text-cinema-text font-bold text-xs border border-cinema-border transition active:scale-95 cursor-pointer"
            >
              Partner with FlexGear
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
