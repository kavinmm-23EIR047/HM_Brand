import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const hasFilters = Object.keys(params).length > 0;

  return {
    title: "Shop Natural Incense & Daily Pooja Essentials | HM Agarbattis",
    description: "Explore the HM Agarbattis collection: pure botanical agarbattis, pure Bhimseni camphor, cup sambrani, and dhoop cones direct from Coimbatore.",
    alternates: { canonical: "/shop" },
    robots: hasFilters ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export { default } from "@/app/_pages/shop/ShopPage";
