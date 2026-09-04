'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Film, Heart, MapPin, User, LogOut } from 'lucide-react';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard Overview', href: '/account', icon: LayoutDashboard },
    { name: 'My Rentals & Invoices', href: '/account/rentals', icon: Film },
    { name: 'Saved Wishlist', href: '/account/wishlist', icon: Heart },
    { name: 'Delivery Addresses', href: '/account/addresses', icon: MapPin },
  ];

  return (
    <div className="bg-cinema-bg min-h-screen py-8 text-cinema-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Welcome Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cinema-border pb-6">
          <div className="flex items-center space-x-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-cinema-bg font-black text-lg shadow-sm">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-cinema-text headingbold">Filmmaker Portal</h1>
              <p className="text-xs text-cinema-muted">customer@flexgear.test • Verified Client</p>
            </div>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-semantic-error hover:text-semantic-error/80 font-bold px-3.5 py-2 rounded-xl border border-semantic-error/30 bg-semantic-error/10 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>

        {/* Grid: Left Sidebar Navigation (3 cols) + Right Content (9 cols) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          <aside className="lg:col-span-3 rounded-3xl border border-cinema-border bg-cinema-card p-3 shadow-cinema space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-accent text-cinema-bg shadow-xs font-black'
                      : 'text-cinema-muted hover:bg-cinema-elevated hover:text-cinema-text'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </aside>

          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
