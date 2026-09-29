"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useStore } from "@/components/store";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { add, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.slug);

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
    <article className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
      {/* Top Image & Badge Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#fffaf0] flex items-center justify-center p-2 sm:aspect-[4/3] sm:p-4">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
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

        {/* Category / Bestseller Badge */}
        {product.badge && (
          <div className="absolute left-2.5 top-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#9E1830] shadow-xs border border-[#F6C84C]/50 backdrop-blur-xs">
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
          className={`absolute right-2.5 top-2.5 z-10 h-7 w-7 rounded-full flex items-center justify-center shadow-xs transition backdrop-blur-xs ${
            wishlisted
              ? "bg-[#9E1830] text-white"
              : "bg-white/90 text-[#173B3A]/70 hover:bg-[#9E1830] hover:text-white border border-[#F6C84C]/30"
          }`}
        >
          <Heart size={13} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-2.5 sm:p-4">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs mb-1">
            <div className="flex text-[#F47A20]">
              <Star size={11} fill="currentColor" />
            </div>
            <span className="font-bold text-[11px] sm:text-xs text-[#173B3A]">{product.rating}</span>
            <span className="text-[#173B3A]/50 text-[10px]">({product.reviewCount})</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="line-clamp-2 break-words font-heading text-xs min-[360px]:text-sm sm:text-base font-extrabold leading-snug text-[#173B3A] transition group-hover:text-[#9E1830]">
              {product.name}
            </h3>
          </Link>

          {/* Note */}
          <p className="mt-1 line-clamp-2 text-[10px] sm:text-[11px] leading-relaxed text-[#173B3A]/70 font-sans">
            {product.note}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-3 flex min-w-0 items-center justify-between gap-2 border-t border-[#F47A20]/15 pt-2.5">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-base sm:text-lg font-extrabold text-[#9E1830]">₹{product.price}</span>
              {product.mrp && <span className="text-[10px] text-[#173B3A]/50 line-through">{product.mrp}</span>}
            </div>
            {discountPercent > 0 && (
              <span className="text-[9px] font-bold text-[#3F7D45] tracking-wider uppercase block">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <button
            onClick={() => add(product)}
            className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl bg-[#F47A20] px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-extrabold text-white shadow-xs transition-all hover:bg-[#9E1830] active:scale-95 whitespace-nowrap"
          >
            <ShoppingBag size={13} /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
