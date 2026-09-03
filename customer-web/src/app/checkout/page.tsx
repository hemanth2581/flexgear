'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, MapPin, User, ArrowRight, Truck, Building2, Calendar, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { RentalService } from '../../services/rental.service';
import { calculateDays } from '../../utils/dates';
import { formatCurrency } from '../../utils/currency';
import { DeliveryMap } from '../../components/checkout/DeliveryMap';
import { StripePaymentForm } from '../../components/payment/StripePaymentForm';

function CheckoutContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, startDate, endDate, deliveryMode, setDeliveryMode, clearCart } = useCart();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400065');
  const [lat, setLat] = useState(19.0760);
  const [lng, setLng] = useState(72.8777);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (user) {
      if (user.full_name && !fullName) setFullName(user.full_name);
      if (user.phone && !phone) setPhone(user.phone);
      if (user.email && !email) setEmail(user.email);
    }
  }, [user]);

  const [createdRental, setCreatedRental] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const duration = Math.max(1, calculateDays(startDate, endDate));
  const rawSubtotal = items.reduce(
    (sum, i) => sum + (i.equipment.daily_price || i.equipment.daily_rate || 15000) * i.quantity * duration,
    0
  );
  const totalDeposit = items.reduce(
    (sum, i) => sum + (i.equipment.security_deposit || 25000) * i.quantity,
    0
  );
  const isWeeklyDiscount = duration >= 7;
  const durationDiscount = isWeeklyDiscount
    ? Math.round(rawSubtotal * 0.15)
    : rawSubtotal > 20000
    ? Math.round(rawSubtotal * 0.1)
    : 0;
  const deliveryFee = deliveryMode === 'DELIVERY' ? 500 : 0;
  const taxableSubtotal = Math.max(0, rawSubtotal - durationDiscount + deliveryFee);
  const cgst = Math.round(taxableSubtotal * 0.09); // 9% CGST
  const sgst = Math.round(taxableSubtotal * 0.09); // 9% SGST
  const totalTax = cgst + sgst;
  const totalAmount = taxableSubtotal + totalTax + totalDeposit;

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      router.push('/equipment');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const checkoutPayload = {
        items: items.map((i) => ({
          equipmentId: i.equipment.id,
          quantity: i.quantity,
          dailyPrice: i.equipment.daily_price || i.equipment.daily_rate || 15000,
          weeklyPrice: i.equipment.weekly_price,
          securityDeposit: i.equipment.security_deposit || 25000,
        })),
        startDate,
        endDate,
        deliveryMode,
        deliveryAddress: {
          fullName,
          phone,
          street: streetAddress || 'Film City Main Gate',
          city,
          state,
          pincode,
          lat,
          lng,
        },
        notes,
      };

      const res = await RentalService.checkout(checkoutPayload);
      setCreatedRental(res.rental);
      setClientSecret(res.clientSecret);
      setActiveStep(3);
    } catch (err: any) {
      setError(err.message || 'Checkout initiation failed. Please verify dates and details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    clearCart();
    const rentalId = createdRental?.id || '';
    router.push(`/checkout/success?rentalId=${rentalId}&paymentIntent=${paymentIntentId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 3-Step Progress Indicator */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mb-12 text-xs font-mono">
        <div
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
            activeStep === 1
              ? 'bg-accent/10 border-accent text-accent font-bold'
              : activeStep > 1
              ? 'bg-surface-2 border-surface-4 text-emerald-400'
              : 'bg-surface-1 border-surface-3 text-zinc-500'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-surface-2 flex items-center justify-center text-[10px] font-bold">
            1
          </span>
          <span className="hidden sm:inline">Review Order</span>
        </div>

        <span className="text-zinc-600">→</span>

        <div
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
            activeStep === 2
              ? 'bg-accent/10 border-accent text-accent font-bold'
              : activeStep > 2
              ? 'bg-surface-2 border-surface-4 text-emerald-400'
              : 'bg-surface-1 border-surface-3 text-zinc-500'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-surface-2 flex items-center justify-center text-[10px] font-bold">
            2
          </span>
          <span className="hidden sm:inline">Set Delivery</span>
        </div>

        <span className="text-zinc-600">→</span>

        <div
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
            activeStep === 3
              ? 'bg-accent/10 border-accent text-accent font-bold'
              : 'bg-surface-1 border-surface-3 text-zinc-500'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-surface-2 flex items-center justify-center text-[10px] font-bold">
            3
          </span>
          <span className="hidden sm:inline">Stripe Payment</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-mono">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Step Forms */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Review Order */}
          {activeStep === 1 && (
            <div className="p-6 rounded-2xl bg-surface-1 border border-surface-3 space-y-6">
              <div className="flex items-center justify-between border-b border-surface-3/50 pb-4">
                <h3 className="text-base font-bold font-display text-white">
                  Step 1: Review Shoot Dates &amp; Gear
                </h3>
                <span className="text-xs font-mono text-accent font-semibold">{duration} Days Scheduled</span>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.equipment.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface-0/60 border border-surface-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-2 overflow-hidden border border-surface-3 shrink-0">
                        <img
                          src={item.equipment.thumbnail_url || item.equipment.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white line-clamp-1">{item.equipment.name}</div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          Qty: {item.quantity} · {formatCurrency(item.equipment.daily_price || item.equipment.daily_rate || 15000)}/day
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-white text-right">
                      {formatCurrency((item.equipment.daily_price || item.equipment.daily_rate || 15000) * item.quantity * duration)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-surface-3 text-xs font-mono">
                <Calendar className="w-4 h-4 text-accent shrink-0" />
                <div className="flex-1 flex justify-between">
                  <span className="text-zinc-400">Shoot Schedule:</span>
                  <span className="text-white font-bold">{startDate} to {endDate}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="w-full py-3 bg-accent hover:bg-accent-hover text-surface-0 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Proceed to Delivery Location <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Delivery & Contact Details */}
          {activeStep === 2 && (
            <form onSubmit={handleProceedToPayment} className="p-6 rounded-2xl bg-surface-1 border border-surface-3 space-y-6">
              <div className="flex items-center justify-between border-b border-surface-3/50 pb-4">
                <h3 className="text-base font-bold font-display text-white">
                  Step 2: Logistics &amp; Set Pin
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="text-xs font-mono text-zinc-400 hover:text-white"
                >
                  ← Edit Gear
                </button>
              </div>

              {/* Delivery Option Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMode('DELIVERY')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    deliveryMode === 'DELIVERY'
                      ? 'bg-accent/10 border-accent text-white'
                      : 'bg-surface-0 border-surface-3 text-zinc-400 hover:border-surface-4'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold font-display">
                    <Truck className="w-4 h-4 text-accent" />
                    <span>Deliver to Film Set</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-1">Direct GPS Van Delivery (+₹500)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMode('PICKUP')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    deliveryMode === 'PICKUP'
                      ? 'bg-accent/10 border-accent text-white'
                      : 'bg-surface-0 border-surface-3 text-zinc-400 hover:border-surface-4'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold font-display">
                    <Building2 className="w-4 h-4 text-accent" />
                    <span>Vault Pickup</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-1">Film City Hub Vault (Free)</div>
                </button>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Production Contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 block mb-1">Producer / DP Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Arjun Mehta"
                      className="w-full bg-surface-0 border border-surface-3 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 block mb-1">Phone (Firebase OTP)</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 9876543210"
                      className="w-full bg-surface-0 border border-surface-3 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-zinc-500 block mb-1">Invoice &amp; Escrow Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="producer@studio.film"
                    className="w-full bg-surface-0 border border-surface-3 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Set Pin / Street Address */}
              {deliveryMode === 'DELIVERY' ? (
                <div className="space-y-4 pt-2 border-t border-surface-3/50">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-accent" /> Film Set Location
                  </h4>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500 block mb-1">Studio / Set Street Address</label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      required
                      placeholder="Studio 4, Film City, Goregaon East"
                      className="w-full bg-surface-0 border border-surface-3 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-500 block mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full bg-surface-0 border border-surface-3 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-500 block mb-1">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        className="w-full bg-surface-0 border border-surface-3 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-500 block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        required
                        className="w-full bg-surface-0 border border-surface-3 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent font-mono"
                      />
                    </div>
                  </div>

                  <DeliveryMap
                    lat={lat}
                    lng={lng}
                    onLocationChange={(newLat, newLng) => {
                      setLat(newLat);
                      setLng(newLng);
                    }}
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-surface-0 border border-surface-3 space-y-2 text-xs font-mono">
                  <div className="text-white font-bold">FlexGear Central Vault Hub</div>
                  <div className="text-zinc-400">Vault 1, Film City, Goregaon East, Mumbai 400065</div>
                  <div className="text-zinc-500">Operating Hours: 06:00 AM – 11:00 PM (Everyday)</div>
                </div>
              )}

              {/* Gate Access / Shoot Notes */}
              <div>
                <label className="text-[10px] font-mono text-zinc-500 block mb-1">Gate Pass / Set Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Gate 2 access / report to Assistant Director / indoor soundstage..."
                  className="w-full bg-surface-0 border border-surface-3 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-accent hover:bg-accent-hover text-surface-0 font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-accent/20 font-mono"
              >
                {isSubmitting ? 'Initiating Stripe Payment...' : 'Continue to Stripe Escrow Payment'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 3: Payment Form */}
          {activeStep === 3 && (
            <div className="p-6 rounded-2xl bg-surface-1 border border-surface-3 space-y-6">
              <div className="flex items-center justify-between border-b border-surface-3/50 pb-4">
                <h3 className="text-base font-bold font-display text-white">
                  Step 3: Stripe Deposit &amp; Payment Escrow
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="text-xs font-mono text-zinc-400 hover:text-white"
                >
                  ← Edit Location
                </button>
              </div>

              {/* Security Escrow Callout */}
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-xs font-mono flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-accent">Refundable Security Deposit Escrow: {formatCurrency(totalDeposit)}</div>
                  <div className="text-zinc-400 text-[11px] mt-0.5">
                    This amount is safely held in escrow and will be automatically refunded to your original payment method immediately after return inspection.
                  </div>
                </div>
              </div>

              <StripePaymentForm
                clientSecret={clientSecret}
                totalAmount={totalAmount}
                onSuccess={handlePaymentSuccess}
                onError={(err) => setError(err)}
              />
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-surface-1 border border-surface-3 space-y-4 shadow-xl sticky top-20">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400 border-b border-surface-3/50 pb-3">
              Order Breakdown
            </h3>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.equipment.id} className="flex justify-between text-xs font-mono text-zinc-300">
                  <span className="truncate max-w-[180px] text-white">
                    {item.quantity}× {item.equipment.name}
                  </span>
                  <span className="text-zinc-400">
                    {formatCurrency((item.equipment.daily_price || item.equipment.daily_rate || 15000) * item.quantity * duration)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-surface-3/50 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Rental Subtotal ({duration} d)</span>
                <span className="text-white">{formatCurrency(rawSubtotal)}</span>
              </div>
              {durationDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Duration Discount (15%)</span>
                  <span>-{formatCurrency(durationDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Set Dispatch</span>
                <span className="text-white">{deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Free Pickup'}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>CGST (9%)</span>
                <span className="text-white">{formatCurrency(cgst)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>SGST (9%)</span>
                <span className="text-white">{formatCurrency(sgst)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-surface-3/60 text-amber-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Refundable Deposit Hold
                </span>
                <span>{formatCurrency(totalDeposit)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-3 flex items-baseline justify-between">
              <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">Total Charged</span>
              <span className="text-2xl font-bold font-mono text-accent">{formatCurrency(totalAmount)}</span>
            </div>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] font-mono text-zinc-500">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Stripe 256-Bit Encrypted Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs font-mono text-zinc-500">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
