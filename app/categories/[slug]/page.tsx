import CategoryPage from "@/app/category/[slug]/page";

export default async function CategoriesSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return await CategoryPage({ params });
}
