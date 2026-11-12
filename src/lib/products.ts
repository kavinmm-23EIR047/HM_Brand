export interface ProductImageItem {
  id?: string;
  url: string;
  storageKey?: string;
  altText?: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

export interface ParsedProductDescription {
  tagline?: string;
  paragraphs: string[];
  burningTime?: string;
  dimensions?: string;
  countSpec?: string;
  ingredients?: string;
  whatsInside: string[];
  whyChoose: string[];
  pricingNote?: string;
}

export interface Product {
  id?: string;
  slug: string;
  name: string;
  category: string;
  categoryLabels?: string[];
  subCategory?: string;
  subcategoryId?: string | null;
  note: string;
  tagline?: string;
  description: string;
  descriptionParagraphs?: string[];
  mrp: string;
  price: number;
  unitPrice?: number | null;
  bundleQuantity?: number | null;
  quantity: string;
  burnTime?: string;
  dimensions?: string;
  ingredients?: string;
  whatsInside?: string[];
  whyChoose?: string[];
  pricingNote?: string;
  fragranceNotes?: string[];
  benefits: string[];
  howToUse: string[];
  image?: string;
  images?: ProductImageItem[];
  badge?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
  couponCode?: string;
}

function summarizeAtWordBoundary(text: string, maxLength = 115): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const firstSentenceMatch = clean.match(/^(.+?[.!?])(\s|$)/);
  if (firstSentenceMatch && firstSentenceMatch[1].length <= maxLength) {
    return firstSentenceMatch[1];
  }
  if (clean.length <= maxLength) return clean;
  const sliced = clean.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  return (lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced) + "…";
}

export function parseProductDescription(rawDescription?: string | null): ParsedProductDescription {
  if (!rawDescription || !rawDescription.trim()) {
    return { paragraphs: [], whatsInside: [], whyChoose: [] };
  }

  const lines = rawDescription.split(/\r?\n/);
  const proseBlocks: string[][] = [[]];
  const whatsInside: string[] = [];
  const whyChoose: string[] = [];

  let mode: "prose" | "whatsInside" | "whyChoose" = "prose";
  let burningTime: string | undefined;
  let size: string | undefined;
  let length: string | undefined;
  let thickness: string | undefined;
  let countSpec: string | undefined;
  let ingredients: string | undefined;
  let pricingNote: string | undefined;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      if (proseBlocks[proseBlocks.length - 1].length > 0) {
        proseBlocks.push([]);
      }
      continue;
    }

    if (/^What'?s Inside:?\s*$/i.test(trimmed)) {
      mode = "whatsInside";
      continue;
    }
    if (/^Why Choose:?\s*$/i.test(trimmed)) {
      mode = "whyChoose";
      continue;
    }

    const matchKeyVal = (regex: RegExp) => trimmed.match(regex)?.[1]?.trim();

    const bt = matchKeyVal(/^Burning Time:\s*(.+)$/i);
    if (bt) { burningTime = bt; mode = "prose"; continue; }

    const sz = matchKeyVal(/^Size:\s*(.+)$/i);
    if (sz) { size = sz; mode = "prose"; continue; }

    const len = matchKeyVal(/^Length:\s*(.+)$/i);
    if (len) { length = len; mode = "prose"; continue; }

    const thk = matchKeyVal(/^Thickness:\s*(.+)$/i);
    if (thk) { thickness = thk; mode = "prose"; continue; }

    const cnt = matchKeyVal(/^Count:\s*(.+)$/i);
    if (cnt) { countSpec = cnt; mode = "prose"; continue; }

    const ing = matchKeyVal(/^Ingredients:\s*(.+)$/i);
    if (ing) { ingredients = ing; mode = "prose"; continue; }

    const pr = matchKeyVal(/^Pricing:\s*(.+)$/i);
    if (pr) { pricingNote = pr; mode = "prose"; continue; }

    const bulletMatch = trimmed.match(/^(?:-|•)\s+(.+)$/);
    if (bulletMatch && mode === "whatsInside") {
      whatsInside.push(bulletMatch[1].trim());
      continue;
    }
    if (bulletMatch && mode === "whyChoose") {
      whyChoose.push(bulletMatch[1].trim());
      continue;
    }

    mode = "prose";
    proseBlocks[proseBlocks.length - 1].push(trimmed);
  }

  const rawParagraphs = proseBlocks
    .map((block) => block.join(" ").trim())
    .filter(Boolean);

  let tagline: string | undefined;
  let paragraphs = rawParagraphs;

  if (
    rawParagraphs.length >= 2 &&
    rawParagraphs[0].length <= 100 &&
    rawParagraphs[1].length > rawParagraphs[0].length
  ) {
    tagline = rawParagraphs[0];
    paragraphs = rawParagraphs.slice(1);
  }

  const dimensions = size
    || (length && thickness ? `${length} · ${thickness} Thick` : length || thickness || undefined);

  return {
    tagline,
    paragraphs,
    burningTime,
    dimensions,
    countSpec,
    ingredients,
    whatsInside,
    whyChoose,
    pricingNote,
  };
}

