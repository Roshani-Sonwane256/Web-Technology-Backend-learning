"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, ShieldCheck, ShoppingBag, Truck, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface ShippingForm {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

interface PaymentForm {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const [step, setStep] = useState<1 | 2>(1);

  // Form States
  const [shipping, setShipping] = useState<ShippingForm>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [payment, setPayment] = useState<PaymentForm>({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });

  // Errors
  const [shippingErrors, setShippingErrors] = useState<Partial<ShippingForm>>({});
  const [paymentErrors, setPaymentErrors] = useState<Partial<PaymentForm>>({});

  // Redirect if cart is empty on load
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/shop");
    }
  }, [cart, router]);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 150;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  // Mask CC input: add space every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const masked = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setPayment({ ...payment, cardNumber: masked });
  };

  // Mask Expiry input: MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setPayment({ ...payment, cardExpiry: value });
  };

  // Mask CVV: 3 or 4 digits
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setPayment({ ...payment, cardCvv: value });
  };

  // Validate Step 1
  const validateShipping = (): boolean => {
    const errors: Partial<ShippingForm> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const zipRegex = /^\d{5,6}$/;

    if (!shipping.fullName.trim()) errors.fullName = "Full name is required";
    if (!shipping.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(shipping.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!shipping.address.trim()) errors.address = "Address is required";
    if (!shipping.city.trim()) errors.city = "City is required";
    if (!shipping.zipCode.trim()) {
      errors.zipCode = "Zip code is required";
    } else if (!zipRegex.test(shipping.zipCode)) {
      errors.zipCode = "Zip code must be 5 or 6 digits";
    }

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Step 2
  const validatePayment = (): boolean => {
    const errors: Partial<PaymentForm> = {};
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    if (payment.cardNumber.replace(/\s/g, "").length !== 16) {
      errors.cardNumber = "Card number must be 16 digits";
    }
    if (!payment.cardName.trim()) {
      errors.cardName = "Name on card is required";
    }
    if (!expiryRegex.test(payment.cardExpiry)) {
      errors.cardExpiry = "Expiry must be MM/YY";
    } else {
      // Basic check if year is in the future
      const [m, y] = payment.cardExpiry.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (Number(y) < currentYear || (Number(y) === currentYear && Number(m) < currentMonth)) {
        errors.cardExpiry = "Card has expired";
      }
    }
    if (payment.cardCvv.length !== 3) {
      errors.cardCvv = "CVV must be 3 digits";
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      // 1. Generate Order Reference
      const ordPart1 = Math.floor(1000 + Math.random() * 9000);
      const ordPart2 = Math.floor(1000 + Math.random() * 9000);
      const orderRef = `ORD-${ordPart1}-${ordPart2}`;

      // 2. Clone cart details to save to local storage (for success screen)
      const orderSummary = {
        orderRef,
        items: cart.map(item => ({
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
          color: item.selectedColor,
          size: item.selectedSize
        })),
        shippingAddress: shipping,
        subtotal,
        shippingCost,
        tax,
        total
      };

      localStorage.setItem("lastOrder", JSON.stringify(orderSummary));

      // 3. Clear cart and redirect
      clearCart();
      router.push("/checkout/success");
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Back button */}
      <div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Shop</span>
        </Link>
      </div>

      {/* Progress Header */}
      <div className="max-w-5xl mx-auto flex items-center justify-between border-b border-border/60 pb-6">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Checkout</h1>
        
        {/* Step Indicators */}
        <div className="flex items-center gap-4 text-sm font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center border ${
              step > 1 ? "bg-primary border-transparent text-primary-foreground" : "border-primary"
            }`}>
              {step > 1 ? <Check className="h-3.5 w-3.5" /> : "1"}
            </span>
            <span className="hidden sm:inline">Shipping</span>
          </div>
          <span className="h-px w-8 bg-border" />
          <div className={`flex items-center gap-2 ${step === 2 ? "text-primary" : "text-muted-foreground"}`}>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center border ${
              step === 2 ? "border-primary text-primary" : "border-border"
            }`}>
              2
            </span>
            <span className="hidden sm:inline">Payment</span>
          </div>
        </div>
      </div>

      {/* Checkout Content Layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* FORMS PANEL */}
        <div className="lg:col-span-2 bg-card border border-border/80 rounded-2xl p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: SHIPPING INFORMATION */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/40">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Shipping Address</h2>
              </div>

              <div className="space-y-4">
                {/* Full name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    placeholder="e.g. Liam Sterling"
                  />
                  {shippingErrors.fullName && (
                    <p className="text-xs text-destructive mt-1">{shippingErrors.fullName}</p>
                  )}
                </div>

                {/* Email address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    placeholder="e.g. liam@example.com"
                  />
                  {shippingErrors.email && (
                    <p className="text-xs text-destructive mt-1">{shippingErrors.email}</p>
                  )}
                </div>

                {/* Street address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">Street Address</label>
                  <input
                    type="text"
                    required
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    placeholder="123 Creative Circle"
                  />
                  {shippingErrors.address && (
                    <p className="text-xs text-destructive mt-1">{shippingErrors.address}</p>
                  )}
                </div>

                {/* City & Zip Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider block">City</label>
                    <input
                      type="text"
                      required
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      placeholder="San Francisco"
                    />
                    {shippingErrors.city && (
                      <p className="text-xs text-destructive mt-1">{shippingErrors.city}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider block">Zip / Postal Code</label>
                    <input
                      type="text"
                      required
                      value={shipping.zipCode}
                      onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                      className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      placeholder="94103"
                    />
                    {shippingErrors.zipCode && (
                      <p className="text-xs text-destructive mt-1">{shippingErrors.zipCode}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 flex items-center justify-center gap-2 transition-colors mt-6"
              >
                <span>Continue to Payment</span>
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT GATEWAY */}
          {step === 2 && (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/40">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Secure Payment Details</h2>
              </div>

              {/* Secure Checkout Banner */}
              <div className="px-4 py-3 bg-secondary border border-border rounded-lg flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                <span>Your transaction is encrypted. AuraShop does not store actual credit card data.</span>
              </div>

              <div className="space-y-4">
                {/* Name on card */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">Name on Card</label>
                  <input
                    type="text"
                    required
                    value={payment.cardName}
                    onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Liam Sterling"
                  />
                  {paymentErrors.cardName && (
                    <p className="text-xs text-destructive mt-1">{paymentErrors.cardName}</p>
                  )}
                </div>

                {/* Card Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider block">Card Number</label>
                  <input
                    type="text"
                    required
                    value={payment.cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    placeholder="4111 2222 3333 4444"
                  />
                  {paymentErrors.cardNumber && (
                    <p className="text-xs text-destructive mt-1">{paymentErrors.cardNumber}</p>
                  )}
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider block">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={payment.cardExpiry}
                      onChange={handleExpiryChange}
                      className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    />
                    {paymentErrors.cardExpiry && (
                      <p className="text-xs text-destructive mt-1">{paymentErrors.cardExpiry}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider block">CVV</label>
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      value={payment.cardCvv}
                      onChange={handleCvvChange}
                      className="w-full h-11 px-4 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    />
                    {paymentErrors.cardCvv && (
                      <p className="text-xs text-destructive mt-1">{paymentErrors.cardCvv}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 h-11 border border-border hover:bg-secondary text-foreground text-sm font-semibold rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/95 transition-colors"
                >
                  Place Order (${total.toFixed(2)})
                </button>
              </div>
            </form>
          )}

        </div>

        {/* SUMMARY DETAILS PANEL */}
        <div className="space-y-6">
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border/40 pb-3 flex items-center gap-2">
              <ShoppingBag className="h-4.5 w-4.5 text-primary" />
              <span>Order Summary</span>
            </h3>

            {/* List items */}
            <div className="max-h-[220px] overflow-y-auto pr-1 space-y-3.5 divide-y divide-border/40">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 pt-3 first:pt-0 first:border-t-0">
                  <div className="h-12 w-12 rounded-lg bg-secondary border border-border flex-shrink-0 p-1">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center text-xs">
                    <div className="flex justify-between font-semibold text-foreground">
                      <span className="line-clamp-1">{item.product.title}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="text-muted-foreground mt-0.5">
                      Qty: {item.quantity} • {item.selectedColor.name} {item.selectedSize !== "Standard" && `• ${item.selectedSize}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price list */}
            <div className="border-t border-border/40 pt-4 space-y-2.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="text-foreground font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-foreground border-t border-border/40 pt-3 mt-1">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
