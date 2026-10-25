"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Search, Store, Phone } from "lucide-react";
import { useStore } from "@/components/store";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { setIsSearchOpen } = useStore();

  if (pathname?.startsWith("/admin") || pathname === "/login") return null;

  const itemClass = (active: boolean) =>
    `flex h-12 min-w-[52px] flex-col items-center justify-center gap-1 text-xs font-bold tracking-wide transition-colors ${
      active ? "text-brand-primary" : "text-brand-ink/85 hover:text-brand-primary"
    }`;

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-border bg-sandalLight md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-around px-2">
        <Link href="/" className={itemClass(pathname === "/")}>
          <Home size={20} />
          Home
        </Link>
        <Link href="/about" className={itemClass(pathname === "/about")}>
          <Info size={20} />
          About
        </Link>
        <Link href="/shop" className={itemClass(pathname === "/shop")}>
          <Store size={20} />
          Shop
        </Link>
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className={itemClass(false)}
          aria-label="Search products"
        >
          <Search size={20} />
          Search
        </button>
        <Link href="/contact" className={itemClass(pathname === "/contact")}>
          <Phone size={20} />
          Contact
        </Link>
      </div>
    </nav>
  );
}