type ProductKind =
  | "electric-diffuser"
  | "homam-kit"
  | "havan-cup"
  | "camphor"
  | "dhoop"
  | "agarbatti";

export interface ProductKindConfig {
  packLabel: string;
  durationLabel: string;
  fallbackDuration: string;
  fallbackSpecLabel: string;
  fallbackSpecValue: string;
  fragranceNotes: string[];
  benefits: string[];
  howToUse: string[];
}

const PRODUCT_KIND_CONFIG: Record<ProductKind, ProductKindConfig> = {
  "electric-diffuser": {
    packLabel: "Product Type",
    durationLabel: "Operation",
    fallbackDuration: "Electric camphor burner",
    fallbackSpecLabel: "Ideal For",
    fallbackSpecValue: "Camphor & Resins",
    fragranceNotes: ["Pure Camphor", "Loban & Resins", "Sambrani"],
    benefits: [
      "Smoke-controlled flameless aroma diffusion",
      "Even gentle heating preserves pure camphor scent",
      "Convenient daily pooja and home fragrance diffuser",
    ],
    howToUse: [
      "Place pure camphor or sambrani resin in the top bowl.",
      "Plug in and switch on to gently diffuse the sacred aroma.",
    ],
  },
  "homam-kit": {
    packLabel: "Pack Size",
    durationLabel: "Kit Format",
    fallbackDuration: "Complete ritual kit",
    fallbackSpecLabel: "Contents",
    fallbackSpecValue: "6 Homam Essentials",
    fragranceNotes: ["20-Herb Homam", "Cow Dung", "Sacred Resins"],
    benefits: [
      "All 6 traditional homam essentials packed together",
      "Ready-to-use mud pot, herbs, slokam card & manual",
      "Convenient preparation for home rituals and ceremonies",
    ],
    howToUse: [
      "Follow the included instruction manual and slokam card.",
      "Arrange the dried cow dung, coconut shells, and 20-herb powder in the mud pot.",
    ],
  },
  "havan-cup": {
    packLabel: "Pack Size",
    durationLabel: "Usage",
    fallbackDuration: "Traditional ritual cup",
    fallbackSpecLabel: "Formulation",
    fallbackSpecValue: "Pure Sambrani Resin",
    fragranceNotes: ["Pure Sambrani", "Warm Resins", "Temple Wood"],
    benefits: [
      "Rich, soothing sambrani resin aroma",
      "Ready-to-light traditional havan cup format",
      "Enhances spiritual ambience for pooja and meditation",
    ],
    howToUse: [
      "Place the sambrani cup on a heat-safe plate or holder.",
      "Light the outer rim until it glows evenly and releases fragrant smoke.",
    ],
  },
  camphor: {
    packLabel: "Pack Size",
    durationLabel: "Burning Time",
    fallbackDuration: "Residue-free clean burning",
    fallbackSpecLabel: "Formulation",
    fallbackSpecValue: "100% Pure Camphor",
    fragranceNotes: ["Pure Camphor", "Cool Camphoric", "Divine White Resins"],
    benefits: [
      "100% pure residue-free burning camphor",
      "Purifies indoor atmosphere and vastu energy",
      "Ideal for daily aarti, puja, and diffusers",
    ],
    howToUse: [
      "Place on a camphor burner, aarti plate, or electric diffuser.",
      "Light with a flame or switch on your diffuser for sacred purifying aroma.",
    ],
  },
  dhoop: {
    packLabel: "Pack Size",
    durationLabel: "Burning Time",
    fallbackDuration: "Approximately 35 mins per stick",
    fallbackSpecLabel: "Formulation",
    fallbackSpecValue: "100% Bamboo-Less Dhoop",
    fragranceNotes: ["Sacred Resins", "Rare Woods", "Herbal Extracts"],
    benefits: [
      "100% natural bamboo-less formulation",
      "Dense, long-lasting sacred aroma",
      "Purifies negative energies and calms the mind",
    ],
    howToUse: [
      "Place bamboo-less dhoop stick on a heat-resistant stand or holder.",
      "Light tip until flame appears, then gently blow out to release fragrant smoke.",
    ],
  },
  agarbatti: {
    packLabel: "Pack Size",
    durationLabel: "Burning Time",
    fallbackDuration: "50 minutes",
    fallbackSpecLabel: "Formulation",
    fallbackSpecValue: "100% Charcoal-Free",
    fragranceNotes: ["Natural Resins", "Essential Oils", "Botanicals"],
    benefits: [
      "100% natural organic ingredients",
      "Zero harmful charcoal or synthetic toxins",
      "Uplifts daily rituals and home ambiance",
    ],
    howToUse: [
      "Place stick in agarbatti holder.",
      "Light tip until flame appears, then gently blow out.",
    ],
  },
};

