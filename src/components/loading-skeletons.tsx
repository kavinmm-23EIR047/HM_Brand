import React from "react";

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer animate-pulse rounded-xl bg-[#EAE1D3]/50 ${className}`}
    />
  );
}

export function SkeletonHeader() {
  return (
    <header className="w-full select-none" aria-hidden="true">
      {/* 1. Top Announcement Bar: Royal Crimson */}
      <div className="min-h-[48px] sm:min-h-[52px] w-full bg-gradient-to-r from-[#9E1830] via-[#851327] to-[#9E1830] flex items-center justify-between px-4 sm:px-8">
        <SkeletonBlock className="h-6 w-36 sm:w-44 rounded-full bg-white/20" />
        <SkeletonBlock className="hidden md:block h-4 w-72 rounded-full bg-white/15" />
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-4 w-24 sm:w-28 rounded-full bg-white/20" />
        </div>
      </div>

      {/* 2. Main Navbar */}
      <div className="border-b border-[#EAE1D3] bg-[#FFFDF8]">
        <div className="mx-auto flex h-[68px] sm:h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-brand-primary/20 shrink-0" />
            <div className="space-y-1">
              <SkeletonBlock className="h-4 w-28 sm:w-36 rounded-md" />
              <SkeletonBlock className="h-2.5 w-20 sm:w-24 rounded-md" />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            <SkeletonBlock className="h-4 w-14 rounded-md" />
            <SkeletonBlock className="h-4 w-14 rounded-md" />
            <SkeletonBlock className="h-4 w-16 rounded-md" />
            <SkeletonBlock className="h-4 w-16 rounded-md" />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <SkeletonBlock className="h-9 w-9 sm:h-10 sm:w-10 rounded-full" />
            <SkeletonBlock className="h-9 w-9 sm:h-10 sm:w-10 rounded-full" />
            <SkeletonBlock className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-brand-primary/20" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function SkeletonFooter() {
  return (
    <footer className="w-full border-t border-[#EAE1D3] bg-gradient-to-b from-[#9E1830] via-[#851327] to-[#6E0F1E] text-white pt-8 pb-12 select-none" aria-hidden="true">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/15">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-10 w-10 rounded-full bg-white/20" />
            <SkeletonBlock className="h-5 w-40 rounded-md bg-white/20" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-8 w-24 rounded-full bg-white/15" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <SkeletonBlock className="h-4 w-28 rounded-md bg-white/25" />
              {Array.from({ length: 4 }).map((_, j) => (
                <SkeletonBlock key={j} className="h-3 w-36 max-w-full rounded-md bg-white/15" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

/**
 * Authentic Original HM Brand Product Card Skeleton
 * Accurately mirrors ProductCard.tsx (1:1 square image, floating badge, wishlist circle, rating, name, note, price & Add button)
 */
export function SkeletonProductCard() {
  return (
    <article className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#EAE1D3] bg-white shadow-2xs select-none">
      {/* 1. Top Image: 1:1 Aspect Ratio Full-Bleed with Sandalwood Cream background */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-t-2xl border-b border-[#EAE1D3]/80 bg-[#F5EFE3]/50">
        <SkeletonBlock className="h-full w-full rounded-none bg-transparent" />

        {/* Floating Badge (e.g. 12-BOX BUNDLE / FEATURED) */}
        <div className="absolute left-2.5 top-2.5 z-10 sm:left-3 sm:top-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 shadow-2xs border border-[#EAE1D3]">
            <SkeletonBlock className="h-1.5 w-1.5 rounded-full bg-brand-primary/40 shrink-0" />
            <SkeletonBlock className="h-2.5 w-14 rounded-full" />
          </div>
        </div>

        {/* Floating Wishlist Button */}
        <div className="absolute right-2.5 top-2.5 z-10 sm:right-3 sm:top-3">
          <SkeletonBlock className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/95 shadow-2xs border border-[#EAE1D3]" />
        </div>
      </div>

      {/* 2. Product Information Body */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          {/* Rating / Pure Sacred Purity badge */}
          <div className="flex items-center gap-1.5 mb-2">
            <SkeletonBlock className="h-3.5 w-24 rounded-full" />
          </div>

          {/* Product Name Title */}
          <SkeletonBlock className="h-4.5 w-4/5 rounded-md" />

          {/* Subtitle / Note */}
          <SkeletonBlock className="mt-2 h-3 w-full rounded-md" />
          <SkeletonBlock className="mt-1.5 h-3 w-2/3 rounded-md" />
        </div>

        {/* 3. Price & Add to Cart Action Row */}
        <div className="mt-3.5 flex min-w-0 items-center justify-between gap-2 pt-2.5 border-t border-[#EAE1D3]">
          <div className="min-w-0 space-y-1">
            <SkeletonBlock className="h-5 sm:h-6 w-16 rounded-md" />
          </div>

          {/* Add to Cart Button (matches real Add button rounded-[10px]) */}
          <SkeletonBlock className="h-8 sm:h-9 w-20 rounded-[10px] bg-brand-primary/20" />
        </div>
      </div>
    </article>
  );
}

export function HomePageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading home page" className="space-y-6 sm:space-y-10 select-none">
      {/* 1. Hero Banner Slider */}
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <SkeletonBlock className="aspect-[16/8] w-full rounded-2xl sm:aspect-[16/5] sm:rounded-3xl border border-[#EAE1D3]" />
      </div>

      {/* 2. Explore Sacred Categories Strip (9 Circles) */}
      <section className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <SkeletonBlock className="mx-auto mb-5 h-4 w-48 rounded" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-9">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-2">
              <SkeletonBlock className="h-14 w-14 rounded-full sm:h-18 sm:w-18 bg-brand-primary/15 border-2 border-[#C89B3C]/30" />
              <SkeletonBlock className="h-3 w-16 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Bestsellers Showcase (Grid with Original Product Cards) */}
      <section className="bg-brand-surface-alt px-3 py-8 sm:px-6 sm:py-12 border-y border-[#EAE1D3]">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-2">
              <SkeletonBlock className="h-3.5 w-32 rounded bg-brand-primary/20" />
              <SkeletonBlock className="h-7 sm:h-8 w-64 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="h-9 w-24 rounded-full" />
              <SkeletonBlock className="h-9 w-24 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bento Promos & Brand Story */}
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-3 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#EAE1D3] bg-white p-5 space-y-3">
            <SkeletonBlock className="h-36 w-full rounded-xl" />
            <SkeletonBlock className="h-5 w-3/4 rounded" />
            <SkeletonBlock className="h-3 w-full rounded" />
          </div>
        ))}
      </section>
    </div>
  );
}

export function HomeRouteLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]" aria-busy="true">
      <SkeletonHeader />
      <HomePageSkeleton />
      <SkeletonFooter />
    </div>
  );
}

export function ShopPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]" aria-busy="true" aria-label="Loading shop page">
      <SkeletonHeader />
      <ShopPageContentSkeleton />
      <SkeletonFooter />
    </div>
  );
}

