"use client";

import React from "react";
import { Truck, ShieldCheck } from "lucide-react";

/**
 * Animated Success Checkmark Badge:
 * - Springy pop-in entrance
 * - Self-drawing animated checkmark SVG stroke
 * - Outer expanding glowing aura rings
 */
export function SolidSuccessTick({
  size = 68,
  onClick,
}: {
  size?: number;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 ${
        onClick ? "cursor-pointer group" : ""
      }`}
      title={onClick ? "Click to celebrate with confetti!" : undefined}
    >
      {/* Outer pulsing ripple ring */}
      <div
        className="absolute rounded-full bg-emerald-500/25 animate-ping pointer-events-none"
        style={{
          width: size * 1.35,
          height: size * 1.35,
          animationDuration: "2.4s",
        }}
      />

      {/* Outer soft glowing aura */}
      <div
        className="absolute rounded-full bg-emerald-400/25 blur-md pointer-events-none"
        style={{ width: size * 1.45, height: size * 1.45 }}
      />

      {/* Main green badge with spring pop-in */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-emerald-500 text-white shadow-xl ring-4 ring-emerald-400/30 transition-transform duration-300 group-hover:scale-105 active:scale-95"
        style={{
          width: size,
          height: size,
          animation: "circlePop 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        }}
        aria-label="Order Confirmed"
      >
        {/* Animated Drawing SVG Checkmark */}
        <svg
          viewBox="0 0 52 52"
          className="overflow-visible"
          style={{ width: size * 0.58, height: size * 0.58 }}
        >
          <circle
            cx="26"
            cy="26"
            r="23"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="3"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 27 l8 8 l16 -16"
            style={{
              strokeDasharray: 54,
              strokeDashoffset: 54,
              animation: "checkmarkDraw 0.65s ease-out 0.22s forwards",
            }}
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * 100% Responsive, Luxury Sacred Dispatch Tracker
 * - Desktop: Clean horizontal connected progress tracker with animated step 1 tick
 * - Mobile: Clean vertical timeline with connecting line
 */
export function SacredDispatchTracker({
  onTickClick,
}: {
  onTickClick?: () => void;
} = {}) {
  const steps = [
    {
      title: "Order Consecrated",
      desc: "Payment verified via Razorpay",
      status: "done" as const,
      time: "Just Now",
    },
    {
      title: "Workshop Packing & Quality Check",
      desc: "Careful moisture-proof packaging",
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
      title: "Doorstep Delivery",
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
              Dispatch &amp; Delivery Progress
            </h4>
            <p className="text-[11px] text-[#4A3F35]">
              Direct dispatch from Peelamedu, Coimbatore
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
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
                  onClick={isDone ? onTickClick : undefined}
                  role={isDone && onTickClick ? "button" : undefined}
                  title={isDone && onTickClick ? "Click to celebrate with confetti!" : undefined}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                    isDone
                      ? `bg-emerald-600 text-white ring-4 ring-emerald-200 shadow-md ${
                          onTickClick ? "cursor-pointer hover:scale-110 active:scale-95" : ""
                        }`
                      : isActive
                      ? "bg-[#9E1830] text-white ring-4 ring-[#9E1830]/20 animate-pulse"
                      : "bg-[#F5EFE3] text-[#4A3F35] border border-[#302923]/25"
                  }`}
                  style={
                    isDone
                      ? {
                          animation:
                            "circlePop 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                        }
                      : undefined
                  }
                >
                  {isDone ? (
                    <svg viewBox="0 0 24 24" className="w-4 h-4 overflow-visible">
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13 l4 4 l10 -10"
                        style={{
                          strokeDasharray: 24,
                          strokeDashoffset: 24,
                          animation: "checkmarkDraw 0.5s ease-out 0.2s forwards",
                        }}
                      />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>

                <div className="mt-2.5">
                  <p className="font-sans text-xs font-bold text-[#302923] leading-snug">
                    {st.title}
                  </p>
                  <p className="text-[10px] text-[#4A3F35] mt-0.5 leading-tight">
                    {st.desc}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider ${
                      isDone
                        ? "text-emerald-700"
                        : isActive
                        ? "text-[#9E1830]"
                        : "text-[#4A3F35]"
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
                onClick={isDone ? onTickClick : undefined}
                role={isDone && onTickClick ? "button" : undefined}
                title={isDone && onTickClick ? "Click to celebrate with confetti!" : undefined}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs transition-all ${
                  isDone
                    ? `bg-emerald-600 text-white ring-2 ring-emerald-200 shadow-sm ${
                        onTickClick ? "cursor-pointer hover:scale-110 active:scale-95" : ""
                      }`
                    : isActive
                    ? "bg-[#9E1830] text-white ring-2 ring-[#9E1830]/20 animate-pulse"
                    : "bg-[#F5EFE3] text-[#4A3F35] border border-[#302923]/25"
                }`}
                style={
                  isDone
                    ? {
                        animation:
                          "circlePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                      }
                    : undefined
                }
              >
                {isDone ? (
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 overflow-visible">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13 l4 4 l10 -10"
                      style={{
                        strokeDasharray: 24,
                        strokeDashoffset: 24,
                        animation: "checkmarkDraw 0.5s ease-out 0.2s forwards",
                      }}
                    />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-1">
                  <p className="font-sans text-xs font-bold text-[#302923]">
                    {st.title}
                  </p>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      isDone ? "text-emerald-700" : isActive ? "text-[#9E1830]" : "text-[#4A3F35]"
                    }`}
                  >
                    {st.time}
                  </span>
                </div>
                <p className="text-[11px] text-[#4A3F35] mt-0.5">
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