/** Resolve spec tiles and default ritual notes uniformly from product metadata. */
export function getProductSpecConfig(product: {
  slug?: string;
  name?: string;
  category?: string;
}): ProductKindConfig {
  const categoryLower = (product.category || "").toLowerCase();
  const slugAndName = `${product.slug || ""} ${product.name || ""}`.toLowerCase();

  if (slugAndName.includes("dani") || slugAndName.includes("machine")) {
    return PRODUCT_KIND_CONFIG["electric-diffuser"];
  }
  if (slugAndName.includes("homam") || categoryLower.includes("pooja")) {
    return PRODUCT_KIND_CONFIG["homam-kit"];
  }
  if (
    categoryLower.includes("havan") ||
    categoryLower.includes("sambrani") ||
    slugAndName.includes("sambrani") ||
    slugAndName.includes("sambarani")
  ) {
    return PRODUCT_KIND_CONFIG["havan-cup"];
  }
  if (categoryLower.includes("camphor")) {
    return PRODUCT_KIND_CONFIG.camphor;
  }
  if (categoryLower.includes("dhoop")) {
    return PRODUCT_KIND_CONFIG.dhoop;
  }
  return PRODUCT_KIND_CONFIG.agarbatti;
}

/** Return true only when real backend rating and review count exist. */
export function hasProductRating(product: {
  rating?: number | null;
  reviewCount?: number | null;
}): boolean {
  return (
    typeof product.rating === "number" &&
    Number.isFinite(product.rating) &&
    product.rating > 0 &&
    typeof product.reviewCount === "number" &&
    Number.isFinite(product.reviewCount) &&
    product.reviewCount > 0
  );
}

const MEDIA_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/api\/v\d+\/?$/i, "");

export function normalizeProductImageUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/uploads/")) return `${MEDIA_ORIGIN}${trimmed}`;
  return trimmed;
}

