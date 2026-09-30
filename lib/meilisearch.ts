import { Meilisearch } from "meilisearch";

export interface MeiliProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  category: string;
  categories: string[];
  tags: string[];
  keywords: string[];
  price: number;
  mrp: number;
  image: string;
  inStock: boolean;
  isFeatured: boolean;
  couponCode?: string;
  _formatted?: Partial<MeiliProduct>;
}

const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || "http://localhost:7700";
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || "";
export const PRODUCTS_INDEX_NAME = "products";

let meiliClientInstance: Meilisearch | null = null;

/**
 * Returns the server-side Meilisearch client instance.
 * Credentials are never sent to the browser.
 */
export function getMeiliClient(): Meilisearch {
  if (!meiliClientInstance) {
    meiliClientInstance = new Meilisearch({
      host: MEILISEARCH_HOST,
      apiKey: MEILISEARCH_API_KEY || undefined,
    });
  }
  return meiliClientInstance;
}

/**
 * Ensures the `products` index exists with optimal typo tolerance,
 * ranking rules (name > category > tags > description), and searchable attributes.
 */
export async function ensureProductIndex() {
  const client = getMeiliClient();
  let index;
  try {
    index = await client.getIndex(PRODUCTS_INDEX_NAME);
  } catch (err: any) {
    if (err?.code === "index_not_found" || err?.status === 404) {
      const task = await client.createIndex(PRODUCTS_INDEX_NAME, { primaryKey: "id" });
      await client.tasks.waitForTask(task.taskUid);
      index = client.index(PRODUCTS_INDEX_NAME);
    } else {
      throw err;
    }
  }

  // Configure searchable attributes in exact priority order (Name > Category > Tags > Description)
  await index.updateSettings({
    searchableAttributes: [
      "name",
      "category",
      "categories",
      "tags",
      "keywords",
      "shortDescription",
      "description",
    ],
    rankingRules: [
      "words",
      "typo",
      "proximity",
      "attribute",
      "sort",
      "exactness",
    ],
    displayedAttributes: [
      "id",
      "name",
      "slug",
      "sku",
      "description",
      "shortDescription",
      "category",
      "categories",
      "tags",
      "keywords",
      "price",
      "mrp",
      "image",
      "inStock",
      "isFeatured",
      "couponCode",
    ],
    filterableAttributes: ["category", "categories", "inStock", "isFeatured", "price"],
    sortableAttributes: ["price"],
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 3,
        twoTypos: 7,
      },
      disableOnWords: [],
      disableOnAttributes: [],
    },
  });

  return index;
}

/**
 * Maps database/raw product entities into a clean Meilisearch searchable document.
 */
export function mapProductToMeiliDocument(p: any): MeiliProduct {
  const primaryImg =
    p.images?.find((img: any) => img.isPrimary)?.url ||
    p.images?.[0]?.url ||
    p.image ||
    "/images/media_1790142713668.jpg";

  const categoryName =
    p.categories?.[0]?.category?.name ||
    p.category ||
    "Agarbatti & Flora";

  const categoryList: string[] = [];
  if (Array.isArray(p.categories)) {
    p.categories.forEach((catRel: any) => {
      const cName = catRel?.category?.name || catRel?.name;
      if (cName && !categoryList.includes(cName)) categoryList.push(cName);
    });
  }
  if (categoryName && !categoryList.includes(categoryName)) {
    categoryList.push(categoryName);
  }

  // Tags & keywords generation for enhanced search matching
  const tags: string[] = [];
  const keywords: string[] = [];

  // Extract keywords from name and categories
  const words = `${p.name} ${categoryName}`.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  words.forEach((w) => {
    if (!keywords.includes(w)) keywords.push(w);
  });

  // Common spiritual fragrance terms
  if (p.name.toLowerCase().includes("agarbatti") || categoryName.toLowerCase().includes("agarbatti")) {
    tags.push("agarbatti", "incense", "sticks", "pooja");
  }
  if (p.name.toLowerCase().includes("camphor") || categoryName.toLowerCase().includes("camphor")) {
    tags.push("camphor", "karpooram", "aarti", "purification", "bhimseni");
  }
  if (p.name.toLowerCase().includes("dhoop") || categoryName.toLowerCase().includes("dhoop")) {
    tags.push("dhoop", "stick", "cone", "fragrance");
  }
  if (p.name.toLowerCase().includes("sambrani") || categoryName.toLowerCase().includes("sambrani")) {
    tags.push("sambrani", "loban", "benzoin", "cup sambrani", "temple aroma");
  }

  // If static fragrance notes or benefits exist
  if (Array.isArray(p.fragranceNotes)) {
    p.fragranceNotes.forEach((n: string) => {
      if (!tags.includes(n.toLowerCase())) tags.push(n.toLowerCase());
    });
  }

  return {
    id: String(p.id || p.slug),
    name: p.name || "",
    slug: p.slug || "",
    sku: p.sku || "",
    description: p.description || p.name || "",
    shortDescription: p.shortDescription || p.note || "",
    category: categoryName,
    categories: categoryList,
    tags,
    keywords,
    price: typeof p.price === "number" ? p.price : parseFloat(String(p.price || 0)) || 0,
    mrp: typeof p.mrp === "number" ? p.mrp : parseFloat(String(p.mrp || p.price || 0)) || 0,
    image: primaryImg,
    inStock: p.stockQuantity !== undefined ? p.stockQuantity > 0 : p.inStock ?? true,
    isFeatured: Boolean(p.isFeatured),
    couponCode: p.couponCode || undefined,
  };
}

/**
 * Executes a typo-tolerant search using Meilisearch.
 * Returns empty array gracefully if Meilisearch service is unreachable.
 */
export async function searchMeiliProducts(
  query: string,
  options: {
    limit?: number;
    offset?: number;
    isAutocomplete?: boolean;
    filter?: string | string[];
  } = {}
) {
  try {
    const client = getMeiliClient();
    const index = client.index<MeiliProduct>(PRODUCTS_INDEX_NAME);

    const searchParams: any = {
      limit: options.limit || (options.isAutocomplete ? 6 : 20),
      offset: options.offset || 0,
      attributesToHighlight: ["name", "category", "shortDescription"],
      highlightPreTag: "<mark class=\"bg-[#F4D35E]/60 text-[#6B4226] px-0.5 rounded font-extrabold\">",
      highlightPostTag: "</mark>",
    };

    if (options.filter) {
      searchParams.filter = options.filter;
    }

    const result = await index.search(query, searchParams);
    return {
      hits: result.hits,
      totalHits: result.estimatedTotalHits || result.hits.length,
      query: result.query,
      processingTimeMs: result.processingTimeMs,
      isFallback: false,
    };
  } catch (error: any) {
    console.warn("Meilisearch query failed or service unavailable, using fallback:", error?.message || error);
    return null;
  }
}
