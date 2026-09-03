'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Equipment } from '../types/equipment';
import { CartItem, CartService } from '../services/cart.service';

interface CartContextType {
  items: CartItem[];
  startDate: string;
  endDate: string;
  deliveryMode: 'PICKUP' | 'DELIVERY';
  addItem: (equipment: Equipment, quantity?: number) => void;
  removeItem: (equipmentId: string) => void;
  updateQuantity: (equipmentId: string, quantity: number) => void;
  setDates: (start: string, end: string) => void;
  setDeliveryMode: (mode: 'PICKUP' | 'DELIVERY') => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [deliveryMode, setDeliveryMode] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');

  useEffect(() => {
    setItems(CartService.getCart());
  }, []);

  const saveAndSetItems = (newItems: CartItem[]) => {
    setItems(newItems);
    CartService.saveCart(newItems);
  };

  const addItem = (equipment: Equipment, quantity = 1) => {
    const existingIndex = items.findIndex((i) => i.equipment.id === equipment.id);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += quantity;
      saveAndSetItems(updated);
    } else {
      saveAndSetItems([...items, { equipment, quantity }]);
    }
  };

  const removeItem = (equipmentId: string) => {
    saveAndSetItems(items.filter((i) => i.equipment.id !== equipmentId));
  };

  const updateQuantity = (equipmentId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(equipmentId);
      return;
    }
    saveAndSetItems(
      items.map((i) => (i.equipment.id === equipmentId ? { ...i, quantity } : i))
    );
  };

  const setDates = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const clearCart = () => {
    saveAndSetItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.equipment.daily_price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        startDate,
        endDate,
        deliveryMode,
        addItem,
        removeItem,
        updateQuantity,
        setDates,
        setDeliveryMode,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
