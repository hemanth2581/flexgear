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
import { Check, ShieldCheck, MapPin, Phone, CreditCard, ShoppingBag, Sparkles } from 'lucide-react';
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
      <div className="bg-cinema-bg min-h-screen py-24 px-4 text-cinema-text">
        <div className="mx-auto max-w-md bg-cinema-surface rounded-3xl p-10 text-center border border-cinema-border shadow-cinema-md space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cinema-tertiary border border-cinema-border text-accent shadow-cinema-glow">
            <ShoppingBag className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-xl font-black text-cinema-text font-heading">Your Cart is Empty</h1>
          <p className="text-xs text-cinema-text-secondary">Please add gear to your cart before proceeding to checkout.</p>
          <Link href="/equipment" className="inline-block pt-2 text-xs font-bold text-accent hover:underline">
            Return to Cinema Equipment Catalog →
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
    <div className="bg-cinema-bg min-h-screen py-10 text-cinema-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Checkout Header & Steps Indicator */}
        <div className="border-b border-cinema-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 shadow-cinema-glow mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production Order Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-cinema-text font-heading">
              Secure Equipment Checkout
            </h1>
            <p className="text-xs text-cinema-text-secondary mt-1">
              Contact info, instant phone OTP verification, and secure production payment.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
              currentStep === 1
                ? 'bg-accent text-cinema-bg font-black shadow-cinema-sm'
                : currentStep > 1
                ? 'bg-accent/15 text-accent border border-accent/30'
                : 'bg-cinema-tertiary text-cinema-text-muted border border-cinema-border'
            }`}>
              {currentStep > 1 ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <span>1</span>}
              <span>Details</span>
            </div>

            <span className="text-cinema-border">──</span>

            <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
              currentStep === 2
                ? 'bg-accent text-cinema-bg font-black shadow-cinema-sm'
                : currentStep > 2
                ? 'bg-accent/15 text-accent border border-accent/30'
                : 'bg-cinema-tertiary text-cinema-text-muted border border-cinema-border'
            }`}>
              {currentStep > 2 ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <span>2</span>}
              <span>OTP</span>
            </div>

            <span className="text-cinema-border">──</span>

            <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
              currentStep === 3
                ? 'bg-accent text-cinema-bg font-black shadow-cinema-sm'
                : 'bg-cinema-tertiary text-cinema-text-muted border border-cinema-border'
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
            <div className="rounded-3xl border border-cinema-border bg-cinema-surface p-5 space-y-3 shadow-cinema-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cinema-text-secondary font-heading">
                Reserved Cinema Gear ({items.length})
              </h4>
              <div className="divide-y divide-cinema-border text-xs">
                {items.map((item) => (
                  <div key={item.equipment.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-cinema-text">{item.equipment.name}</div>
                      <div className="text-[11px] text-cinema-text-muted">
                        {item.startDate} → {item.endDate} ({item.days} days) • Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="font-black text-accent font-heading">
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
