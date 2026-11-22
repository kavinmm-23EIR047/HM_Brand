import { NextRequest, NextResponse } from "next/server";
import { mapDbProductToProduct, type Product } from "@/lib/products";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_DISPLAY,
  CONTACT_WHATSAPP_NUMBER,
  CONTACT_ADDRESS,
  CONTACT_MAPS_URL,
} from "@/lib/contact-info";

export const dynamic = "force-dynamic";

interface ChatMessageInput {
  role: "user" | "assistant" | "system";
  content: string;
}

const BACKEND_API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");

function getCatalogProductImage(product: any): string | undefined {
  const candidates = [
    product?.image,
    product?.imageUrl,
    product?.images?.find((image: any) => image?.isPrimary)?.url,
    ...(Array.isArray(product?.images) ? product.images.map((image: any) => image?.url) : []),
  ];
  return candidates.find((url) => typeof url === 'string' && url && !/brand_logo(?:_gold_transparent|_icon_transparent)/i.test(url));
}

// Static high-level context of HM Agarbattis website — zero runtime crawling latency
const STORE_OVERVIEW = `HM Agarbattis & Fragrances, Peelamedu, Coimbatore, Tamil Nadu.
Specialty: 100% natural flower agarbattis (charcoal-free, soot-free), pure Bhimseni camphor, herbal cup sambrani, dhoop sticks.
Workshop & Office Address: ${CONTACT_ADDRESS}
Contact Phone: ${CONTACT_PHONE_DISPLAY}
WhatsApp Support: ${CONTACT_WHATSAPP_DISPLAY}
Store Pages:
- /shop: All Products catalog
- /cart: Shopping cart (view added items, update quantities)
- /checkout: Checkout & payment page (Cash on Delivery & Razorpay UPI/Cards/Netbanking)
- /about: Workshop story & traditional craftsmanship in Coimbatore
- /contact: Contact details, workshop address, WhatsApp support
Ordering Process: Customers click "Add" on any product to put it in their cart, then open the cart and click "Proceed to Checkout" (/checkout) to enter their delivery address and place the order.`;

const STORE_CATEGORIES = [
  {
    name: "Agarbatti",
    tamilName: "அகர்பத்தி",
    slug: "agarbatti",
    desc: "₹12 முதல் ₹125 வரை 28+ மலர் மற்றும் லோபன் நறுமணங்கள்",
    icon: "flower",
    link: "/shop?category=Agarbatti",
  },
  {
    name: "Camphor",
    tamilName: "தூய கற்பூரம்",
    slug: "camphor",
    desc: "100% கறை படியாத சுத்தமான கற்பூரம் (₹12 - ₹185)",
    icon: "camphor",
    link: "/shop?category=Camphor",
  },
  {
    name: "Dhoop Stick",
    tamilName: "தூப் குச்சிகள்",
    slug: "dhoop-stick",
    desc: "Italian Mehak & Indian Bakhoor (₹120)",
    icon: "leaf",
    link: "/shop?category=Dhoop%20Stick",
  },
  {
    name: "Havan Cups",
    tamilName: "கப் சாம்பிராணி",
    slug: "havan-cups",
    desc: "தூய இயற்கை லோபன் ரெசின் கப்புகள் (₹125)",
    icon: "camphor",
    link: "/shop?category=Havan%20Cups",
  },
  {
    name: "Family Pack",
    tamilName: "10-இன்-1 குடும்பப் பொதி",
    slug: "family-pack",
    desc: "10 நறுமணங்கள் கொண்ட பிரத்யேக பேக் (₹100)",
    icon: "pack",
    link: "/shop?category=Family%20Pack",
  },
  {
    name: "Pooja Essentials",
    tamilName: "பூஜைப் பொருட்கள்",
    slug: "pooja-essentials",
    desc: "ஹோம கிட் & எலக்ட்ரிக் கற்பூர தனி மெஷின்",
    icon: "pooja",
    link: "/shop?category=Pooja%20Essentials",
  },
];

let cachedCatalog: Product[] = [];
let lastCatalogFetch = 0;

const FALLBACK_CORE_CATALOG: Product[] = [
  {
    id: "prod-10-in-1",
    slug: "10-in-1-family-pack",
    name: "10-in-1 Aroma Family Pack",
    category: "Family Pack",
    price: 100,
    mrp: "₹120",
    image: "/images/brand_logo_gold_transparent.png",
    inStock: true,
  } as Product,
  {
    id: "prod-cup-sambrani",
    slug: "cup-sambarani",
    name: "Cup Sambrani",
    category: "Havan Cups",
    price: 125,
    mrp: "₹140",
    image: "/images/brand_logo_gold_transparent.png",
    inStock: true,
  } as Product,
  {
    id: "prod-rose",
    slug: "rose",
    name: "Rose",
    category: "Agarbatti",
    price: 75,
    mrp: "₹85",
    image: "/images/brand_logo_gold_transparent.png",
    inStock: true,
  } as Product,
  {
    id: "prod-jasmine-budget",
    slug: "jasmine-budget-pack",
    name: "Jasmine (Budget Pack)",
    category: "Agarbatti",
    price: 120,
    mrp: "₹144",
    image: "/images/brand_logo_gold_transparent.png",
    inStock: true,
  } as Product,
  {
    id: "prod-4in1-small",
    slug: "4-in-1-aroma-family-pack-small",
    name: "4-in-1 Aroma Family Pack (Small - 125gms)",
    category: "Family Pack",
    price: 110,
    mrp: "₹130",
    image: "/images/brand_logo_gold_transparent.png",
    inStock: true,
  } as Product,
  {
    id: "prod-4in1-big",
    slug: "4-in-1-loban",
    name: "4-in-1 Aroma Family Pack (Big - 250gms)",
    category: "Family Pack",
    price: 210,
    mrp: "₹240",
    image: "/images/brand_logo_gold_transparent.png",
    inStock: true,
  } as Product,
  {
    id: "prod-sandal",
    slug: "sandal-wood",
    name: "Sandalwood",
    category: "Agarbatti",
    price: 75,
    mrp: "₹85",
    image: "/images/brand_logo_gold_transparent.png",
    inStock: true,
  } as Product,
  {
    id: "prod-loban",
    slug: "loban",
    name: "Loban",
    category: "Agarbatti",
    price: 75,
    mrp: "₹85",
    image: "/images/brand_logo_gold_transparent.png",
    inStock: true,
  } as Product,
  {
    id: "prod-loban-budget",
    slug: "loban-super-budget-pack",
    name: "Loban (Super Budget Pack)",
    category: "Agarbatti",
    price: 120,
    mrp: "₹144",
    image: "/images/brand_logo_gold_transparent.png",
    inStock: true,
  } as Product,
  {
    id: "prod-camphor-12",
    slug: "camphor",
    name: "Camphor — ₹12 Pack",
    category: "Camphor",
    price: 12,
    mrp: "₹15",
    image: "/images/brand_logo_gold_transparent.png",
    inStock: true,
  } as Product,
  {
    id: "prod-camphor-55",
    slug: "camphor-0896",
    name: "Camphor — ₹55 Pack",
    category: "Camphor",
    price: 55,
    mrp: "₹65",
    image: "/images/brand_logo_gold_transparent.png",
    inStock: true,
  } as Product,
  {
    id: "prod-italian-mehak",
    slug: "italian-mehak",
    name: "Italian Mehak",
    category: "Dhoop Stick",
    price: 120,
    mrp: "₹140",
    image: "/images/brand_logo_gold_transparent.png",
    inStock: true,
  } as Product,
];

