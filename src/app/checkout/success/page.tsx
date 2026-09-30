"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, ShoppingBag, Truck, Calendar, DollarSign, ExternalLink } from "lucide-react";

interface OrderSummary {
  orderRef: string;
  items: {
    title: string;
    price: number;
    quantity: number;
    image: string;
    color: { name: string; hex: string };
    size: string;
  }[];
  shippingAddress: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  if (!order) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center p-6 bg-card border border-border rounded-2xl max-w-md mx-auto my-12">
        <ShoppingBag className="h-10 w-10 text-muted-foreground/35 mb-4 animate-bounce" />
        <h2 className="text-base font-bold text-foreground">No order found</h2>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-xs">
          We couldn't retrieve recent purchase information. Feel free to browse our collection instead.
        </p>
        <Link
          href="/shop"
          className="mt-6 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-md text-xs hover:bg-primary/95 transition-all"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      {/* 1. ANIMATED CHECKMARK & SUCCESS STATE */}
      <div className="text-center space-y-4 py-6 bg-linear-to-b from-card to-secondary/10 border border-border rounded-3xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 scale-110 mb-2">
          <CheckCircle2 className="h-10 w-10 animate-scale-up" />
        </div>
        
        <div className="space-y-1 z-10 relative">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Order Confirmed</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Thank you for your purchase. We are preparing your shipment.
          </p>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-secondary text-foreground border border-border rounded-md text-xs font-semibold select-all">
          <span>Order ID:</span>
          <span className="text-primary font-mono">{order.orderRef}</span>
        </div>
      </div>

      {/* 2. ORDER DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Line Items & Shipping Info */}
        <div className="space-y-6">
          
          {/* Purchased Items */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border/40 pb-2.5 flex items-center gap-2">
              <ShoppingBag className="h-4.5 w-4.5 text-primary" />
              <span>Items Purchased</span>
            </h3>

            <div className="divide-y divide-border/40 max-h-[300px] overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 py-3.5 first:pt-0 last:pb-0">
                  <div className="h-14 w-14 rounded-lg bg-secondary border border-border flex-shrink-0 p-1 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center text-xs">
                    <div className="flex justify-between font-semibold text-foreground">
                      <span className="line-clamp-1">{item.title}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="text-muted-foreground mt-1">
                      Qty: {item.quantity} • {item.color.name} {item.size !== "Standard" && `• ${item.size}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-3.5">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border/40 pb-2.5 flex items-center gap-2">
              <Truck className="h-4.5 w-4.5 text-primary" />
              <span>Delivery Details</span>
            </h3>

            <div className="text-xs text-muted-foreground space-y-1.5">
              <p className="font-bold text-foreground">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
              <p className="pt-1.5 text-[10px] text-muted-foreground flex items-center gap-1">
                <span>Confirmation sent to:</span>
                <span className="font-semibold text-foreground">{order.shippingAddress.email}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Pricing Receipt & Support */}
        <div className="space-y-6">
          
          {/* Payment Receipt */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border/40 pb-2.5 flex items-center gap-2">
              <DollarSign className="h-4.5 w-4.5 text-primary" />
              <span>Billing Summary</span>
            </h3>

            <div className="text-xs space-y-2.5 text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="text-foreground font-medium">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-foreground border-t border-border/40 pt-3 mt-1">
                <span>Total Charged</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Window & Support Info */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-3.5">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border/40 pb-2.5 flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-primary" />
              <span>Estimated Delivery</span>
            </h3>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your package is expected to arrive within <span className="font-semibold text-foreground">3 to 5 business days</span>. A shipping notification email containing tracking information from our carriers will be sent as soon as the items dispatch.
            </p>

            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Need assistance?</span>
              <a href="#" className="font-semibold text-primary flex items-center gap-0.5 hover:underline">
                <span>Contact Support</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* 3. CTA CONTINUE SHOPPING */}
      <div className="flex justify-center pt-2">
        <Link
          href="/shop"
          className="px-6 h-11 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <span>Continue Shopping</span>
          <ChevronRight className="h-4.5 w-4.5" />
        </Link>
      </div>

      <style jsx global>{`
        @keyframes scaleUp {
          from {
            transform: scale(0.85);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-up {
          animation: scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

    </div>
  );
}
