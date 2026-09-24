"use client";

import React from "react";
import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
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
    <article className="group relative bg-sacredCream rounded-xl border-2 border-antiqueGold/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-earthBrown hover:shadow-solid-sm">
      {/* Top Image & Badge Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-turmeric/30 border-b border-antiqueGold/30 flex items-center justify-center p-6">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="text-center text-earthBrown select-none">
              <span className="text-4xl block transition transform group-hover:scale-110">🪔</span>
              <p className="mt-2 text-[10px] font-bold tracking-[0.2em] text-kumkum">HM AGARBATTIS</p>
              <p className="text-xs font-semibold text-earthBrown mt-0.5">{product.subCategory || product.category}</p>
            </div>
          )}
        </Link>

        {/* Category / Bestseller Badge */}
        <div className="absolute left-3 top-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && (
            <span className="bg-saffron text-sacredCream text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
              {product.badge}
            </span>
          )}
          <span className="bg-sacredCream text-earthBrown border border-antiqueGold text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.slug);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 z-10 p-2 rounded-full border transition ${
            wishlisted
              ? "bg-kumkum border-kumkum text-white"
              : "bg-sacredCream border-antiqueGold text-earthBrown hover:bg-kumkum hover:text-white"
          }`}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-earthBrown mb-1.5">
            <div className="flex text-saffron">
              <Star size={12} fill="currentColor" />
            </div>
            <span className="font-bold text-xs">{product.rating}</span>
            <span className="text-charcoal/50 text-[11px]">({product.reviewCount})</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-display text-xl sm:text-2xl text-earthBrown font-semibold leading-snug group-hover:text-saffron transition">
              {product.name}
            </h3>
          </Link>

          {/* Note */}
          <p className="text-xs text-charcoal/75 mt-1.5 line-clamp-2 leading-relaxed font-sans">
            {product.note}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-3 border-t border-antiqueGold/30 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-earthBrown">₹{product.price}</span>
              {product.mrp && <span className="text-xs text-charcoal/50 line-through">{product.mrp}</span>}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-tulsi tracking-wider uppercase">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <button
            onClick={() => add(product)}
            className="btn-saffron px-3.5 py-2 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <Plus size={14} /> ADD
          </button>
        </div>
      </div>
    </article>
  );
}