export function ShopPageContentSkeleton() {
  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8 select-none">
      {/* 1. Breadcrumb & Editorial Header */}
      <div className="space-y-2">
        <SkeletonBlock className="h-3.5 w-36 rounded" />
        <div className="rounded-2xl border border-[#EAE1D3] bg-[#F5EFE3]/70 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-3.5 w-24 rounded-full bg-brand-primary/20" />
            <SkeletonBlock className="h-7 sm:h-8 w-48 rounded-lg" />
            <SkeletonBlock className="h-4 w-72 max-w-full rounded" />
          </div>
          <SkeletonBlock className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-brand-primary/10 shrink-0" />
        </div>
      </div>

      {/* 2. Shop by Category (Horizontal Chips with Circular Thumbnails) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-4 w-36 rounded" />
            <SkeletonBlock className="h-4 w-6 rounded-full" />
          </div>
          <div className="flex gap-1">
            <SkeletonBlock className="h-7 w-7 rounded-full" />
            <SkeletonBlock className="h-7 w-7 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[10px] border border-[#EAE1D3] bg-white px-3 shadow-2xs">
              <SkeletonBlock className="h-6 w-6 rounded-full" />
              <SkeletonBlock className="h-3.5 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Main Catalog: Left Fixed-Width Sidebar + Right Product Grid */}
      <div className="grid items-start gap-6 lg:grid-cols-[285px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)]">
        {/* Left Sidebar Filter Skeleton */}
        <aside className="hidden lg:block space-y-4 rounded-2xl border border-[#EAE1D3] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE1D3]">
            <SkeletonBlock className="h-5 w-24 rounded" />
            <SkeletonBlock className="h-3.5 w-12 rounded" />
          </div>
          {/* Categories */}
          <div className="space-y-3 pt-1">
            <SkeletonBlock className="h-4 w-28 rounded" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SkeletonBlock className="h-4 w-4 rounded" />
                  <SkeletonBlock className="h-3.5 w-28 rounded" />
                </div>
                <SkeletonBlock className="h-4 w-6 rounded-full" />
              </div>
            ))}
          </div>
          {/* Price Range */}
          <div className="space-y-3 pt-3 border-t border-[#EAE1D3]">
            <SkeletonBlock className="h-4 w-24 rounded" />
            <SkeletonBlock className="h-2 w-full rounded-full" />
            <div className="grid grid-cols-2 gap-2">
              <SkeletonBlock className="h-8 rounded-lg" />
              <SkeletonBlock className="h-8 rounded-lg" />
              <SkeletonBlock className="h-8 rounded-lg" />
              <SkeletonBlock className="h-8 rounded-lg" />
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="space-y-4">
          {/* Sorting / Results bar */}
          <div className="flex items-center justify-between rounded-xl border border-[#EAE1D3] bg-white px-4 py-2.5 shadow-2xs">
            <SkeletonBlock className="h-4 w-32 rounded" />
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-8 w-36 rounded-lg" />
              <SkeletonBlock className="h-8 w-8 rounded-lg" />
            </div>
          </div>

          {/* 8 Product Cards using the Original Product Skeleton */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 pt-6">
            <SkeletonBlock className="h-9 w-9 rounded-lg" />
            <SkeletonBlock className="h-9 w-9 rounded-lg bg-brand-primary/20" />
            <SkeletonBlock className="h-9 w-9 rounded-lg" />
            <SkeletonBlock className="h-9 w-9 rounded-lg" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]" aria-busy="true" aria-label="Loading product details">
      <SkeletonHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-5 sm:px-6 lg:px-8 select-none">
        {/* Breadcrumb */}
        <SkeletonBlock className="h-3.5 w-48 rounded" />

        {/* Product Hero: 12-col Grid */}
        <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left: Gallery (5 cols) */}
          <div className="space-y-3 lg:col-span-5">
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-[#EAE1D3] bg-[#F5EFE3]/50">
              <SkeletonBlock className="aspect-square w-full rounded-none" />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBlock key={i} className="aspect-square rounded-xl border border-[#EAE1D3]" />
              ))}
            </div>
            {/* 4 Feature Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl border border-[#EAE1D3] bg-white p-2.5">
                  <SkeletonBlock className="h-7 w-7 rounded-lg" />
                  <SkeletonBlock className="h-3 flex-1 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info Card (7 cols) */}
          <div className="rounded-2xl sm:rounded-3xl border border-[#EAE1D3] bg-white p-4 sm:p-7 lg:p-8 shadow-2xs space-y-5 lg:col-span-7">
            {/* Category badge & Rating */}
            <div className="flex items-center justify-between pb-3 border-b border-[#FAF6EE]">
              <SkeletonBlock className="h-6 w-36 rounded-full bg-brand-primary/15" />
              <SkeletonBlock className="h-4 w-28 rounded" />
            </div>

            {/* Title & Tagline & Description */}
            <div className="space-y-2">
              <SkeletonBlock className="h-8 sm:h-9 w-4/5 rounded-lg" />
              <SkeletonBlock className="h-4 w-48 rounded italic" />
              <div className="space-y-1.5 pt-2">
                <SkeletonBlock className="h-3.5 w-full rounded" />
                <SkeletonBlock className="h-3.5 w-full rounded" />
                <SkeletonBlock className="h-3.5 w-3/4 rounded" />
              </div>
            </div>

            {/* 3 Specs Tiles */}
            <div className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-2.5 sm:gap-3.5 pt-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-[#EAE1D3] bg-brand-surface-warm/40 p-3 space-y-1.5">
                  <SkeletonBlock className="h-3 w-16 rounded" />
                  <SkeletonBlock className="h-4 w-24 rounded" />
                </div>
              ))}
            </div>

            {/* Add to Cart Panel */}
            <div className="rounded-2xl border border-[#EAE1D3] bg-[#FFFDF8] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <SkeletonBlock className="h-3 w-14 rounded" />
                  <SkeletonBlock className="h-7 w-24 rounded-lg" />
                </div>
                <SkeletonBlock className="h-10 w-28 rounded-xl" />
              </div>
              <div className="flex gap-2.5 pt-1">
                <SkeletonBlock className="h-12 flex-1 rounded-[10px] bg-brand-primary/20" />
                <SkeletonBlock className="h-12 w-12 rounded-[10px]" />
              </div>
            </div>

            {/* Micro Trust Row */}
            <div className="flex items-center justify-between pt-2 border-t border-[#EAE1D3]">
              <SkeletonBlock className="h-3 w-28 rounded" />
              <SkeletonBlock className="h-3 w-32 rounded" />
              <SkeletonBlock className="h-3 w-28 rounded" />
            </div>
          </div>
        </div>

        {/* Dual Cards: Sacred Botanical Benefits & Natural Care */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 pt-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-2xl sm:rounded-3xl border border-[#EAE1D3] bg-white p-5 sm:p-7 shadow-2xs space-y-4">
              <div className="space-y-1 pb-3 border-b border-[#EAE1D3]">
                <SkeletonBlock className="h-3 w-28 rounded" />
                <SkeletonBlock className="h-6 w-56 rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="p-3 rounded-xl bg-brand-surface-warm/30 border border-[#EAE1D3] space-y-2">
                    <SkeletonBlock className="h-9 w-9 rounded-xl" />
                    <SkeletonBlock className="h-3.5 w-4/5 rounded" />
                    <SkeletonBlock className="h-2.5 w-full rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Related Products Slider Skeleton */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SkeletonBlock className="h-3 w-24 rounded" />
              <SkeletonBlock className="h-6 w-48 rounded" />
            </div>
            <div className="flex gap-1.5">
              <SkeletonBlock className="h-8 w-8 rounded-full" />
              <SkeletonBlock className="h-8 w-8 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>
        </div>
      </main>
      <SkeletonFooter />
    </div>
  );
}

export function WishlistPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]" aria-busy="true" aria-label="Loading wishlist">
      <SkeletonHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 select-none">
        <div className="space-y-2">
          <SkeletonBlock className="h-3.5 w-32 rounded bg-brand-primary/20" />
          <SkeletonBlock className="h-8 w-44 rounded-lg" />
          <SkeletonBlock className="h-4 w-72 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      </main>
      <SkeletonFooter />
    </div>
  );
}

