'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, BarChart3, Camera, FileText, Users, ArrowLeft } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard Analytics', href: '/admin', icon: BarChart3 },
    { name: 'Equipment & Stock', href: '/admin/equipment', icon: Camera },
    { name: 'Rentals & Deposits', href: '/admin/rentals', icon: FileText },
    { name: 'Filmmakers / Customers', href: '/admin/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Admin Top Navigation */}
      <div className="border-b border-zinc-800 bg-zinc-900/90 px-4 py-3 sm:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 font-black text-sm shadow-md shadow-amber-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1.5">
              <span>FLEX GEAR</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                ADMIN CONSOLE
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">Inventory Control & Rental Escrow System</div>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs font-semibold text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit to Customer Store</span>
        </Link>
      </div>

      {/* Admin Body Container */}
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-1 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Content Area */}
        <main>{children}</main>
      </div>
    </div>
  );
}
