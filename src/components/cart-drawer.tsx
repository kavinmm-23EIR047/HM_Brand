"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Sparkles, Tag } from "lucide-react";
import { useStore } from "@/components/store";
import { MascotBasket } from "@/components/mascot-art";
import { SHIPPING_CONFIG } from "@/lib/shipping";

export function CartDrawer() {
  const {
    lines,
    isCartOpen,
    setIsCartOpen,
    setQty,
    remove,
    subtotal,
    totalItems,
    appliedCoupon,
    couponDiscount,
    cartCouponCodes,
    applyCoupon,
    removeCoupon,
  } = useStore();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = SHIPPING_CONFIG.freeDeliveryThreshold;
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

      <div className="fixed inset-y-0 right-0 flex w-full max-w-full justify-end">
        <aside className="flex h-[100dvh] w-full max-w-md flex-col justify-between bg-sacredCream text-charcoal shadow-2xl">
          {/* Header */}
          <div className="border-b border-antiqueGold/30 bg-turmeric/20 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-2.5">
                <ShoppingBag className="text-saffron" size={24} />
                <h2 className="truncate font-brand text-lg font-bold uppercase tracking-wider text-earthBrown sm:text-xl">Your Sacred Basket</h2>
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
            <div className="mt-4 rounded-lg bg-white/80 p-3">
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs font-semibold text-earthBrown">
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
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {lines.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <MascotBasket size={150} />
                <h3 className="font-display text-2xl text-earthBrown mt-4">Your basket is waiting</h3>
                <p className="text-sm text-charcoal/70 mt-2 max-w-xs leading-relaxed">
                  Fill your home with authentic temple fragrances, pure camphor, and handcrafted agarbattis.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-saffron mt-6 min-h-12 whitespace-nowrap rounded-lg px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-sm sm:text-sm"
                >
                  Explore Sacred Essentials
                </button>
              </div>
            ) : (
              lines.map((line) => (
                <div
                  key={line.product.slug}
                  className="flex items-center gap-3 rounded-xl bg-white/90 p-3.5 shadow-sm border border-antiqueGold/20 sm:gap-4 sm:p-4"
                >
                  <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-lg bg-white border border-brand-gold/30 overflow-hidden p-1 shadow-2xs flex items-center justify-center">
                    {line.product.image ? (
                      <Image
                        src={line.product.image}
                        alt={line.product.name}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-2xl">🪔</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-brand text-sm font-bold text-earthBrown truncate sm:text-base">{line.product.name}</h4>
                    <p className="text-xs text-charcoal/70">{line.product.quantity}</p>
                    <p className="font-price text-base font-bold text-kumkum mt-1 tabular-nums">₹{line.product.price}</p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <button
                      onClick={() => remove(line.product.slug)}
                      className="text-earthBrown/60 hover:text-kumkum p-1 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center rounded-lg bg-white ring-1 ring-stone-200">
                      <button
                        onClick={() => setQty(line.product.slug, line.qty - 1)}
                        className="p-1 px-2.5 text-earthBrown hover:bg-turmeric/30"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-price px-2.5 text-sm font-bold text-charcoal tabular-nums">{line.qty}</span>
                      <button
                        onClick={() => setQty(line.product.slug, line.qty + 1)}
                        className="p-1 px-2.5 text-earthBrown hover:bg-turmeric/30"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {lines.length > 0 && (
            <div className="space-y-3 border-t border-antiqueGold/30 bg-sacredCream p-4 sm:p-6">
              {/* Available Item Coupons Prompt */}
              {cartCouponCodes.length > 0 && !appliedCoupon && (
                <div className="flex items-center justify-between gap-2 rounded-lg bg-brand-surface p-2.5 text-xs">
                  <div className="flex items-center gap-1.5 text-brand-brown">
                    <Tag size={13} className="text-brand-saffron-dark shrink-0" />
                    <span>Eligible coupon: <strong className="font-mono text-brand-primary">{cartCouponCodes[0]}</strong></span>
                  </div>
                  <button
                    onClick={() => applyCoupon(cartCouponCodes[0])}
                    className="rounded bg-brand-saffron-dark px-2 py-0.5 text-ui-10 font-bold text-white uppercase hover:bg-brand-primary transition"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Applied Coupon Tag */}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-brand-green bg-[#E1EDCF]/70 px-2.5 py-1.5 rounded-lg">
                  <span className="flex items-center gap-1 font-bold">
                    <Tag size={12} /> Coupon ({appliedCoupon.code})
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-price font-extrabold tabular-nums">-₹{couponDiscount}</span>
                    <button
                      onClick={removeCoupon}
                      className="text-brand-primary hover:underline text-ui-10 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-base font-medium">
                <span className="text-charcoal/80">Total Items</span>
                <span className="font-bold text-earthBrown">{totalItems} items</span>
              </div>

              <div className="flex items-center justify-between text-base font-medium">
                <span className="text-charcoal/80">Subtotal</span>
                <span className="font-price font-bold text-earthBrown tabular-nums">₹{subtotal}</span>
              </div>

              {appliedCoupon && couponDiscount > 0 && (
                <div className="flex items-center justify-between text-base text-brand-green font-semibold">
                  <span>Discount</span>
                  <span className="font-price font-bold tabular-nums">-₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-antiqueGold/25">
                <span className="font-brand text-lg text-earthBrown sm:text-xl uppercase tracking-wider">Estimated Total</span>
                <span className="font-price text-2xl font-extrabold text-brand-primary tabular-nums">₹{Math.max(0, subtotal - couponDiscount)}</span>
              </div>
              <p className="text-xs text-charcoal/70">Taxes and shipping calculated at checkout.</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-outline-earth flex min-h-12 items-center justify-center whitespace-nowrap rounded-lg px-3 py-3 text-center text-xs font-bold uppercase tracking-wider shadow-sm sm:text-sm"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-saffron flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-3 text-center text-xs font-bold uppercase tracking-wider shadow-sm sm:text-sm"
                >
                  Review Basket <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
