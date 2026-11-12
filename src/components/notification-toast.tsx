"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingBag, Heart, CheckCircle2, LogIn, LogOut,
  MapPin, Tag, Sparkles, UserCheck, X,
} from "lucide-react";
import { useStore } from "@/components/store";

/* Pick an icon based on message content */
function getIcon(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("basket") || m.includes("added") || m.includes("cart"))
    return <ShoppingBag size={16} className="shrink-0" />;
  if (m.includes("wishlist") || m.includes("saved"))
    return <Heart size={16} className="shrink-0 fill-current" />;
  if (m.includes("coupon") || m.includes("discount") || m.includes("applied"))
    return <Tag size={16} className="shrink-0" />;
  if (m.includes("address") || m.includes("delivery"))
    return <MapPin size={16} className="shrink-0" />;
  if (m.includes("logout") || m.includes("logged out"))
    return <LogOut size={16} className="shrink-0" />;
  if (m.includes("welcome back") || m.includes("login"))
    return <LogIn size={16} className="shrink-0" />;
  if (m.includes("welcome to"))
    return <UserCheck size={16} className="shrink-0" />;
  if (m.includes("updated") || m.includes("success") || m.includes("deleted") || m.includes("removed"))
    return <CheckCircle2 size={16} className="shrink-0" />;
  return <Sparkles size={16} className="shrink-0" />;
}

const AUTO_DISMISS_MS = 3200;

export function NotificationToast() {
  const { notification } = useStore();
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState<string | null>(null);

  /* Slide-in when notification arrives */
  useEffect(() => {
    if (notification) {
      setDisplayed(notification);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [notification]);

  /* Slide-out before unmounting */
  const dismiss = () => setVisible(false);

  if (!displayed) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`fixed top-4 left-1/2 z-[9999] -translate-x-1/2 transition-all ease-out ${
        visible
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-8 opacity-0 scale-95 pointer-events-none"
      }`}
      style={{ width: "min(92vw, 420px)", transitionDuration: "350ms" }}
      onTransitionEnd={() => { if (!visible) setDisplayed(null); }}
    >
      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-border bg-white shadow-[0_8px_28px_rgba(23,59,58,0.14)]">

        {/* Top accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-primary" />

        {/* Main content */}
        <div className="flex items-center gap-3 px-4 py-3">

          {/* Icon bubble */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-brand-accent shadow-sm">
            {getIcon(displayed)}
          </div>

          {/* Text */}
          <p className="flex-1 text-sm font-semibold text-brand-ink leading-snug line-clamp-2">
            {displayed}
          </p>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss notification"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-brand-surface-soft hover:text-brand-ink transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-brand-surface-soft">
          <div
            className="h-full bg-brand-primary origin-left"
            style={{
              animation: visible
                ? `hm-toast-progress ${AUTO_DISMISS_MS}ms linear forwards`
                : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
