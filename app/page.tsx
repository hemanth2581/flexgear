'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Equipment } from '@/types/equipment';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { PriceCalendarModal } from '@/components/equipment/PriceCalendarModal';
import { useLocation } from '@/components/providers/LocationProvider';
import { supabase } from '@/lib/supabase/client';
import { FirebaseOtpLoginForm } from '@/components/auth/FirebaseOtpLoginForm';
import {
  Camera,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Flame,
  Film,
  CheckCircle2,
  Phone,
  HelpCircle,
  ChevronDown,
  Smartphone,
  User,
  Loader2,
  Calendar,
  Layers,
  Award,
  Video,
  Zap,
  Clock,
} from 'lucide-react';

// In-memory module cache for instantaneous 0ms page switching back to home
let memoryCachedEquipment: Equipment[] | null = null;
let memoryCachedCategories: { id: string; slug: string; name: string }[] | null = null;

export default function HomePage() {
  const { selectedCity, selectedCityData, openLocationModal } = useLocation();

  const [equipmentList, setEquipmentList] = useState<Equipment[]>(memoryCachedEquipment || []);
  const [categories, setCategories] = useState<{ id: string; slug: string; name: string }[]>(memoryCachedCategories || []);
  const [loadingGear, setLoadingGear] = useState(!memoryCachedEquipment);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedEquipmentForPricing, setSelectedEquipmentForPricing] = useState<Equipment | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showOtpLoginHero, setShowOtpLoginHero] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('flexgear_user');
        if (stored) {
          try {
            setCurrentUser(JSON.parse(stored));
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

  // Fetch real equipment & categories from live Supabase PostgreSQL on mount (non-blocking if cached)
  useEffect(() => {
    async function loadData() {
      try {
        if (!memoryCachedEquipment) {
          setLoadingGear(true);
        }
        const [eqRes, catRes] = await Promise.all([
          supabase
            .from('equipment')
            .select('*, category:categories(*), brand:brands(*)')
            .eq('is_active', true)
            .order('rating', { ascending: false }),
          supabase
            .from('categories')
            .select('id, slug, name')
            .eq('is_active', true)
            .order('name'),
        ]);

        if (eqRes.data && eqRes.data.length > 0) {
          memoryCachedEquipment = eqRes.data as any;
          setEquipmentList(eqRes.data as any);
        }
        if (catRes.data && catRes.data.length > 0) {
          memoryCachedCategories = catRes.data as any;
          setCategories(catRes.data as any);
        }
      } catch (err) {
        console.error('Failed to load homepage gear:', err);
      } finally {
        setLoadingGear(false);
      }
    }
    loadData();
  }, []);

  const handleOpenPricing = (equipment: Equipment) => {
    setSelectedEquipmentForPricing(equipment);
    setIsPricingModalOpen(true);
  };

  const handleClosePricing = () => {
    setIsPricingModalOpen(false);
    setSelectedEquipmentForPricing(null);
  };

  // Filter equipment by category
  const filteredEquipment = activeCategory === 'all'
    ? equipmentList
    : equipmentList.filter((e) => e.category?.slug === activeCategory || (e as any).category_id === activeCategory);

  const primaryGearList = filteredEquipment.slice(0, 8);
  const featuredGearList = equipmentList.filter((e) => e.is_featured).slice(0, 8);

  const filterTabs = [
    { id: 'all', label: 'All Equipment' },
    ...categories.map((c) => ({ id: c.slug, label: c.name })),
  ];

  // Large Image-based Cinema Category Tiles
  const categoryTiles = [
    {
      title: 'CAMERAS',
      subtitle: 'Flagship Cinema & Full-Frame Bodies',
      description: 'Sony FX3, FX6, RED Komodo, ARRI Mini LF & Canon Cinema EOS.',
      href: '/equipment?category=cameras',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'CINEMA LENSES',
      subtitle: 'Anamorphic & Prime Optics',
      description: 'Cooke, Zeiss Supreme, Sony G-Master & Canon Cine Primes.',
      href: '/equipment?category=lenses',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'STUDIO LIGHTING',
      subtitle: 'High-Output COB & Soft Tubes',
      description: 'Aputure 600d/1200d, Nanlite Pavotubes, Amaran & Astera tubes.',
      href: '/equipment?category=lighting',
      image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: '32-BIT AUDIO',
      subtitle: 'Wireless & Shotgun Microphones',
      description: 'Sennheiser MKH416, DJI Mic 2, Rode Wireless PRO & Sound Devices.',
      href: '/equipment?category=audio',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'GIMBALS & MOTION',
      subtitle: 'Gimbals, Jibs & Motorized Sliders',
      description: 'DJI RS3 Pro, Ronin 2, Easyrig Vario 5 & Dana Dolly systems.',
      href: '/equipment?category=gimbals',
      image: 'https://images.unsplash.com/photo-1533575770077-052fa2c609fc?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'PRODUCTION KITS',
      subtitle: 'Complete Turn-Key Packages',
      description: 'Fully rigged camera combos with monitors, wireless video & batteries.',
      href: '/equipment?category=kits',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const testimonials = [
    [
      {
        name: 'Arjun M.',
        role: 'Cinematographer & DP, Chennai',
        rating: 5,
        text: 'The rental process was lightning quick. The Sony FX3 sensor was spotless, optics calibrated, and firmware up-to-date. The 90-minute set delivery saved our commercial shoot schedule!',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Madhan Kumar',
        role: 'Director of Photography, Bengaluru',
        rating: 5,
        text: 'Top-tier lighting fixtures, pristine anamorphic glass, and crystal-clear communication. Zero-deposit KYC verification made booking seamless for our music video production.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
    ],
    [
      {
        name: 'Karthik Raja',
        role: 'Independent Filmmaker, Coimbatore',
        rating: 5,
        text: 'Customer support was exceptional. Transparent pricing with zero hidden hold fees. I rent from FlexGear for every indie film and documentary project.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Virat Sharma',
        role: 'Commercial Producer, Hyderabad',
        rating: 5,
        text: 'Hassle-free hub pickup and flexible return policy. The Aputure 600d and Nanlite combo kit arrived packed in hard flight cases ready to roll on set.',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      },
    ],
  ];

  const nextTestimonials = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonials = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const faqs = [
    {
      q: 'How does equipment booking & date selection work on FlexGear?',
      a: 'Browse our cinema catalog and click "Select Dates" on any gear item to open the interactive Date-wise Price Calendar. Choose your shoot start and end dates to see real-time tiered multi-day discounts, then add to your cart or reserve instantly.',
    },
    {
      q: 'What is the Zero-Deposit KYC Verification requirement?',
      a: 'We require a valid Government photo ID (Aadhaar / Passport / Driving License), proof of address, and your creative portfolio/production company link. Once verified, professional creators enjoy instant gear checkout with zero refundable deposit holds.',
    },
    {
      q: 'Do you offer doorstep and on-location film set delivery?',
      a: 'Yes! We provide express 90-minute doorstep and on-set delivery across Chennai, Bengaluru, Coimbatore, and Hyderabad in secure shockproof flight cases.',
    },
    {
      q: 'What is your equipment return and cancellation policy?',
      a: 'We offer flexible 24-hour return and shoot extension policies. Cancellations made at least 24 hours prior to the rental start date receive a 100% full refund.',
    },
  ];

  return (
    <div className="bg-cinema-bg min-h-screen text-cinema-text">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden border-b border-cinema-border">
        {/* Cinema Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1800&auto=format&fit=crop&q=80"
            alt="Cinema film production camera on set"
            fill
            priority
            className="object-cover object-center scale-105 filter brightness-75"
          />
          {/* Gradients */}
          <div className="absolute inset-0 hero-cinema-gradient z-10" />
          <div className="absolute inset-0 hero-side-gradient z-10 hidden md:block" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 w-full">
          <div className="max-w-3xl space-y-6">
            {/* Trust Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cinema-surface/90 border border-cinema-border-strong backdrop-blur-md text-xs font-semibold shadow-cinema-glow">
              <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse-dot" />
              <span className="text-cinema-text">Premier Cinema Rental Hub in</span>
              <button
                onClick={openLocationModal}
                className="text-accent hover:text-accent-hover font-bold underline decoration-accent/40 underline-offset-2 flex items-center gap-1 cursor-pointer"
              >
                <span>{selectedCity}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Main Bold Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-cinema-text tracking-tight font-heading leading-[1.02]">
              Professional Gear.<br />
              <span className="text-accent">Your Story.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-cinema-text-secondary leading-relaxed max-w-2xl">
              Rent industry-standard cinema cameras, anamorphic lenses, studio lighting, and audio equipment without the complexity of ownership. Express 90-minute on-set delivery across South India.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/equipment"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-black text-sm uppercase tracking-wider shadow-cinema-accent hover:shadow-cinema-lg transition-all duration-200 active:scale-95 text-center"
              >
                <span>Explore All Gear</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={openLocationModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-cinema-surface/90 hover:bg-cinema-tertiary border border-cinema-border text-cinema-text font-bold text-sm transition-all duration-200 backdrop-blur-md cursor-pointer text-center"
              >
                <Truck className="w-4 h-4 text-accent" />
                <span>Switch Hub ({selectedCity})</span>
              </button>
            </div>

            {/* Live Trust Metrics Bar */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="text-base font-black text-cinema-text font-heading">60+ Models</div>
                <div className="text-cinema-text-muted">Cinema Cameras &amp; Lenses</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-base font-black text-cinema-text font-heading">90 Mins</div>
                <div className="text-cinema-text-muted">Average On-Set Dispatch</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-base font-black text-accent font-heading">Zero Deposit</div>
                <div className="text-cinema-text-muted">For Verified Creators</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-base font-black text-semantic-success font-heading">100% Tested</div>
                <div className="text-cinema-text-muted">Sensor Calibrated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authenticated User Quick Bar */}
      {currentUser && (
        <section className="bg-cinema-surface border-b border-cinema-border py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse-dot" />
              <span className="text-cinema-text-secondary">
                Welcome back, <strong className="text-cinema-text">{currentUser.full_name}</strong>
              </span>
              <span className="hidden sm:inline-block text-accent font-semibold">• Zero-Deposit KYC Active ⚡</span>
            </div>
            <Link href="/account" className="text-accent hover:text-accent-hover font-bold flex items-center gap-1">
              <span>View Bookings &amp; Invoices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* 2. CINEMATIC CATEGORY TILES */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-accent uppercase tracking-widest font-heading mb-2">
              CATEGORIES
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-cinema-text font-heading tracking-tight">
              Curated Production Departments
            </h2>
            <p className="text-xs sm:text-sm text-cinema-text-secondary mt-1">
              Select a filmmaking department to browse calibrated cameras, optical glass, and studio grip.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-accent-hover uppercase tracking-wider"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Category Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryTiles.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative h-72 rounded-2xl overflow-hidden border border-cinema-border shadow-cinema-sm hover:shadow-cinema-lg hover:border-accent transition-all duration-300 flex flex-col justify-end p-6"
            >
              {/* Background Image with Zoom */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.65] group-hover:brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/60 to-transparent z-10" />

              {/* Text info */}
              <div className="relative z-20 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent font-heading">
                  {cat.subtitle}
                </span>
                <h3 className="text-xl font-black text-cinema-text font-heading group-hover:text-accent transition-colors flex items-center justify-between">
                  <span>{cat.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-cinema-text-secondary line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED EQUIPMENT CATALOG (With Live Supabase Data) */}
      <section className="py-20 bg-cinema-surface border-y border-cinema-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 shadow-cinema-glow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>In-Stock in {selectedCity}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-cinema-text font-heading tracking-tight">
              Featured Flagship Gear
            </h2>

            <p className="text-xs sm:text-sm text-cinema-text-secondary">
              Top requested cinema cameras, fast optical glass, and studio lighting packages.
            </p>

            {/* Category Filter Chips */}
            <div className="flex items-center justify-center flex-wrap gap-2 pt-4">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    activeCategory === tab.id
                      ? 'bg-accent text-cinema-bg border-accent shadow-cinema-sm font-black'
                      : 'bg-cinema-tertiary text-cinema-text hover:bg-cinema-card border-cinema-border'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading or Equipment Grid */}
          {loadingGear ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <p className="text-xs text-cinema-text-muted">Loading calibrated cinema equipment...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {primaryGearList.map((item) => (
                <EquipmentCard
                  key={item.id}
                  equipment={item}
                  onViewPricing={handleOpenPricing}
                />
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              href="/equipment"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cinema-tertiary hover:bg-accent hover:text-cinema-bg text-cinema-text font-bold text-xs uppercase tracking-wider border border-cinema-border hover:border-accent transition-all duration-200 active:scale-95 shadow-cinema-sm"
            >
              <span>Explore All 60+ Rental Items</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. "WHY FLEXGEAR" TRUST SECTION */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="text-xs font-bold text-accent uppercase tracking-widest font-heading">
            WHY FLEXGEAR
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-cinema-text font-heading tracking-tight">
            Engineered for Live Productions
          </h2>
          <p className="text-xs sm:text-sm text-cinema-text-secondary">
            Every camera sensor, cinema prime, and LED fixture passes rigorous optical inspection before leaving our hubs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-cinema-surface border border-cinema-border shadow-cinema-sm hover:border-cinema-border-strong transition">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-cinema-text font-heading mb-1.5">
              Optical Calibration &amp; Cleaned Sensors
            </h3>
            <p className="text-xs text-cinema-text-secondary leading-relaxed">
              Every camera sensor is dust-inspected in cleanroom environments, lenses collimated, and all cables stress-tested.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-cinema-surface border border-cinema-border shadow-cinema-sm hover:border-cinema-border-strong transition">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-cinema-text font-heading mb-1.5">
              90-Minute On-Set Express Delivery
            </h3>
            <p className="text-xs text-cinema-text-secondary leading-relaxed">
              Direct dispatch in rugged flight cases to your shooting location in Chennai, Bengaluru, Coimbatore, and Hyderabad.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-cinema-surface border border-cinema-border shadow-cinema-sm hover:border-cinema-border-strong transition">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-cinema-text font-heading mb-1.5">
              Zero-Deposit KYC Verification
            </h3>
            <p className="text-xs text-cinema-text-secondary leading-relaxed">
              Verified directors, DPs, and production houses enjoy immediate equipment release without huge security deposit holds.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-cinema-surface border border-cinema-border shadow-cinema-sm hover:border-cinema-border-strong transition">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-cinema-text font-heading mb-1.5">
              Flexible Multi-Day Tiered Rates
            </h3>
            <p className="text-xs text-cinema-text-secondary leading-relaxed">
              Transparent multi-day rates with automatic discounts for 3-day, weekly, and monthly commercial production schedules.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-cinema-surface border border-cinema-border shadow-cinema-sm hover:border-cinema-border-strong transition">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-cinema-text font-heading mb-1.5">
              Hassle-Free Return &amp; Extensions
            </h3>
            <p className="text-xs text-cinema-text-secondary leading-relaxed">
              Need to extend shooting dates or add backup batteries? Extend your rental online via WhatsApp or customer dashboard.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-cinema-surface border border-cinema-border shadow-cinema-sm hover:border-cinema-border-strong transition">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent mb-4">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-cinema-text font-heading mb-1.5">
              24/7 Technical Set Hotline
            </h3>
            <p className="text-xs text-cinema-text-secondary leading-relaxed">
              Real camera technicians on standby for live configuration assistance, timecode sync, and emergency backup equipment.
            </p>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (4-Step Workflow) */}
      <section id="how-it-works" className="py-20 bg-cinema-surface border-y border-cinema-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <div className="text-xs font-bold text-accent uppercase tracking-widest font-heading">
              RENTAL PROCESS
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-cinema-text font-heading tracking-tight">
              Rent Cinema Gear in 4 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-cinema-text-secondary">
              From script to screen in less than 90 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-cinema-tertiary/70 border border-cinema-border space-y-3 relative">
              <span className="text-2xl font-black text-accent font-heading">01</span>
              <h4 className="text-base font-bold text-cinema-text font-heading">Browse &amp; Configure</h4>
              <p className="text-xs text-cinema-text-secondary leading-relaxed">
                Choose cameras, cine lenses, lighting, and wireless audio from our live catalog.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-cinema-tertiary/70 border border-cinema-border space-y-3 relative">
              <span className="text-2xl font-black text-accent font-heading">02</span>
              <h4 className="text-base font-bold text-cinema-text font-heading">Select Shoot Dates</h4>
              <p className="text-xs text-cinema-text-secondary leading-relaxed">
                Open the interactive date calendar to see real-time inventory and multi-day discounts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-cinema-tertiary/70 border border-cinema-border space-y-3 relative">
              <span className="text-2xl font-black text-accent font-heading">03</span>
              <h4 className="text-base font-bold text-cinema-text font-heading">Fast-Track KYC</h4>
              <p className="text-xs text-cinema-text-secondary leading-relaxed">
                Instant digital ID verification for Zero-Deposit release with secure checkout.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-cinema-tertiary/70 border border-cinema-border space-y-3 relative">
              <span className="text-2xl font-black text-accent font-heading">04</span>
              <h4 className="text-base font-bold text-cinema-text font-heading">Shoot &amp; Create</h4>
              <p className="text-xs text-cinema-text-secondary leading-relaxed">
                Collect gear at your regional hub or receive 90-minute doorstep dispatch to your set.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FILMMAKER / CREATOR BRAND SECTION */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Photo */}
          <div className="lg:col-span-6 relative aspect-4/3 rounded-2xl overflow-hidden border border-cinema-border shadow-cinema-lg">
            <Image
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&auto=format&fit=crop&q=80"
              alt="Cinematographer operating RED cinema camera"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-cinema-surface/90 border border-cinema-border backdrop-blur-md">
              <div className="text-xs font-bold text-cinema-text">Sony FX6 &amp; Cooke Anamorphic Rig</div>
              <div className="text-[11px] text-accent">Ready for commercial &amp; narrative production</div>
            </div>
          </div>

          {/* Right Column: Narrative Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold text-accent uppercase tracking-widest font-heading">
              FOR CREATORS &amp; PRODUCTION HOUSES
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-cinema-text font-heading leading-tight">
              Built for the people behind the camera.
            </h2>
            <p className="text-sm text-cinema-text-secondary leading-relaxed">
              Whether you are shooting an independent feature, commercial campaign, music video, OTT web series, or documentary, FlexGear gives you frictionless access to top-tier cinema camera packages without the capital expense of ownership.
            </p>

            <div className="space-y-3 text-xs text-cinema-text-secondary">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Zero capital lock-in — allocate your budget directly into production design.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Fresh batteries, high-speed CFexpress Type-A cards, and matte boxes included.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Emergency replacement units on standby in Chennai, Bengaluru, Coimbatore &amp; Hyderabad.</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/equipment"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-bold text-xs uppercase tracking-wider transition-all shadow-cinema-sm"
              >
                <span>Browse Cinema Equipment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS (DP & Filmmaker Reviews) */}
      <section className="py-20 bg-cinema-surface border-y border-cinema-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Heading & Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-accent font-black text-xs uppercase tracking-widest font-heading">
                TESTIMONIALS
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-cinema-text font-heading leading-tight">
                Trusted by working Directors of Photography
              </h2>
              <p className="text-xs sm:text-sm text-cinema-text-secondary leading-relaxed">
                Hear what commercial cinematographers and independent filmmakers have to say about FlexGear equipment reliability and on-set service.
              </p>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={prevTestimonials}
                  className="w-10 h-10 rounded-xl bg-cinema-tertiary border border-cinema-border flex items-center justify-center text-cinema-text hover:border-accent hover:text-accent transition cursor-pointer"
                  aria-label="Previous reviews"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonials}
                  className="w-10 h-10 rounded-xl bg-accent text-cinema-bg flex items-center justify-center font-bold hover:bg-accent-hover transition cursor-pointer shadow-cinema-sm"
                  aria-label="Next reviews"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right: Review Cards */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {testimonials[testimonialIndex].map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-cinema-tertiary/70 rounded-2xl p-6 border border-cinema-border shadow-cinema-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* Star Ratings */}
                      <div className="flex items-center gap-1 text-accent mb-3">
                        {Array.from({ length: review.rating }).map((_, s) => (
                          <Star key={s} className="w-4 h-4 fill-current" />
                        ))}
                      </div>

                      <p className="text-xs sm:text-sm text-cinema-text-secondary leading-relaxed italic">
                        "{review.text}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-cinema-border">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-accent/40 shrink-0">
                        <Image
                          src={review.avatar}
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-cinema-text">{review.name}</h5>
                        <p className="text-[11px] text-cinema-text-muted">{review.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <div className="inline-flex items-center gap-1 text-accent font-bold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-cinema-text font-heading tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-cinema-surface rounded-2xl border border-cinema-border overflow-hidden transition-all shadow-cinema-sm"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm sm:text-base text-cinema-text hover:text-accent cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-cinema-text-muted transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-accent' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-cinema-text-secondary leading-relaxed border-t border-cinema-border pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. PARTNER CONSIGNMENT BANNER */}
      <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-cinema-border-strong bg-cinema-surface shadow-cinema-lg flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-3xl pointer-events-none" />

          <div className="space-y-3 text-center md:text-left relative z-10">
            <span className="bg-accent/15 text-accent border border-accent/30 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
              Monetize Your Cinema Equipment
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-cinema-text font-heading">
              Own Cinema Cameras or Lenses? Partner with FlexGear.
            </h3>
            <p className="text-xs sm:text-sm text-cinema-text-secondary max-w-xl">
              List your idle cameras, anamorphic glass, and studio lighting on FlexGear. We handle KYC verification, safe custody, insured logistics, and guaranteed monthly revenue payouts.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <Link
              href="/partner"
              className="px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-cinema-bg font-black text-xs uppercase tracking-wider shadow-cinema-accent transition-all duration-200 active:scale-95 text-center"
            >
              Partner with FlexGear
            </Link>
            <Link
              href="/contact"
              className="px-5 py-3.5 rounded-xl bg-cinema-tertiary hover:bg-cinema-card text-cinema-text font-bold text-xs uppercase tracking-wider border border-cinema-border transition text-center"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </section>

      {/* Price Calendar Modal Triggered from any Equipment Card */}
      <PriceCalendarModal
        equipment={selectedEquipmentForPricing}
        isOpen={isPricingModalOpen}
        onClose={handleClosePricing}
      />
    </div>
  );
}
