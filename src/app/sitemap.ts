import type { MetadataRoute } from "next";

const SITE_URL = "https://www.hmagarbattis.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

type BackendProduct = { slug?: string; updatedAt?: string };

async function getPublicProducts(): Promise<BackendProduct[]> {
  const products: BackendProduct[] = [];
  let page = 1;

  try {
    while (page <= 100) {
      const response = await fetch(`${API_URL}/products?page=${page}&limit=500`, { cache: "no-store" });
      if (!response.ok) break;

      const payload = await response.json();
      if (!payload.success || !Array.isArray(payload.data)) break;

      products.push(...payload.data);
      if (!payload.meta?.hasNextPage) break;
      page += 1;
    }
  } catch {
    // Keep the public page URLs available when the product backend is offline.
  }

  return products;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const corePages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const productPages = (await getPublicProducts())
    .filter((product) => typeof product.slug === "string" && product.slug.trim())
    .map((product) => ({
      url: `${SITE_URL}/product/${encodeURIComponent(product.slug!)}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [...corePages, ...productPages];
}
