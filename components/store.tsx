"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@/lib/products";
import { mapDbProductToProduct } from "@/lib/products";

export interface CartLine {
  product: Product;
  qty: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface UserAddress {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
  createdAt?: string;
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
  refreshWishlist: () => Promise<void>;

  // Dynamic Database States
  dbProducts: Product[];
  dbCategories: any[];
  dbBanners: any[];
  refreshDbData: () => Promise<void>;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Authentication State & Profile Management
  user: UserProfile | null;
  token: string | null;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (fullName: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  updateUserProfile: (data: { fullName: string; email: string; phone?: string; currentPassword?: string; newPassword?: string }) => Promise<{ success: boolean; message?: string }>;
  logoutUser: () => void;

  // Address Management
  savedAddresses: UserAddress[];
  defaultAddress: UserAddress | null;
  refreshAddresses: () => Promise<void>;
  createAddress: (data: Omit<UserAddress, "id" | "userId" | "createdAt">) => Promise<{ success: boolean; message?: string }>;
  updateAddress: (id: string, data: Partial<Omit<UserAddress, "id" | "userId" | "createdAt">>) => Promise<{ success: boolean; message?: string }>;
  setDefaultAddress: (id: string) => Promise<{ success: boolean; message?: string }>;
  deleteAddress: (id: string) => Promise<{ success: boolean; message?: string }>;

  // Quick notification
  notification: string | null;
  showNotification: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = "hm_agarbattis_cart";
const WISHLIST_STORAGE_KEY = "hm_agarbattis_wishlist";
const AUTH_TOKEN_KEY = "hm_agarbattis_token";
const AUTH_USER_KEY = "hm_agarbattis_user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbBanners, setDbBanners] = useState<any[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const refreshDbData = async () => {
    try {
      const [prodRes, catRes, banRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products?limit=50`),
        fetch(`${API_BASE_URL}/categories`),
        fetch(`${API_BASE_URL}/banners`),
      ]);
      const [prodJson, catJson, banJson] = await Promise.all([
        prodRes.json(),
        catRes.json(),
        banRes.json(),
      ]);

      if (prodJson.success && Array.isArray(prodJson.data)) {
        const mapped = prodJson.data.map((item: any) => mapDbProductToProduct(item));
        setDbProducts(mapped);
      }
      if (catJson.success && Array.isArray(catJson.data)) {
        setDbCategories(catJson.data);
      }
      if (banJson.success && Array.isArray(banJson.data)) {
        setDbBanners(banJson.data);
      }
    } catch (e) {
      console.error("Failed to fetch database products/categories from backend", e);
    }
  };

  // Hydrate from localStorage & fetch DB data
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
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const savedUser = localStorage.getItem(AUTH_USER_KEY);
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to load store from localStorage", e);
    }
    setMounted(true);
    refreshDbData();
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

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        const errorMsg = data.errors && Array.isArray(data.errors) 
          ? data.errors.map((e: any) => e.message).join(". ")
          : (data.message || "Login failed");
        return { success: false, message: errorMsg };
      }

      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem(AUTH_TOKEN_KEY, data.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
      showNotification(`Welcome back, ${data.data.user.fullName}!`);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: "Network error. Please check server connection." };
    }
  };

  const registerUser = async (fullName: string, email: string, password: string, phone?: string) => {
    try {
      const cleanPhone = phone && phone.trim() !== "" ? phone.trim() : undefined;
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), password, phone: cleanPhone }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        const errorMsg = data.errors && Array.isArray(data.errors) 
          ? data.errors.map((e: any) => e.message).join(". ")
          : (data.message || "Registration failed");
        return { success: false, message: errorMsg };
      }

      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem(AUTH_TOKEN_KEY, data.data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
      showNotification(`Welcome to HM Agarbattis, ${data.data.user.fullName}!`);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: "Network error. Please check server connection." };
    }
  };

  const updateUserProfile = async (data: {
    fullName: string;
    email: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    if (!token) return { success: false, message: "You are not logged in." };
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (!response.ok || !resData.success) {
        return { success: false, message: resData.message || "Failed to update profile." };
      }
      if (resData.data?.user) {
        setUser(resData.data.user);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(resData.data.user));
      }
      if (resData.data?.token) {
        setToken(resData.data.token);
        localStorage.setItem(AUTH_TOKEN_KEY, resData.data.token);
      }
      showNotification("Devotee profile updated successfully!");
      return { success: true };
    } catch {
      return { success: false, message: "Network error while updating profile." };
    }
  };

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);

  const refreshAddresses = async () => {
    if (!token) {
      setSavedAddresses([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setSavedAddresses(data.data);
      }
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  useEffect(() => {
    if (token) {
      refreshAddresses();
    } else {
      setSavedAddresses([]);
    }
  }, [token]);

  const defaultAddress = savedAddresses.find((a) => a.isDefault) || savedAddresses[0] || null;

  const createAddress = async (data: Omit<UserAddress, "id" | "userId" | "createdAt">) => {
    if (!token) return { success: false, message: "Authentication required." };
    try {
      const res = await fetch(`${API_BASE_URL}/addresses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, message: json.message || "Failed to save address." };
      }
      await refreshAddresses();
      showNotification("Mandir delivery address saved!");
      return { success: true };
    } catch {
      return { success: false, message: "Network error while saving address." };
    }
  };

