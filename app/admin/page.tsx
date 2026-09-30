"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Package, FolderTree, Image as ImageIcon, ShoppingBag, Ticket,
  Plus, Trash2, Edit2, TrendingUp, Lock, ArrowRight, CheckCircle,
  AlertCircle, RefreshCw, X, Save, Search, ChevronLeft, ChevronRight,
  Filter, ArrowUpDown, RotateCcw,
} from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { useStore } from "@/components/store";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const PAGE_SIZE = 10;

/* ──────────────────────────────────────────── helpers */
function authH(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

function StatusMsg({ msg, onDismiss }: { msg: { type: "success" | "error"; text: string } | null; onDismiss: () => void }) {
  if (!msg) return null;
  const ok = msg.type === "success";
  return (
    <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow ${ok ? "bg-[#ECFDF5] text-[#065F46] border border-[#10B981]" : "bg-[#FEF2F2] text-[#991B1B] border border-[#F87171]"}`}>
      <div className="flex items-center gap-2">
        {ok ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
        <span>{msg.text}</span>
      </div>
      <button onClick={onDismiss} className="underline text-[10px]">Dismiss</button>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFF8E7] p-6 sm:p-8 rounded-3xl border-2 border-[#C89B3C]/40 shadow-2xl max-w-lg w-full space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-[#6B4226]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#F4D35E]/30 text-[#6B4226] transition"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-bold text-[#6B4226] mb-1 text-xs">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full p-2.5 bg-white rounded-xl border border-[#C89B3C]/40 font-semibold text-xs text-[#292524]";

function FormButtons({ onCancel, saving }: { onCancel: () => void; saving?: boolean }) {
  return (
    <div className="flex items-center justify-end gap-2 pt-3">
      <button type="button" onClick={onCancel} className="px-4 py-2.5 bg-gray-200 text-[#6B4226] font-extrabold rounded-xl text-xs">Cancel</button>
      <button type="submit" disabled={saving} className="px-5 py-2.5 bg-[#A90C35] disabled:opacity-60 text-white font-extrabold rounded-xl shadow text-xs flex items-center gap-1.5">
        <Save size={14} />{saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C89B3C]/30 pb-3">
      <div>
        <h3 className="font-display text-2xl text-[#6B4226] font-bold">{title}</h3>
        {subtitle && <p className="text-xs text-[#292524]/70">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="px-4 py-2.5 bg-[#A90C35] hover:bg-[#870B2B] text-white text-xs font-extrabold rounded-xl shadow flex items-center gap-2 shrink-0">
      <Plus size={16} /><span>{label}</span>
    </button>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] whitespace-nowrap ${active ? "bg-[#588157] text-white" : "bg-gray-400 text-white"}`}>
      {active ? "ACTIVE" : "INACTIVE"}
    </span>
  );
}

function ActionBtns({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button onClick={onEdit} className="p-1.5 text-[#6B4226] hover:bg-[#F4D35E]/30 rounded-lg transition" title="Edit"><Edit2 size={15} /></button>
      <button onClick={onDelete} className="p-1.5 text-[#991B1B] hover:bg-[#FDF2F2] rounded-lg transition" title="Delete"><Trash2 size={15} /></button>
    </div>
  );
}

function EmptyRow({ cols, text }: { cols: number; text: string }) {
  return (
    <tr><td colSpan={cols} className="p-8 text-center text-[#292524]/60 font-bold text-xs">{text}</td></tr>
  );
}

