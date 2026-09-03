'use client';

import React from 'react';
import { Equipment } from '../../types/equipment';
import { EquipmentCard } from './EquipmentCard';

export const EquipmentGrid: React.FC<{ items: Equipment[] }> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16 p-8 rounded-xl bg-cinema-card border border-cinema-border">
        <p className="text-sm text-zinc-400">No equipment found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <EquipmentCard key={item.id} equipment={item} />
      ))}
    </div>
  );
};