/**
 * High-End CRM Console Skeleton for Admin
 * Complete with dark teal sidebar, KPI cards, module tab switcher, filters, table data rows with thumbnails, and pagination
 */
export function AdminPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F4F6F9] select-none" aria-busy="true" aria-label="Loading admin console">
      <div className="grid min-h-screen lg:grid-cols-[252px_minmax(0,1fr)] xl:grid-cols-[264px_minmax(0,1fr)]">
        {/* Left Admin Sidebar Skeleton */}
        <aside className="hidden space-y-6 bg-[#122629] p-5 lg:block border-r border-[#1F3A3E]">
          {/* Logo badge */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <SkeletonBlock className="h-10 w-10 rounded-xl bg-[#F3C967]/30" />
            <div className="space-y-1.5 flex-1">
              <SkeletonBlock className="h-3 w-20 rounded bg-white/30" />
              <SkeletonBlock className="h-3.5 w-32 rounded bg-white/20" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-16 rounded bg-white/20 mb-3" />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5">
                <SkeletonBlock className="h-5 w-5 rounded bg-white/20 shrink-0" />
                <SkeletonBlock className="h-3.5 flex-1 rounded bg-white/15" />
              </div>
            ))}
          </div>

          {/* Bottom user card */}
          <div className="pt-8 space-y-2 border-t border-white/10">
            <SkeletonBlock className="h-10 w-full rounded-xl bg-white/10" />
          </div>
        </aside>

        {/* Content Area */}
        <AdminPageContentSkeleton />
      </div>
    </div>
  );
}

