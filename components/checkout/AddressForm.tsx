'use client';

import React from 'react';
import { Address, DeliveryMode } from '@/types/rental';
import { AddressSchema } from '@/lib/validations/schemas';
import { DeliveryMap } from './DeliveryMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Home, Building2, MapPin, ArrowRight, Store, Truck } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
      {/* Fulfillment Toggle */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Select Fulfillment Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onDeliveryModeChange('PICKUP')}
            className={`flex items-center space-x-3 p-3.5 rounded-2xl border text-xs font-semibold transition-all ${
              deliveryMode === 'PICKUP'
                ? 'border-lenstiger bg-lenstiger-50 text-lenstiger shadow-xs'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:text-black'
            }`}
          >
            <Store className="h-5 w-5 text-lenstiger shrink-0" />
            <div className="text-left">
              <div className="font-bold text-gray-900">Hub Pickup</div>
              <div className="text-[11px] text-gray-500">{selectedCity} Store Hub (Free)</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onDeliveryModeChange('DELIVERY')}
            className={`flex items-center space-x-3 p-3.5 rounded-2xl border text-xs font-semibold transition-all ${
              deliveryMode === 'DELIVERY'
                ? 'border-lenstiger bg-lenstiger-50 text-lenstiger shadow-xs'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:text-black'
            }`}
          >
            <Truck className="h-5 w-5 text-lenstiger shrink-0" />
            <div className="text-left">
              <div className="font-bold text-gray-900">Express Delivery</div>
              <div className="text-[11px] text-gray-500">Dispatched direct to set (+₹300)</div>
            </div>
          </button>
        </div>
      </div>

      {/* Customer Contact & Identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-lenstiger" />
            <span>Full Name</span>
          </label>
          <Input
            placeholder="John Doe"
            value={address.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
          />
          {errors.fullName && <p className="text-[11px] text-rose-500">{errors.fullName}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
            <Mail className="h-3.5 w-3.5 text-lenstiger" />
            <span>Email Address</span>
          </label>
          <Input
            type="email"
            placeholder="john@example.com"
            value={address.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
          />
          {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
            <Phone className="h-3.5 w-3.5 text-lenstiger" />
            <span>Mobile Phone (For OTP Verification)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-bold">+91</span>
            <Input
              placeholder="98765 43210"
              value={address.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="pl-12 rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
            />
          </div>
          {errors.phone && <p className="text-[11px] text-rose-500">{errors.phone}</p>}
        </div>
      </div>

      {/* Delivery Address Fields */}
      {deliveryMode === 'DELIVERY' && (
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-lenstiger" />
            <span>Set / Location Address</span>
          </h4>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Street Address / Landmark</label>
            <Input
              placeholder="Studio 4, Film City Complex, Main Road"
              value={address.line1}
              onChange={(e) => handleChange('line1', e.target.value)}
              className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
            />
            {errors.line1 && <p className="text-[11px] text-rose-500">{errors.line1}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">City</label>
              <Input
                value={address.city || selectedCity}
                onChange={(e) => handleChange('city', e.target.value)}
                className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
              />
              {errors.city && <p className="text-[11px] text-rose-500">{errors.city}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">State</label>
              <Input
                value={address.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
              />
              {errors.state && <p className="text-[11px] text-rose-500">{errors.state}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">PIN Code</label>
              <Input
                value={address.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                className="rounded-xl border-gray-300 bg-gray-50/50 text-gray-900"
              />
              {errors.pincode && <p className="text-[11px] text-rose-500">{errors.pincode}</p>}
            </div>
          </div>

          {/* Interactive Set Location Pin Map */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-gray-600">Pinpoint Delivery Coordinates</label>
            <DeliveryMap
              lat={address.lat || 12.9716}
              lng={address.lng || 77.5946}
              onLocationSelect={(lat, lng) => {
                handleChange('lat', lat);
                handleChange('lng', lng);
              }}
            />
          </div>
        </div>
      )}

      {deliveryMode === 'PICKUP' && (
        <div className="p-4 rounded-2xl bg-lenstiger-50 border border-lenstiger/20 text-xs text-lenstiger-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-lenstiger">
            <Store className="h-4 w-4" />
            <span>FlexGear {selectedCity} Hub</span>
          </div>
          <div className="text-gray-700">{selectedCityData.address}</div>
          <div className="text-gray-600 font-semibold">Phone: {selectedCityData.phone} • Open 24/7</div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 text-sm font-black bg-gold hover:bg-gold-hover text-gray-950 rounded-2xl shadow-sm flex items-center justify-center gap-2"
      >
        <span>Continue to OTP Verification</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
