"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock, CreditCard, Truck, Check, ArrowLeft, ArrowRight, Sparkles, MapPin, CheckCircle2, Plus, Home, Tag } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { useStore, UserAddress } from "@/components/store";
import { SHIPPING_CONFIG } from "@/lib/shipping";
import { CheckoutPageSkeleton } from "@/components/loading-skeletons";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const {
    lines,
    subtotal,
    totalItems,
    clear,
    user,
    token,
    savedAddresses,
    defaultAddress,
    createAddress,
    appliedCoupon,
    couponDiscount,
    cartCouponCodes,
    applyCoupon,
    removeCoupon,
    isInitialDataLoading,
  } = useStore();

  const [checkoutCouponInput, setCheckoutCouponInput] = useState("");
  const [checkoutCouponLoading, setCheckoutCouponLoading] = useState(false);
  const [checkoutCouponError, setCheckoutCouponError] = useState("");

  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
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

  // Preload Razorpay checkout script
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Dynamic calibrated totals with coupon discount
  const effectiveDiscount = couponDiscount;
  const shippingFee = SHIPPING_CONFIG.calculate(subtotal - effectiveDiscount);
  const finalTotal = Math.max(0, subtotal - effectiveDiscount + shippingFee);

  const handleApplyCoupon = async (explicitCode?: string) => {
    const code = explicitCode || checkoutCouponInput;
    if (!code.trim()) return;
    setCheckoutCouponLoading(true);
    setCheckoutCouponError("");
    const res = await applyCoupon(code);
    setCheckoutCouponLoading(false);
    if (!res.success) {
      setCheckoutCouponError(res.message || "Invalid coupon code");
    } else {
      setCheckoutCouponInput("");
    }
  };

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

      const isOnline = formData.paymentMethod !== "cod";
      const couponCodeToSend = appliedCoupon?.code || (cartCouponCodes.length > 0 ? cartCouponCodes[0] : undefined);

      const payload = {
        userId: user?.id || undefined,
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
          productId: (l.product as any).id || l.product.slug,
          quantity: l.qty,
        })),
        paymentMethod: isOnline ? "RAZORPAY" : "COD",
        couponCode: couponCodeToSend,
      };

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Failed to create order");
      }

      const orderData = resData.data;
      const orderId = orderData?.orderNumber || orderData?.id || `HM-${Date.now()}`;

      // Razorpay Online Payment Flow
      if (isOnline && orderData?.razorpay) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error("Unable to connect to Razorpay payment gateway. Please verify your connection.");
        }

        const rzpOptions = {
          key: orderData.razorpay.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.razorpay.amount,
          currency: orderData.razorpay.currency || "INR",
          name: "HM Agarbattis",
          description: `Order #${orderId}`,
          image: "/images/brand_logo_gold_transparent.png",
          order_id: orderData.razorpay.orderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#E85D04",
          },
          handler: async function (response: any) {
            setLoading(true);
            try {
              const verifyRes = await fetch(`${API_URL}/orders/verify-payment`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  orderId: orderData.id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyJson = await verifyRes.json();
              if (!verifyRes.ok || !verifyJson.success) {
                throw new Error(verifyJson.message || "Payment verification failed");
              }

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
                status: "CONFIRMED",
                paymentStatus: "COMPLETED",
              };
              localStorage.setItem(`hm_order_${orderId}`, JSON.stringify(orderRecord));
              localStorage.setItem("hm_last_order_id", orderId);

              clear();
              setCompletedOrderId(orderId);
            } catch (vErr: any) {
              console.error("Payment verification failed:", vErr);
              alert(`Payment verification notice: ${vErr.message}. If payment was deducted, quote reference: ${orderId}`);
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(rzpOptions);
        rzp.on("payment.failed", function (failRes: any) {
          setLoading(false);
          alert(`Payment unsuccessful: ${failRes.error?.description || "Transaction declined"}. You can retry or choose COD.`);
        });
        rzp.open();
        return;
      }

      // Offline / COD Flow
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
        status: orderData?.status || "PENDING",
        paymentStatus: orderData?.paymentStatus || "PENDING",
      };
      localStorage.setItem(`hm_order_${orderId}`, JSON.stringify(orderRecord));
      localStorage.setItem("hm_last_order_id", orderId);

      clear();
      setCompletedOrderId(orderId);
    } catch (err: any) {
      console.error("Order creation failed", err);
      alert(err.message || "Failed to process order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isInitialDataLoading) return <CheckoutPageSkeleton />;

  return (
    <InnerPage
      eyebrow="SECURE CHECKOUT"
      title="Almost There"
      subtitle="Complete your sacred purchase with encrypted security and direct dispatch from Coimbatore."
    >
      <div className="page-container py-8 sm:py-10">
        {completedOrderId ? (
          <div className="surface-card mx-auto flex max-w-xl flex-col items-center p-8 text-center sm:p-12">
            <CheckCircle2 className="h-14 w-14 text-brand-positive" aria-hidden="true" />
            <h2 className="mt-5 font-display text-2xl font-bold text-brand-heading">Order confirmed</h2>
            <p className="mt-3 text-sm text-brand-charcoal/75">
              Thank you for your order. Your reference number is <strong className="text-brand-primary">{completedOrderId}</strong>.
            </p>
            <Link href="/shop" className="btn-primary mt-7 gap-2 px-6">
              Continue shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : lines.length === 0 ? (
          <div className="empty-state mx-auto max-w-xl">
            <h2 className="font-brand text-xl sm:text-2xl text-brand-heading font-bold">
              Your basket is empty
            </h2>
            <p className="text-sm text-brand-charcoal/70 mt-2">
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
              <div className="flex items-center justify-between border-b border-brand-gold/30 pb-4">
                {[
                  { n: 1, label: "Address" },
                  { n: 2, label: "Delivery" },
                  { n: 3, label: "Payment" },
                ].map((s) => (
                  <div key={s.n} className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        step >= s.n
                          ? "bg-brand-saffron-dark text-brand-surface"
                          : "bg-brand-surface border border-brand-brown/30 text-brand-brown"
                      }`}
                    >
                      {step > s.n ? "✓" : s.n}
                    </span>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        step === s.n ? "text-brand-saffron-dark" : "text-brand-brown/70"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Address Details */}
              {step === 1 && (
                <div className="surface-card space-y-6 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-brand-gold/30 pb-3">
                    <div>
                      <h3 className="font-brand text-base sm:text-lg text-brand-heading font-bold uppercase tracking-wider">
                        1. Shipping & Delivery Address
                      </h3>
                      <p className="text-xs text-brand-charcoal/70 mt-0.5">
                        Where should we dispatch your consecrated agarbattis and dhoop?
                      </p>
                    </div>
                    {user && (
                      <Link
                        href="/account"
                        className="text-ui-11 font-bold text-brand-saffron-dark hover:underline flex items-center gap-1 self-start sm:self-auto"
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
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-brown">
                          Saved Addresses ({savedAddresses.length})
                        </span>
                        {defaultAddress && (
                          <span className="text-ui-11 text-brand-green font-semibold flex items-center gap-1">
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
                                  ? "bg-white border-brand-saffron-dark ring-2 ring-brand-saffron-dark/30 shadow-sm"
                                  : "bg-brand-surface border-brand-gold/50 hover:bg-white"
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-xs text-brand-brown line-clamp-1">
                                    {addr.recipientName}
                                  </span>
                                  {addr.isDefault && (
                                    <span className="text-ui-9 bg-brand-saffron-dark text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-ui-11 text-brand-charcoal/80 line-clamp-2 leading-relaxed">
                                  {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                                </p>
                                <p className="text-ui-10 text-brand-charcoal/60">
                                  📞 {addr.phone}
                                </p>
                              </div>

                              <div className="mt-2 pt-2 border-t border-brand-gold/20 flex items-center justify-between">
                                <span className={`text-ui-10 font-bold ${isSelected ? "text-brand-saffron-dark" : "text-brand-brown/60"}`}>
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
                              ? "bg-white border-brand-saffron-dark ring-2 ring-brand-saffron-dark/30 shadow-sm"
                              : "bg-brand-surface border-dashed border-brand-gold hover:bg-white"
                          }`}
                        >
                          <Plus size={16} className="text-brand-saffron-dark" />
                          <span className="text-xs font-bold text-brand-brown">
                            Enter New Address
                          </span>
                          <span className="text-ui-10 text-brand-charcoal/60">
                            Deliver to a different destination
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Form fields */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-brown">
                        {selectedAddressId !== "custom" && savedAddresses.length > 0
                          ? "Selected Delivery Address Details"
                          : "Delivery Address Form"}
                      </span>
                      {selectedAddressId !== "custom" && savedAddresses.length > 0 && (
                        <span className="text-ui-11 text-brand-green font-medium">
                          Auto-filled from saved address
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                      <label className="sm:col-span-2">
                        <span className="mb-1 block text-brand-brown">Full Recipient Name *</span>
                        <input
                          required
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Anand Sharma"
                          className="w-full bg-white border border-brand-gold rounded-lg p-3 text-xs text-brand-charcoal outline-brand-saffron-dark transition-all"
                        />
                      </label>

                      <label>
                        <span className="mb-1 block text-brand-brown">Mobile Number *</span>
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full bg-white border border-brand-gold rounded-lg p-3 text-xs text-brand-charcoal outline-brand-saffron-dark transition-all"
                        />
                      </label>

                      <label>
                        <span className="mb-1 block text-brand-brown">Email Address *</span>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="anand@example.com"
                          className="w-full bg-white border border-brand-gold rounded-lg p-3 text-xs text-brand-charcoal outline-brand-saffron-dark transition-all"
                        />
                      </label>

                      <label className="sm:col-span-2">
                        <span className="mb-1 block text-brand-brown">Street Address & Flat / House No. *</span>
                        <input
                          required
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Apartment, temple street, landmark..."
                          className="w-full bg-white border border-brand-gold rounded-lg p-3 text-xs text-brand-charcoal outline-brand-saffron-dark transition-all"
                        />
                      </label>

                      <label>
                        <span className="mb-1 block text-brand-brown">City / Town *</span>
                        <input
                          required
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Coimbatore"
                          className="w-full bg-white border border-brand-gold rounded-lg p-3 text-xs text-brand-charcoal outline-brand-saffron-dark transition-all"
                        />
                      </label>

                      <label>
                        <span className="mb-1 block text-brand-brown">State *</span>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full bg-white border border-brand-gold rounded-lg p-3 text-xs text-brand-charcoal outline-brand-saffron-dark transition-all"
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
                        <span className="mb-1 block text-brand-brown">Pincode / Postal Code *</span>
                        <input
                          required
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="641028"
                          className="w-full bg-white border border-brand-gold rounded-lg p-3 text-xs text-brand-charcoal outline-brand-saffron-dark transition-all"
                        />
                      </label>
                    </div>

                    {/* If entering a custom address and user is logged in, offer to save to address book */}
                    {user && selectedAddressId === "custom" && (
                      <div className="bg-white/80 border border-brand-gold/50 rounded-xl p-3.5 space-y-2 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-brown">
                          <input
                            type="checkbox"
                            checked={saveToAccount}
                            onChange={(e) => setSaveToAccount(e.target.checked)}
                            className="accent-brand-saffron-dark rounded"
                          />
                          <span>Save this delivery address to my devotee account for future orders</span>
                        </label>
                        {saveToAccount && (
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-brand-charcoal/80 ml-5">
                            <input
                              type="checkbox"
                              checked={makeAsDefault}
                              onChange={(e) => setMakeAsDefault(e.target.checked)}
                              className="accent-brand-saffron-dark rounded"
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
                <div className="surface-card space-y-5 p-8">
                  <h3 className="font-brand text-base sm:text-lg text-brand-heading font-bold uppercase tracking-wider">
                    2. Select Delivery Option
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-white rounded-xl ring-2 ring-brand-saffron-dark cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="standard"
                          checked={formData.deliveryOption === "standard"}
                          onChange={handleChange}
                          className="accent-brand-saffron-dark"
                        />
                        <div>
                          <p className="text-xs font-bold text-brand-brown">
                            Standard Pan-India Sacred Dispatch
                          </p>
                          <p className="text-ui-11 text-brand-charcoal/60">
                            {SHIPPING_CONFIG.deliveryDescription}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-brand-green">
                        {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
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
                <form onSubmit={handleSubmitOrder} className="surface-card space-y-6 p-8">
                  <h3 className="font-brand text-base sm:text-lg text-brand-heading font-bold uppercase tracking-wider">
                    3. Secure Payment Method
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 bg-white border border-brand-gold rounded-xl cursor-pointer hover:border-brand-saffron-dark">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === "upi"}
                        onChange={handleChange}
                        className="accent-brand-saffron-dark"
                      />
                      <div>
                        <p className="text-xs font-bold text-brand-brown">
                          UPI (GPay / PhonePe / Paytm / BHIM)
                        </p>
                        <p className="text-ui-11 text-brand-charcoal/60">Instant zero-fee payment.</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-white border border-brand-gold rounded-xl cursor-pointer hover:border-brand-saffron-dark">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleChange}
                        className="accent-brand-saffron-dark"
                      />
                      <div>
                        <p className="text-xs font-bold text-brand-brown">
                          Credit / Debit Card / Net Banking (Razorpay)
                        </p>
                        <p className="text-ui-11 text-brand-charcoal/60">All major Indian banks supported.</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-white border border-brand-gold rounded-xl cursor-pointer hover:border-brand-saffron-dark">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleChange}
                        className="accent-brand-saffron-dark"
                      />
                      <div>
                        <p className="text-xs font-bold text-brand-brown">
                          Cash on Delivery (COD)
                        </p>
                        <p className="text-ui-11 text-brand-charcoal/60">Pay cash upon delivery at your doorstep.</p>
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
                      className="btn-primary flex-1 gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <Lock size={14} /> {formData.paymentMethod === "cod" ? "Place COD Order" : "Pay via Razorpay"} (₹{finalTotal})
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Order Summary & Reassurance */}
            <div className="lg:col-span-5 space-y-6">
              <aside className="surface-card space-y-4 p-6">
                <h3 className="font-brand text-base text-brand-heading font-bold uppercase tracking-wider border-b border-brand-gold/30 pb-3">
                  Sacred Basket ({totalItems} items)
                </h3>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-brand-border/50">
                  {lines.map((l) => (
                    <div key={l.product.slug} className="pt-2.5 flex items-center gap-3 text-xs">
                      <div className="relative w-12 h-12 bg-white rounded-lg border border-brand-border overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                        {l.product.image ? (
                          <Image
                            src={l.product.image}
                            alt={l.product.name}
                            fill
                            sizes="48px"
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-xl">🪔</span>
                        )}
                        <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-ui-9 font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                          {l.qty}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-brand-heading block truncate">{l.product.name}</span>
                        <span className="text-ui-11 text-brand-gray">{l.product.quantity}</span>
                      </div>
                      <span className="font-bold text-brand-primary text-sm tabular-nums shrink-0">₹{l.product.price * l.qty}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="pt-3 border-t border-brand-gold/30 space-y-2">
                  {cartCouponCodes.length > 0 && !appliedCoupon && (
                    <div className="rounded-lg bg-brand-turmeric/20 p-2.5 border border-dashed border-brand-gold text-xs">
                      <p className="text-ui-11 font-bold text-brand-brown mb-1.5 flex items-center gap-1">
                        <Tag size={12} className="text-brand-saffron-dark" /> Available item coupon:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {cartCouponCodes.map((code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => handleApplyCoupon(code)}
                            className="inline-flex items-center gap-1 rounded bg-brand-surface px-2 py-1 text-xs font-bold text-brand-primary border border-brand-gold hover:bg-brand-saffron-dark hover:text-white transition shadow-xs"
                          >
                            <span>Use &apos;{code}&apos;</span>
                            <span className="text-ui-10 text-brand-green font-extrabold group-hover:text-white">Apply</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-lg bg-brand-positive-soft px-3 py-2 border border-brand-green/40 text-xs">
                      <div className="flex items-center gap-1.5 text-brand-positive-dark">
                        <Tag size={14} className="text-brand-positive-dark" />
                        <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-₹{couponDiscount})</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-ui-11 font-bold text-brand-primary hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={checkoutCouponInput}
                        onChange={(e) => setCheckoutCouponInput(e.target.value)}
                        placeholder="Coupon code (e.g. 1)"
                        className="flex-1 text-xs bg-white border border-brand-gold rounded-lg px-2.5 py-1.5 text-brand-charcoal uppercase outline-brand-saffron-dark"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={checkoutCouponLoading}
                        className="btn-outline-earth px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider disabled:opacity-50"
                      >
                        {checkoutCouponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  )}

                  {checkoutCouponError && (
                    <p className="text-ui-11 font-bold text-brand-primary">{checkoutCouponError}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-brand-gold/30 space-y-2 text-xs font-medium">
                  <div className="flex justify-between">
                    <span className="text-brand-charcoal/70">Subtotal</span>
                    <span className="font-bold text-brand-brown">₹{subtotal}</span>
                  </div>
                  {appliedCoupon && couponDiscount > 0 && (
                    <div className="flex justify-between text-brand-green font-bold">
                      <span className="flex items-center gap-1">
                        <Tag size={12} /> Coupon Discount ({appliedCoupon.code})
                      </span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-brand-charcoal/70">Delivery</span>
                    <span className="font-bold text-brand-green">
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-brand-brown/30 text-base font-bold">
                    <span className="font-display text-lg text-brand-brown">Total Amount</span>
                    <span className="text-xl text-brand-saffron-dark">₹{finalTotal}</span>
                  </div>
                </div>
              </aside>

              <div className="bg-brand-turmeric/20 p-4 rounded-xl border border-brand-gold/40 text-xs text-brand-brown space-y-2">
                <div className="flex items-center gap-2 font-bold text-brand-saffron-dark">
                  <ShieldCheck size={16} />
                  <span>The HM Devotion Guarantee</span>
                </div>
                <p className="text-ui-11 text-brand-charcoal/70 leading-relaxed font-sans">
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
