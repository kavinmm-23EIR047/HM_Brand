"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, CreditCard, Truck, Check, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { useStore } from "@/components/store";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, totalItems, clear } = useStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
    deliveryOption: "standard",
    paymentMethod: "upi",
  });

  const shippingFee = subtotal >= 499 || subtotal === 0 ? 0 : 50;
  const finalTotal = subtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderId = `HM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Store recent order in localStorage for order tracking
    try {
      const orderRecord = {
        id: orderId,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        items: lines,
        total: finalTotal,
        customer: formData,
        status: "Order Placed",
      };
      localStorage.setItem(`hm_order_${orderId}`, JSON.stringify(orderRecord));
      localStorage.setItem("hm_last_order_id", orderId);
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      clear();
      router.push(`/orders/${orderId}`);
    }, 800);
  };

  return (
    <InnerPage
      eyebrow="SECURE CHECKOUT"
      title="Almost There"
      subtitle="Complete your sacred purchase with encrypted security and direct dispatch from Coimbatore."
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {lines.length === 0 ? (
          <div className="bg-[#FFF8E7] rounded-3xl border-2 border-[#C89B3C] p-12 text-center max-w-xl mx-auto shadow-sm">
            <h2 className="font-display text-3xl text-[#6B4226] font-bold">
              Your basket is empty
            </h2>
            <p className="text-sm text-[#292524]/70 mt-2">
              Please add at least one sacred product before checking out.
            </p>
            <Link
              href="/shop"
              className="btn-saffron mt-6 px-6 py-3 rounded-md text-xs font-bold uppercase tracking-wider inline-block"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Checkout Steps & Forms */}
            <div className="lg:col-span-7 space-y-8">
              {/* Stepper Header */}
              <div className="flex items-center justify-between border-b border-[#C89B3C]/30 pb-4">
                {[
                  { n: 1, label: "Address" },
                  { n: 2, label: "Delivery" },
                  { n: 3, label: "Payment" },
                ].map((s) => (
                  <div key={s.n} className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        step >= s.n
                          ? "bg-[#E85D04] text-[#FFF8E7]"
                          : "bg-[#FFF8E7] border border-[#6B4226]/30 text-[#6B4226]"
                      }`}
                    >
                      {step > s.n ? "✓" : s.n}
                    </span>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        step === s.n ? "text-[#E85D04]" : "text-[#6B4226]/70"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Address Details */}
              {step === 1 && (
                <div className="bg-[#FFF8E7] p-8 rounded-2xl border-2 border-[#C89B3C]/40 space-y-5">
                  <h3 className="font-display text-2xl text-[#6B4226] font-bold">
                    1. Shipping & Altar Address
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <label className="sm:col-span-2">
                      <span className="mb-1 block text-[#6B4226]">Full Name *</span>
                      <input
                        required
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Anand Sharma"
                        className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04]"
                      />
                    </label>

                    <label>
                      <span className="mb-1 block text-[#6B4226]">Mobile Number *</span>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04]"
                      />
                    </label>

                    <label>
                      <span className="mb-1 block text-[#6B4226]">Email Address *</span>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="anand@example.com"
                        className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04]"
                      />
                    </label>

                    <label className="sm:col-span-2">
                      <span className="mb-1 block text-[#6B4226]">Street Address & House No. *</span>
                      <input
                        required
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Apartment, building, street..."
                        className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04]"
                      />
                    </label>

                    <label>
                      <span className="mb-1 block text-[#6B4226]">City *</span>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Coimbatore"
                        className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04]"
                      />
                    </label>

                    <label>
                      <span className="mb-1 block text-[#6B4226]">State *</span>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04]"
                      >
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Other">Other State</option>
                      </select>
                    </label>

                    <label>
                      <span className="mb-1 block text-[#6B4226]">Pincode *</span>
                      <input
                        required
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="641028"
                        className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04]"
                      />
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      if (!formData.fullName || !formData.phone || !formData.address) {
                        alert("Please fill in required name, phone, and address details.");
                        return;
                      }
                      setStep(2);
                    }}
                    className="btn-saffron w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider rounded-md mt-4 flex items-center justify-center gap-2"
                  >
                    <span>Continue to Delivery</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Step 2: Delivery Method */}
              {step === 2 && (
                <div className="bg-[#FFF8E7] p-8 rounded-2xl border-2 border-[#C89B3C]/40 space-y-5">
                  <h3 className="font-display text-2xl text-[#6B4226] font-bold">
                    2. Select Delivery Option
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-white border-2 border-[#E85D04] rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="standard"
                          checked={formData.deliveryOption === "standard"}
                          onChange={handleChange}
                          className="accent-[#E85D04]"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#6B4226]">
                            Standard Pan-India Sacred Dispatch
                          </p>
                          <p className="text-[11px] text-[#292524]/60">
                            Delivered securely in 3–5 business days from Coimbatore.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#588157]">
                        {shippingFee === 0 ? "FREE" : "₹50"}
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="btn-outline-earth py-3 px-5 text-xs font-bold uppercase rounded-md"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="btn-saffron flex-1 py-3 text-center text-xs font-bold uppercase rounded-md flex items-center justify-center gap-2"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {step === 3 && (
                <form onSubmit={handleSubmitOrder} className="bg-[#FFF8E7] p-8 rounded-2xl border-2 border-[#C89B3C]/40 space-y-6">
                  <h3 className="font-display text-2xl text-[#6B4226] font-bold">
                    3. Secure Payment Method
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 bg-white border border-[#C89B3C] rounded-xl cursor-pointer hover:border-[#E85D04]">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === "upi"}
                        onChange={handleChange}
                        className="accent-[#E85D04]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#6B4226]">
                          UPI (GPay / PhonePe / Paytm / BHIM)
                        </p>
                        <p className="text-[11px] text-[#292524]/60">Instant zero-fee payment.</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-white border border-[#C89B3C] rounded-xl cursor-pointer hover:border-[#E85D04]">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleChange}
                        className="accent-[#E85D04]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#6B4226]">
                          Credit / Debit Card / Net Banking (Razorpay)
                        </p>
                        <p className="text-[11px] text-[#292524]/60">All major Indian banks supported.</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-white border border-[#C89B3C] rounded-xl cursor-pointer hover:border-[#E85D04]">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleChange}
                        className="accent-[#E85D04]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#6B4226]">
                          Cash on Delivery (COD)
                        </p>
                        <p className="text-[11px] text-[#292524]/60">Pay cash upon delivery at your doorstep.</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-outline-earth py-3 px-5 text-xs font-bold uppercase rounded-md"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-saffron flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-2 shadow-solid-sm disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <Lock size={14} /> Place Sacred Order (₹{finalTotal})
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Order Summary & Reassurance */}
            <div className="lg:col-span-5 space-y-6">
              <aside className="bg-[#FFF8E7] p-6 rounded-2xl border-2 border-[#6B4226] shadow-solid-sm space-y-4">
                <h3 className="font-display text-xl text-[#6B4226] font-bold border-b border-[#C89B3C]/30 pb-3">
                  Sacred Basket ({totalItems} items)
                </h3>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-[#C89B3C]/20">
                  {lines.map((l) => (
                    <div key={l.product.slug} className="pt-2 flex justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#6B4226] block">{l.product.name}</span>
                        <span className="text-[11px] text-[#292524]/60">Qty: {l.qty} • {l.product.quantity}</span>
                      </div>
                      <span className="font-bold text-[#B23A48]">₹{l.product.price * l.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#C89B3C]/30 space-y-2 text-xs font-medium">
                  <div className="flex justify-between">
                    <span className="text-[#292524]/70">Subtotal</span>
                    <span className="font-bold text-[#6B4226]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#292524]/70">Delivery</span>
                    <span className="font-bold text-[#588157]">
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-[#6B4226]/30 text-base font-bold">
                    <span className="font-display text-lg text-[#6B4226]">Total Amount</span>
                    <span className="text-xl text-[#E85D04]">₹{finalTotal}</span>
                  </div>
                </div>
              </aside>

              <div className="bg-[#F4D35E]/20 p-4 rounded-xl border border-[#C89B3C]/40 text-xs text-[#6B4226] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#E85D04]">
                  <ShieldCheck size={16} />
                  <span>The HM Devotion Guarantee</span>
                </div>
                <p className="text-[11px] text-[#292524]/70 leading-relaxed font-sans">
                  Every parcel is blessed with sacred care and dispatched with damage-proof packing directly from Peelamedu, Coimbatore.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </InnerPage>
  );
}
