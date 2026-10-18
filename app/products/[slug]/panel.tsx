"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Minus, Heart, ShoppingBag, ArrowRight, Check, Tag, Truck, Lock, Sparkles } from "lucide-react";
import { useStore } from "@/components/store";
import type { Product } from "@/lib/products";

export function AddPanel({ product }: { product: Product }) {
  const router = useRouter();
  const { lines, add, toggleWishlist, isInWishlist, appliedCoupon, applyCoupon, removeCoupon, subtotal } = useStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
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
  const totalEffective = effectiveUnitPrice * qty;
  const totalOriginal = product.price * qty;
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
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    if (product.couponCode && !appliedCoupon) {
      await applyCoupon(product.couponCode, Math.max(subtotal, product.price * qty));
    }
    add(product, qty);
    router.push("/checkout");
  };

  return (
    <div className="space-y-5 pt-3">
      {/* ── PRICE & SAVINGS ── */}
      <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
        <span className="font-price text-3xl sm:text-4xl font-extrabold tracking-tight text-[#9E1830]">
          ₹{effectiveUnitPrice}
        </span>
        {singleItemDiscount > 0 ? (
          <span className="font-price text-base text-stone-400 line-through font-medium">
            ₹{product.price}
          </span>
        ) : product.mrp ? (
          <span className="font-price text-base text-stone-400 line-through font-medium">
            {product.mrp}
          </span>
        ) : null}
        {discountPercent > 0 && (
          <span className="font-heading text-xs font-bold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2.5 py-0.5 rounded-full">
            {discountPercent}% OFF
          </span>
        )}
        {singleItemDiscount > 0 && (
          <span className="font-heading text-xs font-bold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2.5 py-0.5 rounded-full">
            Save ₹{totalSavings}
          </span>
        )}
      </div>

      {/* ── QUANTITY & STOCK STATUS ── */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex items-center rounded-full bg-[#FAF3E0] px-2 py-1">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#6B4226] hover:bg-white/80 transition"
            aria-label="Decrease quantity"
          >
            <Minus size={13} />
          </button>
          <span className="font-price px-3.5 text-sm font-bold text-[#173B3A] tabular-nums min-w-[32px] text-center">
            {qty}
          </span>
          <button
            onClick={() => setQty(qty + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#6B4226] hover:bg-white/80 transition"
            aria-label="Increase quantity"
          >
            <Plus size={13} />
          </button>
        </div>

        {product.inStock ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2D6A4F]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2D6A4F]" />
            In stock & ready to ship
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9E1830]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9E1830]" />
            Currently out of stock
          </span>
        )}

        {(qty > 1 || singleItemDiscount > 0) && (
          <span className="text-xs text-stone-500 ml-auto">
            Total: <strong className="font-price text-[#173B3A] font-bold">₹{totalEffective}</strong>
          </span>
        )}
      </div>

      {/* ── REFINED INLINE COUPON ── */}
      {product.couponCode && (
        <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-[#FAF3E0]/60 text-[#6B4226]">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#F47A20]" />
            <span>
              Special offer code <strong className="font-mono text-[#9E1830]">{product.couponCode}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleCoupon}
            className="font-semibold text-xs text-[#9E1830] hover:underline transition"
          >
            {isThisCouponApplied ? "✓ Applied" : "Apply Code"}
          </button>
        </div>
      )}

      {/* ── CTA ACTIONS ── */}
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_48px] items-center gap-3 pt-1">
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-3 text-sm font-semibold transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${
            added
              ? "bg-[#2D6A4F] text-white"
              : "bg-[#9E1830] text-white hover:bg-[#851227] active:scale-[0.99]"
          }`}
        >
          {added ? (
            <>
              <Check size={16} /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag size={16} /> Add to Cart
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#173B3A] text-white px-3 text-sm font-semibold transition-all hover:bg-[#1f4a49] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy Now <ArrowRight size={15} />
        </button>

        <button
          onClick={() => toggleWishlist(product.slug)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all ${
            wishlisted
              ? "bg-[#9E1830] text-white"
              : "bg-[#FAF3E0] text-[#173B3A] hover:bg-[#9E1830] hover:text-white"
          }`}
        >
          <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* ── CLEAN INLINE TRUST ROW ── */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-stone-500">
        <span className="inline-flex items-center gap-1.5">
          <Truck size={14} className="text-[#2D6A4F]" />
          Free delivery on ₹499+
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock size={14} className="text-[#6B4226]" />
          Secure checkout
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#F47A20]" />
          Handmade in Tamil Nadu
        </span>
      </div>
    </div>
  );
}
