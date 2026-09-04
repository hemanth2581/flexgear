'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Handshake, CheckCircle2, ShieldCheck, DollarSign, Sparkles, Building2, Phone, Mail, ArrowRight } from 'lucide-react';
import { useLocation } from '@/components/providers/LocationProvider';

export default function PartnerPage() {
  const { selectedCity } = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: selectedCity,
    gearDetails: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, city: formData.city || selectedCity }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit partner application.');
      }
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-cinema-bg min-h-screen py-10 px-4 text-cinema-text">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="hero-cinema-gradient border border-cinema-border rounded-3xl p-8 sm:p-12 text-center shadow-cinema relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-black uppercase tracking-wider mb-4">
            <Handshake className="w-4 h-4" />
            <span>FlexGear Partner Program</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black headingbold text-cinema-text mb-3">
            Monetize Your Cinema &amp; Photography Gear
          </h1>

          <p className="text-sm sm:text-base text-cinema-muted max-w-2xl mx-auto leading-relaxed">
            Turn your idle cameras, lenses, and lighting equipment into recurring monthly revenue. We take care of verified client rentals, secure logistics, and sensor-calibrated maintenance.
          </p>
        </div>

        {/* 3 Steps to Earn */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-cinema-card rounded-2xl p-6 border border-cinema-border shadow-cinema text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent font-black text-lg flex items-center justify-center mx-auto border border-accent/30">
              1
            </div>
            <h3 className="font-bold text-cinema-text text-base headingbold">List Your Equipment</h3>
            <p className="text-xs text-cinema-muted leading-relaxed">
              Submit your gear details (camera models, cinema primes, condition, and availability periods).
            </p>
          </div>

          <div className="bg-cinema-card rounded-2xl p-6 border border-cinema-border shadow-cinema text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent font-black text-lg flex items-center justify-center mx-auto border border-accent/30">
              2
            </div>
            <h3 className="font-bold text-cinema-text text-base headingbold">Custody &amp; QC Verification</h3>
            <p className="text-xs text-cinema-muted leading-relaxed">
              Drop off your gear at our hub in {selectedCity} for sensor swab, optical bench testing, and insurance tagging.
            </p>
          </div>

          <div className="bg-cinema-card rounded-2xl p-6 border border-cinema-border shadow-cinema text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent font-black text-lg flex items-center justify-center mx-auto border border-accent/30">
              3
            </div>
            <h3 className="font-bold text-cinema-text text-base headingbold">Monthly Revenue Payouts</h3>
            <p className="text-xs text-cinema-muted leading-relaxed">
              Earn up to 70% rental revenue split directly transferred to your bank account every 1st of the month.
            </p>
          </div>
        </div>

        {/* Vendor Partner Application Form */}
        <div className="bg-cinema-card rounded-3xl p-8 border border-cinema-border shadow-cinema">
          <div className="text-center max-w-lg mx-auto mb-8 space-y-1">
            <h2 className="text-2xl font-black text-cinema-text headingbold">
              Become a Vendor Partner
            </h2>
            <p className="text-xs text-cinema-muted">
              Fill out the form below and our partner onboarding manager will reach out within 2 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-accent/10 border border-accent/30 text-center space-y-3 max-w-md mx-auto">
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto" />
              <h3 className="text-lg font-bold text-cinema-text">Application Received!</h3>
              <p className="text-xs text-cinema-muted">
                Thank you for applying, <strong>{formData.name}</strong>. Our vendor coordinator in {formData.city} will call you at {formData.phone} shortly.
              </p>
              <Link
                href="/"
                className="inline-block px-5 py-2.5 rounded-xl bg-accent text-cinema-bg font-black text-xs mt-2 hover:bg-accent-hover transition"
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cinema-text font-bold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arjun Menon"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-cinema-border bg-cinema-elevated text-cinema-text focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-cinema-text font-bold mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98840 39091"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-cinema-border bg-cinema-elevated text-cinema-text focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cinema-text font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@studio.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-cinema-border bg-cinema-elevated text-cinema-text focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-cinema-text font-bold mb-1">Rental Hub City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-cinema-border bg-cinema-elevated text-cinema-text focus:border-accent focus:outline-none cursor-pointer"
                  >
                    <option value="Chennai" className="bg-cinema-card">Chennai</option>
                    <option value="Bengaluru" className="bg-cinema-card">Bengaluru</option>
                    <option value="Coimbatore" className="bg-cinema-card">Coimbatore</option>
                    <option value="Hyderabad" className="bg-cinema-card">Hyderabad</option>
                    <option value="Kochi" className="bg-cinema-card">Kochi</option>
                    <option value="Mumbai" className="bg-cinema-card">Mumbai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-cinema-text font-bold mb-1">
                  Equipment You Wish to List (Camera models, Lenses, Lighting)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Sony FX3 Body, Sony 24-70mm GM II, Aputure 600d Pro, Nanlite FS 300..."
                  value={formData.gearDetails}
                  onChange={(e) => setFormData({ ...formData, gearDetails: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cinema-border bg-cinema-elevated text-cinema-text focus:border-accent focus:outline-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-semantic-error/15 border border-semantic-error/30 text-semantic-error text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-black text-sm uppercase tracking-wider shadow-md transition active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Partner Application →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
