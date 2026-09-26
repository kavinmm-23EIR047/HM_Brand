"use client";

import React, { useEffect, useState } from "react";
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
          <Link href="/" className="flex min-w-0 shrink items-center gap-1.5 sm:gap-2.5" aria-label="HM Agarbattis home">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#f5c84c] bg-[#fff4d6] sm:h-12 sm:w-12">
              <Lotus className="h-6 w-7 sm:h-9 sm:w-10" />
            </span>
            <span className="block min-w-0 leading-none">
              <span className="block whitespace-nowrap text-[11px] font-extrabold tracking-[-.045em] text-[#183c31] min-[300px]:text-[12px] min-[360px]:text-[14px] sm:text-[19px]">HM <span className="text-[#a90c35]">AGARBATTIS</span></span>
              <span className="mt-1 hidden font-script text-[11px] leading-none text-[#a90c35] min-[360px]:block">Find Your God Within</span>
            </span>
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
            <button type="button" aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => { setMobileOpen(!mobileOpen); setOpenMega(null); }} aria-label={mobileOpen ? "Close menu" : "Open menu"} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#173b3a] transition hover:bg-[#f7edda] sm:h-9 sm:w-9 min-[1440px]:hidden">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>

        {openMega && (
          <div className="absolute inset-x-0 top-full z-50 border-t border-[#eadfc9] bg-[#fffdf8] shadow-[0_18px_36px_rgba(52,34,17,.16)]" onMouseEnter={() => setOpenMega(openMega)}>
            <div className="mx-auto max-w-[1368px]">{openMega === "shop" ? shopMenu : collectionsMenu}</div>
          </div>
        )}

        {mobileOpen && (
          <>
          <button type="button" aria-label="Close navigation menu" onClick={() => { setMobileOpen(false); setMobileSection(null); }} className="fixed inset-x-0 bottom-0 top-[56px] z-30 bg-[#173b3a]/20 min-[1440px]:hidden" />
          <div id="mobile-navigation" className="absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-88px)] overflow-y-auto border-t border-[#eadfc9] bg-[#fffaf1] px-3 py-3 shadow-xl min-[1440px]:hidden sm:px-5 sm:py-4">
            <nav className="mx-auto flex max-w-2xl flex-col text-[13px] font-bold text-[#183c31] sm:text-sm" aria-label="Mobile navigation">
              <div className="grid grid-cols-2 gap-2 border-b border-[#eadfc9] pb-3">
                <Link href="/account" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#f4edda] px-3 text-xs font-bold"><User size={15} />Account</Link>
                <Link href="/wishlist" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#f4edda] px-3 text-xs font-bold"><Heart size={15} />Wishlist{wishlist.length > 0 ? ` (${wishlist.length})` : ""}</Link>
                <button type="button" onClick={() => { setIsSearchOpen(true); setMobileOpen(false); }} className="col-span-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#a90c35] px-3 text-xs font-bold text-white min-[300px]:hidden"><Search size={15} />Search products</button>
              </div>
              <Link href="/" className="border-b border-[#eadfc9] py-3">Home</Link>
              <button type="button" aria-expanded={mobileSection === "shop"} onClick={() => setMobileSection(mobileSection === "shop" ? null : "shop")} className="flex min-h-11 items-center justify-between border-b border-[#eadfc9] py-2">Shop <ChevronDown size={16} className={`transition-transform ${mobileSection === "shop" ? "rotate-180" : ""}`} /></button>
              {mobileSection === "shop" && <div className="grid grid-cols-2 gap-1 bg-white/70 p-2">{categories.map((category) => <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} className="rounded px-2 py-2 text-xs font-semibold">{category}</Link>)}<Link href="/products" className="col-span-2 rounded px-2 py-2 text-xs font-extrabold text-[#a90c35]">All products →</Link></div>}
              <button type="button" aria-expanded={mobileSection === "collections"} onClick={() => setMobileSection(mobileSection === "collections" ? null : "collections")} className="flex min-h-11 items-center justify-between border-b border-[#eadfc9] py-2">Collections <ChevronDown size={16} className={`transition-transform ${mobileSection === "collections" ? "rotate-180" : ""}`} /></button>
              {mobileSection === "collections" && <div className="grid gap-1 bg-white/70 p-2">{collectionsList.map((collection) => <Link key={collection.id} href={`/collections#${collection.id}`} className="rounded px-2 py-2 text-xs font-semibold">{collection.title}</Link>)}</div>}
              <Link href="/about" className="border-b border-[#eadfc9] py-3">Our Story</Link>
              <Link href="/about#benefits" className="border-b border-[#eadfc9] py-3">Benefits</Link>
              <Link href="/blog" className="border-b border-[#eadfc9] py-3">Blog</Link>
              <Link href="/offers" className="border-b border-[#eadfc9] py-3">Offers</Link>
              <Link href="/contact" className="border-b border-[#eadfc9] py-3">Contact & Enquiries</Link>
              <Link href="/orders" className="py-3">Track Order</Link>
            </nav>
          </div>
          </>
        )}
      </header>
    </div>
  );
}
