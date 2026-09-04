'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
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
  ChevronDown,
  Sparkles,
  Phone,
  Handshake,
  LogOut,
  Shield,
  Layers,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
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

  const handleSignOut = () => {
    localStorage.removeItem('flexgear_user');
    localStorage.removeItem('flexgear_auth_token');
    setCurrentUser(null);
    setUserDropdownOpen(false);
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  const navLinks = [
    { name: 'Equipment', href: '/equipment' },
    { name: 'Cameras', href: '/equipment?category=cameras' },
    { name: 'Lenses', href: '/equipment?category=lenses' },
    { name: 'Lighting', href: '/equipment?category=lighting' },
    { name: 'Audio', href: '/equipment?category=audio' },
    { name: 'Kits', href: '/equipment?category=kits' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Partner', href: '/partner' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Hotline / Hub Banner */}
      <div className="bg-cinema-bg border-b border-cinema-border/80 text-cinema-text-secondary px-4 py-1.5 text-[11px] hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse-dot" />
              <span className="text-cinema-text-muted">Hub:</span>
              <strong className="text-cinema-text">{selectedCityData.name}</strong>
              <span className="text-cinema-text-muted hidden md:inline">• {selectedCityData.address}</span>
            </span>
            <span className="text-cinema-border hidden lg:inline">|</span>
            <span className="text-accent font-semibold hidden lg:inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>90-Min Express Set Delivery</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-cinema-text-secondary">
              <Phone className="w-3 h-3 text-accent" />
              <span>Support Hotline:</span>
              <strong className="text-cinema-text">{selectedCityData.phone}</strong>
            </span>
            <Link
              href="/partner"
              className="text-accent hover:text-accent-hover font-bold transition flex items-center gap-1"
            >
              <Handshake className="w-3 h-3" />
              <span>Partner With Us</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Luxury Cinematic Navbar */}
      <header className="sticky top-0 z-30 glass-navbar transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cinema-surface border border-cinema-border-strong flex items-center justify-center text-accent shadow-cinema-sm group-hover:border-accent group-hover:shadow-cinema-accent transition-all duration-300">
              <Camera className="w-5 h-5 text-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-cinema-text font-heading flex items-center leading-none">
                FLEX<span className="text-accent">GEAR</span>
              </span>
              <span className="text-[9px] tracking-[0.2em] text-cinema-text-muted font-bold uppercase mt-0.5">
                Cinema Rentals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-semibold text-cinema-text-secondary">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`py-1 transition-colors relative hover:text-cinema-text ${
                    isActive ? 'text-accent font-bold' : ''
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar (City, Search, Cart, User) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Location Selector Pill */}
            <button
              onClick={openLocationModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cinema-surface hover:bg-cinema-tertiary text-cinema-text font-bold text-xs transition border border-cinema-border cursor-pointer shadow-cinema-sm"
              title="Switch Location"
            >
              <MapPin className="w-3.5 h-3.5 text-accent" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-cinema-text-muted" />
            </button>

            {/* Expandable Live Search */}
            <div ref={searchContainerRef} className="relative hidden md:block">
              <form
                onSubmit={handleSearchSubmit}
                className={`flex items-center h-10 rounded-xl bg-cinema-surface border transition-all duration-200 px-3 ${
                  searchOpen
                    ? 'w-64 sm:w-72 border-accent ring-2 ring-accent/20 bg-cinema-bg'
                    : 'w-48 border-cinema-border hover:border-cinema-border-strong'
                }`}
              >
                <Search className="w-4 h-4 text-cinema-text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Search cameras, lenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full bg-transparent text-xs text-cinema-text placeholder:text-cinema-text-muted font-medium px-2.5 py-1 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-cinema-text-muted hover:text-cinema-text"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Predictive Dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-cinema-surface rounded-xl shadow-cinema-lg border border-cinema-border overflow-hidden z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-bold text-cinema-text-muted uppercase tracking-wider px-2 py-1">
                    Matching Cinema Gear
                  </div>
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/equipment/${item.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-cinema-tertiary transition group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-cinema-bg border border-cinema-border relative overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <Image
                          src={item.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200'}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-cinema-text truncate group-hover:text-accent transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-accent font-semibold">
                          ₹{item.daily_price?.toLocaleString()}/day
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
              className="relative p-2.5 rounded-xl bg-cinema-surface hover:bg-cinema-tertiary border border-cinema-border text-cinema-text hover:text-accent transition cursor-pointer shadow-cinema-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-cinema-bg font-black text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-cinema-sm animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile Dropdown */}
            <div ref={userDropdownRef} className="relative">
              {currentUser ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-cinema-surface hover:bg-cinema-tertiary border border-cinema-border text-cinema-text transition cursor-pointer shadow-cinema-sm"
                  aria-label="User account menu"
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 text-accent flex items-center justify-center text-xs font-bold">
                    {currentUser.full_name?.charAt(0) || <User className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-bold text-cinema-text hidden sm:inline max-w-[100px] truncate">
                    {currentUser.full_name?.split(' ')[0] || 'Filmmaker'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-cinema-text-muted hidden sm:block" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-cinema-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && currentUser && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-cinema-surface rounded-xl shadow-cinema-lg border border-cinema-border overflow-hidden z-50 py-1 divide-y divide-cinema-border animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 bg-cinema-tertiary/50">
                    <p className="text-xs font-bold text-cinema-text truncate">
                      {currentUser.full_name || 'Filmmaker'}
                    </p>
                    <p className="text-[11px] text-cinema-text-muted truncate font-mono mt-0.5">
                      {currentUser.phone || currentUser.email || 'User'}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-accent/15 text-accent border border-accent/30">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{currentUser.role || 'CUSTOMER'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-cinema-text hover:bg-cinema-tertiary hover:text-accent transition"
                    >
                      <User className="w-4 h-4 text-cinema-text-muted" />
                      <span>My Profile &amp; Bookings</span>
                    </Link>
                    <Link
                      href="/account/kyc"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-cinema-text hover:bg-cinema-tertiary hover:text-accent transition"
                    >
                      <Shield className="w-4 h-4 text-cinema-text-muted" />
                      <span>Zero-Deposit KYC</span>
                    </Link>
                    {currentUser.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-accent hover:bg-cinema-tertiary transition"
                      >
                        <Layers className="w-4 h-4" />
                        <span>Admin Management</span>
                      </Link>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-semantic-error hover:bg-cinema-tertiary transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-cinema-surface border border-cinema-border text-cinema-text hover:text-accent transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-cinema-bg/95 backdrop-blur-xl border-b border-cinema-border px-4 py-5 space-y-4 animate-in slide-in-from-top duration-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="flex items-center h-11 rounded-xl bg-cinema-surface border border-cinema-border px-3">
              <Search className="w-4 h-4 text-cinema-text-muted shrink-0" />
              <input
                type="text"
                placeholder="Search cameras, lenses, lighting..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-cinema-text placeholder:text-cinema-text-muted px-2.5 focus:outline-none"
              />
            </form>

            {/* Nav Links Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl bg-cinema-surface border border-cinema-border/60 text-xs font-bold text-cinema-text hover:border-accent hover:text-accent transition"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Hub info & contact */}
            <div className="pt-3 border-t border-cinema-border flex items-center justify-between text-xs text-cinema-text-secondary">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>Hub: <strong>{selectedCity}</strong></span>
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLocationModal();
                }}
                className="text-accent font-bold hover:underline"
              >
                Change Hub →
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