export function AdminPageContentSkeleton() {
  return (
    <main className="mx-auto w-full max-w-[1640px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 select-none" aria-busy="true" aria-label="Loading CRM module">
      {/* 1. Header Bar: Welcome & Quick Actions */}
      <div className="rounded-xl border border-[#DCE2EA] bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <SkeletonBlock className="h-6 sm:h-7 w-60 rounded-lg" />
            <SkeletonBlock className="h-3.5 w-80 max-w-full rounded" />
          </div>
          <div className="flex items-center gap-2.5">
            <SkeletonBlock className="h-9 w-32 rounded-lg" />
            <SkeletonBlock className="h-9 w-28 rounded-lg bg-[#9E1830]/20" />
          </div>
        </div>
      </div>

      {/* 2. Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#DCE2EA] bg-white p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-3.5 w-20 rounded" />
              <SkeletonBlock className="h-8 w-8 rounded-lg bg-brand-surface-warm" />
            </div>
            <SkeletonBlock className="h-7 w-28 rounded-lg" />
            <div className="flex items-center gap-2 pt-1">
              <SkeletonBlock className="h-3 w-12 rounded-full bg-emerald-100" />
              <SkeletonBlock className="h-3 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Module Tab Switcher Strip */}
      <div className="flex gap-2 overflow-x-auto rounded-xl border border-[#DCE2EA] bg-white p-2.5 shadow-2xs scrollbar-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBlock key={i} className={`h-9 shrink-0 rounded-lg ${i === 0 ? "w-28 bg-[#122629]/20" : "w-24 bg-brand-surface-warm"}`} />
        ))}
      </div>

      {/* 4. Main CRM Table / Data Card */}
      <div className="rounded-xl border border-[#DCE2EA] bg-white shadow-2xs overflow-hidden">
        {/* Table Controls (Search, Filters, Bulk Actions) */}
        <div className="p-4 sm:p-5 border-b border-[#DCE2EA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1">
            <SkeletonBlock className="h-9 w-64 max-w-full rounded-lg" />
            <SkeletonBlock className="hidden sm:block h-9 w-32 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-9 w-24 rounded-lg" />
            <SkeletonBlock className="h-9 w-24 rounded-lg" />
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#DCE2EA]">
          {/* Table Header Row */}
          <div className="grid grid-cols-12 gap-3 p-3.5 bg-brand-surface-warm/40 text-xs">
            <SkeletonBlock className="col-span-1 h-4 w-4 rounded" />
            <SkeletonBlock className="col-span-4 h-4 w-32 rounded" />
            <SkeletonBlock className="col-span-2 h-4 w-20 rounded" />
            <SkeletonBlock className="col-span-2 h-4 w-16 rounded" />
            <SkeletonBlock className="col-span-2 h-4 w-16 rounded" />
            <SkeletonBlock className="col-span-1 h-4 w-12 rounded ml-auto" />
          </div>

          {/* 6 Table Body Rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 p-4 items-center">
              <SkeletonBlock className="col-span-1 h-4 w-4 rounded" />
              <div className="col-span-4 flex items-center gap-3">
                <SkeletonBlock className="h-11 w-11 shrink-0 rounded-lg" />
                <div className="space-y-1.5 flex-1">
                  <SkeletonBlock className="h-4 w-4/5 rounded" />
                  <SkeletonBlock className="h-3 w-1/2 rounded" />
                </div>
              </div>
              <SkeletonBlock className="col-span-2 h-6 w-20 rounded-full" />
              <SkeletonBlock className="col-span-2 h-4 w-16 rounded" />
              <SkeletonBlock className="col-span-2 h-4 w-20 rounded" />
              <div className="col-span-1 flex justify-end gap-1.5">
                <SkeletonBlock className="h-7 w-7 rounded-lg" />
                <SkeletonBlock className="h-7 w-7 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer Pagination */}
        <div className="p-3.5 sm:p-4 bg-brand-surface-warm/30 border-t border-[#DCE2EA] flex items-center justify-between">
          <SkeletonBlock className="h-4 w-36 rounded" />
          <div className="flex gap-1.5">
            <SkeletonBlock className="h-8 w-8 rounded-lg" />
            <SkeletonBlock className="h-8 w-8 rounded-lg bg-brand-primary/20" />
            <SkeletonBlock className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function CartPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]" aria-busy="true" aria-label="Loading cart page">
      <SkeletonHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 select-none">
        <SkeletonBlock className="h-8 w-44 rounded-lg" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Cart items */}
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-[#EAE1D3] bg-white p-4 shadow-2xs">
                <SkeletonBlock className="h-24 w-24 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-5 w-2/3 rounded" />
                  <SkeletonBlock className="h-3.5 w-1/3 rounded" />
                  <div className="flex items-center justify-between pt-2">
                    <SkeletonBlock className="h-8 w-28 rounded-lg" />
                    <SkeletonBlock className="h-5 w-16 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl border border-[#EAE1D3] bg-white p-5 shadow-2xs space-y-4">
            <SkeletonBlock className="h-6 w-36 rounded" />
            <div className="space-y-2 pt-2">
              <div className="flex justify-between"><SkeletonBlock className="h-4 w-20 rounded" /><SkeletonBlock className="h-4 w-16 rounded" /></div>
              <div className="flex justify-between"><SkeletonBlock className="h-4 w-24 rounded" /><SkeletonBlock className="h-4 w-12 rounded" /></div>
              <div className="flex justify-between pt-2 border-t border-[#EAE1D3]"><SkeletonBlock className="h-5 w-20 rounded" /><SkeletonBlock className="h-6 w-24 rounded" /></div>
            </div>
            <SkeletonBlock className="h-12 w-full rounded-xl bg-brand-primary/20" />
          </div>
        </div>
      </main>
      <SkeletonFooter />
    </div>
  );
}

