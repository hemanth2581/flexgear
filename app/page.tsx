'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export default function HomePage() {
  const { selectedCity, selectedCityData, openLocationModal } = useLocation();

  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<{ id: string; slug: string; name: string }[]>([]);
  const [loadingGear, setLoadingGear] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedEquipmentForPricing, setSelectedEquipmentForPricing] = useState<Equipment | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showOtpLoginHero, setShowOtpLoginHero] = useState(true);

  React.useEffect(() => {
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

  // Fetch real equipment & categories from Supabase on mount
  React.useEffect(() => {
    async function loadData() {
      try {
        setLoadingGear(true);
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

        if (eqRes.data) {
          setEquipmentList(eqRes.data as any);
        }
        if (catRes.data) {
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


  const testimonials = [
    [
      {
        name: 'Arjun M.',
        role: 'Cinematographer, Chennai',
        rating: 5,
        text: 'The rental process was smooth, professional, and lightning quick. The Sony FX3 sensor was pristine. Highly recommended for commercial shoots!',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Madhan Kumar',
        role: 'Director of Photography, Bengaluru',
        rating: 5,
        text: 'Affordable rates, top-tier lighting fixtures, and outstanding camera optical calibration. The 90-minute set delivery saved our music video schedule!',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
    ],
    [
      {
        name: 'Karthik Raja',
        role: 'Independent Filmmaker, Coimbatore',
        rating: 5,
        text: 'Customer support was exceptional. Transparent pricing with zero hidden hold fees. I rent from FlexGear for every wedding and documentary production.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Virat Sharma',
        role: 'Commercial Producer, Hyderabad',
        rating: 5,
        text: 'Hassle-free pickup and simple return policy. The Aputure 600d and Nanlite combo kit arrived packed in hard flight cases ready to roll.',
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
      q: 'How does the equipment booking and date selection work?',
      a: 'Browse our catalog and click "View Pricing" on any equipment to open the Date-wise Price Calendar. Select your shoot start date and end date to see real-time discounted daily rates, then click "Rent Now" or "WhatsApp To Rent" for instant reservation.',
    },
    {
      q: 'What are the document verification (KYC) requirements?',
      a: 'We require a valid Government photo ID (Aadhaar / Passport / Driving License), proof of address, and your production or portfolio link. Verified professionals enjoy zero refundable security deposit.',
    },
    {
      q: 'Do you offer doorstep and on-location set delivery?',
      a: 'Yes! We provide express 90-minute doorstep and on-location delivery in Chennai, Bengaluru, Coimbatore, and Hyderabad at minimal delivery charges.',
    },
    {
      q: 'What is your equipment return and cancellation policy?',
      a: 'We offer flexible 24-hour hassle-free returns. Cancellations made at least 24 hours prior to the rental start date receive a 100% full refund.',
    },
  ];

  return (
    <div className="bg-[#f3f3f3] min-h-screen text-gray-900 pb-20">
      {/* Firebase OTP Authentication Hero Section (When Not Logged In) */}
      {!currentUser && showOtpLoginHero && (
        <section className="bg-gradient-to-b from-lenstiger/10 via-lenstiger/5 to-transparent pt-8 pb-10 px-4 border-b border-gray-200">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center space-y-1.5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lenstiger text-white font-bold shadow-sm">
                <Smartphone className="h-6 w-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 headingbold">
                Sign In with Firebase Phone OTP
              </h2>
              <p className="text-xs text-gray-600">
                Fast-track your equipment bookings, saved carts, and zero-deposit KYC status.
              </p>
            </div>

            <FirebaseOtpLoginForm
              onSuccess={(user) => {
                setCurrentUser(user);
                setShowOtpLoginHero(false);
              }}
              showExploreOption={true}
              onExploreClick={() => setShowOtpLoginHero(false)}
            />
          </div>
        </section>
      )}

      {/* Authenticated User Welcome Banner */}
      {currentUser && (
        <section className="bg-lenstiger-dark text-white py-3 px-4 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                Signed in as <strong>{currentUser.full_name}</strong> ({currentUser.phone || currentUser.email})
              </span>
              <span className="hidden sm:inline-block text-gold font-bold">• Zero-Deposit KYC Verified ⚡</span>
            </div>
            <Link href="/account" className="text-gold hover:underline font-bold">
              View Profile &amp; Bookings →
            </Link>
          </div>
        </section>
      )}

      {/* 1. Main Header Title & Category Filter Tabs */}
      <section className="pt-8 pb-6 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-lenstiger/10 text-lenstiger text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premium Cinema &amp; Photography Gear Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight headingbold">
            Rent Cameras &amp; Lenses in{' '}
            <span className="text-lenstiger underline decoration-gold decoration-4 underline-offset-4 cursor-pointer" onClick={openLocationModal}>
              {selectedCity}
            </span>
            , Bengaluru &amp; Coimbatore
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto">
            Book professional mirrorless cameras, cinema primes, studio lights, wireless audio, gimbals, and shooting kits. Open 24/7 with express on-set delivery.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-4">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeCategory === tab.id
                    ? 'bg-lenstiger text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Main Equipment Grid (LensTiger Card Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {primaryGearList.map((item) => (
            <EquipmentCard
              key={item.id}
              equipment={item}
              onViewPricing={handleOpenPricing}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-lenstiger hover:bg-lenstiger-hover text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            <span>Explore All 45+ Rental Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. 4-Box Trust / Value Proposition Banner (LensTiger Exact Section) */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {/* Box 1: Home Delivery */}
            <div className="flex items-start gap-4 pt-4 lg:pt-0 lg:pl-4 first:pl-0">
              <div className="w-12 h-12 rounded-2xl bg-lenstiger/10 flex items-center justify-center text-lenstiger shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 headingbold mb-1">
                  Home Delivery Available
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  We provide doorstep and set delivery with very minimal delivery charges.
                </p>
              </div>
            </div>

            {/* Box 2: Quality Products */}
            <div className="flex items-start gap-4 pt-4 lg:pt-0 lg:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-lenstiger/10 flex items-center justify-center text-lenstiger shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 headingbold mb-1">
                  Quality Products
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  We ensure 100% sensor-cleaned and calibrated equipment quality every time.
                </p>
              </div>
            </div>

            {/* Box 3: Easy Return */}
            <div className="flex items-start gap-4 pt-4 lg:pt-0 lg:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-lenstiger/10 flex items-center justify-center text-lenstiger shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 headingbold mb-1">
                  Easy Return Rental Products
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  We provide simple, flexible, and hassle-free return and extension policies.
                </p>
              </div>
            </div>

            {/* Box 4: Online Support */}
            <div className="flex items-start gap-4 pt-4 lg:pt-0 lg:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-lenstiger/10 flex items-center justify-center text-lenstiger shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 headingbold mb-1">
                  Online Support
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Provide 24/7 online and WhatsApp support for any shoot emergency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Products Section */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 headingbold">
            Featured Products
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Top requested flagship cameras, fast cinema glass, and LED studio setups in {selectedCity}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featuredGearList.map((item) => (
            <EquipmentCard
              key={item.id}
              equipment={item}
              onViewPricing={handleOpenPricing}
            />
          ))}
        </div>
      </section>

      {/* 5. Filmmaker Testimonial Section (LensTiger Exact Architecture) */}
      <section className="py-14 my-8 bg-lenstiger-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading & Carousel Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-gold font-extrabold text-xs uppercase tracking-widest">
                TESTIMONIALS
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight headingbold">
                We’ve built trust with<br />reviews from real users
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Boost your production confidence with genuine testimonials from DPs, directors, and creators across Chennai, Bengaluru, Coimbatore, and Hyderabad.
              </p>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={prevTestimonials}
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-lenstiger-dark transition active:scale-90"
                  aria-label="Previous reviews"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonials}
                  className="w-10 h-10 rounded-full bg-white text-lenstiger-dark flex items-center justify-center font-bold hover:bg-gold hover:text-gray-950 transition active:scale-90 shadow-md"
                  aria-label="Next reviews"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Column: Sliding Testimonial Cards */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {testimonials[testimonialIndex].map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      {/* Star Ratings */}
                      <div className="flex items-center gap-1 text-gold mb-3">
                        {Array.from({ length: review.rating }).map((_, s) => (
                          <Star key={s} className="w-4 h-4 fill-current" />
                        ))}
                      </div>

                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed italic">
                        "{review.text}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold/40">
                        <Image
                          src={review.avatar}
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{review.name}</h5>
                        <p className="text-[10px] text-white/70">{review.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions (FAQ) Accordion */}
      <section className="py-10 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 text-lenstiger font-bold text-xs uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 headingbold">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-sm sm:text-base text-gray-900 hover:text-lenstiger"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-lenstiger' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Partner Callout Banner */}
      <section className="py-6 px-4 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-lenstiger to-lenstiger-dark rounded-2xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-gold text-gray-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
              Monetize Your Cinema Gear
            </span>
            <h3 className="text-xl sm:text-3xl font-black headingbold text-white">
              Own Cameras or Lenses? Partner with FlexGear!
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              List your idle cameras, lights, and cinema gear on FlexGear. We handle KYC verification, secure custody, insured rental logistics, and monthly revenue payouts.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/partner"
              className="px-6 py-3 rounded-full bg-gold hover:bg-gold-hover text-gray-950 font-black text-xs uppercase tracking-wider shadow-lg transition active:scale-95 text-center"
            >
              Partner with FG
            </Link>
            <Link
              href="/equipment?mode=used"
              className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/30 transition text-center"
            >
              Sell Used Gear
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
