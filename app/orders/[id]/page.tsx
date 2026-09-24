"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Sparkles, CheckCircle2, Truck, Package, Clock, ArrowRight, MapPin } from "lucide-react";
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
}

export default function OrderTrackingPage() {
  const params = useParams();
  const id = (params?.id as string) || "HM-2026-88219";
  const [order, setOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`hm_order_${id}`);
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  const timeline = [
    { step: "01", name: "Order Placed", date: "Today", completed: true, current: false },
    { step: "02", name: "Blessed & Packed", date: "Coimbatore Hub", completed: true, current: true },
    { step: "03", name: "Dispatched", date: "In Transit", completed: false, current: false },
    { step: "04", name: "Out for Delivery", date: "Local Delivery", completed: false, current: false },
    { step: "05", name: "Delivered to Sanctum", date: "Expected in 3-4 Days", completed: false, current: false },
  ];

  return (
    <InnerPage
      eyebrow="ORDER STATUS & TRACKING"
      title="Your Sacred Collection Is on Its Way"
      subtitle={`Order Reference: ${id} • Handcrafted in Peelamedu, Coimbatore.`}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Top Success Banner with Mascot */}
        <div className="bg-[#FFF8E7] rounded-3xl border-2 border-[#6B4226] p-8 sm:p-12 shadow-solid-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <MascotDelivery size={200} />
          </div>

          <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
            <span className="bg-[#588157] text-[#FFF8E7] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              ✓ ORDER CONFIRMED
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#6B4226] font-bold">
              Thank You for Welcoming HM Agarbattis
            </h2>
            <p className="text-xs sm:text-sm text-[#292524]/80 leading-relaxed font-sans max-w-xl">
              Your sacred order has been received and our artisans in Coimbatore are lovingly packing your pure fragrances, camphor, and sambrani.
            </p>
          </div>
        </div>

        {/* Timeline Stepper */}
        <section className="bg-[#FFF8E7] rounded-2xl border-2 border-[#C89B3C]/40 p-8 shadow-sm">
          <h3 className="font-display text-2xl text-[#6B4226] font-bold mb-8 flex items-center gap-2">
            <Truck className="text-[#E85D04]" size={22} />
            Delivery Timeline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative">
            {timeline.map((t, idx) => (
              <div key={t.step} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 ${
                    t.completed
                      ? "bg-[#588157] border-[#588157] text-[#FFF8E7]"
                      : t.current
                      ? "bg-[#E85D04] border-[#6B4226] text-[#FFF8E7] animate-pulse"
                      : "bg-[#FFF8E7] border-[#C89B3C] text-[#6B4226]/60"
                  }`}
                >
                  {t.completed ? "✓" : t.step}
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-[#6B4226]">{t.name}</h4>
                  <p className="text-[11px] text-[#292524]/60 font-sans">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Details & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer & Shipping Details */}
          <div className="bg-[#FFF8E7] p-7 rounded-2xl border-2 border-[#C89B3C]/40 space-y-4">
            <h3 className="font-display text-2xl text-[#6B4226] font-bold border-b border-[#C89B3C]/30 pb-3">
              Delivery Information
            </h3>
            <div className="space-y-2 text-xs text-[#292524]/80 font-medium">
              <p>
                <strong className="text-[#6B4226]">Recipient:</strong>{" "}
                {order?.customer?.fullName || "Devotee"}
              </p>
              <p>
                <strong className="text-[#6B4226]">Contact:</strong>{" "}
                {order?.customer?.phone || "+91 98765 43210"}
              </p>
              <p>
                <strong className="text-[#6B4226]">Address:</strong>{" "}
                {order?.customer?.address || "Peelamedu, Coimbatore"}, {order?.customer?.city || "Coimbatore"},{" "}
                {order?.customer?.state || "Tamil Nadu"} - {order?.customer?.pincode || "641028"}
              </p>
              <p>
                <strong className="text-[#6B4226]">Payment Mode:</strong>{" "}
                <span className="uppercase text-[#E85D04] font-bold">
                  {order?.customer?.paymentMethod || "UPI"}
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
                  <div key={idx} className="pt-2 flex justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#6B4226] block">{it.product.name}</span>
                      <span className="text-[11px] text-[#292524]/60">
                        Qty: {it.qty} • {it.product.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-[#B23A48]">₹{it.product.price * it.qty}</span>
                  </div>
                ))
              ) : (
                <div className="pt-2 flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#6B4226] block">HM Super Series Agarbatti</span>
                    <span className="text-[11px] text-[#292524]/60">Qty: 1 • 150g</span>
                  </div>
                  <span className="font-bold text-[#B23A48]">₹150</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#6B4226]/30 flex justify-between items-baseline font-bold">
              <span className="font-display text-lg text-[#6B4226]">Total Paid</span>
              <span className="text-xl text-[#E85D04]">₹{order?.total || 150}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <Link
            href="/shop"
            className="btn-saffron px-8 py-4 rounded-md text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-solid-sm"
          >
            <span>Explore More Sacred Essentials</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </InnerPage>
  );
}
