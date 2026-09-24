"use client";

import React from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { useStore } from "@/components/store";
import { MascotBasket } from "@/components/mascot-art";

export function CartDrawer() {
  const { lines, isCartOpen, setIsCartOpen, setQty, remove, subtotal, totalItems } = useStore();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 499;
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const amountLeft = freeDeliveryThreshold - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="w-screen max-w-md bg-sacredCream border-l-2 border-antiqueGold shadow-2xl flex flex-col justify-between text-charcoal">
          {/* Header */}
          <div className="p-6 border-b border-antiqueGold/30 bg-turmeric/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-saffron" size={22} />
                <h2 className="font-display text-2xl text-earthBrown">Your Sacred Basket</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
                className="p-2 text-earthBrown hover:bg-sacredCream rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Delivery Meter */}
            <div className="mt-4 bg-sacredCream p-3 rounded-lg border border-antiqueGold/40">
              <div className="flex items-center justify-between text-xs font-semibold text-earthBrown">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-saffron" />
                  {amountLeft > 0 ? `Add ₹${amountLeft} more for FREE Delivery` : "🎉 You unlocked FREE Delivery!"}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="mt-2 w-full h-2 bg-sandalwood/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-saffron transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Items or Empty State */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {lines.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <MascotBasket size={150} />
                <h3 className="font-display text-2xl text-earthBrown mt-4">Your basket is waiting</h3>
                <p className="text-sm text-charcoal/70 mt-2 max-w-xs leading-relaxed">
                  Fill your home with authentic temple fragrances, pure camphor, and handcrafted agarbattis.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-saffron mt-6 px-6 py-3 rounded-md text-xs font-bold tracking-wider uppercase"
                >
                  Explore Sacred Essentials
                </button>
              </div>
            ) : (
              lines.map((line) => (
                <div
                  key={line.product.slug}
                  className="bg-sacredCream p-4 rounded-xl border border-antiqueGold/40 flex gap-4 items-center shadow-sm"
                >
                  <div className="w-16 h-16 bg-turmeric rounded-lg border border-earthBrown/20 flex items-center justify-center shrink-0">
                    <span className="text-2xl">🪔</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-lg text-earthBrown truncate">{line.product.name}</h4>
                    <p className="text-xs text-charcoal/60">{line.product.quantity}</p>
                    <p className="text-sm font-bold text-kumkum mt-1">₹{line.product.price}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => remove(line.product.slug)}
                      className="text-earthBrown/60 hover:text-kumkum p-1 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center border border-earthBrown/30 rounded-md bg-white">
                      <button
                        onClick={() => setQty(line.product.slug, line.qty - 1)}
                        className="p-1 px-2 text-earthBrown hover:bg-turmeric/30"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-2 text-xs font-bold text-charcoal">{line.qty}</span>
                      <button
                        onClick={() => setQty(line.product.slug, line.qty + 1)}
                        className="p-1 px-2 text-earthBrown hover:bg-turmeric/30"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {lines.length > 0 && (
            <div className="p-6 border-t border-antiqueGold/30 bg-sacredCream space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal/70">Total Items</span>
                <span className="font-bold text-earthBrown">{totalItems} items</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="font-display text-xl text-earthBrown">Subtotal</span>
                <span className="text-saffron">₹{subtotal}</span>
              </div>
              <p className="text-[11px] text-charcoal/60">Taxes and shipping calculated at checkout.</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-outline-earth py-3 text-center text-xs tracking-wider uppercase rounded-md flex items-center justify-center"
                >
                  View Basket
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-saffron py-3 text-center text-xs tracking-wider uppercase rounded-md flex items-center justify-center gap-1"
                >
                  Checkout <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