export function mapDbProductToProduct(p: any): Product {
  const rawImages: any[] = Array.isArray(p.images) ? p.images : [];
  const seenUrls = new Set<string>();
  const uniqueImages: ProductImageItem[] = [];

  for (let idx = 0; idx < rawImages.length; idx++) {
    const img = rawImages[idx];
    const trimmed = normalizeProductImageUrl(img?.url);
    if (trimmed && !seenUrls.has(trimmed)) {
      seenUrls.add(trimmed);
      uniqueImages.push({
        id: img.id,
        url: trimmed,
        storageKey: img.storageKey,
        altText: img.altText || p.name,
        isPrimary: Boolean(img.isPrimary || (uniqueImages.length === 0 && !rawImages.some((i: any) => i.isPrimary))),
        displayOrder: typeof img.displayOrder === 'number' ? img.displayOrder : idx,
      });
    }
  }

  const fallbackDirect = normalizeProductImageUrl(p.imageUrl);
  if (uniqueImages.length === 0 && fallbackDirect && !seenUrls.has(fallbackDirect)) {
    seenUrls.add(fallbackDirect);
    uniqueImages.push({
      url: fallbackDirect,
      altText: p.name,
      isPrimary: true,
      displayOrder: 0,
    });
  }

  const primaryImgObj = uniqueImages.find((img) => img.isPrimary) || uniqueImages[0];
  const primaryImg = primaryImgObj?.url || fallbackDirect || undefined;
  const images: ProductImageItem[] = uniqueImages;

  const categoryRelations = (p.categories || [])
    .map((link: any) => link.category)
    .filter(Boolean)
    .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const categoryLabels = categoryRelations.map((category: any) => category.name);
  const categoryName = categoryLabels[0] || p.categories?.[0]?.category?.name || p.category || "";
  
  // shortDescription doubles as "unit" label (e.g. "50 GMS · Camphor")
  const shortDesc = p.shortDescription || "";
  const parsed = parseProductDescription(p.description);
  const quantityPart =
    p.quantity != null
      ? String(p.quantity)
      : shortDesc.split("·")[0]?.trim() || parsed.countSpec || "";

  const notePart = shortDesc.includes("·")
    ? shortDesc.split("·").slice(1).join("·").trim()
    : parsed.paragraphs[0] || "";

  const numMrp = typeof p.mrp === 'number' ? p.mrp : parseFloat(p.mrp || 0);
  const numPrice = typeof p.price === 'number' ? p.price : parseFloat(p.price || 0);
  const numUnitPrice = typeof p.unitPrice === 'number' ? p.unitPrice : null;
  const bundleQty = typeof p.bundleQuantity === 'number' ? p.bundleQuantity : null;

  const dbRating = typeof p.rating === "number"
    ? p.rating
    : typeof p.avgRating === "number"
    ? p.avgRating
    : Array.isArray(p.reviews) && p.reviews.length > 0
    ? p.reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / p.reviews.length
    : 0;

  const dbReviewCount = typeof p.reviewCount === "number"
    ? p.reviewCount
    : typeof p.totalReviews === "number"
    ? p.totalReviews
    : Array.isArray(p.reviews)
    ? p.reviews.length
    : 0;

  const summarySource = parsed.tagline || parsed.paragraphs[0] || notePart;
  const specConfig = getProductSpecConfig({
    slug: p.slug,
    name: p.name,
    category: categoryName,
  });

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: categoryName,
    categoryLabels,
    subCategory: p.subcategory?.name || p.subCategory || "",
    subcategoryId: p.subcategoryId || p.subcategory?.id || null,
    note: summarySource ? summarizeAtWordBoundary(summarySource, 115) : "",
    tagline: parsed.tagline,
    description: p.description || p.name,
    descriptionParagraphs: parsed.paragraphs.length > 0
      ? parsed.paragraphs
      : p.description
      ? [p.description]
      : [],
    mrp: numMrp > 0 ? `₹${numMrp}` : "",
    price: !isNaN(numPrice) && numPrice > 0 ? numPrice : 0,
    unitPrice: numUnitPrice,
    bundleQuantity: bundleQty,
    quantity: quantityPart,
    burnTime: parsed.burningTime || specConfig.fallbackDuration,
    dimensions: parsed.dimensions,
    ingredients: parsed.ingredients,
    whatsInside: parsed.whatsInside.length > 0 ? parsed.whatsInside : undefined,
    whyChoose: parsed.whyChoose.length > 0 ? parsed.whyChoose : undefined,
    pricingNote: parsed.pricingNote,
    fragranceNotes: specConfig.fragranceNotes,
    benefits: specConfig.benefits,
    howToUse: specConfig.howToUse,
    image: primaryImg,
    images,
    badge: p.couponCode
      ? `COUPON: ${p.couponCode}`
      : bundleQty && bundleQty > 1
      ? `${bundleQty}-Box Bundle`
      : p.isFeatured
      ? "Featured"
      : undefined,
    rating: dbRating,
    reviewCount: dbReviewCount,
    inStock: typeof p.stockQuantity === "number" ? p.stockQuantity > 0 : Boolean(p.inStock),
    featured: Boolean(p.isFeatured),
    couponCode: p.couponCode || undefined,
  };
}

