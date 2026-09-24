import ProductDetailsPage from "@/app/product/[slug]/page";

export default async function ProductsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return await ProductDetailsPage({ params });
}
