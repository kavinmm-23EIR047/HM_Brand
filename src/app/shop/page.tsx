import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const hasFilters = Object.keys(params).length > 0;

  return {
    title: "Shop Sacred Fragrances | HM Agarbattis",
    description: "Explore the HM Agarbattis product catalogue, including incense, camphor, sambrani, and pooja essentials.",
    alternates: { canonical: "/shop" },
    robots: hasFilters ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export { default } from "@/app/_pages/shop/ShopPage";
