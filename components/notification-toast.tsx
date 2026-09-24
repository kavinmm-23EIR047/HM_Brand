"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { useStore } from "@/components/store";

export function NotificationToast() {
  const { notification } = useStore();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="bg-earthBrown text-sacredCream px-5 py-3 rounded-xl border-2 border-antiqueGold shadow-2xl flex items-center gap-3 text-sm font-semibold">
        <Sparkles className="text-marigold shrink-0" size={18} />
        <span>{notification}</span>
      </div>
    </div>
  );
}
