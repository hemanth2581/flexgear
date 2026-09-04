'use client';

import React, { useState } from 'react';
import { useLocation } from '@/components/providers/LocationProvider';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  const { selectedCity, setCity } = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: selectedCity,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, city: form.city || selectedCity }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Hi FlexGear, I have a rental inquiry for ${selectedCity}.`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="bg-cinema-bg min-h-screen py-10 text-cinema-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold text-xs">
            <span>GET IN TOUCH</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-cinema-text headingbold">
            Contact FlexGear Rental Hubs
          </h1>
          <p className="text-xs sm:text-sm text-cinema-muted">
            Have questions about equipment compatibility, dates, or bespoke corporate shoot packages? We are available 24/7.
          </p>
        </div>

        {/* City Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chennai */}
          <div className="bg-cinema-card rounded-3xl p-6 border border-cinema-border shadow-cinema space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-lg text-cinema-text headingbold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                <span>Chennai Hub</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent">
                HQ &amp; Studio
              </span>
            </div>
            <p className="text-xs text-cinema-muted">
              No 20, 88th Street, Ashok Nagar, Chennai - 600083
            </p>
            <div className="text-xs text-cinema-text space-y-1 pt-1">
              <div><strong className="text-cinema-muted">Primary:</strong> +91 98840 39091</div>
              <div><strong className="text-cinema-muted">Secondary:</strong> +91 78457 91178</div>
              <div><strong className="text-cinema-muted">Hours:</strong> Open 24 Hours / 7 Days</div>
            </div>
            <button
              onClick={() => handleWhatsApp('919884039091')}
              className="w-full py-2.5 rounded-2xl bg-semantic-success hover:bg-semantic-success/90 text-cinema-bg font-black text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Chennai Hub</span>
            </button>
          </div>

          {/* Bengaluru */}
          <div className="bg-cinema-card rounded-3xl p-6 border border-cinema-border shadow-cinema space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-lg text-cinema-text headingbold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                <span>Bengaluru Hub</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent">
                BTM Hub
              </span>
            </div>
            <p className="text-xs text-cinema-muted">
              6/1, 1st Main Rd, BTM Layout 1st Stage, Bengaluru - 560068
            </p>
            <div className="text-xs text-cinema-text space-y-1 pt-1">
              <div><strong className="text-cinema-muted">Primary:</strong> +91 78457 91178</div>
              <div><strong className="text-cinema-muted">Support:</strong> +91 88380 51796</div>
              <div><strong className="text-cinema-muted">Hours:</strong> 7:00 AM – 11:30 PM (24/7 on request)</div>
            </div>
            <button
              onClick={() => handleWhatsApp('917845791178')}
              className="w-full py-2.5 rounded-2xl bg-semantic-success hover:bg-semantic-success/90 text-cinema-bg font-black text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Bengaluru Hub</span>
            </button>
          </div>

          {/* Coimbatore */}
          <div className="bg-cinema-card rounded-3xl p-6 border border-cinema-border shadow-cinema space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-lg text-cinema-text headingbold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                <span>Coimbatore Hub</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent">
                Gandhipuram
              </span>
            </div>
            <p className="text-xs text-cinema-muted">
              No.22, 2nd St Ext, Gandhipuram, Coimbatore - 641012
            </p>
            <div className="text-xs text-cinema-text space-y-1 pt-1">
              <div><strong className="text-cinema-muted">Primary:</strong> +91 88380 51796</div>
              <div><strong className="text-cinema-muted">Support:</strong> +91 98840 39091</div>
              <div><strong className="text-cinema-muted">Hours:</strong> 8:00 AM – 10:00 PM</div>
            </div>
            <button
              onClick={() => handleWhatsApp('918838051796')}
              className="w-full py-2.5 rounded-2xl bg-semantic-success hover:bg-semantic-success/90 text-cinema-bg font-black text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Coimbatore Hub</span>
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-cinema-card rounded-3xl p-8 sm:p-10 border border-cinema-border shadow-cinema max-w-2xl mx-auto space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-cinema-text headingbold">Send an Online Inquiry</h2>
            <p className="text-xs text-cinema-muted">We respond within 15 minutes during business hours.</p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-accent/10 border border-accent/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-accent mx-auto" />
              <h3 className="font-black text-lg text-cinema-text headingbold">Inquiry Dispatched!</h3>
              <p className="text-xs text-cinema-muted max-w-sm mx-auto">
                Thank you! Our rental desk for {form.city || selectedCity} will contact you via WhatsApp and phone shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-accent underline cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-cinema-text">Your Full Name</label>
                  <Input
                    required
                    placeholder="Arjun Kumar"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-xl border-cinema-border bg-cinema-elevated text-cinema-text focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-cinema-text">Phone Number</label>
                  <Input
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-xl border-cinema-border bg-cinema-elevated text-cinema-text focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-cinema-text">Email Address</label>
                  <Input
                    type="email"
                    required
                    placeholder="arjun@cinemafilm.in"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="rounded-xl border-cinema-border bg-cinema-elevated text-cinema-text focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-cinema-text">Target Hub / City</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-cinema-border bg-cinema-elevated text-xs font-semibold text-cinema-text focus:border-accent focus:outline-none cursor-pointer"
                  >
                    <option value="Chennai" className="bg-cinema-card">Chennai Hub</option>
                    <option value="Bengaluru" className="bg-cinema-card">Bengaluru Hub</option>
                    <option value="Coimbatore" className="bg-cinema-card">Coimbatore Hub</option>
                    <option value="Hyderabad" className="bg-cinema-card">Hyderabad Hub</option>
                    <option value="Kochi" className="bg-cinema-card">Kochi Hub</option>
                    <option value="Mumbai" className="bg-cinema-card">Mumbai Hub</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-cinema-text">Rental Requirements / Dates</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Need Sony FX3 + 24-70 GM II + Wireless mic for a 2-day shoot on this coming weekend in Chennai..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-3 rounded-xl border border-cinema-border bg-cinema-elevated text-xs text-cinema-text focus:outline-none focus:border-accent"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-semantic-error/15 border border-semantic-error/30 text-semantic-error text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-2xl bg-accent hover:bg-accent-hover text-cinema-bg font-black text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Inquiry...' : 'Submit Rental Inquiry'}</span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
