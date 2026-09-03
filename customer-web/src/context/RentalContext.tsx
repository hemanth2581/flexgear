'use client';

import React, { createContext, useContext, useState } from 'react';
import { Rental } from '../types/rental';
import { RentalService } from '../services/rental.service';

interface RentalContextType {
  activeRental: Rental | null;
  setActiveRental: (rental: Rental | null) => void;
  fetchRentalDetails: (id: string) => Promise<Rental>;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRental, setActiveRental] = useState<Rental | null>(null);

  const fetchRentalDetails = async (id: string): Promise<Rental> => {
    const rental = await RentalService.getById(id);
    setActiveRental(rental);
    return rental;
  };

  return (
    <RentalContext.Provider value={{ activeRental, setActiveRental, fetchRentalDetails }}>
      {children}
    </RentalContext.Provider>
  );
};

export const useRental = () => {
  const context = useContext(RentalContext);
  if (!context) throw new Error('useRental must be used within a RentalProvider');
  return context;
};
