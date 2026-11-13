"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Heart,
  HelpCircle,
  Menu,
  Search,
  ShoppingBag,
  Truck,
  User,
  ShieldCheck,
  Leaf,
  Package,
  Sparkles,
  BookOpen,
  X,
} from "lucide-react";
import { useStore } from "@/components/store";
import { CONTACT_PHONE_DISPLAY } from "@/lib/contact-info";
import {
  EditorialStarSvg,
  IndiaTricolorMarkSvg,
  JasmineBloomSvg,
  PureHeartCuppedSvg,
  SacredDiyaSvg,
} from "@/components/sacred-icons";

/* ── ENTRANCE DRAWING-STYLE SACRED VECTOR ILLUSTRATIONS ── */

/** Illustrated South Indian Entrance Mango Leaf & Marigold Toranam Garland */
function EntranceDoorwayToran() {
  return (
    <div className="absolute top-0 left-0 right-0 h-3 overflow-hidden pointer-events-none select-none z-10 opacity-90 flex">
      {Array.from({ length: 32 }).map((_, i) => (
        <svg key={i} viewBox="0 0 48 14" className="h-3 w-12 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Golden Twine / Rope */}
          <path d="M0 2 Q24 6 48 2" stroke="#FDE68A" strokeWidth="1.2" />
          {/* Mango Leaf Left (Maavilai) */}
          <path d="M14 3 C11 7 15 11 17 14 C18 10 19 6 18 3 Z" fill="#2D6A4F" stroke="#1B4332" strokeWidth="0.5" />
          <line x1="16" y1="3" x2="17" y2="13" stroke="#74C69D" strokeWidth="0.5" />
          {/* Yellow Marigold Flower (Samandhi) */}
          <circle cx="24" cy="5" r="2.8" fill="#F59E0B" stroke="#FEF08A" strokeWidth="0.6" />
          <circle cx="24" cy="5" r="1.3" fill="#D97706" />
          {/* Mango Leaf Right */}
          <path d="M34 3 C37 7 33 11 31 14 C30 10 29 6 30 3 Z" fill="#2D6A4F" stroke="#1B4332" strokeWidth="0.5" />
          <line x1="32" y1="3" x2="31" y2="13" stroke="#74C69D" strokeWidth="0.5" />
          {/* Hanging Bell */}
          <path d="M23 8 H25 L26 11 H22 Z" fill="#C89B3C" stroke="#78350F" strokeWidth="0.4" />
          <circle cx="24" cy="12" r="0.7" fill="#FDE68A" />
        </svg>
      ))}
    </div>
  );
}

/** Illustrated South Indian Temple Entrance Hanging Brass Bell (Ghanti) */
function EntranceHangingBell({ className = "h-7 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 34" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Golden Chain Links */}
      <line x1="12" y1="0" x2="12" y2="11" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
      <circle cx="12" cy="11.5" r="2" stroke="#C89B3C" strokeWidth="1.2" fill="#F59E0B" />
      {/* Bell Crown Loop */}
      <path d="M10 14 C10 12 14 12 14 14" stroke="#FDE68A" strokeWidth="1.2" />
      {/* Bell Dome Body */}
      <path d="M9 15 C9 15 8 21 5 25 C5 27 19 27 19 25 C16 21 15 15 15 15 Z" fill="#C89B3C" stroke="#78350F" strokeWidth="1" />
      {/* Bell Rim Highlight */}
      <ellipse cx="12" cy="25" rx="7" ry="2" fill="#FDE68A" stroke="#78350F" strokeWidth="0.8" />
      {/* Hanging Clapper */}
      <circle cx="12" cy="28.5" r="1.6" fill="#F59E0B" stroke="#78350F" strokeWidth="0.6" />
      {/* Radiating Sound Sparks */}
      <path d="M2.5 25 C1 23 1 27 2.5 25M21.5 25 C23 23 23 27 21.5 25" stroke="#FDE68A" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

/** Illustrated Traditional South Indian Entrance Brass Lamp (Kuthuvilakku) */
function EntranceKuthuVilakku({ className = "h-8 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 42" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Sacred Flame with Golden Halo */}
      <circle cx="11" cy="7" r="5" fill="#FDE68A" opacity="0.25" />
      <path d="M11 2 C8 6 9 9 11 11 C13 9 14 6 11 2 Z" fill="#EA580C" />
      <path d="M11 5 C9.5 7.5 10 9.5 11 10.5 C12 9.5 12.5 7.5 11 5 Z" fill="#FDE68A" />
      <circle cx="11" cy="9" r="1" fill="#FFFFFF" />
      {/* Peacock / Annapakshi Finial Top */}
      <circle cx="11" cy="13" r="1.6" fill="#F59E0B" />
      {/* Oil Reservoir Thattu */}
      <ellipse cx="11" cy="16" rx="6.5" ry="2.2" fill="#C89B3C" stroke="#78350F" strokeWidth="0.8" />
      <ellipse cx="11" cy="15.5" rx="5" ry="1.2" fill="#FDE68A" />
      {/* Turned Brass Pillar */}
      <rect x="10" y="17" width="2" height="16" fill="#D97706" />
      <ellipse cx="11" cy="22" rx="3.5" ry="1.2" fill="#C89B3C" />
      <ellipse cx="11" cy="28" rx="4" ry="1.2" fill="#C89B3C" />
      {/* Stepped Pedestal Base */}
      <path d="M6 37 C6 35 9 33 11 33 C13 33 16 35 16 37 Z" fill="#C89B3C" stroke="#78350F" strokeWidth="0.8" />
      <ellipse cx="11" cy="38" rx="7.5" ry="2.2" fill="#B45309" stroke="#78350F" strokeWidth="0.8" />
      <ellipse cx="11" cy="37.5" rx="6" ry="1.2" fill="#FDE68A" />
    </svg>
  );
}

