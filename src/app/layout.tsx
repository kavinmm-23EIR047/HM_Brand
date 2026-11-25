import type { Metadata, Viewport } from "next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./globals.css";
import { StoreProvider } from "@/components/store";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchModal } from "@/components/search-modal";
import { NotificationToast } from "@/components/notification-toast";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { WebPushNotificationPrompt } from "@/components/web-push-manager";
import { ChatbotWidget } from "@/components/chatbot-widget";
import { LeftAgarbattis } from "@/components/left-agarbattis";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "HM Agarbattis | Handcrafted Incense, Pure Camphor & Sambrani — Coimbatore",
  description:
    "Handmade natural flower agarbattis, pure Bhimseni camphor, and traditional cup sambrani made in Peelamedu, Coimbatore. Safe, soot-free incense for daily morning pooja.",
  metadataBase: new URL("https://www.hmagarbattis.com"),
  keywords:
    "HM Agarbattis, incense sticks Coimbatore, pure bhimseni camphor, sambrani cups, kesar loban, daily pooja essentials, pure botanical agarbatti",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="w-full overflow-x-clip"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Cinzel:wght@400;500;600;700;800;900&family=Manrope:wght@400;500;600;700;800&family=Marcellus&family=Outfit:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-brand-surface text-brand-ink antialiased min-h-screen w-full max-w-full overflow-x-clip font-sans"
        suppressHydrationWarning
      >
        <StoreProvider>
          {children}
          <CartDrawer />
          <SearchModal />
          <NotificationToast />
          <MobileBottomNav />
          <WebPushNotificationPrompt />
          <ChatbotWidget />
          <LeftAgarbattis />
        </StoreProvider>
      </body>
    </html>
  );
}
