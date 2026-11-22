import type { Metadata } from "next";
import CraftsmanshipClientPage from "./CraftsmanshipClientPage";

export const metadata: Metadata = {
  title: "Inside Our Workshop & Craftsmanship | Handcrafted Incense in Coimbatore — HM Brand",
  description: "Explore how HM Agarbattis makes honest temple incense in Peelamedu, Coimbatore: hand-rolling on real bamboo, pure tree loban gums, slow natural drying racks, and hand-counted quality checks.",
  alternates: { canonical: "/craftsmanship" },
};

export default function CraftsmanshipPage() {
  return <CraftsmanshipClientPage />;
}
