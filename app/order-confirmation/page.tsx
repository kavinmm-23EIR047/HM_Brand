"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { MascotDelivery } from "@/components/mascot-art";

export default function ConfirmationPage() {
  const router = useRouter();
  const [lastId, setLastId] = useState("HM-2026-88219");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hm_last_order_id");
      if (saved) {
        setLastId(saved);
        router.replace(`/orders/${saved}`);
      }
    } catch (e) {
      console.error(e);
    }
  }, [router]);

  return (
    <InnerPage
      eyebrow="ORDER CONFIRMATION"
      title="Your Sacred Journey Begins"
      subtitle="Your order has been placed successfully."
    >
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-6">
        <MascotDelivery size={180} />
        <h2 className="font-display text-3xl text-[#6B4226] font-bold">
          Order Reference: {lastId}
        </h2>
        <Link
          href={`/orders/${lastId}`}
          className="btn-saffron px-8 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
        >
          <span>Track Your Order</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </InnerPage>
  );
}
