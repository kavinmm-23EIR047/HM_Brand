'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Bell, ShieldCheck, Sparkles, X } from 'lucide-react';

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BCcqFjOm1d-yuRV3UTShIDofH1d_iugkulPeK31kixpC_5chAfB4Wg5cIUad6JvRRadnpTyTIO4E1KU8kkLi0NA';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function useWebPush() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Register SW
      navigator.serviceWorker
        .register('/sw.js')
        .then(async (registration) => {
          const sub = await registration.pushManager.getSubscription();
          setIsSubscribed(Boolean(sub));
        })
        .catch((err) => {
          console.warn('[WebPush] SW registration warning:', err);
        });
    }
  }, []);

  const subscribeUser = useCallback(
    async (role: 'ADMIN' | 'CUSTOMER' = 'CUSTOMER', userId?: string) => {
      if (!isSupported) return false;
      setLoading(true);

      try {
        const perm = await Notification.requestPermission();
        setPermission(perm);

        if (perm !== 'granted') {
          setLoading(false);
          return false;
        }

        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedKey as unknown as BufferSource,
          });
        }

        const subJson = subscription.toJSON();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

        await fetch(`${apiUrl}/notifications/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription: {
              endpoint: subJson.endpoint,
              keys: subJson.keys,
            },
            role,
            userId,
          }),
        });

        setIsSubscribed(true);
        setLoading(false);
        return true;
      } catch (error) {
        console.error('[WebPush] Subscription error:', error);
        setLoading(false);
        return false;
      }
    },
    [isSupported]
  );

  return {
    isSupported,
    permission,
    isSubscribed,
    loading,
    subscribeUser,
  };
}

export function WebPushNotificationPrompt({
  role = 'CUSTOMER',
  userId,
}: {
  role?: 'ADMIN' | 'CUSTOMER';
  userId?: string;
}) {
  const { isSupported, permission, isSubscribed, loading, subscribeUser } = useWebPush();
  const [dismissed, setDismissed] = useState(true);

  // Check session storage on mount so user isn't re-prompted during the same session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDismissed = sessionStorage.getItem('hm_push_prompt_dismissed');
      if (!isDismissed) {
        setDismissed(false);
      }
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('hm_push_prompt_dismissed', 'true');
    } catch {}
  };

  // If already subscribed, unsupported, blocked, or dismissed, do not render
  if (!isSupported || isSubscribed || permission === 'denied' || dismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Notification prompt"
      className="animate-notification-enter fixed left-1/2 z-[60] w-[calc(100%-16px)] max-w-[720px] -translate-x-1/2 overflow-hidden rounded-2xl border border-[#C89B3C]/45 bg-[#FFFDF8] shadow-[0_10px_30px_rgba(48,41,35,0.18)] font-sans"
      style={{ top: 'max(8px, env(safe-area-inset-top))' }}
    >
      <div className="flex flex-col gap-2 px-3 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F8E9E8] text-[#9E1830]">
            <Bell className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <span className="flex items-center gap-1 whitespace-nowrap font-bold leading-tight text-[#302923]">
              {role === 'ADMIN' ? 'Live Order Alerts' : 'Order Tracking & Offers'}
              <Sparkles className="w-3 h-3 text-[#C89B3C] shrink-0" />
            </span>
            <p className="truncate pt-0.5 text-[11px] leading-tight text-[#746B62]">
              {role === 'ADMIN'
                ? 'Sound alerts for incoming orders when locked.'
                : 'Get instant dispatch updates & festival blessings.'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={async () => {
              const ok = await subscribeUser(role, userId);
              if (ok) handleDismiss();
            }}
            disabled={loading}
            className="flex min-h-8 items-center gap-1 rounded-full bg-[#9E1830] px-3 text-[11px] font-bold text-white shadow-xs transition-all hover:bg-[#7A1224] active:scale-95 disabled:opacity-50 sm:px-3.5 sm:text-xs"
          >
            <ShieldCheck className="w-3 h-3 text-[#DFB75A]" />
            <span>{loading ? 'Enabling...' : 'Allow'}</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="px-2 py-1 text-[11px] font-medium text-[#746B62] transition-colors hover:text-[#302923] sm:text-xs"
          >
            Later
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close notification bar"
            className="rounded-full p-1 text-[#746B62] transition-colors hover:bg-black/5 hover:text-[#302923]"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