/** Illustrated Temple Gateway Arch (Dwara Torana) Drawing */
function EntranceToranaArch({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Sacred Kalasam Peak */}
      <circle cx="18" cy="3" r="1.8" fill="#FDE68A" />
      <path d="M18 4 L15 9 H21 Z" fill="#F59E0B" />
      {/* Arch Curve (Makara Torana) */}
      <path d="M7 34 V18 C7 11 29 11 29 18 V34" stroke="#FDE68A" strokeWidth="1.5" />
      <path d="M10 34 V19 C10 14 26 14 26 19 V34" stroke="#C89B3C" strokeWidth="1" strokeDasharray="2 1.5" />
      {/* Hanging Bell in Center */}
      <line x1="18" y1="13" x2="18" y2="18" stroke="#FDE68A" strokeWidth="1" />
      <path d="M16 18 H20 L21 22 H15 Z" fill="#F59E0B" />
      <circle cx="18" cy="23" r="1" fill="#FDE68A" />
      {/* Base Plinths */}
      <ellipse cx="7" cy="34" rx="3.5" ry="1.5" fill="#FDE68A" />
      <ellipse cx="29" cy="34" rx="3.5" ry="1.5" fill="#FDE68A" />
    </svg>
  );
}

type MegaMenu = "shop" | null;

interface CategoryItem {
  id: string;
  name: string;
  subtext?: string;
  queryParam: string;
}

const CATEGORIES_LIST: CategoryItem[] = [
  { id: "agarbatti", name: "Agarbatti", queryParam: "Agarbatti" },
  { id: "camphor", name: "Camphor", queryParam: "Camphor" },
  { id: "dhoop-stick", name: "Dhoop Stick", subtext: "Bambooless Stick", queryParam: "Dhoop Stick" },
  { id: "incense-cone", name: "Incense Cone", queryParam: "Incense Cones" },
  { id: "havan-cups", name: "Havan Cups", queryParam: "Havan Cups" },
  { id: "sambrani-powder", name: "Sambrani Powder", queryParam: "Sambrani Powder" },
  { id: "pooja-essentials", name: "Pooja Essentials", queryParam: "Pooja Essentials" },
  { id: "gift-sets", name: "Gift Sets", queryParam: "Gift Sets" },
  { id: "family-pack", name: "Family Pack", queryParam: "Family Pack" },
];