async function getLiveCatalog(clientCatalog: unknown): Promise<Product[]> {
  const now = Date.now();
  if (Array.isArray(clientCatalog) && clientCatalog.length > 0) {
    cachedCatalog = clientCatalog as Product[];
    lastCatalogFetch = now;
    return cachedCatalog;
  }

  if (cachedCatalog.length > 0 && now - lastCatalogFetch < 120_000) {
    return cachedCatalog;
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}/products?limit=500`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (response.ok) {
      const result = await response.json();
      if (result?.success && Array.isArray(result.data) && result.data.length > 0) {
        cachedCatalog = result.data.map((item: any) => mapDbProductToProduct(item));
        lastCatalogFetch = now;
        return cachedCatalog;
      }
    }
  } catch {}

  if (cachedCatalog.length > 0) return cachedCatalog;
  return Array.isArray(clientCatalog) && clientCatalog.length > 0
    ? (clientCatalog as Product[])
    : [];
}

function parsePriceFilter(query: string): { minPrice: number | null; maxPrice: number | null; minInclusive: boolean } {
  const clean = query.toLowerCase();
  const amountMatch = clean.match(/(?:₹\s*|\b(?:rs\.?|inr|rupees?)\s*)(\d+(?:\.\d+)?)|\b(\d+(?:\.\d+)?)\s*(?:₹|\b(?:rs\.?|inr|rupees?)\b)/i);
  const rangeAmountMatch = clean.match(/\b(\d+(?:\.\d+)?)(?!\d)/);
  let amount = Number(amountMatch?.[1] || amountMatch?.[2] || rangeAmountMatch?.[1]);

  if (!Number.isFinite(amount)) {
    if (/ஆயிரம்/.test(clean)) amount = 1000;
    else if (/ஐந்நூறு/.test(clean)) amount = 500;
    else if (/முன்னூறு/.test(clean)) amount = 300;
    else if (/இருநூறு/.test(clean)) amount = 200;
    else if (/நூறு/.test(clean)) amount = 100;
    else if (/ஐம்பது/.test(clean)) amount = 50;
    else return { minPrice: null, maxPrice: null, minInclusive: true };
  }

  const wantsMinimum =
    /\b(above|over|more than|greater than|higher than|at least|minimum|starting at|from)\b/i.test(clean) ||
    /(?:க்கு\s*மேல்|மேலாக|அதிகமாக|குறைந்தபட்சம்)/.test(clean);
  const wantsMaximum =
    /\b(under|below|less than|up to|within|upto|maximum|max|budget|not more than)\b/i.test(clean) ||
    /(?:க்கு\s*கீழ்|வரை|அதிகபட்சம்)/.test(clean);

  const minInclusive =
    /\b(at least|minimum|starting at|from)\b/i.test(clean) || /குறைந்தபட்சம்/.test(clean);
  if (wantsMinimum && !wantsMaximum) return { minPrice: amount, maxPrice: null, minInclusive };
  if (wantsMaximum || amountMatch) return { minPrice: null, maxPrice: amount, minInclusive: true };
  return { minPrice: null, maxPrice: null, minInclusive: true };
}

function carryForwardPriceDirection(query: string, history: ChatMessageInput[]): string {
  const correction = /\b(i mean|i say|i meant|actually|sorry|no[, ]|not that)\b/i.test(query);
  const hasDirection =
    /\b(above|over|more than|greater than|higher than|at least|minimum|starting at|from|under|below|less than|up to|within|upto|maximum|max|budget|not more than)\b/i.test(query) ||
    /(?:க்கு\s*மேல்|மேலாக|அதிகமாக|குறைந்தபட்சம்|க்கு\s*கீழ்|வரை|அதிகபட்சம்)/.test(query);
  if (!correction || hasDirection || !/\d/.test(query)) return query;

  const previousPriceRequest = [...history].reverse().find((item) => {
    if (item.role !== 'user' || typeof item.content !== 'string') return false;
    const filter = parsePriceFilter(item.content);
    return filter.minPrice !== null || filter.maxPrice !== null;
  });
  if (!previousPriceRequest) return query;

  const previousFilter = parsePriceFilter(previousPriceRequest.content);
  if (previousFilter.minPrice !== null) return `${query} above`;
  if (previousFilter.maxPrice !== null) return `${query} under`;
  return query;
}

const hasTamil = (s: string) => /[\u0B80-\u0BFF]/.test(s);

// Detect Cart and Checkout navigation queries (including Tamil STT variations)
function checkCartOrCheckoutIntent(query: string) {
  const clean = query.toLowerCase();

  // Speech-to-text often transcribes "Add to cart" as "ஆட்டோ கார்ட்", "ஆட்டோகார்ட்", "ஆட்டோக்காரன்", etc.
  const isAddToCart =
    /\b(add\s*to\s*cart|add\s*cart)\b/i.test(clean) ||
    /ஆட்டோ\s*கார்ட்|ஆட்டோகார்ட்|ஆட்டோ\s*கார்டு|ஆட்டோக்காரன்|கார்ட்டில்\s*சேர்|கார்ட்ல\s*போடு|கார்ட்டில்\s*சேர்க்க/i.test(clean);

  const isCheckout =
    /\b(checkout|check\s*out|order\s*page|buy\s*now|pay)\b/i.test(clean) ||
    /செக்\s*அவுட்|செக்அவுட்|செக்\s*அவுட்டு|கார்ப்\s*பேச்சு|கார்ட்\s*பேச்சு|ஆர்டர்\s*பேச்சு|ஆர்டர்\s*பேஜ்|எப்படி\s*ஆர்டர்\s*பண்றது|செக்\s*அவுட்\s*பேச்சுக்கு/i.test(clean);

  const isCart =
    /\b(cart\s*page|view\s*cart|open\s*cart|my\s*cart)\b/i.test(clean) ||
    /கார்ட்\s*பக்கம்|கார்ட்\s*பேஜ்|கார்ட்டை\s*திற|கார்ட்டை\s*பார்|என்\s*கார்ட்/i.test(clean);

  if (isAddToCart || isCheckout || isCart) {
    return { isAddToCart, isCheckout, isCart };
  }
  return null;
}

// Detect request for office address, location, phone, call, whatsapp, direct contact
function checkContactIntent(query: string): boolean {
  const clean = query.toLowerCase();
  return (
    /\b(office|address|location|where\s*is\s*(?:the\s*)?(?:office|workshop|store|shop)|contact|phone|call|whatsapp|mobile|number|reach\s*you|customer\s*care|support)\b/i.test(clean) ||
    /ஆபீஸ்|அலுவலகம்|அட்ரஸ்|முகவரி|எங்க\s*இருக்கு|எங்கே\s*இருக்கு|பட்டறை\s*எங்கே|கால்\s*பண்ண|போன்|தொலைபேசி|தொடர்பு|வாட்ஸ்அப்|வாட்ஸ்\s*அப்|கஸ்டமர்\s*கேர்|நம்பர்|எண்|டீடைல்ஸ்\s*தான்|டீடெயில்ஸ்\s*தான்|எங்க\s*இருக்குது/i.test(clean)
  );
}

// Detect request for product categories
function checkCategoryIntent(query: string): boolean {
  const clean = query.toLowerCase();
  return (
    /\b(categor(?:y|ies)|what\s*(?:kinds?|types?|categories)\s*(?:do\s*you\s*have|are\s*there)|what\s*do\s*you\s*sell|all\s*categories|list\s*categories)\b/i.test(clean) ||
    /கேட்டகிரி|கேட்டகரி|வகைகள்|பிரிவு|பிரிவுகள்|என்னென்ன\s*(?:பிரிவு|வகை|கேட்டகிரி|ப்ராடக்ட்|பொருள்)|ப்ராடக்ட்ஸ்.*கேட்டகிரி|கேட்டகிரி.*ப்ராடக்ட்|எல்லா\s*கேட்டகிரி|எல்லா\s*வகைகளும்|என்ன\s*ப்ராடக்ட்ஸ்\s*இருக்கு|கேட்டகிரிஸ்|கேட்டகரிஸ்/i.test(clean)
  );
}

// Detect request for special offers, discounts, budget packs, deals
function checkOffersIntent(query: string): boolean {
  const clean = query.toLowerCase();
  return (
    /\b(offer|offers|discount|discounts|deal|deals|sale|sales|combo|combos|budget\s*pack|super\s*budget|savings?|best\s*price|cheap|lowest\s*price|value\s*pack)\b/i.test(clean) ||
    /ஆஃபர்|ஆபர்|தள்ளுபடி|டிஸ்கவுண்ட்|சலுகை|சலுகைகள்|பட்ஜெட்\s*பேக்|பட்ஜெட்|கொம்போ|சேமிப்பு|குறைந்த\s*விலை|மலிவு\s*விலை|ஆஃபர்கள்|ஆபர்கள்|தள்ளுபடிகள்|ஆபர்ஸ்|ஆபர்ல|ஆஃபர்ல/i.test(clean)
  );
}

// Detect in-stock availability questions (e.g. "இருக்கிற அகர்பத்தி இருக்கா")
function checkInStockIntent(query: string): boolean {
  const clean = query.toLowerCase();
  return (
    /\b(available|in\s*stock|do\s*you\s*have|is\s*there|ready\s*to\s*ship)\b/i.test(clean) ||
    /இருக்கா|இருக்கிறதா|இருப்பு\s*இருக்கா|கிடைக்குமா|இருக்கிற\s*அகர்பத்தி|ஸ்டாக்\s*இருக்கா|பொருட்கள்\s*இருக்கா/i.test(clean)
  );
}

// Filter and order top offer / budget pack items
function getOfferProducts(catalog: Product[]): Product[] {
  const flagship = catalog.filter((p) => /10-in-1/i.test(p.slug || p.name));
  const familyCombos = catalog.filter((p) => /4-in-1/i.test(p.slug || p.name));
  const budgetPacks = catalog.filter((p) => /budget/i.test(p.slug || p.name));
  const standardValue = catalog.filter((p) => Number(p.price) === 75);

  const combined = [...flagship, ...familyCombos, ...budgetPacks, ...standardValue];
  const seen = new Set<string>();
  const unique: Product[] = [];
  for (const item of combined) {
    if (!seen.has(item.slug)) {
      seen.add(item.slug);
      unique.push(item);
    }
  }

  return unique.slice(0, 6);
}

// Detect request for company / brand details
function checkBrandDetailsIntent(query: string): boolean {
  const clean = query.toLowerCase();
  return (
    /\b(details\s+(?:of|about)\s+(?:this\s+|the\s+|your\s+)?(?:company|brand|workshop|business|store|factory|firm)|company\s+(?:details|information|info|profile)|brand\s+(?:details|information|info|story)|workshop\s+(?:details|story)|about\s+(?:this\s+|the\s+|your\s+)?(?:company|brand|workshop|hm|business|store)|tell\s+me\s+about\s+(?:this\s+|the\s+|your\s+)?(?:company|brand|workshop|hm)|who\s+are\s+you|what\s+is\s+(?:this\s+|the\s+|your\s+)?(?:company|brand|hm)|who\s+owns|about\s+us|our\s+story|craftsmanship\s+story)\b/i.test(clean) ||
    (/(?=.*detail)(?=.*company)/i.test(clean)) ||
    (/(?=.*about)(?=.*company)/i.test(clean)) ||
    (/(?=.*who)(?=.*company)/i.test(clean)) ||
    (/(?=.*not\s+products?)(?=.*(?:company|brand|detail|about))/i.test(clean)) ||
    /பிராண்டோட\s*டீடெயில்ஸ்|பிராண்ட்\s*டீடைல்ஸ்|பிராண்ட்\s*விவரம்|உங்களை\s*பற்றி|கம்பெனி\s*விவரம்|கம்பெனி\s*டீடைல்ஸ்|இந்த\s*கம்பெனி|நிறுவனம்\s*பற்றி|ஹெச்\s*எம்\s*பிராண்ட்|பட்டறை\s*பற்றி|யார்\s*நீங்கள்|பிராண்டோட|தொழிற்சாலை\s*பற்றி/i.test(clean)
  );
}

function findCatalogMatches(query: string, catalog: Product[]) {
  const { minPrice, maxPrice, minInclusive } = parsePriceFilter(query);
  const clean = query.toLowerCase();

  // If user is explicitly asking about company details, contact, or says "not products", never return catalog matches
  const isAboutOrCompany = checkBrandDetailsIntent(clean) || checkContactIntent(clean);
  const isNegativeProduct =
    /\b(not\s+(?:the\s+)?products?|no\s+products?|don'?t\s+show\s+products?|without\s+products?)\b/i.test(clean) ||
    /தயாரிப்புகள்\s*வேண்டாம்|பொருட்கள்\s*வேண்டாம்|ப்ராடக்ட்\s*இல்ல/i.test(clean);
  if (isAboutOrCompany || isNegativeProduct) return null;

  const isSingleRequested =
    /ஒரே\s*ஒரு|ஒன்று\s*மட்டும்|ஒத்த|ஒரு\s*அகர்பத்தி|ஒரு\s*பொருள்|ஒரு\s*ப்ராடக்ட்|ஒரே\s*ப்ராடக்ட்|ஒரே\s*ஒரு\s*அகர்பத்தி|ஒரே\s*ஒரு\s*பொருள்|only\s*one|just\s*one|single\s*one|single\s*product|top\s*1\b/i.test(clean);
  const limit = isSingleRequested ? 1 : 6;

  const category =
    /agarbatt|agarpath|agrabatt|agarbathi|incense|bathi|bathis|ஊதுவத்தி|அகர்பத்தி|அகர்பதி/i.test(clean)
      ? "agarbatti"
      : /camphor|campor|karpoor|karpur|bhimseni|கற்பூரம்|பச்சை\s*கற்பூரம்/i.test(clean)
      ? "camphor"
      : /sambrani|samprani|sambhrani|sambirani|sambrany|samprany|loban|சாம்பிராணி|லோபன்|ஹவன்\s*கப்|havan\s*cup|cup\s*sambrani|cup\s*samprani/i.test(clean)
      ? "sambrani"
      : /dhoop|dhup|தூப்|தூபம்/i.test(clean)
      ? "dhoop"
      : "";

  // Check specific popular fragrances in Tamil / English
  const specificFragrance =
    /rose|ரோஸ்|ரோஜா/i.test(clean) ? "rose"
    : /sandal|சந்தனம்|chandan/i.test(clean) ? "sandal"
    : /sambrani|samprani|sambhrani|sambirani|sambrany|samprany|loban|சாம்பிராணி|லோபன்/i.test(clean) ? "sambrani"
    : /camphor|கற்பூரம்|பச்சை\s*கற்பூரம்|bhimseni/i.test(clean) ? "camphor"
    : /lavender|லாவெண்டர்/i.test(clean) ? "lavender"
    : /jasmine|மல்லிகை|மல்லி/i.test(clean) ? "jasmine"
    : /glory|குளோரி/i.test(clean) ? "glory"
    : /kewda|கேவ்டா/i.test(clean) ? "kewda"
    : /kasturi|கஸ்தூரி/i.test(clean) ? "kasturi"
    : "";

  const isShowcase =
    /\b(show|showcase|list|recommend|suggest|products?|items?|catalog(?:ue)?|range)\b/i.test(clean) ||
    /ஷோகேஸ்|காட்டு|பார்|எல்லாம்|ப்ராடக்ட்ஸ்|அகர்பத்திசும்|வரிசை|சொல்லு/i.test(clean);

  if (minPrice === null && maxPrice === null && !category && !specificFragrance && !isShowcase && !isSingleRequested) return null;

  let matches = catalog.filter((product) => {
    if (product.inStock === false || !Number.isFinite(Number(product.price))) return false;
    if (minPrice !== null && (minInclusive ? Number(product.price) < minPrice : Number(product.price) <= minPrice)) return false;
    if (maxPrice !== null && Number(product.price) > maxPrice) return false;

    const searchable = `${product.name || ""} ${product.category || ""} ${(product.categoryLabels || []).join(" ")} ${product.subCategory || ""} ${(product.fragranceNotes || []).join(" ")} ${product.note || ""}`.toLowerCase();

    if (specificFragrance) {
      if (searchable.includes(specificFragrance)) return true;
      if (specificFragrance === "rose" && /rose|ரோஜா/.test(searchable)) return true;
      if (specificFragrance === "sandal" && /sandal|chandan|சந்தனம்/.test(searchable)) return true;
      if (specificFragrance === "sambrani" && /sambrani|samprani|loban|சாம்பிராணி|havan/i.test(searchable)) return true;
      if (specificFragrance === "camphor" && /camphor|bhimseni|கற்பூரம்/.test(searchable)) return true;
      return false;
    }

    if (category) {
      if (category === "agarbatti") return /agarbatti|incense|bathi/i.test(searchable);
      if (category === "camphor") return /camphor/i.test(searchable);
      if (category === "sambrani") return /sambrani|samprani|sambhrani|loban|havan/i.test(searchable);
      if (category === "dhoop") return /dhoop/i.test(searchable);
    }

    return true;
  });

  return { minPrice, maxPrice, category, specificFragrance, isSingleRequested, matches: matches.slice(0, limit) };
}

function parseAi(raw: string): { text: string; speech: string } | null {
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const j = JSON.parse(cleaned);
    if (j && typeof j.text === "string" && j.text.trim()) {
      const text = j.text.trim();
      const speech = typeof j.speech === "string" && j.speech.trim() ? j.speech.trim() : text;
      return { text, speech };
    }
  } catch {
    const textMatch = raw.match(/"text"\s*:\s*"([^"]+)"/);
    const speechMatch = raw.match(/"speech"\s*:\s*"([^"]+)"/);
    if (textMatch) {
      return {
        text: textMatch[1].trim(),
        speech: speechMatch ? speechMatch[1].trim() : textMatch[1].trim(),
      };
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, query, hint = "", history = [], voice = false } = body;
    const isTamilRequest = body.mode === "ta" || hasTamil(message || "") || hasTamil(query || "");

    const trimmed = (typeof message === "string" ? message : typeof query === "string" ? query : "").trim();
    const localQuery = `${trimmed} ${hint}`.trim();
    const products = await getLiveCatalog(body.products);
    const catalogQueryText = carryForwardPriceDirection(localQuery, Array.isArray(history) ? history : []);

    // ─────────────────────────────────────────────────────────────
    // 1. Instant Intent Check: Cart & Checkout Navigation
    // ─────────────────────────────────────────────────────────────
    const cartOrCheckout = checkCartOrCheckoutIntent(localQuery);
    if (cartOrCheckout) {
      if (isTamilRequest) {
        const reply = cartOrCheckout.isCheckout
          ? "செக் அவுட் பக்கத்திற்கு செல்ல கீழே உள்ள 'செக் அவுட் செல்லவும்' பட்டனை கிளிக் செய்யுங்கள். அங்கு உங்கள் முகவரியை கொடுத்து Cash on Delivery அல்லது ஆன்லைன் மூலம் ஆர்டர் செய்யலாம்."
          : "பொருட்களை கார்ட்டில் சேர்க்க ஒவ்வொரு தயாரிப்பின் கீழும் உள்ள 'Add' பட்டனை தட்டுங்கள். கார்ட்டில் உள்ள பொருட்களை பார்க்க அல்லது ஆர்டர் செய்ய கீழே உள்ள பட்டன்களை பயன்படுத்தவும்:";
        const speech = cartOrCheckout.isCheckout
          ? "செக் அவுட் செல்ல கீழே உள்ள பட்டனை தட்டுங்கள்."
          : "கார்ட்டை பார்க்க அல்லது செக் அவுட் செல்ல கீழே உள்ள பட்டன்களை தட்டுங்கள்.";

        return NextResponse.json({
          success: true,
          reply,
          speech,
          lang: "ta-IN",
          action: cartOrCheckout.isCheckout ? "checkout" : "open_cart",
          matchedProducts: [],
          suggestedOptions: [
            { label: "💳 செக் அவுட் செல்லவும் (Checkout)", value: "go_to_checkout" },
            { label: "🛒 கார்ட்டை திற (Open Cart)", value: "cart" },
            { label: "🛍️ தயாரிப்புகளை பார் (Shop)", value: "all_products" },
          ],
          source: "intent-cart-checkout",
        });
      } else {
        const reply = cartOrCheckout.isCheckout
          ? "To proceed with checkout, click the 'Proceed to Checkout' button below. You can enter your delivery address and pay via COD or UPI/Cards."
          : "Click 'Add' on any product card to put it in your cart. To view your cart items or place your order, use the buttons below:";
        const speech = cartOrCheckout.isCheckout
          ? "Click the button below to proceed to checkout."
          : "Tap the buttons below to open your cart or proceed to checkout.";

        return NextResponse.json({
          success: true,
          reply,
          speech,
          lang: "en-IN",
          action: cartOrCheckout.isCheckout ? "checkout" : "open_cart",
          matchedProducts: [],
          suggestedOptions: [
            { label: "💳 Proceed to Checkout", value: "go_to_checkout" },
            { label: "🛒 Open Cart", value: "cart" },
            { label: "🛍️ Browse All Products", value: "all_products" },
          ],
          source: "intent-cart-checkout",
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 1.5. Instant Intent Check: Office Location & Direct Contact
    // ─────────────────────────────────────────────────────────────
    if (checkContactIntent(localQuery)) {
      const contactActions = [
        {
          type: "whatsapp",
          label: "வாட்ஸ்அப்-ல் பேசுங்கள்",
          detail: CONTACT_WHATSAPP_DISPLAY,
          href: `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent("வணக்கம் HM Brand, எனக்கு உங்கள் தயாரிப்புகள் பற்றி கூடுதல் தகவல் தேவை.")}`,
        },
        {
          type: "call",
          label: "எங்களை அழைக்கவும்",
          detail: CONTACT_PHONE_DISPLAY,
          href: `tel:${CONTACT_PHONE_TEL}`,
        },
        {
          type: "location",
          label: "வழித்தடம் பெறுங்கள்",
          detail: "Google Maps",
          href: CONTACT_MAPS_URL,
        },
      ];

      const contactActionsEn = [
        {
          type: "whatsapp",
          label: "Chat on WhatsApp",
          detail: CONTACT_WHATSAPP_DISPLAY,
          href: `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello HM Brand, I would like to inquire about your products.")}`,
        },
        {
          type: "call",
          label: "Call our team",
          detail: CONTACT_PHONE_DISPLAY,
          href: `tel:${CONTACT_PHONE_TEL}`,
        },
        {
          type: "location",
          label: "Get directions",
          detail: "Open Google Maps",
          href: CONTACT_MAPS_URL,
        },
      ];

      if (isTamilRequest) {
        const reply = `எங்கள் அலுவலகம் மற்றும் பட்டறை முகவரி:\n${CONTACT_ADDRESS}\n\nதொடர்பு கொள்ள அல்லது வழித்தடம் பெற கீழே தேர்வு செய்யுங்கள்.`;
        const speech = `எங்கள் அலுவலகம் கோயம்புத்தூர் பீளமேட்டில் அமைந்துள்ளது. கீழே உள்ள பட்டன்களை தட்டி நேரடியாக அழைக்கலாம் அல்லது வாட்ஸ்அப் செய்யலாம்.`;

        return NextResponse.json({
          success: true,
          reply,
          speech,
          lang: "ta-IN",
          contactActions,
          matchedProducts: [],
          source: "intent-contact-tamil",
        });
      } else {
        const reply = `Our office and workshop:\n${CONTACT_ADDRESS}\n\nChoose an option below to contact us or get directions.`;
        const speech = `Our workshop is located on Peelamedu Main Road, Coimbatore. Tap the call or WhatsApp button below to reach our team.`;

        return NextResponse.json({
          success: true,
          reply,
          speech,
          lang: "en-IN",
          contactActions: contactActionsEn,
          matchedProducts: [],
          source: "intent-contact-english",
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. Instant Intent Check: Categories Request
    // ─────────────────────────────────────────────────────────────
    if (checkCategoryIntent(localQuery)) {
      if (isTamilRequest) {
        const reply = "விரும்பிய தயாரிப்பு வகையைத் தேர்ந்தெடுக்கவும்.";
        const speech = reply;

        return NextResponse.json({
          success: true,
          reply,
          speech,
          lang: "ta-IN",
          matchedCategories: STORE_CATEGORIES,
          matchedProducts: [],
          source: "intent-categories-tamil",
        });
      } else {
        const reply = "Choose a category to browse.";
        const speech = reply;

        return NextResponse.json({
          success: true,
          reply,
          speech,
          lang: "en-IN",
          matchedCategories: STORE_CATEGORIES,
          matchedProducts: [],
          source: "intent-categories-english",
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 3. Instant Intent Check: Brand Details & Workshop Story
    // ─────────────────────────────────────────────────────────────
    if (checkBrandDetailsIntent(localQuery)) {
      const brandActionsTa = [
        {
          type: "workshop",
          label: "பட்டறையைப் பாருங்கள்",
          href: "/craftsmanship",
        },
        {
          type: "call",
          label: "எங்களை அழைக்கவும்",
          detail: CONTACT_PHONE_DISPLAY,
          href: `tel:${CONTACT_PHONE_TEL}`,
        },
        {
          type: "whatsapp",
          label: "வாட்ஸ்அப்பில் பேசுங்கள்",
          detail: CONTACT_WHATSAPP_DISPLAY,
          href: `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent("வணக்கம் HM Brand, உங்கள் நிறுவனம் பற்றி மேலும் விவரங்கள் தேவை.")}`,
        },
        {
          type: "contact_page",
          label: "முகவரி மற்றும் தொடர்பு",
          href: "/contact",
        },
      ];

      const brandActionsEn = [
        {
          type: "workshop",
          label: "Visit our workshop",
          href: "/craftsmanship",
        },
        {
          type: "call",
          label: "Call our team",
          detail: CONTACT_PHONE_DISPLAY,
          href: `tel:${CONTACT_PHONE_TEL}`,
        },
        {
          type: "whatsapp",
          label: "Chat on WhatsApp",
          detail: CONTACT_WHATSAPP_DISPLAY,
          href: `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello HM Brand, I would like to learn more about your company and workshop.")}`,
        },
        {
          type: "contact_page",
          label: "Address and contact",
          href: "/contact",
        },
      ];

      if (isTamilRequest) {
        const reply = "HM Brand கோயம்புத்தூர் பீளமேட்டில் உள்ள எங்கள் குடும்ப அகர்பத்தி தயாரிப்பு நிறுவனம்.";
        const speech = reply;

        return NextResponse.json({
          success: true,
          reply,
          speech,
          lang: "ta-IN",
          contactActions: brandActionsTa,
          matchedCategories: [],
          matchedProducts: [],
          source: "intent-brand-details-tamil",
        });
      } else {
        const reply = "HM Brand is our family run incense workshop in Peelamedu, Coimbatore.";
        const speech = reply;

        return NextResponse.json({
          success: true,
          reply,
          speech,
          lang: "en-IN",
          contactActions: brandActionsEn,
          matchedCategories: [],
          matchedProducts: [],
          source: "intent-brand-details-english",
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 3.5. Instant Intent Check: Special Offers, Discounts & Budget Packs
    // ─────────────────────────────────────────────────────────────
    if (checkOffersIntent(localQuery)) {
      const offerProducts = getOfferProducts(products);
      const formattedOffers = offerProducts.map((product) => {
        return {
          name: product.name,
          slug: product.slug,
          price: Number(product.price),
          image: getCatalogProductImage(product),
          images: product.images,
          category: product.category || "Agarbatti",
          note: /10-in-1/i.test(product.slug)
            ? "Special Launch Offer (MRP ₹120 → ₹100)"
            : /4-in-1/i.test(product.slug)
            ? "Combo Savings Pack"
            : /budget/i.test(product.slug)
            ? "Extra Sticks Super Value Pack"
            : "Value Everyday Pack",
        };
      });

      if (isTamilRequest) {
        const reply = "எங்கள் தற்போதைய சலுகைகள் இங்கே.";
        const speech = reply;

        return NextResponse.json({
          success: true,
          reply,
          speech,
          lang: "ta-IN",
          matchedProducts: formattedOffers,
          source: "intent-offers-tamil",
        });
      } else {
        const reply = "Here are our current offers.";
        const speech = reply;

        return NextResponse.json({
          success: true,
          reply,
          speech,
          lang: "en-IN",
          matchedProducts: formattedOffers,
          source: "intent-offers-english",
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 4. Instant Intent Check: Product Showcase & Search
    // ─────────────────────────────────────────────────────────────
    const catalogQuery = findCatalogMatches(catalogQueryText, products);
    if (catalogQuery && catalogQuery.matches.length === 0) {
      const priceDescription = catalogQuery.minPrice !== null
        ? (isTamilRequest ? `₹${catalogQuery.minPrice}-க்கு மேல்` : `above ₹${catalogQuery.minPrice}`)
        : catalogQuery.maxPrice !== null
        ? (isTamilRequest ? `₹${catalogQuery.maxPrice}-க்குள்` : `under ₹${catalogQuery.maxPrice}`)
        : '';
      const reply = products.length === 0
        ? (isTamilRequest ? 'தயாரிப்பு பட்டியலை இப்போது ஏற்ற முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.' : 'I can’t load the product list right now. Please try again in a moment.')
        : priceDescription
        ? (isTamilRequest ? `${priceDescription} தயாரிப்புகள் கிடைக்கவில்லை.` : `We couldn’t find products ${priceDescription}.`)
        : (isTamilRequest ? 'பொருத்தமான தயாரிப்புகள் கிடைக்கவில்லை.' : 'No matching products were found.');
      return NextResponse.json({
        success: true,
        reply,
        speech: reply,
        lang: isTamilRequest ? 'ta-IN' : 'en-IN',
        matchedProducts: [],
        source: 'catalog-no-matches',
      });
    }
    if (catalogQuery && catalogQuery.matches.length > 0) {
      const formattedProducts = catalogQuery.matches.map((product) => ({
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        image: getCatalogProductImage(product),
        images: product.images,
        category: product.category || "Agarbatti",
        note: product.note || product.category || "",
      }));

      if (isTamilRequest) {
        let reply = "உங்களுக்கான தயாரிப்புகள் இங்கே.";
        if (catalogQuery.isSingleRequested) {
          reply = "எங்கள் பிரபலமான தயாரிப்பு இதோ.";
        } else if (checkInStockIntent(localQuery)) {
          reply = "ஆம், இந்த தயாரிப்புகள் தற்போது கிடைக்கின்றன.";
        } else if (catalogQuery.maxPrice !== null) {
          reply = `₹${catalogQuery.maxPrice}-க்குள் உள்ள தயாரிப்புகள் இங்கே.`;
        } else if (catalogQuery.minPrice !== null) {
          reply = `₹${catalogQuery.minPrice}-க்கு மேல் உள்ள தயாரிப்புகள் இங்கே.`;
        } else if (catalogQuery.specificFragrance === "rose") {
          reply = "ரோஜா அகர்பத்திகள் இங்கே.";
        } else if (catalogQuery.specificFragrance === "sandal") {
          reply = "சந்தன அகர்பத்திகள் இங்கே.";
        } else if (catalogQuery.specificFragrance === "sambrani") {
          reply = "கப் சாம்பிராணி தயாரிப்புகள் இங்கே.";
        } else if (catalogQuery.specificFragrance === "camphor") {
          reply = "தூய கற்பூர தயாரிப்புகள் இங்கே.";
        }

        const speech = reply;

        return NextResponse.json({
          success: true,
          reply,
          speech,
          lang: "ta-IN",
          matchedProducts: formattedProducts,
          suggestedOptions: [
            { label: "🛒 கார்ட்டை திற (View Cart)", value: "cart" },
            { label: "💳 செக் அவுட் (Checkout)", value: "go_to_checkout" },
            { label: "🌹 ரோஜா அகர்பத்தி", value: "rose flower agarbatti" },
            { label: "🪔 கப் சாம்பிராணி", value: "cup sambrani" },
          ],
          source: "live-catalog-tamil",
        });
      } else {
        let reply = catalogQuery.minPrice !== null
          ? `Here are products above ₹${catalogQuery.minPrice}.`
          : catalogQuery.maxPrice === null
          ? "Here are the products for you."
          : `Here are products under ₹${catalogQuery.maxPrice}.`;
        let speech = reply;

        if (catalogQuery.isSingleRequested) {
          reply = "Here is our popular product.";
          speech = reply;
        } else if (checkInStockIntent(localQuery)) {
          reply = "Yes, these products are currently available.";
          speech = reply;
        } else if (catalogQuery.specificFragrance === "sambrani" || catalogQuery.category === "sambrani") {
          reply = "Here are our Cup Sambrani products.";
          speech = reply;
        } else if (catalogQuery.specificFragrance === "rose") {
          reply = "Here are our Rose agarbattis.";
          speech = reply;
        } else if (catalogQuery.specificFragrance === "sandal") {
          reply = "Here are our Sandalwood agarbattis.";
          speech = reply;
        } else if (catalogQuery.specificFragrance === "camphor" || catalogQuery.category === "camphor") {
          reply = "Here are our pure camphor products.";
          speech = reply;
        } else if (catalogQuery.category === "dhoop") {
          reply = "Here are our Dhoop Sticks.";
          speech = reply;
        }

        return NextResponse.json({
          success: true,
          reply,
          speech,
          lang: "en-IN",
          matchedProducts: formattedProducts,
          suggestedOptions: [
            { label: "🛒 View Cart", value: "cart" },
            { label: "💳 Proceed to Checkout", value: "go_to_checkout" },
            { label: "🌹 Rose Agarbattis", value: "rose flower agarbatti" },
            { label: "🪔 Cup Sambrani", value: "cup sambrani" },
          ],
          source: "live-catalog-english",
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 3. AI Assistant Query (NVIDIA NIM with Minimax-m3.1-flash)
    // ─────────────────────────────────────────────────────────────
    const nvidiaKey = process.env.NVIDIA_API_KEY || process.env.NVIDIA_NIM_API_KEY;

    if (nvidiaKey && trimmed) {
      try {
        const compactCatalog = products.slice(0, 25).map((p) => ({
          name: p.name,
          slug: p.slug,
          price: p.price,
          category: p.category,
        }));

        const style = isTamilRequest
          ? `Reply in simple, natural Tamil script. Keep both fields brief and human. Avoid unnecessary English terms.`
          : `Reply in simple, helpful English. Keep both fields brief and human.`;

        const system = `You are HM Brand's helpful customer service assistant for handcrafted incense, pure camphor, and sambrani from Coimbatore, Tamil Nadu.
Store context: ${STORE_OVERVIEW}
Available products: ${JSON.stringify(compactCatalog)}

${style}
Return ONLY valid JSON: {"text": "...", "speech": "..."}
Use one short sentence, with only the information needed to answer. Do not use emojis, bullets, decorative symbols, or markdown. When product, category, or contact cards are shown, do not repeat their details in the text. Never invent policies or delivery fees.`;

        const messages = [
          { role: "system", content: system },
          ...history.slice(-4).map((m: ChatMessageInput) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
          { role: "user", content: trimmed },
        ];

        const nvidiaModel = process.env.NVIDIA_MODEL || "minimaxai/minimax-m3.1-flash";
        const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${nvidiaKey}`,
          },
          body: JSON.stringify({
            model: nvidiaModel,
            messages,
            temperature: 0.6,
            max_tokens: 800,
            response_format: { type: "json_object" },
          }),
          signal: AbortSignal.timeout(10000),
        });

        if (res.ok) {
          const data = await res.json();
          const raw = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.message?.reasoning_content || "";
          const parsed = parseAi(raw) || (raw.trim() ? { text: raw.trim(), speech: raw.trim() } : null);

          if (parsed) {
            const isSingleRequested =
              /ஒரே\s*ஒரு|ஒன்று\s*மட்டும்|ஒத்த|ஒரு\s*அகர்பத்தி|ஒரு\s*பொருள்|ஒரு\s*ப்ராடக்ட்|ஒரே\s*ப்ராடக்ட்|ஒரே\s*ஒரு\s*அகர்பத்தி|ஒரே\s*ஒரு\s*பொருள்|only\s*one|just\s*one|single\s*one|single\s*product|top\s*1\b/i.test(localQuery);

            const isNegativeProduct =
              /\b(not\s+(?:the\s+)?products?|no\s+products?|don'?t\s+show\s+products?|without\s+products?)\b/i.test(localQuery) ||
              /தயாரிப்புகள்\s*வேண்டாம்|பொருட்கள்\s*வேண்டாம்|ப்ராடக்ட்\s*இல்ல/i.test(localQuery);

            const isProductSearch =
              !isNegativeProduct &&
              !checkBrandDetailsIntent(localQuery) &&
              !checkContactIntent(localQuery) &&
              (/\b(product|agarbatti|agarpathi|incense|camphor|sambrani|samprani|loban|dhoop|buy|price|cost|recommend|suggest|catalog)\b/i.test(localQuery) ||
              /தயாரிப்பு|அகர்பத்தி|கற்பூரம்|சாம்பிராணி|விலை|பார்|ஷோகேஸ்|காட்டு|இருக்கா/i.test(localQuery));

            const aiProducts = isProductSearch ? (isSingleRequested ? products.slice(0, 1) : products.slice(0, 4)) : [];
            return NextResponse.json({
              success: true,
              reply: parsed.text,
              speech: parsed.speech,
              lang: isTamilRequest ? "ta-IN" : "en-IN",
              matchedProducts: aiProducts.map((p) => ({
                name: p.name,
                slug: p.slug,
                price: Number(p.price),
                image: getCatalogProductImage(p),
                images: p.images,
                category: p.category || "Agarbatti",
                note: p.note || p.category || "",
              })),
              suggestedOptions: [
                { label: isTamilRequest ? "🛒 கார்ட்டை திற" : "🛒 Open Cart", value: "cart" },
                { label: isTamilRequest ? "💳 செக் அவுட் செல்லவும்" : "💳 Checkout", value: "go_to_checkout" },
              ],
              source: "nvidia-ai",
            });
          }
        }
      } catch (err) {
        console.warn("[Chat API] NVIDIA call failed:", err);
      }
    }

    // Fallback response if AI is unavailable
    const isNegativeProduct =
      /\b(not\s+(?:the\s+)?products?|no\s+products?|don'?t\s+show\s+products?|without\s+products?)\b/i.test(localQuery) ||
      /தயாரிப்புகள்\s*வேண்டாம்|பொருட்கள்\s*வேண்டாம்|ப்ராடக்ட்\s*இல்ல/i.test(localQuery);

    const isProductSearch =
      !isNegativeProduct &&
      !checkBrandDetailsIntent(localQuery) &&
      !checkContactIntent(localQuery) &&
      (/\b(product|agarbatti|agarpathi|incense|camphor|sambrani|samprani|loban|dhoop|buy|price|cost|recommend|suggest|catalog)\b/i.test(localQuery) ||
      /தயாரிப்பு|அகர்பத்தி|கற்பூரம்|சாம்பிராணி|விலை|பார்|ஷோகேஸ்|காட்டு/i.test(localQuery));

    const fallbackReply = isTamilRequest
      ? (isProductSearch
          ? "உங்களுக்கான தயாரிப்புகள் இங்கே."
          : "வணக்கம்! என்ன உதவி வேண்டும்?")
      : (isProductSearch
          ? "Here are the products for you."
          : "Hello! What can we help you find?");

    const fallbackProducts = isProductSearch ? products.slice(0, 4) : [];

    return NextResponse.json({
      success: true,
      reply: fallbackReply,
      speech: fallbackReply,
      lang: isTamilRequest ? "ta-IN" : "en-IN",
      matchedProducts: fallbackProducts.map((p) => ({
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        image: getCatalogProductImage(p),
        images: p.images,
        category: p.category || "Agarbatti",
        note: p.note || p.category || "",
      })),
      suggestedOptions: [
        { label: isTamilRequest ? "🛒 கார்ட்டை திற" : "🛒 Open Cart", value: "cart" },
        { label: isTamilRequest ? "💳 செக் அவுட் செல்லவும்" : "💳 Checkout", value: "go_to_checkout" },
        { label: isTamilRequest ? "🛍️ அனைத்து தயாரிப்புகள்" : "🛍️ All Products", value: "all_products" },
      ],
      source: "catalog-fallback",
    });
  } catch (error) {
    console.error("[Chat API] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to process chat query." }, { status: 500 });
  }
}
