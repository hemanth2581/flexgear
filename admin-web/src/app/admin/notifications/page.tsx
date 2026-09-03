'use client';

import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';

export default function AdminNotificationsPage() {
  const notifications = [
    {
      id: '1',
      title: 'New High-Value Shoot Booking',
      message: 'Arjun Menon booked Sony FX3 & 24-70mm GM II for ₹19,972 (Deposit: ₹16,000).',
      time: '10 minutes ago',
      type: 'BOOKING',
    },
    {
      id: '2',
      title: 'Equipment Return Scheduled',
      message: 'RED KOMODO 6K (RED-KMD-771901) is due back at Mumbai Vault at 6:00 PM.',
      time: '1 hour ago',
      type: 'RETURN',
    },
    {
      id: '3',
      title: 'Sensor Calibration QC Pass',
      message: 'Canon C70 Cinema (C70-SN-4481011) passed 10-stop ND filter testing.',
      time: '3 hours ago',
      type: 'QC',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-cinema-border pb-6">
        <h1 className="text-2xl font-black text-white">System &amp; Shoot Dispatch Notifications</h1>
        <p className="text-xs text-zinc-400 mt-1">Real-time alerts for equipment returns, booking payments, and calibration events.</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="p-4 rounded-xl bg-cinema-card border border-cinema-border flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{n.title}</span>
                <span className="text-[10px] font-mono text-zinc-500">{n.time}</span>
              </div>
              <p className="text-xs text-zinc-300 mt-1">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
