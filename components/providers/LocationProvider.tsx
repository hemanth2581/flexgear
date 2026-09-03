'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CityOption {
  id: string;
  name: string;
  state: string;
  phone: string;
  address: string;
  isPopular?: boolean;
}

export const CITIES: CityOption[] = [
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+91 98840 39091',
    address: 'No 20, 88th Street, Ashok Nagar, Chennai - 600083',
    isPopular: true,
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    phone: '+91 78457 91178',
    address: '6/1, 1st Main Rd, Madiwala New Ext, BTM Layout, Bengaluru - 560068',
    isPopular: true,
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    phone: '+91 88380 51796',
    address: 'No.22, 2nd St Ext, Laxman Nagar, Gandhipuram, Coimbatore - 641012',
    isPopular: true,
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    phone: '+91 91234 56780',
    address: 'Road No 12, Banjara Hills, Hyderabad - 500034',
    isPopular: true,
  },
  {
    id: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    phone: '+91 94470 12345',
    address: 'Main Avenue, Panampilly Nagar, Kochi - 682036',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    phone: '+91 98200 67890',
    address: 'Plot 45, Veera Desai Industrial Estate, Andheri West, Mumbai - 400053',
  },
];

interface LocationContextType {
  selectedCity: string;
  selectedCityData: CityOption;
  setCity: (cityName: string) => void;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<string>('Chennai');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCity = localStorage.getItem('lenstiger_city') || localStorage.getItem('flexgear_city');
      if (savedCity) {
        setSelectedCity(savedCity);
      } else {
        // If not selected, open location modal on first visit
        const hasVisited = sessionStorage.getItem('lenstiger_visited');
        if (!hasVisited) {
          setIsLocationModalOpen(true);
          sessionStorage.setItem('lenstiger_visited', 'true');
        }
      }
    }
  }, []);

  const setCity = (cityName: string) => {
    setSelectedCity(cityName);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lenstiger_city', cityName);
      localStorage.setItem('flexgear_city', cityName);
    }
    setIsLocationModalOpen(false);
  };

  const selectedCityData =
    CITIES.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase()) || CITIES[0];

  return (
    <LocationContext.Provider
      value={{
        selectedCity,
        selectedCityData,
        setCity,
        isLocationModalOpen,
        openLocationModal: () => setIsLocationModalOpen(true),
        closeLocationModal: () => setIsLocationModalOpen(false),
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
