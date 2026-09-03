'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Handshake, CheckCircle2, ShieldCheck, DollarSign, Sparkles, Building2, Phone, Mail, ArrowRight } from 'lucide-react';
import { useLocation } from '@/components/providers/LocationProvider';

export default function PartnerPage() {
  const { selectedCity } = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: selectedCity,
    gearDetails: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#f3f3f3] min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-lenstiger text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 text-gold text-xs font-black uppercase tracking-wider mb-4">
            <Handshake className="w-4 h-4" />
            <span>FlexGear Partner Program</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black headingbold text-white mb-3">
            Monetize Your Cinema & Photography Gear
          </h1>

          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
            Turn your idle cameras, lenses, and lighting equipment into recurring monthly revenue. We take care of verified client rentals, secure logistics, and maintenance.
          </p>
        </div>

        {/* 3 Steps to Earn */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-lenstiger/10 text-lenstiger font-black text-lg flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="font-bold text-gray-900 text-base headingbold">List Your Equipment</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Submit your gear details (camera models, lenses, condition, and availability periods).
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-lenstiger/10 text-lenstiger font-black text-lg flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="font-bold text-gray-900 text-base headingbold">Custody & QC Verification</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Drop off your gear at our hub in {selectedCity} for sensor swab, optical testing, and insurance tagging.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-lenstiger/10 text-lenstiger font-black text-lg flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="font-bold text-gray-900 text-base headingbold">Monthly Revenue Payouts</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Earn up to 70% rental revenue split directly transferred to your bank account every 1st of the month.
            </p>
          </div>
        </div>

        {/* Vendor Partner Application Form */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <div className="text-center max-w-lg mx-auto mb-8 space-y-1">
            <h2 className="text-2xl font-black text-gray-900 headingbold">
              Become a Vendor Partner
            </h2>
            <p className="text-xs text-gray-500">
              Fill out the form below and our partner onboarding manager will reach out within 2 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-lenstiger-50 border border-lenstiger text-center space-y-3 max-w-md mx-auto">
              <CheckCircle2 className="w-12 h-12 text-lenstiger mx-auto" />
              <h3 className="text-lg font-bold text-gray-900">Application Received!</h3>
              <p className="text-xs text-gray-600">
                Thank you for applying, <strong>{formData.name}</strong>. Our vendor coordinator in {formData.city} will call you at {formData.phone} shortly.
              </p>
              <Link
                href="/"
                className="inline-block px-5 py-2 rounded-xl bg-lenstiger text-white font-bold text-xs mt-2"
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arjun Menon"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-lenstiger focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98840 39091"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-lenstiger focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@studio.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-lenstiger focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Rental Hub City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-lenstiger focus:outline-none cursor-pointer"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Equipment You Wish to List (Camera models, Lenses, Lighting)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Sony FX3 Body, Sony 24-70mm GM II, Aputure 600d Pro, Nanlite FS 300..."
                  value={formData.gearDetails}
                  onChange={(e) => setFormData({ ...formData, gearDetails: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-lenstiger focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-lenstiger hover:bg-lenstiger-hover text-white font-black text-sm uppercase tracking-wider shadow-md transition active:scale-98"
                >
                  Submit Partner Application →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