function SearchFilterBar({
  value,
  onChange,
  placeholder,
  totalCount,
  filteredCount,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  totalCount: number;
  filteredCount: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#C89B3C]/30 shadow-xs">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B4226]/50" size={16} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2 bg-[#FFF8E7]/50 rounded-xl border border-[#C89B3C]/40 text-xs font-semibold text-[#292524] placeholder:text-[#292524]/50 focus:outline-none focus:ring-1 focus:ring-[#A90C35]"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B4226]/50 hover:text-[#991B1B] p-0.5 rounded-full"
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-[#6B4226]">
        <span className="px-3 py-1 rounded-full bg-[#F4D35E]/30 border border-[#C89B3C]/30 text-[11px]">
          Total: <strong className="text-[#A90C35]">{totalCount}</strong>
        </span>
        {value && (
          <span className="px-3 py-1 rounded-full bg-[#E6F4EA] border border-[#10B981]/40 text-[#137333] text-[11px]">
            Found: <strong>{filteredCount}</strong>
          </span>
        )}
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalItems,
  pageSize = PAGE_SIZE,
  onPageChange,
}: {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  if (totalItems === 0) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#C89B3C]/30 text-xs font-bold text-[#6B4226]">
      <div className="text-[11px] sm:text-xs">
        Showing <span className="text-[#A90C35] font-extrabold">{startItem}</span> to{" "}
        <span className="text-[#A90C35] font-extrabold">{endItem}</span> of{" "}
        <span className="text-[#A90C35] font-extrabold">{totalItems}</span> entries
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#C89B3C]/40 bg-white text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4D35E]/30 transition"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>

          {getPages().map((page, idx) =>
            typeof page === "string" ? (
              <span key={`ellipsis-${idx}`} className="px-1.5 py-1 text-[#6B4226]/50">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`min-w-8 h-8 px-2 rounded-xl text-xs font-extrabold transition ${
                  currentPage === page
                    ? "bg-[#A90C35] text-white shadow-xs border border-[#870B2B]"
                    : "bg-white border border-[#C89B3C]/40 text-[#6B4226] hover:bg-[#F4D35E]/30"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#C89B3C]/40 bg-white text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4D35E]/30 transition"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const { user, token, refreshDbData } = useStore();
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showStatus = useCallback((type: "success" | "error", text: string) => {
    setStatus({ type, text });
    setTimeout(() => setStatus(null), 5000);
  }, []);

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  // Search, Filter, Sort and Pagination States
  const [searchProduct, setSearchProduct] = useState("");
  const [productPage, setProductPage] = useState(1);
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productSort, setProductSort] = useState("newest");
  const [productStatusFilter, setProductStatusFilter] = useState("all");

  const [searchCategory, setSearchCategory] = useState("");
  const [categoryPage, setCategoryPage] = useState(1);
  const [categorySort, setCategorySort] = useState("name-asc");

  const [searchBanner, setSearchBanner] = useState("");
  const [bannerPage, setBannerPage] = useState(1);

  const [searchCoupon, setSearchCoupon] = useState("");
  const [couponPage, setCouponPage] = useState(1);
  const [couponSort, setCouponSort] = useState("discount-high");

  const [searchOrder, setSearchOrder] = useState("");
  const [orderPage, setOrderPage] = useState(1);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSort, setOrderSort] = useState("newest");

  // Meilisearch integration for Admin Products Search (typo-tolerant)
  const [meiliProductIds, setMeiliProductIds] = useState<Set<string> | null>(null);

  useEffect(() => {
    const q = searchProduct.trim();
    if (!q) {
      setMeiliProductIds(null);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&type=full&limit=100`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.hits)) {
            const idSet = new Set<string>();
            data.hits.forEach((h: any) => {
              if (h.id) idSet.add(String(h.id));
              if (h.slug) idSet.add(String(h.slug).toLowerCase());
              if (h.name) idSet.add(String(h.name).toLowerCase());
            });
            setMeiliProductIds(idSet);
          } else {
            setMeiliProductIds(new Set());
          }
        })
        .catch(() => {
          setMeiliProductIds(null);
        });
    }, 150);

    return () => clearTimeout(timer);
  }, [searchProduct]);

  // Meilisearch integration for Admin Categories Search
  const [meiliCategoryNames, setMeiliCategoryNames] = useState<Set<string> | null>(null);

  useEffect(() => {
    const q = searchCategory.trim();
    if (!q) {
      setMeiliCategoryNames(null);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&type=autocomplete&limit=20`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.hits)) {
            const nameSet = new Set<string>();
            data.hits.forEach((h: any) => {
              if (h.category) nameSet.add(h.category.toLowerCase().trim());
              if (Array.isArray(h.categories)) {
                h.categories.forEach((c: string) => nameSet.add(c.toLowerCase().trim()));
              }
            });
            if (Array.isArray(data.suggestions)) {
              data.suggestions.forEach((s: string) => nameSet.add(s.toLowerCase().trim()));
            }
            setMeiliCategoryNames(nameSet);
          } else {
            setMeiliCategoryNames(new Set());
          }
        })
        .catch(() => {
          setMeiliCategoryNames(null);
        });
    }, 150);

    return () => clearTimeout(timer);
  }, [searchCategory]);

  // Dynamic list of unique categories available for filtering
  const productCategoryOptions = useMemo(() => {
    const set = new Set<string>();
    categories.forEach((c) => {
      if (c?.name) set.add(c.name);
    });
    products.forEach((p) => {
      const catName = p?.categories?.[0]?.category?.name;
      if (catName) set.add(catName);
    });
    return Array.from(set).sort();
  }, [categories, products]);

  // Filtered & Paginated Products (with Meilisearch typo-tolerance + local fallback)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter (Meilisearch typo-tolerant + local SKU/coupon/price fallback)
    if (searchProduct.trim()) {
      const q = searchProduct.toLowerCase().trim();
      result = result.filter((p) => {
        // Meilisearch match
        const idMatch = meiliProductIds
          ? meiliProductIds.has(String(p.id)) ||
            meiliProductIds.has(String(p.slug || "").toLowerCase()) ||
            meiliProductIds.has(String(p.name || "").toLowerCase())
          : false;
        if (idMatch) return true;

        // Local fallback
        const name = (p.name || "").toLowerCase();
        const sku = (p.sku || "").toLowerCase();
        const cat = (p.categories?.[0]?.category?.name || "").toLowerCase();
        const coupon = (p.couponCode || "").toLowerCase();
        const price = String(p.price || "");
        return name.includes(q) || sku.includes(q) || cat.includes(q) || coupon.includes(q) || price.includes(q);
      });
    }

    // Category filter
    if (productCategoryFilter !== "all") {
      result = result.filter((p) => {
        const catName = p.categories?.[0]?.category?.name;
        return catName === productCategoryFilter;
      });
    }

    // Status filter
    if (productStatusFilter !== "all") {
      const isActive = productStatusFilter === "active";
      result = result.filter((p) => (p.isActive !== false) === isActive);
    }

    // Sort: New to Old, Old to New, High to Low, Low to High, etc.
    result.sort((a, b) => {
      if (productSort === "price-high") {
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      }
      if (productSort === "price-low") {
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      }
      if (productSort === "name-asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (productSort === "name-desc") {
        return (b.name || "").localeCompare(a.name || "");
      }
      if (productSort === "stock-low") {
        return (Number(a.stockQuantity) || 0) - (Number(b.stockQuantity) || 0);
      }
      if (productSort === "stock-high") {
        return (Number(b.stockQuantity) || 0) - (Number(a.stockQuantity) || 0);
      }
      if (productSort === "oldest") {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeA && timeB) return timeA - timeB;
        return String(a.id).localeCompare(String(b.id));
      }
      // default: "newest" (New to Old)
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA && timeB) return timeB - timeA;
      return String(b.id).localeCompare(String(a.id));
    });

    return result;
  }, [products, searchProduct, meiliProductIds, productCategoryFilter, productStatusFilter, productSort]);

  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, productPage]);

  // Filtered & Paginated Categories (with Meilisearch typo-tolerance + local fallback)
  const filteredCategories = useMemo(() => {
    let result = [...categories];
    if (searchCategory.trim()) {
      const q = searchCategory.toLowerCase().trim();
      result = result.filter((c) => {
        const name = (c.name || "").toLowerCase();
        const slug = (c.slug || "").toLowerCase();
        const desc = (c.description || "").toLowerCase();
        const meiliMatch = meiliCategoryNames
          ? meiliCategoryNames.has(name) || meiliCategoryNames.has(slug)
          : false;
        return meiliMatch || name.includes(q) || slug.includes(q) || desc.includes(q);
      });
    }
    result.sort((a, b) => {
      if (categorySort === "name-desc") return (b.name || "").localeCompare(a.name || "");
      if (categorySort === "newest") {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }
      return (a.name || "").localeCompare(b.name || "");
    });
    return result;
  }, [categories, searchCategory, meiliCategoryNames, categorySort]);

  const paginatedCategories = useMemo(() => {
    const start = (categoryPage - 1) * PAGE_SIZE;
    return filteredCategories.slice(start, start + PAGE_SIZE);
  }, [filteredCategories, categoryPage]);

  // Filtered & Paginated Coupons
  const filteredCoupons = useMemo(() => {
    let result = [...coupons];
    if (searchCoupon.trim()) {
      const q = searchCoupon.toLowerCase().trim();
      result = result.filter((cp) => {
        const code = (cp.code || "").toLowerCase();
        const pct = String(cp.discountPercent || "");
        const min = String(cp.minOrderAmount || "");
        return code.includes(q) || pct.includes(q) || min.includes(q);
      });
    }
    result.sort((a, b) => {
      if (couponSort === "discount-high") return (Number(b.discountPercent) || 0) - (Number(a.discountPercent) || 0);
      if (couponSort === "discount-low") return (Number(a.discountPercent) || 0) - (Number(b.discountPercent) || 0);
      return (a.code || "").localeCompare(b.code || "");
    });
    return result;
  }, [coupons, searchCoupon, couponSort]);

  const paginatedCoupons = useMemo(() => {
    const start = (couponPage - 1) * PAGE_SIZE;
    return filteredCoupons.slice(start, start + PAGE_SIZE);
  }, [filteredCoupons, couponPage]);

  // Filtered & Paginated Banners
  const filteredBanners = useMemo(() => {
    if (!searchBanner.trim()) return banners;
    const q = searchBanner.toLowerCase().trim();
    return banners.filter((b) => {
      const title = (b.title || "").toLowerCase();
      const sub = (b.subtitle || "").toLowerCase();
      const pos = (b.position || "").toLowerCase();
      return title.includes(q) || sub.includes(q) || pos.includes(q);
    });
  }, [banners, searchBanner]);

  const paginatedBanners = useMemo(() => {
    const start = (bannerPage - 1) * PAGE_SIZE;
    return filteredBanners.slice(start, start + PAGE_SIZE);
  }, [filteredBanners, bannerPage]);

  // Filtered & Paginated Orders (with Meilisearch product lookup + customer/payment fallback)
  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (searchOrder.trim()) {
      const q = searchOrder.toLowerCase().trim();
      result = result.filter((o) => {
        const num = (o.orderNumber || "").toLowerCase();
        const email = (o.customerEmail || "").toLowerCase();
        const phone = (o.customerPhone || "").toLowerCase();
        const st = (o.status || "").toLowerCase();
        const pay = (o.paymentMethod || "").toLowerCase();
        const total = String(o.totalAmount || "");

        // Check if any order item matches search term or Meilisearch product
        const itemsMatch = Array.isArray(o.items) && o.items.some((it: any) => {
          const itName = (it.productName || it.product?.name || "").toLowerCase();
          const itSlug = (it.product?.slug || "").toLowerCase();
          const itId = String(it.productId || it.product?.id || "");
          const meiliMatch = meiliProductIds ? (meiliProductIds.has(itId) || meiliProductIds.has(itSlug) || meiliProductIds.has(itName)) : false;
          return meiliMatch || itName.includes(q);
        });

        return num.includes(q) || email.includes(q) || phone.includes(q) || st.includes(q) || pay.includes(q) || total.includes(q) || itemsMatch;
      });
    }
    if (orderStatusFilter !== "all") {
      result = result.filter((o) => (o.status || "").toUpperCase() === orderStatusFilter.toUpperCase());
    }
    result.sort((a, b) => {
      if (orderSort === "amount-high") {
        return (Number(b.totalAmount) || 0) - (Number(a.totalAmount) || 0);
      }
      if (orderSort === "amount-low") {
        return (Number(a.totalAmount) || 0) - (Number(b.totalAmount) || 0);
      }
      if (orderSort === "oldest") {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeA && timeB) return timeA - timeB;
        return String(a.id).localeCompare(String(b.id));
      }
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA && timeB) return timeB - timeA;
      return String(b.id).localeCompare(String(a.id));
    });
    return result;
  }, [orders, searchOrder, meiliProductIds, orderStatusFilter, orderSort]);

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, orderPage]);

  const [productModal, setProductModal] = useState<null | "add" | any>(null);
  const [categoryModal, setCategoryModal] = useState<null | "add" | any>(null);
  const [bannerModal, setBannerModal] = useState<null | "add" | any>(null);
  const [couponModal, setCouponModal] = useState<null | "add" | any>(null);

  const emptyProduct = { name: "", sku: "", price: "", mrp: "", stockQuantity: "100", description: "", imageUrl: "", categoryId: "", couponCode: "", isActive: true };
  const [pForm, setPForm] = useState(emptyProduct);

  const emptyCategory = { name: "", description: "", imageUrl: "" };
  const [cForm, setCForm] = useState(emptyCategory);

  const emptyBanner = { title: "", subtitle: "", desktopImage: "", ctaText: "Explore Collection", ctaLink: "/shop", position: "HERO_MAIN", isActive: true };
  const [bForm, setBForm] = useState(emptyBanner);

  const emptyCoupon = { code: "", discountPercent: "10", minOrderAmount: "499", expiryDate: "2027-12-31" };
  const [qForm, setQForm] = useState(emptyCoupon);

  const checkUnauthorized = (res: Response, json: any) => {
    if (res.status === 401 || json?.statusCode === 401 || json?.message?.includes("Unauthorized") || json?.message?.includes("expired")) {
      showStatus("error", "Unauthorized or session expired. Please re-login as Administrator below.");
      return true;
    }
    return false;
  };

  const fetchTab = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const h = authH(token);
    try {
      if (activeTab === "overview") {
        const r = await fetch(`${API}/admin/dashboard`, { headers: h });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setMetrics(j.data);
      } else if (activeTab === "products") {
        const [rProd, rCat] = await Promise.all([
          fetch(`${API}/products?limit=500&includeInactive=true`, { headers: h }),
          fetch(`${API}/categories?includeInactive=true`, { headers: h }),
        ]);
        const jProd = await rProd.json();
        const jCat = await rCat.json();
        if (!checkUnauthorized(rProd, jProd) && jProd.success) setProducts(jProd.data);
        if (jCat?.success) setCategories(jCat.data);
      } else if (activeTab === "categories") {
        const r = await fetch(`${API}/categories?includeInactive=true`, { headers: h });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setCategories(j.data);
      } else if (activeTab === "banners") {
        const r = await fetch(`${API}/banners?includeInactive=true`, { headers: h });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setBanners(j.data);
      } else if (activeTab === "orders") {
        const r = await fetch(`${API}/orders?limit=200`, { headers: h });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setOrders(j.data);
      } else if (activeTab === "coupons") {
        const r = await fetch(`${API}/coupons/admin`, { headers: h });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setCoupons(j.data);
      }
    } catch { showStatus("error", "Failed to load tab data. Please check server status."); } finally { setLoading(false); }
  }, [token, activeTab]);

  useEffect(() => { if (user?.role === "ADMIN" && token) fetchTab(); }, [user, token, activeTab, fetchTab]);

  const openProductModal = async (item?: any) => {
    if (categories.length === 0) {
      const r = await fetch(`${API}/categories`); const j = await r.json();
      if (j.success) setCategories(j.data);
    }
    if (coupons.length === 0 && token) {
      const r = await fetch(`${API}/coupons/admin`, { headers: authH(token) });
      const j = await r.json(); if (j.success) setCoupons(j.data);
    }
    if (item) {
      setProductModal(item);
      setPForm({
        name: item.name || "", sku: item.sku || "", price: String(item.price || ""),
        mrp: String(item.mrp || ""), stockQuantity: String(item.stockQuantity ?? 100),
        description: item.description || "", imageUrl: item.images?.[0]?.url || "",
        categoryId: item.categories?.[0]?.category?.id || "",
        couponCode: item.couponCode || "", isActive: item.isActive !== false,
      });
    } else { setProductModal("add"); setPForm(emptyProduct); }
  };

  /* PRODUCT CRUD */
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setSaving(true);
    const isEdit = productModal !== "add";
    const payload: any = {
      name: pForm.name,
      sku: pForm.sku || `SKU-${Date.now().toString().slice(-6)}`,
      price: parseFloat(pForm.price || "0"),
      mrp: parseFloat(pForm.mrp || pForm.price || "0"),
      stockQuantity: parseInt(pForm.stockQuantity || "100", 10),
      description: pForm.description || pForm.name,
      categoryIds: pForm.categoryId ? [pForm.categoryId] : [],
      couponCode: pForm.couponCode || null,
      isActive: pForm.isActive,
    };
    if (pForm.imageUrl) {
      payload.images = [{ url: pForm.imageUrl, storageKey: "admin/product.jpg", isPrimary: true }];
    }
    try {
      const url = isEdit ? `${API}/products/admin/${productModal.id}` : `${API}/products/admin`;
      const r = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: authH(token), body: JSON.stringify(payload) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && (r.ok || j.success)) {
        showStatus("success", `Product "${pForm.name}" ${isEdit ? "updated" : "created"}!`);
        setProductModal(null); fetchTab(); refreshDbData();
      } else {
        const errMsg = j.message || (j.errors && j.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')) || "Failed";
        showStatus("error", errMsg);
      }
    } catch { showStatus("error", "Network error"); } finally { setSaving(false); }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Archive product "${name}"?`)) return;
    if (!token) { showStatus("error", "No admin token."); return; }
    const r = await fetch(`${API}/products/admin/${id}`, { method: "DELETE", headers: authH(token) });
    const j = await r.json();
    if (!checkUnauthorized(r, j) && (r.ok || j.success)) { showStatus("success", `"${name}" archived.`); fetchTab(); refreshDbData(); }
    else showStatus("error", j.message || "Delete failed");
  };

  /* CATEGORY CRUD */
  const openCategoryModal = (item?: any) => {
    if (item) { setCategoryModal(item); setCForm({ name: item.name, description: item.description || "", imageUrl: item.imageUrl || "" }); }
    else { setCategoryModal("add"); setCForm(emptyCategory); }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return; setSaving(true);
    const isEdit = categoryModal !== "add";
    try {
      const url = isEdit ? `${API}/categories/admin/${categoryModal.id}` : `${API}/categories/admin`;
      const r = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: authH(token), body: JSON.stringify(cForm) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && (r.ok || j.success)) {
        showStatus("success", `Category "${cForm.name}" ${isEdit ? "updated" : "created"}!`);
        setCategoryModal(null); fetchTab(); refreshDbData();
      } else {
        const errMsg = j.message || (j.errors && j.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')) || "Failed";
        showStatus("error", errMsg);
      }
    } catch { showStatus("error", "Network error"); } finally { setSaving(false); }
  };


  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`Archive category "${name}"?`)) return;
    if (!token) { showStatus("error", "No admin token."); return; }
    const r = await fetch(`${API}/categories/admin/${id}`, { method: "DELETE", headers: authH(token) });
    const j = await r.json();
    if (!checkUnauthorized(r, j) && j.success) { showStatus("success", `"${name}" archived.`); fetchTab(); refreshDbData(); }
    else if (!j.success) showStatus("error", j.message || "Delete failed");
  };

  /* BANNER CRUD */
  const openBannerModal = (item?: any) => {
    if (item) {
      setBannerModal(item);
      setBForm({ title: item.title, subtitle: item.subtitle || "", desktopImage: item.desktopImage || "", ctaText: item.ctaText || "Explore Collection", ctaLink: item.ctaLink || "/shop", position: item.position || "HERO_MAIN", isActive: item.isActive !== false });
    } else { setBannerModal("add"); setBForm(emptyBanner); }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return; setSaving(true);
    const isEdit = bannerModal !== "add";
    try {
      const url = isEdit ? `${API}/banners/admin/${bannerModal.id}` : `${API}/banners/admin`;
      const r = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: authH(token), body: JSON.stringify(bForm) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && j.success) {
        showStatus("success", `Banner "${bForm.title}" ${isEdit ? "updated" : "added"}!`);
        setBannerModal(null); fetchTab(); refreshDbData();
      } else if (!j.success) showStatus("error", j.message || "Failed");
    } catch { showStatus("error", "Network error"); } finally { setSaving(false); }
  };

  const deleteBanner = async (id: string, title: string) => {
    if (!confirm(`Delete banner "${title}"?`)) return;
    if (!token) { showStatus("error", "No admin token."); return; }
    const r = await fetch(`${API}/banners/admin/${id}`, { method: "DELETE", headers: authH(token) });
    const j = await r.json();
    if (!checkUnauthorized(r, j) && j.success) { showStatus("success", `Banner "${title}" deleted.`); fetchTab(); refreshDbData(); }
    else if (!j.success) showStatus("error", j.message || "Delete failed");
  };

  /* COUPON CRUD */
  const openCouponModal = (item?: any) => {
    if (item) {
      setCouponModal(item);
      setQForm({ code: item.code, discountPercent: String(item.discountPercent || ""), minOrderAmount: String(item.minOrderAmount || ""), expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : "" });
    } else { setCouponModal("add"); setQForm(emptyCoupon); }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return; setSaving(true);
    const isEdit = couponModal !== "add";
    const payload = { code: qForm.code.toUpperCase(), discountPercent: parseInt(qForm.discountPercent, 10), minOrderAmount: parseFloat(qForm.minOrderAmount), expiryDate: qForm.expiryDate };
    try {
      const url = isEdit ? `${API}/coupons/admin/${couponModal.id}` : `${API}/coupons/admin`;
      const r = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: authH(token), body: JSON.stringify(payload) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && j.success) {
        showStatus("success", `Coupon "${qForm.code}" ${isEdit ? "updated" : "created"}!`);
        setCouponModal(null); fetchTab();
      } else if (!j.success) showStatus("error", j.message || "Failed");
    } catch { showStatus("error", "Network error"); } finally { setSaving(false); }
  };

  const deleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    if (!token) { showStatus("error", "No admin token."); return; }
    const r = await fetch(`${API}/coupons/admin/${id}`, { method: "DELETE", headers: authH(token) });
    const j = await r.json();
    if (!checkUnauthorized(r, j) && j.success) { showStatus("success", `Coupon "${code}" deleted.`); fetchTab(); }
    else if (!j.success) showStatus("error", j.message || "Delete failed");
  };

  /* ORDER STATUS */
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!token) return;
    const r = await fetch(`${API}/orders/admin/${orderId}/status`, { method: "PATCH", headers: authH(token), body: JSON.stringify({ status: newStatus }) });
    const j = await r.json();
    if (!checkUnauthorized(r, j) && j.success) { showStatus("success", `Order status → ${newStatus}`); fetchTab(); }
  };

  /* ACCESS GUARD */
  if (!user || user.role !== "ADMIN") {
    return (
      <InnerPage eyebrow="ADMINISTRATION CONTROL" title="Admin Control Panel" subtitle="Restricted administrator portal.">
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <div className="bg-[#FFF8E7] p-8 rounded-3xl border-2 border-[#C89B3C]/40 shadow-xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FFF4D6] border-2 border-[#F5C84C] flex items-center justify-center text-[#A90C35] mx-auto shadow-inner"><Lock size={28} /></div>
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-extrabold text-[#6B4226]">Administrator Access Only</h3>
              <p className="text-xs text-[#292524]/70">Login with an Admin account to access this panel.</p>
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-[#C89B3C]/30 text-[11px] text-left space-y-1">
              <span className="font-extrabold text-[#6B4226] block">Default Admin Login:</span>
              <div className="font-mono text-[10px] space-y-0.5">
                <div>Email: <span className="font-bold text-[#A90C35]">admin@hmagarbattis.com</span></div>
                <div>Pass: <span className="font-bold text-[#A90C35]">AdminPass123!</span></div>
              </div>
            </div>
            <Link href="/login" className="w-full py-3.5 bg-[#A90C35] hover:bg-[#870B2B] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2">
              <span>Login as Administrator</span><ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </InnerPage>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: FolderTree },
    { id: "banners", label: "Banners", icon: ImageIcon },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "coupons", label: "Coupons", icon: Ticket },
  ];

  return (
    <InnerPage eyebrow="ADMIN DASHBOARD" title="Store Management Console" subtitle="Add, edit and delete products, categories, banners, orders and coupons.">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        <StatusMsg msg={status} onDismiss={() => setStatus(null)} />

        {/* Tab Bar */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-[#FFF8E7] border-2 border-[#C89B3C]/40 rounded-2xl shadow-sm text-xs font-extrabold">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${activeTab === id ? "bg-[#6B4226] text-white shadow" : "text-[#6B4226] hover:bg-[#F4D35E]/30"}`}>
              <Icon size={16} /><span>{label}</span>
            </button>
          ))}
          <button onClick={fetchTab} className="ml-auto px-3 py-2.5 text-[#6B4226] hover:bg-[#F4D35E]/30 rounded-xl" title="Refresh">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Content Panel */}
        <div className="bg-[#FFF8E7] p-6 sm:p-8 rounded-3xl border-2 border-[#C89B3C]/40 shadow-sm min-h-[400px]">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <SectionHeader title="Store Metrics" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active Products", value: metrics?.totalProducts ?? products.length, red: false },
                  { label: "Categories", value: metrics?.totalCategories ?? categories.length, red: false },
                  { label: "Total Orders", value: metrics?.totalOrders ?? 0, red: false },
                  { label: "Registered Users", value: metrics?.totalUsers ?? 1, red: true },
                ].map(m => (
                  <div key={m.label} className="p-5 bg-white rounded-2xl border border-[#C89B3C]/30 shadow-sm">
                    <span className="text-[10px] font-extrabold uppercase text-[#292524]/60 block">{m.label}</span>
                    <span className={`text-3xl font-extrabold block mt-1 ${m.red ? "text-[#A90C35]" : "text-[#6B4226]"}`}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-5">
              <SectionHeader
                title="Manage Products"
                subtitle="Add, edit or archive agarbatti products."
                action={<AddBtn onClick={() => openProductModal()} label="Add Product" />}
              />

              {/* Product Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-[#C89B3C]/30 shadow-xs space-y-3">
                {/* Search Input + Counts */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B4226]/50" size={16} />
                    <input
                      type="text"
                      value={searchProduct}
                      onChange={(e) => {
                        setSearchProduct(e.target.value);
                        setProductPage(1);
                      }}
                      placeholder="Search products by name, SKU, category, or coupon..."
                      className="w-full pl-9 pr-8 py-2 bg-[#FFF8E7]/50 rounded-xl border border-[#C89B3C]/40 text-xs font-semibold text-[#292524] placeholder:text-[#292524]/50 focus:outline-none focus:ring-1 focus:ring-[#A90C35]"
                    />
                    {searchProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchProduct("");
                          setProductPage(1);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B4226]/50 hover:text-[#991B1B] p-0.5 rounded-full"
                        title="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#6B4226] shrink-0">
                    <span className="px-3 py-1 rounded-full bg-[#F4D35E]/30 border border-[#C89B3C]/30 text-[11px]">
                      Total: <strong className="text-[#A90C35]">{products.length}</strong>
                    </span>
                    {(searchProduct || productCategoryFilter !== "all" || productStatusFilter !== "all" || productSort !== "newest") && (
                      <span className="px-3 py-1 rounded-full bg-[#E6F4EA] border border-[#10B981]/40 text-[#137333] text-[11px]">
                        Filtered: <strong>{filteredProducts.length}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Filters: Category Filter, Sort Filter (New to Old, High to Low, etc.), Status Filter */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#C89B3C]/20 text-xs">
                  {/* Category Filter */}
                  <div className="flex items-center gap-1.5 bg-[#FFF8E7]/70 px-3 py-1.5 rounded-xl border border-[#C89B3C]/40 shadow-xs">
                    <Filter size={13} className="text-[#A90C35] shrink-0" />
                    <span className="text-[11px] font-extrabold text-[#6B4226] whitespace-nowrap">Category:</span>
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => {
                        setProductCategoryFilter(e.target.value);
                        setProductPage(1);
                      }}
                      className="bg-transparent font-extrabold text-[#6B4226] focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="all">All Categories ({products.length})</option>
                      {productCategoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div className="flex items-center gap-1.5 bg-[#FFF8E7]/70 px-3 py-1.5 rounded-xl border border-[#C89B3C]/40 shadow-xs">
                    <ArrowUpDown size={13} className="text-[#A90C35] shrink-0" />
                    <span className="text-[11px] font-extrabold text-[#6B4226] whitespace-nowrap">Sort:</span>
                    <select
                      value={productSort}
                      onChange={(e) => {
                        setProductSort(e.target.value);
                        setProductPage(1);
                      }}
                      className="bg-transparent font-extrabold text-[#6B4226] focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="newest">New to Old (Newest First)</option>
                      <option value="oldest">Old to New (Oldest First)</option>
                      <option value="price-high">Price: High to Low (₹ High → Low)</option>
                      <option value="price-low">Price: Low to High (₹ Low → High)</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                      <option value="stock-low">Stock: Low to High (Low Stock Alert)</option>
                      <option value="stock-high">Stock: High to Low</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5 bg-[#FFF8E7]/70 px-3 py-1.5 rounded-xl border border-[#C89B3C]/40 shadow-xs">
                    <span className="text-[11px] font-extrabold text-[#6B4226] whitespace-nowrap">Status:</span>
                    <select
                      value={productStatusFilter}
                      onChange={(e) => {
                        setProductStatusFilter(e.target.value);
                        setProductPage(1);
                      }}
                      className="bg-transparent font-extrabold text-[#6B4226] focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                  </div>

                  {/* Reset Filters */}
                  {(searchProduct || productCategoryFilter !== "all" || productStatusFilter !== "all" || productSort !== "newest") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchProduct("");
                        setProductCategoryFilter("all");
                        setProductStatusFilter("all");
                        setProductSort("newest");
                        setProductPage(1);
                      }}
                      className="ml-auto px-3 py-1.5 text-[11px] font-extrabold text-[#A90C35] hover:bg-[#A90C35]/10 rounded-xl transition border border-[#A90C35]/40 flex items-center gap-1.5 bg-white shadow-xs"
                    >
                      <RotateCcw size={12} />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#C89B3C]/30 bg-white shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F4D35E]/20 text-[#6B4226] font-extrabold uppercase border-b border-[#C89B3C]/30">
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Coupon</th>
                      <th className="p-3">Price / MRP</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C89B3C]/20">
                    {filteredProducts.length === 0 && (
                      <EmptyRow
                        cols={7}
                        text={searchProduct ? `No products matching "${searchProduct}".` : "No products found."}
                      />
                    )}
                    {paginatedProducts.map(p => (
                      <tr key={p.id} className="hover:bg-[#FFF8E7]/50 transition">
                        <td className="p-3 font-bold text-[#6B4226]">
                          <div className="flex items-center gap-2">
                            {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="w-8 h-8 rounded object-cover border shrink-0" />}
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-[#292524]/80">{p.categories?.[0]?.category?.name || <span className="text-[#292524]/40 italic">None</span>}</td>
                        <td className="p-3 font-mono">
                          {p.couponCode ? <span className="bg-[#F4D35E]/30 text-[#A90C35] px-2 py-0.5 rounded border border-[#C89B3C]/40">{p.couponCode}</span> : <span className="text-[#292524]/40">—</span>}
                        </td>
                        <td className="p-3 font-bold text-[#A90C35]">₹{p.price} <span className="line-through text-[10px] text-[#292524]/40 font-normal">₹{p.mrp}</span></td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-extrabold ${p.stockQuantity > 0 ? "bg-[#E6F4EA] text-[#137333]" : "bg-[#FCE8E6] text-[#C5221F]"}`}>{p.stockQuantity}</span>
                        </td>
                        <td className="p-3"><StatusBadge active={p.isActive} /></td>
                        <td className="p-3 text-right"><ActionBtns onEdit={() => openProductModal(p)} onDelete={() => deleteProduct(p.id, p.name)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Numbered Pagination (1, 2, 3... 10) */}
              <Pagination
                currentPage={productPage}
                totalItems={filteredProducts.length}
                pageSize={PAGE_SIZE}
                onPageChange={setProductPage}
              />
            </div>
          )}

          {/* CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-5">
              <SectionHeader
                title="Manage Categories"
                subtitle="Add, edit or archive product categories."
                action={<AddBtn onClick={() => openCategoryModal()} label="Add Category" />}
              />

              {/* Search & Count Bar */}
              <SearchFilterBar
                value={searchCategory}
                onChange={(val) => {
                  setSearchCategory(val);
                  setCategoryPage(1);
                }}
                placeholder="Search categories by name, slug, or description..."
                totalCount={categories.length}
                filteredCount={filteredCategories.length}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.length === 0 && (
                  <p className="text-xs text-[#292524]/60 col-span-3">
                    {searchCategory ? `No categories matching "${searchCategory}".` : "No categories found."}
                  </p>
                )}
                {paginatedCategories.map(cat => (
                  <div key={cat.id} className="p-4 bg-white rounded-2xl border border-[#C89B3C]/30 shadow-sm space-y-2 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-[#6B4226]">{cat.name}</h4>
                        <span className="text-[10px] font-mono text-[#A90C35]">/{cat.slug}</span>
                      </div>
                      <StatusBadge active={cat.isActive} />
                    </div>
                    <p className="text-xs text-[#292524]/70 flex-1">{cat.description || "No description."}</p>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => openCategoryModal(cat)} className="flex-1 py-1.5 text-[10px] font-bold text-[#6B4226] bg-[#F4D35E]/30 rounded-lg hover:bg-[#F4D35E]/60 transition flex items-center justify-center gap-1"><Edit2 size={12} />Edit</button>
                      <button onClick={() => deleteCategory(cat.id, cat.name)} className="flex-1 py-1.5 text-[10px] font-bold text-[#991B1B] bg-[#FEF2F2] rounded-lg hover:bg-[#FCA5A5]/30 transition flex items-center justify-center gap-1"><Trash2 size={12} />Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Numbered Pagination (1, 2, 3... 10) */}
              <Pagination
                currentPage={categoryPage}
                totalItems={filteredCategories.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCategoryPage}
              />
            </div>
          )}

          {/* BANNERS */}
          {activeTab === "banners" && (
            <div className="space-y-5">
              <SectionHeader
                title="Manage Banners"
                subtitle="Configure hero sliders and promotional strips."
                action={<AddBtn onClick={() => openBannerModal()} label="Add Banner" />}
              />

              {/* Search & Count Bar */}
              <SearchFilterBar
                value={searchBanner}
                onChange={(val) => {
                  setSearchBanner(val);
                  setBannerPage(1);
                }}
                placeholder="Search banners by title, subtitle, or position..."
                totalCount={banners.length}
                filteredCount={filteredBanners.length}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBanners.length === 0 && (
                  <p className="text-xs text-[#292524]/60 col-span-2">
                    {searchBanner ? `No banners matching "${searchBanner}".` : "No banners found."}
                  </p>
                )}
                {paginatedBanners.map(ban => (
                  <div key={ban.id} className="p-4 bg-white rounded-2xl border border-[#C89B3C]/30 shadow-sm space-y-3">
                    {ban.desktopImage && <img src={ban.desktopImage} alt="" className="w-full h-32 object-cover rounded-xl border" />}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="bg-[#A90C35] text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">{ban.position}</span>
                        <h4 className="font-bold text-sm text-[#6B4226] mt-1">{ban.title}</h4>
                        <p className="text-xs text-[#292524]/70">{ban.subtitle}</p>
                      </div>
                      <StatusBadge active={ban.isActive} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openBannerModal(ban)} className="flex-1 py-1.5 text-[10px] font-bold text-[#6B4226] bg-[#F4D35E]/30 rounded-lg hover:bg-[#F4D35E]/60 transition flex items-center justify-center gap-1"><Edit2 size={12} />Edit</button>
                      <button onClick={() => deleteBanner(ban.id, ban.title)} className="flex-1 py-1.5 text-[10px] font-bold text-[#991B1B] bg-[#FEF2F2] rounded-lg hover:bg-[#FCA5A5]/30 transition flex items-center justify-center gap-1"><Trash2 size={12} />Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Numbered Pagination (1, 2, 3... 10) */}
              <Pagination
                currentPage={bannerPage}
                totalItems={filteredBanners.length}
                pageSize={PAGE_SIZE}
                onPageChange={setBannerPage}
              />
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-5">
              <SectionHeader title="Customer Orders" subtitle="Track and update shipping statuses." />

              {/* Orders Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-[#C89B3C]/30 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B4226]/50" size={16} />
                    <input
                      type="text"
                      value={searchOrder}
                      onChange={(e) => {
                        setSearchOrder(e.target.value);
                        setOrderPage(1);
                      }}
                      placeholder="Search orders by order #, email, phone, or status..."
                      className="w-full pl-9 pr-8 py-2 bg-[#FFF8E7]/50 rounded-xl border border-[#C89B3C]/40 text-xs font-semibold text-[#292524] placeholder:text-[#292524]/50 focus:outline-none focus:ring-1 focus:ring-[#A90C35]"
                    />
                    {searchOrder && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchOrder("");
                          setOrderPage(1);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B4226]/50 hover:text-[#991B1B] p-0.5 rounded-full"
                        title="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#6B4226] shrink-0">
                    <span className="px-3 py-1 rounded-full bg-[#F4D35E]/30 border border-[#C89B3C]/30 text-[11px]">
                      Total: <strong className="text-[#A90C35]">{orders.length}</strong>
                    </span>
                    {(searchOrder || orderStatusFilter !== "all" || orderSort !== "newest") && (
                      <span className="px-3 py-1 rounded-full bg-[#E6F4EA] border border-[#10B981]/40 text-[#137333] text-[11px]">
                        Filtered: <strong>{filteredOrders.length}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#C89B3C]/20 text-xs">
                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5 bg-[#FFF8E7]/70 px-3 py-1.5 rounded-xl border border-[#C89B3C]/40 shadow-xs">
                    <Filter size={13} className="text-[#A90C35] shrink-0" />
                    <span className="text-[11px] font-extrabold text-[#6B4226] whitespace-nowrap">Status:</span>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => {
                        setOrderStatusFilter(e.target.value);
                        setOrderPage(1);
                      }}
                      className="bg-transparent font-extrabold text-[#6B4226] focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="all">All Statuses ({orders.length})</option>
                      {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div className="flex items-center gap-1.5 bg-[#FFF8E7]/70 px-3 py-1.5 rounded-xl border border-[#C89B3C]/40 shadow-xs">
                    <ArrowUpDown size={13} className="text-[#A90C35] shrink-0" />
                    <span className="text-[11px] font-extrabold text-[#6B4226] whitespace-nowrap">Sort:</span>
                    <select
                      value={orderSort}
                      onChange={(e) => {
                        setOrderSort(e.target.value);
                        setOrderPage(1);
                      }}
                      className="bg-transparent font-extrabold text-[#6B4226] focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="newest">New to Old (Newest First)</option>
                      <option value="oldest">Old to New (Oldest First)</option>
                      <option value="amount-high">Amount: High to Low (₹ High → Low)</option>
                      <option value="amount-low">Amount: Low to High (₹ Low → High)</option>
                    </select>
                  </div>

                  {(searchOrder || orderStatusFilter !== "all" || orderSort !== "newest") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOrder("");
                        setOrderStatusFilter("all");
                        setOrderSort("newest");
                        setOrderPage(1);
                      }}
                      className="ml-auto px-3 py-1.5 text-[11px] font-extrabold text-[#A90C35] hover:bg-[#A90C35]/10 rounded-xl transition border border-[#A90C35]/40 flex items-center gap-1.5 bg-white shadow-xs"
                    >
                      <RotateCcw size={12} />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#C89B3C]/30 bg-white shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F4D35E]/20 text-[#6B4226] font-extrabold uppercase border-b border-[#C89B3C]/30">
                      <th className="p-3">Order #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C89B3C]/20">
                    {filteredOrders.length === 0 && (
                      <EmptyRow
                        cols={6}
                        text={searchOrder ? `No orders matching "${searchOrder}".` : "No orders yet."}
                      />
                    )}
                    {paginatedOrders.map(ord => (
                      <tr key={ord.id} className="hover:bg-[#FFF8E7]/50 transition">
                        <td className="p-3 font-bold font-mono text-[#6B4226]">{ord.orderNumber}</td>
                        <td className="p-3"><span className="font-bold block">{ord.customerEmail}</span><span className="text-[10px] text-[#292524]/60">{ord.customerPhone}</span></td>
                        <td className="p-3 font-bold text-[#A90C35]">₹{ord.totalAmount}</td>
                        <td className="p-3 uppercase text-[10px] font-bold">{ord.paymentMethod}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded font-extrabold bg-[#E85D04] text-white text-[10px]">{ord.status}</span></td>
                        <td className="p-3 text-right">
                          <select value={ord.status} onChange={e => updateOrderStatus(ord.id, e.target.value)} className="bg-white border border-[#C89B3C]/40 rounded px-2 py-1 text-xs font-bold text-[#6B4226]">
                            {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Numbered Pagination (1, 2, 3... 10) */}
              <Pagination
                currentPage={orderPage}
                totalItems={filteredOrders.length}
                pageSize={PAGE_SIZE}
                onPageChange={setOrderPage}
              />
            </div>
          )}

          {/* COUPONS */}
          {activeTab === "coupons" && (
            <div className="space-y-5">
              <SectionHeader
                title="Discount Coupons"
                subtitle="Create and manage promotional discount codes."
                action={<AddBtn onClick={() => openCouponModal()} label="Create Coupon" />}
              />

              {/* Search & Count Bar */}
              <SearchFilterBar
                value={searchCoupon}
                onChange={(val) => {
                  setSearchCoupon(val);
                  setCouponPage(1);
                }}
                placeholder="Search coupons by code, discount %, or minimum order..."
                totalCount={coupons.length}
                filteredCount={filteredCoupons.length}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCoupons.length === 0 && (
                  <p className="text-xs text-[#292524]/60 col-span-3">
                    {searchCoupon ? `No coupons matching "${searchCoupon}".` : "No coupons yet."}
                  </p>
                )}
                {paginatedCoupons.map(cp => (
                  <div key={cp.id} className="p-4 bg-white rounded-2xl border border-[#C89B3C]/30 shadow-sm space-y-2">
                    <span className="font-mono text-base font-extrabold text-[#A90C35] bg-[#F4D35E]/20 px-3 py-1 rounded-lg border border-[#C89B3C]/40 inline-block">{cp.code}</span>
                    <p className="text-xs font-bold text-[#6B4226]">{cp.discountPercent}% Discount</p>
                    <p className="text-[11px] text-[#292524]/70">Min Order: ₹{cp.minOrderAmount}</p>
                    <p className="text-[10px] text-[#292524]/50">Expires: {new Date(cp.expiryDate).toLocaleDateString()}</p>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => openCouponModal(cp)} className="flex-1 py-1.5 text-[10px] font-bold text-[#6B4226] bg-[#F4D35E]/30 rounded-lg hover:bg-[#F4D35E]/60 transition flex items-center justify-center gap-1"><Edit2 size={12} />Edit</button>
                      <button onClick={() => deleteCoupon(cp.id, cp.code)} className="flex-1 py-1.5 text-[10px] font-bold text-[#991B1B] bg-[#FEF2F2] rounded-lg hover:bg-[#FCA5A5]/30 transition flex items-center justify-center gap-1"><Trash2 size={12} />Delete</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Numbered Pagination (1, 2, 3... 10) */}
              <Pagination
                currentPage={couponPage}
                totalItems={filteredCoupons.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCouponPage}
              />
            </div>
          )}

        </div>
      </div>

      {/* PRODUCT MODAL */}
      {productModal && (
        <Modal title={productModal === "add" ? "Add New Product" : `Edit: ${productModal.name}`} onClose={() => setProductModal(null)}>
          <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
            <FieldRow label="Product Name *">
              <input required type="text" value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })} className={inp} placeholder="e.g. Royal Jasmine Agarbatti" />
            </FieldRow>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Price (₹) *">
                <input required type="number" step="0.01" value={pForm.price} onChange={e => setPForm({ ...pForm, price: e.target.value })} className={inp} placeholder="149" />
              </FieldRow>
              <FieldRow label="MRP (₹) *">
                <input required type="number" step="0.01" value={pForm.mrp} onChange={e => setPForm({ ...pForm, mrp: e.target.value })} className={inp} placeholder="180" />
              </FieldRow>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Stock Quantity">
                <input type="number" value={pForm.stockQuantity} onChange={e => setPForm({ ...pForm, stockQuantity: e.target.value })} className={inp} placeholder="100" />
              </FieldRow>
              <FieldRow label="SKU">
                <input type="text" value={pForm.sku} onChange={e => setPForm({ ...pForm, sku: e.target.value })} className={inp} placeholder="HM-001" />
              </FieldRow>
            </div>
            <FieldRow label="Product Image URL">
              <input type="url" value={pForm.imageUrl} onChange={e => setPForm({ ...pForm, imageUrl: e.target.value })} className={inp} placeholder="https://..." />
            </FieldRow>
            <FieldRow label="Category">
              <select value={pForm.categoryId} onChange={e => setPForm({ ...pForm, categoryId: e.target.value })} className={inp}>
                <option value="">— Select Category —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Coupon Code (optional)">
              <div className="flex gap-2">
                <select value={pForm.couponCode} onChange={e => setPForm({ ...pForm, couponCode: e.target.value })} className={`${inp} flex-1`}>
                  <option value="">— Pick Existing —</option>
                  {coupons.map(c => <option key={c.id} value={c.code}>{c.code} ({c.discountPercent}% OFF)</option>)}
                </select>
                <input type="text" value={pForm.couponCode} onChange={e => setPForm({ ...pForm, couponCode: e.target.value.toUpperCase() })} className={`${inp} flex-1`} placeholder="Or type code" />
              </div>
            </FieldRow>
            <FieldRow label="Description">
              <textarea rows={3} value={pForm.description} onChange={e => setPForm({ ...pForm, description: e.target.value })} className={inp} placeholder="Describe the product..." />
            </FieldRow>
            {productModal !== "add" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={pForm.isActive} onChange={e => setPForm({ ...pForm, isActive: e.target.checked })} className="rounded" />
                <span className="text-xs font-bold text-[#6B4226]">Product is Active (visible on site)</span>
              </label>
            )}
            <FormButtons onCancel={() => setProductModal(null)} saving={saving} />
          </form>
        </Modal>
      )}

      {/* CATEGORY MODAL */}
      {categoryModal && (
        <Modal title={categoryModal === "add" ? "Add New Category" : `Edit: ${categoryModal.name}`} onClose={() => setCategoryModal(null)}>
          <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
            <FieldRow label="Category Name *">
              <input required type="text" value={cForm.name} onChange={e => setCForm({ ...cForm, name: e.target.value })} className={inp} placeholder="e.g. Flora Agarbatti" />
            </FieldRow>
            <FieldRow label="Description">
              <textarea rows={3} value={cForm.description} onChange={e => setCForm({ ...cForm, description: e.target.value })} className={inp} placeholder="Short description..." />
            </FieldRow>
            <FieldRow label="Image URL (optional)">
              <input type="url" value={cForm.imageUrl} onChange={e => setCForm({ ...cForm, imageUrl: e.target.value })} className={inp} placeholder="https://..." />
            </FieldRow>
            <FormButtons onCancel={() => setCategoryModal(null)} saving={saving} />
          </form>
        </Modal>
      )}

      {/* BANNER MODAL */}
      {bannerModal && (
        <Modal title={bannerModal === "add" ? "Add New Banner" : `Edit: ${bannerModal.title}`} onClose={() => setBannerModal(null)}>
          <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
            <FieldRow label="Banner Title *">
              <input required type="text" value={bForm.title} onChange={e => setBForm({ ...bForm, title: e.target.value })} className={inp} placeholder="e.g. Festive Special" />
            </FieldRow>
            <FieldRow label="Subtitle">
              <input type="text" value={bForm.subtitle} onChange={e => setBForm({ ...bForm, subtitle: e.target.value })} className={inp} placeholder="Tagline or offer text" />
            </FieldRow>
            <FieldRow label="Desktop Image URL *">
              <input required type="url" value={bForm.desktopImage} onChange={e => setBForm({ ...bForm, desktopImage: e.target.value })} className={inp} placeholder="https://..." />
            </FieldRow>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="CTA Button Text">
                <input type="text" value={bForm.ctaText} onChange={e => setBForm({ ...bForm, ctaText: e.target.value })} className={inp} />
              </FieldRow>
              <FieldRow label="CTA Link">
                <input type="text" value={bForm.ctaLink} onChange={e => setBForm({ ...bForm, ctaLink: e.target.value })} className={inp} />
              </FieldRow>
            </div>
            <FieldRow label="Position">
              <select value={bForm.position} onChange={e => setBForm({ ...bForm, position: e.target.value })} className={inp}>
                <option value="HERO_MAIN">Hero Main</option>
                <option value="PROMO_STRIP">Promo Strip</option>
                <option value="SIDEBAR">Sidebar</option>
              </select>
            </FieldRow>
            {bannerModal !== "add" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={bForm.isActive} onChange={e => setBForm({ ...bForm, isActive: e.target.checked })} />
                <span className="text-xs font-bold text-[#6B4226]">Banner is Active</span>
              </label>
            )}
            <FormButtons onCancel={() => setBannerModal(null)} saving={saving} />
          </form>
        </Modal>
      )}

      {/* COUPON MODAL */}
      {couponModal && (
        <Modal title={couponModal === "add" ? "Create Discount Coupon" : `Edit: ${couponModal.code}`} onClose={() => setCouponModal(null)}>
          <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
            <FieldRow label="Coupon Code *">
              <input required type="text" value={qForm.code} onChange={e => setQForm({ ...qForm, code: e.target.value.toUpperCase() })} className={`${inp} uppercase`} placeholder="e.g. DIWALI20" />
            </FieldRow>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Discount % *">
                <input required type="number" min="1" max="100" value={qForm.discountPercent} onChange={e => setQForm({ ...qForm, discountPercent: e.target.value })} className={inp} />
              </FieldRow>
              <FieldRow label="Min Order (₹)">
                <input type="number" value={qForm.minOrderAmount} onChange={e => setQForm({ ...qForm, minOrderAmount: e.target.value })} className={inp} />
              </FieldRow>
            </div>
            <FieldRow label="Expiry Date">
              <input type="date" value={qForm.expiryDate} onChange={e => setQForm({ ...qForm, expiryDate: e.target.value })} className={inp} />
            </FieldRow>
            <FormButtons onCancel={() => setCouponModal(null)} saving={saving} />
          </form>
        </Modal>
      )}

    </InnerPage>
  );
}
