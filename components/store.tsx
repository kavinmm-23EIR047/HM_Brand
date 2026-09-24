"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@/lib/products";

export interface CartLine {
  product: Product;
  qty: number;
}

interface StoreContextType {
  lines: CartLine[];
  add: (product: Product, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  totalItems: number;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Quick notification
  notification: string | null;
  showNotification: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = "hm_agarbattis_cart";
const WISHLIST_STORAGE_KEY = "hm_agarbattis_wishlist";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setLines(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (e) {
      console.error("Failed to load store from localStorage", e);
    }
    setMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [lines, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist, mounted]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  const add = (product: Product, qty = 1) => {
    setLines((prev) => {
      const existingIndex = prev.findIndex((l) => l.product.slug === product.slug);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          qty: next[existingIndex].qty + qty,
        };
        return next;
      }
      return [...prev, { product, qty }];
    });
    showNotification(`Added "${product.name}" to your sacred basket`);
    setIsCartOpen(true);
  };

  const remove = (slug: string) => {
    setLines((prev) => prev.filter((l) => l.product.slug !== slug));
  };

  const setQty = (slug: string, qty: number) => {
    if (qty <= 0) {
      remove(slug);
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.product.slug === slug ? { ...l, qty } : l))
    );
  };

  const clear = () => {
    setLines([]);
  };

  const toggleWishlist = (slug: string) => {
    setWishlist((prev) => {
      if (prev.includes(slug)) {
        showNotification("Item removed from your wishlist");
        return prev.filter((s) => s !== slug);
      }
      showNotification("Saved to your sacred wishlist");
      return [...prev, slug];
    });
  };

  const isInWishlist = (slug: string) => wishlist.includes(slug);

  const subtotal = lines.reduce((sum, item) => {
    const priceNum = typeof item.product.price === 'number' ? item.product.price : parseFloat(String(item.product.price || "0").replace(/[^0-9.]/g, "")) || 149;
    return sum + priceNum * item.qty;
  }, 0);

  const totalItems = lines.reduce((sum, item) => sum + item.qty, 0);

  return (
    <StoreContext.Provider
      value={{
        lines,
        add,
        remove,
        setQty,
        clear,
        subtotal,
        totalItems,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        notification,
        showNotification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
