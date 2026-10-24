import React from "react";

export type Kind =
  | "incense"
  | "camphor"
  | "dhoop-stick"
  | "cone"
  | "chandan-cup"
  | "sambrani-powder"
  | "diya"
  | "gift-set"
  | "family-pack"
  // Legacy / fallbacks
  | "sambrani"
  | "loban"
  | "sandalwood"
  | "gift"
  | "natural"
  | "clean"
  | "chemical-free"
  | "india";

/** Authentic flat vector spiritual scenes with high visual clarity on both dark and light backgrounds. */
export function RitualArt({ kind, className = "" }: { kind: Kind; className?: string }) {
  const common = { stroke: "#276a43", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  return (
    <svg viewBox="0 0 120 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* 1. AGARBATTI (Traditional Incense Sticks in Brass Boat) */}
      {kind === "incense" && (
        <>
          {/* Slender Incense Sticks */}
          <path d="M42 66 50 18" stroke="#4A2616" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M52 67 58 12" stroke="#5E2C1A" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M62 67 67 15" stroke="#4A2616" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M72 67 76 22" stroke="#5E2C1A" strokeWidth="2.8" strokeLinecap="round" />
          {/* Glowing Ember Tips */}
          <circle cx="50" cy="18" r="2.5" fill="#FF4D12" />
          <circle cx="58" cy="12" r="2.5" fill="#FFD166" />
          <circle cx="67" cy="15" r="2.5" fill="#FF4D12" />
          <circle cx="76" cy="22" r="2.5" fill="#FFD166" />
          {/* Sacred White Fragrant Smoke Waves */}
          <path d="M50 16c-4-5 4-7 0-12m8 6c-3-5 5-7 1-12m8 11c-4-4 4-7 0-11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.95" />
          {/* Brass Boat Incense Burner */}
          <path d="M22 68c9 14 58 14 76 0l-8 14H30l-8-14Z" fill="#D49A24" stroke="#8E600A" strokeWidth="2" />
          <ellipse cx="60" cy="68" rx="38" ry="7" fill="#F6C84C" stroke="#B88214" strokeWidth="2" />
          {/* Auspicious Green Leaf Accents */}
          <path d="M18 63c-7-7-14-2-14 4 8 2 13 1 14-4Zm84 0c7-7 14-2 14 4-8 2-13 1-14-4Z" fill="#4E9952" />
          <circle cx="15" cy="61" r="3.5" fill="#FFD166" />
          <circle cx="105" cy="61" r="3.5" fill="#FFD166" />
        </>
      )}

      {/* 2. CAMPHOR (Pure White Bhimseni Tablets on Brass Aarti Diya with Sacred Flame) */}
      {kind === "camphor" && (
        <>
          {/* Aarti Diya Handle */}
          <path d="M92 60 114 68" stroke="#D49A24" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="114" cy="68" r="3.5" fill="#FFD166" />
          {/* Brass Aarti Diya Bowl */}
          <path d="M24 58c0 16 72 16 72 0H24Z" fill="#C88C18" stroke="#7A4E02" strokeWidth="2.5" />
          <ellipse cx="60" cy="58" rx="36" ry="10" fill="#F6C84C" stroke="#7A4E02" strokeWidth="2" />
          {/* Faceted Pure White Bhimseni Camphor Tablets */}
          <rect x="40" y="47" width="16" height="12" rx="2" fill="#FFFFFF" stroke="#E2DCB8" strokeWidth="1.5" transform="rotate(-10 48 53)" />
          <rect x="62" y="47" width="16" height="12" rx="2" fill="#FFFFFF" stroke="#E2DCB8" strokeWidth="1.5" transform="rotate(12 70 53)" />
          <rect x="52" y="41" width="16" height="12" rx="2" fill="#FFFDF2" stroke="#E2DCB8" strokeWidth="1.5" />
          {/* Auspicious Pure Karpura Harathi Flame */}
          <path d="M60 10c-13 15-10 24 0 30 10-6 13-15 0-30Z" fill="#FF5400" />
          <path d="M60 20c-7 8-5 13 0 16 5-3 7-8 0-16Z" fill="#FFD166" />
          <circle cx="60" cy="33" r="3.5" fill="#FFFFFF" />
          {/* Decorative Flowers */}
          <path d="M20 74c6-6 13-3 15 1-4 4-10 4-15-1Z" fill="#4E9952" />
        </>
      )}

      {/* 3. DHOOP STICK (Solid Bambooless Cylindrical Sticks in Stand with Smoke) */}
      {(kind === "dhoop-stick" || kind === "loban") && (
        <>
          {/* Brass Circular Lotus Trivet Base */}
          <ellipse cx="60" cy="74" rx="34" ry="10" fill="#C88C18" stroke="#7A4E02" strokeWidth="2" />
          <ellipse cx="60" cy="72" rx="26" ry="7" fill="#F6C84C" stroke="#B88214" strokeWidth="1.5" />
          <ellipse cx="60" cy="71" rx="14" ry="4" fill="#5A3422" />
          {/* 3 Solid Cylindrical Bambooless Dhoop Sticks */}
          <rect x="44" y="24" width="7.5" height="48" rx="3.5" fill="#4A2616" stroke="#2B140B" strokeWidth="1.5" />
          <rect x="56.5" y="15" width="8" height="57" rx="4" fill="#633720" stroke="#2B140B" strokeWidth="1.5" />
          <rect x="69" y="28" width="7.5" height="44" rx="3.5" fill="#4A2616" stroke="#2B140B" strokeWidth="1.5" />
          {/* Glowing Red/Amber Tips */}
          <ellipse cx="47.75" cy="24" rx="3.75" ry="2" fill="#FF4D12" />
          <ellipse cx="60.5" cy="15" rx="4" ry="2" fill="#FFD166" />
          <ellipse cx="72.75" cy="28" rx="3.75" ry="2" fill="#FF4D12" />
          {/* Whimsical White Smoke Streams */}
          <path d="M60 12c-4-5 4-7 0-11m13 23c-4-4 4-6 0-11m-25 7c-3-4 4-6 0-10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.95" />
          {/* Green Leaf Accent */}
          <path d="M26 76c7-7 14-4 17 0-4 4-11 5-17 0Zm68 0c-7-7-14-4-17 0 4 4 11 5 17 0Z" fill="#4E9952" />
        </>
      )}

      {/* 4. INCENSE CONE (Triangular Conical Pyramids with Glowing Peak & Smoke) */}
      {kind === "cone" && (
        <>
          {/* Round Brass Tray */}
          <ellipse cx="60" cy="76" rx="42" ry="11" fill="#C88C18" stroke="#7A4E02" strokeWidth="2" />
          <ellipse cx="60" cy="74" rx="36" ry="8" fill="#F6C84C" stroke="#B88214" strokeWidth="1.5" />
          {/* Flanking Secondary Cones */}
          <path d="M38 36 L26 69 Q38 73 50 69 Z" fill="#48271A" stroke="#2B140B" strokeWidth="1.8" />
          <path d="M82 38 L70 70 Q82 74 94 70 Z" fill="#48271A" stroke="#2B140B" strokeWidth="1.8" />
          {/* Main Front Conical Incense Cone */}
          <path d="M60 22 L45 71 Q60 76 75 71 Z" fill="#5C3322" stroke="#2B140B" strokeWidth="2" />
          {/* Glowing Cone Peak */}
          <ellipse cx="60" cy="22" rx="3.5" ry="2" fill="#FFD166" />
          <circle cx="60" cy="22" r="1.8" fill="#FF4D12" />
          {/* Fragrant Smoke Spiral from Peak */}
          <path d="M60 19c-5-6 6-8 0-15m1 5c4-3 5-7 2-9" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.95" />
          {/* Marigold Petal Accents */}
          <circle cx="34" cy="74" r="3" fill="#FF7B25" />
          <circle cx="86" cy="74" r="3" fill="#FF7B25" />
        </>
      )}

      {/* 5. CHANDAN CUP (Sacred Herbal Cup filled with Chandan/Loban Resin on Trivet) */}
      {(kind === "chandan-cup" || kind === "sandalwood") && (
        <>
          {/* Trivet Base */}
          <ellipse cx="60" cy="80" rx="36" ry="7" fill="#C88C18" stroke="#7A4E02" strokeWidth="2" />
          <path d="M38 78h44" stroke="#F6C84C" strokeWidth="3" strokeLinecap="round" />
          {/* Cylindrical Herbal Cup Body */}
          <path d="M36 46h48l-6 33H42l-6-33Z" fill="#54301D" stroke="#2B140B" strokeWidth="2.5" />
          <ellipse cx="60" cy="46" rx="24" ry="8" fill="#D49A24" stroke="#2B140B" strokeWidth="2" />
          {/* Golden Sandalwood / Chandan Paste Core */}
          <ellipse cx="60" cy="46" rx="17" ry="5.5" fill="#F6C84C" />
          {/* Burning Center Resin Ember */}
          <circle cx="60" cy="45" r="4.5" fill="#FF5A1F" />
          <circle cx="60" cy="45" r="2" fill="#FFF2B2" />
          {/* Sacred Billowing Smoke */}
          <path d="M57 39c-7-9 6-12 1-20m8 18c-5-8 7-10 1-19" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.95" />
          {/* Sacred Sandalwood Paste Triple Line Accent */}
          <path d="M48 64h24m-20 4h16" stroke="#F6C84C" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {/* 6. SAMBRANI POWDER (Traditional Brass Dhunachi with Granular Paal Sambrani & Smoke) */}
      {(kind === "sambrani-powder" || kind === "sambrani") && (
        <>
          {/* Traditional Dhunachi Handle Extending to Left */}
          <path d="M38 58 Q20 62 14 74" stroke="#C88C18" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="14" cy="74" r="3.5" fill="#FFD166" />
          {/* Pedestal Base */}
          <path d="M56 66h8v12h-8z" fill="#C88C18" stroke="#7A4E02" strokeWidth="1.5" />
          <ellipse cx="60" cy="80" rx="22" ry="6" fill="#F6C84C" stroke="#7A4E02" strokeWidth="2" />
          {/* Dhunachi Goblet Bowl */}
          <path d="M38 52 C38 68 82 68 82 52 Z" fill="#C88C18" stroke="#7A4E02" strokeWidth="2.5" />
          <ellipse cx="60" cy="52" rx="22" ry="7" fill="#F6C84C" stroke="#7A4E02" strokeWidth="2" />
          {/* Mounded Paal Sambrani Golden/White Resin Powder */}
          <ellipse cx="60" cy="50" rx="16" ry="5" fill="#FFF4D6" />
          <circle cx="56" cy="49" r="2.5" fill="#E8D197" />
          <circle cx="64" cy="50" r="2.2" fill="#D9BA6A" />
          <circle cx="60" cy="47" r="2.5" fill="#FF7B25" />
          {/* Rich Billowing White Cloud Smoke */}
          <path d="M48 36c-8-6-4-15 4-15 3-7 13-7 16 0 8-3 15 4 12 11-4 6-12 5-15 9-3-4-10-3-17-5Z" fill="#FFFFFF" opacity="0.9" />
          <path d="M52 22c-3-6 5-9 1-15m13 13c3-6-4-9 0-14" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.95" />
        </>
      )}

      {/* 7. POOJA ESSENTIALS (Glowing Brass Diya, Temple Ghanti Bell & Sacred Petal) */}
      {kind === "diya" && (
        <>
          {/* Sacred Temple Ghanti Bell Beside Diya */}
          <path d="M88 64c0-10-5-18-12-20v-8h-3v8c-7 2-12 10-12 20h27Z" fill="#F6C84C" stroke="#7A4E02" strokeWidth="1.8" />
          <circle cx="74.5" cy="32" r="3.5" fill="#D49A24" />
          <ellipse cx="74.5" cy="64" rx="13.5" ry="4" fill="#C88C18" />
          {/* Classic Brass Diya Base */}
          <path d="M46 76h28" stroke="#C88C18" strokeWidth="4" strokeLinecap="round" />
          <path d="M28 62c4 20 60 20 64 0H28Z" fill="#C88C18" stroke="#7A4E02" strokeWidth="2.5" />
          <ellipse cx="60" cy="62" rx="32" ry="9" fill="#F6C84C" stroke="#7A4E02" strokeWidth="2" />
          {/* Auspicious Bright Flame */}
          <path d="M60 20c-14 15-11 25 0 32 11-7 14-17 0-32Z" fill="#FF5400" />
          <path d="M60 30c-7 8-5 13 0 16 5-3 7-8 0-16Z" fill="#FFD166" />
          <circle cx="60" cy="42" r="3.5" fill="#FFFFFF" />
          {/* Sacred Red Hibiscus Petal */}
          <path d="M22 72c-6-6-2-12 4-10 6 2 4 10-4 10Z" fill="#D62828" />
        </>
      )}

      {/* 8. GIFT SETS (Royal Temple Puja Hamper Box with Gold Ribbons & Crest) */}
      {(kind === "gift-set" || kind === "gift") && (
        <>
          {/* Hamper Box Body */}
          <rect x="26" y="44" width="68" height="42" rx="4" fill="#D49A24" stroke="#7A4E02" strokeWidth="2.5" />
          <rect x="22" y="36" width="76" height="13" rx="3" fill="#F6C84C" stroke="#7A4E02" strokeWidth="2" />
          {/* Crimson Royal Ribbon Bands */}
          <path d="M57 36v50m6-50v50" stroke="#9E1830" strokeWidth="4.5" />
          <path d="M26 62h68" stroke="#9E1830" strokeWidth="4.5" />
          {/* Auspicious Bow with Flowing Tails */}
          <path d="M57 36c-16-2-20-18-10-18 6 0 10 9 13 18 3-9 7-18 13-18 10 0 6 16-10 18" fill="#FF5400" stroke="#8A2E00" strokeWidth="2" />
          <circle cx="60" cy="35" r="4" fill="#FFD166" />
          <path d="M55 38 46 50M65 38l9 12" stroke="#FF5400" strokeWidth="3" strokeLinecap="round" />
          {/* Golden Mandala Sparks */}
          <path d="M34 50l3 3m46-3l-3 3" stroke="#FFF7D6" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {/* 9. FAMILY PACK (Fan of 10-in-1 Fragrance Packs with Prominent "10in1" Seal) */}
      {kind === "family-pack" && (
        <>
          {/* Fan of Diverse Fragrance Tubes */}
          <rect x="30" y="24" width="14" height="54" rx="3" fill="#FF5400" stroke="#8A2E00" strokeWidth="1.8" transform="rotate(-15 37 51)" />
          <rect x="44" y="16" width="14" height="60" rx="3" fill="#F6C84C" stroke="#8E6A00" strokeWidth="1.8" transform="rotate(-5 51 46)" />
          <rect x="62" y="16" width="14" height="60" rx="3" fill="#388E3C" stroke="#1B5E20" strokeWidth="1.8" transform="rotate(5 69 46)" />
          <rect x="76" y="24" width="14" height="54" rx="3" fill="#8E24AA" stroke="#4A148C" strokeWidth="1.8" transform="rotate(15 83 51)" />
          {/* Golden Master Wrap Band */}
          <path d="M22 56 Q60 62 98 56 L96 68 Q60 74 24 68 Z" fill="#F6C84C" stroke="#7A4E02" strokeWidth="2" />
          {/* Center Royal "10 in 1" Shield Emblem */}
          <circle cx="60" cy="64" r="14" fill="#9E1830" stroke="#FFFFFF" strokeWidth="2" />
          <text x="60" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="sans-serif">10 in 1</text>
          <text x="60" y="69" textAnchor="middle" fill="#FFD166" fontSize="5" fontWeight="bold" fontFamily="sans-serif">PACK</text>
        </>
      )}

      {/* Generic fallback helpers */}
      {kind === "natural" && (
        <>
          <path d="M60 84V43" {...common} />
          <path d="M60 62C35 63 27 48 29 33c18 0 29 9 31 29Zm1-13c1-22 14-34 30-34 2 19-9 31-30 34Z" fill="#5a9d4b" stroke="#276a43" strokeWidth="2.4" />
        </>
      )}
      {kind === "clean" && (
        <>
          <path d="M60 20 82 29v18c0 16-9 27-22 34-13-7-22-18-22-34V29l22-9Z" fill="#e4f1d2" stroke="#34814b" strokeWidth="3" />
          <path d="m49 49 8 8 16-19" stroke="#34814b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {kind === "chemical-free" && (
        <>
          <path d="M60 18c-16 19-12 31 0 39 12-8 16-20 0-39Z" fill="#f07835" />
          <circle cx="60" cy="53" r="36" stroke="#d04a3e" strokeWidth="3" />
        </>
      )}
      {kind === "india" && (
        <>
          <path d="M34 22h52v56H34z" fill="#fff1cd" stroke="#b46937" strokeWidth="2.5" />
          <circle cx="60" cy="50" r="6" fill="#557fa5" />
        </>
      )}
    </svg>
  );
}
