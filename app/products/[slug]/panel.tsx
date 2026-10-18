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
    <div className="space-y-4 pt-2">

      {/* ── PRICE ROW ── */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-3xl font-extrabold text-[#173b3a]">
          ₹{effectiveUnitPrice}
        </span>
        {singleItemDiscount > 0 ? (
          <span className="text-base text-[#292524]/40 line-through font-semibold">
            ₹{product.price}
          </span>
        ) : product.mrp ? (
          <span className="text-base text-[#292524]/40 line-through font-semibold">
            {product.mrp}
          </span>
        ) : null}
        {discountPercent > 0 && (
          <span className="rounded-full bg-[#e1edcf] px-2.5 py-0.5 text-xs font-extrabold text-[#286b45]">
            {discountPercent}% OFF
          </span>
        )}
        {singleItemDiscount > 0 && (
          <span className="rounded-full bg-[#e1edcf] px-2.5 py-0.5 text-xs font-extrabold text-[#286b45]">
            SAVE ₹{totalSavings}
          </span>
        )}
      </div>

      {/* ── QUANTITY + STOCK ROW ── */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-[#173b3a]">Quantity</span>
        <div className="inline-flex items-center border border-[#d5cfc4] rounded-lg bg-white overflow-hidden">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="px-3 py-2 text-[#6B4226] hover:bg-[#faf5e8] transition"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="px-4 py-2 text-sm font-semibold text-[#173b3a] border-x border-[#d5cfc4] tabular-nums min-w-[40px] text-center bg-[#faf8f2]">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="px-3 py-2 text-[#6B4226] hover:bg-[#faf5e8] transition"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        {product.inStock ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2D6A4F]" />
            In stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9E1830]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9E1830]" />
            Out of stock
          </span>
        )}
      </div>

      {/* ── SUBTOTAL (when qty > 1 or coupon applied) ── */}
      {(qty > 1 || singleItemDiscount > 0) && (
        <div className="flex items-center justify-between text-xs text-[#6B4226] bg-[#faf5e8] rounded-lg px-3.5 py-2 border border-[#e8e0d0]">
          <span className="font-medium">Subtotal for {qty} {qty > 1 ? "items" : "item"}:</span>
          <div className="flex items-baseline gap-1.5">
            {singleItemDiscount > 0 && (
              <span className="text-[#292524]/40 line-through">₹{totalOriginal}</span>
            )}
            <span className="font-bold text-[#173b3a]">₹{totalEffective}</span>
          </div>
        </div>
      )}

      {/* Product-Specific Coupon Offer */}
      {product.couponCode && (
        <div className="rounded-lg border border-dashed border-[#E85D04]/50 bg-[#FFF8E7] p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Tag size={15} className="text-[#E85D04] shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-[#6B4226]">Coupon: </span>
              <span className="font-mono font-bold text-[#9E1830] bg-[#FFF0D0] px-1.5 py-0.5 rounded text-[11px]">
                {product.couponCode}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleCoupon}
            className={`text-[11px] font-semibold px-3 py-1.5 rounded-md transition ${
              isThisCouponApplied
                ? "bg-[#2D6A4F] text-white"
                : "bg-[#E85D04] text-white hover:bg-[#d64e00]"
            }`}
          >
            {isThisCouponApplied ? "✓ Applied" : "Apply"}
          </button>
        </div>
      )}

      {/* ── CTA BUTTONS — clean, simple design ── */}
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_44px] items-center gap-2 pt-0.5 sm:gap-3">
        {/* Add to Cart — solid orange, simple rounded */}
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`flex h-11 w-full items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed sm:gap-2 sm:text-sm ${
            added
              ? "bg-[#2D6A4F] text-white"
              : "bg-[#E85D04] text-white hover:bg-[#d64e00]"
          }`}
        >
          {added ? (
            <>
              <Check size={16} /> Added!
            </>
          ) : (
            <>
              <ShoppingBag size={16} /> Add to Cart
            </>
          )}
        </button>

        {/* Buy Now — simple text/outlined style */}
        <button
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-[#d5cfc4] bg-white px-2 text-xs font-semibold text-[#173b3a] transition-colors hover:bg-[#faf5e8] disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm"
        >
          Buy Now <ArrowRight size={15} />
        </button>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.slug)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            wishlisted
              ? "bg-[#B23A48] border-[#B23A48] text-white"
              : "bg-white border-[#d5cfc4] text-[#6B4226] hover:bg-[#B23A48] hover:border-[#B23A48] hover:text-white"
          }`}
        >
          <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* ── TRUST BADGES — inline row ── */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[11px] sm:text-xs font-medium text-[#718078]">
        <span className="inline-flex items-center gap-1.5">
          <Truck size={14} className="text-[#2D6A4F]" />
          Free shipping on orders ₹499+
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Lock size={14} className="text-[#E85D04]" />
          Secure payment & easy returns
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#9E1830]" />
          Direct from artisans
        </span>
      </div>
    </div>
  );
}
