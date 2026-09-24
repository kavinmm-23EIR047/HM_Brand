"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Tag } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { MascotBasket } from "@/components/mascot-art";
import { useStore } from "@/components/store";

export default function CartPage() {
  const { lines, setQty, remove, clear, subtotal, totalItems } = useStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const freeDeliveryThreshold = 499;
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const amountLeft = freeDeliveryThreshold - subtotal;
  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shippingFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : 50;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "HMDEVOTION" || couponCode.trim().toUpperCase() === "DIVINE10") {
      setCouponApplied(true);
    } else {
      alert("Please enter a valid coupon code (Try: HMDEVOTION or DIVINE10)");
    }
  };

  return (
    <InnerPage
      eyebrow="YOUR SACRED BASKET"
      title="Review Your Sacred Selection"
      subtitle="Verify your chosen products, adjust quantities, and proceed to secure checkout."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {lines.length === 0 ? (
          <div className="bg-[#FFF8E7] rounded-3xl border-2 border-[#C89B3C] p-12 sm:p-16 text-center max-w-2xl mx-auto shadow-solid-sm flex flex-col items-center">
            <MascotBasket size={180} />
            <h2 className="font-display text-3xl sm:text-4xl text-[#6B4226] font-bold mt-6">
              Your ritual basket is waiting
            </h2>
            <p className="text-sm text-[#292524]/75 mt-3 max-w-md font-sans leading-relaxed">
              Explore our handcrafted collections of incense sticks, pure camphor, and traditional sambrani to fill your home with divine fragrance.
            </p>
            <Link
              href="/shop"
              className="btn-saffron mt-8 px-8 py-4 rounded-md text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-solid-sm"
            >
              <span>Discover Fragrances</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Products List (Left) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Delivery Meter */}
              <div className="bg-[#F4D35E]/25 p-4 rounded-xl border border-[#C89B3C]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#6B4226]">
                  <Sparkles size={16} className="text-[#E85D04]" />
                  <span>
                    {amountLeft > 0
                      ? `Add ₹${amountLeft} more to unlock FREE Delivery!`
                      : "🎉 Congratulations! You have unlocked FREE Delivery across India."}
                  </span>
                </div>
                <div className="w-full sm:w-36 h-2 bg-[#A67C52]/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E85D04] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-[#FFF8E7] rounded-2xl border-2 border-[#C89B3C]/40 overflow-hidden shadow-sm divide-y divide-[#C89B3C]/20">
                {lines.map((line) => (
                  <div
                    key={line.product.slug}
                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-[#F4D35E]/40 rounded-xl border border-[#6B4226]/20 flex items-center justify-center text-3xl shrink-0">
                        🪔
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#E85D04] uppercase tracking-wider">
                          {line.product.category}
                        </span>
                        <h3 className="font-display text-xl text-[#6B4226] font-bold">
                          <Link href={`/product/${line.product.slug}`} className="hover:text-[#E85D04]">
                            {line.product.name}
                          </Link>
                        </h3>
                        <p className="text-xs text-[#292524]/60">{line.product.quantity}</p>
                        <p className="text-sm font-bold text-[#B23A48] mt-1">
                          ₹{line.product.price}{" "}
                          <span className="text-xs font-normal text-[#292524]/50">each</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#6B4226]/30 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => setQty(line.product.slug, line.qty - 1)}
                          className="p-2 text-[#6B4226] hover:bg-[#F4D35E]/30"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#292524]">{line.qty}</span>
                        <button
                          onClick={() => setQty(line.product.slug, line.qty + 1)}
                          className="p-2 text-[#6B4226] hover:bg-[#F4D35E]/30"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-sm font-bold text-[#6B4226]">
                          ₹{line.product.price * line.qty}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => remove(line.product.slug)}
                        className="text-[#6B4226]/50 hover:text-[#B23A48] p-1.5 transition"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions below cart table */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/shop"
                  className="text-xs font-bold text-[#6B4226] hover:text-[#E85D04] uppercase tracking-wider flex items-center gap-1.5"
                >
                  ← Continue Shopping
                </Link>
                <button
                  onClick={clear}
                  className="text-xs font-semibold text-[#B23A48] hover:underline"
                >
                  Clear Entire Basket
                </button>
              </div>
            </div>

            {/* Order Summary Box (Right) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#FFF8E7] p-6 rounded-2xl border-2 border-[#6B4226] shadow-solid-sm space-y-5">
                <h3 className="font-display text-2xl text-[#6B4226] font-bold border-b border-[#C89B3C]/30 pb-4">
                  Order Summary
                </h3>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-xs font-bold text-[#6B4226] uppercase tracking-wider block">
                    Have an Auspicious Coupon?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. HMDEVOTION"
                      className="flex-1 text-xs bg-white border border-[#C89B3C] rounded-lg px-3 py-2 text-[#292524] uppercase outline-[#E85D04]"
                    />
                    <button
                      type="submit"
                      className="btn-outline-earth px-3 py-2 text-xs font-bold rounded-lg uppercase tracking-wider"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[11px] font-bold text-[#588157]">
                      ✓ 10% Devotion discount applied!
                    </p>
                  )}
                </form>

                {/* Calculation Rows */}
                <div className="space-y-3 pt-4 border-t border-[#C89B3C]/30 text-xs font-medium">
                  <div className="flex justify-between">
                    <span className="text-[#292524]/70">Items Subtotal ({totalItems})</span>
                    <span className="font-bold text-[#6B4226]">₹{subtotal}</span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-[#588157]">
                      <span>Special Discount (10%)</span>
                      <span className="font-bold">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-[#292524]/70">Pan-India Delivery</span>
                    <span className="font-bold text-[#6B4226]">
                      {shippingFee === 0 ? (
                        <span className="text-[#588157] font-bold">FREE</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-4 border-t border-[#6B4226]/30 text-base font-bold">
                    <span className="font-display text-xl text-[#6B4226]">Total Amount</span>
                    <span className="text-2xl text-[#E85D04]">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="btn-saffron w-full py-4 text-center rounded-md text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-solid-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={15} />
                </Link>

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-[#292524]/60 flex items-center justify-center gap-1.5 font-sans">
                    <ShieldCheck size={14} className="text-[#588157]" />
                    <span>100% Safe & Secure Vedic Commerce</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </InnerPage>
  );
}
