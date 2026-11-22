"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock, CreditCard, Truck, Check, ArrowLeft, ArrowRight, Sparkles, MapPin, CheckCircle2, Plus, Home, Phone, Tag, AlertCircle } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { useStore, UserAddress } from "@/components/store";
import { SHIPPING_CONFIG } from "@/lib/shipping";
import { CheckoutPageSkeleton } from "@/components/loading-skeletons";
import { SacredDiyaSvg } from "@/components/sacred-icons";
import { OrderSuccessView, ConfirmedOrderData } from "@/components/order-success-view";

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

function UpiBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAE1D3] bg-white shadow-2xs">
      <img src="/payment-logos/upi.svg" alt="UPI" className="h-5 w-auto" />
    </div>
  );
}

function GPayBadge() {
  return (
    <div className="inline-flex items-center rounded-lg bg-white">
      <img src="/payment-logos/google-pay-mark.svg" alt="Google Pay" className="h-8 w-auto" />
    </div>
  );
}

function PhonePeBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAE1D3] bg-white shadow-2xs">
      <img src="/payment-logos/phonepe.svg" alt="" aria-hidden="true" className="h-5 w-5" />
      <span className="text-[11px] font-bold text-[#5F259F]">PhonePe</span>
    </div>
  );
}

function PaytmBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAE1D3] bg-white shadow-2xs">
      <img src="/payment-logos/paytm.svg" alt="" aria-hidden="true" className="h-5 w-5" />
      <span className="text-[11px] font-bold text-[#002970]">Paytm</span>
    </div>
  );
}

function RazorpayBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAE1D3] bg-white shadow-2xs">
      <img src="/payment-logos/razorpay.svg" alt="" aria-hidden="true" className="h-5 w-5" />
      <span className="text-[11px] font-bold text-[#0C2451]">Razorpay</span>
    </div>
  );
}

function CardsNetBankingBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#EAE1D3] bg-white shadow-2xs">
      <CreditCard size={15} className="text-[#9E1830]" />
      <span className="text-[11px] font-sans font-bold text-[#302923]">Cards &amp; online banking</span>
    </div>
  );
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
  const [orderSuccessData, setOrderSuccessData] = useState<ConfirmedOrderData | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<{ type: "error" | "warning" | "info"; message: string } | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "custom">("default");
  const [saveToAccount, setSaveToAccount] = useState(false);
  const [makeAsDefault, setMakeAsDefault] = useState(false);

  // Restore confirmed order on mount / refresh so it never disappears on F5
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlOrderId = searchParams.get("orderId");
      const sessionOrderId = sessionStorage.getItem("hm_active_order_id");
      const lastOrderId = localStorage.getItem("hm_last_order_id");

      // Don't auto-restore previous order if cart has fresh active items and no ?orderId in URL
      if (!urlOrderId && lines.length > 0) {
        return;
      }

      const targetId = urlOrderId || sessionOrderId || lastOrderId;

      if (targetId) {
        const storedOrder =
          localStorage.getItem(`hm_order_${targetId}`) ||
          localStorage.getItem("hm_recent_confirmed_order");

        if (storedOrder) {
          const parsed = JSON.parse(storedOrder);
          if (parsed && (parsed.id === targetId || parsed.orderNumber === targetId || !urlOrderId)) {
            setOrderSuccessData(parsed);
            setCompletedOrderId(parsed.orderNumber || parsed.id || targetId);
            return;
          }
        }

        // Fallback: If URL has orderId, fetch directly from backend API
        if (urlOrderId) {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
          fetch(`${API_URL}/orders/${urlOrderId}`)
            .then((res) => res.json())
            .then((resData) => {
              if (resData?.success && resData?.data) {
                const d = resData.data;
                const mapped: ConfirmedOrderData = {
                  id: d.id,
                  orderNumber: d.orderNumber || d.id,
                  date: new Date(d.createdAt || Date.now()).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
                  items: (d.items || []).map((it: any) => ({
                    product: {
                      name: it.productName || it.name,
                      slug: it.productSlug || it.slug || "",
                      price: it.unitPrice || it.price,
                      image: it.imageUrlSnapshot || it.image,
                      quantity: it.quantitySnapshot || "Standard Pack",
                    },
                    qty: it.quantity,
                  })),
                  subtotal: d.subtotal,
                  discountAmount: d.discountAmount,
                  shippingCost: d.shippingCost,
                  total: d.totalAmount,
                  customer: typeof d.shippingAddress === "string" ? JSON.parse(d.shippingAddress) : d.shippingAddress,
                  status: d.status,
                  paymentStatus: d.paymentStatus,
                  paymentMethod: d.paymentMethod,
                  razorpayPaymentId: d.razorpayPaymentId,
                  razorpayOrderId: d.razorpayOrderId,
                };
                setOrderSuccessData(mapped);
                setCompletedOrderId(d.orderNumber || d.id);
              }
            })
            .catch((err) => console.warn("Failed to fetch order on reload", err));
        }
      }
    } catch (e) {
      console.warn("Order restoration error", e);
    }
  }, [lines.length]);

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
    paymentMethod: "online",
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
          throw new Error("We couldn’t open the payment options. Please check your connection and try again.");
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
            color: "#9E1830",
          },
          handler: async function (response: any) {
            // IMMEDIATE INSTANT TRANSITION — zero delay, zero waiting in checkout!
            const confirmedRecord: ConfirmedOrderData = {
              id: orderId,
              orderNumber: orderId,
              date: new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              items: lines.map((l) => ({
                product: {
                  name: l.product.name,
                  slug: l.product.slug,
                  price: l.product.price,
                  image: l.product.image,
                  quantity: l.product.quantity,
                  bundleQuantity: l.product.bundleQuantity,
                },
                qty: l.qty,
              })),
              subtotal,
              discountAmount: couponDiscount,
              couponCode: appliedCoupon?.code,
              shippingCost: shippingFee,
              total: orderData?.totalAmount || finalTotal,
              customer: {
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
              },
              status: "CONFIRMED",
              paymentStatus: "COMPLETED",
              paymentMethod: "RAZORPAY",
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
            };

            // Save to localStorage immediately so no state or refresh can lose it
            try {
              localStorage.setItem(`hm_order_${orderId}`, JSON.stringify(confirmedRecord));
              localStorage.setItem("hm_last_order_id", orderId);
              localStorage.setItem("hm_recent_confirmed_order", JSON.stringify(confirmedRecord));
            } catch (sErr) {
              console.warn("Storage write error", sErr);
            }

            // Update browser URL without full reload so F5 refresh preserves order screen
            if (typeof window !== "undefined" && window.history) {
              const newUrl = `${window.location.pathname}?orderId=${encodeURIComponent(orderId)}`;
              window.history.replaceState({ orderId }, "", newUrl);
              sessionStorage.setItem("hm_active_order_id", orderId);
            }

            // Instantly clear cart and switch to the rich animated confirmation screen
            clear();
            setOrderSuccessData(confirmedRecord);
            setCompletedOrderId(orderId);
            setLoading(false);
            setPaymentNotice(null);

            // In background, verify signature with the backend
            try {
              fetch(`${API_URL}/orders/verify-payment`, {
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
              }).catch((vErr) => console.warn("Background verification logged:", vErr));
            } catch (bErr) {
              console.warn("Background verification dispatch error:", bErr);
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              setPaymentNotice({
                type: "warning",
                message: "Payment window was closed. Your items are still saved in your cart so you can complete your order when ready.",
              });
            },
          },
        };

        const rzp = new (window as any).Razorpay(rzpOptions);
        rzp.on("payment.failed", function (failRes: any) {
          setLoading(false);
          const reason = failRes.error?.description || failRes.error?.reason || "Transaction was declined";
          setPaymentNotice({
            type: "error",
            message: `Payment unsuccessful: ${reason}. Your cart items are saved. Please try again with another UPI app or card.`,
          });
        });
        rzp.open();
        return;
      }

      // Offline / COD / Fallback Flow
      const orderRecord: ConfirmedOrderData = {
        id: orderId,
        orderNumber: orderId,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        items: lines.map((l) => ({
          product: {
            name: l.product.name,
            slug: l.product.slug,
            price: l.product.price,
            image: l.product.image,
            quantity: l.product.quantity,
            bundleQuantity: l.product.bundleQuantity,
          },
          qty: l.qty,
        })),
        subtotal,
        discountAmount: couponDiscount,
        couponCode: appliedCoupon?.code,
        shippingCost: shippingFee,
        total: orderData?.totalAmount || finalTotal,
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        status: orderData?.status || "CONFIRMED",
        paymentStatus: orderData?.paymentStatus || "PENDING",
        paymentMethod: isOnline ? "RAZORPAY" : "COD",
      };
      localStorage.setItem(`hm_order_${orderId}`, JSON.stringify(orderRecord));
      localStorage.setItem("hm_last_order_id", orderId);
      localStorage.setItem("hm_recent_confirmed_order", JSON.stringify(orderRecord));

      // Update browser URL without full reload so F5 refresh preserves order screen
      if (typeof window !== "undefined" && window.history) {
        const newUrl = `${window.location.pathname}?orderId=${encodeURIComponent(orderId)}`;
        window.history.replaceState({ orderId }, "", newUrl);
        sessionStorage.setItem("hm_active_order_id", orderId);
      }

      clear();
      setOrderSuccessData(orderRecord);
      setCompletedOrderId(orderId);
    } catch (err: any) {
      console.error("Order creation failed", err);
      setPaymentNotice({
        type: "error",
        message: err.message || "Failed to process order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isInitialDataLoading) return <CheckoutPageSkeleton />;

  return (
    <InnerPage
      eyebrow={completedOrderId ? "ORDER CONFIRMATION" : "SECURE CHECKOUT"}
      title={completedOrderId ? "Order Placed Successfully!" : "Almost There"}
      subtitle={
        completedOrderId
          ? "Thank you! Your order is confirmed and will be packed carefully for direct dispatch from our Coimbatore workshop."
          : "Complete your order with secure payment and direct dispatch from Coimbatore."
      }
    >
      <div className="page-container py-8 sm:py-10">
        {completedOrderId ? (
          <OrderSuccessView
            order={
              orderSuccessData || {
                id: completedOrderId,
                orderNumber: completedOrderId,
                date: new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
                total: finalTotal,
                customer: formData,
                status: "CONFIRMED",
                paymentStatus: "COMPLETED",
              }
            }
          />
        ) : lines.length === 0 ? (
          <div className="empty-state mx-auto max-w-xl">
            <h2 className="font-brand text-xl sm:text-2xl text-brand-heading font-bold">
              Your cart is empty
            </h2>
            <p className="text-sm text-brand-charcoal/70 mt-2">
              Please add at least one item to your cart before checking out.
            </p>
            <Link
              href="/shop"
              className="btn-primary mt-6 px-6 py-3 rounded-md text-xs font-bold uppercase tracking-wider inline-block"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Checkout Steps & Forms */}
            <div className="lg:col-span-7 space-y-8">
              {/* Stepper Header */}
              <div className="flex items-center justify-between border-b border-[#302923]/15 pb-4">
                {[
                  { n: 1, label: "Address" },
                  { n: 2, label: "Delivery" },
                  { n: 3, label: "Payment" },
                ].map((s) => (
                  <div key={s.n} className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        step >= s.n
                          ? "bg-[#302923] text-white"
                          : "bg-brand-surface border border-[#302923]/30 text-brand-brown"
                      }`}
                    >
                      {step > s.n ? <Check size={14} strokeWidth={3} /> : s.n}
                    </span>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        step === s.n ? "text-[#302923]" : "text-brand-brown/70"
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#302923]/15 pb-3">
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
                        className="text-ui-11 font-bold text-[#302923] hover:underline flex items-center gap-1 self-start sm:self-auto"
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
                                  ? "bg-white border-2 border-[#302923] shadow-xs"
                                  : "bg-brand-surface border-[#302923]/20 hover:bg-white"
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-xs text-brand-brown line-clamp-1">
                                    {addr.recipientName}
                                  </span>
                                  {addr.isDefault && (
                                    <span className="text-ui-9 bg-[#302923] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-ui-11 text-brand-charcoal/80 line-clamp-2 leading-relaxed">
                                  {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                                </p>
                                <p className="inline-flex items-center gap-1.5 text-ui-10 text-brand-charcoal/70">
                                  <Phone size={11} className="shrink-0 text-brand-brown" />
                                  <span>{addr.phone}</span>
                                </p>
                              </div>

                              <div className="mt-2 pt-2 border-t border-[#302923]/15 flex items-center justify-between">
                                <span className={`inline-flex items-center gap-1 text-ui-10 font-bold ${isSelected ? "text-[#302923]" : "text-brand-brown/60"}`}>
                                  {isSelected ? (
                                    <>
                                      <Check size={12} strokeWidth={2.5} />
                                      <span>Deliver Here</span>
                                    </>
                                  ) : (
                                    "Deliver to this address"
                                  )}
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
                              ? "bg-white border-2 border-[#302923] shadow-xs"
                              : "bg-brand-surface border-dashed border-[#302923]/30 hover:bg-white"
                          }`}
                        >
                          <Plus size={16} className="text-[#302923]" />
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
                          className="w-full bg-white border border-[#302923]/25 focus:border-[#302923] focus:ring-1 focus:ring-[#302923] rounded-lg p-3 text-xs text-brand-charcoal outline-none transition-all"
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
                          className="w-full bg-white border border-[#302923]/25 focus:border-[#302923] focus:ring-1 focus:ring-[#302923] rounded-lg p-3 text-xs text-brand-charcoal outline-none transition-all"
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
                          className="w-full bg-white border border-[#302923]/25 focus:border-[#302923] focus:ring-1 focus:ring-[#302923] rounded-lg p-3 text-xs text-brand-charcoal outline-none transition-all"
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
                          className="w-full bg-white border border-[#302923]/25 focus:border-[#302923] focus:ring-1 focus:ring-[#302923] rounded-lg p-3 text-xs text-brand-charcoal outline-none transition-all"
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
                          className="w-full bg-white border border-[#302923]/25 focus:border-[#302923] focus:ring-1 focus:ring-[#302923] rounded-lg p-3 text-xs text-brand-charcoal outline-none transition-all"
                        />
                      </label>

                      <label>
                        <span className="mb-1 block text-brand-brown">State *</span>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full bg-white border border-[#302923]/25 focus:border-[#302923] focus:ring-1 focus:ring-[#302923] rounded-lg p-3 text-xs text-brand-charcoal outline-none transition-all"
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
                          className="w-full bg-white border border-[#302923]/25 focus:border-[#302923] focus:ring-1 focus:ring-[#302923] rounded-lg p-3 text-xs text-brand-charcoal outline-none transition-all"
                        />
                      </label>
                    </div>

                    {/* If entering a custom address and user is logged in, offer to save to address book */}
                    {user && selectedAddressId === "custom" && (
                      <div className="bg-white border border-[#302923]/20 rounded-xl p-3.5 space-y-2 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-brown">
                          <input
                            type="checkbox"
                            checked={saveToAccount}
                            onChange={(e) => setSaveToAccount(e.target.checked)}
                            className="accent-[#302923] rounded"
                          />
                          <span>Save this delivery address to my devotee account for future orders</span>
                        </label>
                        {saveToAccount && (
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-brand-charcoal/80 ml-5">
                            <input
                              type="checkbox"
                              checked={makeAsDefault}
                              onChange={(e) => setMakeAsDefault(e.target.checked)}
                              className="accent-[#302923] rounded"
                            />
                            <span>Make this my default delivery address</span>
                          </label>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleProceedToDelivery}
                    className="btn-primary w-full py-3.5 text-center text-xs font-bold uppercase tracking-wider rounded-md mt-4 flex items-center justify-center gap-2 shadow-sm"
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
                    <label className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-[#302923] cursor-pointer shadow-xs">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="standard"
                          checked={formData.deliveryOption === "standard"}
                          onChange={handleChange}
                          className="accent-[#302923]"
                        />
                        <div>
                          <p className="text-xs font-bold text-brand-brown">
                            Standard Pan-India Express Delivery
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
                      className="btn-primary flex-1 py-3 text-center text-xs font-bold uppercase rounded-md flex items-center justify-center gap-2"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Online Payment (No Radio Selection - 100% Secure Online Payment) */}
              {step === 3 && (
                <form onSubmit={handleSubmitOrder} className="surface-card space-y-6 p-6 sm:p-8">
                  <div>
                    <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-brand-primary block mb-1">
                      STEP 3 OF 3
                    </span>
                    <h3 className="font-brand text-base sm:text-lg text-brand-heading font-bold uppercase tracking-wider">
                      3. Complete Your Payment
                    </h3>
                    <p className="mt-1 text-xs text-stone-600">
                      Your payment is handled securely. Choose the option that works best for you.
                    </p>
                  </div>

                  {/* Payment Failure / Cancellation In-Page Alert Banner */}
                  {paymentNotice && (
                    <div
                      className={`p-4 rounded-xl border flex items-start gap-3 text-xs shadow-xs transition-all ${
                        paymentNotice.type === "error"
                          ? "bg-rose-50 border-rose-300 text-rose-900"
                          : "bg-amber-50 border-amber-300 text-amber-900"
                      }`}
                    >
                      <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-700" />
                      <div className="flex-1">
                        <p className="font-bold">
                          {paymentNotice.type === "error" ? "Payment Not Completed" : "Payment Window Closed"}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">{paymentNotice.message}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaymentNotice(null)}
                        className="text-stone-500 hover:text-stone-800 text-xs font-bold px-1"
                        aria-label="Dismiss notice"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Main Highlight Card (No Radio Buttons / Zero COD) */}
                  <div className="rounded-2xl border-2 border-[#302923] bg-white p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-primary text-white shadow-xs">
                        <ShieldCheck size={22} className="text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-sans text-sm sm:text-base font-bold text-[#302923]">
                            Pay online, your way
                          </h4>
                          <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                            No extra fees
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                          Choose your preferred option on the next screen: UPI, Google Pay, PhonePe, Paytm, cards, or online banking.
                        </p>
                      </div>
                    </div>

                    {/* Supported Payment Logos Badges Strip */}
                    <div className="pt-2 border-t border-[#EAE1D3]">
                      <p className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#4A3F35] mb-2.5">
                        Choose a payment option
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <UpiBadge />
                        <GPayBadge />
                        <PhonePeBadge />
                        <PaytmBadge />
                        <RazorpayBadge />
                        <CardsNetBankingBadge />
                      </div>
                    </div>

                    {/* Security Micro Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-[#EAE1D3]/80 text-[11px] text-stone-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Lock size={13} className="text-brand-primary shrink-0" />
                        <span>Your payment is secure</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={13} className="text-brand-primary shrink-0" />
                        <span>We&apos;ll confirm your order right away</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-700 shrink-0" />
                        <span>We&apos;re here if you need help</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-outline-earth py-3 px-5 text-xs font-bold uppercase rounded-md cursor-pointer hover:bg-brand-surface-warm transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 py-3.5 gap-2 text-xs uppercase tracking-wider disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      {loading ? (
                        <span>Opening payment options...</span>
                      ) : (
                        <>
                          <Lock size={14} /> Continue to payment · ₹{finalTotal}
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
                <h3 className="font-brand text-base text-brand-heading font-bold uppercase tracking-wider border-b border-[#302923]/15 pb-3">
                  Order Summary ({totalItems} items)
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
                          <SacredDiyaSvg className="h-7 w-7" />
                        )}
                        <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-ui-9 font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                          {l.qty}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-brand-heading block truncate">{l.product.name}</span>
                        <span className="text-ui-11 text-brand-gray">
                          {l.product.quantity}
                          {l.product.bundleQuantity && l.product.bundleQuantity > 1
                            ? ` · ${l.qty * l.product.bundleQuantity} boxes total`
                            : ""}
                        </span>
                      </div>
                      <span className="font-bold text-brand-primary text-sm tabular-nums shrink-0">₹{l.product.price * l.qty}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="pt-3 border-t border-[#302923]/15 space-y-2">
                  {cartCouponCodes.length > 0 && !appliedCoupon && (
                    <div className="rounded-lg bg-[#F5EFE3]/80 p-2.5 border border-dashed border-[#302923]/30 text-xs">
                      <p className="text-ui-11 font-bold text-brand-brown mb-1.5 flex items-center gap-1">
                        <Tag size={12} className="text-[#302923]" /> Available item coupon:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {cartCouponCodes.map((code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => handleApplyCoupon(code)}
                            className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-xs font-bold text-[#302923] border border-[#302923]/30 hover:bg-[#302923] hover:text-white transition shadow-xs"
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
                        className="flex-1 text-xs bg-white border border-brand-border rounded-[10px] px-3 py-2 text-brand-ink uppercase outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={checkoutCouponLoading}
                        className="btn-secondary px-3.5 py-2 text-xs font-semibold rounded-[10px] uppercase tracking-wider disabled:opacity-50"
                      >
                        {checkoutCouponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                  )}

                  {checkoutCouponError && (
                    <p className="text-ui-11 font-bold text-brand-primary">{checkoutCouponError}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-[#302923]/15 space-y-2 text-xs font-medium">
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
                  <div className="flex justify-between items-baseline pt-3 border-t border-[#302923]/15 text-base font-bold">
                    <span className="font-display text-lg text-brand-brown">Total Amount</span>
                    <span className="text-xl text-brand-primary font-bold">₹{finalTotal}</span>
                  </div>
                </div>
              </aside>

              <div className="bg-white p-4 rounded-xl border border-[#302923]/20 text-xs text-brand-brown space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-[#302923]">
                  <ShieldCheck size={16} />
                  <span>The HM Quality Guarantee</span>
                </div>
                <p className="text-ui-11 text-brand-charcoal/70 leading-relaxed font-sans">
                  Every parcel is packed with care in moisture-proof boxes and shipped directly from our workshop in Peelamedu, Coimbatore.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </InnerPage>
  );
}