function CategoryIcon({ id, className = "h-5 w-5" }: { id: string; className?: string }) {
  switch (id) {
    case "agarbatti":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <line x1="7" y1="21" x2="16" y2="3" />
          <line x1="10" y1="21" x2="19" y2="5" />
          <line x1="4" y1="21" x2="13" y2="7" />
          <path d="M5 21h12" />
        </svg>
      );
    case "camphor":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      );
    case "dhoop-stick":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 16.5A4.5 4.5 0 1 1 16.5 12 4.5 4.5 0 1 1 12 7.5 4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 16.5" />
        </svg>
      );
    case "incense-cone":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3L4 20h16L12 3z" />
          <path d="M4 20c0 1.1 3.58 2 8 2s8-.9 8-2" />
        </svg>
      );
    case "havan-cups":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 9h14l-2 9H7L5 9z" />
          <path d="M9 4c1 1.5 0 2.5 1 4" />
          <path d="M14 4c1 1.5 0 2.5 1 4" />
          <path d="M4 18h16" />
        </svg>
      );
    case "sambrani-powder":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8H4z" />
          <path d="M12 5l-4 7h8l-4-7z" />
        </svg>
      );
    case "pooja-essentials":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2c-.5 2-2 3-2 5a2 2 0 1 0 4 0c0-2-1.5-3-2-5z" />
          <path d="M6 13h12l-1 5H7l-1-5z" />
          <path d="M4 18h16" />
        </svg>
      );
    case "gift-sets":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="8" width="18" height="13" rx="2" />
          <path d="M12 8v13" />
          <path d="M19 12H3" />
          <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
        </svg>
      );
    case "family-pack":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="6" width="20" height="14" rx="2" />
          <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
          <circle cx="12" cy="13" r="2" />
        </svg>
      );
    default:
      return <Leaf className={className} />;
  }
}