  const updateAddress = async (id: string, data: Partial<Omit<UserAddress, "id" | "userId" | "createdAt">>) => {
    if (!token) return { success: false, message: "Authentication required." };
    try {
      const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, message: json.message || "Failed to update address." };
      }
      await refreshAddresses();
      showNotification("Address updated successfully!");
      return { success: true };
    } catch {
      return { success: false, message: "Network error while updating address." };
    }
  };

  const setDefaultAddress = async (id: string) => {
    if (!token) return { success: false, message: "Authentication required." };
    try {
      const res = await fetch(`${API_BASE_URL}/addresses/${id}/default`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, message: json.message || "Failed to set default address." };
      }
      await refreshAddresses();
      showNotification("Set as default delivery address!");
      return { success: true };
    } catch {
      return { success: false, message: "Network error setting default address." };
    }
  };

  const deleteAddress = async (id: string) => {
    if (!token) return { success: false, message: "Authentication required." };
    try {
      const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, message: json.message || "Failed to delete address." };
      }
      await refreshAddresses();
      showNotification("Address deleted.");
      return { success: true };
    } catch {
      return { success: false, message: "Network error deleting address." };
    }
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    setSavedAddresses([]);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    showNotification("You have logged out.");
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

  const refreshWishlist = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        const slugs = data.data.map((item: any) => item.product?.slug).filter(Boolean);
        setWishlist(slugs);
      }
    } catch (err) {
      console.error("Failed to load wishlist from server", err);
    }
  };

  // Sync wishlist when authenticated
  useEffect(() => {
    if (token) {
      const savedLocal = localStorage.getItem(WISHLIST_STORAGE_KEY);
      let localSlugs: string[] = [];
      try {
        if (savedLocal) localSlugs = JSON.parse(savedLocal);
      } catch {}

      if (localSlugs.length > 0) {
        fetch(`${API_BASE_URL}/wishlist/sync`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items: localSlugs }),
        })
          .then((r) => r.json())
          .then((d) => {
            if (d.success && Array.isArray(d.data)) {
              const slugs = d.data.map((item: any) => item.product?.slug).filter(Boolean);
              setWishlist(slugs);
            } else {
              refreshWishlist();
            }
          })
          .catch(() => refreshWishlist());
      } else {
        refreshWishlist();
      }
    }
  }, [token]);

  const toggleWishlist = async (slug: string) => {
    const isCurrentlyWishlisted = wishlist.includes(slug);
    setWishlist((prev) => {
      if (prev.includes(slug)) {
        showNotification("Item removed from your wishlist");
        return prev.filter((s) => s !== slug);
      }
      showNotification("Saved to your sacred wishlist");
      return [...prev, slug];
    });

    if (token) {
      try {
        if (isCurrentlyWishlisted) {
          await fetch(`${API_BASE_URL}/wishlist/${encodeURIComponent(slug)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await fetch(`${API_BASE_URL}/wishlist`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ slug }),
          });
        }
      } catch (err) {
        console.error("Failed to sync wishlist with server", err);
      }
    }
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
        refreshWishlist,
        dbProducts,
        dbCategories,
        dbBanners,
        refreshDbData,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        user,
        token,
        loginUser,
        registerUser,
        updateUserProfile,
        logoutUser,
        savedAddresses,
        defaultAddress,
        refreshAddresses,
        createAddress,
        updateAddress,
        setDefaultAddress,
        deleteAddress,
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
