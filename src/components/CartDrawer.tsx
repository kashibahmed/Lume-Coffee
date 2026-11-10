"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import DecorativeSun from "./DecorativeSun";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeFromCart,
    totalPrice,
    totalCount,
    clearCart,
  } = useCart();

  const [isOrdered, setIsOrdered] = useState(false);

  const handleCheckout = () => {
    setIsOrdered(true);
    setTimeout(() => {
      clearCart();
      setIsOrdered(false);
      closeCart();
    }, 2800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-espresso/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-brand-cream h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 border-l border-brand-peach">
        {/* Header */}
        <div className="p-6 bg-brand-blush/40 border-b border-brand-peach flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-brand-olive-dark" />
            <div>
              <h3 className="font-headline text-2xl text-brand-olive-dark uppercase tracking-wide">
                Your Order
              </h3>
              <p className="text-xs text-brand-espresso/70">
                {totalCount} {totalCount === 1 ? "item" : "items"} ready for pickup
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-white/60 transition-colors text-brand-olive-dark"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isOrdered ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-blush flex items-center justify-center text-brand-olive-dark animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-headline text-3xl text-brand-olive-dark">
                ORDER RECEIVED!
              </h4>
              <p className="text-brand-espresso/80 text-sm">
                Your coffee is being pulled with love. Estimated pick-up time:{" "}
                <span className="font-bold text-brand-olive-dark">8 minutes</span>.
              </p>
              <DecorativeSun size={48} className="animate-spin-slow text-brand-olive" />
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <ShoppingBag className="w-12 h-12 text-brand-olive/40" />
              <p className="font-headline text-xl text-brand-olive-dark">
                YOUR BAG IS EMPTY
              </p>
              <p className="text-xs text-brand-espresso/60 max-w-xs">
                Explore our signature menu and treat yourself to something bright today.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-brand-peach/60 shadow-sm"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-brand-peach flex items-center justify-center">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold tracking-wider text-brand-olive uppercase">
                    {item.product.category}
                  </span>
                  <h4 className="font-headline text-lg text-brand-olive-dark truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs font-semibold text-brand-espresso">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-brand-peach rounded-full bg-brand-cream/80 px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="text-brand-olive-dark hover:text-brand-espresso p-1"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="mx-2 text-xs font-bold text-brand-espresso">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="text-brand-olive-dark hover:text-brand-espresso p-1"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 text-brand-espresso/40 hover:text-brand-espresso transition-colors"
                    aria-label="Remove item"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Totals */}
        {!isOrdered && items.length > 0 && (
          <div className="p-6 bg-brand-peach/40 border-t border-brand-peach space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-brand-espresso/70">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-brand-espresso/70 text-xs">
                <span>Pickup Time</span>
                <span className="text-brand-olive-dark font-medium">Ready in ~8 mins</span>
              </div>
              <div className="flex justify-between font-bold text-base text-brand-espresso pt-2 border-t border-brand-peach">
                <span>Total</span>
                <span className="text-brand-olive-dark font-headline text-xl">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-6 rounded-full bg-brand-olive-dark text-brand-cream font-medium text-sm flex items-center justify-center gap-2 hover:bg-brand-espresso transition-all duration-300 shadow-md group"
            >
              <span>Place Order for Pickup</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

