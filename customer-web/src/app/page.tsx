import React from 'react';
import type { Metadata } from 'next';
import { Hero } from '../components/home/Hero';
import { TrustSignals } from '../components/home/TrustSignals';
import { HowItWorks } from '../components/home/HowItWorks';
import { FeaturedCarousel } from '../components/home/FeaturedCarousel';
import { CategoryGrid } from '../components/home/CategoryGrid';

export const metadata: Metadata = {
  title: 'FlexGear — Professional Cinema Equipment Rental Platform',
  description: 'Rent ARRI, RED, Sony Cinema FX, Cooke Primes, Aputure lighting and audio systems with direct mobile OTP and instant deposit escrow refund.',
};

export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <TrustSignals />
      <HowItWorks />
      <FeaturedCarousel />
      <CategoryGrid />
    </div>
  );
}
