"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  HelpCircle,
  Menu,
  RotateCcw,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
  X,
} from "lucide-react";
import { useStore } from "@/components/store";
import { categories, collectionsList, products } from "@/lib/products";
import { Lotus } from "./illustrations";

type MegaMenu = "shop" | "collections" | null;

export function Navigation() {
  const [openMega, setOpenMega] = useState<MegaMenu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MegaMenu>(null);
  const pathname = usePathname();
  const { totalItems, wishlist, setIsCartOpen, setIsSearchOpen } = useStore();

  useEffect(() => {
    setOpenMega(null);
    setMobileOpen(false);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);
  const navLinkClass = (href: string) =>
    `relative whitespace-nowrap py-2 text-[13px] font-bold tracking-[-.01em] transition-colors ${pathname === href ? "text-[#a90c35]" : "text-[#182b28] hover:text-[#a90c35]"}`;

  const shopMenu = (
    <div className="grid gap-8 p-6 lg:grid-cols-[.8fr_1.4fr_1fr] lg:p-7">
      <div>
        <p className="mb-3 text-[10px] font-extrabold tracking-[.16em] text-[#a90c35]">SHOP BY CATEGORY</p>
        <div className="grid grid-cols-2 gap-x-5 gap-y-1">
          {categories.map((category) => (
            <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} className="rounded-lg px-2 py-2 text-[13px] font-semibold text-[#203732] transition hover:bg-[#f7edda] hover:text-[#a90c35]">
              {category}
            </Link>
          ))}
        </div>
        <Link href="/products" className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#a90c35] hover:gap-3">
          View all products <ArrowRight size={14} />
        </Link>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-extrabold tracking-[.16em] text-[#a90c35]">POPULAR PICKS</p>
          <Sparkles size={15} className="text-[#d28a2e]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featuredProducts.map((product) => (
            <Link key={product.slug} href={`/product/${product.slug}`} className="group flex min-w-0 items-center gap-3 rounded-xl bg-[#fbf5e9] p-2 transition hover:bg-[#f5e9d2]">
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-white">
                {product.image ? <img src={product.image} alt="" className="h-full w-full object-contain p-1" /> : <Lotus className="h-10 w-10" />}
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-xs font-bold leading-snug text-[#1c332d] group-hover:text-[#a90c35]">{product.name}</p>
                <p className="mt-1 text-xs font-extrabold text-[#a90c35]">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-[#e1edcf] p-5">
        <div className="relative z-10 max-w-[190px]">
          <span className="text-[10px] font-extrabold tracking-[.14em] text-[#36764c]">A CALMER EVERYDAY</span>
          <h3 className="mt-2 text-xl font-extrabold leading-tight text-[#183b31]">Find a fragrance for every ritual.</h3>
          <Link href="/collections" className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#a90c35]">Explore collections <ArrowRight size={14} /></Link>
        </div>
        <Lotus className="absolute -bottom-4 -right-7 h-28 w-36 opacity-70" />
      </div>
    </div>
  );

  const collectionsMenu = (
    <div className="grid gap-8 p-6 lg:grid-cols-[1.4fr_.8fr] lg:p-7">
      <div>
        <p className="mb-3 text-[10px] font-extrabold tracking-[.16em] text-[#a90c35]">CURATED COLLECTIONS</p>
        <div className="grid grid-cols-2 gap-3">
          {collectionsList.map((collection) => (
            <Link key={collection.id} href={`/collections#${collection.id}`} className="group rounded-xl bg-[#fbf5e9] p-4 transition hover:bg-[#f5e9d2]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#528159]">{collection.subtitle}</span>
              <span className="mt-1 block text-sm font-extrabold leading-tight text-[#203732] group-hover:text-[#a90c35]">{collection.title}</span>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#a90c35]">Explore <ArrowRight size={12} /></span>
            </Link>
          ))}
        </div>
      </div>
      <div className="grid content-start gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <p className="mb-1 text-[10px] font-extrabold tracking-[.16em] text-[#a90c35] sm:col-span-2 lg:col-span-1">DISCOVER HM</p>
        <Link href="/about" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#203732] hover:bg-[#f7edda]">Our story</Link>
        <Link href="/about#benefits" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#203732] hover:bg-[#f7edda]">Natural benefits</Link>
        <Link href="/offers" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#203732] hover:bg-[#f7edda]">Special offers</Link>
        <Link href="/festivals" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#203732] hover:bg-[#f7edda]">Festival guide</Link>
        <Link href="/contact" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#203732] hover:bg-[#f7edda]">Contact & enquiries</Link>
      </div>
    </div>
  );

  return (
    <div className="relative z-50 font-sans">
      <div className="bg-[#870b2b] px-2 py-1.5 text-[9px] font-semibold text-white sm:px-4 sm:text-[10px]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <span className="truncate font-bold"><span className="mr-1 text-[#ffd34e]">◆</span><span className="hidden min-[300px]:inline">Free Shipping on Orders Above </span><span className="min-[300px]:hidden">Free shipping </span>₹499</span>
            <span className="hidden items-center gap-1.5 whitespace-nowrap text-white/90 sm:flex"><span className="text-[#ffd34e]">◆</span>100% Natural Ingredients</span>
            <span className="hidden items-center gap-1.5 whitespace-nowrap text-white/90 md:flex"><RotateCcw size={12} />Easy Returns</span>
          </div>
          <div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-white/90 sm:gap-3">
            <Link href="/orders" className="inline-flex items-center gap-1 hover:text-[#ffd34e]"><Truck size={12} />Track Order</Link>
            <span className="hidden text-white/40 sm:inline">|</span>
            <Link href="/contact" className="hidden items-center gap-1 hover:text-[#ffd34e] sm:inline-flex"><HelpCircle size={12} />Help & Contact</Link>
          </div>
        </div>
      </div>

      <header
        className="sticky top-0 z-40 border-b border-[#eadfc9] bg-[#fffaf1] shadow-[0_2px_8px_rgba(70,42,20,.04)]"
        onKeyDown={(event) => { if (event.key === "Escape") { setOpenMega(null); setMobileOpen(false); setMobileSection(null); } }}
        onMouseLeave={() => setOpenMega(null)}
      >
        <div className="mx-auto flex h-[56px] max-w-[1600px] items-center justify-between gap-1 px-2 sm:h-[64px] sm:gap-3 sm:px-6">
          <Link href="/" className="flex min-w-0 shrink items-center gap-2 sm:gap-3" aria-label="HM Brand home">
            <div className="relative h-9 w-9 sm:h-11 sm:w-11 shrink-0">
              <Image
                src="/images/brand_logo_icon_transparent.png"
                alt="HM Brand mascot logo"
                fill
                unoptimized
                sizes="(max-width: 640px) 36px, 44px"
                className="object-contain drop-shadow-xs"
                priority
              />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="block whitespace-nowrap text-[13px] font-extrabold tracking-[-.02em] text-[#183c31] sm:text-[18px]">
                HM <span className="text-[#a90c35]">BRAND</span>
              </span>
              <span className="mt-0.5 hidden font-script text-[11px] leading-none text-[#a90c35] min-[360px]:block sm:text-[12px]">
                Discover the Divine Within
              </span>
            </div>
          </Link>

          <nav className="hidden h-full items-center gap-3 min-[1440px]:flex 2xl:gap-5" aria-label="Main navigation">
            <Link href="/" className={navLinkClass("/")}>Home</Link>
            <button type="button" aria-expanded={openMega === "shop"} onMouseEnter={() => setOpenMega("shop")} onFocus={() => setOpenMega("shop")} onClick={() => setOpenMega(openMega === "shop" ? null : "shop")} className={`${navLinkClass("/shop")} inline-flex items-center gap-1`}>
              Shop <ChevronDown size={13} className={`transition-transform ${openMega === "shop" ? "rotate-180" : ""}`} />
            </button>
            <button type="button" aria-expanded={openMega === "collections"} onMouseEnter={() => setOpenMega("collections")} onFocus={() => setOpenMega("collections")} onClick={() => setOpenMega(openMega === "collections" ? null : "collections")} className={`${navLinkClass("/collections")} inline-flex items-center gap-1`}>
              Collections <ChevronDown size={13} className={`transition-transform ${openMega === "collections" ? "rotate-180" : ""}`} />
            </button>
            <Link href="/about" className={navLinkClass("/about")}>Our Story</Link>
            <Link href="/about#benefits" className={navLinkClass("/about#benefits")}>Benefits</Link>
            <Link href="/blog" className={navLinkClass("/blog")}>Blog</Link>
            <Link href="/offers" className={navLinkClass("/offers")}>Offers</Link>
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 min-[360px]:gap-1 sm:gap-2 lg:gap-3">
            <button type="button" onClick={() => setIsSearchOpen(true)} aria-label="Search products" className="hidden h-[38px] w-[220px] items-center gap-2 rounded-full border border-[#f1c6a7] bg-white px-4 text-left text-xs text-[#68726e] transition hover:border-[#a90c35] lg:flex 2xl:w-[280px]">
              <Search size={15} className="shrink-0 text-[#a90c35]" />
              <span className="truncate">Search agarbattis, camphor, pooja essentials...</span>
            </button>
            <button type="button" onClick={() => setIsSearchOpen(true)} aria-label="Search" className="hidden h-8 w-8 shrink-0 place-items-center rounded-full text-[#173b3a] hover:bg-[#f7edda] min-[300px]:grid sm:h-9 sm:w-9 lg:hidden"><Search size={18} /></button>
            <Link href="/account" aria-label="Account" className="hidden h-9 w-9 shrink-0 place-items-center rounded-full text-[#173b3a] hover:bg-[#f7edda] min-[1440px]:grid"><User size={19} strokeWidth={1.8} /></Link>
            <Link href="/wishlist" aria-label="Wishlist" className="relative hidden h-9 w-9 shrink-0 place-items-center rounded-full text-[#173b3a] hover:bg-[#f7edda] min-[1440px]:grid"><Heart size={20} strokeWidth={1.8} />{wishlist.length > 0 && <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#a90c35] px-1 text-[9px] font-bold text-white">{wishlist.length}</span>}</Link>
            <button type="button" onClick={() => setIsCartOpen(true)} aria-label="Shopping bag" className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#173b3a] hover:bg-[#f7edda] sm:h-9 sm:w-9"><ShoppingBag size={19} strokeWidth={1.8} /><span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#f47a20] px-1 text-[9px] font-bold text-white">{totalItems}</span></button>
            
            {/* Hamburger Button with animated icon state */}
            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => { setMobileOpen(!mobileOpen); setOpenMega(null); }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#eadfc9] bg-[#f8f1e3] text-[#173b3a] shadow-xs transition hover:bg-[#a90c35] hover:text-white min-[1440px]:hidden active:scale-95"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {openMega && (
          <div className="absolute inset-x-0 top-full z-50 border-t border-[#eadfc9] bg-[#fffdf8] shadow-[0_18px_36px_rgba(52,34,17,.16)]" onMouseEnter={() => setOpenMega(openMega)}>
            <div className="mx-auto max-w-[1368px]">{openMega === "shop" ? shopMenu : collectionsMenu}</div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* PROFESSIONAL OFF-CANVAS SLIDE-IN MOBILE NAVIGATION DRAWER */}
      {/* ========================================================================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] min-[1440px]:hidden">
          {/* 1. Backdrop Overlay with Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => { setMobileOpen(false); setMobileSection(null); }}
            aria-hidden="true"
          />

          {/* 2. Off-Canvas Slide Drawer */}
          <aside
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className="fixed inset-y-0 right-0 z-10 flex h-full w-full max-w-[340px] min-[400px]:max-w-[380px] flex-col border-l-2 border-[#F6C84C]/50 bg-gradient-to-b from-[#FFFDF8] via-[#FFF8E7] to-[#FFF4D6] shadow-2xl transition-transform duration-300 ease-in-out animate-in slide-in-from-right"
          >
            {/* Drawer Top Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#eadfc9] bg-[#FFF8E7] px-5 shadow-xs">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    src="/images/brand_logo_icon_transparent.png"
                    alt="HM Brand mascot logo"
                    fill
                    unoptimized
                    sizes="40px"
                    className="object-contain drop-shadow-xs"
                  />
                </div>
                <div className="flex flex-col justify-center leading-none">
                  <span className="font-heading text-sm font-extrabold tracking-tight text-[#183c31]">
                    HM <span className="text-[#9E1830]">BRAND</span>
                  </span>
                  <span className="font-script text-[11px] text-[#9E1830] font-normal leading-none mt-0.5">
                    Discover the Divine Within
                  </span>
                </div>
              </Link>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => { setMobileOpen(false); setMobileSection(null); }}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfc9] bg-white text-[#173B3A] shadow-xs transition hover:bg-[#9E1830] hover:text-white active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Actions Strip (Account • Wishlist • Search) */}
            <div className="grid grid-cols-2 gap-2 border-b border-[#eadfc9] bg-white/60 p-3 backdrop-blur-xs">
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#eadfc9] bg-white px-3 text-xs font-bold text-[#183c31] shadow-xs transition hover:border-[#9E1830] hover:text-[#9E1830]"
              >
                <User size={15} className="text-[#9E1830]" />
                <span>My Account</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="relative flex h-10 items-center justify-center gap-2 rounded-xl border border-[#eadfc9] bg-white px-3 text-xs font-bold text-[#183c31] shadow-xs transition hover:border-[#9E1830] hover:text-[#9E1830]"
              >
                <Heart size={15} className="text-[#9E1830]" />
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[#9E1830] px-1 text-[9px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => { setIsSearchOpen(true); setMobileOpen(false); }}
                className="col-span-2 flex h-10 items-center justify-center gap-2 rounded-xl border border-[#F6C84C]/80 bg-[#FFF8E7] px-3 text-xs font-extrabold text-[#9E1830] shadow-xs transition hover:bg-[#9E1830] hover:text-white"
              >
                <Search size={15} />
                <span>Search Products &amp; Fragrances</span>
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 hide-scrollbar">
              
              {/* Home */}
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs sm:text-sm font-bold transition ${pathname === "/" ? "bg-[#9E1830] text-white shadow-xs" : "text-[#183c31] hover:bg-white/80"}`}
              >
                <span>Home</span>
                <span className="text-[10px] opacity-70">➔</span>
              </Link>

              {/* Shop Accordion */}
              <div className="rounded-xl border border-[#eadfc9] bg-white/70 overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setMobileSection(mobileSection === "shop" ? null : "shop")}
                  aria-expanded={mobileSection === "shop"}
                  className="flex w-full items-center justify-between px-4 py-3 text-xs sm:text-sm font-extrabold text-[#183c31] hover:text-[#9E1830]"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#F47A20]" />
                    <span>Shop by Category</span>
                  </span>
                  <ChevronDown size={16} className={`transition-transform duration-200 text-[#9E1830] ${mobileSection === "shop" ? "rotate-180" : ""}`} />
                </button>

                {mobileSection === "shop" && (
                  <div className="border-t border-[#eadfc9] bg-[#FFF8E7]/90 p-2 space-y-1 animate-in fade-in">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        href={`/shop?category=${encodeURIComponent(category)}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-[#183c31] hover:bg-[#9E1830] hover:text-white transition"
                      >
                        <span>{category}</span>
                        <span className="text-[10px] text-[#9E1830] group-hover:text-white">✦</span>
                      </Link>
                    ))}
                    <Link
                      href="/products"
                      onClick={() => setMobileOpen(false)}
                      className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#9E1830] p-2 text-xs font-extrabold text-white transition hover:bg-[#F47A20]"
                    >
                      <span>Explore All Products</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Collections Accordion */}
              <div className="rounded-xl border border-[#eadfc9] bg-white/70 overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setMobileSection(mobileSection === "collections" ? null : "collections")}
                  aria-expanded={mobileSection === "collections"}
                  className="flex w-full items-center justify-between px-4 py-3 text-xs sm:text-sm font-extrabold text-[#183c31] hover:text-[#9E1830]"
                >
                  <span className="flex items-center gap-2">
                    <Lotus className="h-4 w-4 text-[#9E1830]" />
                    <span>Curated Collections</span>
                  </span>
                  <ChevronDown size={16} className={`transition-transform duration-200 text-[#9E1830] ${mobileSection === "collections" ? "rotate-180" : ""}`} />
                </button>

                {mobileSection === "collections" && (
                  <div className="border-t border-[#eadfc9] bg-[#FFF8E7]/90 p-2 space-y-1 animate-in fade-in">
                    {collectionsList.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections#${col.id}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex flex-col rounded-lg px-3 py-2 text-xs font-semibold text-[#183c31] hover:bg-white transition"
                      >
                        <span className="text-[10px] font-bold text-[#3F7D45] uppercase">{col.subtitle}</span>
                        <span className="font-extrabold text-[#183c31]">{col.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Navigation Links */}
              <Link
                href="/our-story"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#183c31] hover:bg-white/80 transition"
              >
                <span>✦ Our Story &amp; Heritage</span>
              </Link>
              <Link
                href="/about#benefits"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#183c31] hover:bg-white/80 transition"
              >
                <span>🌿 Natural Benefits</span>
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#183c31] hover:bg-white/80 transition"
              >
                <span>📜 Blog &amp; Rituals</span>
              </Link>
              <Link
                href="/offers"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#9E1830] bg-[#9E1830]/10 border border-[#9E1830]/20 hover:bg-[#9E1830] hover:text-white transition"
              >
                <span>🎁 Special Offers</span>
                <span className="rounded-full bg-[#9E1830] px-2 py-0.5 text-[9px] font-extrabold text-white">HOT</span>
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#183c31] hover:bg-white/80 transition"
              >
                <span className="flex items-center gap-2">
                  <Truck size={14} className="text-[#3F7D45]" />
                  <span>Track Order</span>
                </span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-[#183c31] hover:bg-white/80 transition"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle size={14} className="text-[#F47A20]" />
                  <span>Help &amp; Contact</span>
                </span>
              </Link>
            </div>

            {/* Drawer Bottom Footer (Trust & Purity) */}
            <div className="border-t border-[#eadfc9] bg-[#FFF4D6] p-4 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-[#183c31]/80">
                <span>100% Charcoal-Free</span>
                <span>•</span>
                <span>Pure Botanical</span>
                <span>•</span>
                <span>Coimbatore</span>
              </div>
              <p className="font-script text-xs text-[#9E1830]">
                Find Your God Within
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
