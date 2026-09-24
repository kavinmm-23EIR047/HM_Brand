export interface Product {
  slug: string;
  name: string;
  category: string;
  subCategory?: string;
  note: string;
  description: string;
  mrp: string;
  price: number;
  quantity: string;
  burnTime?: string;
  fragranceNotes?: string[];
  benefits: string[];
  howToUse: string[];
  image?: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
}

export const products: Product[] = [
  {
    slug: "hm-super-series",
    name: "HM Super Series Agarbatti",
    category: "Agarbatti",
    subCategory: "Signature Flora",
    note: "Signature long-lasting temple fragrance crafted from natural resins and floral extracts.",
    description: "The crown jewel of HM Agarbattis Coimbatore. Handcrafted using traditional masala rolling techniques, infused with sacred wood resins and rare flower oils to fill your home with deep spiritual serenity.",
    mrp: "₹180",
    price: 150,
    quantity: "150g (Approx. 85 Sticks)",
    burnTime: "45-50 mins per stick",
    fragranceNotes: ["Sandalwood", "Natural Halmaddi", "Rose Petals", "Amber"],
    benefits: [
      "100% natural organic resins",
      "Zero harmful charcoal or black soot",
      "Creates an uplifting temple atmosphere",
      "Long-lasting aroma that lingers for hours"
    ],
    howToUse: [
      "Place the stick securely in an agarbatti stand away from flammable materials.",
      "Light the coated end until a gentle flame appears.",
      "Gently blow out the flame, leaving a glowing red ember.",
      "Allow the sacred smoke to diffuse and elevate your meditation or prayer space."
    ],
    image: "/images/media_1790142713668.jpg",
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 142,
    inStock: true,
    featured: true,
  },
  {
    slug: "bhimseni-camphor",
    name: "Bhimseni Pure Camphor",
    category: "Camphor",
    subCategory: "Pure Bhimseni",
    note: "100% pure crystalline Bhimseni camphor for auspicious aarti and positive energy.",
    description: "Distilled from pure pine tree resin, this untainted raw Bhimseni camphor burns completely leaving zero black residue or ash. Highly recommended for daily morning puja and evening purification rituals.",
    mrp: "₹240",
    price: 199,
    quantity: "100g Pouch / Crystalline Chunks",
    burnTime: "Clean burn with zero ash",
    fragranceNotes: ["Pure Camphoric", "Pine Fresh", "Air Purifying"],
    benefits: [
      "Leaves zero residue or ash in the puja thali",
      "Naturally clears negative vibrations and stagnant air",
      "Calms the respiratory system and relaxes the mind",
      "Ideal for camphor diffusers and auspicious aartis"
    ],
    howToUse: [
      "Place a small chunk in an aarti diya or camphor burner.",
      "Ignite with a matchstick and present before the deity during prayer.",
      "Can also be used in an electric aroma diffuser for continuous refreshing aroma."
    ],
    badge: "Divine Choice",
    rating: 5.0,
    reviewCount: 98,
    inStock: true,
    featured: true,
  },
  {
    slug: "cup-sambrani",
    name: "HM Charcoal-Free Cup Sambrani",
    category: "Sambrani",
    subCategory: "Pure Benzoin Cups",
    note: "Traditional South Indian temple sambrani in ready-to-burn natural herbal cups.",
    description: "Experience the authentic fragrance of South Indian temple sanctums. Made with wild benzoin gum, guggal, and dried tulsi leaves embedded in natural wood powder cups with a built-in burner fiber.",
    mrp: "₹160",
    price: 130,
    quantity: "12 Prepared Cups + Fiber Stand",
    burnTime: "30 mins per cup",
    fragranceNotes: ["Benzoin (Paal Sambrani)", "Guggal", "Dried Tulsi", "Frankincense"],
    benefits: [
      "Authentic Paal Sambrani fragrance reminiscent of ancient temples",
      "Eliminates dampness and purifies indoor air naturally",
      "Aids deep meditation and calming after a busy day",
      "Safe and mess-free with included ceramic/metal stand"
    ],
    howToUse: [
      "Hold the cup by the base and tilt at an angle.",
      "Light the upper rim until it catches flame, then gently blow out.",
      "Place on the fireproof stand and let the dense, soothing sambrani smoke purify your rooms."
    ],
    badge: "Traditional",
    rating: 4.8,
    reviewCount: 84,
    inStock: true,
    featured: true,
  },
  {
    slug: "kesar-loban",
    name: "Kesar Loban Natural Dhoop",
    category: "Loban",
    subCategory: "Saffron Infused Loban",
    note: "Pure Boswellia loban resin enriched with Himalayan kesar (saffron) extracts.",
    description: "A time-honored spiritual blend combining sacred Loban crystals with saffron essence. Traditionally burned on Fridays and festival evenings to invoke prosperity and spiritual focus.",
    mrp: "₹210",
    price: 175,
    quantity: "100g Pack",
    burnTime: "Long diffusion",
    fragranceNotes: ["Kesar (Saffron)", "Wild Loban", "Sweet Sandalwood"],
    benefits: [
      "Infused with real saffron floral notes",
      "Disperses heaviness and fosters deep inner peace",
      "Natural insect repellent and antimicrobial air freshener",
      "Strictly non-synthetic ingredients"
    ],
    howToUse: [
      "Sprinkle a pinch over burning coal or place a small dhoop cone on the stand.",
      "Allow the golden smoke to waft through the prayer room and main entryway."
    ],
    badge: "Festive Favorite",
    rating: 4.9,
    reviewCount: 67,
    inStock: true,
    featured: true,
  },
  {
    slug: "cardamom",
    name: "HM Cardamom & Elaichi Flora",
    category: "Agarbatti",
    subCategory: "Spiced Flora",
    note: "Crisp and refreshing green cardamom essence blended with soothing herbal resins.",
    description: "An exotic and invigorating fragrance inspired by the misty hills of the Western Ghats. Cardamom (Elaichi) provides a refreshing top note that clears mental fog and brings auspicious cheer.",
    mrp: "₹150",
    price: 120,
    quantity: "120g Pack",
    burnTime: "40 mins per stick",
    fragranceNotes: ["Green Cardamom", "Cinnamon Bark", "Herbal Flora"],
    benefits: [
      "Awakens the senses and enhances alertness during morning prayers",
      "Sweet, spicy uplifting aroma loved by all age groups",
      "Gentle formulation suitable for indoor apartments"
    ],
    howToUse: [
      "Light during dawn prayers or before study and meditation sessions.",
      "Ensure room has gentle cross ventilation."
    ],
    rating: 4.7,
    reviewCount: 43,
    inStock: true,
    featured: false,
  },
  {
    slug: "kasturi",
    name: "HM Kasturi Divine Agarbatti",
    category: "Agarbatti",
    subCategory: "Royal Musks",
    note: "Velvety botanical musk and temple florals for profound evening meditation.",
    description: "A cruelty-free botanical musk formulation that recreates the majestic royal fragrance of ancient Indian darbars. Deep, woody, and intensely comforting for evening aarti.",
    mrp: "₹170",
    price: 140,
    quantity: "130g Pack",
    burnTime: "45 mins per stick",
    fragranceNotes: ["Botanical Kasturi", "Nutmeg", "Cedarwood", "Amber"],
    benefits: [
      "Deeply grounding aroma that aids sound sleep and stress relief",
      "Rich undertones ideal for Shiva puja and evening chanting",
      "Zero chemical dipping or artificial boosters"
    ],
    howToUse: [
      "Light after sunset to transition your home into a sanctuary of stillness."
    ],
    badge: "Royal Blend",
    rating: 4.9,
    reviewCount: 76,
    inStock: true,
    featured: true,
  },
  {
    slug: "karpoor-loban",
    name: "Karpoor Loban Fusion Dhoop",
    category: "Loban",
    subCategory: "Camphor Loban Fusion",
    note: "Dual-action cleansing blend of pure camphor crystals and golden loban resin.",
    description: "A powerhouse purifying dhoop stick that combines the rapid air clearing of natural camphor with the sustained resinous warmth of wild loban.",
    mrp: "₹190",
    price: 155,
    quantity: "15 Thick Dhoop Sticks + Stand",
    burnTime: "35 mins per stick",
    fragranceNotes: ["Bhimseni Camphor", "Frankincense", "Resin Bark"],
    benefits: [
      "Dual benefit of rapid energy clearing and lingering sacred scent",
      "Bamboofree formulation honoring ancient Vedic traditions",
      "Stays lit smoothly till the very end"
    ],
    howToUse: [
      "Ignite the tip and place upright on the enclosed terra-cotta stand."
    ],
    rating: 4.8,
    reviewCount: 52,
    inStock: true,
    featured: false,
  },
  {
    slug: "pancha-rudhra",
    name: "Pancha Rudhra Special Collection",
    category: "Special Collections",
    subCategory: "Vedic Formulations",
    note: "Sacred formulation of 5 sacred temple herbs, bilva leaves and sandalwood.",
    description: "Crafted specifically for Rudrabhishek and special festive pujas, this collection is made with bilva patra powder, chandan, sacred bhasma elements, paarijaata flowers, and Himalayan cedar.",
    mrp: "₹280",
    price: 230,
    quantity: "200g Luxury Tin Box",
    burnTime: "60 mins per stick",
    fragranceNotes: ["Bilva Patra", "Mysore Sandal", "Paarijaata", "Sacred Ash"],
    benefits: [
      "Vedic 5-ingredient formulation for powerful spiritual focus",
      "Packed in an airtight collectible antique tin",
      "Perfect for gifting during Gruhapravesam and Navaratri"
    ],
    howToUse: [
      "Light during special rituals, monthly Pradosham, or morning chanting."
    ],
    badge: "Sacred Edition",
    rating: 5.0,
    reviewCount: 110,
    inStock: true,
    featured: true,
  },
  {
    slug: "real-stone",
    name: "Real Stone Aromatic Incense",
    category: "Special Collections",
    subCategory: "Earthy Resins",
    note: "Earthy, mineral-rich fragrance crafted from Himalayan fossilized amber and moss.",
    description: "A rare and grounding incense with notes of petrichor (first rain on dry earth), river pebbles, and sweet moss. Evokes the peaceful tranquility of high mountain caves.",
    mrp: "₹200",
    price: 160,
    quantity: "120g Pack",
    burnTime: "45 mins per stick",
    fragranceNotes: ["Petrichor / Mitti", "Oakmoss", "Fossil Amber", "Vetiver"],
    benefits: [
      "Unique refreshing earthen aroma that relieves anxiety",
      "No charcoal smoke, only pure botanical purity",
      "Enhances deep Pranayama and yoga practice"
    ],
    howToUse: [
      "Light in your yoga space or quiet reading corner."
    ],
    rating: 4.8,
    reviewCount: 39,
    inStock: true,
    featured: false,
  },
  {
    slug: "fancy-flora",
    name: "Fancy Flora Premium Agarbatti",
    category: "Agarbatti",
    subCategory: "Floral Bouquets",
    note: "Delicate bouquet of night-blooming jasmine, parijat and fresh marigold petals.",
    description: "A joyful and celebratory floral agarbatti that brings the vibrancy of a fresh Indian flower market directly into your home mandir.",
    mrp: "₹140",
    price: 110,
    quantity: "120g Pack",
    burnTime: "40 mins per stick",
    fragranceNotes: ["Mogra (Jasmine)", "Parijat", "Marigold", "Frangipani"],
    benefits: [
      "Sweet, uplifting floral aroma without being overpowering",
      "Leaves curtains and upholstery gently perfumed",
      "Great for daily household freshness"
    ],
    howToUse: [
      "Light in the morning puja and allow fragrance to circulate through living spaces."
    ],
    rating: 4.7,
    reviewCount: 58,
    inStock: true,
    featured: false,
  },
  {
    slug: "mehak-italian",
    name: "Mehak Italian Exotic Agarbatti",
    category: "Premium Fragrances",
    subCategory: "Fusion Aromas",
    note: "Harmonious fusion of Mediterranean bergamot with traditional Indian chandan.",
    description: "A sophisticated crossover incense blending crisp Italian citrus notes with soothing South Indian sandalwood and sweet vanilla resins.",
    mrp: "₹180",
    price: 145,
    quantity: "140g Pack",
    burnTime: "45 mins per stick",
    fragranceNotes: ["Italian Bergamot", "White Sandalwood", "Sweet Vanilla", "Myrrh"],
    benefits: [
      "Modern and luxurious fragrance profile",
      "Appreciated by young families and guests alike",
      "Clean, slow even burn with gentle aroma trail"
    ],
    howToUse: [
      "Light prior to welcoming family and guests into your home."
    ],
    badge: "Unique Blend",
    rating: 4.9,
    reviewCount: 63,
    inStock: true,
    featured: true,
  },
  {
    slug: "chandan-pure-dhoop",
    name: "HM Pure Chandan Dhoop Cones",
    category: "Dhoop",
    subCategory: "Pure Sandalwood",
    note: "Charcoal-free cones made from pure Mysore sandalwood powder and natural honey.",
    description: "Traditional dhoop cones made without bamboo sticks. Compressed with sandalwood sawdust, cow ghee, and wildflower honey for a dense, soothing aroma.",
    mrp: "₹190",
    price: 150,
    quantity: "30 Cones + Ceramic Holder",
    burnTime: "25 mins per cone",
    fragranceNotes: ["Mysore Sandalwood", "Wildflower Honey", "Cow Ghee"],
    benefits: [
      "100% bamboo-free cone formula",
      "Dense, tranquil fragrance ideal for japa and mantras",
      "Includes a miniature heat-resistant ceramic tile"
    ],
    howToUse: [
      "Light cone tip for 10-15 seconds, blow out flame and place on ceramic tile."
    ],
    badge: "Bamboofree",
    rating: 4.9,
    reviewCount: 91,
    inStock: true,
    featured: true,
  }
];

export const categories = [
  "Agarbatti",
  "Camphor",
  "Sambrani",
  "Loban",
  "Dhoop",
  "Premium Fragrances",
  "Special Collections"
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
    recommendedCategory: "Sambrani",
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
    recommendedCategory: "Loban",
    featuredSlugs: ["kesar-loban", "pancha-rudhra", "bhimseni-camphor"],
    ritualNote: "Begin all new ventures with Lord Ganesha's sacred blessings."
  },
  {
    id: "krishna-janmashtami",
    name: "Krishna Janmashtami",
    dateText: "Shravana Rohini",
    description: "Celebrate little Krishna's advent with sweet kasturi musk, creamy chandan, and floral mogra agarbattis.",
    recommendedCategory: "Special Collections",
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
