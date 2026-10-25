export interface ProductImageItem {
  id?: string;
  url: string;
  storageKey?: string;
  altText?: string;
  isPrimary?: boolean;
  displayOrder?: number;
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
  description: string;
  mrp: string;
  price: number;
  bundleQuantity?: number | null;
  quantity: string;
  burnTime?: string;
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

export function mapDbProductToProduct(p: any): Product {
  const rawImages: any[] = Array.isArray(p.images) ? p.images : [];
  const seenUrls = new Set<string>();
  const uniqueImages: ProductImageItem[] = [];

  for (let idx = 0; idx < rawImages.length; idx++) {
    const img = rawImages[idx];
    if (img?.url && typeof img.url === "string") {
      const trimmed = img.url.trim();
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
  }

  if (uniqueImages.length === 0 && p.imageUrl && typeof p.imageUrl === "string" && p.imageUrl.trim()) {
    const trimmed = p.imageUrl.trim();
    if (!seenUrls.has(trimmed)) {
      seenUrls.add(trimmed);
      uniqueImages.push({
        url: trimmed,
        altText: p.name,
        isPrimary: true,
        displayOrder: 0,
      });
    }
  }

  const primaryImgObj = uniqueImages.find((img) => img.isPrimary) || uniqueImages[0];
  const primaryImg = primaryImgObj?.url || p.imageUrl || undefined;
  const images: ProductImageItem[] = uniqueImages;

  const categoryRelations = (p.categories || [])
    .map((link: any) => link.category)
    .filter(Boolean)
    .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const categoryLabels = categoryRelations.map((category: any) => category.name);
  const categoryName = categoryLabels[0] || p.categories?.[0]?.category?.name || p.category || "";
  
  // shortDescription doubles as "unit" label (e.g. "50 GMS · Camphor")
  const shortDesc = p.shortDescription || "";
  const quantityPart = p.quantity != null ? String(p.quantity) : shortDesc.split("·")[0]?.trim() || "";

  const notePart = shortDesc.includes("·")
    ? shortDesc.split("·").slice(1).join("·").trim()
    : (p.description ? p.description.slice(0, 90) : "");

  const numMrp = typeof p.mrp === 'number' ? p.mrp : parseFloat(p.mrp || 0);
  const numPrice = typeof p.price === 'number' ? p.price : parseFloat(p.price || 0);

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

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: categoryName,
    categoryLabels,
    subCategory: p.subcategory?.name || p.subCategory || "",
    subcategoryId: p.subcategoryId || p.subcategory?.id || null,
    note: p.description ? p.description.slice(0, 100) : notePart,
    description: p.description || p.name,
    mrp: numMrp > 0 ? `₹${numMrp}` : "",
    price: !isNaN(numPrice) && numPrice > 0 ? numPrice : 0,
    bundleQuantity: typeof p.bundleQuantity === 'number' ? p.bundleQuantity : null,
    quantity: quantityPart,
    burnTime: categoryName.toLowerCase().includes("camphor")
      ? "Residue-free clean burning"
      : categoryName.toLowerCase().includes("dhoop")
      ? "35-40 mins per stick"
      : "45-50 mins per stick",
    fragranceNotes: categoryName.toLowerCase().includes("camphor")
      ? ["Pure Camphor", "Cool Camphoric", "Divine White Resins"]
      : categoryName.toLowerCase().includes("dhoop")
      ? ["Sacred Resins", "Rare Woods", "Herbal Extracts"]
      : ["Natural Resins", "Essential Oils", "Botanicals"],
    benefits: categoryName.toLowerCase().includes("camphor")
      ? [
          "100% pure residue-free burning camphor",
          "Purifies indoor atmosphere and vastu energy",
          "Ideal for daily aarti, puja, and diffusers"
        ]
      : categoryName.toLowerCase().includes("dhoop")
      ? [
          "100% natural bamboo-less formulation",
          "Dense, long-lasting sacred aroma",
          "Purifies negative energies and calms the mind"
        ]
      : [
          "100% natural organic ingredients",
          "Zero harmful charcoal or synthetic toxins",
          "Uplifts daily rituals and home ambiance"
        ],
    howToUse: categoryName.toLowerCase().includes("camphor")
      ? [
          "Place on a camphor burner, aarti plate, or electric diffuser.",
          "Light with a flame or switch on your diffuser for sacred purifying aroma."
        ]
      : categoryName.toLowerCase().includes("dhoop")
      ? [
          "Place bamboo-less dhoop stick on a heat-resistant stand or holder.",
          "Light tip until flame appears, then gently blow out to release fragrant smoke."
        ]
      : [
          "Place stick in agarbatti holder.",
          "Light tip until flame appears, then gently blow out."
        ],
    image: primaryImg,
    images,
    badge: p.couponCode ? `COUPON: ${p.couponCode}` : (p.isFeatured ? "Featured" : undefined),
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
    "Budget Pack (12 pcs)",
    "Super Series"
  ]
};

export interface CatalogCategory {
  name: string;
  children?: CatalogCategory[];
}

// Brochure taxonomy only. Product records remain managed separately in the admin panel.
export const categoryTree: CatalogCategory[] = [
  {
    name: "Agarbatti",
    children: [
      { name: "Exclusive", children: [
        { name: "Cardamom" },
        { name: "Kasturi" },
        { name: "Karpoor Loban" },
        { name: "Kesar Loban" },
        { name: "Pancha Rudhra" },
        { name: "Real Stone" },
        { name: "Fancy Flora" },
      ] },
      { name: "Budget Pack (12 pcs)" },
      { name: "Super Series", children: [
        { name: "Rose" },
        { name: "Pineapple" },
        { name: "Sandal" },
        { name: "Glory" },
        { name: "Fantasy" },
        { name: "Jasmine" },
        { name: "Lavender" },
        { name: "Ecstasy" },
        { name: "Kewda" },
        { name: "Loban" },
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
