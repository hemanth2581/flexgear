'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';
import { useLocation } from '@/components/providers/LocationProvider';
import {
  Camera,
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  MapPin,
  Flame,
  ChevronDown,
  Sparkles,
  Shield,
  Layers,
  Phone,
  Handshake,
  LogOut,
  KeyRound,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export function Header() {
  const router = useRouter();
  const { itemCount, openCart } = useCart();
  const { selectedCity, selectedCityData, openLocationModal } = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    email?: string;
    phone?: string;
    role?: string;
    full_name?: string;
  } | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('flexgear_user');
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch (e) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  // Predictive search query against live database
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.trim();
      const timer = setTimeout(async () => {
        try {
          const { data } = await supabase
            .from('equipment')
            .select('id, name, slug, image_url, daily_price, category:categories(name), brand:brands(name)')
            .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
            .eq('is_active', true)
            .limit(5);

          if (data) {
            setSearchResults(data);
          }
        } catch (e) {
          console.error('Search query error:', e);
        }
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Click outside listener for search & user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    router.push(`/equipment?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navCategories = [
    { name: 'Cameras', href: '/equipment?category=cameras' },
    { name: 'Lens', href: '/equipment?category=lenses' },
    { name: 'Combos', href: '/equipment?category=kits' },
    { name: 'Lights', href: '/equipment?category=lighting' },
    { name: 'Video & Audio', href: '/equipment?category=audio' },
    { name: 'Motion Devices', href: '/equipment?category=gimbals' },
  ];

  return (
    <>
      {/* Top Hotline Bar */}
      <div className="bg-[#247565] text-white/90 px-4 py-1 text-[11px] font-medium border-b border-white/10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gold" />
              <span>
                Hub: <strong>{selectedCityData.name}</strong> • {selectedCityData.address}
              </span>
            </span>
            <span className="text-white/60">|</span>
            <span className="text-gold font-bold">⚡ 90-Min Express Set Delivery</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-gold" />
              <span>Call / WhatsApp: <strong>{selectedCityData.phone}</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Main LensTiger Navbar */}
      <header className="sticky top-0 z-[1030] bg-lenstiger shadow-md text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center text-lenstiger shadow-sm group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-lenstiger" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white headingbold flex items-center leading-none">
                FLEX<span className="text-gold">GEAR</span>
              </span>
              <span className="text-[9px] tracking-widest text-white/80 font-bold uppercase mt-0.5">
                Camera Rentals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-bold text-white">
            {navCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="hover:text-gold transition-colors py-1 relative group"
              >
                {cat.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            {/* USED GEAR Button */}
            <Link
              href="/equipment?mode=used"
              className="used-gear-btn px-3.5 py-1.5 flex items-center gap-1.5 shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-lenstiger" />
              <span>USED GEAR</span>
            </Link>

            {/* Location Selector Button */}
            <button
              onClick={openLocationModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>
          </nav>

          {/* Right Action Icons (Search, Cart, User) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Expandable Search Input */}
            <div ref={searchContainerRef} className="relative hidden md:block">
              <form
                onSubmit={handleSearchSubmit}
                className={`lenstiger-search-box shadow-inner ${searchOpen ? 'active ring-2 ring-gold' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-lenstiger hover:text-lenstiger-dark p-0.5 flex items-center justify-center shrink-0 cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 text-lenstiger" />
                </button>
                <input
                  type="text"
                  placeholder="Search cameras, lenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  className="text-xs text-gray-900 placeholder:text-gray-400 font-medium px-2 py-0.5"
                />
              </form>

              {/* Predictive Dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden text-gray-900 z-50 p-2 space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase px-2 py-1">
                    Matching Gear
                  </div>
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/equipment/${item.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-lenstiger-50 transition"
                    >
                      <div className="w-8 h-8 rounded bg-gray-100 relative overflow-hidden shrink-0">
                        <Image
                          src={item.image_url || '/placeholder.jpg'}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-gray-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-lenstiger font-semibold">
                          ₹{item.daily_price}/day
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Shopping Cart Icon Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 text-white hover:text-gold transition cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white font-extrabold text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm border border-white">
                {itemCount}
              </span>
            </button>

            {/* User Profile Dropdown */}
            <div ref={userDropdownRef} className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="p-2 text-white hover:text-gold transition flex items-center gap-1 cursor-pointer"
                aria-label="User menu"
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                <ChevronDown className="w-3 h-3 hidden sm:block opacity-80" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden text-gray-900 z-50 py-1 divide-y divide-gray-100 animate-in fade-in zoom-in-95 duration-150">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2.5 bg-gray-50/70">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {currentUser.full_name || 'Filmmaker'}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate font-mono">
                          {currentUser.email || currentUser.phone || 'User'}
                        </p>
                        <div className="mt-1">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-lenstiger/10 text-lenstiger">
                            {currentUser.role || 'CUSTOMER'}
                          </span>
                        </div>
                      </div>

                      <div className="py-1 text-xs font-semibold">
                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-lenstiger"
                        >
                          <User className="w-3.5 h-3.5 text-lenstiger" />
                          <span>My Profile &amp; KYC</span>
                        </Link>
                        <Link
                          href="/rentals"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-lenstiger"
                        >
                          <Layers className="w-3.5 h-3.5 text-lenstiger" />
                          <span>My Rentals &amp; Bookings</span>
                        </Link>
                        <Link
                          href="/partner"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-lenstiger"
                        >
                          <Handshake className="w-3.5 h-3.5 text-lenstiger" />
                          <span>Partner With FlexGear</span>
                        </Link>
                      </div>

                      <div className="py-1 text-xs">
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 text-amber-600 font-bold"
                        >
                          <span>Admin Portal</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                            PRO
                          </span>
                        </Link>
                      </div>

                      <div className="py-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              localStorage.removeItem('flexgear_user');
                              window.dispatchEvent(new Event('storage'));
                            }
                            setCurrentUser(null);
                            setUserDropdownOpen(false);
                            router.push('/');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 font-bold text-left cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 bg-gray-50/70">
                        <p className="text-xs font-bold text-gray-900">Welcome to FlexGear</p>
                        <p className="text-[11px] text-gray-500">Sign in with Firebase OTP to book gear.</p>
                      </div>

                      <div className="p-2 space-y-1.5 text-xs font-bold">
                        <Link
                          href="/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-lenstiger hover:bg-lenstiger-dark text-white shadow-2xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Sign In with OTP</span>
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Create Account</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-gold lg:hidden transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-lenstiger-dark border-t border-white/10 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Location Selector */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openLocationModal();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Selected Location: {selectedCity}</span>
              </div>
              <span className="text-gold underline">Change</span>
            </button>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Search gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white text-gray-900 px-3 py-2 rounded-xl text-xs font-medium focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gold text-gray-950 font-bold rounded-xl text-xs"
              >
                Search
              </button>
            </form>

            {/* Mobile Category Links */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-bold">
              {navCategories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/15 text-white transition block"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex gap-2">
              <Link
                href="/equipment?mode=used"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 used-gear-btn py-2 text-center text-xs block"
              >
                USED GEAR
              </Link>
              <Link
                href="/partner"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 bg-gold text-gray-950 py-2 text-center text-xs font-bold rounded-full block"
              >
                Partner with FG
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