export function CheckoutPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]" aria-busy="true" aria-label="Loading checkout page">
      <SkeletonHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 select-none">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-4 w-16 rounded" />
          <SkeletonBlock className="h-4 w-4 rounded" />
          <SkeletonBlock className="h-4 w-24 rounded" />
          <SkeletonBlock className="h-4 w-4 rounded" />
          <SkeletonBlock className="h-4 w-20 rounded" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Checkout Form */}
          <div className="space-y-5 rounded-2xl border border-[#EAE1D3] bg-white p-5 sm:p-7 shadow-2xs">
            <SkeletonBlock className="h-6 w-48 rounded" />
            <div className="grid grid-cols-2 gap-3">
              <SkeletonBlock className="h-11 rounded-xl" />
              <SkeletonBlock className="h-11 rounded-xl" />
            </div>
            <SkeletonBlock className="h-11 w-full rounded-xl" />
            <div className="grid grid-cols-3 gap-3">
              <SkeletonBlock className="h-11 rounded-xl" />
              <SkeletonBlock className="h-11 rounded-xl" />
              <SkeletonBlock className="h-11 rounded-xl" />
            </div>
            <SkeletonBlock className="h-11 w-full rounded-xl" />
          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl border border-[#EAE1D3] bg-white p-5 shadow-2xs space-y-4">
            <SkeletonBlock className="h-6 w-36 rounded" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <SkeletonBlock className="h-14 w-14 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1"><SkeletonBlock className="h-4 w-3/4 rounded" /><SkeletonBlock className="h-3 w-1/2 rounded" /></div>
              </div>
            ))}
            <SkeletonBlock className="h-12 w-full rounded-xl bg-brand-primary/20" />
          </div>
        </div>
      </main>
      <SkeletonFooter />
    </div>
  );
}

