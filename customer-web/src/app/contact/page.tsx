'use client';

import React from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, Clock, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const whatsappNumber = '919876543210';
  const whatsappMessage = encodeURIComponent('Hello FlexGear, I am inquiring about custom gear availability and shoot requirements.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            24/7 Camera Tech Support
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Get in Touch with Our Team
          </h1>
          <p className="text-neutral-400 text-lg">
            Need emergency on-set equipment support, custom multi-week quotes, or gear package advice? Our camera technicians are on standby.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Direct WhatsApp Card */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Instant WhatsApp Set Desk</h2>
                <p className="text-sm text-neutral-300 mt-1">
                  Connect instantly with our on-duty camera ACs for instantaneous availability checks, technical specs, and emergency gear dispatch.
                </p>
              </div>
              <div className="space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Average response time: &lt; 3 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Available 24/7 for active shoot emergencies</span>
                </div>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-600/20"
            >
              <MessageSquare className="w-4 h-4" />
              Open WhatsApp Chat
            </a>
          </div>

          {/* Contact Details */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-bold text-white">Hub Helplines</h2>
            
            <div className="space-y-4 text-sm">
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                <div className="font-semibold text-amber-400 text-xs uppercase tracking-wider">Bengaluru Hub</div>
                <div className="text-neutral-200">+91 80 4910 8820</div>
                <div className="text-xs text-neutral-400">blr.hub@flexgear.com</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                <div className="font-semibold text-amber-400 text-xs uppercase tracking-wider">Chennai Hub</div>
                <div className="text-neutral-200">+91 44 3892 1100</div>
                <div className="text-xs text-neutral-400">chn.hub@flexgear.com</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                <div className="font-semibold text-amber-400 text-xs uppercase tracking-wider">Coimbatore Hub</div>
                <div className="text-neutral-200">+91 422 2590 334</div>
                <div className="text-xs text-neutral-400">cbe.hub@flexgear.com</div>
              </div>
            </div>
          </div>

          {/* Fast Message Form */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Production Inquiry</h2>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="Director / DP Name"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Shoot Requirements / Dates</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Sony FX3 + Sigma Cine set in Bengaluru on Oct 10–14"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
