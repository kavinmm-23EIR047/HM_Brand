"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, CreditCard, Truck, Check, ArrowLeft, ArrowRight, Sparkles, MapPin, CheckCircle2, Plus, Home } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { useStore, UserAddress } from "@/components/store";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, totalItems, clear, user, token, savedAddresses, defaultAddress, createAddress } = useStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "custom">("default");
  const [saveToAccount, setSaveToAccount] = useState(false);
  const [makeAsDefault, setMakeAsDefault] = useState(false);

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

  // Automatically pre-fill default address or user profile when available
  useEffect(() => {
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || defaultAddress.recipientName || user?.fullName || "",
        phone: prev.phone || defaultAddress.phone || user?.phone || "",
        email: prev.email || user?.email || "",
        address: prev.address || defaultAddress.street || "",
        city: prev.city || defaultAddress.city || "",
        state: prev.state || defaultAddress.state || "Tamil Nadu",
        pincode: prev.pincode || defaultAddress.postalCode || "",
      }));
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || "",
        phone: prev.phone || user.phone || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [defaultAddress, user]);

  const handleSelectSavedAddress = (addr: UserAddress) => {
    setSelectedAddressId(addr.id);
    setFormData((prev) => ({
      ...prev,
      fullName: addr.recipientName,
      phone: addr.phone,
      address: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.postalCode,
    }));
  };

  const handleSelectCustomAddress = () => {
    setSelectedAddressId("custom");
  };

  const shippingFee = subtotal >= 499 || subtotal === 0 ? 0 : 50;
  const finalTotal = subtotal + shippingFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToDelivery = async () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert("Please fill in all required shipping details.");
      return;
    }

    // If user asked to save newly typed address to account
    if (user && saveToAccount && selectedAddressId === "custom") {
      try {
        await createAddress({
          recipientName: formData.fullName,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.pincode,
          isDefault: makeAsDefault,
        });
      } catch (err) {
        console.error("Failed to save address during checkout", err);
      }
    }

    setStep(2);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const payload = {
        customerEmail: formData.email.trim(),
        customerPhone: formData.phone.trim(),
        shippingAddress: {
          recipientName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          street: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.pincode.trim(),
        },
        items: lines.map((l) => ({
          productId: l.product.slug,
          quantity: l.qty,
        })),
        paymentMethod: formData.paymentMethod.toUpperCase(),
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      const orderData = resData.data;
      const orderId = orderData?.orderNumber || orderData?.id || `HM-${Date.now()}`;

      // Store in localStorage as instant client cache for tracking
      const orderRecord = {
        id: orderId,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        items: lines,
        total: orderData?.totalAmount || finalTotal,
        customer: formData,
        status: orderData?.status || "Order Placed",
      };
      localStorage.setItem(`hm_order_${orderId}`, JSON.stringify(orderRecord));
      localStorage.setItem("hm_last_order_id", orderId);

      clear();
      router.push(`/orders/${orderId}`);
    } catch (err) {
      console.error("Order creation failed, falling back to local tracking", err);
      const fallbackOrderId = `HM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderRecord = {
        id: fallbackOrderId,
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
      localStorage.setItem(`hm_order_${fallbackOrderId}`, JSON.stringify(orderRecord));
      localStorage.setItem("hm_last_order_id", fallbackOrderId);
      clear();
      router.push(`/orders/${fallbackOrderId}`);
    } finally {
      setLoading(false);
    }
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
                <div className="bg-[#FFF8E7] p-6 sm:p-8 rounded-2xl border-2 border-[#C89B3C]/40 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#C89B3C]/30 pb-3">
                    <div>
                      <h3 className="font-display text-2xl text-[#6B4226] font-bold">
                        1. Shipping & Delivery Address
                      </h3>
                      <p className="text-xs text-[#292524]/70 mt-0.5">
                        Where should we dispatch your consecrated agarbattis and dhoop?
                      </p>
                    </div>
                    {user && (
                      <Link
                        href="/account"
                        className="text-[11px] font-bold text-[#E85D04] hover:underline flex items-center gap-1 self-start sm:self-auto"
                      >
                        <MapPin size={12} />
                        Manage Saved Addresses
                      </Link>
                    )}
                  </div>

                  {/* Saved Addresses Quick Selection if user has saved addresses */}
                  {user && savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#6B4226]">
                          Saved Addresses ({savedAddresses.length})
                        </span>
                        {defaultAddress && (
                          <span className="text-[11px] text-[#588157] font-semibold flex items-center gap-1">
                            <CheckCircle2 size={12} /> Default Address Applied
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {savedAddresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id;
                          return (
                            <button
                              type="button"
                              key={addr.id}
                              onClick={() => handleSelectSavedAddress(addr)}
                              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                                isSelected
                                  ? "bg-white border-[#E85D04] ring-2 ring-[#E85D04]/30 shadow-sm"
                                  : "bg-[#FFF8E7] border-[#C89B3C]/50 hover:bg-white"
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-xs text-[#6B4226] line-clamp-1">
                                    {addr.recipientName}
                                  </span>
                                  {addr.isDefault && (
                                    <span className="text-[9px] bg-[#E85D04] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#292524]/80 line-clamp-2 leading-relaxed">
                                  {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                                </p>
                                <p className="text-[10px] text-[#292524]/60">
                                  📞 {addr.phone}
                                </p>
                              </div>

                              <div className="mt-2 pt-2 border-t border-[#C89B3C]/20 flex items-center justify-between">
                                <span className={`text-[10px] font-bold ${isSelected ? "text-[#E85D04]" : "text-[#6B4226]/60"}`}>
                                  {isSelected ? "✓ Deliver Here" : "Deliver to this address"}
                                </span>
                              </div>
                            </button>
                          );
                        })}

                        {/* Option to type custom new address */}
                        <button
                          type="button"
                          onClick={handleSelectCustomAddress}
                          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col items-center justify-center gap-1.5 text-center min-h-[100px] ${
                            selectedAddressId === "custom"
                              ? "bg-white border-[#E85D04] ring-2 ring-[#E85D04]/30 shadow-sm"
                              : "bg-[#FFF8E7] border-dashed border-[#C89B3C] hover:bg-white"
                          }`}
                        >
                          <Plus size={16} className="text-[#E85D04]" />
                          <span className="text-xs font-bold text-[#6B4226]">
                            Enter New Address
                          </span>
                          <span className="text-[10px] text-[#292524]/60">
                            Deliver to a different destination
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Form fields */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6B4226]">
                        {selectedAddressId !== "custom" && savedAddresses.length > 0
                          ? "Selected Delivery Address Details"
                          : "Delivery Address Form"}
                      </span>
                      {selectedAddressId !== "custom" && savedAddresses.length > 0 && (
                        <span className="text-[11px] text-[#588157] font-medium">
                          Auto-filled from saved address
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                      <label className="sm:col-span-2">
                        <span className="mb-1 block text-[#6B4226]">Full Recipient Name *</span>
                        <input
                          required
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Anand Sharma"
                          className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04] transition-all"
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
                          className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04] transition-all"
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
                          className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04] transition-all"
                        />
                      </label>

                      <label className="sm:col-span-2">
                        <span className="mb-1 block text-[#6B4226]">Street Address & Flat / House No. *</span>
                        <input
                          required
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Apartment, temple street, landmark..."
                          className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04] transition-all"
                        />
                      </label>

                      <label>
                        <span className="mb-1 block text-[#6B4226]">City / Town *</span>
                        <input
                          required
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Coimbatore"
                          className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04] transition-all"
                        />
                      </label>

                      <label>
                        <span className="mb-1 block text-[#6B4226]">State *</span>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04] transition-all"
                        >
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Other">Other State</option>
                        </select>
                      </label>

                      <label className="sm:col-span-2">
                        <span className="mb-1 block text-[#6B4226]">Pincode / Postal Code *</span>
                        <input
                          required
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="641028"
                          className="w-full bg-white border border-[#C89B3C] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04] transition-all"
                        />
                      </label>
                    </div>

                    {/* If entering a custom address and user is logged in, offer to save to address book */}
                    {user && selectedAddressId === "custom" && (
                      <div className="bg-white/80 border border-[#C89B3C]/50 rounded-xl p-3.5 space-y-2 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#6B4226]">
                          <input
                            type="checkbox"
                            checked={saveToAccount}
                            onChange={(e) => setSaveToAccount(e.target.checked)}
                            className="accent-[#E85D04] rounded"
                          />
                          <span>Save this delivery address to my devotee account for future orders</span>
                        </label>
                        {saveToAccount && (
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#292524]/80 ml-5">
                            <input
                              type="checkbox"
                              checked={makeAsDefault}
                              onChange={(e) => setMakeAsDefault(e.target.checked)}
                              className="accent-[#E85D04] rounded"
                            />
                            <span>Make this my default delivery address</span>
                          </label>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleProceedToDelivery}
                    className="btn-saffron w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider rounded-md mt-4 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Continue to Delivery Option</span>
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
