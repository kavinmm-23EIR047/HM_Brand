"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  Check,
  ArrowRight,
  Printer,
  ShieldCheck,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Sparkles,
  ShoppingBag,
  Clock,
} from "lucide-react";
import { SolidSuccessTick, SacredDispatchTracker } from "./sacred-delivery-animation";
import { SacredDiyaSvg } from "./sacred-icons";

export interface ConfirmedOrderData {
  id: string;
  orderNumber?: string;
  date?: string;
  items?: Array<{
    product: {
      name: string;
      slug: string;
      price: number;
      image?: string;
      quantity?: string;
      bundleQuantity?: number | null;
    };
    qty: number;
  }>;
  subtotal?: number;
  discountAmount?: number;
  couponCode?: string;
  shippingCost?: number;
  total: number;
  customer?: {
    fullName: string;
    phone: string;
    email: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    [key: string]: any;
  };
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
}

interface OrderSuccessViewProps {
  order: ConfirmedOrderData;
}

export function OrderSuccessView({ order }: OrderSuccessViewProps) {
  const [copied, setCopied] = useState(false);
  const displayId = order.orderNumber || order.id;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(displayId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formattedDate =
    order.date ||
    new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ── Top Hero Confirmation Banner ── */}
      <div className="surface-card p-6 sm:p-8 text-center relative overflow-hidden bg-gradient-to-b from-white to-[#FAF7F0] border border-[#302923]/15 shadow-sm">
        {/* Solid Proper Size Checkmark Badge */}
        <div className="mb-3.5 flex justify-center">
          <SolidSuccessTick size={64} />
        </div>

        {/* Regal Headline */}
        <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#9E1830] block mb-1">
          Sacred Purchase Consecrated
        </span>
        <h2 className="font-brand text-2xl sm:text-3xl font-bold text-[#302923] uppercase tracking-wide">
          Thank You For Your Sacred Order!
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#746B62] max-w-lg mx-auto leading-relaxed">
          Your order is confirmed. Our workshop in Peelamedu, Coimbatore has received your sacred basket for blessing and damage-proof dispatch.
        </p>

        {/* Order Reference Pill & 1-Click Copy */}
        <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 p-1.5 sm:px-4 sm:py-2 rounded-xl bg-white border border-[#302923]/20 shadow-2xs">
          <span className="text-xs text-[#746B62] font-semibold">Order Reference:</span>
          <span className="font-mono text-xs sm:text-sm font-bold text-[#9E1830] tracking-wider select-all">
            {displayId}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-[#302923] bg-[#F5EFE3] hover:bg-[#302923] hover:text-white rounded-md transition cursor-pointer border border-[#302923]/20"
            title="Copy reference number"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-600" />
                <span className="text-emerald-700 font-extrabold">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Payment Verification Badges */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-[11px]">
            <ShieldCheck size={13} className="text-emerald-700 shrink-0" />
            <span>100% Payment Verified via Razorpay</span>
          </span>
          {order.razorpayPaymentId && (
            <span className="text-[11px] font-mono text-[#746B62] bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
              Txn: {order.razorpayPaymentId}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[11px] text-[#746B62] font-medium">
            <Calendar size={12} /> {formattedDate}
          </span>
        </div>
      </div>

      {/* ── Main Responsive 2-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Columns): Live Dispatch Journey Tracker & Delivery Destination */}
        <div className="lg:col-span-7 space-y-6">
          {/* Responsive Dispatch Tracker */}
          <SacredDispatchTracker />

          {/* Delivery Destination Card */}
          <div className="surface-card p-5 sm:p-6 space-y-4 border border-[#302923]/15">
            <div className="flex items-center gap-2 border-b border-[#302923]/10 pb-3">
              <div className="w-7 h-7 rounded-lg bg-[#F5EFE3] text-[#9E1830] flex items-center justify-center shrink-0">
                <MapPin size={16} />
              </div>
              <h4 className="font-brand text-xs sm:text-sm font-bold uppercase tracking-wider text-[#302923]">
                Delivery Destination
              </h4>
            </div>

            {order.customer ? (
              <div className="space-y-3 text-xs leading-relaxed text-[#302923]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#746B62] block">
                    Recipient
                  </span>
                  <p className="text-sm font-bold text-[#302923]">{order.customer.fullName}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#746B62] block">
                    Shipping Address
                  </span>
                  <p className="font-medium text-[#302923]/90">
                    {order.customer.address}
                  </p>
                  <p className="font-medium text-[#302923]/90">
                    {order.customer.city}, {order.customer.state} - <strong>{order.customer.pincode}</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-[#302923]/10 flex flex-wrap gap-x-6 gap-y-1.5 text-xs font-medium text-[#746B62]">
                  <p className="flex items-center gap-1.5">
                    <Phone size={12} className="text-[#9E1830] shrink-0" />
                    <span>{order.customer.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail size={12} className="text-[#9E1830] shrink-0" />
                    <span className="truncate">{order.customer.email}</span>
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#746B62]">Delivery address logged with order.</p>
            )}

            <div className="pt-2">
              <div className="flex items-center gap-2.5 rounded-xl bg-[#F5EFE3]/80 p-3 text-xs text-[#302923]">
                <Clock size={16} className="text-[#9E1830] shrink-0" />
                <div>
                  <p className="font-bold text-[11px]">Estimated Pan-India Arrival</p>
                  <p className="text-[10px] text-[#746B62]">3 to 5 business days via sacred express courier dispatch.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 Columns): Items Summary, Totals & Action CTAs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sacred Basket Summary */}
          <div className="surface-card p-5 sm:p-6 space-y-4 border border-[#302923]/15">
            <div className="flex items-center justify-between border-b border-[#302923]/10 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag size={17} className="text-[#9E1830]" />
                <h4 className="font-brand text-xs sm:text-sm font-bold uppercase tracking-wider text-[#302923]">
                  Basket Items ({order.items?.length || 0})
                </h4>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Paid: ₹{order.total}
              </span>
            </div>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-[#302923]/10">
              {order.items && order.items.length > 0 ? (
                order.items.map((line, idx) => (
                  <div key={idx} className="pt-2.5 flex items-center gap-3 text-xs">
                    <div className="relative w-11 h-11 bg-white rounded-lg border border-[#302923]/15 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                      {line.product.image ? (
                        <Image
                          src={line.product.image}
                          alt={line.product.name}
                          fill
                          sizes="44px"
                          className="object-contain"
                        />
                      ) : (
                        <SacredDiyaSvg className="h-6 w-6" />
                      )}
                      <span className="absolute -top-1 -right-1 bg-[#9E1830] text-white text-[9px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                        {line.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-[#302923] block truncate text-xs">
                        {line.product.name}
                      </span>
                      <span className="text-[10px] text-[#746B62]">
                        {line.product.quantity || "Standard Pack"}
                        {line.product.bundleQuantity && line.product.bundleQuantity > 1
                          ? ` · ${line.qty * line.product.bundleQuantity} boxes`
                          : ""}
                      </span>
                    </div>
                    <span className="font-bold text-[#9E1830] text-xs tabular-nums shrink-0">
                      ₹{line.product.price * line.qty}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#746B62] py-2">Items confirmed and recorded.</p>
              )}
            </div>

            {/* Pricing totals */}
            <div className="pt-3 border-t border-[#302923]/15 space-y-1.5 text-xs">
              {order.subtotal !== undefined && (
                <div className="flex justify-between text-[#746B62]">
                  <span>Basket Subtotal</span>
                  <span className="font-bold text-[#302923]">₹{order.subtotal}</span>
                </div>
              )}
              {order.discountAmount ? (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Coupon Discount ({order.couponCode || "COUPON"})</span>
                  <span>-₹{order.discountAmount}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-[#746B62]">
                <span>Pan-India Sacred Courier</span>
                <span className="font-bold text-emerald-700 uppercase">FREE</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#302923]/15 text-sm font-bold">
                <span className="font-brand uppercase tracking-wider text-[#302923]">
                  Total Amount Paid
                </span>
                <span className="text-base text-[#9E1830] font-bold">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs Card */}
          <div className="surface-card p-5 space-y-3 border border-[#302923]/15">
            <Link
              href="/account"
              className="btn-primary w-full py-3 text-center text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-2 shadow-xs"
            >
              <span>View in Account &amp; Orders</span>
              <ArrowRight size={14} />
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="btn-outline-earth py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-md inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer size={13} />
                <span>Print Receipt</span>
              </button>

              <Link
                href="/shop"
                className="btn-outline-earth py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-md inline-flex items-center justify-center gap-1.5"
              >
                <Sparkles size={13} className="text-[#9E1830]" />
                <span>Shop More</span>
              </Link>
            </div>

            <p className="text-[10px] text-center text-[#746B62] pt-1">
              Order confirmation &amp; invoice dispatched to your email and phone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
