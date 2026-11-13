"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Star, Tag } from "lucide-react";
import { useStore } from "@/components/store";
import { hasProductRating, type Product } from "@/lib/products";
import { SacredDiyaSvg } from "@/components/sacred-icons";

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
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
    <article className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-brand-border bg-white shadow-2xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      {/* Top Image: Balanced Square Aspect Ratio Frame - Clean Full-Bleed with Rounded Corners */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-t-2xl border-b border-brand-border/70 bg-brand-surface-warm/30">
        <Link href={`/product/${product.slug}`} className="relative block h-full w-full overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes("hm_glory_agarbatti")) {
                  target.src = "/images/products/hm_glory_agarbatti.jpg";
                }
              }}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#F5EFE3] to-[#FFFDF8] p-4 text-center select-none">
              <SacredDiyaSvg className="h-11 w-11 text-brand-primary/80 transition transform group-hover:scale-110" />
              <p className="mt-2.5 font-sans text-xs font-bold tracking-widest text-brand-primary uppercase">
                HM PURITY
              </p>
              <p className="font-sans text-[11px] text-brand-slate mt-0.5">{product.subCategory || product.category || "Devotional Essentials"}</p>
            </div>
          )}
        </Link>

        {/* Floating Subtle Product Badge */}
        {product.badge && (
          <div className="absolute left-2.5 top-2.5 z-10 max-w-[calc(100%-3.5rem)] pointer-events-none sm:left-3 sm:top-3">
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-brand-primary shadow-xs border border-brand-border/80">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
              <span className="truncate">{product.badge}</span>
            </span>
          </div>
        )}

        {/* Floating Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.slug);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-2.5 top-2.5 z-10 h-8 w-8 sm:right-3 sm:top-3 sm:h-9 sm:w-9 rounded-full flex items-center justify-center transition-all duration-200 border shadow-xs cursor-pointer ${
            wishlisted
              ? "bg-brand-primary text-white border-brand-primary scale-105"
              : "bg-white/95 backdrop-blur-md text-brand-heading border-brand-border/80 hover:bg-brand-primary hover:text-white hover:border-brand-primary hover:scale-105 active:scale-95"
          }`}
        >
          <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          {/* Rating (Render only if real backend rating & reviews exist) */}
          {hasProductRating(product) ? (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm mb-1.5">
              <div className="flex text-brand-accent">
                <Star size={13} fill="currentColor" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-brand-heading">{product.rating.toFixed(1)}</span>
              <span className="text-brand-slate text-xs font-medium">({product.reviewCount})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-brand-forest font-semibold mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-forest" />
              <span>Pure Sacred Purity</span>
            </div>
          )}

          {/* Title - Manrope 16px Semibold */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="break-words font-sans text-[15px] sm:text-[16px] font-semibold tracking-normal leading-snug text-brand-heading transition-colors group-hover:text-brand-primary line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Note / Subtitle */}
          <p className="mt-1 text-xs leading-relaxed text-brand-slate font-sans font-normal line-clamp-2">
            {product.note}
          </p>
          {Boolean(product.bundleQuantity && product.bundleQuantity > 1) && (
            <p className="mt-1 text-[11px] font-semibold text-brand-primary">
              {product.bundleQuantity}-Box Bundle · ₹{Math.round(effectivePrice / (product.bundleQuantity || 1))}/box
            </p>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-3 flex min-w-0 items-center justify-between gap-2 pt-2 border-t border-brand-border/60">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              {effectivePrice > 0 ? (
                <span className="font-sans font-bold text-[17px] sm:text-[18px] text-brand-primary tracking-tight">
                  ₹{effectivePrice}
                </span>
              ) : (
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-primary">
                  {product.subCategory?.toLowerCase().includes("exclusive") ? "Exclusive" : "Price on Request"}
                </span>
              )}
              {product.mrp && product.mrp !== `₹${product.price}` && (
                <span className="font-sans text-xs font-medium text-brand-slate line-through">
                  {product.mrp}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              if (!product.inStock) return;
              add(product);
              router.push("/cart");
            }}
            disabled={!product.inStock}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-brand-primary hover:bg-brand-hover border border-brand-accent/40 px-3.5 sm:px-4 py-2 font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider text-white transition-all duration-200 shadow-2xs hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <ShoppingBag size={14} />
            <span>{product.inStock ? "Add" : "Sold Out"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
