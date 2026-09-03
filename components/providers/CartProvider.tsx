'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, PricingBreakdown, DeliveryMode } from '@/types/rental';
import { Equipment } from '@/types/equipment';
import { PricingService } from '@/lib/services/pricing.service';
import { calculateRentalDays } from '@/lib/utils';

interface CartContextType {
  items: CartItem[];
  deliveryMode: DeliveryMode;
  setDeliveryMode: (mode: DeliveryMode) => void;
  addToCart: (equipment: Equipment, startDate: string, endDate: string, quantity?: number) => boolean;
  updateItemQuantity: (equipmentId: string, quantity: number) => void;
  updateItemDates: (equipmentId: string, startDate: string, endDate: string) => void;
  removeFromCart: (equipmentId: string) => void;
  clearCart: () => void;
  pricing: PricingBreakdown;
  itemCount: number;
  isCheckingAvailability: boolean;
  recheckCartAvailability: () => Promise<void>;
  isCartDrawerOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'flex_gear_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('PICKUP');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse stored cart:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to storage:', e);
    }
  }, [items, isLoaded]);

  // Re-check inventory availability for all items in the cart
  const recheckCartAvailability = useCallback(async () => {
    if (items.length === 0) return;
    setIsCheckingAvailability(true);
    try {
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const res = await fetch(
              `/api/availability?equipmentId=${item.equipment.id}&startDate=${item.startDate}&endDate=${item.endDate}&quantity=${item.quantity}`
            );
            if (res.ok) {
              const data = await res.json();
              return { ...item, isAvailable: data.available };
            }
          } catch (e) {
            console.error('Availability fetch error:', e);
          }
          return { ...item, isAvailable: true };
        })
      );
      setItems(updatedItems);
    } finally {
      setIsCheckingAvailability(false);
    }
  }, [items]);

  useEffect(() => {
    if (isLoaded && items.length > 0) {
      recheckCartAvailability();
    }
  }, [isLoaded]);

  const addToCart = useCallback(
    (equipment: Equipment, startDate: string, endDate: string, quantity: number = 1): boolean => {
      const days = calculateRentalDays(startDate, endDate);
      if (days <= 0) return false;

      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.equipment.id === equipment.id);
        const itemDeposit = equipment.security_deposit * quantity;
        const itemSubtotal = equipment.daily_price * days * quantity;

        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = updated[existingIndex].quantity + quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            startDate,
            endDate,
            days,
            itemSubtotal: equipment.daily_price * days * newQty,
            itemDeposit: equipment.security_deposit * newQty,
            isAvailable: true,
          };
          return updated;
        }

        const newItem: CartItem = {
          equipment,
          quantity,
          startDate,
          endDate,
          days,
          dailyPrice: equipment.daily_price,
          weeklyPrice: equipment.weekly_price,
          securityDeposit: equipment.security_deposit,
          itemSubtotal,
          itemDeposit,
          isAvailable: true,
        };
        return [...prev, newItem];
      });

      // Auto open cart drawer
      setIsCartDrawerOpen(true);
      return true;
    },
    []
  );

  const updateItemQuantity = useCallback((equipmentId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(equipmentId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.equipment.id === equipmentId) {
          const itemSubtotal = item.dailyPrice * item.days * quantity;
          const itemDeposit = item.securityDeposit * quantity;
          return { ...item, quantity, itemSubtotal, itemDeposit };
        }
        return item;
      })
    );
  }, []);

  const updateItemDates = useCallback((equipmentId: string, startDate: string, endDate: string) => {
    const days = calculateRentalDays(startDate, endDate);
    if (days <= 0) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.equipment.id === equipmentId) {
          const itemSubtotal = item.dailyPrice * days * item.quantity;
          return { ...item, startDate, endDate, days, itemSubtotal };
        }
        return item;
      })
    );
  }, []);

  const removeFromCart = useCallback((equipmentId: string) => {
    setItems((prev) => prev.filter((i) => i.equipment.id !== equipmentId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsCartDrawerOpen(true), []);
  const closeCart = useCallback(() => setIsCartDrawerOpen(false), []);
  const toggleCart = useCallback(() => setIsCartDrawerOpen((v) => !v), []);

  // Compute pricing breakdown using client preview of PricingService
  const pricing = React.useMemo(() => {
    const pricingInputs = items.map((i) => ({
      equipmentId: i.equipment.id,
      equipmentName: i.equipment.name,
      quantity: i.quantity,
      startDate: i.startDate,
      endDate: i.endDate,
      dailyPrice: i.dailyPrice,
      weeklyPrice: i.weeklyPrice,
      securityDeposit: i.securityDeposit,
    }));

    return PricingService.calculatePricing(pricingInputs, deliveryMode);
  }, [items, deliveryMode]);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        deliveryMode,
        setDeliveryMode,
        addToCart,
        updateItemQuantity,
        updateItemDates,
        removeFromCart,
        clearCart,
        pricing,
        itemCount,
        isCheckingAvailability,
        recheckCartAvailability,
        isCartDrawerOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