export function AccountPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]" aria-busy="true" aria-label="Loading account page">
      <SkeletonHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 select-none">
        <SkeletonBlock className="h-8 w-56 rounded-lg" />
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Sidebar */}
          <div className="space-y-3 rounded-2xl border border-[#EAE1D3] bg-white p-4 shadow-2xs">
            <div className="flex items-center gap-3 pb-3 border-b border-[#EAE1D3]">
              <SkeletonBlock className="h-12 w-12 rounded-full" />
              <div className="space-y-1 flex-1"><SkeletonBlock className="h-4 w-28 rounded" /><SkeletonBlock className="h-3 w-36 rounded" /></div>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>

          {/* Account Content */}
          <div className="space-y-4 rounded-2xl border border-[#EAE1D3] bg-white p-6 shadow-2xs">
            <SkeletonBlock className="h-6 w-48 rounded" />
            <div className="space-y-3 pt-2">
              <SkeletonBlock className="h-12 w-full rounded-xl" />
              <SkeletonBlock className="h-12 w-full rounded-xl" />
              <SkeletonBlock className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </main>
      <SkeletonFooter />
    </div>
  );
}

export function AboutPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]" aria-busy="true" aria-label="Loading about page">
      <SkeletonHeader />
      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 select-none">
        <section className="grid items-center gap-8 rounded-3xl border border-[#EAE1D3] bg-white p-6 sm:grid-cols-2 sm:p-10 shadow-2xs">
          <div className="space-y-4">
            <SkeletonBlock className="h-4 w-36 rounded bg-brand-primary/20" />
            <SkeletonBlock className="h-8 w-4/5 rounded-lg" />
            <SkeletonBlock className="h-3.5 w-full rounded" />
            <SkeletonBlock className="h-3.5 w-full rounded" />
            <SkeletonBlock className="h-3.5 w-3/4 rounded" />
            <SkeletonBlock className="h-10 w-36 rounded-xl" />
          </div>
          <SkeletonBlock className="aspect-[4/3] w-full rounded-2xl" />
        </section>

        <section className="space-y-5">
          <SkeletonBlock className="mx-auto h-4 w-40 rounded" />
          <SkeletonBlock className="mx-auto h-7 w-2/3 max-w-md rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[#EAE1D3] bg-white p-5 space-y-3 shadow-2xs">
                <SkeletonBlock className="h-10 w-10 rounded-xl bg-brand-surface-warm" />
                <SkeletonBlock className="h-5 w-3/4 rounded" />
                <SkeletonBlock className="h-3 w-full rounded" />
              </div>
            ))}
          </div>
        </section>
      </main>
      <SkeletonFooter />
    </div>
  );
}

