'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Bell, BellOff, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

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
  const [dismissed, setDismissed] = useState(false);

  // If already subscribed or unsupported or blocked or dismissed, don't show prompt
  if (!isSupported || isSubscribed || permission === 'denied' || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 bg-[#FFFDF8] border-2 border-[#C89B3C]/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9E1830] to-[#7A1224] text-[#DFB75A] flex items-center justify-center shrink-0 shadow-md">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-serif text-sm font-bold text-[#302923] tracking-wide flex items-center gap-1.5">
            {role === 'ADMIN' ? 'Admin Live Order Alerts' : 'Instant Order Tracking & Blessings'}
            <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
          </h4>
          <p className="text-xs text-[#746B62] mt-1 leading-relaxed">
            {role === 'ADMIN'
              ? 'Receive real-time sound & push notifications for incoming orders even when device is locked.'
              : 'Get instant cross-device updates for parcel dispatch, festival offers, and Coimbatore blessings.'}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => subscribeUser(role, userId)}
              disabled={loading}
              className="px-3 py-1.5 bg-[#9E1830] hover:bg-[#7A1224] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#DFB75A]" />
              {loading ? 'Enabling...' : 'Enable Notifications'}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-2.5 py-1.5 text-xs text-[#746B62] hover:text-[#302923] font-medium transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
