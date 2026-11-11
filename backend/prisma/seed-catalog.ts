import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CategorySeed {
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  parentSlug?: string;
}

interface CatalogProductSeed {
  sku: string;
  slug: string;
  name: string;
  categorySlug: string;
  extraCategorySlugs?: string[];
  subcategorySlug?: string;
  price: number;
  mrp: number;
  unitPrice: number;
  bundleQuantity: number;
  shortDescription: string;
  description: string;
  displayOrder: number;
  isFeatured?: boolean;
}

const CATEGORIES: CategorySeed[] = [
  {
    name: "Agarbatti",
    slug: "agarbatti",
    description: "Hand-crafted aromatic agarbattis for daily pooja, meditation, and peaceful spaces.",
    displayOrder: 1,
  },
  {
    name: "Exclusive",
    slug: "exclusive",
    description: "MRP ₹125 Exclusive Series fragrances crafted for rich, long-lasting devotional rituals.",
    displayOrder: 1,
    parentSlug: "agarbatti",
  },
  {
    name: "Budget Pack",
    slug: "budget-pack",
    description: "MRP ₹12 Budget Pack agarbattis available as 12-box bundles (12 sticks per box).",
    displayOrder: 2,
    parentSlug: "agarbatti",
  },
  {
    name: "Super Series",
    slug: "super-series",
    description: "MRP ₹75 Super Series 100g packs for daily prayers and serene home ambience.",
    displayOrder: 3,
    parentSlug: "agarbatti",
  },
  {
    name: "Camphor",
    slug: "camphor",
    description: "Pure HM Camphor and Bhimseni (Pacha Karpoor) camphor for sacred aarti and pooja rituals.",
    displayOrder: 2,
  },
  {
    name: "Dhoop Stick",
    slug: "dhoop-stick",
    description: "Compact 4-inch, 5.5 mm thick bamboo-less dhoop sticks with warm, lasting fragrances.",
    displayOrder: 3,
  },
  {
    name: "Incense Cones",
    slug: "incense-cones",
    description: "Natural incense cones for meditation and devotional worship.",
    displayOrder: 4,
  },
  {
    name: "Havan Cups",
    slug: "havan-cups",
    description: "Traditional sambrani and resin havan cups for cleansing your home.",
    displayOrder: 5,
  },
  {
    name: "Sambrani Powder",
    slug: "sambrani-powder",
    description: "Traditional sambrani and cup sambrani essentials.",
    displayOrder: 6,
  },
  {
    name: "Pooja Essentials",
    slug: "pooja-essentials",
    description: "Ready-to-use sacred ritual essentials including the HM Homam Kit.",
    displayOrder: 7,
  },
  {
    name: "Gift Sets",
    slug: "gift-sets",
    description: "Thoughtfully curated devotional fragrance gift sets.",
    displayOrder: 8,
  },
  {
    name: "Family Pack",
    slug: "family-pack",
    description: "Multi-fragrance 10-in-1 and 4-in-1 Aroma Family Packs for every preference.",
    displayOrder: 9,
  },
];

const BUDGET_PACK_SPECS = [
  "Burning Time: 50 minutes",
  "Size: 9 inches",
  "Count: 12 sticks per box (Sold as 12-Box Bundle · Total 144 Sticks)",
  "Ingredients: Wood powder, floral oil, burning mixture, and white stick",
  "Pricing: ₹12 MRP per box · ₹144 Bundle MRP · ₹120 Bundle Price",
].join("\n");

const SUPER_SERIES_SPECS = [
  "Burning Time: 50 minutes",
  "Size: 9 inches",
  "Count: 100gms",
  "Ingredients: Wood powder, floral oil, burning mixture, and white stick, subject to fragrance-specific formulation.",
].join("\n");

function buildExclusiveDescription(
  tagline: string,
  body: string,
  size: string,
  count: string
): string {
  return [
    tagline,
    "",
    body,
    "",
    "Burning Time: 50 minutes",
    `Size: ${size}`,
    `Count: ${count}`,
    "Ingredients: Wood powder, floral oil, burning mixture, and white stick, subject to fragrance-specific formulation.",
  ].join("\n");
}

function buildFourInOneDescription(sizeLabel: string, countLabel: string): string {
  return [
    "Four Traditional Fragrances. One Box. A Touch of Tradition in Every Moment.",
    "",
    "Bring home the distinctive aromas of tradition with the HM 4-in-1 Aroma Family Pack. Featuring Natural Loban, Guggal, Kesar Loban, and Karpoor Loban, this collection brings together four unique fragrances inspired by familiar Indian aromatic traditions.",
    "",
    "From the rich, earthy character of Natural Loban to the distinctive aroma of Guggal, the warm fragrance of Kesar Loban, and the fresh, camphor-inspired notes of Karpoor Loban, every variant offers a different aromatic experience.",
    "",
    "Whether you're preparing for daily pooja, creating a peaceful atmosphere at home, or following your family's cherished rituals, HM brings these four fragrances together in one convenient pack.",
    "",
    "What's Inside:",
    "- Natural Loban — A rich, traditional aroma (White in Colour)",
    "- Guggal — A distinctive, earthy fragrance (Grey in Colour)",
    "- Kesar Loban — A warm, aromatic experience (Orange in Colour)",
    "- Karpoor Loban — A fresh, camphor-inspired aroma (Green in Colour)",
    "",
    `Size: ${sizeLabel}`,
    `Count: ${countLabel}`,
    "Ingredients: Matti Paal Sambrani, Kesar Extract, Bhimseni Camphor, Wood Resins",
  ].join("\n");
}