export function ContactPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]" aria-busy="true" aria-label="Loading contact page">
      <SkeletonHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 select-none">
        <div className="mx-auto max-w-2xl space-y-2.5 text-center">
          <SkeletonBlock className="mx-auto h-3.5 w-32 rounded bg-brand-primary/20" />
          <SkeletonBlock className="mx-auto h-8 w-3/4 rounded-lg" />
          <SkeletonBlock className="mx-auto h-3.5 w-full rounded" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Contact Details */}
          <div className="space-y-4 rounded-3xl border border-[#EAE1D3] bg-white p-6 shadow-2xs">
            <SkeletonBlock className="h-6 w-40 rounded" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-center p-3 rounded-xl bg-brand-surface-warm/40 border border-[#EAE1D3]">
                <SkeletonBlock className="h-10 w-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1"><SkeletonBlock className="h-3.5 w-32 rounded" /><SkeletonBlock className="h-3 w-48 rounded" /></div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="space-y-4 rounded-3xl border border-[#EAE1D3] bg-white p-6 shadow-2xs">
            <SkeletonBlock className="h-6 w-48 rounded" />
            <SkeletonBlock className="h-11 w-full rounded-xl" />
            <SkeletonBlock className="h-11 w-full rounded-xl" />
            <SkeletonBlock className="h-28 w-full rounded-xl" />
            <SkeletonBlock className="h-11 w-36 rounded-xl bg-brand-primary/20" />
          </div>
        </div>
      </main>
      <SkeletonFooter />
    </div>
  );
}

export function AuthPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]" aria-busy="true" aria-label="Loading authentication">
      <SkeletonHeader />
      <main className="mx-auto max-w-md px-4 py-12 select-none">
        <div className="space-y-5 rounded-3xl border border-[#EAE1D3] bg-white p-6 sm:p-9 shadow-sm">
          <SkeletonBlock className="mx-auto h-12 w-12 rounded-full bg-brand-primary/20" />
          <div className="space-y-1.5 text-center">
            <SkeletonBlock className="mx-auto h-6 w-44 rounded" />
            <SkeletonBlock className="mx-auto h-3.5 w-60 rounded" />
          </div>
          <div className="space-y-3 pt-2">
            <SkeletonBlock className="h-11 w-full rounded-xl" />
            <SkeletonBlock className="h-11 w-full rounded-xl" />
            <SkeletonBlock className="h-11 w-full rounded-xl bg-brand-primary/20" />
          </div>
        </div>
      </main>
      <SkeletonFooter />
    </div>
  );
}
