"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Minus, Heart, ShoppingBag, Tag, Truck, Lock, Sparkles } from "lucide-react";
import { useStore } from "@/components/store";
import type { Product } from "@/lib/products";

export function AddPanel({ product }: { product: Product }) {
  const router = useRouter();
  const { lines, add, toggleWishlist, isInWishlist, appliedCoupon, applyCoupon, removeCoupon, subtotal } = useStore();
  const [qty, setQty] = useState(1);
  const wishlisted = isInWishlist(product.slug);

  const isThisCouponApplied = Boolean(
    product.couponCode && appliedCoupon?.code.toUpperCase() === product.couponCode.toUpperCase()
  );

  let singleItemDiscount = 0;
  if (isThisCouponApplied && appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      singleItemDiscount = Math.round((product.price * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      singleItemDiscount = Math.min(product.price, appliedCoupon.discountAmount);
    }
  }

  const effectiveUnitPrice = Math.max(0, product.price - singleItemDiscount);
  const totalSavings = singleItemDiscount * qty;

  const mrpNum = product.mrp ? parseFloat(product.mrp.replace(/[^0-9.]/g, "")) : 0;
  const discountPercent = mrpNum > product.price
    ? Math.round(((mrpNum - product.price) / mrpNum) * 100)
    : 0;

  const handleToggleCoupon = async () => {
    if (!product.couponCode) return;
    if (isThisCouponApplied) {
      removeCoupon();
    } else {
      const inCart = lines.some((l) => l.product.slug === product.slug);
      if (!inCart) {
        add(product, qty);
      }
      await applyCoupon(product.couponCode, Math.max(subtotal, product.price * qty));
    }
  };

  const handleAdd = () => {
    add(product, qty);
    router.push("/cart");
  };

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-surface-alt/60 p-4 sm:p-5.5 space-y-4 sm:space-y-5 shadow-2xs">
      {/* ── PRICE & STOCK ROW ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-brand text-3xl sm:text-4xl font-extrabold tracking-tight text-[#9E1830]">
            ₹{effectiveUnitPrice}
          </span>
          {singleItemDiscount > 0 ? (
            <span className="font-sans text-base sm:text-lg text-stone-400 line-through font-medium">
              ₹{product.price}
            </span>
          ) : mrpNum > product.price ? (
            <span className="font-sans text-base sm:text-lg text-stone-400 line-through font-medium">
              ₹{mrpNum}
            </span>
          ) : null}
          {discountPercent > 0 && (
            <span className="font-space text-xs font-bold text-[#287541] bg-[#EAF5EC] border border-[#287541]/25 px-2.5 py-0.5 rounded-full">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* In Stock & Ready to Ship Pill */}
        <div>
          {product.inStock ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#287541] bg-[#EAF5EC] border border-[#287541]/30 px-3.5 py-1 rounded-full shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#287541] animate-pulse" />
              In Stock &amp; Ready to Ship
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9E1830] bg-[#FFF5F5] border border-[#9E1830]/30 px-3.5 py-1 rounded-full shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#9E1830]" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Coupon banner if available */}
      {product.couponCode && (
        <div className="flex items-center justify-between text-xs py-2 px-3.5 rounded-xl bg-[#FFF9EE] border border-[#F6C84C]/70 text-[#6B4226]">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#F47A20]" />
            <span>
              Use coupon <strong className="font-mono text-[#9E1830] font-bold">{product.couponCode}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleCoupon}
            className="font-bold text-xs text-[#9E1830] hover:text-[#7A1225] transition underline underline-offset-2 cursor-pointer"
          >
            {isThisCouponApplied ? "✓ Applied" : "Apply"}
          </button>
        </div>
      )}

      {/* ── QUANTITY SELECTOR ROW ── */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-[#173B3A] uppercase tracking-wider">
          Quantity:
        </span>
        <div className="inline-flex items-center h-10 rounded-xl bg-white border border-[#EADBBD] shadow-2xs p-1">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#173B3A] hover:bg-[#FAF7EE] hover:text-[#9E1830] transition active:scale-90 cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="font-sans px-4 text-sm sm:text-base font-bold text-[#173B3A] tabular-nums min-w-[36px] text-center select-none">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty(qty + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#173B3A] hover:bg-[#FAF7EE] hover:text-[#9E1830] transition active:scale-90 cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Add to cart leads to basket review before checkout. */}
      {/* Hidden on mobile to avoid duplicates with the fixed floating bottom bar */}
      <div className="hidden md:grid grid-cols-[1fr_52px] items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl bg-brand-primary px-5 text-sm font-brand font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-brand-hover hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag size={19} /> Add to Cart
        </button>

        <button
          type="button"
          onClick={() => toggleWishlist(product.slug)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border transition-all shadow-2xs hover:shadow-sm cursor-pointer active:scale-[0.98] ${
            wishlisted
              ? "bg-[#9E1830] text-white border-[#9E1830]"
              : "bg-white text-[#173B3A] border-[#EADBBD] hover:border-[#9E1830] hover:text-[#9E1830]"
          }`}
        >
          <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* ── MICRO TRUST ROW ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs sm:text-[13px] font-semibold text-[#173B3A]/90 border-t border-[#EADBBD]/60">
        <span className="inline-flex items-center gap-1.5">
          <Truck size={15} className="text-[#173B3A]" />
          Free delivery on orders
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock size={15} className="text-[#9E1830]" />
          100% Secure Checkout
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles size={15} className="text-[#9E1830]" />
          Pure Botanicals
        </span>
      </div>

      {/* ── MOBILE FLOATING ACTION BAR (CLEAN, PROPERLY PLACED BUTTONS ONLY) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-[#EADBBD] px-4 py-3 shadow-[0_-8px_25px_rgba(0,0,0,0.12)] pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2.5 max-w-md mx-auto w-full">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-primary px-3 text-xs font-brand font-bold uppercase tracking-wider text-white shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <ShoppingBag size={16} />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            onClick={() => toggleWishlist(product.slug)}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors shadow-2xs active:scale-95 ${
              wishlisted
                ? "bg-[#9E1830] text-white border-[#9E1830]"
                : "bg-white text-[#173B3A] border-[#EADBBD]"
            }`}
          >
            <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}
