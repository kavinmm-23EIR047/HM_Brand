import React from "react";

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-brand-border/45 ${className}`} />;
}

function SkeletonHeader() {
  return <><SkeletonBlock className="h-9 w-full rounded-none bg-brand-ink/20" /><div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:h-[76px] sm:px-6"><SkeletonBlock className="h-11 w-48 sm:h-12 sm:w-56" /><SkeletonBlock className="hidden h-10 w-64 rounded-full lg:block" /><div className="flex gap-2"><SkeletonBlock className="h-10 w-10 rounded-full" /><SkeletonBlock className="h-10 w-10 rounded-full" /></div></div></>;
}

function SkeletonProductCard() {
  return <div className="overflow-hidden rounded-2xl border border-brand-border/70 bg-white p-2.5 shadow-2xs"><SkeletonBlock className="aspect-square w-full rounded-xl" /><div className="space-y-2 p-2 pt-3"><SkeletonBlock className="h-4 w-4/5" /><SkeletonBlock className="h-3 w-3/5" /><div className="flex items-center justify-between pt-2"><SkeletonBlock className="h-5 w-12" /><SkeletonBlock className="h-10 w-10 rounded-xl" /></div></div></div>;
}

export function HomePageSkeleton() {
  return <div aria-busy="true" aria-label="Loading home page" className="space-y-6 sm:space-y-10"><div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8"><SkeletonBlock className="aspect-[16/8] w-full rounded-none sm:aspect-[16/5] sm:rounded-2xl" /></div><section className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8"><SkeletonBlock className="mx-auto mb-5 h-4 w-48" /><div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">{Array.from({ length: 9 }, (_, i) => <div key={i} className="flex flex-col items-center gap-2 p-2"><SkeletonBlock className="h-14 w-14 rounded-full sm:h-20 sm:w-20" /><SkeletonBlock className="h-3 w-16" /></div>)}</div></section><section className="bg-brand-surface-alt px-3 py-8 sm:px-6 sm:py-12"><div className="mx-auto max-w-7xl space-y-5"><div className="space-y-2"><SkeletonBlock className="h-3 w-32" /><SkeletonBlock className="h-7 w-3/4 max-w-lg" /><SkeletonBlock className="h-4 w-full max-w-xl" /></div><div className="flex gap-2 overflow-hidden">{Array.from({ length: 5 }, (_, i) => <SkeletonBlock key={i} className="h-11 w-28 shrink-0 rounded-full" />)}</div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <SkeletonProductCard key={i} />)}</div></div></section><section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 px-3 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="flex min-h-32 items-center gap-3 rounded-2xl border border-brand-border/70 bg-white p-4"><SkeletonBlock className="h-12 w-12 shrink-0 rounded-xl" /><div className="flex-1 space-y-2"><SkeletonBlock className="h-3 w-2/3" /><SkeletonBlock className="h-4 w-4/5" /><SkeletonBlock className="h-3 w-full" /></div></div>)}</section><section className="mx-auto grid w-full max-w-7xl gap-3 px-3 sm:grid-cols-2 sm:px-6"><SkeletonBlock className="min-h-64 rounded-3xl" /><div className="grid gap-3"><SkeletonBlock className="min-h-40 rounded-3xl" /><SkeletonBlock className="min-h-40 rounded-3xl" /></div></section><section className="mx-auto w-full max-w-7xl space-y-4 px-3 sm:px-6"><SkeletonBlock className="h-7 w-2/3 max-w-md" /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <SkeletonBlock key={i} className="h-40 rounded-2xl" />)}</div></section></div>;
}

export function HomeRouteLoadingSkeleton() {
  return <div className="min-h-screen bg-sandalLight" aria-busy="true"><SkeletonHeader /><HomePageSkeleton /></div>;
}

export function AboutPageSkeleton() {
  return <div className="min-h-screen bg-[#FAF7F0]" aria-busy="true" aria-label="Loading about page"><SkeletonHeader /><main className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6"><section className="grid items-center gap-8 rounded-3xl bg-white p-5 sm:grid-cols-2 sm:p-9"><div className="space-y-4"><SkeletonBlock className="h-4 w-40" /><SkeletonBlock className="h-10 w-full" /><SkeletonBlock className="h-4 w-full" /><SkeletonBlock className="h-4 w-4/5" /><SkeletonBlock className="h-11 w-40" /></div><SkeletonBlock className="aspect-[4/3] w-full rounded-3xl" /></section><section className="space-y-5"><SkeletonBlock className="mx-auto h-4 w-40" /><SkeletonBlock className="mx-auto h-8 w-2/3" /><div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <div key={i} className="min-h-48 rounded-2xl border border-brand-border bg-white p-4"><SkeletonBlock className="mb-4 h-10 w-10 rounded-xl" /><SkeletonBlock className="mb-3 h-5 w-4/5" /><SkeletonBlock className="mb-2 h-4 w-1/2" /><SkeletonBlock className="h-12 w-full" /></div>)}</div></section><section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-40 rounded-2xl border border-brand-border bg-white p-4"><SkeletonBlock className="mb-3 h-10 w-10 rounded-full" /><SkeletonBlock className="mb-2 h-5 w-4/5" /><SkeletonBlock className="h-12 w-full" /></div>)}</section></main></div>;
}

export function ShopPageSkeleton() {
  return <div className="min-h-screen bg-[#FBF8F3]" aria-busy="true" aria-label="Loading shop page"><SkeletonHeader /><ShopPageContentSkeleton /></div>;
}

export function ShopPageContentSkeleton() {
  return <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6"><SkeletonBlock className="h-4 w-48" /><SkeletonBlock className="h-28 w-full rounded-3xl sm:h-40" /><div className="flex gap-2 overflow-hidden">{Array.from({ length: 7 }, (_, i) => <SkeletonBlock key={i} className="h-12 w-28 shrink-0 rounded-full" />)}</div><div className="grid items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)]"><div className="hidden space-y-5 rounded-2xl border border-brand-border bg-white p-5 lg:block"><SkeletonBlock className="h-6 w-28" />{Array.from({ length: 8 }, (_, i) => <SkeletonBlock key={i} className="h-4 w-full" />)}</div><div className="space-y-4"><div className="flex justify-between"><SkeletonBlock className="h-12 w-40" /><SkeletonBlock className="h-10 w-36 rounded-full" /></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <SkeletonProductCard key={i} />)}</div></div></div></main>;
}

export function AdminPageSkeleton() {
  return <div className="min-h-screen bg-[#F3F6F8]" aria-busy="true" aria-label="Loading admin page"><div className="grid min-h-screen lg:grid-cols-[248px_minmax(0,1fr)]"><aside className="hidden space-y-4 bg-[#123B3A] p-5 lg:block">{Array.from({ length: 9 }, (_, i) => <SkeletonBlock key={i} className="h-10 w-full bg-white/15" />)}</aside><AdminPageContentSkeleton /></div></div>;
}

export function AdminPageContentSkeleton() {
  return <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6"><div className="rounded-2xl bg-white p-5"><SkeletonBlock className="h-7 w-56" /><SkeletonBlock className="mt-2 h-4 w-72" /></div><div className="flex gap-2 overflow-hidden rounded-2xl bg-white p-3">{Array.from({ length: 6 }, (_, i) => <SkeletonBlock key={i} className="h-10 w-24 shrink-0 rounded-xl" />)}</div><div className="rounded-2xl border border-brand-border bg-white p-4 sm:p-6"><div className="mb-5 flex justify-between"><SkeletonBlock className="h-8 w-56" /><SkeletonBlock className="h-10 w-32 rounded-xl" /></div><div className="space-y-3">{Array.from({ length: 6 }, (_, i) => <SkeletonBlock key={i} className="h-14 w-full rounded-xl" />)}</div></div></main>;
}

export function ContactPageSkeleton() {
  return <div className="min-h-screen bg-sandalLight" aria-busy="true" aria-label="Loading contact page"><SkeletonHeader /><main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 sm:py-12"><div className="mx-auto max-w-3xl space-y-3 text-center"><SkeletonBlock className="mx-auto h-4 w-44" /><SkeletonBlock className="mx-auto h-9 w-3/4" /><SkeletonBlock className="mx-auto h-4 w-full" /></div><div className="grid gap-5 lg:grid-cols-2"><div className="space-y-4 rounded-3xl border border-brand-border bg-white p-6"><SkeletonBlock className="h-8 w-40" />{Array.from({ length: 4 }, (_, i) => <SkeletonBlock key={i} className="h-16 w-full rounded-xl" />)}</div><div className="space-y-4 rounded-3xl border border-brand-border bg-white p-6"><SkeletonBlock className="h-7 w-48" />{Array.from({ length: 4 }, (_, i) => <SkeletonBlock key={i} className="h-12 w-full rounded-xl" />)}<SkeletonBlock className="h-28 w-full rounded-xl" /><SkeletonBlock className="h-12 w-40 rounded-xl" /></div></div></main></div>;
}

export function AccountPageSkeleton() {
  return <div className="min-h-screen bg-sandalLight" aria-busy="true" aria-label="Loading account page"><SkeletonHeader /><main className="mx-auto max-w-7xl space-y-5 px-4 py-8 sm:px-6"><SkeletonBlock className="h-8 w-56" /><div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]"><div className="space-y-3 rounded-2xl bg-white p-4">{Array.from({ length: 5 }, (_, i) => <SkeletonBlock key={i} className="h-11 w-full" />)}</div><div className="space-y-4 rounded-2xl bg-white p-6"><SkeletonBlock className="h-7 w-48" /><SkeletonBlock className="h-12 w-full" /><SkeletonBlock className="h-12 w-full" /><SkeletonBlock className="h-12 w-full" /></div></div></main></div>;
}

export function CartPageSkeleton() {
  return <div className="min-h-screen bg-sandalLight" aria-busy="true" aria-label="Loading cart page"><SkeletonHeader /><main className="mx-auto max-w-7xl space-y-5 px-4 py-8 sm:px-6"><SkeletonBlock className="h-9 w-64" /><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"><div className="space-y-3">{Array.from({ length: 3 }, (_, i) => <div key={i} className="flex gap-4 rounded-2xl border border-brand-border bg-white p-4"><SkeletonBlock className="h-24 w-24 shrink-0 rounded-xl" /><div className="flex-1 space-y-3"><SkeletonBlock className="h-5 w-2/3" /><SkeletonBlock className="h-4 w-1/2" /><SkeletonBlock className="h-9 w-32" /></div></div>)}</div><div className="h-64 rounded-2xl border border-brand-border bg-white p-5"><SkeletonBlock className="mb-5 h-6 w-40" /><SkeletonBlock className="mb-3 h-4 w-full" /><SkeletonBlock className="mb-3 h-4 w-full" /><SkeletonBlock className="mt-8 h-12 w-full rounded-xl" /></div></div></main></div>;
}

export function CheckoutPageSkeleton() {
  return <div className="min-h-screen bg-sandalLight" aria-busy="true" aria-label="Loading checkout page"><SkeletonHeader /><main className="mx-auto max-w-7xl space-y-5 px-4 py-8 sm:px-6"><SkeletonBlock className="h-8 w-56" /><SkeletonBlock className="h-12 w-full rounded-full" /><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"><div className="space-y-4 rounded-2xl border border-brand-border bg-white p-5"><SkeletonBlock className="h-6 w-48" />{Array.from({ length: 5 }, (_, i) => <SkeletonBlock key={i} className="h-12 w-full rounded-xl" />)}<SkeletonBlock className="h-28 w-full rounded-xl" /></div><div className="h-72 rounded-2xl border border-brand-border bg-white p-5"><SkeletonBlock className="mb-5 h-6 w-40" />{Array.from({ length: 4 }, (_, i) => <SkeletonBlock key={i} className="mb-3 h-4 w-full" />)}<SkeletonBlock className="mt-8 h-12 w-full rounded-xl" /></div></div></main></div>;
}

export function AuthPageSkeleton() {
  return <div className="min-h-screen bg-sandalLight" aria-busy="true" aria-label="Loading authentication page"><SkeletonHeader /><main className="mx-auto max-w-4xl px-4 py-10 sm:px-6"><div className="space-y-5 rounded-3xl border border-brand-border bg-white p-6 sm:p-10"><SkeletonBlock className="mx-auto h-12 w-12 rounded-full" /><SkeletonBlock className="mx-auto h-8 w-56" /><SkeletonBlock className="mx-auto h-4 w-72 max-w-full" /><SkeletonBlock className="h-12 w-full rounded-xl" /><SkeletonBlock className="h-12 w-full rounded-xl" /><SkeletonBlock className="h-12 w-full rounded-xl" /></div></main></div>;
}

export function ProductPageSkeleton() {
  return <div aria-busy="true" aria-label="Loading product details" className="min-h-screen bg-sandalLight"><SkeletonHeader /><main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6"><SkeletonBlock className="h-4 w-56" /><div className="grid gap-8 lg:grid-cols-2"><div className="space-y-3"><SkeletonBlock className="aspect-square w-full rounded-3xl" /><div className="grid grid-cols-4 gap-3">{Array.from({ length: 4 }, (_, i) => <SkeletonBlock key={i} className="aspect-square rounded-xl" />)}</div></div><div className="space-y-5 rounded-3xl border border-brand-border bg-white p-5 sm:p-8"><SkeletonBlock className="h-5 w-32" /><SkeletonBlock className="h-10 w-3/4" /><SkeletonBlock className="h-4 w-full" /><SkeletonBlock className="h-24 w-full" /><SkeletonBlock className="h-12 w-40" /><SkeletonBlock className="h-12 w-full rounded-xl" /></div></div></main></div>;
}
