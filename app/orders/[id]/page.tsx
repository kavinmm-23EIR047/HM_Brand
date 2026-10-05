"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Sparkles, CheckCircle2, Truck, Package, Clock, ArrowRight, MapPin, Copy, Check, FileText } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { MascotDelivery } from "@/components/mascot-art";
import { AuspiciousSeal } from "@/components/divine-motifs";

interface OrderRecord {
  id: string;
  date: string;
  items: { product: { name: string; price: number; quantity: string; category: string }; qty: number }[];
  total: number;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    paymentMethod: string;
  };
  status: string;
  courierName?: string;
  trackingNumber?: string;
  courierNote?: string;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const id = (params?.id as string) || "HM-2026-88219";
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Check localStorage first for instant display
    try {
      const saved = localStorage.getItem(`hm_order_${id}`);
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Fetch latest live order status & courier details from backend API
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const fetchOrder = () => {
      fetch(`${API_URL}/orders/${id}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            const ord = json.data;
            let parsedAddress: any = {};
            try {
              parsedAddress = typeof ord.shippingAddress === "string" ? JSON.parse(ord.shippingAddress) : (ord.shippingAddress || {});
            } catch {}

            setOrder({
              id: ord.orderNumber || ord.id,
              date: new Date(ord.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              items: (ord.items || []).map((it: any) => ({
                product: {
                  name: it.productNameSnapshot || it.productName || (it.product && it.product.name) || "Sacred Fragrance Pack",
                  price: Number(it.unitPriceSnapshot || it.unitPrice || 0),
                  quantity: "Sacred Pack",
                  category: "Spiritual Fragrance",
                },
                qty: it.quantity || 1,
              })),
              total: Number(ord.totalAmount || 0),
              customer: {
                fullName: parsedAddress.recipientName || parsedAddress.name || "Devotee",
                phone: ord.customerPhone || parsedAddress.phone || "",
                email: ord.customerEmail || "",
                address: parsedAddress.street || parsedAddress.address || "",
                city: parsedAddress.city || "",
                state: parsedAddress.state || "",
                pincode: parsedAddress.postalCode || parsedAddress.pincode || "",
                paymentMethod: ord.paymentMethod || "COD",
              },
              status: (ord.status || "CONFIRMED").toUpperCase(),
              courierName: parsedAddress.courierName || ord.courierName || "",
              trackingNumber: parsedAddress.trackingNumber || ord.trackingNumber || "",
              courierNote: parsedAddress.courierNote || ord.courierNote || "",
            });
          }
        })
        .catch((err) => {
          console.error("Failed to fetch order from backend", err);
        });
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 4000); // Live poll for status & tracking updates
    return () => clearInterval(interval);
  }, [id]);

  const currentStatus = (order?.status || "CONFIRMED").toUpperCase();
  const isReturned = currentStatus === "RETURNED" || currentStatus === "CANCELLED";
  const isDispatched = currentStatus === "DISPATCHED" || currentStatus === "SHIPPED" || currentStatus === "DELIVERED";
  const isReadyToShip = currentStatus === "READY_TO_SHIP" || currentStatus === "PROCESSING" || isDispatched;

  const timeline = [
    {
      step: "01",
      name: "Confirmed",
      date: "Order Confirmed",
      completed: true,
      current: !isReadyToShip && !isReturned,
    },
    {
      step: "02",
      name: "Ready to Ship",
      date: "Blessed & Packed in Hub",
      completed: isReadyToShip,
      current: isReadyToShip && !isDispatched && !isReturned,
    },
    {
      step: "03",
      name: "Dispatched",
      date: order?.courierName ? `Via ${order.courierName}` : "In Transit via Courier",
      completed: isDispatched,
      current: isDispatched && !isReturned,
    },
    {
      step: "04",
      name: isReturned ? "Returned ↩️" : "Delivered ✅",
      date: isReturned ? "Returned to Hub" : "Doorstep Delivery",
      completed: isReturned ? false : currentStatus === "DELIVERED",
      current: isReturned,
      isReturnedStep: isReturned,
    },
  ];

  return (
    <InnerPage
      eyebrow="ORDER STATUS & LIVE TRACKING"
      title="Track Your Sacred Collection"
      subtitle={`Order Reference: ${id} • Handcrafted in Peelamedu, Coimbatore.`}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Top Success Banner with Mascot */}
        <div className="bg-[#FFF8E7] rounded-3xl border-2 border-[#6B4226] p-8 sm:p-12 shadow-solid-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <MascotDelivery size={200} />
          </div>

          <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
            <span
              className={`text-[#FFF8E7] text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider inline-block ${
                isReturned
                  ? "bg-rose-700"
                  : isDispatched
                  ? "bg-purple-800"
                  : isReadyToShip
                  ? "bg-blue-800"
                  : "bg-[#588157]"
              }`}
            >
              ✓ STAGE: {currentStatus.replace(/_/g, " ")}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#6B4226] font-bold">
              {isDispatched
                ? "Your Order Has Been Dispatched!"
                : isReadyToShip
                ? "Your Order Is Ready for Shipment!"
                : isReturned
                ? "Order Returned Status Update"
                : "Thank You for Welcoming HM Agarbattis"}
            </h2>
            <p className="text-xs sm:text-sm text-[#292524]/80 leading-relaxed font-sans max-w-xl">
              {isDispatched
                ? "Your order has been handed over to our courier partner. You can view the tracking consignment number and instructions below."
                : isReadyToShip
                ? "Our artisans in Coimbatore have carefully blessed and packed your pure fragrances. It will be picked up by courier shortly."
                : "Your order is confirmed and being prepared with love and reverence in our Coimbatore workshop."}
            </p>
          </div>
        </div>

        {/* Timeline Stepper (4 Stages: Confirmed -> Ready to Ship -> Dispatched -> Returned/Delivered) */}
        <section className="bg-[#FFF8E7] rounded-3xl border-2 border-[#C89B3C]/40 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#C89B3C]/30 pb-4">
            <h3 className="font-display text-2xl text-[#6B4226] font-bold flex items-center gap-2">
              <Truck className="text-[#E85D04]" size={22} />
              <span>Delivery Stage Progress</span>
            </h3>
            <span className="text-xs font-bold text-[#A90C35] bg-[#F4D35E]/30 px-3 py-1 rounded-full border border-[#C89B3C]/40">
              Current: {currentStatus.replace(/_/g, " ")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-4 relative">
            {timeline.map((t) => (
              <div key={t.step} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-extrabold border-2 shrink-0 transition-all shadow-sm ${
                    t.completed
                      ? "bg-[#588157] border-[#588157] text-[#FFF8E7]"
                      : t.current
                      ? "bg-[#A90C35] border-[#6B4226] text-[#FFF8E7] animate-pulse ring-4 ring-[#A90C35]/20"
                      : "bg-[#FFF8E7] border-[#C89B3C]/60 text-[#6B4226]/50"
                  }`}
                >
                  {t.completed ? "✓" : t.step}
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-[#6B4226]">{t.name}</h4>
                  <p className="text-[11px] text-[#292524]/70 font-sans font-semibold mt-0.5">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COURIER DISPATCH & TRACKING CONSIGNMENT CARD */}
        {(order?.trackingNumber || order?.courierName || isDispatched) && (
          <section className="bg-gradient-to-r from-[#6B4226] to-[#4D2E1B] text-[#FFF8E7] rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#C89B3C]/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C89B3C]/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F4D35E]/20 border border-[#C89B3C]/50 flex items-center justify-center text-[#F4D35E] shadow-inner">
                  <Truck size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-[#F4D35E] uppercase tracking-widest block">
                    🚚 COURIER DISPATCH TRACKING
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#FFF8E7]">
                    {order?.courierName || "Courier Partner Express"}
                  </h3>
                </div>
              </div>

              {order?.trackingNumber && (
                <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#C89B3C]/50 flex items-center gap-3">
                  <div>
                    <span className="text-[10px] text-[#FFF8E7]/80 font-bold block uppercase">
                      Tracking Consignment No
                    </span>
                    <span className="font-mono text-base font-extrabold text-[#F4D35E] tracking-wider">
                      {order.trackingNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (order.trackingNumber) {
                        navigator.clipboard.writeText(order.trackingNumber);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 3000);
                      }
                    }}
                    className="p-2 rounded-xl bg-[#F4D35E] hover:bg-amber-300 text-[#6B4226] font-extrabold text-xs transition flex items-center gap-1 shadow-sm shrink-0"
                    title="Copy Tracking Number"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              )}
            </div>

            {order?.courierNote && (
              <div className="bg-black/20 p-4 rounded-2xl border border-[#C89B3C]/30 space-y-1">
                <span className="text-[11px] font-bold text-[#F4D35E] uppercase flex items-center gap-1.5">
                  <FileText size={13} /> Admin Pickup & Dispatch Note:
                </span>
                <p className="text-xs text-[#FFF8E7]/90 leading-relaxed italic">
                  &quot;{order.courierNote}&quot;
                </p>
              </div>
            )}

            <p className="text-[11px] text-[#FFF8E7]/80 leading-normal">
              * You can collect or track your parcel directly using Tracking No{" "}
              <strong className="text-[#F4D35E] font-mono font-bold">{order?.trackingNumber || "provided above"}</strong> at your local courier hub or branch.
            </p>
          </section>
        )}

        {/* Order Details & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer & Shipping Details */}
          <div className="bg-[#FFF8E7] p-7 rounded-2xl border-2 border-[#C89B3C]/40 space-y-4">
            <h3 className="font-display text-2xl text-[#6B4226] font-bold border-b border-[#C89B3C]/30 pb-3">
              Delivery Information
            </h3>
            <div className="space-y-2.5 text-xs text-[#292524]/80 font-medium">
              <p>
                <strong className="text-[#6B4226]">Recipient Name:</strong>{" "}
                {order?.customer?.fullName || "Devotee"}
              </p>
              <p>
                <strong className="text-[#6B4226]">Contact Phone:</strong>{" "}
                {order?.customer?.phone || "+91 98765 43210"}
              </p>
              <p>
                <strong className="text-[#6B4226]">Email Address:</strong>{" "}
                {order?.customer?.email || "customer@example.com"}
              </p>
              <p>
                <strong className="text-[#6B4226]">Full Address:</strong>{" "}
                {order?.customer?.address ? (
                  `${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`
                ) : (
                  "Peelamedu, Coimbatore, Tamil Nadu - 641028"
                )}
              </p>
              <p>
                <strong className="text-[#6B4226]">Payment Method:</strong>{" "}
                <span className="uppercase text-[#A90C35] font-extrabold bg-[#F4D35E]/30 px-2 py-0.5 rounded border border-[#C89B3C]/30">
                  {order?.customer?.paymentMethod || "COD"}
                </span>
              </p>
            </div>
          </div>

          {/* Items In Order */}
          <div className="bg-[#FFF8E7] p-7 rounded-2xl border-2 border-[#C89B3C]/40 space-y-4">
            <h3 className="font-display text-2xl text-[#6B4226] font-bold border-b border-[#C89B3C]/30 pb-3">
              Sacred Items
            </h3>
            <div className="space-y-3 divide-y divide-[#C89B3C]/20 max-h-52 overflow-y-auto pr-1">
              {order?.items && order.items.length > 0 ? (
                order.items.map((it, idx) => (
                  <div key={idx} className="pt-2 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-[#6B4226] block">{it.product.name}</span>
                      <span className="text-[11px] text-[#292524]/60">
                        Qty: {it.qty} • {it.product.quantity}
                      </span>
                    </div>
                    <span className="font-extrabold text-[#A90C35]">₹{it.product.price * it.qty}</span>
                  </div>
                ))
              ) : (
                <div className="pt-2 flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#6B4226] block">HM Super Series Agarbatti</span>
                    <span className="text-[11px] text-[#292524]/60">Qty: 1 • 150g</span>
                  </div>
                  <span className="font-extrabold text-[#A90C35]">₹150</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#6B4226]/30 flex justify-between items-baseline font-bold">
              <span className="font-display text-lg text-[#6B4226]">Total Paid</span>
              <span className="text-xl text-[#A90C35]">₹{order?.total || 150}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <Link
            href="/shop"
            className="btn-saffron px-8 py-4 rounded-xl text-xs font-extrabold tracking-wider uppercase inline-flex items-center gap-2 shadow-solid-sm"
          >
            <span>Explore More Sacred Essentials</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </InnerPage>
  );
}
