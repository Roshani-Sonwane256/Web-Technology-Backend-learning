"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

export default function CartDrawer() {
  const router = useRouter();
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart } = useCartStore();

  const handleCheckoutClick = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 150;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const neededForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-card border-l border-border h-full flex flex-col shadow-2xl z-50 select-none"
          >
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Shopping Cart</h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {cart.length > 0 && (
              <div className="px-6 py-4 bg-secondary/50 border-b border-border">
                <div className="text-xs font-medium text-foreground mb-1.5">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      You qualify for Free Shipping! 🎉
                    </span>
                  ) : (
                    <span>
                      Add <span className="font-semibold text-primary">${neededForFreeShipping.toFixed(2)}</span> more to unlock Free Shipping
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary progress-bar-fill rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/40 mb-4 stroke-[1.5]" />
                  <p className="text-base font-medium text-foreground">Your cart is empty</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                    Explore our premium collections and add products to start shopping.
                  </p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      router.push("/shop");
                    }}
                    className="mt-6 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold rounded-md transition-colors"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor.name}-${item.selectedSize}`} className="py-4 flex gap-4">
                    {/* Thumbnail */}
                    <div className="h-20 w-20 rounded-md bg-secondary border border-border flex-shrink-0 overflow-hidden relative">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="h-full w-full object-contain p-1"
                      />
                    </div>

                    {/* Meta */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-sm font-semibold text-foreground">
                          <h3 className="line-clamp-1 hover:text-primary transition-colors">
                            <Link href={`/product/${item.product.id}`} onClick={() => setCartOpen(false)}>
                              {item.product.title}
                            </Link>
                          </h3>
                          <span className="ml-2">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2.5 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            Color: 
                            <span 
                              className="inline-block w-2.5 h-2.5 rounded-full border border-black/10" 
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.name}
                          </span>
                          {item.selectedSize && (
                            <span>• Size: {item.selectedSize}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-border rounded-md bg-secondary h-8 px-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedColor.name, item.selectedSize, item.quantity - 1)}
                            className="p-1 text-muted-foreground hover:text-foreground hover:bg-border rounded-md transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-foreground min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedColor.name, item.selectedSize, item.quantity + 1)}
                            className="p-1 text-muted-foreground hover:text-foreground hover:bg-border rounded-md transition-colors"
                            disabled={item.quantity >= item.product.inventory}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor.name, item.selectedSize)}
                          className="text-muted-foreground hover:text-destructive p-1.5 rounded-md hover:bg-secondary transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary Footer */}
            {cart.length > 0 && (
              <div className="border-t border-border px-6 py-5 bg-secondary/20">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-foreground font-medium">
                      {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-foreground font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-foreground border-t border-border/60 pt-2.5 mt-1.5">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="mt-6 w-full h-11 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/95 flex items-center justify-center gap-2 group transition-colors shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