const CATALOG_PRODUCTS: CatalogProductSeed[] = [
  // =========================================================================
  // 1. AGARBATTI — BUDGET PACK (MRP 12 / box, sold as 12-Box Bundle = ₹120)
  // =========================================================================
  {
    sku: "HM-BP-JASMINE",
    slug: "jasmine-budget-pack",
    name: "Jasmine",
    categorySlug: "agarbatti",
    subcategorySlug: "budget-pack",
    price: 120,
    mrp: 144,
    unitPrice: 12,
    bundleQuantity: 12,
    shortDescription: "12 Sticks/Box × 12 Boxes · 9 in · Budget Pack Bundle",
    description: [
      "Experience the sweet, floral aroma of jasmine that brings a refreshing and traditional fragrance to your pooja rituals, meditation, and everyday home ambience.",
      "",
      BUDGET_PACK_SPECS,
    ].join("\n"),
    displayOrder: 1,
    isFeatured: true,
  },
  {
    sku: "HM-BP-KEWDA",
    slug: "kewda-budget-pack",
    name: "Kewda",
    categorySlug: "agarbatti",
    subcategorySlug: "budget-pack",
    price: 120,
    mrp: 144,
    unitPrice: 12,
    bundleQuantity: 12,
    shortDescription: "12 Sticks/Box × 12 Boxes · 9 in · Budget Pack Bundle",
    description: [
      "Enjoy the distinctive, sweet, and refreshing floral fragrance of kewda. A lovely choice for daily worship, festive occasions, and creating a welcoming atmosphere at home.",
      "",
      BUDGET_PACK_SPECS,
    ].join("\n"),
    displayOrder: 2,
    isFeatured: true,
  },
  {
    sku: "HM-BP-CHAMPA",
    slug: "champa-budget-pack",
    name: "Champa",
    categorySlug: "agarbatti",
    subcategorySlug: "budget-pack",
    price: 120,
    mrp: 144,
    unitPrice: 12,
    bundleQuantity: 12,
    shortDescription: "12 Sticks/Box × 12 Boxes · 9 in · Budget Pack Bundle",
    description: [
      "Fill your surroundings with the rich, warm, and exotic floral notes of champa. Its traditional fragrance makes it a beautiful companion for prayer, meditation, and peaceful moments.",
      "",
      BUDGET_PACK_SPECS,
    ].join("\n"),
    displayOrder: 3,
    isFeatured: true,
  },
  {
    sku: "HM-BP-GLORY",
    slug: "glory-budget-pack",
    name: "Glory",
    categorySlug: "agarbatti",
    subcategorySlug: "budget-pack",
    price: 120,
    mrp: 144,
    unitPrice: 12,
    bundleQuantity: 12,
    shortDescription: "12 Sticks/Box × 12 Boxes · 9 in · Budget Pack Bundle",
    description: [
      "Add a touch of elegance to your surroundings with Glory, a fragrance designed for a pleasant and inviting atmosphere. Ideal for everyday rituals, special occasions, and welcoming guests.",
      "",
      BUDGET_PACK_SPECS,
    ].join("\n"),
    displayOrder: 4,
    isFeatured: true,
  },
  {
    sku: "HM-BP-SANDAL-WOOD",
    slug: "sandal-wood-budget-pack",
    name: "Sandalwood",
    categorySlug: "agarbatti",
    subcategorySlug: "budget-pack",
    price: 120,
    mrp: 144,
    unitPrice: 12,
    bundleQuantity: 12,
    shortDescription: "12 Sticks/Box × 12 Boxes · 9 in · Budget Pack Bundle",
    description: [
      "Discover the timeless, woody, and warm aroma of sandalwood. A classic fragrance for pooja, meditation, and quiet moments when you want a traditional, comforting ambience.",
      "",
      BUDGET_PACK_SPECS,
    ].join("\n"),
    displayOrder: 5,
    isFeatured: true,
  },
  {
    sku: "HM-BP-PINEAPPLE",
    slug: "pineapple-budget-pack",
    name: "Pineapple",
    categorySlug: "agarbatti",
    subcategorySlug: "budget-pack",
    price: 120,
    mrp: 144,
    unitPrice: 12,
    bundleQuantity: 12,
    shortDescription: "12 Sticks/Box × 12 Boxes · 9 in · Budget Pack Bundle",
    description: [
      "Bring a cheerful, tropical touch to your space with the fruity-inspired fragrance of pineapple. A distinctive choice for refreshing your everyday home ambience and adding variety to your fragrance collection.",
      "",
      BUDGET_PACK_SPECS,
    ].join("\n"),
    displayOrder: 6,
    isFeatured: true,
  },
  {
    sku: "HM-BP-ROSE",
    slug: "rose-budget-pack",
    name: "Rose",
    categorySlug: "agarbatti",
    subcategorySlug: "budget-pack",
    price: 120,
    mrp: 144,
    unitPrice: 12,
    bundleQuantity: 12,
    shortDescription: "12 Sticks/Box × 12 Boxes · 9 in · Budget Pack Bundle",
    description: [
      "Enjoy the delicate, romantic, and timeless floral notes of rose. This familiar fragrance adds a graceful touch to prayer rituals, celebrations, and everyday moments at home.",
      "",
      BUDGET_PACK_SPECS,
    ].join("\n"),
    displayOrder: 7,
    isFeatured: true,
  },
  {
    sku: "HM-BP-ECSTASY",
    slug: "ecstasy-budget-pack",
    name: "Ecstasy",
    categorySlug: "agarbatti",
    subcategorySlug: "budget-pack",
    price: 120,
    mrp: 144,
    unitPrice: 12,
    bundleQuantity: 12,
    shortDescription: "12 Sticks/Box × 12 Boxes · 9 in · Budget Pack Bundle",
    description: [
      "Immerse yourself in the distinctive fragrance of Ecstasy, created to bring a rich and expressive aromatic touch to your surroundings. Perfect for those who enjoy exploring fragrances beyond traditional floral notes.",
      "",
      BUDGET_PACK_SPECS,
    ].join("\n"),
    displayOrder: 8,
    isFeatured: true,
  },
  {
    sku: "HM-BP-FANTASY",
    slug: "fantasy-budget-pack",
    name: "Fantasy",
    categorySlug: "agarbatti",
    subcategorySlug: "budget-pack",
    price: 120,
    mrp: 144,
    unitPrice: 12,
    bundleQuantity: 12,
    shortDescription: "12 Sticks/Box × 12 Boxes · 9 in · Budget Pack Bundle",
    description: [
      "Make everyday moments feel special with Fantasy, a distinctive fragrance that adds an elegant aromatic presence to your home. Ideal for personal rituals, festive settings, and creating a pleasant atmosphere.",
      "",
      BUDGET_PACK_SPECS,
    ].join("\n"),
    displayOrder: 9,
    isFeatured: true,
  },
  {
    sku: "HM-BP-LOBAN-SUPER",
    slug: "loban-super-budget-pack",
    name: "Loban",
    categorySlug: "agarbatti",
    subcategorySlug: "budget-pack",
    price: 120,
    mrp: 144,
    unitPrice: 12,
    bundleQuantity: 12,
    shortDescription: "12 Sticks/Box × 12 Boxes · 9 in · Budget Pack Bundle",
    description: [
      "Experience the deep, warm, resinous aroma of loban, a traditional favourite for worship and spiritual rituals. Its rich incense character adds a distinctive touch to prayer spaces and special occasions.",
      "",
      BUDGET_PACK_SPECS,
    ].join("\n"),
    displayOrder: 10,
    isFeatured: true,
  },
  {
    // Preserved extra existing DB Budget Pack item aligned to 12-box bundle rules
    sku: "HM-BP-LAVENDER",
    slug: "lavender-budget-pack",
    name: "Lavender",
    categorySlug: "agarbatti",
    subcategorySlug: "budget-pack",
    price: 120,
    mrp: 144,
    unitPrice: 12,
    bundleQuantity: 12,
    shortDescription: "12 Sticks/Box × 12 Boxes · 9 in · Budget Pack Bundle",
    description: [
      "Experience the soothing, clean floral aroma of lavender designed to bring calm and tranquility to your prayers, meditation, and everyday home ambience.",
      "",
      BUDGET_PACK_SPECS,
    ].join("\n"),
    displayOrder: 11,
    isFeatured: true,
  },

  // =========================================================================
  // 2. AGARBATTI — SUPER SERIES (MRP ₹75 · 100gms)
  // =========================================================================
  {
    sku: "HM-SS-ROSE",
    slug: "rose",
    name: "Rose",
    categorySlug: "agarbatti",
    subcategorySlug: "super-series",
    price: 75,
    mrp: 75,
    unitPrice: 75,
    bundleQuantity: 1,
    shortDescription: "100gms · 9 inches · Super Series",
    description: [
      "A Touch of Grace",
      "",
      "Let the timeless charm of roses fill your home with a sweet, delicate floral aroma. From your morning prayers to peaceful evenings, HM Rose brings a little beauty to every moment.",
      "",
      SUPER_SERIES_SPECS,
    ].join("\n"),
    displayOrder: 1,
    isFeatured: true,
  },
  {
    sku: "HM-SS-GLORY",
    slug: "glory",
    name: "Glory",
    categorySlug: "agarbatti",
    subcategorySlug: "super-series",
    price: 75,
    mrp: 75,
    unitPrice: 75,
    bundleQuantity: 1,
    shortDescription: "100gms · 9 inches · Super Series",
    description: [
      "Make Every Moment Special",
      "",
      "Add a distinctive aromatic touch to your everyday rituals with HM Glory. Crafted for those who love a memorable fragrance, it brings character and warmth to your surroundings.",
      "",
      SUPER_SERIES_SPECS,
    ].join("\n"),
    displayOrder: 2,
    isFeatured: true,
  },
  {
    sku: "HM-SS-LAVENDER",
    slug: "lavender",
    name: "Lavender",
    categorySlug: "agarbatti",
    subcategorySlug: "super-series",
    price: 75,
    mrp: 75,
    unitPrice: 75,
    bundleQuantity: 1,
    shortDescription: "100gms · 9 inches · Super Series",
    description: [
      "Tradition in Every Breath",
      "",
      "Bring home the familiar sweetness of pure lavendar. With its delicate floral character, HM Lavendar makes your daily pooja feel special and adds a refreshing touch to your home.",
      "",
      SUPER_SERIES_SPECS,
    ].join("\n"),
    displayOrder: 3,
    isFeatured: true,
  },
  {
    sku: "HM-SS-SANDAL",
    slug: "sandal-wood",
    name: "Sandalwood",
    categorySlug: "agarbatti",
    subcategorySlug: "super-series",
    price: 75,
    mrp: 75,
    unitPrice: 75,
    bundleQuantity: 1,
    shortDescription: "100gms · 9 inches · Super Series",
    description: [
      "The Soul of Serenity",
      "",
      "Some fragrances never go out of style. HM Sandalwood brings you the warm, woody aroma cherished in traditional worship, making every prayer feel connected to timeless Indian heritage.",
      "",
      SUPER_SERIES_SPECS,
    ].join("\n"),
    displayOrder: 4,
    isFeatured: true,
  },
  {
    sku: "HM-SS-LOBAN",
    slug: "loban",
    name: "Loban",
    categorySlug: "agarbatti",
    subcategorySlug: "super-series",
    price: 75,
    mrp: 75,
    unitPrice: 75,
    bundleQuantity: 1,
    shortDescription: "100gms · 9 inches · Super Series",
    description: [
      "Rooted in Rituals",
      "",
      "Bring home the rich, resinous character of traditional incense. HM Loban celebrates the familiar aromas of Indian devotional practices and gives your prayer space a distinctive traditional touch.",
      "",
      SUPER_SERIES_SPECS,
    ].join("\n"),
    displayOrder: 5,
    isFeatured: true,
  },
  {
    sku: "HM-SS-GUGGAL",
    slug: "guggal",
    name: "Guggal",
    categorySlug: "agarbatti",
    subcategorySlug: "super-series",
    price: 75,
    mrp: 75,
    unitPrice: 75,
    bundleQuantity: 1,
    shortDescription: "100gms · 9 inches · Super Series",
    description: [
      "A Fragrance of Heritage",
      "",
      "Inspired by the age-old traditions of Indian worship, HM Guggal offers a deep, earthy, resinous fragrance. A meaningful addition to your pooja rituals, rooted in the aromas of tradition.",
      "",
      SUPER_SERIES_SPECS,
    ].join("\n"),
    displayOrder: 6,
    isFeatured: true,
  },

  // =========================================================================
  // 3. AGARBATTI — EXCLUSIVE SERIES (MRP ₹125)
  // =========================================================================
  {
    sku: "HM-EX-PANCHA-RUDHRA",
    slug: "pancha-rudhra",
    name: "Pancharudhra",
    categorySlug: "agarbatti",
    subcategorySlug: "exclusive",
    price: 125,
    mrp: 125,
    unitPrice: 125,
    bundleQuantity: 1,
    shortDescription: "65 Sticks · 9 inches · Exclusive Series",
    description: buildExclusiveDescription(
      "The Essence of Tradition",
      "Bring a traditional devotional touch to your pooja rituals with HM Pancharudhra. Inspired by sacred Indian worship practices, its distinctive incense character makes it a meaningful choice for daily prayers and special religious occasions.",
      "9 inches",
      "65 Sticks"
    ),
    displayOrder: 1,
    isFeatured: true,
  },
  {
    sku: "HM-EX-REAL-STONE",
    slug: "real-stone",
    name: "Real Stone",
    categorySlug: "agarbatti",
    subcategorySlug: "exclusive",
    price: 125,
    mrp: 125,
    unitPrice: 125,
    bundleQuantity: 1,
    shortDescription: "65 Sticks · 9 inches · Exclusive Series",
    description: buildExclusiveDescription(
      "Earthy by Nature",
      "Discover a distinctive fragrance experience with HM Real Stone. Its earthy-inspired character offers an alternative to conventional floral aromas, making it a unique addition to your everyday fragrance collection.",
      "9 inches",
      "65 Sticks"
    ),
    displayOrder: 2,
    isFeatured: true,
  },
  {
    sku: "HM-EX-CARDAMOM",
    slug: "cardamom",
    name: "Cardamom",
    categorySlug: "agarbatti",
    subcategorySlug: "exclusive",
    price: 125,
    mrp: 125,
    unitPrice: 125,
    bundleQuantity: 1,
    shortDescription: "50 Sticks · 9 inches · Exclusive Series",
    description: buildExclusiveDescription(
      "A Touch of Spice",
      "Enjoy the distinctive aromatic character inspired by cardamom. HM Cardamom brings a warm, gently spicy dimension to your surroundings, offering something different from traditional floral fragrances.",
      "9 inches",
      "50 Sticks"
    ),
    displayOrder: 3,
    isFeatured: true,
  },
  {
    sku: "HM-EX-KESAR-LOBAN",
    slug: "kesar-loban",
    name: "Kesar Loban",
    categorySlug: "agarbatti",
    subcategorySlug: "exclusive",
    price: 125,
    mrp: 125,
    unitPrice: 125,
    bundleQuantity: 1,
    shortDescription: '50 Sticks · 9 inches Long 3" Thicker · Exclusive Series',
    description: buildExclusiveDescription(
      "Richness Meets Tradition",
      "Experience the traditional character of loban with the luxurious inspiration of kesar. HM Kesar Loban is designed for those who appreciate distinctive incense aromas during pooja, festive celebrations, and special rituals.",
      '9 inches Long 3" Thicker',
      "50 Sticks"
    ),
    displayOrder: 4,
    isFeatured: true,
  },
  {
    sku: "HM-EX-KARPOOR-LOBAN",
    slug: "karpoor-loban",
    name: "Karpoor Loban",
    categorySlug: "agarbatti",
    subcategorySlug: "exclusive",
    price: 125,
    mrp: 125,
    unitPrice: 125,
    bundleQuantity: 1,
    shortDescription: '50 Sticks · 9 inches Long 3" Thicker · Exclusive Series',
    description: buildExclusiveDescription(
      "A Classic Ritual Aroma",
      "Bring together the familiar inspiration of karpoor (camphor) and traditional loban in HM Karpoor Loban. Its devotional fragrance identity makes it a fitting choice for daily worship and religious occasions.",
      '9 inches Long 3" Thicker',
      "50 Sticks"
    ),
    displayOrder: 5,
    isFeatured: true,
  },
  {
    sku: "HM-EX-KASTURI",
    slug: "kasturi",
    name: "Kasturi",
    categorySlug: "agarbatti",
    subcategorySlug: "exclusive",
    price: 125,
    mrp: 125,
    unitPrice: 125,
    bundleQuantity: 1,
    shortDescription: "65 Sticks · 9 inches · Exclusive Series",
    description: buildExclusiveDescription(
      "Deep, Distinctive Elegance",
      "Discover the rich fragrance tradition associated with kasturi. HM Kasturi offers a distinctive option for customers who prefer deeper, more pronounced fragrance profiles over light floral aromas.",
      "9 inches",
      "65 Sticks"
    ),
    displayOrder: 6,
    isFeatured: true,
  },
  {
    sku: "HM-EX-AMORA",
    slug: "amora",
    name: "Amora",
    categorySlug: "agarbatti",
    subcategorySlug: "exclusive",
    price: 125,
    mrp: 125,
    unitPrice: 125,
    bundleQuantity: 1,
    shortDescription: "65 Sticks · 9 inches · Exclusive Series",
    description: buildExclusiveDescription(
      "An Aroma to Remember",
      "Make everyday moments more memorable with HM Amora. Created for customers who enjoy exploring distinctive fragrances, Amora adds a special touch to your home ambience and personal rituals.",
      "9 inches",
      "65 Sticks"
    ),
    displayOrder: 7,
    isFeatured: true,
  },
  {
    sku: "HM-EX-JAVADU",
    slug: "javadu",
    name: "Javadu",
    categorySlug: "agarbatti",
    subcategorySlug: "exclusive",
    price: 125,
    mrp: 125,
    unitPrice: 125,
    bundleQuantity: 1,
    shortDescription: "50 Sticks · 9 inches · Exclusive Series",
    description: buildExclusiveDescription(
      "A Heritage Fragrance",
      "Celebrate the aromatic heritage of South India with HM Javadu. Inspired by the traditional javadu fragrance known for its distinctive perfumed character, it brings a touch of cultural familiarity to your daily rituals.",
      "9 inches",
      "50 Sticks"
    ),
    displayOrder: 8,
    isFeatured: true,
  },
  {
    sku: "HM-EX-CHAMPA",
    slug: "champa",
    name: "Champa",
    categorySlug: "agarbatti",
    subcategorySlug: "exclusive",
    price: 125,
    mrp: 125,
    unitPrice: 125,
    bundleQuantity: 1,
    shortDescription: "65 Sticks · 9 inches · Exclusive Series",
    description: buildExclusiveDescription(
      "Floral Beauty, Timeless Charm",
      "Fill your surroundings with the inspiration of fragrant champa blossoms. HM Champa brings a traditional floral touch to pooja, meditation, celebrations, and peaceful moments at home.",
      "9 inches",
      "65 Sticks"
    ),
    displayOrder: 9,
    isFeatured: true,
  },
  {
    sku: "HM-EX-MEGADHOOTH",
    slug: "megadhooth",
    name: "Megadhooth",
    categorySlug: "agarbatti",
    subcategorySlug: "exclusive",
    price: 125,
    mrp: 125,
    unitPrice: 125,
    bundleQuantity: 1,
    shortDescription: "65 Sticks · 9 inches · Exclusive Series",
    description: buildExclusiveDescription(
      "Inspired by the Rain",
      "Let your senses explore something distinctive with HM Megadhooth. Inspired by the evocative imagery of clouds and the beauty of nature, this fragrance brings a memorable identity to your incense collection.",
      "9 inches",
      "65 Sticks"
    ),
    displayOrder: 10,
    isFeatured: true,
  },
  {
    sku: "HM-EX-FANCY-FLORA",
    slug: "fancy-flora",
    name: "Fancy Flora",
    categorySlug: "agarbatti",
    subcategorySlug: "exclusive",
    price: 110,
    mrp: 110,
    unitPrice: 110,
    bundleQuantity: 1,
    shortDescription: "Exclusive Series · Temple Floral Bouquet",
    description:
      "HM Exclusive Fancy Flora Agarbatti is handcrafted with a bouquet of sacred temple blooms and fragrant botanicals, evoking a festive and devotional atmosphere ideal for morning and evening worship.",
    displayOrder: 11,
    isFeatured: true,
  },

  // =========================================================================
  // 4. FAMILY PACK
  // =========================================================================
  {
    sku: "HM-FP-10-IN-1-FAMILY-PACK",
    slug: "10-in-1-family-pack",
    name: "10-in-1 Aroma Family Pack",
    categorySlug: "family-pack",
    extraCategorySlugs: ["gift-sets"],
    price: 100,
    mrp: 120,
    unitPrice: 100,
    bundleQuantity: 1,
    shortDescription: "100 Sticks (10 × 10) · 9 in · Special Price ₹100",
    description: [
      "Ten Fragrances. One Box. A Fragrance for Every Moment.",
      "",
      "Discover a world of aromas with the HM 10-in-1 Aroma Family Pack. From the delicate floral notes of Jasmine and Rose to the timeless warmth of Sandalwood and the traditional aroma of Loban, every fragrance brings its own character to your home.",
      "",
      "Explore the refreshing notes of Kewda, the floral charm of Champa, and the distinctive fragrances of Glory, Pineapple, Ecstasy, and Fantasy. With 10 different fragrances in one convenient box, you can discover new favourites and enjoy a different aromatic experience whenever you wish.",
      "",
      "Whether it's your daily pooja, a special occasion, or simply bringing a familiar fragrance into your home, HM offers variety for every preference.",
      "",
      "What's Inside:",
      "- 10 unique fragrances {Jasmine, Kewda, Lavendar, Rose, Sandalwood, Loban, Pineapple, Ecstasy, Fantasy, Glory}",
      "- 10 sticks per fragrance",
      "- 100 agarbatti sticks in total",
      "- 9-inch white bamboo sticks",
      "- Use for Everyday Pooja with a Divine Punch",
      "- Satisfies all your Family Members",
      "- Best for Poojas, Home Décor, Yoga & Wellness",
      "- Approximately 50 minutes of burning time per stick, subject to testing",
      "",
      "Burning Time: Approximately 50 minutes per stick, subject to testing",
      "Size: 9-inch white bamboo sticks",
      "Count: 100 Sticks (10 sticks × 10 fragrances)",
      "Pricing: MRP ₹120 · Special Price ₹100",
    ].join("\n"),
    displayOrder: 1,
    isFeatured: true,
  },
  {
    sku: "HM-FP-4-IN-1-LOBAN",
    slug: "4-in-1-loban",
    name: "4-in-1 Aroma Family Pack (Big - 250gms)",
    categorySlug: "family-pack",
    price: 210,
    mrp: 210,
    unitPrice: 210,
    bundleQuantity: 1,
    shortDescription: "250gms (Approx 95 Sticks) · Big Pack · 4 Fragrances",
    description: buildFourInOneDescription("Big Pack · 250gms", "Approx 95 Sticks"),
    displayOrder: 2,
    isFeatured: true,
  },
  {
    sku: "HM-FP-4-IN-1-LOBAN-SMALL",
    slug: "4-in-1-aroma-family-pack-small",
    name: "4-in-1 Aroma Family Pack (Small - 125gms)",
    categorySlug: "family-pack",
    price: 110,
    mrp: 110,
    unitPrice: 110,
    bundleQuantity: 1,
    shortDescription: "125gms (Approx 45 Sticks) · Small Pack · 4 Fragrances",
    description: buildFourInOneDescription("Small Pack · 125gms", "Approx 45 Sticks"),
    displayOrder: 3,
    isFeatured: true,
  },

  // =========================================================================
  // 5. POOJA ESSENTIALS — HOMAM KIT & DIFFUSER
  // =========================================================================
  {
    sku: "HM-HOMAM-KIT",
    slug: "homam-kit",
    name: "Homam Kit",
    categorySlug: "pooja-essentials",
    extraCategorySlugs: ["gift-sets"],
    price: 299,
    mrp: 299,
    unitPrice: 299,
    bundleQuantity: 1,
    shortDescription: "6-Item Complete Ritual Kit · MRP ₹299",
    description: [
      "A Traditional Homam Experience, Thoughtfully Packed for Your Home.",
      "",
      "Bring the essence of traditional rituals into your home with the HM Homam Kit. Thoughtfully assembled with essential homam materials, this kit helps you prepare for your ritual with greater convenience, without having to source every item separately.",
      "",
      "Whether you're observing a special occasion or following a family tradition, HM brings the essentials together in one convenient kit.",
      "",
      "What's Inside:",
      "- Small Mud Homam Pot - A traditional earthen pot for conducting your homam.",
      "- 20-Herb Mixed Homam Powder - A blend of herbs prepared for homam rituals.",
      "- Slokam Card - A handy reference for the included devotional verses.",
      "- Instruction Manual - Step-by-step guidance to help you understand the kit's use.",
      "- Dried Cow Dung Pieces - Traditional homam material.",
      "- Coconut Shells - Included as part of the homam materials.",
      "",
      "Why Choose:",
      "- Essential materials conveniently packed together.",
      "- A practical option for families observing traditional rituals.",
      "- Helpful for those who prefer a ready-to-use kit rather than purchasing items individually.",
      "- HM Homam Kit - Tradition, Made Convenient.",
      "",
      "Count: 6 Complete Ritual Items in One Kit",
    ].join("\n"),
    displayOrder: 1,
    isFeatured: true,
  },

  // =========================================================================
  // 6. CAMPHORS & BHIMSENI CAMPHORS (Keep existing DB prices)
  // =========================================================================
  {
    sku: "HM-CAMPHOR-12",
    slug: "camphor",
    name: "Camphor — ₹12 Pack",
    categorySlug: "camphor",
    price: 12,
    mrp: 12,
    unitPrice: 12,
    bundleQuantity: 1,
    shortDescription: "₹12 Pack · Pure Sacred Camphor",
    description: [
      "Bring home the familiar fragrance of camphor with HM Camphor. A valued part of Indian pooja rituals, camphor is commonly used during aarti and other devotional practices. Its distinctive aroma adds a traditional touch to your daily worship and special occasions.",
      "",
      "Count: ₹12 Handy Pack",
      "Burning Time: Clean & residue-free aarti flame",
    ].join("\n"),
    displayOrder: 1,
    isFeatured: true,
  },
  {
    sku: "HM-CAMPHOR-55",
    slug: "camphor-0896",
    name: "Camphor — ₹55 Pack",
    categorySlug: "camphor",
    price: 55,
    mrp: 55,
    unitPrice: 55,
    bundleQuantity: 1,
    shortDescription: "₹55 Pack · Pure Sacred Camphor",
    description: [
      "Bring home the familiar fragrance of camphor with HM Camphor. A valued part of Indian pooja rituals, camphor is commonly used during aarti and other devotional practices. Its distinctive aroma adds a traditional touch to your daily worship and special occasions.",
      "",
      "Count: ₹55 Family Pack",
      "Burning Time: Clean & residue-free aarti flame",
    ].join("\n"),
    displayOrder: 2,
    isFeatured: true,
  },
  {
    sku: "HM-CAMPHOR-85",
    slug: "camphor-2381",
    name: "Camphor — ₹85 Economy Pack",
    categorySlug: "camphor",
    price: 85,
    mrp: 85,
    unitPrice: 85,
    bundleQuantity: 1,
    shortDescription: "₹85 Economy Pack · Pure Sacred Camphor",
    description: [
      "Bring home the familiar fragrance of camphor with HM Camphor. A valued part of Indian pooja rituals, camphor is commonly used during aarti and other devotional practices. Its distinctive aroma adds a traditional touch to your daily worship and special occasions.",
      "",
      "Count: ₹85 Economy Pack",
      "Burning Time: Clean & residue-free aarti flame",
    ].join("\n"),
    displayOrder: 3,
    isFeatured: true,
  },
  {
    sku: "HM-PACHA-KARPOOR-55",
    slug: "pacha-karpoor-55",
    name: "Pacha Karpoor — ₹55",
    categorySlug: "camphor",
    price: 55,
    mrp: 55,
    unitPrice: 55,
    bundleQuantity: 1,
    shortDescription: "₹55 Pack · HM Bhimseni Camphor",
    description: [
      "Experience the traditional appeal of HM Bhimseni Camphor, valued for its characteristic camphor fragrance and use in devotional practices. Suitable for pooja and aarti, it brings a familiar aromatic element to your daily rituals and special spiritual occasions.",
      "",
      "Count: ₹55 Pack (Bhimseni Pacha Karpoor)",
      "Burning Time: Clean & crystalline traditional burn",
    ].join("\n"),
    displayOrder: 4,
    isFeatured: true,
  },
  {
    sku: "HM-PACHA-KARPOOR-185",
    slug: "pacha-karpoor-185",
    name: "Pacha Karpoor — ₹185",
    categorySlug: "camphor",
    price: 185,
    mrp: 185,
    unitPrice: 185,
    bundleQuantity: 1,
    shortDescription: "₹185 Economy Jar · HM Bhimseni Camphor",
    description: [
      "Experience the traditional appeal of HM Bhimseni Camphor, valued for its characteristic camphor fragrance and use in devotional practices. Suitable for pooja and aarti, it brings a familiar aromatic element to your daily rituals and special spiritual occasions.",
      "",
      "Count: ₹185 Economy Jar (Bhimseni Pacha Karpoor)",
      "Burning Time: Clean & crystalline traditional burn",
    ].join("\n"),
    displayOrder: 5,
    isFeatured: true,
  },

  // =========================================================================
  // 7. DHOOP STICKS (Keep existing ₹120 price)
  // =========================================================================
  {
    sku: "HM-DHOOP-ITALIAN-MEHAK",
    slug: "italian-mehak",
    name: "Italian Mehak",
    categorySlug: "dhoop-stick",
    price: 120,
    mrp: 120,
    unitPrice: 120,
    bundleQuantity: 1,
    shortDescription: "Bamboo-less Dhoop Sticks · 4 inches · 5.5 mm Thick",
    description: [
      "Fusion of Italian Sweetness and Royal Attar which bring a touch of tradition to your daily pooja with HM Dhoop Sticks. Designed in a compact 4-inch size, these dhoop sticks offer a convenient way to enjoy your daily rituals and create a welcoming atmosphere at home.",
      "",
      "Length: 4 inches",
      "Thickness: 5.5 mm",
      "Burning Time: Approximately 35 minutes per stick",
    ].join("\n"),
    displayOrder: 1,
    isFeatured: true,
  },
  {
    sku: "HM-DHOOP-INDIAN-BAKHOOR",
    slug: "indian-bakhoor",
    name: "Indian Bakhoor",
    categorySlug: "dhoop-stick",
    price: 120,
    mrp: 120,
    unitPrice: 120,
    bundleQuantity: 1,
    shortDescription: "Bamboo-less Dhoop Sticks · 4 inches · 5.5 mm Thick",
    description: [
      "A Fusion of Royal Bakhoor Powders with a Touch of Divinity where we experience the richness of fragrance with HM Indian Bakhoor, where the captivating character of Royal Bakhoor powders meets the essence of tradition. Crafted to bring an elegant aromatic experience to your surroundings, its distinctive fragrance adds warmth, charm, and a touch of divinity to your space.",
      "",
      "Perfect for special occasions, traditional rituals, or simply elevating the ambience of your home, HM Indian Bakhoor transforms ordinary moments into memorable fragrance experiences.",
      "",
      "Length: 4 inches",
      "Thickness: 5.5 mm",
      "Burning Time: Approximately 35 minutes per stick",
    ].join("\n"),
    displayOrder: 2,
    isFeatured: true,
  },
  {
    sku: "HM-KARPPOR-DANI-MACHINE",
    slug: "karppor-dani-machine",
    name: "Karppor dani machine",
    categorySlug: "pooja-essentials",
    price: 399,
    mrp: 399,
    unitPrice: 399,
    bundleQuantity: 1,
    shortDescription: "Electric Camphor & Resin Diffuser · Pooja Burner",
    description:
      "Premium Kapoor Dani electric burner and aroma diffuser for diffusing camphor and sacred resins evenly throughout your home.",
    displayOrder: 2,
    isFeatured: true,
  },

  // =========================================================================
  // 8. HAVAN CUPS — CUP SAMBRANI (Corrected from Sambrani Powder)
  // =========================================================================
  {
    sku: "SKU-449972",
    slug: "cup-sambarani",
    name: "Cup Sambrani",
    categorySlug: "havan-cups",
    price: 125,
    mrp: 125,
    unitPrice: 125,
    bundleQuantity: 1,
    shortDescription: "Sambrani Havan Cups · Rich Aromatic Resin",
    description:
      "Bring a traditional touch to your pooja rituals with our premium Sambrani Cups. They create a soothing, aromatic atmosphere, making them ideal for daily worship, meditation, and special religious occasions. Perfect for enhancing the spiritual ambience of your home or pooja room.",
    displayOrder: 1,
    isFeatured: true,
  },
];

