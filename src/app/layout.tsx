import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/store";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchModal } from "@/components/search-modal";
import { NotificationToast } from "@/components/notification-toast";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "HM Agarbattis | Discover the Divine Within — Sacred Temple Fragrances Coimbatore",
  description:
    "Handcrafted Indian spiritual fragrances, Bhimseni camphor, cup sambrani, dhoop cones and sacred puja essentials by HM Agarbattis Coimbatore.",
  metadataBase: new URL("https://www.hmagarbattis.com"),
  keywords:
    "HM Agarbattis, incense sticks Coimbatore, pure bhimseni camphor, sambrani cups, kesar loban, temple puja essentials, sacred fragrances",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="w-full overflow-x-hidden"
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
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Cinzel:wght@600;700;800;900&family=Manrope:wght@400;500;600;700;800&family=Marcellus&family=Outfit:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-sandalLight text-charcoal antialiased min-h-screen w-full max-w-full overflow-x-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0"
        suppressHydrationWarning
      >
        <StoreProvider>
          {children}
          <CartDrawer />
          <SearchModal />
          <NotificationToast />
          <MobileBottomNav />
        </StoreProvider>
      </body>
    </html>
  );
}
