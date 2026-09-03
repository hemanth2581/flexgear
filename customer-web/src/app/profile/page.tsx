'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, Phone, Mail, MapPin, Award } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Filmmaker Profile</h1>
        <p className="text-xs text-zinc-400 mt-1">Manage your verified production credentials and security escrow preferences.</p>
      </div>

      <div className="p-8 rounded-2xl bg-cinema-card border border-cinema-border space-y-6">
        <div className="flex items-center gap-4 border-b border-cinema-border pb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-2xl font-bold text-primary">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.full_name || 'Arjun Menon (Filmmaker)'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Verified Pro Filmmaker
              </span>
              <span className="text-xs text-zinc-500 font-mono">Role: {user?.role || 'CUSTOMER'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </span>
            <p className="text-white font-medium">{user?.email || 'customer@flexgear.test'}</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Firebase Verified Phone
            </span>
            <p className="text-white font-medium">{user?.phone || '+91 98765 43210'}</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Primary Studio Hub
            </span>
            <p className="text-white font-medium">Stage 4B, Film City, Goregaon East, Mumbai</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-zinc-500 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Pro Tier Benefits
            </span>
            <p className="text-white font-medium">15% Weekly Discount & Zero Paperwork Handover</p>
          </div>
        </div>

        <div className="pt-4 border-t border-cinema-border flex justify-between items-center">
          <span className="text-xs text-zinc-500 font-mono">Protected by FlexGear Authentication Engine</span>
          <Button variant="outline" size="sm" onClick={() => logout()}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
