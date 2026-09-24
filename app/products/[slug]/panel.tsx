"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Minus, Heart, ShoppingBag, ArrowRight, Check, Sparkles } from "lucide-react";
import { useStore } from "@/components/store";
import type { Product } from "@/lib/products";

export function AddPanel({ product }: { product: Product }) {
  const router = useRouter();
  const { add, toggleWishlist, isInWishlist } = useStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const wishlisted = isInWishlist(product.slug);

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    add(product, qty);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6 pt-4 border-t border-[#C89B3C]/40">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-[#6B4226] uppercase tracking-wider">
          Quantity:
        </span>
        <div className="flex items-center border-2 border-[#6B4226]/30 rounded-lg bg-white overflow-hidden shadow-sm">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="p-2.5 px-3.5 text-[#6B4226] hover:bg-[#F4D35E]/30 transition"
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>
          <span className="px-4 text-sm font-bold text-[#292524]">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="p-2.5 px-3.5 text-[#6B4226] hover:bg-[#F4D35E]/30 transition"
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>
        </div>
        <span className="text-xs text-[#292524]/60">
          ({product.quantity})
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAdd}
          className="btn-saffron flex-1 py-4 px-6 rounded-md text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-solid-sm"
        >
          {added ? (
            <>
              <Check size={16} /> Added to Basket
            </>
          ) : (
            <>
              <ShoppingBag size={16} /> Add to Basket
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          className="bg-[#C89B3C] text-[#FFF8E7] hover:bg-[#6B4226] border-2 border-[#C89B3C] py-4 px-6 rounded-md text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition shadow-solid-sm"
        >
          <span>Buy Now</span>
          <ArrowRight size={15} />
        </button>

        <button
          onClick={() => toggleWishlist(product.slug)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`p-4 rounded-md border-2 transition flex items-center justify-center ${
            wishlisted
              ? "bg-[#B23A48] border-[#B23A48] text-white"
              : "bg-[#FFF8E7] border-[#C89B3C] text-[#6B4226] hover:bg-[#B23A48] hover:text-white"
          }`}
        >
          <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Trust reassurance below button */}
      <div className="bg-[#F4D35E]/20 p-3.5 rounded-lg border border-[#C89B3C]/30 flex items-center gap-2 text-xs font-semibold text-[#6B4226]">
        <Sparkles size={16} className="text-[#E85D04] shrink-0" />
        <span>Direct dispatch from Coimbatore • Free shipping over ₹499</span>
      </div>
    </div>
  );
}
