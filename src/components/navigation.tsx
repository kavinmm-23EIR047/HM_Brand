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
  Search,
  ShoppingBag,
  Truck,
  User,
  ShieldCheck,
  Leaf,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useStore } from "@/components/store";

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
  const [hoveredCategory, setHoveredCategory] = useState<string>("Agarbatti");
  const pathname = usePathname();
  const { totalItems, wishlist, setIsSearchOpen, user, dbProducts } = useStore();

  // Dynamic text-revealing announcements
  const announcements = useMemo(() => [
    {
      badge: "🇮🇳 1ST TIME IN INDIA",
      highlight: "10-in-1 Aroma Family Pack",
      text: "10 Divine Fragrances in One Pack",
      href: "/shop",
    },
    {
      badge: "✦ SMELL OF PURITY",
      highlight: "100% Charcoal-Free Herbal Resins",
      text: "Zero Black Soot • Pure Daily Devotion",
      href: "/about",
    },
    {
      badge: "📦 FREE DELIVERY",
      highlight: "Directly Dispatched From Coimbatore",
      text: "Free Express Shipping on Orders Above ₹499",
      href: "/shop",
    },
    {
      badge: "🪔 SACRED TRADITION",
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
    <div className="relative z-50 font-sans">
      {/* Top Announcement Bar with Dynamic Text Reveal */}
      <div className="bg-brand-ink px-2.5 py-2 text-xs font-semibold text-white sm:px-4 sm:text-ui-13 border-b border-brand-accent/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:px-6 xl:max-w-[1440px] 2xl:max-w-[1560px]">
          <div className="flex min-w-0 flex-1 items-center sm:min-h-6">
            <Link
              href={announcements[activeAnnounce].href}
              className={`flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 sm:gap-3 transition-all duration-300 ease-out ${
                isRevealing
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <span className="inline-flex items-center rounded-full bg-brand-accent px-2 py-0.5 text-ui-10 sm:text-ui-11 font-black tracking-wider text-brand-ink shrink-0 uppercase shadow-2xs">
                {announcements[activeAnnounce].badge}
              </span>
              <span className="text-[11px] leading-snug sm:text-ui-13 font-medium text-white/95">
                <strong className="text-brand-accent-soft font-bold mr-1.5">{announcements[activeAnnounce].highlight}:</strong>
                <span className="text-white/90">{announcements[activeAnnounce].text}</span>
              </span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2.5 whitespace-nowrap text-white/95 sm:gap-4 text-xs sm:text-ui-13">
            <Link href="/login" className="hidden items-center gap-1.5 hover:text-brand-accent transition-colors min-[400px]:inline-flex">
              <Truck size={14} />
              <span>Track Order</span>
            </Link>
            <span className="hidden text-white/40 sm:inline">|</span>
            <Link href="/contact" className="hidden items-center gap-1.5 hover:text-brand-accent sm:inline-flex transition-colors">
              <HelpCircle size={14} />
              <span>+91 9345633399</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar Header */}
      <header
        className="sticky top-0 z-40 bg-brand-surface-bright border-b border-brand-border/70 shadow-xs"
        onMouseLeave={() => setOpenMega(null)}
      >
        <div className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] flex h-[68px] sm:h-[76px] items-center justify-between gap-1.5 sm:gap-4 px-2.5 sm:px-6 lg:px-8">
          
          {/* Left: Brand Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-1.5 sm:gap-3.5 shrink-0 group" aria-label="HM Brand Home">
            <div className="relative h-10 w-10 sm:h-13 sm:w-13 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/brand_logo_icon_transparent.png"
                alt="HM Brand Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col justify-center leading-tight">
              <span className="font-brand text-base min-[380px]:text-lg sm:text-2xl font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase text-brand-heading">
                HM <span className="text-brand-primary">BRAND</span>
              </span>
              <span className="font-tagline text-[9px] min-[380px]:text-[10px] sm:text-ui-13 text-brand-primary tracking-[0.12em] sm:tracking-[0.2em] uppercase font-bold -mt-0.5 whitespace-nowrap">
                Discover the Divine Within
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-9 h-full" aria-label="Main Navigation">
            <Link
              href="/"
              className={`relative py-6 font-brand text-sm sm:text-ui-15 font-bold tracking-wider uppercase transition-colors ${
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
                className={`relative py-6 inline-flex items-center gap-1.5 font-brand text-sm sm:text-ui-15 font-bold tracking-wider uppercase transition-colors ${
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
              className={`relative py-6 font-brand text-sm sm:text-ui-15 font-bold tracking-wider uppercase transition-colors ${
                pathname === "/about" ? "text-brand-primary" : "text-brand-heading hover:text-brand-primary"
              }`}
            >
              <span>ABOUT</span>
              {pathname === "/about" && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-brand-primary rounded-full" />}
            </Link>

            <Link
              href="/contact"
              className={`relative py-6 font-brand text-sm sm:text-ui-15 font-bold tracking-wider uppercase transition-colors ${
                pathname === "/contact" ? "text-brand-primary" : "text-brand-heading hover:text-brand-primary"
              }`}
            >
              <span>CONTACT</span>
              {pathname === "/contact" && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-brand-primary rounded-full" />}
            </Link>
          </nav>

          {/* Right Actions: Search Pill, Account, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Search Pill Input */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search products"
              className="hidden md:flex items-center gap-2.5 h-10 w-60 lg:w-72 xl:w-80 rounded-full border border-brand-border bg-white px-4 text-xs text-brand-ink/60 shadow-2xs hover:border-brand-primary transition-colors"
            >
              <Search size={15} className="text-brand-primary shrink-0" />
              <span className="truncate">Search for agarbatti, camphor, pooja items...</span>
            </button>

            {/* Admin Badge */}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="hidden xl:inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-brand-primary text-white text-xs font-bold hover:bg-brand-hover transition"
              >
                <ShieldCheck size={14} />
                <span>Admin</span>
              </Link>
            )}

            {/* Profile / Account */}
            <Link
              href={user ? "/account" : "/login"}
              aria-label="Account"
              className="flex h-11 w-11 items-center justify-center rounded-full text-brand-ink hover:text-brand-primary hover:bg-brand-surface-soft transition"
            >
              <User size={20} strokeWidth={1.8} />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative hidden min-[380px]:flex h-11 w-11 items-center justify-center rounded-full text-brand-ink hover:text-brand-primary hover:bg-brand-surface-soft transition"
            >
              <Heart size={20} strokeWidth={1.8} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-brand-primary text-ui-9 font-bold text-white flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Full-Page Cart Link */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-brand-ink hover:text-brand-primary hover:bg-brand-surface-soft transition"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-brand-primary text-ui-9 font-bold text-white flex items-center justify-center shadow-xs">
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
                    <div className="flex items-center gap-2.5 pt-2 text-ui-11 font-semibold text-brand-ink/70">
                      <Link
                        href="/benefits"
                        onClick={() => setOpenMega(null)}
                        className="hover:text-brand-primary transition-colors"
                      >
                        Natural Benefits
                      </Link>
                      <span>•</span>
                      <Link
                        href="/blog"
                        onClick={() => setOpenMega(null)}
                        className="hover:text-brand-primary transition-colors"
                      >
                        Blog &amp; Rituals
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
                              {/* Edge-to-Edge Image: Flush to top & sides, matching card radius, zero gap */}
                              <div className="relative aspect-square w-full overflow-hidden bg-brand-surface-alt border-b border-brand-border/60 flex items-center justify-center">
                                {productImg ? (
                                  <img
                                    src={productImg}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                      const target = e.currentTarget as HTMLImageElement;
                                      if (!target.src.includes("hm_glory_agarbatti")) {
                                        target.src = "/images/products/hm_glory_agarbatti.jpg";
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-brand-ink/40 text-xs">
                                    <span>🪔</span>
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
                        <span className="text-sm">🌸</span>
                      </div>
                      <div className="leading-tight">
                        <span className="block font-bold text-ui-11 text-brand-ink">Safe for Family</span>
                        <span className="block text-ui-9 text-brand-ink/60">&amp; Kids</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0">
                        <span className="text-sm">🤲</span>
                      </div>
                      <div className="leading-tight">
                        <span className="block font-bold text-ui-11 text-brand-ink">Tradition You</span>
                        <span className="block text-ui-9 text-brand-ink/60">Can Trust</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* ------------------------------------------------------------- */}
                {/* COLUMN 3: FEATURED PROMO BANNER                               */}
                {/* ------------------------------------------------------------- */}
                <div className="col-span-4 relative rounded-3xl bg-gradient-to-b from-[#EFF6E8] via-[#E8F2DF] to-[#DDECD3] p-6 lg:p-7 overflow-hidden border border-[#D1E3C4] flex flex-col justify-between">

                  <div className="relative z-10">
                    <span className="font-space text-ui-10 font-bold tracking-[0.2em] text-[#C27E23] uppercase block mb-1.5">
                      FRAGRANCE FOR A BETTER TOMORROW
                    </span>
                    <h3 className="font-playfair text-xl lg:text-2xl font-bold text-brand-ink leading-tight">
                      Find a fragrance for every ritual
                    </h3>
                    <p className="font-sans text-xs text-brand-ink/75 leading-relaxed mt-1.5 max-w-[270px]">
                      Discover pure temple fragrances, charcoal-free sticks &amp; sacred puja essentials.
                    </p>
                  </div>

                  {/* Dedicated Benefits & Blog Interactive Feature Cards */}
                  <div className="relative z-10 my-3 space-y-2">
                    <Link
                      href="/benefits"
                      onClick={() => setOpenMega(null)}
                      className="group flex items-center gap-3 rounded-2xl bg-white/85 hover:bg-white backdrop-blur-xs border border-white/90 p-2.5 shadow-2xs hover:shadow-md hover:border-brand-green transition-all"
                    >
                      <div className="h-8 w-8 rounded-xl bg-brand-green/15 text-brand-green flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Sparkles size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-playfair font-bold text-xs sm:text-sm text-brand-ink group-hover:text-brand-green transition-colors">
                            Natural Benefits
                          </span>
                          <ArrowRight size={12} className="text-brand-green transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <span className="block text-ui-10 sm:text-ui-11 text-brand-ink/70 line-clamp-1">
                          Therapeutic herbs, charcoal-free &amp; clean burn
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/blog"
                      onClick={() => setOpenMega(null)}
                      className="group flex items-center gap-3 rounded-2xl bg-white/85 hover:bg-white backdrop-blur-xs border border-white/90 p-2.5 shadow-2xs hover:shadow-md hover:border-brand-primary transition-all"
                    >
                      <div className="h-8 w-8 rounded-xl bg-brand-primary/15 text-brand-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <BookOpen size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-playfair font-bold text-xs sm:text-sm text-brand-ink group-hover:text-brand-primary transition-colors">
                            Spiritual Blog &amp; Rituals
                          </span>
                          <ArrowRight size={12} className="text-brand-primary transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <span className="block text-ui-10 sm:text-ui-11 text-brand-ink/70 line-clamp-1">
                          Vedic customs, fragrance guides &amp; puja lore
                        </span>
                      </div>
                    </Link>
                  </div>

                  <div className="relative z-10 pt-1">
                    <Link
                      href="/collections"
                      onClick={() => setOpenMega(null)}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-primary hover:bg-brand-hover text-white px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm transition-transform hover:scale-105 active:scale-95"
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

    </div>
  );
}
