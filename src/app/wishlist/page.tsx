import type { Metadata } from "next";
import WishlistPage from "@/app/_pages/wishlist/WishlistPage";

export const metadata: Metadata = {
  title: "Your Wishlist | HM Agarbattis",
  description: "View and manage the incense and pooja essentials you have saved for later.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <WishlistPage />;
}