export function Navigation() {
  const [openMega, setOpenMega] = useState<MegaMenu>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string>("Agarbatti");
  const pathname = usePathname();
  const { totalItems, wishlist, setIsSearchOpen, user, dbProducts } = useStore();

  // Dynamic text-revealing announcements
  const announcements = useMemo(() => [
    {
      icon: <IndiaTricolorMarkSvg className="h-3 w-4" />,
      badge: "1ST TIME IN INDIA",
      highlight: "10-in-1 Aroma Family Pack",
      text: "10 Divine Fragrances in One Pack",
      href: "/shop",
    },
    {
      icon: <EditorialStarSvg className="h-3 w-3 text-brand-primary" />,
      badge: "SMELL OF PURITY",
      highlight: "100% Charcoal-Free Herbal Resins",
      text: "Zero Black Soot • Pure Daily Devotion",
      href: "/about",
    },
    {
      icon: <Package size={12} className="text-brand-ink shrink-0" />,
      badge: "FREE DELIVERY",
      highlight: "Directly Dispatched From Coimbatore",
      text: "Free Express Shipping on Orders Above ₹499",
      href: "/shop",
    },
    {
      icon: <SacredDiyaSvg className="h-3.5 w-3.5" />,
      badge: "SACRED TRADITION",
      highlight: "Kewda, Loban, Sandalwood & Camphor",
      text: "Authentic Vedic Temple Fragrances",
      href: "/shop",
    },
  ], []);

  const [activeAnnounce, setActiveAnnounce] = useState(0);
  const [isRevealing, setIsRevealing] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsRevealing(false);
      setTimeout(() => {
        setActiveAnnounce((prev) => (prev + 1) % announcements.length);
        setIsRevealing(true);
      }, 300);
    }, 4200);
    return () => clearInterval(timer);
  }, [announcements.length]);

  useEffect(() => {
    setOpenMega(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Dynamically select popular products directly from backend dbProducts (No Hardcoding!)
  const popularBackendProducts = useMemo(() => {
    if (!dbProducts || dbProducts.length === 0) return [];

    // Filter by currently selected category first
    const target = hoveredCategory.toLowerCase();
    const matched = dbProducts.filter((p) => {
      const pCat = (p.category || "").toLowerCase();
      const pLabels = (p.categoryLabels || []).map((l) => l.toLowerCase());
      return pCat.includes(target) || pLabels.some((l) => l.includes(target)) || target.includes(pCat);
    });

    if (matched.length >= 3) {
      return matched.slice(0, 3);
    }

    // Fall back to featured or other available products from backend
    const remaining = dbProducts.filter((p) => !matched.some((m) => m.slug === p.slug));
    return [...matched, ...remaining].slice(0, 3);
  }, [dbProducts, hoveredCategory]);

  return (
    <>
      {/* Top Announcement Bar with Royal Crimson Red Background, Entrance Drawing Illustrations & Text Reveal Animation */}
      <div className="relative z-50 bg-gradient-to-r from-[#9E1830] via-[#851327] to-[#9E1830] px-3 pt-3.5 pb-2.5 text-[11px] font-semibold text-white sm:px-4 sm:pt-4 sm:pb-3 sm:text-ui-13 border-b-2 border-[#C89B3C]/60 font-sans shadow-md min-h-[48px] sm:min-h-[52px] flex items-center overflow-hidden">
        
        {/* 1. Auspicious Entrance Hanging Toranam (Mango Leaves & Marigolds at Doorway Top) */}
        <EntranceDoorwayToran />

        {/* 2. Background Subtle Temple Entrance Arches */}
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-between px-3 sm:px-12 opacity-15">
          <EntranceToranaArch className="h-9 w-9 text-[#FDE68A]" />
          <EntranceToranaArch className="h-9 w-9 text-[#FDE68A]" />
        </div>

        <div className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-0 sm:px-6 xl:max-w-[1440px] 2xl:max-w-[1560px]">
          {/* Left: Entrance Kuthuvilakku + Hanging Temple Bell + Announcement */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5 sm:min-h-7">
            {/* Illustrated Entrance Brass Standing Lamp */}
            <EntranceKuthuVilakku className="h-7 w-4.5 shrink-0 hidden md:block drop-shadow-xs" />
            
            {/* Illustrated Hanging Temple Bell */}
            <EntranceHangingBell className="h-6 w-5 shrink-0 drop-shadow-xs" />

            <Link
              href={announcements[activeAnnounce].href}
              className={`flex min-w-0 items-center gap-2 sm:gap-3 transition-all duration-400 ease-out transform ${
                isRevealing
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-2 scale-98 pointer-events-none"
              }`}
            >
              <span className="hidden min-[420px]:inline-flex items-center gap-1.5 rounded-full bg-[#C89B3C] border border-[#FDE68A]/60 px-3 py-0.5 text-[10px] sm:text-xs font-black tracking-wider text-stone-950 shrink-0 uppercase shadow-xs">
                {announcements[activeAnnounce].icon}
                <span>{announcements[activeAnnounce].badge}</span>
              </span>
              <span className="truncate text-xs leading-snug sm:text-sm font-medium text-white/95">
                <strong className="text-[#FDE68A] font-bold mr-1.5 drop-shadow-xs">{announcements[activeAnnounce].highlight}:</strong>
                <span className="text-white/95">{announcements[activeAnnounce].text}</span>
              </span>
            </Link>
          </div>

          {/* Right: Hanging Bell + Track Order & Contact Links + Entrance Lamp */}
          <div className="hidden shrink-0 items-center justify-end gap-2.5 sm:gap-3.5 whitespace-nowrap text-white/95 sm:flex text-xs sm:text-sm">
            <EntranceHangingBell className="h-6 w-5 shrink-0 opacity-90 drop-shadow-xs" />
            <Link href="/login" className="inline-flex items-center gap-1.5 text-white/90 hover:text-[#FDE68A] transition-colors">
              <Truck size={14} className="text-[#C89B3C]" />
              <span>Track Order</span>
            </Link>
            <span className="text-[#C89B3C]/60">|</span>
            <Link href="/contact" className="inline-flex items-center gap-1.5 text-white/90 hover:text-[#FDE68A] transition-colors">
              <HelpCircle size={14} className="text-[#C89B3C]" />
              <span>{CONTACT_PHONE_DISPLAY}</span>
            </Link>
            <EntranceKuthuVilakku className="h-7 w-4.5 shrink-0 hidden lg:block drop-shadow-xs" />
          </div>
        </div>
      </div>

      {/* Main Navbar Header */}
      <header
        className="sticky top-0 z-50 font-sans bg-brand-surface/95 backdrop-blur-md border-b border-brand-border shadow-xs"
        onMouseLeave={() => setOpenMega(null)}
      >
        <div className="page-container flex h-[64px] sm:h-[76px] items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Tablet/Mobile Drawer Trigger + Brand Logo */}
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:flex-initial">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-[10px] border border-brand-border bg-white text-brand-ink transition hover:border-brand-primary hover:text-brand-primary lg:hidden"
            >
              <Menu size={19} strokeWidth={2} />
            </button>

            <Link href="/" className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3.5 lg:flex-initial group" aria-label="HM Brand Home">
              <div className="relative h-8 w-8 min-[400px]:h-9 min-[400px]:w-9 sm:h-12 sm:w-12 shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/brand_logo_icon_transparent.png"
                  alt="HM Brand Logo"
                  fill
                  sizes="(max-width: 640px) 36px, 48px"
                  priority
                  className="object-contain"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-center leading-tight">
                <span className="font-brand truncate text-[14px] min-[400px]:text-base sm:text-2xl font-bold tracking-[0.05em] sm:tracking-[0.16em] uppercase text-brand-heading">
                  HM <span className="text-brand-primary">BRAND</span>
                </span>
                <span className="font-sans truncate text-[7.5px] min-[400px]:text-[9px] sm:text-xs text-brand-primary tracking-[0.04em] sm:tracking-[0.18em] uppercase font-bold -mt-0.5">
                  Discover the Divine Within
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Navigation Links in Manrope */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-9 h-full" aria-label="Main Navigation">
            <Link
              href="/"
              className={`relative py-6 font-sans text-sm font-semibold tracking-wider uppercase transition-colors ${
                pathname === "/" ? "text-brand-primary" : "text-brand-heading hover:text-brand-primary"
              }`}
            >
              <span>HOME</span>
              {pathname === "/" && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-brand-primary rounded-full" />}
            </Link>

            {/* SHOP WITH MEGAMENU TRIGGER */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setOpenMega("shop")}
            >
              <button
                type="button"
                onClick={() => setOpenMega(openMega === "shop" ? null : "shop")}
                aria-expanded={openMega === "shop"}
                className={`relative py-6 inline-flex items-center gap-1.5 font-sans text-sm font-semibold tracking-wider uppercase transition-colors ${
                  openMega === "shop" || pathname.startsWith("/shop")
                    ? "text-brand-primary"
                    : "text-brand-heading hover:text-brand-primary"
                }`}
              >
                <span>SHOP</span>
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-300 ${openMega === "shop" ? "rotate-180" : ""}`}
                />
                {(openMega === "shop" || pathname.startsWith("/shop")) && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-brand-primary rounded-full" />
                )}
              </button>
            </div>

            <Link
              href="/about"
              className={`relative py-6 font-sans text-sm font-semibold tracking-wider uppercase transition-colors ${
                pathname === "/about" ? "text-brand-primary" : "text-brand-heading hover:text-brand-primary"
              }`}
            >
              <span>ABOUT</span>
              {pathname === "/about" && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-brand-primary rounded-full" />}
            </Link>

            <Link
              href="/contact"
              className={`relative py-6 font-sans text-sm font-semibold tracking-wider uppercase transition-colors ${
                pathname === "/contact" ? "text-brand-primary" : "text-brand-heading hover:text-brand-primary"
              }`}
            >
              <span>CONTACT</span>
              {pathname === "/contact" && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-brand-primary rounded-full" />}
            </Link>
          </nav>

          {/* Right Actions: Search Pill, Account, Wishlist, Cart */}
          <div className="flex items-center gap-0.5 sm:gap-2.5 shrink-0">
            
            {/* Mobile Compact Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search products"
              className="flex h-10 w-10 items-center justify-center rounded-[10px] text-brand-ink hover:text-brand-primary hover:bg-brand-surface-warm transition md:hidden"
            >
              <Search size={19} strokeWidth={1.8} />
            </button>

            {/* Tablet & Desktop Search Pill Input */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search products"
              className="hidden md:flex items-center gap-2.5 h-10 w-52 lg:w-72 xl:w-80 rounded-[10px] border border-brand-border bg-white px-3.5 text-xs text-brand-slate shadow-2xs hover:border-brand-primary transition-colors"
            >
              <Search size={15} className="text-brand-primary shrink-0" />
              <span className="truncate">Search for agarbatti, camphor, pooja items...</span>
            </button>

            {/* Admin Badge (tablet/desktop header; mobile accesses via menu drawer) */}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                aria-label="Admin dashboard"
                className="hidden sm:inline-flex h-11 w-11 items-center justify-center gap-1.5 rounded-full bg-brand-primary px-2 text-xs font-bold text-white transition hover:bg-brand-hover sm:w-auto sm:px-3.5"
              >
                <ShieldCheck size={15} />
                <span>Admin</span>
              </Link>
            )}

            {/* Profile / Account */}
            <Link
              href={user ? "/account" : "/login"}
              aria-label="Account"
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full text-brand-ink hover:text-brand-primary hover:bg-brand-surface-soft transition"
            >
              <User size={19} strokeWidth={1.8} />
            </Link>

            {/* Wishlist (desktop/tablet header; mobile accesses via menu drawer) */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative hidden md:flex h-11 w-11 items-center justify-center rounded-full text-brand-ink hover:text-brand-primary hover:bg-brand-surface-soft transition"
            >
              <Heart size={20} strokeWidth={1.8} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 min-w-4 px-1 rounded-full bg-brand-primary text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Full-Page Cart Link */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full text-brand-ink hover:text-brand-primary hover:bg-brand-surface-soft transition"
            >
              <ShoppingBag size={19} strokeWidth={1.8} />
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 h-4 min-w-4 px-1 rounded-full bg-brand-primary text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </Link>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* DESKTOP FLOATING MEGAMENU                                                */}
        {/* ========================================================================= */}
        {openMega === "shop" && (
          <div
            className="absolute inset-x-0 top-full z-50 pt-2 pb-8 px-4 sm:px-6 lg:px-8 bg-black/15 backdrop-blur-2xs animate-fade-in"
            onMouseEnter={() => setOpenMega("shop")}
            onMouseLeave={() => setOpenMega(null)}
          >
            <div className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] rounded-3xl border border-brand-border bg-brand-surface-bright shadow-[0_25px_60px_-15px_rgba(23,59,58,0.22)] p-6 sm:p-8">
              
              <div className="grid grid-cols-12 gap-6 lg:gap-8 items-stretch">
                
                {/* ------------------------------------------------------------- */}
                {/* COLUMN 1: SHOP BY CATEGORY                                   */}
                {/* ------------------------------------------------------------- */}
                <div className="col-span-3 border-r border-brand-border/70 pr-4 sm:pr-6 flex flex-col justify-between">
                  <div>
                    <span className="font-space text-xs font-bold tracking-[0.18em] text-brand-primary uppercase block mb-4">
                      SHOP BY CATEGORY
                    </span>

                    <div className="space-y-1">
                      {CATEGORIES_LIST.map((item) => {
                        const isActive = hoveredCategory.toLowerCase() === item.name.toLowerCase();
                        return (
                          <div
                            key={item.id}
                            onMouseEnter={() => setHoveredCategory(item.name)}
                            className="group"
                          >
                            <Link
                              href={`/shop?category=${encodeURIComponent(item.queryParam)}`}
                              onClick={() => setOpenMega(null)}
                              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-ui-13 font-bold transition-all ${
                                isActive
                                  ? "bg-[#FFF2F4] text-brand-primary border-l-4 border-brand-primary"
                                  : "text-brand-ink hover:bg-brand-surface-soft hover:text-brand-primary"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className={isActive ? "text-brand-primary" : "text-brand-ink/70 group-hover:text-brand-primary"}>
                                  <CategoryIcon id={item.id} className="h-4 w-4" />
                                </span>
                                <div className="truncate">
                                  <span className="block truncate">{item.name}</span>
                                  {item.subtext && (
                                    <span className="block text-ui-10 font-normal text-brand-ink/60 -mt-0.5">
                                      {item.subtext}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ChevronRight
                                size={14}
                                className={`shrink-0 transition-transform ${
                                  isActive ? "text-brand-primary translate-x-0.5" : "text-brand-ink/30 group-hover:text-brand-primary"
                                }`}
                              />
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* View All Products & Quick Links */}
                  <div className="pt-4 mt-2 border-t border-brand-border/50">
                    <Link
                      href="/shop"
                      onClick={() => setOpenMega(null)}
                      className="font-space text-xs font-bold text-brand-primary hover:text-brand-hover flex items-center justify-between uppercase tracking-wider group transition"
                    >
                      <span>View All Products</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <div className="flex items-center gap-2.5 pt-2 text-xs font-semibold text-brand-ink/75">
                      <Link
                        href="/about#pillars"
                        onClick={() => setOpenMega(null)}
                        className="hover:text-brand-primary transition-colors"
                      >
                        Natural Benefits
                      </Link>
                      <span>•</span>
                      <Link
                        href="/about#story"
                        onClick={() => setOpenMega(null)}
                        className="hover:text-brand-primary transition-colors"
                      >
                        Our Story &amp; Rituals
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* COLUMN 2: POPULAR PICKS (DYNAMICALLY FROM BACKEND PRODUCTS)   */}
                {/* ------------------------------------------------------------- */}
                <div className="col-span-5 flex flex-col justify-between">
                  <div>
                    {/* Header: Popular Picks + View All */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-space text-xs font-bold tracking-[0.18em] text-brand-primary uppercase">
                        POPULAR PICKS
                      </span>
                      <Link
                        href={`/shop?category=${encodeURIComponent(hoveredCategory)}`}
                        onClick={() => setOpenMega(null)}
                        className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
                      >
                        <span>View All</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>

                    {/* 3 Backend Product Cards - Flush Edge-to-Edge Image with Card Top Radius, No Gap */}
                    <div className="grid grid-cols-3 gap-3.5">
                      {popularBackendProducts.length > 0 ? (
                        popularBackendProducts.map((product) => {
                          const productImg = product.image || product.images?.[0]?.url;
                          return (
                            <Link
                              key={product.slug}
                              href={`/product/${product.slug}`}
                              onClick={() => setOpenMega(null)}
                              className="group flex flex-col justify-between rounded-2xl bg-white border border-brand-border/70 overflow-hidden shadow-2xs hover:shadow-md hover:border-brand-primary transition-all"
                            >
                              <div className="relative aspect-square w-full overflow-hidden bg-brand-surface-soft border-b border-brand-border/60 p-2.5 flex items-center justify-center">
                                {productImg ? (
                                  <img
                                    src={productImg}
                                    alt={product.name}
                                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                      const target = e.currentTarget as HTMLImageElement;
                                      if (!target.src.includes("hm_glory_agarbatti")) {
                                        target.src = "/images/products/hm_glory_agarbatti.jpg";
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-brand-ink/50 text-xs">
                                    <SacredDiyaSvg className="h-7 w-7" />
                                    <span className="text-ui-10 mt-1">HM Purity</span>
                                  </div>
                                )}
                              </div>

                              {/* Card Content with clean padding */}
                              <div className="p-3 flex flex-col flex-1 justify-between">
                                <div>
                                  {/* Product Name */}
                                  <h4 className="font-playfair text-sm font-bold text-brand-ink group-hover:text-brand-primary transition-colors line-clamp-1 leading-snug">
                                    {product.name}
                                  </h4>

                                  {/* Subtitle / Category from backend */}
                                  <p className="font-sans text-ui-10 text-brand-ink/70 line-clamp-1 mt-0.5">
                                    {product.subCategory || product.category || "Pure & Natural Aroma"}
                                  </p>
                                </div>

                                {/* Price & CTA Button */}
                                <div className="mt-2.5 pt-2 border-t border-brand-surface-soft">
                                  <span className="font-space text-xs font-bold text-brand-primary block">
                                    From ₹{product.price}
                                  </span>
                                  <span className="mt-1.5 block w-full rounded-full bg-brand-surface-warm group-hover:bg-brand-accent text-brand-primary group-hover:text-brand-ink text-center py-1 text-ui-11 font-bold transition-colors">
                                    Shop Now →
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })
                      ) : (
                        <div className="col-span-3 py-10 text-center text-xs text-brand-ink/60">
                          Handcrafted pure fragrances loading...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4 Mini Trust Badges at Bottom */}
                  <div className="mt-6 pt-4 border-t border-brand-border/60 grid grid-cols-4 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-brand-green/15 text-brand-green flex items-center justify-center shrink-0">
                        <Leaf size={14} />
                      </div>
                      <div className="leading-tight">
                        <span className="block font-bold text-ui-11 text-brand-ink">100% Natural</span>
                        <span className="block text-ui-9 text-brand-ink/60">Botanicals &amp; Resins</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-[#4C7FA8]/15 text-[#4C7FA8] flex items-center justify-center shrink-0">
                        <ShieldCheck size={14} />
                      </div>
                      <div className="leading-tight">
                        <span className="block font-bold text-ui-11 text-brand-ink">No Harmful</span>
                        <span className="block text-ui-9 text-brand-ink/60">Chemicals</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center shrink-0">
                        <JasmineBloomSvg className="h-4 w-4" />
                      </div>
                      <div className="leading-tight">
                        <span className="block font-bold text-ui-11 text-brand-ink">Safe for Family</span>
                        <span className="block text-ui-11 text-brand-ink/65">&amp; Kids</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0">
                        <PureHeartCuppedSvg className="h-4 w-4 text-brand-orange" />
                      </div>
                      <div className="leading-tight">
                        <span className="block font-bold text-ui-11 text-brand-ink">Tradition You</span>
                        <span className="block text-ui-11 text-brand-ink/70">Can Trust</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* ------------------------------------------------------------- */}
                {/* COLUMN 3: FEATURED PROMO BANNER (SOLID EDITORIAL PANEL)       */}
                {/* ------------------------------------------------------------- */}
                <div className="col-span-4 relative rounded-2xl bg-[#EFF5EB] p-6 lg:p-7 overflow-hidden border border-[#CFE0C5] flex flex-col justify-between">

                  <div className="relative z-10">
                    <span className="font-space text-xs font-bold tracking-[0.18em] text-brand-amber uppercase block mb-1.5">
                      FRAGRANCE FOR A BETTER TOMORROW
                    </span>
                    <h3 className="font-playfair text-xl lg:text-2xl font-bold text-brand-ink leading-tight">
                      Find a fragrance for every ritual
                    </h3>
                    <p className="font-sans text-xs text-brand-ink/80 leading-relaxed mt-1.5 max-w-[270px]">
                      Discover pure temple fragrances, charcoal-free sticks &amp; sacred puja essentials.
                    </p>
                  </div>

                  {/* Dedicated Story & Purity Interactive Feature Cards */}
                  <div className="relative z-10 my-3 space-y-2.5">
                    <Link
                      href="/about#pillars"
                      onClick={() => setOpenMega(null)}
                      className="group flex items-center gap-3 rounded-xl bg-white border border-[#DCE8D3] p-3 shadow-2xs hover:shadow-sm hover:border-brand-green transition-all"
                    >
                      <div className="h-9 w-9 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                        <Sparkles size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-playfair font-bold text-xs sm:text-sm text-brand-ink group-hover:text-brand-green transition-colors">
                            Natural Benefits
                          </span>
                          <ArrowRight size={12} className="text-brand-green transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <span className="block text-ui-11 text-brand-ink/70 line-clamp-1">
                          Therapeutic herbs, charcoal-free &amp; clean burn
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/about#story"
                      onClick={() => setOpenMega(null)}
                      className="group flex items-center gap-3 rounded-xl bg-white border border-[#DCE8D3] p-3 shadow-2xs hover:shadow-sm hover:border-brand-primary transition-all"
                    >
                      <div className="h-9 w-9 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                        <BookOpen size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-playfair font-bold text-xs sm:text-sm text-brand-ink group-hover:text-brand-primary transition-colors">
                            Our Story &amp; Rituals
                          </span>
                          <ArrowRight size={12} className="text-brand-primary transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <span className="block text-ui-11 text-brand-ink/70 line-clamp-1">
                          Vedic customs, fragrance guides &amp; craft
                        </span>
                      </div>
                    </Link>
                  </div>

                  <div className="relative z-10 pt-1">
                    <Link
                      href="/shop"
                      onClick={() => setOpenMega(null)}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary hover:bg-brand-hover text-white px-5 text-xs font-bold uppercase tracking-wider shadow-sm transition active:scale-95"
                    >
                      <span>Explore Collections</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}
      </header>

      {/* MOBILE & TABLET SLIDE-OVER DRAWER (< 1024px) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden" role="dialog" aria-modal="true" aria-label="Site navigation">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-brand-ink/50 backdrop-blur-xs"
          />
          <div className="relative z-10 flex h-full w-full max-w-xs sm:max-w-sm flex-col bg-brand-surface-bright border-r border-brand-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-border px-5 py-4 bg-white">
              <div className="leading-tight">
                <span className="font-brand text-base font-bold uppercase tracking-[0.14em] text-brand-heading">
                  HM <span className="text-brand-primary">BRAND</span>
                </span>
                <span className="block text-xs font-medium text-brand-muted">Menu &amp; Categories</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border bg-white text-brand-ink hover:border-brand-primary hover:text-brand-primary transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center justify-between rounded-xl bg-brand-primary px-3.5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-brand-hover"
                >
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={17} />
                    <span>Admin Dashboard</span>
                  </span>
                  <ChevronRight size={16} />
                </Link>
              )}
              <nav aria-label="Drawer navigation" className="space-y-1">
                {[
                  { label: "Home", href: "/" },
                  { label: "Shop All Products", href: "/shop" },
                  { label: "Our Story & Heritage", href: "/about" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Saved Wishlist", href: "/wishlist" },
                  { label: user ? "My Account" : "Sign In / Register", href: user ? "/account" : "/login" },
                ].map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex min-h-11 items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold tracking-wide transition ${
                        active
                          ? "bg-brand-primary text-white"
                          : "text-brand-heading hover:bg-brand-surface-soft hover:text-brand-primary"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight size={16} />
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-brand-border pt-4">
                <span className="block px-2 pb-2.5 font-space text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">
                  Shop By Category
                </span>
                <div className="grid grid-cols-1 gap-1">
                  {CATEGORIES_LIST.map((item) => (
                    <Link
                      key={item.id}
                      href={`/shop?category=${encodeURIComponent(item.queryParam)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-brand-ink hover:bg-white hover:text-brand-primary border border-transparent hover:border-brand-border transition"
                    >
                      <span className="text-brand-primary">
                        <CategoryIcon id={item.id} className="h-4 w-4" />
                      </span>
                      <span className="flex-1">{item.name}</span>
                      <ArrowRight size={13} className="text-brand-muted" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
