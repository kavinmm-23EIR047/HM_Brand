"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { useStore } from "@/components/store";

export function NotificationToast() {
  const { notification } = useStore();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out">
      <div className="bg-brand-ink text-white px-5 py-3 rounded-xl border border-brand-accent/40 shadow-2xl flex items-center gap-3 text-sm font-medium">
        <Sparkles className="text-brand-accent shrink-0" size={18} />
        <span>{notification}</span>
      </div>
    </div>
  );
}
