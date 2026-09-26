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
        <div className="absolute left-3 top-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && (
            <span className="bg-[#9E1830] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.slug);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 z-10 p-2 rounded-full shadow-sm transition ${
            wishlisted
              ? "bg-[#9E1830] text-white"
              : "bg-white text-[#9E1830] hover:bg-[#9E1830] hover:text-white"
          }`}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-2.5 sm:p-4 lg:p-5">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs mb-1.5">
            <div className="flex text-[#F47A20]">
              <Star size={13} fill="currentColor" />
            </div>
            <span className="font-bold text-xs text-[#173B3A]">{product.rating}</span>
            <span className="text-[#173B3A]/60 text-[11px]">({product.reviewCount})</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="line-clamp-2 break-words font-heading text-xs font-bold leading-snug text-[#173B3A] transition group-hover:text-[#9E1830] sm:text-base lg:text-lg">
              {product.name}
            </h3>
          </Link>

          {/* Note */}
          <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-[#173B3A]/75 font-sans sm:text-xs">
            {product.note}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-3 flex min-w-0 items-center justify-between gap-1 border-t border-[#F47A20]/15 pt-3 sm:mt-4 sm:gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#9E1830] sm:text-lg">₹{product.price}</span>
              {product.mrp && <span className="text-[10px] text-[#173B3A]/50 line-through sm:text-xs">{product.mrp}</span>}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-[#3F7D45] tracking-wider uppercase block">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <button
            onClick={() => add(product)}
            className="inline-flex min-h-8 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#F47A20] px-2 py-2 text-[9px] font-bold text-white shadow-sm transition-all hover:bg-[#9E1830] sm:min-h-9 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:text-xs"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
