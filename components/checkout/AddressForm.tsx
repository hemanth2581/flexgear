'use client';

import React from 'react';
import { Address, DeliveryMode } from '@/types/rental';
import { AddressSchema } from '@/lib/validations/schemas';
import { DeliveryMap } from './DeliveryMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Home, Building2, MapPin, ArrowRight, Store, Truck, Sparkles } from 'lucide-react';
import { useLocation } from '@/components/providers/LocationProvider';

interface AddressFormProps {
  address: Address;
  deliveryMode: DeliveryMode;
  onAddressChange: (address: Address) => void;
  onDeliveryModeChange: (mode: DeliveryMode) => void;
  onNext: () => void;
}

export function AddressForm({
  address,
  deliveryMode,
  onAddressChange,
  onDeliveryModeChange,
  onNext,
}: AddressFormProps) {
  const { selectedCity, selectedCityData } = useLocation();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (field: keyof Address, value: any) => {
    onAddressChange({ ...address, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = AddressSchema.safeParse(address);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-cinema-surface p-6 sm:p-8 rounded-3xl border border-cinema-border shadow-cinema-sm text-cinema-text">
      {/* Fulfillment Toggle */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-accent font-heading">
          Select Fulfillment Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onDeliveryModeChange('PICKUP')}
            className={`flex items-center space-x-3 p-3.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
              deliveryMode === 'PICKUP'
                ? 'border-accent bg-accent/15 text-accent shadow-cinema-sm'
                : 'border-cinema-border bg-cinema-tertiary text-cinema-text-secondary hover:text-cinema-text'
            }`}
          >
            <Store className="h-5 w-5 text-accent shrink-0" />
            <div className="text-left">
              <div className="font-bold text-cinema-text">Hub Pickup</div>
              <div className="text-[11px] text-cinema-text-muted">{selectedCity} Store Hub (Free)</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onDeliveryModeChange('DELIVERY')}
            className={`flex items-center space-x-3 p-3.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
              deliveryMode === 'DELIVERY'
                ? 'border-accent bg-accent/15 text-accent shadow-cinema-sm'
                : 'border-cinema-border bg-cinema-tertiary text-cinema-text-secondary hover:text-cinema-text'
            }`}
          >
            <Truck className="h-5 w-5 text-accent shrink-0" />
            <div className="text-left">
              <div className="font-bold text-cinema-text">Express Set Delivery</div>
              <div className="text-[11px] text-cinema-text-muted">90-min direct to location (+₹300)</div>
            </div>
          </button>
        </div>
      </div>

      {/* Production / Filmmaker Contact Details */}
      <div className="space-y-4 border-t border-cinema-border pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-accent font-heading">
          Primary Filmmaker Contact
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-cinema-text-secondary">Full Name / DP Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-cinema-text-muted absolute left-3 top-3.5" />
              <Input
                placeholder="e.g. Christopher Nolan"
                value={address.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="pl-9 bg-cinema-tertiary border-cinema-border text-cinema-text"
              />
            </div>
            {errors.fullName && <p className="text-[11px] text-semantic-error">{errors.fullName}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-cinema-text-secondary">Mobile Number (For OTP) *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-cinema-text-muted absolute left-3 top-3.5" />
              <Input
                placeholder="9876543210"
                value={address.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="pl-9 bg-cinema-tertiary border-cinema-border text-cinema-text font-mono"
              />
            </div>
            {errors.phone && <p className="text-[11px] text-semantic-error">{errors.phone}</p>}
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-medium text-cinema-text-secondary">Email Address (For Tax Invoices) *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cinema-text-muted absolute left-3 top-3.5" />
              <Input
                type="email"
                placeholder="director@productionhouse.com"
                value={address.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="pl-9 bg-cinema-tertiary border-cinema-border text-cinema-text"
              />
            </div>
            {errors.email && <p className="text-[11px] text-semantic-error">{errors.email}</p>}
          </div>
        </div>
      </div>

      {/* Delivery / Billing Address */}
      <div className="space-y-4 border-t border-cinema-border pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-accent font-heading">
          {deliveryMode === 'DELIVERY' ? 'Shooting Set / Delivery Address' : 'Billing Address'}
        </h4>

        <div className="space-y-1">
          <label className="text-xs font-medium text-cinema-text-secondary">Street / Studio Address *</label>
          <div className="relative">
            <Home className="w-4 h-4 text-cinema-text-muted absolute left-3 top-3.5" />
            <Input
              placeholder="Studio Floor / Floor 2, Building Name, Street..."
              value={address.line1}
              onChange={(e) => handleChange('line1', e.target.value)}
              className="pl-9 bg-cinema-tertiary border-cinema-border text-cinema-text"
            />
          </div>
          {errors.line1 && <p className="text-[11px] text-semantic-error">{errors.line1}</p>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-cinema-text-secondary">City</label>
            <Input
              value={address.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="bg-cinema-tertiary border-cinema-border text-cinema-text"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-cinema-text-secondary">State</label>
            <Input
              value={address.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="bg-cinema-tertiary border-cinema-border text-cinema-text"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-cinema-text-secondary">Pincode *</label>
            <Input
              placeholder="600083"
              value={address.pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
              className="bg-cinema-tertiary border-cinema-border text-cinema-text font-mono"
            />
            {errors.pincode && <p className="text-[11px] text-semantic-error">{errors.pincode}</p>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-cinema-border">
        <Button
          type="submit"
          className="w-full h-12 text-xs uppercase tracking-wider font-black bg-accent hover:bg-accent-hover text-cinema-bg rounded-xl shadow-cinema-accent flex items-center justify-center gap-2"
        >
          <span>Continue to SMS OTP Verification</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