export async function seedCatalog(client: PrismaClient = prisma) {
  console.log("🚀 Seeding official HM Brand catalog from WEBSITE DOCUMENT...\n");

  // 1. Ensure all categories and subcategories exist (without deleting existing ones)
  const categoryIdBySlug = new Map<string, string>();

  for (const cat of CATEGORIES.filter((c) => !c.parentSlug)) {
    const existing = await client.category.findUnique({ where: { slug: cat.slug } });
    const record = await client.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: existing?.description || cat.description,
        displayOrder: cat.displayOrder,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: cat.displayOrder,
        isActive: true,
      },
    });
    categoryIdBySlug.set(record.slug, record.id);
  }

  for (const sub of CATEGORIES.filter((c) => c.parentSlug)) {
    const parentId = categoryIdBySlug.get(sub.parentSlug!);
    const existing = await client.category.findUnique({ where: { slug: sub.slug } });
    const record = await client.category.upsert({
      where: { slug: sub.slug },
      update: {
        name: sub.name,
        description: existing?.description || sub.description,
        parentId: parentId ?? null,
        displayOrder: sub.displayOrder,
        isActive: true,
      },
      create: {
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        parentId: parentId ?? null,
        displayOrder: sub.displayOrder,
        isActive: true,
      },
    });
    categoryIdBySlug.set(record.slug, record.id);
  }

  console.log(`✅ Verified ${categoryIdBySlug.size} categories & subcategories.\n`);

  // 2. Upsert catalog products idempotently (preserving Cloudinary images and orders, syncing categories)
  let updatedCount = 0;
  let createdCount = 0;

  for (const item of CATALOG_PRODUCTS) {
    const categoryId = categoryIdBySlug.get(item.categorySlug);
    if (!categoryId) {
      throw new Error(`Missing category ID for slug "${item.categorySlug}"`);
    }
    const extraCategoryIds = (item.extraCategorySlugs ?? []).map((extraSlug) => {
      const id = categoryIdBySlug.get(extraSlug);
      if (!id) {
        throw new Error(`Missing extra category ID for slug "${extraSlug}"`);
      }
      return id;
    });
    const desiredCategoryIds = Array.from(new Set([categoryId, ...extraCategoryIds]));
    const subcategoryId = item.subcategorySlug
      ? categoryIdBySlug.get(item.subcategorySlug) ?? null
      : null;

    const existing =
      (await client.product.findUnique({ where: { sku: item.sku } })) ??
      (await client.product.findUnique({ where: { slug: item.slug } }));

    const baseTime = Date.now();

    if (existing) {
      await client.product.update({
        where: { id: existing.id },
        data: {
          sku: item.sku,
          slug: item.slug,
          name: item.name,
          shortDescription: item.shortDescription,
          description: item.description,
          price: item.price,
          mrp: item.mrp,
          unitPrice: item.unitPrice,
          bundleQuantity: item.bundleQuantity,
          subcategoryId,
          displayOrder: item.displayOrder,
          isActive: true,
          isFeatured: item.isFeatured ?? existing.isFeatured,
        },
      });

      // Remove stale/incorrect category assignments and ensure desired category links exist
      await client.productCategory.deleteMany({
        where: {
          productId: existing.id,
          categoryId: { notIn: desiredCategoryIds },
        },
      });

      for (let idx = 0; idx < desiredCategoryIds.length; idx++) {
        const targetCatId = desiredCategoryIds[idx];
        await client.productCategory.upsert({
          where: {
            productId_categoryId: {
              productId: existing.id,
              categoryId: targetCatId,
            },
          },
          update: {},
          create: {
            productId: existing.id,
            categoryId: targetCatId,
            createdAt: new Date(baseTime + idx * 1000),
          },
        });
      }

      updatedCount++;
      console.log(`  🔄 Updated: [${item.sku}] ${item.name} (₹${item.price}, MRP ₹${item.mrp})`);
    } else {
      await client.product.create({
        data: {
          sku: item.sku,
          slug: item.slug,
          name: item.name,
          shortDescription: item.shortDescription,
          description: item.description,
          price: item.price,
          mrp: item.mrp,
          unitPrice: item.unitPrice,
          bundleQuantity: item.bundleQuantity,
          stockQuantity: 100,
          subcategoryId,
          displayOrder: item.displayOrder,
          isActive: true,
          isFeatured: item.isFeatured ?? true,
          categories: {
            create: desiredCategoryIds.map((targetCatId, idx) => ({
              categoryId: targetCatId,
              createdAt: new Date(baseTime + idx * 1000),
            })),
          },
        },
      });

      createdCount++;
      console.log(`  ➕ Created: [${item.sku}] ${item.name} (₹${item.price}, MRP ₹${item.mrp})`);
    }
  }

  console.log(`\n🎉 Catalog seed complete: ${updatedCount} updated, ${createdCount} created.`);
}

if (require.main === module) {
  seedCatalog()
    .catch((err) => {
      console.error("❌ Catalog seed failed:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
