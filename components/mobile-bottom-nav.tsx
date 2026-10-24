"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/components/store";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, setIsSearchOpen, user } = useStore();

  if (pathname?.startsWith("/admin")) return null;

  const accountHref = user ? "/account" : "/login";
  const itemClass = (active: boolean) =>
    `flex h-12 min-w-[52px] flex-col items-center justify-center gap-1 text-xs font-bold tracking-wide transition-colors ${
      active ? "text-[#9E1830]" : "text-[#173B3A]/85 hover:text-[#9E1830]"
    }`;

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#eadfc9] bg-sandalLight md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-around px-2">
        <Link href="/" className={itemClass(pathname === "/")}>
          <Home size={20} strokeWidth={pathname === "/" ? 2.4 : 1.8} />
          Home
        </Link>
        <Link
          href="/categories"
          className={itemClass(pathname.startsWith("/categor"))}
        >
          <LayoutGrid size={20} strokeWidth={pathname.startsWith("/categor") ? 2.4 : 1.8} />
          Categories
        </Link>
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className={itemClass(false)}
          aria-label="Search products"
        >
          <Search size={20} strokeWidth={1.8} />
          Search
        </button>
        <Link href="/cart" className={`${itemClass(pathname === "/cart")} relative`}>
          <ShoppingBag size={20} strokeWidth={pathname === "/cart" ? 2.4 : 1.8} />
          {totalItems > 0 && (
            <span className="absolute right-1 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#9E1830] px-1 text-[9px] font-bold text-white">
              {totalItems}
            </span>
          )}
          Cart
        </Link>
        <Link href={accountHref} className={itemClass(pathname === "/account" || pathname === "/login")}>
          <User size={20} strokeWidth={pathname === "/account" || pathname === "/login" ? 2.4 : 1.8} />
          Account
        </Link>
      </div>
    </nav>
  );
}
