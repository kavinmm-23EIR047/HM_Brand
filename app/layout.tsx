import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/store";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchModal } from "@/components/search-modal";
import { NotificationToast } from "@/components/notification-toast";

export const metadata: Metadata = {
  title: "HM Agarbattis | Find Your God Within — Sacred Temple Fragrances Coimbatore",
  description: "Handcrafted Indian spiritual fragrances, Bhimseni camphor, cup sambrani, dhoop cones and sacred puja essentials by HM Agarbattis Coimbatore.",
  metadataBase: new URL("https://www.hmagarbattis.com"),
  keywords: "HM Agarbattis, incense sticks Coimbatore, pure bhimseni camphor, sambrani cups, kesar loban, temple puja essentials, sacred fragrances",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-sacredCream text-charcoal antialiased">
        <StoreProvider>
          {children}
          <CartDrawer />
          <SearchModal />
          <NotificationToast />
        </StoreProvider>
      </body>
    </html>
  );
}
