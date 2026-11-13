"use client";

import React from "react";
import { Check, Truck, ShieldCheck } from "lucide-react";

/**
 * Solid, authoritative, proper-size success checkmark badge
 */
export function SolidSuccessTick({ size = 64 }: { size?: number }) {
  return (
    <div
      className="inline-flex items-center justify-center rounded-full bg-emerald-600 text-white shadow-md ring-4 ring-emerald-500/20 shrink-0"
      style={{ width: size, height: size }}
      aria-label="Order Confirmed"
    >
      <Check size={size * 0.52} strokeWidth={3.5} className="text-white" />
    </div>
  );
}

/**
 * 100% Responsive, Luxury Sacred Dispatch Tracker
 * - Desktop: Clean horizontal connected progress tracker
 * - Mobile: Clean vertical timeline with connecting line
 */
export function SacredDispatchTracker() {
  const steps = [
    {
      title: "Order Consecrated",
      desc: "Payment verified via Razorpay",
      status: "done" as const,
      time: "Just Now",
    },
    {
      title: "Sacred Blessing & Packing",
      desc: "Damage-proof pack with Diya blessing",
      status: "active" as const,
      time: "Within 24 Hours",
    },
    {
      title: "Direct Coimbatore Dispatch",
      desc: "Handed to express courier",
      status: "pending" as const,
      time: "Day 1–2",
    },
    {
      title: "Doorstep Sacred Arrival",
      desc: "Fragrance delivered to your door",
      status: "pending" as const,
      time: "3–5 Days",
    },
  ];

  return (
    <div className="w-full bg-white border border-[#302923]/15 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#302923]/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#9E1830] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Truck size={17} />
          </div>
          <div>
            <h4 className="font-brand text-xs sm:text-sm font-bold uppercase tracking-wider text-[#302923]">
              Sacred Dispatch Journey
            </h4>
            <p className="text-[11px] text-[#746B62]">
              Direct dispatch from Peelamedu, Coimbatore
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          <ShieldCheck size={13} className="text-emerald-700" />
          <span>Live Tracking Ready</span>
        </span>
      </div>

      {/* ── Desktop Horizontal Stepper (hidden on mobile) ── */}
      <div className="hidden sm:block relative pt-2">
        {/* Background Connecting Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-[#EAE1D3] -translate-y-1/2 z-0" />
        {/* Active Progress Fill Line */}
        <div className="absolute top-6 left-6 w-[28%] h-0.5 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-700" />

        <div className="grid grid-cols-4 gap-3 relative z-10">
          {steps.map((st, idx) => {
            const isDone = st.status === "done";
            const isActive = st.status === "active";

            return (
              <div key={st.title} className="flex flex-col items-center text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                    isDone
                      ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                      : isActive
                      ? "bg-[#9E1830] text-white ring-4 ring-[#9E1830]/20 animate-pulse"
                      : "bg-[#F5EFE3] text-[#746B62] border border-[#302923]/25"
                  }`}
                >
                  {isDone ? <Check size={16} strokeWidth={3.5} /> : idx + 1}
                </div>

                <div className="mt-2.5">
                  <p className="font-sans text-xs font-bold text-[#302923] leading-snug">
                    {st.title}
                  </p>
                  <p className="text-[10px] text-[#746B62] mt-0.5 leading-tight">
                    {st.desc}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider ${
                      isDone
                        ? "text-emerald-700"
                        : isActive
                        ? "text-[#9E1830]"
                        : "text-[#746B62]"
                    }`}
                  >
                    {st.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile Vertical Timeline (hidden on sm+) ── */}
      <div className="sm:hidden space-y-4 relative pl-3">
        {/* Vertical Connecting Line */}
        <div className="absolute top-3 bottom-5 left-7 w-0.5 bg-[#EAE1D3] z-0" />

        {steps.map((st, idx) => {
          const isDone = st.status === "done";
          const isActive = st.status === "active";

          return (
            <div key={st.title} className="flex items-start gap-3.5 relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                  isDone
                    ? "bg-emerald-600 text-white ring-2 ring-emerald-100"
                    : isActive
                    ? "bg-[#9E1830] text-white ring-2 ring-[#9E1830]/20 animate-pulse"
                    : "bg-[#F5EFE3] text-[#746B62] border border-[#302923]/25"
                }`}
              >
                {isDone ? <Check size={14} strokeWidth={3.5} /> : idx + 1}
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-1">
                  <p className="font-sans text-xs font-bold text-[#302923]">
                    {st.title}
                  </p>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      isDone ? "text-emerald-700" : isActive ? "text-[#9E1830]" : "text-[#746B62]"
                    }`}
                  >
                    {st.time}
                  </span>
                </div>
                <p className="text-[11px] text-[#746B62] mt-0.5">
                  {st.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
