"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, User, Menu, X, Sparkles } from "lucide-react";
import { useStore } from "@/components/store";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { totalItems, wishlist, setIsCartOpen, setIsSearchOpen } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "Collections", href: "/collections" },
    { name: "Festivals", href: "/festivals" },
    { name: "Our Story", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-templeOrange text-charcoal px-4 py-2 text-center text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 border-b border-antiqueGold/40">
        <Sparkles size={14} className="text-deepRed" />
        <span>Bring Divine Energy Home • Free Delivery Above ₹499 • Handcrafted in Coimbatore</span>
        <Sparkles size={14} className="text-deepRed hidden sm:inline" />
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 bg-sacredCream border-b border-antiqueGold/40 transition-all duration-300 ${
          scrolled ? "py-2.5 shadow-sm" : "py-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-saffron border border-earthBrown flex items-center justify-center text-sacredCream text-lg font-bold shadow-solid-sm group-hover:bg-vermilion transition">
              🪔
            </div>
            <div>
              <span className="font-display text-xl sm:text-2xl font-bold tracking-widest text-earthBrown block leading-none">
                HM <span className="text-saffron">AGARBATTIS</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-earthBrown/80 font-bold block mt-0.5">
                Find Your God Within
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-bold tracking-wide uppercase transition relative py-1 ${
                    active ? "text-saffron" : "text-earthBrown hover:text-saffron"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-saffron rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 text-earthBrown">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              className="p-2 hover:bg-turmeric/30 rounded-full transition"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="p-2 hover:bg-turmeric/30 rounded-full transition relative"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute 0 top-1 right-1 h-4 w-4 rounded-full bg-kumkum text-sacredCream text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              aria-label="Account"
              className="p-2 hover:bg-turmeric/30 rounded-full transition hidden sm:block"
            >
              <User size={20} />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="p-2 bg-saffron text-sacredCream rounded-full hover:bg-vermilion transition relative shadow-sm"
            >
              <ShoppingBag size={19} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-kumkum border-2 border-sacredCream text-sacredCream text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
              className="p-2 lg:hidden text-earthBrown hover:bg-turmeric/30 rounded-full"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-sacredCream border-t border-antiqueGold/30 px-6 py-5 shadow-lg">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base font-bold text-earthBrown hover:text-saffron py-2 border-b border-antiqueGold/20 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span>✦</span>
                </Link>
              ))}
              <div className="pt-2 flex items-center justify-between text-sm text-earthBrown">
                <Link href="/account" className="flex items-center gap-2 py-2 font-bold">
                  <User size={18} /> My Account
                </Link>
                <Link href="/wishlist" className="flex items-center gap-2 py-2 font-bold">
                  <Heart size={18} /> Saved ({wishlist.length})
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
