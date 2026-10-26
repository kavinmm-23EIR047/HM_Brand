import prisma from '../../shared/database/prisma';

export interface SearchHit {
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
  couponCode?: string | null;
  _formatted?: {
    name?: string;
    category?: string;
    shortDescription?: string;
  };
}

export interface SearchResult {
  success: boolean;
  query: string;
  totalHits: number;
  hits: SearchHit[];
  suggestions: string[];
  processingTimeMs: number;
  source: string;
}

// Levenshtein distance for typo-tolerant matching
function levenshteinDistance(s1: string, s2: string): number {
  const a = s1.toLowerCase();
  const b = s2.toLowerCase();
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Sacred & common spiritual fragrance synonyms/keywords
const SYNONYMS: Record<string, string[]> = {
  incense: ['agarbatti', 'sticks', 'flora', 'mehak', 'pooja'],
  agarbatti: ['incense', 'sticks', 'flora', 'mehak', 'agarbati', 'agarbathy'],
  agarbati: ['agarbatti', 'incense', 'sticks', 'flora'],
  camphor: ['karpooram', 'karpoor', 'karppor', 'bhimseni', 'aarti', 'tablets', 'rounds', 'purification', 'dani'],
  camphr: ['camphor', 'karpooram', 'bhimseni'],
  kamphor: ['camphor', 'bhimseni'],
  karpoor: ['camphor', 'karpooram', 'karppor', 'bhimseni', 'dani'],
  karppor: ['camphor', 'karpoor', 'karpooram', 'bhimseni', 'dani'],
  karpooram: ['camphor', 'bhimseni', 'aarti'],
  bhimseni: ['camphor', 'bhimseni camphor', 'pacha karpoor'],
  'pacha karpoor': ['camphor', 'bhimseni', 'edible camphor', 'green camphor'],
  dhoop: ['stick', 'bamboo-less', 'bakhoor', 'mehak', 'cone', 'fragrance', 'dhup'],
  dhup: ['dhoop', 'stick', 'fragrance'],
  bakhoor: ['dhoop', 'indian bakhoor', 'incense'],
  mehak: ['dhoop', 'italian mehak', 'incense'],
  'family pack': ['family', 'pack', 'combo', 'loban', '10 in 1', '4 in 1'],
  sambrani: ['loban', 'benzoin', 'cup sambrani', 'flora', 'kasturi', 'cardamom', 'kesar'],
  sambrni: ['sambrani', 'loban', 'cup sambrani'],
  sambirani: ['sambrani', 'loban'],
  loban: ['sambrani', 'dhoop', 'purification', 'resin'],
  luban: ['loban', 'sambrani'],
  kasturi: ['sambrani', 'musk', 'aroma'],
  cardamom: ['sambrani', 'elachi', 'elaichi'],
  kesar: ['saffron', 'sambrani', 'loban'],
  sandal: ['chandan', 'sandalwood', 'dhoop'],
  chandan: ['sandal', 'sandalwood', 'dhoop'],
};

export function mapProductToHit(p: any): SearchHit {
  const primaryImg =
    p.images?.find((img: any) => img.isPrimary)?.url ||
    p.images?.[0]?.url ||
    '/images/products/hm_glory_agarbatti.jpg';

  const categoryName =
    p.categories?.[0]?.category?.name ||
    p.category ||
    'Agarbatti & Flora';

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

  const tags: string[] = [];
  const keywords: string[] = [];
  const words = `${p.name} ${categoryName}`.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  words.forEach((w) => {
    if (!keywords.includes(w)) keywords.push(w);
  });

  if (p.name.toLowerCase().includes('agarbatti') || categoryName.toLowerCase().includes('agarbatti')) {
    tags.push('agarbatti', 'incense', 'sticks', 'pooja');
  }
  if (p.name.toLowerCase().includes('camphor') || categoryName.toLowerCase().includes('camphor')) {
    tags.push('camphor', 'karpooram', 'aarti', 'purification', 'bhimseni');
  }
  if (p.name.toLowerCase().includes('dhoop') || categoryName.toLowerCase().includes('dhoop')) {
    tags.push('dhoop', 'stick', 'cone', 'fragrance');
  }
  if (p.name.toLowerCase().includes('sambrani') || categoryName.toLowerCase().includes('sambrani')) {
    tags.push('sambrani', 'loban', 'benzoin', 'cup sambrani');
  }

  return {
    id: String(p.id),
    name: p.name || '',
    slug: p.slug || '',
    sku: p.sku || '',
    description: p.description || p.name || '',
    shortDescription: p.shortDescription || '',
    category: categoryName,
    categories: categoryList,
    tags,
    keywords,
    price: typeof p.price === 'number' ? p.price : parseFloat(String(p.price || 0)) || 0,
    mrp: typeof p.mrp === 'number' ? p.mrp : parseFloat(String(p.mrp || p.price || 0)) || 0,
    image: primaryImg,
    inStock: (p.stockQuantity ?? 1) > 0,
    isFeatured: Boolean(p.isFeatured),
    couponCode: p.couponCode || null,
  };
}

// In-memory cache for ultra-fast product search (<1ms)
let cachedProducts: any[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export function invalidateSearchCache(): void {
  cachedProducts = null;
  lastCacheTime = 0;
}

export async function searchProducts(options: {
  q?: string;
  type?: 'autocomplete' | 'full';
  limit?: number;
  offset?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<SearchResult> {
  const startTime = Date.now();
  const query = (options.q || '').trim();
  const limit = Math.min(100, Math.max(1, options.limit || (options.type === 'autocomplete' ? 6 : 20)));
  const offset = Math.max(0, options.offset || 0);

  if (!query) {
    return {
      success: true,
      query: '',
      totalHits: 0,
      hits: [],
      suggestions: [],
      processingTimeMs: Date.now() - startTime,
      source: 'postgres',
    };
  }

  const queryLower = query.toLowerCase();
  const queryTokens = queryLower.split(/\s+/).filter(Boolean);

  // Use in-memory cache to avoid slow DB queries on every keystroke
  const now = Date.now();
  if (!cachedProducts || now - lastCacheTime > CACHE_TTL_MS) {
    cachedProducts = await prisma.product.findMany({
      where: {
        deletedAt: null,
        isActive: true,
      },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        categories: { include: { category: true } },
      },
    });
    lastCacheTime = now;
  }

  let products = cachedProducts || [];

  if (options.category && options.category !== 'all') {
    const catLower = options.category.toLowerCase();
    products = products.filter((p) =>
      p.categories?.some((c: any) => {
        const cSlug = c.category?.slug?.toLowerCase();
        const cName = c.category?.name?.toLowerCase();
        return cSlug === catLower || cName === catLower;
      })
    );
  }

  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    products = products.filter((p) => {
      const price = Number(p.price) || 0;
      if (options.minPrice !== undefined && price < options.minPrice) return false;
      if (options.maxPrice !== undefined && price > options.maxPrice) return false;
      return true;
    });
  }

  const scored: Array<{ hit: SearchHit; score: number }> = [];
  const suggestionsSet = new Set<string>();

  // Phonetic equivalent for Indian spiritual products (C <-> K, e.g., Camphor/Karppor, Cardamom)
  const altQuery = queryLower.startsWith('c')
    ? 'k' + queryLower.slice(1)
    : queryLower.startsWith('k')
    ? 'c' + queryLower.slice(1)
    : '';

  for (const p of products) {
    const hit = mapProductToHit(p);
    const nameLower = hit.name.toLowerCase();
    const descLower = (hit.description || '').toLowerCase();
    const shortDescLower = (hit.shortDescription || '').toLowerCase();
    const catNamesLower = hit.categories.map((c) => c.toLowerCase());
    const catCombined = catNamesLower.join(' ');
    const tagsCombined = hit.tags.join(' ');

    let score = 0;
    const nameWords = nameLower.split(/\s+/);

    // 1. Direct name matches (highest ranking on top)
    if (nameLower === queryLower) {
      score += 800;
    } else if (nameLower.startsWith(queryLower)) {
      score += 500;
    }

    // 2. Word in name starts with query (e.g., "Cup", "Camphor", "Cones")
    if (nameWords.some((w) => w.startsWith(queryLower))) {
      score += 350;
    }

    // 3. Category starts with query
    if (catNamesLower.some((c) => c.startsWith(queryLower) || c.split(/\s+/).some((w) => w.startsWith(queryLower)))) {
      score += 260;
    }

    // 4. Phonetic C/K equivalence (e.g., query "car" matches "Karppor dani machine")
    if (altQuery) {
      if (nameLower.startsWith(altQuery)) score += 300;
      else if (nameWords.some((w) => w.startsWith(altQuery))) score += 240;
      else if (nameLower.includes(altQuery)) score += 100;
    }

    // 5. Substring matches
    if (nameLower.includes(queryLower)) {
      score += 150;
    }
    if (catCombined.includes(queryLower)) {
      score += 90;
    }
    if (tagsCombined.includes(queryLower)) {
      score += 70;
    }
    if (descLower.includes(queryLower) || shortDescLower.includes(queryLower)) {
      score += 30;
    }

    // 6. Token-level and typo-tolerant matches
    for (const q of queryTokens) {
      if (nameWords.includes(q)) score += 50;
      else if (nameLower.includes(q)) score += 35;

      if (catCombined.includes(q)) score += 40;
      if (tagsCombined.includes(q)) score += 35;

      const syns = SYNONYMS[q] || [];
      for (const syn of syns) {
        if (nameLower.includes(syn) || catCombined.includes(syn) || tagsCombined.includes(syn)) {
          score += 45;
        }
      }

      // Typo-tolerance for queries 3+ chars
      if (q.length >= 3) {
        const targetWords = [...nameWords, ...catNamesLower.flatMap((c) => c.split(/\s+/))];
        for (const tw of targetWords) {
          if (tw.length < 3) continue;
          const maxDist = q.length <= 4 ? 1 : q.length <= 7 ? 2 : 3;
          const dist = levenshteinDistance(q, tw);
          if (dist > 0 && dist <= maxDist) {
            const sim = 1 - dist / Math.max(q.length, tw.length);
            score += Math.round(sim * 60);
          }
        }
      }
    }

    if (score > 0) {
      scored.push({ hit, score });
      suggestionsSet.add(hit.name);
      hit.categories.forEach((cat) => suggestionsSet.add(cat));
    }
  }

  // Sort by score DESC (best matches first / on top), then isFeatured DESC, then name ASC
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.hit.isFeatured !== a.hit.isFeatured) return b.hit.isFeatured ? 1 : -1;
    return a.hit.name.localeCompare(b.hit.name);
  });

  // If hits are low (< 4), append similar products from matching categories
  if (scored.length > 0 && scored.length < limit) {
    const existingIds = new Set(scored.map((s) => s.hit.id));
    const matchingCategories = new Set(scored.flatMap((s) => s.hit.categories.map((c) => c.toLowerCase())));

    for (const p of products) {
      if (scored.length >= limit) break;
      const hit = mapProductToHit(p);
      if (existingIds.has(hit.id)) continue;

      const sharesCategory = hit.categories.some((c) => matchingCategories.has(c.toLowerCase()));
      if (sharesCategory || hit.isFeatured) {
        scored.push({ hit, score: sharesCategory ? 15 : 5 });
        existingIds.add(hit.id);
      }
    }
  }

  const totalHits = scored.length;
  const paginatedHits = scored.slice(offset, offset + limit).map((s) => s.hit);
  const suggestions = Array.from(suggestionsSet).slice(0, 8);

  return {
    success: true,
    query,
    totalHits,
    hits: paginatedHits,
    suggestions,
    processingTimeMs: Date.now() - startTime,
    source: 'postgres-cache',
  };
}
