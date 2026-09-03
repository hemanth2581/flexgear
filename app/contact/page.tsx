'use client';

import React, { useState } from 'react';
import { useLocation } from '@/components/providers/LocationProvider';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  const { selectedCity, setCity } = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: selectedCity,
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Hi FlexGear, I have a rental inquiry for ${selectedCity}.`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="bg-[#f3f3f3] min-h-screen py-10 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-lenstiger-50 text-lenstiger font-bold text-xs">
            <span>GET IN TOUCH</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 headingbold">
            Contact FlexGear Rental Hubs
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Have questions about equipment compatibility, dates, or bespoke corporate shoot packages? We are available 24/7.
          </p>
        </div>

        {/* City Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chennai */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-lg text-gray-900 headingbold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-lenstiger" />
                <span>Chennai Hub</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lenstiger-50 text-lenstiger">
                HQ & Studio
              </span>
            </div>
            <p className="text-xs text-gray-600">
              No 20, 88th Street, Ashok Nagar, Chennai - 600083
            </p>
            <div className="text-xs text-gray-700 space-y-1 pt-1">
              <div><strong>Primary:</strong> +91 98840 39091</div>
              <div><strong>Secondary:</strong> +91 78457 91178</div>
              <div><strong>Hours:</strong> Open 24 Hours / 7 Days</div>
            </div>
            <button
              onClick={() => handleWhatsApp('919884039091')}
              className="w-full py-2.5 rounded-2xl bg-whatsapp hover:bg-whatsapp-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Chennai Hub</span>
            </button>
          </div>

          {/* Bengaluru */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-lg text-gray-900 headingbold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-lenstiger" />
                <span>Bengaluru Hub</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lenstiger-50 text-lenstiger">
                BTM Hub
              </span>
            </div>
            <p className="text-xs text-gray-600">
              6/1, 1st Main Rd, BTM Layout 1st Stage, Bengaluru - 560068
            </p>
            <div className="text-xs text-gray-700 space-y-1 pt-1">
              <div><strong>Primary:</strong> +91 78457 91178</div>
              <div><strong>Support:</strong> +91 88380 51796</div>
              <div><strong>Hours:</strong> 7:00 AM – 11:30 PM (24/7 on request)</div>
            </div>
            <button
              onClick={() => handleWhatsApp('917845791178')}
              className="w-full py-2.5 rounded-2xl bg-whatsapp hover:bg-whatsapp-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Bengaluru Hub</span>
            </button>
          </div>

          {/* Coimbatore */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-black text-lg text-gray-900 headingbold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-lenstiger" />
                <span>Coimbatore Hub</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lenstiger-50 text-lenstiger">
                Gandhipuram
              </span>
            </div>
            <p className="text-xs text-gray-600">
              No.22, 2nd St Ext, Gandhipuram, Coimbatore - 641012
            </p>
            <div className="text-xs text-gray-700 space-y-1 pt-1">
              <div><strong>Primary:</strong> +91 88380 51796</div>
              <div><strong>Support:</strong> +91 98840 39091</div>
              <div><strong>Hours:</strong> 8:00 AM – 10:00 PM</div>
            </div>
            <button
              onClick={() => handleWhatsApp('918838051796')}
              className="w-full py-2.5 rounded-2xl bg-whatsapp hover:bg-whatsapp-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Coimbatore Hub</span>
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 headingbold">Send an Online Inquiry</h2>
            <p className="text-xs text-gray-500">We respond within 15 minutes during business hours.</p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-lenstiger-50 border border-lenstiger/20 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-lenstiger mx-auto" />
              <h3 className="font-black text-lg text-gray-900 headingbold">Inquiry Dispatched!</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Thank you! Our rental desk for {form.city || selectedCity} will contact you via WhatsApp and phone shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-lenstiger underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Your Full Name</label>
                  <Input
                    required
                    placeholder="Arjun Kumar"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Phone Number</label>
                  <Input
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Email Address</label>
                  <Input
                    type="email"
                    required
                    placeholder="arjun@cinemafilm.in"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Target Hub / City</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-300 bg-gray-50/50 text-xs font-semibold text-gray-900 focus:outline-none"
                  >
                    <option value="Chennai">Chennai Hub</option>
                    <option value="Bengaluru">Bengaluru Hub</option>
                    <option value="Coimbatore">Coimbatore Hub</option>
                    <option value="Hyderabad">Hyderabad Hub</option>
                    <option value="Kochi">Kochi Hub</option>
                    <option value="Mumbai">Mumbai Hub</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Rental Requirements / Dates</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Need Sony FX3 + 24-70 GM II + Wireless mic for a 2-day shoot on this coming weekend in Chennai..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50/50 text-xs text-gray-900 focus:outline-none focus:border-lenstiger"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-2xl bg-gold hover:bg-gold-hover text-gray-950 font-black text-xs shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Rental Inquiry</span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
