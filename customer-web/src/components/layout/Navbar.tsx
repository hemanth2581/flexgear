'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, Shield, Search, Film, User, Command } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { CommandPalette } from './CommandPalette';
import PhoneAuthModal from '../auth/PhoneAuthModal';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'All Fleet', href: '/equipment' },
    { label: 'Cinema Cameras', href: '/equipment?category=cameras' },
    { label: 'Cine Lenses', href: '/equipment?category=lenses' },
    { label: 'Lighting & Grip', href: '/equipment?category=lighting' },
    { label: 'Audio', href: '/equipment?category=audio' },
    { label: 'Packages', href: '/equipment?category=kits' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-surface-3 bg-surface-0/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-surface-2 border border-surface-3 flex items-center justify-center text-accent group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-300">
              <Film className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold font-display tracking-tight text-white flex items-center gap-1">
                FLEX<span className="text-accent">GEAR</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase -mt-0.5 font-medium">
                Cinema Rental Fleet
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-zinc-400 bg-surface-1/80 p-1 rounded-full border border-surface-3 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full transition-all duration-150 ${
                    isActive
                      ? 'bg-surface-3 text-white font-semibold'
                      : 'hover:text-white hover:bg-surface-2'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            {/* Quick ⌘K Search trigger */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-1 border border-surface-3 text-zinc-400 hover:text-white hover:border-surface-4 transition-all text-xs font-mono"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-zinc-500">Quick search</span>
              <kbd className="text-[10px] bg-surface-2 px-1.5 py-0.5 rounded border border-surface-3 text-zinc-400 flex items-center gap-0.5">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>

            <button
              onClick={() => setIsCommandOpen(true)}
              aria-label="Search"
              className="sm:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-2 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-2 transition-colors relative"
            >
              <Heart className="w-4 h-4" />
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-2 transition-colors relative group"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-accent text-surface-0 text-[10px] font-bold font-mono rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="h-4 w-px bg-surface-3 mx-1 hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/rentals" className="hidden sm:inline-flex">
                  <Button variant="outline" size="sm" className="text-xs h-8 px-3 border-surface-3 hover:border-surface-4 text-zinc-300">
                    My Shoots
                  </Button>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-200 hover:text-white p-1 rounded-full hover:bg-surface-2 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-surface-2 border border-surface-3 flex items-center justify-center text-accent font-bold text-xs">
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || <User className="w-3.5 h-3.5" />}
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="text-xs h-8 px-2 text-zinc-500 hover:text-zinc-300"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3.5 py-1.5 bg-accent hover:bg-accent-hover text-surface-0 font-semibold text-xs rounded-lg transition-all active:scale-[0.98]"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* Clean Phone Auth Modal */}
      <PhoneAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
