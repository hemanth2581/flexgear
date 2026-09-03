'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';
import { useToast } from '@/components/ui/toast';
import { Address, DeliveryMode } from '@/types/rental';
import { AddressForm } from '@/components/checkout/AddressForm';
import { OtpStep } from '@/components/checkout/OtpStep';
import { MockPaymentStep } from '@/components/checkout/MockPaymentStep';
import { CartSummary } from '@/components/cart/CartSummary';
import { Check, ShieldCheck, MapPin, Phone, CreditCard, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, deliveryMode, setDeliveryMode, pricing, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Address state
  const [address, setAddress] = useState<Address>({
    fullName: '',
    email: '',
    phone: '',
    line1: '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600083',
    lat: 13.0334,
    lng: 80.2128,
  });

  // OTP state
  const [otpToken, setOtpToken] = useState<string | null>(null);

  // Checkout order initialized on Step 3
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [rentalOrderId, setRentalOrderId] = useState<string | null>(null);
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);

  if (items.length === 0 && !rentalOrderId) {
    return (
      <div className="bg-[#f3f3f3] min-h-screen py-20 px-4">
        <div className="mx-auto max-w-md bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-sm space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lenstiger-50 text-lenstiger shadow-xs">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-black text-gray-900 headingbold">Your Cart is Empty</h1>
          <p className="text-xs text-gray-500">Please add gear to your cart before proceeding to checkout.</p>
          <Link href="/equipment" className="inline-block pt-2 text-xs font-bold text-lenstiger hover:underline">
            Return to Equipment Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Handle step 1 -> step 2
  const handleAddressSubmitted = () => {
    setCurrentStep(2);
  };

  // Handle step 2 OTP verified -> step 3
  const handleOtpVerified = async (token: string) => {
    setOtpToken(token);
    setIsCreatingOrder(true);

    try {
      const checkoutPayload = {
        items: items.map((i) => ({
          equipmentId: i.equipment.id,
          quantity: i.quantity,
          startDate: i.startDate,
          endDate: i.endDate,
        })),
        deliveryMode,
        address,
        otpToken: token,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutPayload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRentalOrderId(data.rentalOrderId);
        setPaymentOrderId(data.paymentOrderId);
        setCurrentStep(3);
      } else {
        toast(data.error || 'Checkout initialization failed', 'error');
        setCurrentStep(1);
      }
    } catch (e) {
      console.error(e);
      const demoId = 'fg-order-' + Math.floor(100000 + Math.random() * 900000);
      setRentalOrderId(demoId);
      setPaymentOrderId('pay_' + demoId);
      setCurrentStep(3);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Step 3 Payment success -> confirmed page
  const handlePaymentSuccess = (rentalId: string) => {
    clearCart();
    router.push(`/rentals/${rentalId}/confirmed`);
  };

  return (
    <div className="bg-[#f3f3f3] min-h-screen py-8 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Checkout Header & Steps Indicator */}
        <div className="border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 headingbold">Secure Equipment Checkout</h1>
            <p className="text-xs text-gray-500 mt-1">
              Complete contact info, instant SMS OTP verification, and secure payment.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
              currentStep === 1
                ? 'bg-lenstiger text-white shadow-xs'
                : currentStep > 1
                ? 'bg-lenstiger-50 text-lenstiger'
                : 'bg-gray-200 text-gray-400'
            }`}>
              {currentStep > 1 ? <Check className="h-3.5 w-3.5" /> : <span>1</span>}
              <span>Details</span>
            </div>

            <span className="text-gray-300">──</span>

            <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
              currentStep === 2
                ? 'bg-lenstiger text-white shadow-xs'
                : currentStep > 2
                ? 'bg-lenstiger-50 text-lenstiger'
                : 'bg-gray-200 text-gray-400'
            }`}>
              {currentStep > 2 ? <Check className="h-3.5 w-3.5" /> : <span>2</span>}
              <span>OTP</span>
            </div>

            <span className="text-gray-300">──</span>

            <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
              currentStep === 3
                ? 'bg-lenstiger text-white shadow-xs'
                : 'bg-gray-200 text-gray-400'
            }`}>
              <span>3</span>
              <span>Payment</span>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Main Checkout Step (7 cols) */}
          <div className="lg:col-span-7">
            {currentStep === 1 && (
              <AddressForm
                address={address}
                deliveryMode={deliveryMode}
                onAddressChange={setAddress}
                onDeliveryModeChange={setDeliveryMode}
                onNext={handleAddressSubmitted}
              />
            )}

            {currentStep === 2 && (
              <OtpStep
                phone={address.phone}
                onOtpVerified={handleOtpVerified}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <MockPaymentStep
                rentalOrderId={rentalOrderId || ''}
                paymentOrderId={paymentOrderId || ''}
                pricing={pricing}
                address={address}
                deliveryMode={deliveryMode}
                onBack={() => setCurrentStep(1)}
                onSuccess={handlePaymentSuccess}
              />
            )}
          </div>

          {/* Pricing & Order Summary (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <CartSummary
              pricing={pricing}
              deliveryMode={deliveryMode}
              onDeliveryModeChange={setDeliveryMode}
              isCheckoutPage={true}
            />

            {/* Gear Items Preview Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 space-y-3 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Reserved Equipment ({items.length})
              </h4>
              <div className="divide-y divide-gray-100 text-xs">
                {items.map((item) => (
                  <div key={item.equipment.id} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">{item.equipment.name}</div>
                      <div className="text-[11px] text-gray-500">
                        {item.startDate} → {item.endDate} ({item.days} days) • Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="font-black text-lenstiger">
                      ₹{(item.dailyPrice * item.days * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
