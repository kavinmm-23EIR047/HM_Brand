import type { MetadataRoute } from "next";
import { products, categories } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.hmagarbattis.com";
  const routes = [
    "",
    "/shop",
    "/categories",
    "/collections",
    "/festivals",
    "/about",
    "/contact",
    "/search",
    "/wishlist",
    "/cart",
    "/checkout",
    ...categories.map((c) => `/category/${c.toLowerCase().replaceAll(" ", "-")}`),
    ...products.map((p) => `/product/${p.slug}`),
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/product/") ? 0.8 : 0.7,
  }));
}
