"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Tag } from "lucide-react";
import { useStore } from "@/components/store";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { add, toggleWishlist, isInWishlist, appliedCoupon } = useStore();
  const wishlisted = isInWishlist(product.slug);

  const isCouponAppliedForProduct = Boolean(
    product.couponCode && appliedCoupon?.code.toUpperCase() === product.couponCode.toUpperCase()
  );

  let singleDiscount = 0;
  if (isCouponAppliedForProduct && appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      singleDiscount = Math.round((product.price * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      singleDiscount = Math.min(product.price, appliedCoupon.discountAmount);
    }
  }

  const effectivePrice = Math.max(0, product.price - singleDiscount);

  const discountPercent =
    product.mrp && product.price
      ? Math.max(
          0,
          Math.round(
            ((parseFloat(product.mrp.replace(/[^0-9.]/g, "")) - product.price) /
              parseFloat(product.mrp.replace(/[^0-9.]/g, ""))) *
              100
          )
        )
      : 0;

  return (
    <article className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl bg-white/80 p-3 transition-all duration-300 hover:bg-white hover:shadow-card hover:-translate-y-1">
      {/* Top Image & Badge Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#FAF3E0]/60 flex items-center justify-center p-3 sm:p-4">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes("media_1790142713668")) {
                  target.src = "/images/media_1790142713668.jpg";
                }
              }}
            />
          ) : (
            <div className="text-center text-[#173B3A] select-none p-4">
              <span className="text-4xl block transition transform group-hover:scale-110">🪔</span>
              <p className="mt-2 font-space text-[10px] font-bold tracking-widest text-[#9E1830] uppercase">
                HM AGARBATTIS
              </p>
              <p className="text-xs font-semibold text-[#173B3A] mt-0.5">{product.subCategory || product.category}</p>
            </div>
          )}
        </Link>

        {/* Badge */}
        {product.badge && (
          <div className="absolute left-2.5 top-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#9E1830] backdrop-blur-xs shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9E1830]" />
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.slug);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-2.5 top-2.5 z-10 h-7 w-7 rounded-full flex items-center justify-center transition backdrop-blur-xs ${
            wishlisted
              ? "bg-[#9E1830] text-white"
              : "bg-white/90 text-[#173B3A]/70 hover:bg-[#9E1830] hover:text-white"
          }`}
        >
          <Heart size={13} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex min-w-0 flex-1 flex-col justify-between pt-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs mb-1">
            <div className="flex text-[#F47A20]">
              <Star size={11} fill="currentColor" />
            </div>
            <span className="font-bold text-[11px] text-[#173B3A]">{product.rating}</span>
            <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="line-clamp-2 break-words font-heading text-sm sm:text-base font-bold leading-snug text-[#173B3A] transition group-hover:text-[#9E1830]">
              {product.name}
            </h3>
          </Link>

          {/* Note / Subtitle */}
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#52625A] font-sans">
            {product.note}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-3.5 flex min-w-0 items-center justify-between gap-2 pt-2 border-t border-stone-100">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              {effectivePrice > 0 ? (
                <span className="font-price font-extrabold text-base sm:text-lg text-[#9E1830] tracking-tight">
                  ₹{effectivePrice}
                </span>
              ) : (
                <span className="font-heading text-xs font-bold text-[#9E1830]">
                  {product.subCategory?.toLowerCase().includes("exclusive") ? "Exclusive Edition" : "Price on Request"}
                </span>
              )}
              {product.mrp && product.mrp !== `₹${product.price}` && (
                <span className="font-price text-[11px] font-medium text-stone-400 line-through">
                  {product.mrp}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => product.inStock && add(product)}
            disabled={!product.inStock}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#173B3A] px-3.5 py-1.5 text-xs font-medium text-white transition-all hover:bg-[#9E1830] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag size={12} />
            <span>{product.inStock ? "Add" : "Sold Out"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
