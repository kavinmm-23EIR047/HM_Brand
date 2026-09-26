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
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
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
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2">
        <button
          onClick={handleAdd}
          className="btn-saffron flex min-h-11 min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-md px-1.5 py-3 text-[9px] font-bold uppercase tracking-normal shadow-solid-sm min-[360px]:gap-1.5 min-[360px]:px-2 min-[360px]:text-[10px] sm:px-4 sm:text-xs sm:tracking-wide"
        >
          {added ? (
            <>
              <Check size={14} /> <span className="hidden min-[360px]:inline">Added to Basket</span><span className="min-[360px]:hidden">Added</span>
            </>
          ) : (
            <>
              <ShoppingBag size={14} /> <span className="hidden min-[360px]:inline">Add to Basket</span><span className="min-[360px]:hidden">Add</span>
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          className="flex min-h-11 min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-md border-2 border-[#C89B3C] bg-[#C89B3C] px-1.5 py-3 text-[9px] font-bold uppercase tracking-normal text-[#FFF8E7] shadow-solid-sm transition hover:bg-[#6B4226] min-[360px]:gap-1.5 min-[360px]:px-2 min-[360px]:text-[10px] sm:px-4 sm:text-xs sm:tracking-wide"
        >
          <span className="hidden min-[360px]:inline">Buy Now</span><span className="min-[360px]:hidden">Buy</span>
          <ArrowRight size={14} />
        </button>

        <button
          onClick={() => toggleWishlist(product.slug)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`flex min-h-11 min-w-10 items-center justify-center rounded-md border-2 p-2 transition sm:p-4 ${
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
