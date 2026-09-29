"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Package, FolderTree, Image as ImageIcon, ShoppingBag, Ticket,
  Plus, Trash2, Edit2, TrendingUp, Lock, ArrowRight, CheckCircle,
  AlertCircle, RefreshCw, X, Save,
} from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { useStore } from "@/components/store";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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
        const r = await fetch(`${API}/products?limit=100&includeInactive=true`, { headers: h });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setProducts(j.data);
      } else if (activeTab === "categories") {
        const r = await fetch(`${API}/categories?includeInactive=true`, { headers: h });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setCategories(j.data);
      } else if (activeTab === "banners") {
        const r = await fetch(`${API}/banners?includeInactive=true`, { headers: h });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setBanners(j.data);
      } else if (activeTab === "orders") {
        const r = await fetch(`${API}/orders?limit=20`, { headers: h });
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
              <SectionHeader title="Manage Products" subtitle="Add, edit or archive agarbatti products." action={<AddBtn onClick={() => openProductModal()} label="Add Product" />} />
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
                    {products.length === 0 && <EmptyRow cols={7} text="No products found." />}
                    {products.map(p => (
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
            </div>
          )}

          {/* CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-5">
              <SectionHeader title="Manage Categories" subtitle="Add, edit or archive product categories." action={<AddBtn onClick={() => openCategoryModal()} label="Add Category" />} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.length === 0 && <p className="text-xs text-[#292524]/60 col-span-3">No categories found.</p>}
                {categories.map(cat => (
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
            </div>
          )}

          {/* BANNERS */}
          {activeTab === "banners" && (
            <div className="space-y-5">
              <SectionHeader title="Manage Banners" subtitle="Configure hero sliders and promotional strips." action={<AddBtn onClick={() => openBannerModal()} label="Add Banner" />} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.length === 0 && <p className="text-xs text-[#292524]/60 col-span-2">No banners found.</p>}
                {banners.map(ban => (
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
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-5">
              <SectionHeader title="Customer Orders" subtitle="Track and update shipping statuses." />
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
                    {orders.length === 0 && <EmptyRow cols={6} text="No orders yet." />}
                    {orders.map(ord => (
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
            </div>
          )}

          {/* COUPONS */}
          {activeTab === "coupons" && (
            <div className="space-y-5">
              <SectionHeader title="Discount Coupons" subtitle="Create and manage promotional discount codes." action={<AddBtn onClick={() => openCouponModal()} label="Create Coupon" />} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.length === 0 && <p className="text-xs text-[#292524]/60">No coupons yet.</p>}
                {coupons.map(cp => (
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
