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
    <article className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-brand-border bg-white shadow-2xs hover:border-brand-primary hover:shadow-md transition-all duration-300">
      {/* Top Image & Badge Container - Full Width Uncropped */}
      <div className="relative aspect-square w-full overflow-hidden bg-brand-surface-soft border-b border-brand-border/70 flex items-center justify-center p-2.5 sm:p-3.5">
        <Link href={`/product/${product.slug}`} className="flex h-full w-full items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes("hm_glory_agarbatti")) {
                  target.src = "/images/products/hm_glory_agarbatti.jpg";
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center text-center text-brand-ink select-none p-4">
              <SacredDiyaSvg className="h-11 w-11 transition transform group-hover:scale-110" />
              <p className="mt-2.5 font-space text-ui-11 font-bold tracking-widest text-brand-primary uppercase">
                HM AGARBATTIS
              </p>
              <p className="text-xs font-semibold text-brand-ink mt-0.5">{product.subCategory || product.category}</p>
            </div>
          )}
        </Link>

        {/* Badge */}
        {product.badge && (
          <div className="absolute left-2.5 top-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-ui-11 sm:text-xs font-bold uppercase tracking-wider text-brand-primary shadow-xs border border-brand-border">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
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
          className={`absolute right-2.5 top-2.5 z-10 h-9 w-9 rounded-full flex items-center justify-center transition border shadow-2xs ${
            wishlisted
              ? "bg-brand-primary text-white border-brand-primary"
              : "bg-white text-brand-ink/80 border-brand-border hover:bg-brand-primary hover:text-white hover:border-brand-primary"
          }`}
        >
          <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          {/* Rating (Render only if real backend rating & reviews exist) */}
          {hasProductRating(product) ? (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm mb-1.5">
              <div className="flex text-[#F47A20]">
                <Star size={13} fill="currentColor" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-[#111827]">{product.rating.toFixed(1)}</span>
              <span className="text-[#4B5563] text-xs font-medium">({product.reviewCount})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-[#287541] font-semibold mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#287541]" />
              <span>Pure Sacred Purity</span>
            </div>
          )}

          {/* Title - Logo font family (Cinzel / LA LUXES SERIF) */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="break-words font-brand text-xs sm:text-sm font-bold uppercase tracking-wider leading-snug text-brand-heading transition group-hover:text-brand-primary">
              {product.name}
            </h3>
          </Link>

          {/* Note / Subtitle - Crisp high contrast */}
          <p className="mt-1 text-xs leading-relaxed text-brand-gray font-sans font-normal">
            {product.note}
          </p>
          {Boolean(product.bundleQuantity && product.bundleQuantity > 1) && (
            <p className="mt-1 text-[11px] font-semibold text-[#9E1830]">
              {product.bundleQuantity}-Box Bundle · ₹{Math.round(effectivePrice / (product.bundleQuantity || 1))}/box
            </p>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-3 flex min-w-0 items-center justify-between gap-2 pt-2 border-t border-brand-surface-soft">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              {effectivePrice > 0 ? (
                <span className="font-brand font-bold text-sm sm:text-base text-brand-primary tracking-tight">
                  ₹{effectivePrice}
                </span>
              ) : (
                <span className="font-brand text-ui-11 sm:text-xs font-bold uppercase tracking-wider text-brand-primary">
                  {product.subCategory?.toLowerCase().includes("exclusive") ? "Exclusive" : "Price on Request"}
                </span>
              )}
              {product.mrp && product.mrp !== `₹${product.price}` && (
                <span className="font-sans text-ui-11 sm:text-xs font-medium text-brand-gray line-through">
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
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand-primary hover:bg-brand-hover px-4 py-2 font-brand text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all shadow-2xs active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <ShoppingBag size={14} />
            <span>{product.inStock ? "Add" : "Sold Out"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
