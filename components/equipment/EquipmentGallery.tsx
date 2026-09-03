'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface EquipmentGalleryProps {
  mainImageUrl: string;
  name: string;
}

export function EquipmentGallery({ mainImageUrl, name }: EquipmentGalleryProps) {
  // Generate realistic photo angles/angles previews
  const galleryImages = [
    mainImageUrl,
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
  ];

  const [activeImage, setActiveImage] = useState(galleryImages[0]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Large Display */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <Image
          src={activeImage}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Thumbnail Selector Grid */}
      <div className="grid grid-cols-4 gap-3">
        {galleryImages.map((img, idx) => {
          const isActive = activeImage === img;
          return (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border bg-zinc-950 transition-all ${
                isActive
                  ? 'border-amber-500 ring-2 ring-amber-500/40 scale-95'
                  : 'border-zinc-800 opacity-70 hover:opacity-100 hover:border-zinc-700'
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