// All data is dynamically fetched from backend DB
export const products: Product[] = [];

export const categories = [
  "Agarbatti",
  "Camphor",
  "Dhoop Stick / Bamboo-less Stick",
  "Incense Cones",
  "Havan Cups",
  "Sambrani Powder",
  "Pooja Essentials",
  "Gift Sets",
  "Family Pack"
];

export const subCategoriesMap: Record<string, string[]> = {
  "Agarbatti": [
    "Exclusive",
    "Budget Pack",
    "Super Series"
  ]
};

export interface CatalogCategory {
  name: string;
  children?: CatalogCategory[];
}

// Official HM Brand product taxonomy matching PostgreSQL & Website Document.
export const categoryTree: CatalogCategory[] = [
  {
    name: "Agarbatti",
    children: [
      { name: "Exclusive", children: [
        { name: "Pancharudhra" },
        { name: "Real Stone" },
        { name: "Cardamom" },
        { name: "Kesar Loban" },
        { name: "Karpoor Loban" },
        { name: "Kasturi" },
        { name: "Amora" },
        { name: "Javadu" },
        { name: "Champa" },
        { name: "Megadhooth" },
        { name: "Fancy Flora" },
      ] },
      { name: "Budget Pack", children: [
        { name: "Jasmine" },
        { name: "Kewda" },
        { name: "Champa" },
        { name: "Glory" },
        { name: "Sandalwood" },
        { name: "Pineapple" },
        { name: "Rose" },
        { name: "Ecstasy" },
        { name: "Fantasy" },
        { name: "Loban" },
        { name: "Lavender" },
      ] },
      { name: "Super Series", children: [
        { name: "Rose" },
        { name: "Glory" },
        { name: "Lavender" },
        { name: "Sandalwood" },
        { name: "Loban" },
        { name: "Guggal" },
      ] },
    ],
  },
  ...categories.slice(1).map((name) => ({ name })),
];

export const collectionsList = [
  {
    id: "morning-puja",
    title: "Morning Puja Collection",
    subtitle: "Auspicious Sunrise Ritual",
    description: "Start the day with the gentle glow of a diya, the pure sweetness of Bhimseni camphor, and floral agarbatti that awakens clarity and gratitude.",
    tagline: "Start every day with divine energy",
    accent: "Saffron",
    items: ["hm-super-series", "bhimseni-camphor", "fancy-flora"]
  },
  {
    id: "peaceful-evening",
    title: "Peaceful Evening Sanctuary",
    subtitle: "Twilight Calm & Sandalwood",
    description: "Slow down after sunset. Light paal sambrani and botanical kasturi to release the day's fatigue and wrap your home in soothing stillness.",
    tagline: "Transition into twilight tranquility",
    accent: "Plum",
    items: ["cup-sambrani", "kasturi", "chandan-pure-dhoop"]
  },
  {
    id: "new-home",
    title: "Gruhapravesam & New Home",
    subtitle: "Housewarming Blessings",
    description: "Purify new corners, invite positive vastu vibrations, and welcome Goddess Lakshmi with sacred Loban, Bhimseni camphor, and Pancha Rudhra.",
    tagline: "Blessings for auspicious new beginnings",
    accent: "Gold",
    items: ["pancha-rudhra", "kesar-loban", "bhimseni-camphor"]
  },
  {
    id: "festival-essentials",
    title: "Mahaparva Festival Essentials",
    subtitle: "Diwali, Navaratri & Pongal",
    description: "Everything required for festive family gatherings. Rich fragrant agarbattis, instant cup sambrani, and crystalline camphor.",
    tagline: "Celebrate sacred moments together",
    accent: "Kumkum",
    items: ["hm-super-series", "cup-sambrani", "kesar-loban", "bhimseni-camphor"]
  },
  {
    id: "sacred-gifts",
    title: "Divine Gifting Boxes",
    subtitle: "Thoughtful Spiritual Gifts",
    description: "Present the gift of fragrance and blessings to elders, dear ones, and friends on weddings, housewarmings, and festive occasions.",
    tagline: "Gift auspicious moments that linger",
    accent: "Teal",
    items: ["pancha-rudhra", "mehak-italian", "chandan-pure-dhoop"]
  }
];

export const festivalsList = [
  {
    id: "diwali",
    name: "Diwali — Festival of Lights",
    dateText: "Kartika Amavasya",
    description: "Illuminate your sanctum with pure brass diyas, fragrant dhoop, and sacred camphor to welcome Goddess Mahalakshmi.",
    recommendedCategory: "Camphor",
    featuredSlugs: ["bhimseni-camphor", "hm-super-series", "cup-sambrani"],
    ritualNote: "Light Bhimseni camphor during Lakshmi Puja for divine radiance."
  },
  {
    id: "navaratri",
    name: "Navaratri & Vijayadashami",
    dateText: "Sharad Navaratri",
    description: "Nine nights of devotion, music, and prayer. Fill each sacred evening with paal sambrani and sweet floral agarbatti.",
    recommendedCategory: "Sambhrani Powder",
    featuredSlugs: ["cup-sambrani", "fancy-flora", "kesar-loban"],
    ritualNote: "Perform evening dhoop aarti before the Golu display."
  },
  {
    id: "pongal",
    name: "Pongal & Makar Sankranti",
    dateText: "Tamil Thai Pongal",
    description: "Celebrate the bounty of the harvest and the life-giving Sun God with fresh cardamom incense and natural benzoin.",
    recommendedCategory: "Agarbatti",
    featuredSlugs: ["cardamom", "cup-sambrani", "hm-super-series"],
    ritualNote: "Offer incense to Surya Bhagavan at auspicious dawn."
  },
  {
    id: "ganesh-chaturthi",
    name: "Ganesh Chaturthi",
    dateText: "Bhadrapada Shukla Chaturthi",
    description: "Welcome Lord Ganesha with fragrant loban, sweet modak aromas, and special pancha rudhra formulations.",
    recommendedCategory: "Dhoop Stick / Bambooless Stick",
    featuredSlugs: ["kesar-loban", "pancha-rudhra", "bhimseni-camphor"],
    ritualNote: "Begin all new ventures with Lord Ganesha's sacred blessings."
  },
  {
    id: "krishna-janmashtami",
    name: "Krishna Janmashtami",
    dateText: "Shravana Rohini",
    description: "Celebrate little Krishna's advent with sweet kasturi musk, creamy chandan, and floral mogra agarbattis.",
    recommendedCategory: "Exclusive",
    featuredSlugs: ["kasturi", "chandan-pure-dhoop", "fancy-flora"],
    ritualNote: "Midnight aarti with pure aromatic camphor and flowers."
  },
  {
    id: "daily-puja",
    name: "Nitya Puja (Daily Worship)",
    dateText: "Everyday Morning & Dusk",
    description: "A simple 5-minute sacred pause before starting your day. Connect with your inner stillness and calm your thoughts.",
    recommendedCategory: "Agarbatti",
    featuredSlugs: ["hm-super-series", "bhimseni-camphor", "chandan-pure-dhoop"],
    ritualNote: "A daily ritual that keeps the heart grounded and home peaceful."
  }
];
