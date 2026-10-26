"use client";

import React, { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package, FolderTree, Image as ImageIcon, ShoppingBag, Ticket, Layers, FileText as ArticleIcon, Gift, Heart, Home,
  Plus, Trash2, Edit2, TrendingUp, Lock, ArrowRight, CheckCircle,
  AlertCircle, RefreshCw, X, Save, Search, ChevronLeft, ChevronRight,
  Filter, ArrowUpDown, RotateCcw, Upload, Truck, User, Copy, MapPin,
  Phone, Mail, Calendar, FileText, ExternalLink, Clock, ArrowUpRight, Check, Star, Menu,
} from "lucide-react";
import { useStore } from "@/components/store";
import { AdminPageContentSkeleton } from "@/components/loading-skeletons";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const PAGE_SIZE = 10;
const ADMIN_SECTION_IDS = ["overview", "products", "categories", "banners", "orders", "coupons", "collections", "blog", "benefits", "offers"] as const;
const ORDER_STAGE_IDS = ["pending", "confirmed", "ready_to_ship", "dispatched", "returned", "all"] as const;
const defaultBenefitsContent = {
  eyebrow: "HOLISTIC PURITY & AYURVEDA", title: "The Sacred Natural Benefits of Pure Botanical Fragrance",
  subtitle: "Discover why botanical incense and sacred aromatics elevate daily rituals.", heroBadge: "100% CHARCOAL-FREE BOTANICAL WELLNESS",
  heroTitle: "Breathe clean, pure, and spiritually uplifting fragrance.", heroDescription: "In traditional Ayurveda, fragrance is a sacred part of mindful living. Pure resins, camphor, and herbal incense bring a gentle aroma to your space.",
  comparisonTitle: "HM Agarbattis vs. Ordinary Market Incense", ingredientsTitle: "Sacred Ingredients & Their Benefits",
  comparison: [], ingredients: [],
};
const defaultOffersContent = {
  eyebrow: "FESTIVE OFFERS & SPECIAL BUNDLES", title: "Sacred Fragrances, Special Festive Blessings",
  subtitle: "Discover limited-time offers, value combos, and curated gift boxes.", badge: "LIMITED TIME FESTIVE PRICING",
  heroTitle: "A Little More Joy & Fragrance in Every Order.", description: "Handcrafted fragrances and sacred essentials for your daily pooja and celebrations.",
  featureOne: "Direct from Coimbatore", featureTwo: "Free Samples Included", cta: "Explore Offer Picks",
  picksTitle: "Popular Offer Picks", bundlesTitle: "Shop By Pooja & Celebration Occasion", bundleDescription: "Specially paired fragrant sets for home warming, festivals, and personal wellness.",
  productIds: [], collectionIds: [],
};

/* ──────────────────────────────────────────── helpers */
function authH(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

function parseShippingAddress(raw: any) {
  if (!raw) {
    return {
      recipientName: "Customer",
      phone: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      addressText: "No address provided",
      courierName: "",
      trackingNumber: "",
      courierNote: "",
    };
  }
  let obj: any = {};
  if (typeof raw === "object") {
    obj = raw;
  } else {
    try {
      obj = JSON.parse(raw);
    } catch {
      obj = { street: String(raw) };
    }
  }
  const recipientName = obj.recipientName || obj.name || "";
  const phone = obj.phone || "";
  const street = obj.street || obj.address || obj.rawAddress || "";
  const city = obj.city || "";
  const state = obj.state || "";
  const postalCode = obj.postalCode || obj.zip || obj.pincode || "";
  const courierName = obj.courierName || "";
  const trackingNumber = obj.trackingNumber || "";
  const courierNote = obj.courierNote || obj.note || "";

  const addressParts = [street, city, state, postalCode].filter(Boolean);
  const addressText = addressParts.length > 0 ? addressParts.join(", ") : typeof raw === "string" ? raw : "N/A";

  return {
    recipientName: recipientName || "Customer",
    phone,
    street,
    city,
    state,
    postalCode,
    addressText,
    courierName,
    trackingNumber,
    courierNote,
  };
}

function StatusMsg({ msg, onDismiss }: { msg: { type: "success" | "error"; text: string } | null; onDismiss: () => void }) {
  if (!msg) return null;
  const ok = msg.type === "success";
  return (
    <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow ${ok ? "bg-[#ECFDF5] text-[#065F46] border border-brand-positive" : "bg-[#FEF2F2] text-brand-danger border border-[#F87171]"}`}>
      <div className="flex items-center gap-2">
        {ok ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
        <span>{msg.text}</span>
      </div>
      <button onClick={onDismiss} className="underline text-ui-10">Dismiss</button>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border-2 border-brand-gold/40 shadow-2xl max-w-lg w-full space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-brand-brown">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-brand-turmeric/30 text-brand-brown transition"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-bold text-brand-brown mb-1 text-xs">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full p-2.5 bg-white rounded-xl border border-brand-gold/40 font-semibold text-xs text-brand-charcoal";

function FormButtons({ onCancel, saving }: { onCancel: () => void; saving?: boolean }) {
  return (
    <div className="flex items-center justify-end gap-2 pt-3">
      <button type="button" onClick={onCancel} className="px-4 py-2.5 bg-gray-200 text-brand-brown font-extrabold rounded-xl text-xs">Cancel</button>
      <button type="submit" disabled={saving} className="px-5 py-2.5 bg-brand-deep disabled:opacity-60 text-white font-extrabold rounded-xl shadow text-xs flex items-center gap-1.5">
        <Save size={14} />{saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

function ImageUploadControl({
  currentUrl,
  required = false,
  disabled = false,
  onFileChange,
  onDelete,
}: {
  currentUrl?: string;
  required?: boolean;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
  onDelete?: () => void;
}) {
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedPreview, setSelectedPreview] = useState("");

  useEffect(() => () => {
    if (selectedPreview) URL.revokeObjectURL(selectedPreview);
  }, [selectedPreview]);

  const selectFile = (file: File | null) => {
    if (selectedPreview) URL.revokeObjectURL(selectedPreview);
    setSelectedFileName(file?.name || "");
    setSelectedPreview(file ? URL.createObjectURL(file) : "");
    onFileChange(file);
  };

  const handleCancelSelected = () => {
    if (selectedPreview) URL.revokeObjectURL(selectedPreview);
    setSelectedFileName("");
    setSelectedPreview("");
    onFileChange(null);
  };

  return (
    <div className="space-y-3 rounded-2xl border-2 border-brand-gold/40 bg-brand-surface/60 p-3.5 shadow-xs">
      {/* Uploading Status Bar */}
      {disabled && (
        <div className="flex items-center gap-2 rounded-xl bg-brand-saffron-dark/10 p-2.5 text-xs font-bold text-brand-saffron-dark border border-brand-saffron-dark/30 animate-pulse">
          <RefreshCw size={14} className="animate-spin shrink-0" />
          <span>Syncing & Uploading image to Cloudinary CDN... Please wait.</span>
        </div>
      )}

      {/* Image Preview Box */}
      {(currentUrl || selectedPreview) && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-brand-gold/30 bg-white p-3 shadow-xs">
          {currentUrl && (
            <div className="flex items-center gap-2.5">
              <img src={currentUrl} alt="Current upload" className="h-16 w-16 rounded-xl border border-brand-gold/30 object-cover shadow-xs" />
              <div>
                <span className="inline-flex items-center gap-1 rounded bg-brand-turmeric/30 px-2 py-0.5 text-ui-10 font-extrabold text-brand-brown border border-brand-gold/40">
                  ☁️ Cloudinary Active
                </span>
                <p className="text-ui-10 font-semibold text-brand-charcoal/60 mt-0.5">Current Saved Image</p>
              </div>
            </div>
          )}

          {currentUrl && selectedPreview && (
            <div className="flex items-center text-brand-deep font-extrabold text-xs px-1">
              <span>→ REPLACING WITH →</span>
            </div>
          )}

          {selectedPreview && (
            <div className="flex items-center gap-2.5">
              <img src={selectedPreview} alt="New selected upload" className="h-16 w-16 rounded-xl border-2 border-brand-positive object-cover shadow-sm" />
              <div>
                <span className="inline-flex items-center gap-1 rounded bg-brand-positive-soft px-2 py-0.5 text-ui-10 font-extrabold text-brand-positive-dark border border-brand-positive/40">
                  ⚡ New Image Queued
                </span>
                <p className="text-ui-10 font-bold text-[#065F46] mt-0.5 max-w-[150px] truncate">{selectedFileName}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <label className={`cursor-pointer inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold text-white transition shadow-xs ${selectedPreview ? "bg-[#588157] hover:bg-brand-green" : "bg-brand-brown hover:bg-[#4D2E1B]"}`}>
          <input required={required && !currentUrl} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="sr-only" onChange={e => selectFile(e.target.files?.[0] || null)} disabled={disabled} />
          <Upload size={14} />
          <span>{currentUrl ? (selectedPreview ? "Choose Different Image" : "Replace Image") : "Upload New Image"}</span>
        </label>

        {selectedPreview && (
          <button type="button" onClick={handleCancelSelected} disabled={disabled} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-brand-brown hover:bg-gray-100 transition shadow-xs">
            ✕ Cancel Selection
          </button>
        )}

        {onDelete && currentUrl && !selectedPreview && (
          <button type="button" onClick={onDelete} disabled={disabled} className="inline-flex items-center gap-1.5 rounded-xl border border-brand-deep/40 bg-[#FFF1F2] px-3.5 py-2 text-xs font-extrabold text-brand-deep transition hover:bg-[#FFE4E6] disabled:opacity-50 shadow-xs">
            <Trash2 size={14} />
            <span>Delete Image</span>
          </button>
        )}
      </div>

      {/* Guidance Message */}
      <div className="text-ui-11 font-semibold text-brand-brown/80">
        {selectedPreview ? (
          <p className="text-[#065F46] font-bold flex items-center gap-1">
            ✓ New image ready! Click &quot;Save&quot; below to upload to Cloudinary.
          </p>
        ) : currentUrl ? (
          <p className="text-brand-brown/70">
            Click &quot;Replace Image&quot; to pick a new photo, then click &quot;Save&quot;.
          </p>
        ) : (
          <p className="text-brand-brown/70">
            JPEG, PNG, WebP, GIF, or AVIF (Max 10 MB). Uploads directly to Cloudinary CDN.
          </p>
        )}
      </div>
    </div>
  );
}

function ProductMultiImageControl({
  existingImages,
  newFiles,
  disabled,
  uploadProgressText,
  onFilesAdded,
  onRemoveNewFile,
  onSetPrimaryExisting,
  onDeleteExisting,
}: {
  existingImages: Array<{ id: string; url: string; isPrimary: boolean; displayOrder?: number }>;
  newFiles: File[];
  disabled?: boolean;
  uploadProgressText?: string;
  onFilesAdded: (files: File[]) => void;
  onRemoveNewFile: (index: number) => void;
  onSetPrimaryExisting: (imageId: string) => void;
  onDeleteExisting: (imageId: string) => void;
}) {
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = newFiles.map((f) => URL.createObjectURL(f));
    setNewPreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [newFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      onFilesAdded(selected);
      e.target.value = "";
    }
  };

  const totalCount = existingImages.length + newFiles.length;

  return (
    <div className="space-y-3 rounded-2xl border-2 border-brand-gold/40 bg-brand-surface/60 p-3.5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-brand-brown">Product Photos</span>
          <span className="rounded-full bg-brand-gold/30 px-2 py-0.5 text-ui-10 font-extrabold text-brand-brown">
            {totalCount} total
          </span>
        </div>
        <span className="text-ui-10 text-brand-charcoal/60">JPEG, PNG, WebP • Multi-image upload</span>
      </div>

      {/* Uploading Status Bar */}
      {disabled && (
        <div className="flex items-center gap-2 rounded-xl bg-brand-saffron-dark/10 p-2.5 text-xs font-bold text-brand-saffron-dark border border-brand-saffron-dark/30 animate-pulse">
          <RefreshCw size={14} className="animate-spin shrink-0" />
          <span>{uploadProgressText || "Syncing with Cloudinary CDN... Please wait."}</span>
        </div>
      )}

      {/* Existing Saved Images */}
      {existingImages.length > 0 && (
        <div>
          <p className="text-ui-11 font-bold text-brand-brown mb-2">Saved Images ({existingImages.length}):</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {existingImages.map((img) => (
              <div
                key={img.id}
                className={`relative group rounded-xl border bg-white p-2 shadow-xs transition-all ${
                  img.isPrimary ? "border-brand-deep ring-2 ring-brand-deep/30" : "border-brand-gold/30 hover:border-brand-gold"
                }`}
              >
                <div className="relative h-24 w-full overflow-hidden rounded-lg bg-[#F8F0DF] flex items-center justify-center">
                  <img src={img.url} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                  {img.isPrimary && (
                    <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded bg-brand-deep px-1.5 py-0.5 text-ui-9 font-black text-white shadow-xs">
                      <Star size={10} fill="currentColor" /> Primary
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between gap-1">
                  {!img.isPrimary ? (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onSetPrimaryExisting(img.id)}
                      className="text-ui-10 font-extrabold text-brand-brown hover:text-brand-deep px-1.5 py-0.5 rounded hover:bg-brand-turmeric/30 transition"
                      title="Set as main display image"
                    >
                      Make Primary
                    </button>
                  ) : (
                    <span className="text-ui-10 font-bold text-brand-deep flex items-center gap-0.5">
                      ★ Active Main
                    </span>
                  )}

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onDeleteExisting(img.id)}
                    className="p-1 text-brand-charcoal/60 hover:text-red-600 rounded hover:bg-red-50 transition"
                    title="Delete this image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending New Uploads */}
      {newFiles.length > 0 && (
        <div>
          <p className="text-ui-11 font-bold text-brand-saffron-dark mb-2 flex items-center gap-1">
            <span>Pending New Images ({newFiles.length}):</span>
            <span className="text-ui-10 font-normal text-brand-charcoal/60">(will upload on Save)</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {newFiles.map((file, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl border border-dashed border-brand-saffron-dark bg-brand-surface p-2 shadow-xs"
              >
                <div className="relative h-24 w-full overflow-hidden rounded-lg bg-white flex items-center justify-center">
                  {newPreviews[idx] && (
                    <img src={newPreviews[idx]} alt={file.name} className="h-full w-full object-contain" />
                  )}
                  <span className="absolute top-1.5 left-1.5 rounded bg-brand-saffron-dark px-1.5 py-0.5 text-ui-9 font-extrabold text-white">
                    + New
                  </span>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onRemoveNewFile(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black transition"
                    title="Remove from selection"
                  >
                    <X size={12} />
                  </button>
                </div>
                <p className="mt-1 truncate text-ui-10 font-semibold text-brand-charcoal">{file.name}</p>
                <p className="text-ui-9 text-brand-charcoal/50 font-mono">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Dropzone Input for Multiple Files */}
      <label
        className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-brand-gold/50 bg-white/70 p-4 text-center cursor-pointer hover:bg-white hover:border-brand-deep transition ${
          disabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <Upload size={22} className="text-brand-brown" />
        <span className="text-xs font-bold text-brand-brown">
          Click to choose images or drag & drop here
        </span>
        <span className="text-ui-10 text-brand-charcoal/60">
          Select one or multiple photos at once (JPG, PNG, WebP)
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={disabled}
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/30 pb-3">
      <div>
        <h3 className="font-display text-2xl text-brand-brown font-bold">{title}</h3>
        {subtitle && <p className="text-xs text-brand-charcoal/70">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="px-4 py-2.5 bg-brand-deep hover:bg-brand-deep-hover text-white text-xs font-extrabold rounded-xl shadow flex items-center gap-2 shrink-0">
      <Plus size={16} /><span>{label}</span>
    </button>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`px-2 py-0.5 rounded font-extrabold text-ui-10 whitespace-nowrap ${active ? "bg-[#588157] text-white" : "bg-gray-400 text-white"}`}>
      {active ? "ACTIVE" : "INACTIVE"}
    </span>
  );
}

function ActionBtns({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button onClick={onEdit} className="p-1.5 text-brand-brown hover:bg-brand-turmeric/30 rounded-lg transition" title="Edit"><Edit2 size={15} /></button>
      <button onClick={onDelete} className="p-1.5 text-brand-danger hover:bg-[#FDF2F2] rounded-lg transition" title="Delete"><Trash2 size={15} /></button>
    </div>
  );
}

function EmptyRow({ cols, text }: { cols: number; text: string }) {
  return (
    <tr><td colSpan={cols} className="p-8 text-center text-brand-charcoal/60 font-bold text-xs">{text}</td></tr>
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-brand-gold/30 shadow-xs">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-brown/50" size={16} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2 bg-brand-surface/50 rounded-xl border border-brand-gold/40 text-xs font-semibold text-brand-charcoal placeholder:text-brand-charcoal/50 focus:outline-none focus:ring-1 focus:ring-brand-deep"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-brown/50 hover:text-brand-danger p-0.5 rounded-full"
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-brand-brown">
        <span className="px-3 py-1 rounded-full bg-brand-turmeric/30 border border-brand-gold/30 text-ui-11">
          Total: <strong className="text-brand-deep">{totalCount}</strong>
        </span>
        {value && (
          <span className="px-3 py-1 rounded-full bg-brand-positive-soft border border-brand-positive/40 text-brand-positive-dark text-ui-11">
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-brand-gold/30 text-xs font-bold text-brand-brown">
      <div className="text-ui-11 sm:text-xs">
        Showing <span className="text-brand-deep font-extrabold">{startItem}</span> to{" "}
        <span className="text-brand-deep font-extrabold">{endItem}</span> of{" "}
        <span className="text-brand-deep font-extrabold">{totalItems}</span> entries
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-brand-gold/40 bg-white text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-turmeric/30 transition"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>

          {getPages().map((page, idx) =>
            typeof page === "string" ? (
              <span key={`ellipsis-${idx}`} className="px-1.5 py-1 text-brand-brown/50">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`min-w-8 h-8 px-2 rounded-xl text-xs font-extrabold transition ${
                  currentPage === page
                    ? "bg-brand-deep text-white shadow-xs border border-brand-deep-hover"
                    : "bg-white border border-brand-gold/40 text-brand-brown hover:bg-brand-turmeric/30"
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
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-brand-gold/40 bg-white text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-turmeric/30 transition"
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
function AdminWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, refreshDbData } = useStore();
  const requestedSection = searchParams.get("section");
  const initialSection = ADMIN_SECTION_IDS.includes(requestedSection as (typeof ADMIN_SECTION_IDS)[number]) ? requestedSection as string : "overview";
  const requestedStage = searchParams.get("stage");
  const initialStage = ORDER_STAGE_IDS.includes(requestedStage as (typeof ORDER_STAGE_IDS)[number]) ? requestedStage as string : "pending";
  const [activeTab, setActiveTab] = useState(initialSection);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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
  const [collections, setCollections] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [pageContent, setPageContent] = useState<any>({});
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
  const [orderSubTab, setOrderSubTab] = useState<string>(initialStage);
  const [orderMonthFilter, setOrderMonthFilter] = useState<string>("all");
  const [customerProfileModal, setCustomerProfileModal] = useState<null | any>(null);
  const [dispatchModal, setDispatchModal] = useState<null | {
    orderId: string;
    orderNumber: string;
    courierName: string;
    trackingNumber: string;
    courierNote: string;
    targetStatus: string;
  }>(null);

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

  // Order counts grouped by sub-tab stages
  const orderCounts = useMemo(() => {
    let pending = 0;
    let confirmed = 0;
    let readyToShip = 0;
    let dispatched = 0;
    let returned = 0;

    orders.forEach((o) => {
      const st = (o.status || "").toUpperCase();
      const pst = (o.paymentStatus || "").toUpperCase();
      const isCod = (o.paymentMethod || "").toUpperCase() === "COD";

      if (st === "CANCELLED" || st === "RETURNED") {
        returned++;
      } else if (st === "DISPATCHED" || st === "SHIPPED" || st === "DELIVERED") {
        dispatched++;
      } else if (st === "READY_TO_SHIP" || st === "PROCESSING") {
        if (pst === "PENDING" && !isCod) {
          pending++;
        } else {
          readyToShip++;
        }
      } else if (st === "CONFIRMED") {
        if (pst === "PENDING" && !isCod) {
          pending++;
        } else {
          confirmed++;
        }
      } else {
        // st === "PENDING" or payment pending
        pending++;
      }
    });

    return {
      pending,
      confirmed,
      readyToShip,
      dispatched,
      returned,
      all: orders.length,
    };
  }, [orders]);

  // Unique Month-Year options for month-wise order filtering
  const orderMonthOptions = useMemo(() => {
    const map = new Map<string, string>();
    orders.forEach((o) => {
      if (o.createdAt) {
        const d = new Date(o.createdAt);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
          map.set(key, label);
        }
      }
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [orders]);

  // Filtered & Paginated Orders (Stage Sub-tab + Month Filter + Search + Status + Sort)
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // 1. Stage Sub-Tab Filter
    if (orderSubTab === "pending") {
      result = result.filter((o) => {
        const st = (o.status || "").toUpperCase();
        const pst = (o.paymentStatus || "").toUpperCase();
        const isCod = (o.paymentMethod || "").toUpperCase() === "COD";
        if (st === "CANCELLED" || st === "RETURNED") return false;
        return st === "PENDING" || (pst === "PENDING" && !isCod);
      });
    } else if (orderSubTab === "confirmed") {
      result = result.filter((o) => {
        const st = (o.status || "").toUpperCase();
        const pst = (o.paymentStatus || "").toUpperCase();
        const isCod = (o.paymentMethod || "").toUpperCase() === "COD";
        if (st === "CANCELLED" || st === "RETURNED") return false;
        return st === "CONFIRMED" && (pst !== "PENDING" || isCod);
      });
    } else if (orderSubTab === "ready_to_ship") {
      result = result.filter((o) => {
        const st = (o.status || "").toUpperCase();
        const pst = (o.paymentStatus || "").toUpperCase();
        const isCod = (o.paymentMethod || "").toUpperCase() === "COD";
        if (st === "CANCELLED" || st === "RETURNED") return false;
        return (st === "READY_TO_SHIP" || st === "PROCESSING") && (pst !== "PENDING" || isCod);
      });
    } else if (orderSubTab === "dispatched") {
      result = result.filter((o) => {
        const st = (o.status || "").toUpperCase();
        return st === "DISPATCHED" || st === "SHIPPED" || st === "DELIVERED";
      });
    } else if (orderSubTab === "returned") {
      result = result.filter((o) => {
        const st = (o.status || "").toUpperCase();
        return st === "RETURNED" || st === "CANCELLED";
      });
    }

    // 2. Month-Wise Filter
    if (orderMonthFilter !== "all") {
      result = result.filter((o) => {
        if (!o.createdAt) return false;
        const d = new Date(o.createdAt);
        if (isNaN(d.getTime())) return false;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return key === orderMonthFilter;
      });
    }

    // 3. Dropdown Status Filter (optional override)
    if (orderStatusFilter !== "all") {
      result = result.filter((o) => (o.status || "").toUpperCase() === orderStatusFilter.toUpperCase());
    }

    // 4. Search Filter
    if (searchOrder.trim()) {
      const q = searchOrder.toLowerCase().trim();
      result = result.filter((o) => {
        const num = (o.orderNumber || "").toLowerCase();
        const email = (o.customerEmail || "").toLowerCase();
        const phone = (o.customerPhone || "").toLowerCase();
        const st = (o.status || "").toLowerCase();
        const pay = (o.paymentMethod || "").toLowerCase();
        const total = String(o.totalAmount || "");

        const addr = parseShippingAddress(o.shippingAddress);
        const street = (addr.street || "").toLowerCase();
        const city = (addr.city || "").toLowerCase();
        const state = (addr.state || "").toLowerCase();
        const courier = (addr.courierName || "").toLowerCase();
        const track = (addr.trackingNumber || "").toLowerCase();
        const note = (addr.courierNote || "").toLowerCase();

        const itemsMatch = Array.isArray(o.items) && o.items.some((it: any) => {
          const itName = (it.productName || it.productNameSnapshot || it.product?.name || "").toLowerCase();
          const itSlug = (it.product?.slug || "").toLowerCase();
          const itId = String(it.productId || it.product?.id || "");
          const meiliMatch = meiliProductIds ? (meiliProductIds.has(itId) || meiliProductIds.has(itSlug) || meiliProductIds.has(itName)) : false;
          return meiliMatch || itName.includes(q);
        });

        return (
          num.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          st.includes(q) ||
          pay.includes(q) ||
          total.includes(q) ||
          street.includes(q) ||
          city.includes(q) ||
          state.includes(q) ||
          courier.includes(q) ||
          track.includes(q) ||
          note.includes(q) ||
          itemsMatch
        );
      });
    }

    // 5. Sorting
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
  }, [orders, searchOrder, meiliProductIds, orderSubTab, orderMonthFilter, orderStatusFilter, orderSort]);

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, orderPage]);

  const [productModal, setProductModal] = useState<null | "add" | any>(null);
  const [categoryModal, setCategoryModal] = useState<null | "add" | any>(null);
  const [bannerModal, setBannerModal] = useState<null | "add" | any>(null);
  const [couponModal, setCouponModal] = useState<null | "add" | any>(null);
  const [collectionModal, setCollectionModal] = useState<null | "add" | any>(null);
  const [articleModal, setArticleModal] = useState<null | "add" | any>(null);
  const [contentForm, setContentForm] = useState<any>({});
  const [jsonDraft, setJsonDraft] = useState<{ comparison: string; ingredients: string }>({ comparison: "[]", ingredients: "[]" });
  const [collectionForm, setCollectionForm] = useState<any>({ title: "", description: "", bannerUrl: "", isActive: true, productIds: [] });
  const [articleForm, setArticleForm] = useState<any>({ title: "", slug: "", label: "", excerpt: "", readingTime: "5 min read", tag: "", highlight: "", author: "", body: "", color: "var(--brand-primary)", background: "var(--brand-surface-warm)", isFeatured: false, isPublished: true, displayOrder: "0" });

  const emptyProduct = {
    name: "",
    sku: "",
    price: "",
    mrp: "",
    stockQuantity: "100",
    description: "",
    imageUrl: "",
    imageId: "",
    categoryId: "",
    subcategoryId: "",
    bundleQuantity: "",
    couponCode: "",
    isActive: true,
    existingImages: [] as Array<{ id: string; url: string; isPrimary: boolean; displayOrder?: number }>,
  };
  const [pForm, setPForm] = useState(emptyProduct);
  const [pImageFile, setPImageFile] = useState<File | null>(null);
  const [pNewFiles, setPNewFiles] = useState<File[]>([]);
  const [uploadProgressText, setUploadProgressText] = useState("");

  const emptyCategory = { name: "", description: "", imageUrl: "", parentId: "" };
  const [cForm, setCForm] = useState(emptyCategory);
  const [cImageFile, setCImageFile] = useState<File | null>(null);

  const emptyBanner = { title: "", subtitle: "", desktopImage: "", ctaText: "Explore Collection", ctaLink: "/shop", position: "HERO_MAIN", isActive: true };
  const [bForm, setBForm] = useState(emptyBanner);
  const [bImageFile, setBImageFile] = useState<File | null>(null);

  const emptyCoupon = { code: "", discountPercent: "10", minOrderAmount: "499", expiryDate: "2027-12-31" };
  const [qForm, setQForm] = useState(emptyCoupon);

  const checkUnauthorized = (res: Response, json: any) => {
    if (res.status === 401 || json?.statusCode === 401 || json?.message?.includes("Unauthorized") || json?.message?.includes("expired")) {
      showStatus("error", "Unauthorized or session expired. Please re-login as Administrator below.");
      return true;
    }
    return false;
  };

  const uploadImage = async (
    file: File,
    type: "PRODUCT" | "CATEGORY" | "BANNER",
    entityId: string,
    imageId?: string,
    isPrimary?: boolean
  ) => {
    if (!token) throw new Error("Administrator session expired.");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("entityId", entityId);
    if (imageId) formData.append("imageId", imageId);
    if (typeof isPrimary === "boolean") formData.append("isPrimary", String(isPrimary));
    const response = await fetch(`${API}/media/admin/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const json = await response.json();
    if (!response.ok || !json.success) throw new Error(json.message || "Image upload failed");
    return json.data;
  };

  const setPrimaryProductImage = async (productId: string, imageId: string) => {
    if (!token) throw new Error("Administrator session expired.");
    const response = await fetch(`${API}/products/admin/${productId}/images/${imageId}/primary`, {
      method: "PATCH",
      headers: authH(token),
    });
    const json = await response.json();
    if (!response.ok || !json.success) throw new Error(json.message || "Failed to set primary image");
    return json.data;
  };

  const deleteImage = async (type: "PRODUCT" | "CATEGORY" | "BANNER", entityId: string, imageId?: string) => {
    if (!token) throw new Error("Administrator session expired.");
    const query = imageId ? `?imageId=${encodeURIComponent(imageId)}` : "";
    const response = await fetch(`${API}/media/admin/${type}/${entityId}${query}`, {
      method: "DELETE",
      headers: authH(token),
    });
    const json = await response.json();
    if (!response.ok || !json.success) throw new Error(json.message || "Image deletion failed");
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
      } else if (activeTab === "collections") {
        const r = await fetch(`${API}/collections?includeInactive=true`, { headers: h });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setCollections(j.data);
        const prodRes = await fetch(`${API}/products?limit=500&includeInactive=true`, { headers: h });
        const prodJson = await prodRes.json(); if (prodJson.success) setProducts(prodJson.data);
      } else if (activeTab === "blog") {
        const r = await fetch(`${API}/content/blog/admin`, { headers: h });
        const j = await r.json(); if (!checkUnauthorized(r, j) && j.success) setArticles(j.data);
      } else if (["benefits", "offers"].includes(activeTab)) {
        const r = await fetch(`${API}/content/pages/${activeTab}`);
        const j = await r.json();
        if (j.success) {
          const next = j.data || (activeTab === "benefits" ? defaultBenefitsContent : defaultOffersContent);
          setContentForm(next);
          if (activeTab === "benefits") setJsonDraft({ comparison: JSON.stringify(next.comparison || [], null, 2), ingredients: JSON.stringify(next.ingredients || [], null, 2) });
        }
        if (activeTab === "offers") {
          const prodRes = await fetch(`${API}/products?limit=500&includeInactive=true`, { headers: h });
          const prodJson = await prodRes.json(); if (prodJson.success) setProducts(prodJson.data);
          const colRes = await fetch(`${API}/collections?includeInactive=true`, { headers: h });
          const colJson = await colRes.json(); if (colJson.success) setCollections(colJson.data);
        }
      }
    } catch { showStatus("error", "Failed to load tab data. Please check server status."); } finally { setLoading(false); }
  }, [token, activeTab]);

  useEffect(() => {
    const section = searchParams.get("section");
    const nextSection = ADMIN_SECTION_IDS.includes(section as (typeof ADMIN_SECTION_IDS)[number]) ? section as string : "overview";
    setActiveTab(nextSection);

    if (nextSection === "orders") {
      const stage = searchParams.get("stage");
      setOrderSubTab(ORDER_STAGE_IDS.includes(stage as (typeof ORDER_STAGE_IDS)[number]) ? stage as string : "pending");
    }
  }, [searchParams]);

  const navigateToSection = (section: string) => {
    if (!ADMIN_SECTION_IDS.includes(section as (typeof ADMIN_SECTION_IDS)[number])) return;
    setActiveTab(section);
    setMobileNavOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", section);
    params.delete("stage");
    router.push(`/admin?${params.toString()}`, { scroll: false });
  };

  const navigateToOrderStage = (stage: string) => {
    if (!ORDER_STAGE_IDS.includes(stage as (typeof ORDER_STAGE_IDS)[number])) return;
    setActiveTab("orders");
    setOrderSubTab(stage);
    setOrderPage(1);
    router.push(`/admin?section=orders&stage=${encodeURIComponent(stage)}`, { scroll: false });
  };

  useEffect(() => { if (user?.role === "ADMIN" && token) fetchTab(); }, [user, token, activeTab, fetchTab]);

  const openProductModal = async (item?: any) => {
    setPImageFile(null);
    setPNewFiles([]);
    setUploadProgressText("");
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
      const existingImages = Array.isArray(item.images)
        ? item.images.map((img: any) => ({
            id: img.id,
            url: img.url,
            isPrimary: Boolean(img.isPrimary),
            displayOrder: img.displayOrder,
          }))
        : [];
      setPForm({
        name: item.name || "", sku: item.sku || "", price: String(item.price || ""),
        mrp: String(item.mrp || ""), stockQuantity: String(item.stockQuantity ?? 100),
        description: item.description || "", imageUrl: item.images?.[0]?.url || "", imageId: item.images?.[0]?.id || "",
        categoryId: item.categories?.[0]?.category?.id || item.categories?.[0]?.categoryId || "",
        subcategoryId: item.subcategoryId || item.subcategory?.id || "",
        bundleQuantity: item.bundleQuantity ? String(item.bundleQuantity) : "",
        couponCode: item.couponCode || "", isActive: item.isActive !== false,
        existingImages,
      });
    } else {
      setProductModal("add");
      setPForm(emptyProduct);
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    if (!productModal?.id) return;
    setSaving(true);
    setUploadProgressText("Updating primary image...");
    try {
      await setPrimaryProductImage(productModal.id, imageId);
      setPForm(prev => ({
        ...prev,
        existingImages: prev.existingImages.map(img => ({
          ...img,
          isPrimary: img.id === imageId,
        })),
      }));
      showStatus("success", "Primary product image updated!");
      fetchTab();
      refreshDbData();
    } catch (error: any) {
      showStatus("error", error?.message || "Failed to set primary image");
    } finally {
      setSaving(false);
      setUploadProgressText("");
    }
  };

  const handleDeleteExistingImage = async (imageId: string) => {
    if (!productModal?.id || !confirm("Delete this product image?")) return;
    setSaving(true);
    setUploadProgressText("Deleting image...");
    try {
      await deleteImage("PRODUCT", productModal.id, imageId);
      setPForm(prev => {
        const remaining = prev.existingImages.filter(img => img.id !== imageId);
        const hadPrimary = remaining.some(img => img.isPrimary);
        if (!hadPrimary && remaining.length > 0) {
          remaining[0].isPrimary = true;
        }
        return { ...prev, existingImages: remaining };
      });
      showStatus("success", "Product image deleted.");
      fetchTab();
      refreshDbData();
    } catch (error: any) {
      showStatus("error", error?.message || "Image deletion failed");
    } finally {
      setSaving(false);
      setUploadProgressText("");
    }
  };

  /* PRODUCT CRUD */
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setSaving(true);
    setUploadProgressText("Saving product details...");
    const isEdit = productModal !== "add";
    const payload: any = {
      name: pForm.name,
      sku: pForm.sku || `SKU-${Date.now().toString().slice(-6)}`,
      price: pForm.price && !isNaN(parseFloat(pForm.price)) ? parseFloat(pForm.price) : 0,
      mrp: pForm.mrp && !isNaN(parseFloat(pForm.mrp)) ? parseFloat(pForm.mrp) : 0,
      stockQuantity: parseInt(pForm.stockQuantity || "100", 10),
      description: pForm.description || pForm.name,
      categoryIds: pForm.categoryId ? [pForm.categoryId] : [],
      subcategoryId: pForm.subcategoryId || null,
      bundleQuantity: pForm.bundleQuantity && !isNaN(parseInt(pForm.bundleQuantity, 10)) ? parseInt(pForm.bundleQuantity, 10) : null,
      couponCode: pForm.couponCode || null,
      isActive: pForm.isActive,
    };
    try {
      const url = isEdit ? `${API}/products/admin/${productModal.id}` : `${API}/products/admin`;
      const r = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: authH(token), body: JSON.stringify(payload) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && (r.ok || j.success)) {
        const targetId = j.data?.id || productModal?.id;
        if (targetId && pNewFiles.length > 0) {
          for (let i = 0; i < pNewFiles.length; i++) {
            setUploadProgressText(`Uploading image ${i + 1} of ${pNewFiles.length} to Cloudinary CDN...`);
            const shouldBePrimary = pForm.existingImages.length === 0 && i === 0;
            await uploadImage(pNewFiles[i], "PRODUCT", targetId, undefined, shouldBePrimary);
          }
        }
        showStatus("success", `Product "${pForm.name}" ${isEdit ? "updated" : "created"}!`);
        setPNewFiles([]);
        setProductModal(null);
        fetchTab();
        refreshDbData();
      } else {
        const errMsg = j.message || (j.errors && j.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')) || "Failed";
        showStatus("error", errMsg);
      }
    } catch (error: any) {
      showStatus("error", error?.message || "Product saved, but an image upload encountered an issue.");
    } finally {
      setSaving(false);
      setUploadProgressText("");
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Permanently delete product "${name}" from database?`)) return;
    if (!token) { showStatus("error", "No admin token."); return; }
    const r = await fetch(`${API}/products/admin/${id}`, { method: "DELETE", headers: authH(token) });
    const j = await r.json();
    if (!checkUnauthorized(r, j) && (r.ok || j.success)) { showStatus("success", `"${name}" permanently deleted from database.`); fetchTab(); refreshDbData(); }
    else showStatus("error", j.message || "Delete failed");
  };

  /* CATEGORY CRUD */
  const openCategoryModal = (item?: any, defaultParentId?: string) => {
    setCImageFile(null);
    if (item) { setCategoryModal(item); setCForm({ name: item.name, description: item.description || "", imageUrl: item.imageUrl || "", parentId: item.parentId || "" }); }
    else { setCategoryModal("add"); setCForm({ ...emptyCategory, parentId: defaultParentId || "" }); }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return; setSaving(true);
    const isEdit = categoryModal !== "add";
    try {
      const url = isEdit ? `${API}/categories/admin/${categoryModal.id}` : `${API}/categories/admin`;
      const catPayload = { ...cForm, parentId: cForm.parentId ? cForm.parentId : null };
      const r = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: authH(token), body: JSON.stringify(catPayload) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && (r.ok || j.success)) {
        if (cImageFile) await uploadImage(cImageFile, "CATEGORY", j.data.id);
        showStatus("success", `Category "${cForm.name}" ${isEdit ? "updated" : "created"}!`);
        setCategoryModal(null); fetchTab(); refreshDbData();
      } else {
        const errMsg = j.message || (j.errors && j.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ')) || "Failed";
        showStatus("error", errMsg);
      }
    } catch (error: any) { showStatus("error", error?.message || "Category saved, but the image upload failed."); } finally { setSaving(false); }
  };


  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`Permanently delete category "${name}" from database?`)) return;
    if (!token) { showStatus("error", "No admin token."); return; }
    const r = await fetch(`${API}/categories/admin/${id}`, { method: "DELETE", headers: authH(token) });
    const j = await r.json();
    if (!checkUnauthorized(r, j) && j.success) { showStatus("success", `"${name}" permanently deleted from database.`); fetchTab(); refreshDbData(); }
    else if (!j.success) showStatus("error", j.message || "Delete failed");
  };

  /* BANNER CRUD */
  const openBannerModal = (item?: any) => {
    setBImageFile(null);
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
        if (bImageFile) await uploadImage(bImageFile, "BANNER", j.data.id);
        showStatus("success", `Banner "${bForm.title}" ${isEdit ? "updated" : "added"}!`);
        setBannerModal(null); fetchTab(); refreshDbData();
      } else if (!j.success) showStatus("error", j.message || "Failed");
    } catch (error: any) { showStatus("error", error?.message || "Banner saved, but the image upload failed."); } finally { setSaving(false); }
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
    const parsedPercent = parseInt(qForm.discountPercent, 10);
    const parsedMinOrder = parseFloat(qForm.minOrderAmount);
    const payload = {
      code: qForm.code.toUpperCase().trim(),
      discountPercent: isNaN(parsedPercent) ? undefined : parsedPercent,
      minOrderAmount: isNaN(parsedMinOrder) || parsedMinOrder < 0 ? 0 : parsedMinOrder,
      expiryDate: qForm.expiryDate || undefined,
    };
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

  const savePageContent = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return; setSaving(true);
    try {
      let nextContent = contentForm;
      if (activeTab === "benefits") nextContent = { ...contentForm, comparison: JSON.parse(jsonDraft.comparison), ingredients: JSON.parse(jsonDraft.ingredients) };
      const r = await fetch(`${API}/content/pages/${activeTab}`, { method: "PUT", headers: authH(token), body: JSON.stringify({ content: nextContent }) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && j.success) showStatus("success", `${activeTab === "benefits" ? "Benefits" : "Offers"} page content saved.`);
      else showStatus("error", j.message || "Unable to save page content");
    } catch (error: any) { showStatus("error", error.message || "Network error"); } finally { setSaving(false); }
  };

  const openCollectionModal = (item?: any) => {
    setCollectionModal(item || "add");
    setCollectionForm(item ? { title: item.title, description: item.description || "", bannerUrl: item.bannerUrl || "", isActive: item.isActive !== false, productIds: (item.products || []).map((entry: any) => entry.productId) } : { title: "", description: "", bannerUrl: "", isActive: true, productIds: [] });
  };

  const saveCollection = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return; setSaving(true);
    const editing = collectionModal !== "add";
    try {
      const r = await fetch(editing ? `${API}/collections/admin/${collectionModal.id}` : `${API}/collections/admin`, { method: editing ? "PATCH" : "POST", headers: authH(token), body: JSON.stringify(collectionForm) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && j.success) { showStatus("success", `Collection ${editing ? "updated" : "created"}.`); setCollectionModal(null); fetchTab(); }
      else showStatus("error", j.message || "Unable to save collection");
    } catch (error: any) { showStatus("error", error.message || "Network error"); } finally { setSaving(false); }
  };

  const deleteCollection = async (item: any) => {
    if (!confirm(`Delete collection "${item.title}"?`)) return;
    const r = await fetch(`${API}/collections/admin/${item.id}`, { method: "DELETE", headers: authH(token || "") }); const j = await r.json();
    if (!checkUnauthorized(r, j) && j.success) { showStatus("success", "Collection deleted."); fetchTab(); } else showStatus("error", j.message || "Delete failed");
  };

  const openArticleModal = (item?: any) => {
    setArticleModal(item || "add");
    setArticleForm(item ? { ...item, displayOrder: String(item.displayOrder || 0) } : { title: "", slug: "", label: "", excerpt: "", readingTime: "5 min read", tag: "", highlight: "", author: "", body: "", color: "var(--brand-primary)", background: "var(--brand-surface-warm)", isFeatured: false, isPublished: true, displayOrder: "0" });
  };

  const saveArticle = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return; setSaving(true);
    const editing = articleModal !== "add";
    try {
      const r = await fetch(editing ? `${API}/content/blog/admin/${articleModal.id}` : `${API}/content/blog/admin`, { method: editing ? "PATCH" : "POST", headers: authH(token), body: JSON.stringify({ ...articleForm, displayOrder: Number(articleForm.displayOrder) || 0 }) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && j.success) { showStatus("success", `Article ${editing ? "updated" : "created"}.`); setArticleModal(null); fetchTab(); }
      else showStatus("error", j.message || "Unable to save article");
    } catch (error: any) { showStatus("error", error.message || "Network error"); } finally { setSaving(false); }
  };

  const deleteArticle = async (item: any) => {
    if (!confirm(`Delete article "${item.title}"?`)) return;
    const r = await fetch(`${API}/content/blog/admin/${item.id}`, { method: "DELETE", headers: authH(token || "") }); const j = await r.json();
    if (!checkUnauthorized(r, j) && j.success) { showStatus("success", "Article deleted."); fetchTab(); } else showStatus("error", j.message || "Delete failed");
  };

  /* ORDER STATUS & DISPATCH */
  const updateOrderStatus = async (
    orderId: string,
    newStatus: string,
    courierData?: { courierName?: string; trackingNumber?: string; courierNote?: string },
    paymentStatus?: string
  ) => {
    if (!token) return;
    setSaving(true);
    try {
      const payload: any = { status: newStatus };
      if (paymentStatus) {
        payload.paymentStatus = paymentStatus;
      }
      if (courierData) {
        if (courierData.courierName) payload.courierName = courierData.courierName;
        if (courierData.trackingNumber) payload.trackingNumber = courierData.trackingNumber;
        if (courierData.courierNote) payload.courierNote = courierData.courierNote;
      }
      const r = await fetch(`${API}/orders/admin/${orderId}/status`, {
        method: "PATCH",
        headers: authH(token),
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && (r.ok || j.success)) {
        showStatus("success", `Order updated: ${newStatus.replace(/_/g, " ")}`);
        fetchTab();
        refreshDbData();
      } else {
        showStatus("error", j.message || "Failed to update order status");
      }
    } catch (error: any) {
      showStatus("error", error?.message || "Failed to update order status");
    } finally {
      setSaving(false);
    }
  };

  const openDispatchModal = (ord: any, targetStatus: string = "DISPATCHED") => {
    const addr = parseShippingAddress(ord.shippingAddress);
    setDispatchModal({
      orderId: ord.id,
      orderNumber: ord.orderNumber,
      courierName: addr.courierName || "Speed Post (India Post)",
      trackingNumber: addr.trackingNumber || "",
      courierNote: addr.courierNote || "",
      targetStatus,
    });
  };

  const handleSaveDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModal) return;
    await updateOrderStatus(dispatchModal.orderId, dispatchModal.targetStatus, {
      courierName: dispatchModal.courierName,
      trackingNumber: dispatchModal.trackingNumber,
      courierNote: dispatchModal.courierNote,
    });
    setDispatchModal(null);
  };

  const openCustomerProfile = (ord: any) => {
    setCustomerProfileModal({ order: ord });
  };

  /* ACCESS GUARD */
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="grid min-h-dvh place-items-center bg-brand-surface-soft px-4 py-10">
        <section className="w-full max-w-md space-y-5 rounded-3xl border border-brand-border bg-white p-7 text-center shadow-xl sm:p-9">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary"><Lock size={25} /></div>
          <div className="space-y-2"><h1 className="font-brand text-2xl font-bold text-brand-ink">Administrator access only</h1><p className="text-sm leading-6 text-brand-muted">Sign in with an administrator account to open the management workspace.</p></div>
          <Link href="/login" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-hover">Admin sign in <ArrowRight size={16} /></Link>
        </section>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: FolderTree },
    { id: "banners", label: "Banners", icon: ImageIcon },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "coupons", label: "Coupons", icon: Ticket },
    { id: "collections", label: "Collections", icon: Layers },
    { id: "blog", label: "Blog", icon: ArticleIcon },
    { id: "benefits", label: "Benefits", icon: Heart },
    { id: "offers", label: "Offers", icon: Gift },
  ];

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || "Overview";
  const recentDashboardOrders = Array.isArray(metrics?.recentOrders) ? [...metrics.recentOrders].reverse() : [];
  const maxRecentRevenue = Math.max(1, ...recentDashboardOrders.map((order: any) => Number(order.totalAmount) || 0));
  const recentOrderStatusGroups = [
    { label: "Pending", color: "bg-brand-amber", count: recentDashboardOrders.filter((order: any) => ["PENDING", "PROCESSING"].includes(String(order.status).toUpperCase())).length },
    { label: "Confirmed", color: "bg-brand-accent", count: recentDashboardOrders.filter((order: any) => ["CONFIRMED", "READY_TO_SHIP"].includes(String(order.status).toUpperCase())).length },
    { label: "Shipped", color: "bg-brand-green-dark", count: recentDashboardOrders.filter((order: any) => ["SHIPPED", "DISPATCHED", "DELIVERED"].includes(String(order.status).toUpperCase())).length },
    { label: "Returned", color: "bg-brand-primary", count: recentDashboardOrders.filter((order: any) => ["RETURNED", "CANCELLED"].includes(String(order.status).toUpperCase())).length },
  ];

  return (
    <div className="-mb-[calc(4.5rem+env(safe-area-inset-bottom))] min-h-dvh w-full overflow-x-hidden bg-brand-surface-soft md:mb-0">
      {loading && (
        <div className="fixed inset-0 z-[120] overflow-y-auto bg-brand-surface-soft/90 py-4 backdrop-blur-sm" aria-label="Loading admin data">
          <AdminPageContentSkeleton />
        </div>
      )}
      {mobileNavOpen && <button type="button" aria-label="Close admin navigation" onClick={() => setMobileNavOpen(false)} className="fixed inset-0 z-[60] bg-brand-ink/55 backdrop-blur-[2px] lg:hidden" />}
      <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-[248px_minmax(0,1fr)] xl:grid-cols-[264px_minmax(0,1fr)]">
          <aside className={`fixed inset-y-0 left-0 z-[70] flex h-dvh w-[min(84vw,300px)] flex-col overflow-y-auto rounded-r-3xl bg-brand-ink p-3.5 text-white shadow-2xl shadow-brand-ink/25 transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:w-auto lg:translate-x-0 lg:rounded-none lg:shadow-none ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="mb-5 flex items-center justify-between px-3 pt-2 lg:hidden">
              <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-accent text-brand-ink"><Layers size={20} /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">HM Brand</p><p className="mt-0.5 text-sm font-bold">Admin workspace</p></div></div>
              <button type="button" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" className="grid h-10 w-10 place-items-center rounded-xl text-white/80 hover:bg-white/10 hover:text-white"><X size={20} /></button>
            </div>
            <div className="hidden items-center gap-3 px-3 pb-5 pt-5 lg:flex">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-accent text-brand-ink">
                <Layers size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">HM Brand</p>
                <p className="mt-0.5 truncate text-sm font-bold">Store workspace</p>
              </div>
            </div>
            <div className="mb-2 hidden px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 lg:block">Workspace</div>
            <nav aria-label="Admin sections" className="flex flex-1 flex-col gap-1.5 overflow-visible pb-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigateToSection(id)}
                  aria-current={activeTab === id ? "page" : undefined}
                  className={`group flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all duration-200 lg:w-full ${activeTab === id ? "bg-brand-primary text-white shadow-lg shadow-black/15" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
                >
                  <Icon size={17} className={activeTab === id ? "text-brand-accent-soft" : "text-white/65 group-hover:text-white"} />
                  <span className="whitespace-nowrap">{label}</span>
                  {activeTab === id && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-brand-accent-soft lg:block" />}
                </button>
              ))}
            </nav>
            <div className="mt-4 hidden border-t border-white/10 pt-3 lg:block">
              <button type="button" onClick={fetchTab} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white" title="Refresh current section">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                <span>Refresh data</span>
              </button>
            </div>
          </aside>

          <main className="min-w-0 px-3 py-4 sm:px-5 sm:py-6 lg:px-7 lg:py-7">
            <div className="mx-auto w-full max-w-[1600px] space-y-5">
            <header className="flex flex-col gap-4 rounded-3xl border border-brand-border bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-primary">
                  <span>Admin workspace</span><span className="text-brand-muted/50">/</span><span className="text-brand-muted">{activeTabLabel}</span>
                </div>
                <div className="flex min-w-0 items-center gap-3"><button type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open admin navigation" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-border bg-white text-brand-ink shadow-sm transition hover:border-brand-primary/40 hover:text-brand-primary lg:hidden"><Menu size={19} /></button><h1 className="min-w-0 truncate font-brand text-2xl font-bold text-brand-ink sm:text-3xl">{activeTab === "overview" ? `Welcome back, ${user.fullName.split(" ")[0]}` : activeTabLabel}</h1></div>
                <p className="mt-1 text-sm text-brand-muted">{activeTab === "overview" ? "Here is the latest activity across your store." : `Manage your store ${activeTabLabel.toLowerCase()} and keep everything up to date.`}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 self-start sm:shrink-0 sm:self-auto">
                <Link href="/" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-primary px-3 text-xs font-bold text-white transition hover:bg-brand-hover sm:px-4">
                  <Home size={15} />
                  <span>Storefront</span>
                </Link>
                <button type="button" onClick={fetchTab} className="inline-flex h-10 items-center gap-2 rounded-xl border border-brand-border bg-white px-3 text-xs font-bold text-brand-ink transition hover:border-brand-primary/40 hover:bg-brand-surface-soft lg:hidden" title="Refresh current section">
                  <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
                <div className="flex min-w-0 items-center gap-2.5 rounded-xl bg-brand-surface-soft px-3 py-2">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-ink text-xs font-bold text-white">{user.fullName.slice(0, 1).toUpperCase()}</div>
                  <div className="hidden sm:block"><p className="max-w-36 truncate text-xs font-bold text-brand-ink">{user.fullName}</p><p className="text-[10px] font-semibold text-brand-muted">Administrator</p></div>
                </div>
              </div>
            </header>

            <StatusMsg msg={status} onDismiss={() => setStatus(null)} />

            {/* Content Panel */}
            <div key={activeTab} className="admin-slide-in min-w-0 rounded-3xl border border-[#DDE5E9] bg-white p-4 shadow-sm sm:p-6 lg:p-7">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-primary">Store snapshot</p><h2 className="mt-1 font-brand text-2xl font-bold text-brand-ink">Performance overview</h2></div>
                <p className="text-xs text-brand-muted">Live totals from your connected store data</p>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5 xl:gap-4">
                {[
                  { label: "Paid revenue", value: `₹${Number(metrics?.totalRevenue || 0).toLocaleString("en-IN")}`, note: "Completed payments", icon: TrendingUp, color: "text-brand-green-dark", iconBg: "bg-brand-positive-soft" },
                  { label: "Products", value: metrics?.totalProducts ?? products.length, note: "Catalog items", icon: Package, color: "text-brand-primary", iconBg: "bg-brand-primary/10" },
                  { label: "Categories", value: metrics?.totalCategories ?? categories.length, note: "Store taxonomy", icon: FolderTree, color: "text-brand-amber", iconBg: "bg-brand-surface-warm" },
                  { label: "Orders", value: metrics?.totalOrders ?? 0, note: "All time", icon: ShoppingBag, color: "text-brand-primary", iconBg: "bg-brand-primary/10" },
                  { label: "Customers", value: metrics?.totalUsers ?? 0, note: "Registered accounts", icon: User, color: "text-brand-ink", iconBg: "bg-brand-surface-soft" },
                ].map((m) => {
                  const Icon = m.icon;
                  return <div key={m.label} className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                    <div className="flex items-start justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-muted">{m.label}</span><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${m.iconBg} ${m.color}`}><Icon size={17} /></span></div>
                    <span className={`mt-3 block break-words text-2xl font-extrabold tracking-tight ${m.color}`}>{m.value}</span>
                    <span className="mt-1 block text-[11px] font-medium text-brand-muted">{m.note}</span>
                  </div>
                })}
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
                <section className="rounded-2xl border border-brand-border bg-white p-5 sm:p-6">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div><h3 className="text-sm font-extrabold text-brand-ink">Recent order value</h3><p className="mt-1 text-xs text-brand-muted">Revenue from the latest orders received</p></div>
                    <span className="rounded-lg bg-brand-surface-soft px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-brand-primary">Last {recentDashboardOrders.length}</span>
                  </div>
                  {recentDashboardOrders.length > 0 ? (
                    <div className="flex h-52 items-end gap-3 border-b border-l border-brand-border px-3 pb-0 pt-4 sm:gap-5">
                      {recentDashboardOrders.map((order: any, index: number) => {
                        const amount = Number(order.totalAmount) || 0;
                        const height = Math.max(8, (amount / maxRecentRevenue) * 100);
                        const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : `Order ${index + 1}`;
                        return <div key={order.id || order.orderNumber || index} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                          <span className="text-[10px] font-bold text-brand-ink">₹{amount.toLocaleString("en-IN")}</span>
                          <div className="relative flex w-full flex-1 items-end justify-center"><div title={`${order.orderNumber || "Order"}: ₹${amount.toLocaleString("en-IN")}`} className="w-full max-w-12 rounded-t-xl bg-gradient-to-t from-brand-green-dark to-brand-green-deep transition-all duration-300 group-hover:from-brand-primary group-hover:to-brand-primary-deep" style={{ height: `${height}%` }} /></div>
                          <span className="pb-2 text-[10px] font-semibold text-brand-muted">{date}</span>
                        </div>;
                      })}
                    </div>
                  ) : <div className="grid h-52 place-items-center rounded-xl bg-brand-surface-soft text-center text-xs text-brand-muted">Recent orders will appear here when your store receives them.</div>}
                </section>

                <section className="rounded-2xl border border-brand-border bg-white p-5 sm:p-6">
                  <div className="mb-5"><h3 className="text-sm font-extrabold text-brand-ink">Order pipeline</h3><p className="mt-1 text-xs text-brand-muted">Status mix in the latest orders</p></div>
                  {recentDashboardOrders.length > 0 ? <>
                    <div className="mb-5 flex h-3 overflow-hidden rounded-full bg-brand-surface-soft" aria-label="Recent order status distribution">
                      {recentOrderStatusGroups.map((group) => group.count > 0 && <span key={group.label} className={`${group.color} transition-all`} style={{ width: `${(group.count / recentDashboardOrders.length) * 100}%` }} title={`${group.label}: ${group.count}`} />)}
                    </div>
                    <div className="space-y-3">
                      {recentOrderStatusGroups.map((group) => <div key={group.label} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2.5 text-brand-muted"><span className={`h-2.5 w-2.5 rounded-full ${group.color}`} />{group.label}</span><span className="font-bold tabular-nums text-brand-ink">{group.count}</span></div>)}
                    </div>
                  </> : <div className="grid h-36 place-items-center rounded-xl bg-brand-surface-soft text-center text-xs text-brand-muted">No order status data yet.</div>}
                  <button type="button" onClick={() => navigateToSection("orders")} className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-brand-primary transition hover:text-brand-hover">Open order management <ArrowUpRight size={14} /></button>
                </section>
              </div>

              <section className="rounded-2xl border border-brand-border bg-white p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="text-sm font-extrabold text-brand-ink">Latest orders</h3><p className="mt-1 text-xs text-brand-muted">Most recent orders from the backend</p></div><button type="button" onClick={() => navigateToSection("orders")} className="text-xs font-bold text-brand-primary hover:underline">View all</button></div>
                {recentDashboardOrders.length ? <div className="divide-y divide-brand-border">
                  {[...recentDashboardOrders].reverse().map((order: any) => <div key={order.id || order.orderNumber} className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0"><p className="truncate text-xs font-bold text-brand-ink">{order.orderNumber || "Order"}</p><p className="mt-0.5 text-[11px] text-brand-muted">{order.customerEmail || order.customerName || "Customer"} · {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Date unavailable"}</p></div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end"><span className="text-xs font-extrabold text-brand-ink">₹{(Number(order.totalAmount) || 0).toLocaleString("en-IN")}</span><span className="rounded-full bg-brand-surface-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-muted">{String(order.status || "Pending").replace(/_/g, " ")}</span></div>
                  </div>)}
                </div> : <p className="rounded-xl bg-brand-surface-soft p-5 text-center text-xs text-brand-muted">No orders have been placed yet.</p>}
              </section>
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
              <div className="bg-white p-4 rounded-2xl border border-brand-gold/30 shadow-xs space-y-3">
                {/* Search Input + Counts */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-brown/50" size={16} />
                    <input
                      type="text"
                      value={searchProduct}
                      onChange={(e) => {
                        setSearchProduct(e.target.value);
                        setProductPage(1);
                      }}
                      placeholder="Search products by name, SKU, category, or coupon..."
                      className="w-full pl-9 pr-8 py-2 bg-brand-surface/50 rounded-xl border border-brand-gold/40 text-xs font-semibold text-brand-charcoal placeholder:text-brand-charcoal/50 focus:outline-none focus:ring-1 focus:ring-brand-deep"
                    />
                    {searchProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchProduct("");
                          setProductPage(1);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-brown/50 hover:text-brand-danger p-0.5 rounded-full"
                        title="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-brown shrink-0">
                    <span className="px-3 py-1 rounded-full bg-brand-turmeric/30 border border-brand-gold/30 text-ui-11">
                      Total: <strong className="text-brand-deep">{products.length}</strong>
                    </span>
                    {(searchProduct || productCategoryFilter !== "all" || productStatusFilter !== "all" || productSort !== "newest") && (
                      <span className="px-3 py-1 rounded-full bg-brand-positive-soft border border-brand-positive/40 text-brand-positive-dark text-ui-11">
                        Filtered: <strong>{filteredProducts.length}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Filters: Category Filter, Sort Filter (New to Old, High to Low, etc.), Status Filter */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-brand-gold/20 text-xs">
                  {/* Category Filter */}
                  <div className="flex items-center gap-1.5 bg-brand-surface/70 px-3 py-1.5 rounded-xl border border-brand-gold/40 shadow-xs">
                    <Filter size={13} className="text-brand-deep shrink-0" />
                    <span className="text-ui-11 font-extrabold text-brand-brown whitespace-nowrap">Category:</span>
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => {
                        setProductCategoryFilter(e.target.value);
                        setProductPage(1);
                      }}
                      className="bg-transparent font-extrabold text-brand-brown focus:outline-none cursor-pointer text-xs"
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
                  <div className="flex items-center gap-1.5 bg-brand-surface/70 px-3 py-1.5 rounded-xl border border-brand-gold/40 shadow-xs">
                    <ArrowUpDown size={13} className="text-brand-deep shrink-0" />
                    <span className="text-ui-11 font-extrabold text-brand-brown whitespace-nowrap">Sort:</span>
                    <select
                      value={productSort}
                      onChange={(e) => {
                        setProductSort(e.target.value);
                        setProductPage(1);
                      }}
                      className="bg-transparent font-extrabold text-brand-brown focus:outline-none cursor-pointer text-xs"
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
                  <div className="flex items-center gap-1.5 bg-brand-surface/70 px-3 py-1.5 rounded-xl border border-brand-gold/40 shadow-xs">
                    <span className="text-ui-11 font-extrabold text-brand-brown whitespace-nowrap">Status:</span>
                    <select
                      value={productStatusFilter}
                      onChange={(e) => {
                        setProductStatusFilter(e.target.value);
                        setProductPage(1);
                      }}
                      className="bg-transparent font-extrabold text-brand-brown focus:outline-none cursor-pointer text-xs"
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
                      className="ml-auto px-3 py-1.5 text-ui-11 font-extrabold text-brand-deep hover:bg-brand-deep/10 rounded-xl transition border border-brand-deep/40 flex items-center gap-1.5 bg-white shadow-xs"
                    >
                      <RotateCcw size={12} />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="hidden overflow-x-auto rounded-xl border border-brand-gold/30 bg-white shadow-sm xl:block">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-brand-turmeric/20 text-brand-brown font-extrabold uppercase border-b border-brand-gold/30">
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Coupon</th>
                      <th className="p-3">Price / MRP</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--brand-gold)]/20">
                    {filteredProducts.length === 0 && (
                      <EmptyRow
                        cols={7}
                        text={searchProduct ? `No products matching "${searchProduct}".` : "No products found."}
                      />
                    )}
                    {paginatedProducts.map(p => (
                      <tr key={p.id} className="hover:bg-brand-surface/50 transition">
                        <td className="p-3 font-bold text-brand-brown">
                          <div className="flex items-center gap-2.5">
                            {(() => {
                              const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url;
                              return primaryImg ? (
                                <img src={primaryImg} alt="" className="w-9 h-9 rounded-lg object-contain bg-brand-surface border border-brand-gold/30 shrink-0" />
                              ) : null;
                            })()}
                            <div>
                              <span className="block font-bold text-brand-brown">{p.name}</span>
                              {p.images && p.images.length > 1 && (
                                <span className="inline-flex items-center gap-0.5 text-ui-9 text-brand-deep font-extrabold bg-brand-surface-warm px-1.5 py-0.2 rounded border border-brand-accent/40">
                                  📷 {p.images.length} photos
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-brand-charcoal/80">
                          {p.categories?.[0]?.category?.name ? (
                            <div>
                              <span className="font-bold text-brand-brown block">{p.categories[0].category.name}</span>
                              {(p.subcategory?.name || p.subCategory) && (
                                <span className="inline-block px-1.5 py-0.5 rounded text-ui-9 font-extrabold bg-brand-surface-warm text-brand-deep border border-brand-accent/50 mt-0.5">
                                  › {p.subcategory?.name || p.subCategory}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-brand-charcoal/40 italic">None</span>
                          )}
                        </td>
                        <td className="p-3 font-mono">
                          {p.couponCode ? <span className="bg-brand-turmeric/30 text-brand-deep px-2 py-0.5 rounded border border-brand-gold/40">{p.couponCode}</span> : <span className="text-brand-charcoal/40">—</span>}
                        </td>
                        <td className="p-3 font-bold text-brand-deep">
                          {p.price > 0 ? (
                            <>
                              ₹{p.price}
                              {p.mrp > 0 && p.mrp !== p.price && (
                                <span className="line-through text-ui-10 text-brand-charcoal/40 font-normal ml-1">₹{p.mrp}</span>
                              )}
                            </>
                          ) : (
                            <span className="text-ui-11 font-semibold text-brand-brown/60">Empty (₹0)</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-extrabold ${p.stockQuantity > 0 ? "bg-brand-positive-soft text-brand-positive-dark" : "bg-[#FCE8E6] text-[#C5221F]"}`}>{p.stockQuantity}</span>
                        </td>
                        <td className="p-3"><StatusBadge active={p.isActive} /></td>
                        <td className="p-3 text-right"><ActionBtns onEdit={() => openProductModal(p)} onDelete={() => deleteProduct(p.id, p.name)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 gap-3 p-1 md:grid-cols-2 xl:hidden">
                {filteredProducts.length === 0 && <div className="rounded-2xl border border-[#DDE5E9] bg-white p-8 text-center text-sm text-[#526873] md:col-span-2">{searchProduct ? `No products matching "${searchProduct}".` : "No products found."}</div>}
                {paginatedProducts.map((p) => {
                  const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url;
                  const categoryName = p.categories?.[0]?.category?.name || "Uncategorized";
                  return <article key={p.id} className="min-w-0 rounded-2xl border border-[#DDE5E9] bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      {primaryImg ? <img src={primaryImg} alt="" className="h-16 w-16 shrink-0 rounded-xl border border-[#E3E9EC] bg-[#F6F8F9] object-contain" /> : <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-[#F3F6F8] text-[#82939A]"><Package size={21} /></div>}
                      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="min-w-0 flex-1 truncate text-sm font-extrabold text-[#173B42]">{p.name}</h3><StatusBadge active={p.isActive} /></div><p className="mt-1 truncate text-xs text-[#526873]">{categoryName}{(p.subcategory?.name || p.subCategory) ? ` · ${p.subcategory?.name || p.subCategory}` : ""}</p><p className="mt-1 text-[11px] text-[#71828A]">SKU: {p.sku || "—"}</p></div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-[#F6F8F9] p-3 text-xs">
                      <div><span className="block text-[10px] font-bold uppercase tracking-wide text-[#71828A]">Price / MRP</span><span className="mt-1 block font-extrabold text-[#A7193D]">₹{p.price || 0}{p.mrp > 0 && p.mrp !== p.price && <span className="ml-1 font-medium text-[#819098] line-through">₹{p.mrp}</span>}</span></div>
                      <div><span className="block text-[10px] font-bold uppercase tracking-wide text-[#71828A]">Stock</span><span className={`mt-1 inline-flex rounded-full px-2 py-0.5 font-bold ${p.stockQuantity > 0 ? "bg-[#DDF4EE] text-[#0F766E]" : "bg-[#FCE7ED] text-[#A7193D]"}`}>{p.stockQuantity || 0}</span></div>
                      <div><span className="block text-[10px] font-bold uppercase tracking-wide text-[#71828A]">Coupon</span><span className="mt-1 block truncate font-semibold text-[#344A51]">{p.couponCode || "—"}</span></div>
                      <div><span className="block text-[10px] font-bold uppercase tracking-wide text-[#71828A]">Photos</span><span className="mt-1 block font-semibold text-[#344A51]">{p.images?.length || 0}</span></div>
                    </div>
                    <div className="mt-3 flex justify-end border-t border-[#EDF1F3] pt-3"><ActionBtns onEdit={() => openProductModal(p)} onDelete={() => deleteProduct(p.id, p.name)} /></div>
                  </article>;
                })}
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
                  <p className="text-xs text-brand-charcoal/60 col-span-3">
                    {searchCategory ? `No categories matching "${searchCategory}".` : "No categories found."}
                  </p>
                )}
                {paginatedCategories.map(cat => (
                  <div key={cat.id} className="p-4 bg-white rounded-2xl border border-brand-gold/30 shadow-sm space-y-2 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-gold/30 bg-brand-surface-warm">
                          {cat.imageUrl ? (
                            <img src={cat.imageUrl} alt={`${cat.name} category`} loading="lazy" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-brand-brown/60">
                              <ImageIcon size={19} />
                              <span className="text-[9px] font-semibold">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-brand-brown">{cat.name}</h4>
                          {cat.parent && (
                            <span className="inline-block px-2 py-0.5 bg-brand-surface-warm text-brand-deep border border-brand-accent/50 rounded text-ui-9 font-bold">
                              Subcategory of: {cat.parent.name}
                            </span>
                          )}
                          <span className="block text-ui-10 font-mono text-brand-deep">/{cat.slug}</span>
                          <span className={`mt-1 inline-flex items-center gap-1 text-ui-10 font-semibold ${cat.imageUrl ? "text-brand-positive-dark" : "text-brand-danger"}`}>
                            <ImageIcon size={11} />{cat.imageUrl ? "Shop image set" : "Add an image for the shop"}
                          </span>
                        </div>
                      </div>
                      <StatusBadge active={cat.isActive} />
                    </div>
                    <p className="text-xs text-brand-charcoal/70 flex-1">{cat.description || "No description."}</p>
                    {cat.children && cat.children.length > 0 && (
                      <div className="pt-1.5 pb-1 border-t border-brand-gold/20 space-y-1">
                        <span className="text-ui-10 font-extrabold uppercase tracking-wider text-brand-deep block">
                          Subcategories ({cat.children.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {cat.children.map((child: any) => (
                            <span key={child.id} className="px-2 py-0.5 rounded bg-brand-surface-warm border border-brand-accent/50 text-ui-10 font-bold text-brand-brown">
                              {child.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      {!cat.parentId && (
                        <button onClick={() => openCategoryModal(undefined, cat.id)} className="px-2.5 py-1.5 text-ui-10 font-bold text-brand-positive-dark bg-brand-positive-soft rounded-lg hover:bg-[#C8E6C9] transition flex items-center justify-center gap-1" title="Add Subcategory">
                          <Plus size={12} />Subcategory
                        </button>
                      )}
                      <button onClick={() => openCategoryModal(cat)} title="Edit category details or upload its shop image" className="flex-1 py-1.5 text-ui-10 font-bold text-brand-brown bg-brand-turmeric/30 rounded-lg hover:bg-brand-turmeric/60 transition flex items-center justify-center gap-1"><Edit2 size={12} />Edit / Image</button>
                      <button onClick={() => deleteCategory(cat.id, cat.name)} className="flex-1 py-1.5 text-ui-10 font-bold text-brand-danger bg-[#FEF2F2] rounded-lg hover:bg-[#FCA5A5]/30 transition flex items-center justify-center gap-1"><Trash2 size={12} />Delete</button>
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
                  <p className="text-xs text-brand-charcoal/60 col-span-2">
                    {searchBanner ? `No banners matching "${searchBanner}".` : "No banners found."}
                  </p>
                )}
                {paginatedBanners.map(ban => (
                  <div key={ban.id} className="p-4 bg-white rounded-2xl border border-brand-gold/30 shadow-sm space-y-3">
                    {ban.desktopImage && <img src={ban.desktopImage} alt="" className="w-full h-32 object-cover rounded-xl border" />}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="bg-brand-deep text-white text-ui-9 font-extrabold px-2 py-0.5 rounded uppercase">{ban.position}</span>
                        <h4 className="font-bold text-sm text-brand-brown mt-1">{ban.title}</h4>
                        <p className="text-xs text-brand-charcoal/70">{ban.subtitle}</p>
                      </div>
                      <StatusBadge active={ban.isActive} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openBannerModal(ban)} className="flex-1 py-1.5 text-ui-10 font-bold text-brand-brown bg-brand-turmeric/30 rounded-lg hover:bg-brand-turmeric/60 transition flex items-center justify-center gap-1"><Edit2 size={12} />Edit</button>
                      <button onClick={() => deleteBanner(ban.id, ban.title)} className="flex-1 py-1.5 text-ui-10 font-bold text-brand-danger bg-[#FEF2F2] rounded-lg hover:bg-[#FCA5A5]/30 transition flex items-center justify-center gap-1"><Trash2 size={12} />Delete</button>
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
            <div className="space-y-6">
              <SectionHeader
                title="Customer Orders & Fulfillment"
                subtitle="Manage order stages, customer profiles, shipping dispatch, and courier tracking numbers."
              />

              {/* STAGE SUB-TABS (MATCHING IMAGE 1) */}
              <div className="border-b-2 border-brand-gold/30 bg-white/80 rounded-2xl p-2 flex items-center overflow-x-auto gap-2 text-xs font-bold shadow-xs">
                {[
                  { key: "pending", label: "Pending (Payment / Verify)", count: orderCounts.pending, color: "bg-amber-100 text-amber-800" },
                  { key: "confirmed", label: "Confirmed", count: orderCounts.confirmed, color: "bg-emerald-100 text-emerald-800" },
                  { key: "ready_to_ship", label: "Ready to Ship", count: orderCounts.readyToShip, color: "bg-blue-100 text-blue-800" },
                  { key: "dispatched", label: "Dispatched", count: orderCounts.dispatched, color: "bg-purple-100 text-purple-800" },
                  { key: "returned", label: "Returned", count: orderCounts.returned, color: "bg-rose-100 text-rose-800" },
                  { key: "all", label: "All Orders", count: orderCounts.all, color: "bg-gray-100 text-gray-800" },
                ].map((tab) => {
                  const isActive = orderSubTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => {
                        navigateToOrderStage(tab.key);
                      }}
                      className={`relative px-4 py-2.5 rounded-xl transition flex items-center gap-2 border whitespace-nowrap ${
                        isActive
                          ? "bg-[#173B42] text-white border-[#173B42] shadow-md shadow-[#173B42]/20 font-extrabold ring-2 ring-[#173B42]/15"
                          : "bg-white text-[#344A51] border-[#D4DEE2] hover:bg-[#F1F6F7] hover:border-[#71868F]"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-ui-10 font-extrabold ${
                          isActive ? "bg-white/20 text-white" : tab.color
                        }`}
                      >
                        ({tab.count})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Orders Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-brand-gold/30 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-brown/50" size={16} />
                    <input
                      type="text"
                      value={searchOrder}
                      onChange={(e) => {
                        setSearchOrder(e.target.value);
                        setOrderPage(1);
                      }}
                      placeholder="Search by order #, email, phone, courier tracking #, or address..."
                      className="w-full pl-9 pr-8 py-2 bg-brand-surface/50 rounded-xl border border-brand-gold/40 text-xs font-semibold text-brand-charcoal placeholder:text-brand-charcoal/50 focus:outline-none focus:ring-1 focus:ring-brand-deep"
                    />
                    {searchOrder && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchOrder("");
                          setOrderPage(1);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-brown/50 hover:text-brand-danger p-0.5 rounded-full"
                        title="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-brown shrink-0">
                    <span className="px-3 py-1 rounded-full bg-brand-turmeric/30 border border-brand-gold/30 text-ui-11">
                      Total: <strong className="text-brand-deep">{orders.length}</strong>
                    </span>
                    {(searchOrder || orderMonthFilter !== "all" || orderStatusFilter !== "all" || orderSort !== "newest") && (
                      <span className="px-3 py-1 rounded-full bg-brand-positive-soft border border-brand-positive/40 text-brand-positive-dark text-ui-11">
                        Filtered: <strong>{filteredOrders.length}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-brand-gold/20 text-xs">
                  {/* MONTH-WISE FILTER */}
                  <div className="flex items-center gap-1.5 bg-brand-surface/70 px-3 py-1.5 rounded-xl border border-brand-gold/40 shadow-xs">
                    <Calendar size={13} className="text-brand-deep shrink-0" />
                    <span className="text-ui-11 font-extrabold text-brand-brown whitespace-nowrap">Month:</span>
                    <select
                      value={orderMonthFilter}
                      onChange={(e) => {
                        setOrderMonthFilter(e.target.value);
                        setOrderPage(1);
                      }}
                      className="bg-transparent font-extrabold text-brand-brown focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="all">All Months</option>
                      {orderMonthOptions.map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>



                  {/* Sort Filter */}
                  <div className="flex items-center gap-1.5 bg-brand-surface/70 px-3 py-1.5 rounded-xl border border-brand-gold/40 shadow-xs">
                    <ArrowUpDown size={13} className="text-brand-deep shrink-0" />
                    <span className="text-ui-11 font-extrabold text-brand-brown whitespace-nowrap">Sort:</span>
                    <select
                      value={orderSort}
                      onChange={(e) => {
                        setOrderSort(e.target.value);
                        setOrderPage(1);
                      }}
                      className="bg-transparent font-extrabold text-brand-brown focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="newest">New to Old (Newest First)</option>
                      <option value="oldest">Old to New (Oldest First)</option>
                      <option value="amount-high">Amount: High to Low (₹ High → Low)</option>
                      <option value="amount-low">Amount: Low to High (₹ Low → High)</option>
                    </select>
                  </div>

                  {(searchOrder || orderMonthFilter !== "all" || orderSort !== "newest") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOrder("");
                        setOrderMonthFilter("all");
                        setOrderSort("newest");
                        setOrderPage(1);
                      }}
                      className="ml-auto px-3 py-1.5 text-ui-11 font-extrabold text-brand-deep hover:bg-brand-deep/10 rounded-xl transition border border-brand-deep/40 flex items-center gap-1.5 bg-white shadow-xs"
                    >
                      <RotateCcw size={12} />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ORDERS TABLE */}
              <div className="hidden overflow-x-auto rounded-2xl border border-brand-gold/30 bg-white shadow-sm xl:block">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-brand-turmeric/20 text-brand-brown font-extrabold uppercase border-b border-brand-gold/30">
                      <th className="p-3">Order Details</th>
                      <th className="p-3">Customer Profile & Address</th>
                      <th className="p-3">Amount & Items</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Courier / Dispatch Notes</th>
                      <th className="p-3 text-right">Stage Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--brand-gold)]/20">
                    {filteredOrders.length === 0 && (
                      <EmptyRow
                        cols={6}
                        text={
                          searchOrder
                            ? `No orders matching "${searchOrder}".`
                            : `No orders in "${orderSubTab.replace(/_/g, " ")}" stage.`
                        }
                      />
                    )}
                    {paginatedOrders.map((ord) => {
                      const addr = parseShippingAddress(ord.shippingAddress);
                      const st = (ord.status || "").toUpperCase();
                      const pst = (ord.paymentStatus || "").toUpperCase();
                      const isCod = (ord.paymentMethod || "").toUpperCase() === "COD";

                      const isOrderPending = (st === "PENDING" || (pst === "PENDING" && !isCod)) && st !== "CANCELLED" && st !== "RETURNED";
                      const isOrderConfirmed = st === "CONFIRMED" && !isOrderPending && st !== "CANCELLED" && st !== "RETURNED";
                      const isReadyToShipStage = (st === "READY_TO_SHIP" || st === "PROCESSING") && !isOrderPending && st !== "CANCELLED" && st !== "RETURNED";
                      const isDispatchedStage = (st === "DISPATCHED" || st === "SHIPPED") && st !== "CANCELLED" && st !== "RETURNED";
                      const isDeliveredStage = st === "DELIVERED";
                      const isReturnedStage = st === "RETURNED" || st === "CANCELLED";

                      return (
                        <tr key={ord.id} className="hover:bg-brand-surface/50 transition">
                          {/* Order Details */}
                          <td className="p-3 align-top space-y-1">
                            <span className="font-bold font-mono text-brand-brown block text-xs">{ord.orderNumber}</span>
                            <span className="text-ui-10 text-brand-charcoal/60 block flex items-center gap-1">
                              <Clock size={11} className="shrink-0" />
                              {ord.createdAt ? new Date(ord.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "N/A"}
                            </span>
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-ui-10 font-extrabold ${
                                isDispatchedStage
                                  ? "bg-purple-100 text-purple-800 border border-purple-300"
                                  : isDeliveredStage
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : isReadyToShipStage
                                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                                  : isReturnedStage
                                  ? "bg-rose-100 text-rose-800 border border-rose-300"
                                  : isOrderPending
                                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                                  : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              }`}
                            >
                              {isOrderPending ? "PENDING (PAYMENT)" : ord.status.replace(/_/g, " ")}
                            </span>
                          </td>

                          {/* Customer Profile & Address */}
                          <td className="p-3 align-top space-y-1.5 max-w-xs">
                            <div>
                              <span className="font-bold text-brand-brown block flex items-center gap-1">
                                <Mail size={12} className="text-brand-deep shrink-0" />
                                {ord.customerEmail}
                              </span>
                              <span className="text-ui-11 text-brand-charcoal/70 font-semibold block flex items-center gap-1">
                                <Phone size={11} className="text-brand-brown/60 shrink-0" />
                                {ord.customerPhone || addr.phone || "No Phone"}
                              </span>
                            </div>

                            {/* Delivery Address */}
                            <div className="text-ui-11 text-brand-charcoal/80 bg-brand-surface/80 p-2 rounded-xl border border-brand-gold/30 space-y-0.5">
                              <div className="font-bold text-brand-brown flex items-center gap-1 text-ui-10 uppercase">
                                <MapPin size={11} className="text-brand-deep" />
                                <span>Delivery Address</span>
                              </div>
                              <p className="line-clamp-2 text-ui-10 leading-relaxed">{addr.addressText}</p>
                            </div>

                            {/* Clickable Customer Profile Button */}
                            <button
                              type="button"
                              onClick={() => openCustomerProfile(ord)}
                              className="px-2.5 py-1 text-ui-10 font-extrabold text-brand-brown bg-brand-turmeric/30 hover:bg-brand-turmeric/70 rounded-lg border border-brand-gold/40 transition flex items-center gap-1"
                            >
                              <User size={11} />
                              <span>View Customer Profile & History</span>
                            </button>
                          </td>

                          {/* Amount & Items */}
                          <td className="p-3 align-top space-y-1">
                            <span className="font-extrabold text-sm text-brand-deep block">₹{ord.totalAmount}</span>
                            <span className="text-ui-10 text-brand-charcoal/70 block font-semibold">
                              {Array.isArray(ord.items) ? `${ord.items.length} item(s)` : "1 item"}
                            </span>
                            {Array.isArray(ord.items) && ord.items[0] && (
                              <div className="text-ui-10 text-brand-brown font-medium truncate max-w-[140px]">
                                • {ord.items[0].productNameSnapshot || ord.items[0].productName || ord.items[0].product?.name}
                              </div>
                            )}
                          </td>

                          {/* Payment */}
                          <td className="p-3 align-top">
                            <span className="uppercase text-ui-10 font-extrabold px-2 py-0.5 bg-brand-surface text-brand-brown rounded border border-brand-gold/40 inline-block mb-1">
                              {ord.paymentMethod || "COD"}
                            </span>
                            <span
                              className={`block text-ui-9 font-bold ${
                                ord.paymentStatus === "COMPLETED" ? "text-emerald-700" : "text-amber-700"
                              }`}
                            >
                              Payment: {ord.paymentStatus || "PENDING"}
                            </span>
                          </td>

                          {/* Courier / Dispatch Notes Section */}
                          <td className="p-3 align-top max-w-xs">
                            {addr.trackingNumber || addr.courierName || addr.courierNote ? (
                              <div className="p-2 bg-[#F3E8FF] rounded-xl border border-purple-200 text-purple-900 space-y-1 text-ui-11">
                                {addr.courierName && (
                                  <div className="font-extrabold text-ui-10 flex items-center gap-1 text-purple-900">
                                    <Truck size={12} className="text-purple-700" />
                                    <span>{addr.courierName}</span>
                                  </div>
                                )}
                                {addr.trackingNumber && (
                                  <div className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-purple-200 inline-block text-purple-900">
                                    No: {addr.trackingNumber}
                                  </div>
                                )}
                                {addr.courierNote && (
                                  <p className="text-ui-10 italic text-purple-800 line-clamp-2">
                                    &quot;{addr.courierNote}&quot;
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-ui-10 text-gray-400 italic">No courier info added yet</span>
                            )}
                          </td>

                          {/* Stage Actions */}
                          <td className="p-3 align-top text-right space-y-2">
                            {/* Fast Action Buttons Based on Current Stage */}
                            {isOrderPending && (
                              <div className="space-y-1.5">
                                <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-800 text-ui-10 font-extrabold rounded border border-amber-200">
                                  Payment Pending ⏳
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Confirm order ${ord.orderNumber} and verify payment?`)) {
                                      updateOrderStatus(ord.id, "CONFIRMED", undefined, isCod ? undefined : "COMPLETED");
                                    }
                                  }}
                                  className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-ui-11 font-extrabold rounded-xl shadow transition flex items-center justify-center gap-1"
                                  title="Confirm order & mark payment received"
                                >
                                  <Check size={12} />
                                  <span>Confirm Order ✓</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Cancel pending order ${ord.orderNumber}?`)) {
                                      updateOrderStatus(ord.id, "CANCELLED");
                                    }
                                  }}
                                  className="w-full py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-ui-10 font-bold rounded-lg border border-rose-200 transition flex items-center justify-center gap-1"
                                >
                                  <span>Cancel Order ✕</span>
                                </button>
                              </div>
                            )}

                            {isOrderConfirmed && (
                              <div className="space-y-1.5">
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(ord.id, "READY_TO_SHIP")}
                                  className="w-full py-1.5 px-3 bg-brand-deep hover:bg-brand-deep-hover text-white text-ui-11 font-extrabold rounded-xl shadow transition flex items-center justify-center gap-1"
                                >
                                  <span>Ready to Ship →</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Cancel confirmed order ${ord.orderNumber}?`)) {
                                      updateOrderStatus(ord.id, "CANCELLED");
                                    }
                                  }}
                                  className="w-full py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-ui-10 font-bold rounded-lg border border-rose-200 transition flex items-center justify-center gap-1"
                                >
                                  <span>Cancel Order ✕</span>
                                </button>
                              </div>
                            )}

                            {isReadyToShipStage && (
                              <div className="space-y-1.5">
                                <button
                                  type="button"
                                  onClick={() => openDispatchModal(ord, "DISPATCHED")}
                                  className="w-full py-1.5 px-3 bg-purple-700 hover:bg-purple-800 text-white text-ui-11 font-extrabold rounded-xl shadow transition flex items-center justify-center gap-1"
                                >
                                  <Truck size={13} />
                                  <span>Dispatch Order 📦</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Cancel order ${ord.orderNumber}?`)) {
                                      updateOrderStatus(ord.id, "CANCELLED");
                                    }
                                  }}
                                  className="w-full py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-ui-10 font-bold rounded-lg border border-rose-200 transition flex items-center justify-center gap-1"
                                >
                                  <span>Cancel Order ✕</span>
                                </button>
                              </div>
                            )}

                            {isDispatchedStage && (
                              <div className="space-y-1">
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(ord.id, "DELIVERED")}
                                  className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-ui-10 font-extrabold rounded-lg shadow-xs transition flex items-center justify-center gap-1"
                                >
                                  <Check size={12} />
                                  <span>Mark Delivered ✓</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openDispatchModal(ord, "DISPATCHED")}
                                  className="w-full py-1 px-2 bg-purple-100 hover:bg-purple-200 text-purple-900 text-ui-10 font-bold rounded-lg border border-purple-300 transition flex items-center justify-center gap-1"
                                >
                                  <Edit2 size={11} />
                                  <span>Edit Courier No</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Mark order ${ord.orderNumber} as returned?`)) {
                                      updateOrderStatus(ord.id, "RETURNED");
                                    }
                                  }}
                                  className="w-full py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-ui-10 font-bold rounded-lg border border-rose-200 transition flex items-center justify-center gap-1"
                                >
                                  <span>Mark Returned ↩️</span>
                                </button>
                              </div>
                            )}

                            {isDeliveredStage && (
                              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-ui-10 font-extrabold rounded-lg border border-emerald-300">
                                Delivered ✓
                              </span>
                            )}

                            {isReturnedStage && (
                              <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 text-ui-10 font-extrabold rounded-lg border border-rose-300">
                                {st === "CANCELLED" ? "Cancelled ✕" : "Returned ↩️"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 gap-3 p-1 md:grid-cols-2 xl:hidden">
                {filteredOrders.length === 0 && <div className="rounded-2xl border border-[#DDE5E9] bg-white p-8 text-center text-sm text-[#526873] md:col-span-2">{searchOrder ? `No orders matching "${searchOrder}".` : `No orders in "${orderSubTab.replace(/_/g, " ")}" stage.`}</div>}
                {paginatedOrders.map((ord) => {
                  const addr = parseShippingAddress(ord.shippingAddress);
                  const st = String(ord.status || "PENDING").toUpperCase();
                  const pst = String(ord.paymentStatus || "PENDING").toUpperCase();
                  const isCod = String(ord.paymentMethod || "").toUpperCase() === "COD";
                  const isPending = (st === "PENDING" || (pst === "PENDING" && !isCod)) && st !== "CANCELLED" && st !== "RETURNED";
                  const isConfirmed = st === "CONFIRMED" && !isPending;
                  const isReady = (st === "READY_TO_SHIP" || st === "PROCESSING") && !isPending;
                  const isDispatched = st === "DISPATCHED" || st === "SHIPPED";
                  const isDelivered = st === "DELIVERED";
                  const isReturned = st === "RETURNED" || st === "CANCELLED";
                  const statusClass = isPending ? "border-amber-200 bg-amber-50 text-amber-800" : isReady ? "border-blue-200 bg-blue-50 text-blue-800" : isDispatched ? "border-purple-200 bg-purple-50 text-purple-800" : isReturned ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800";
                  const placedDate = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Date unavailable";

                  return <article key={ord.id} className="min-w-0 space-y-4 rounded-2xl border border-[#DDE5E9] bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3 border-b border-[#EDF1F3] pb-3">
                      <div className="min-w-0"><p className="truncate font-mono text-sm font-extrabold text-[#173B42]">{ord.orderNumber || "Order"}</p><p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#637680]"><Clock size={12} />{placedDate}</p></div>
                      <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${statusClass}`}>{isPending ? "Payment pending" : st.replace(/_/g, " ")}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="min-w-0 rounded-xl bg-[#F6F8F9] p-3">
                        <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#71828A]">Customer</p>
                        <p className="break-all text-xs font-bold text-[#173B42]">{ord.customerEmail || "Email not provided"}</p>
                        <p className="mt-1 text-xs text-[#526873]">{ord.customerPhone || addr.phone || "Phone not provided"}</p>
                        <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-5 text-[#526873]"><MapPin size={13} className="mt-0.5 shrink-0 text-[#A7193D]" /><span>{addr.addressText}</span></p>
                        <button type="button" onClick={() => openCustomerProfile(ord)} className="mt-3 min-h-10 w-full rounded-lg border border-[#D7E0E4] bg-white px-3 py-2 text-[11px] font-bold text-[#173B42] transition hover:border-[#A7193D]/40 hover:text-[#A7193D]"><User size={13} className="mr-1.5 inline" />View customer history</button>
                      </div>
                      <div className="rounded-xl bg-[#F6F8F9] p-3">
                        <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#71828A]">Order & payment</p>
                        <p className="text-xl font-extrabold text-[#A7193D]">₹{Number(ord.totalAmount || 0).toLocaleString("en-IN")}</p>
                        <p className="mt-1 text-xs font-semibold text-[#344A51]">{Array.isArray(ord.items) ? `${ord.items.length} item(s)` : "1 item"}{Array.isArray(ord.items) && ord.items[0] ? ` · ${ord.items[0].productNameSnapshot || ord.items[0].productName || ord.items[0].product?.name || "Product"}` : ""}</p>
                        <div className="mt-3 flex flex-wrap gap-2"><span className="rounded-lg border border-[#D7E0E4] bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase text-[#344A51]">{ord.paymentMethod || "COD"}</span><span className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase ${pst === "COMPLETED" ? "bg-[#DDF4EE] text-[#0F766E]" : "bg-amber-50 text-amber-800"}`}>{pst}</span></div>
                      </div>
                    </div>

                    {(addr.trackingNumber || addr.courierName || addr.courierNote) && <div className="rounded-xl border border-purple-200 bg-purple-50 p-3 text-xs text-purple-950"><p className="font-extrabold"><Truck size={13} className="mr-1.5 inline" />{addr.courierName || "Courier"}</p>{addr.trackingNumber && <p className="mt-1 break-all font-mono font-bold">Tracking: {addr.trackingNumber}</p>}{addr.courierNote && <p className="mt-1 text-[11px]">{addr.courierNote}</p>}</div>}

                    <div className="grid grid-cols-1 gap-2 border-t border-[#EDF1F3] pt-3 sm:grid-cols-2">
                      {isPending && <><button type="button" onClick={() => { if (confirm(`Confirm order ${ord.orderNumber} and verify payment?`)) updateOrderStatus(ord.id, "CONFIRMED", undefined, isCod ? undefined : "COMPLETED"); }} className="min-h-11 rounded-xl bg-emerald-700 px-3 py-2.5 text-xs font-extrabold text-white transition hover:bg-emerald-800"><Check size={14} className="mr-1.5 inline" />Confirm order</button><button type="button" onClick={() => { if (confirm(`Cancel pending order ${ord.orderNumber}?`)) updateOrderStatus(ord.id, "CANCELLED"); }} className="min-h-11 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-800 transition hover:bg-rose-100">Cancel order</button></>}
                      {isConfirmed && <><button type="button" onClick={() => updateOrderStatus(ord.id, "READY_TO_SHIP")} className="min-h-11 rounded-xl bg-[#173B42] px-3 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#0F2C32]">Ready to ship <ArrowRight size={14} className="ml-1 inline" /></button><button type="button" onClick={() => { if (confirm(`Cancel confirmed order ${ord.orderNumber}?`)) updateOrderStatus(ord.id, "CANCELLED"); }} className="min-h-11 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-800 transition hover:bg-rose-100">Cancel order</button></>}
                      {isReady && <><button type="button" onClick={() => openDispatchModal(ord, "DISPATCHED")} className="min-h-11 rounded-xl bg-purple-700 px-3 py-2.5 text-xs font-extrabold text-white transition hover:bg-purple-800"><Truck size={14} className="mr-1.5 inline" />Dispatch order</button><button type="button" onClick={() => { if (confirm(`Cancel order ${ord.orderNumber}?`)) updateOrderStatus(ord.id, "CANCELLED"); }} className="min-h-11 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-800 transition hover:bg-rose-100">Cancel order</button></>}
                      {isDispatched && <><button type="button" onClick={() => updateOrderStatus(ord.id, "DELIVERED")} className="min-h-11 rounded-xl bg-emerald-700 px-3 py-2.5 text-xs font-extrabold text-white transition hover:bg-emerald-800"><Check size={14} className="mr-1.5 inline" />Mark delivered</button><button type="button" onClick={() => openDispatchModal(ord, "DISPATCHED")} className="min-h-11 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2.5 text-xs font-bold text-purple-900 transition hover:bg-purple-100"><Edit2 size={14} className="mr-1.5 inline" />Edit courier</button><button type="button" onClick={() => { if (confirm(`Mark order ${ord.orderNumber} as returned?`)) updateOrderStatus(ord.id, "RETURNED"); }} className="min-h-11 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-800 transition hover:bg-rose-100 sm:col-span-2">Mark returned</button></>}
                      {isDelivered && <p className="rounded-xl bg-emerald-50 px-3 py-3 text-center text-xs font-extrabold text-emerald-800 sm:col-span-2">Delivered</p>}
                      {isReturned && <p className="rounded-xl bg-rose-50 px-3 py-3 text-center text-xs font-extrabold text-rose-800 sm:col-span-2">{st === "CANCELLED" ? "Cancelled" : "Returned"}</p>}
                    </div>
                  </article>;
                })}
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
                  <p className="text-xs text-brand-charcoal/60 col-span-3">
                    {searchCoupon ? `No coupons matching "${searchCoupon}".` : "No coupons yet."}
                  </p>
                )}
                {paginatedCoupons.map(cp => (
                  <div key={cp.id} className="p-4 bg-white rounded-2xl border border-brand-gold/30 shadow-sm space-y-2">
                    <span className="font-mono text-base font-extrabold text-brand-deep bg-brand-turmeric/20 px-3 py-1 rounded-lg border border-brand-gold/40 inline-block">{cp.code}</span>
                    <p className="text-xs font-bold text-brand-brown">{cp.discountPercent}% Discount</p>
                    <p className="text-ui-11 text-brand-charcoal/70">Min Order: ₹{cp.minOrderAmount}</p>
                    <p className="text-ui-10 text-brand-charcoal/50">Expires: {new Date(cp.expiryDate).toLocaleDateString()}</p>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => openCouponModal(cp)} className="flex-1 py-1.5 text-ui-10 font-bold text-brand-brown bg-brand-turmeric/30 rounded-lg hover:bg-brand-turmeric/60 transition flex items-center justify-center gap-1"><Edit2 size={12} />Edit</button>
                      <button onClick={() => deleteCoupon(cp.id, cp.code)} className="flex-1 py-1.5 text-ui-10 font-bold text-brand-danger bg-[#FEF2F2] rounded-lg hover:bg-[#FCA5A5]/30 transition flex items-center justify-center gap-1"><Trash2 size={12} />Delete</button>
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

          {activeTab === "collections" && (
            <div className="space-y-5">
              <SectionHeader title="Manage Collections" subtitle="Create collections and choose which database products appear in each one." action={<AddBtn onClick={() => openCollectionModal()} label="Add Collection" />} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collections.map((item) => <div key={item.id} className="p-4 bg-white rounded-2xl border border-brand-gold/30 space-y-2">
                  <div className="flex items-center justify-between"><h3 className="font-bold text-brand-brown">{item.title}</h3><StatusBadge active={item.isActive} /></div>
                  <p className="text-xs text-brand-charcoal/70">{item.description || "No description"}</p>
                  <p className="text-ui-11 text-brand-charcoal/60">{item.products?.length || 0} linked products</p>
                  <div className="flex gap-2"><button onClick={() => openCollectionModal(item)} className="flex-1 py-2 text-xs font-bold bg-brand-turmeric/30 rounded-lg"><Edit2 size={12} className="inline mr-1" />Edit</button><button onClick={() => deleteCollection(item)} className="flex-1 py-2 text-xs font-bold text-red-700 bg-red-50 rounded-lg"><Trash2 size={12} className="inline mr-1" />Delete</button></div>
                </div>)}
                {!collections.length && <p className="text-sm text-brand-charcoal/60">No collections yet. Add one to publish it on the Collections page.</p>}
              </div>
            </div>
          )}

          {activeTab === "blog" && (
            <div className="space-y-5">
              <SectionHeader title="Manage Blog Articles" subtitle="Draft, publish, edit, and remove journal articles." action={<AddBtn onClick={() => openArticleModal()} label="Add Article" />} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map((item) => <div key={item.id} className="p-4 bg-white rounded-2xl border border-brand-gold/30 space-y-2">
                  <div className="flex items-center justify-between"><span className="text-ui-10 font-bold uppercase text-brand-deep">{item.tag}</span><StatusBadge active={item.isPublished} /></div>
                  <h3 className="font-bold text-brand-brown">{item.title}</h3><p className="text-xs text-brand-charcoal/70">{item.excerpt}</p>
                  <div className="flex gap-2"><button onClick={() => openArticleModal(item)} className="flex-1 py-2 text-xs font-bold bg-brand-turmeric/30 rounded-lg"><Edit2 size={12} className="inline mr-1" />Edit</button><button onClick={() => deleteArticle(item)} className="flex-1 py-2 text-xs font-bold text-red-700 bg-red-50 rounded-lg"><Trash2 size={12} className="inline mr-1" />Delete</button></div>
                </div>)}
                {!articles.length && <p className="text-sm text-brand-charcoal/60">No articles yet. Add your first article here.</p>}
              </div>
            </div>
          )}

          {(activeTab === "benefits" || activeTab === "offers") && (
            <form onSubmit={savePageContent} className="space-y-4">
              <SectionHeader title={activeTab === "benefits" ? "Benefits Page Content" : "Offers Page Content"} subtitle="Edit public page text and choose content directly from your product and collection catalog." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(contentForm).filter(([key, value]) => !["comparison", "ingredients", "productIds", "collectionIds"].includes(key) && typeof value === "string").map(([key, value]) => <FieldRow key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}><textarea rows={key.toLowerCase().includes("description") || key.toLowerCase().includes("subtitle") ? 3 : 2} value={value as string} onChange={(e) => setContentForm({ ...contentForm, [key]: e.target.value })} className={inp} /></FieldRow>)}
              </div>
              {activeTab === "benefits" && <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(["comparison", "ingredients"] as const).map((key) => <FieldRow key={key} label={`${key === "comparison" ? "Comparison rows" : "Ingredient cards"} (JSON)`}>
                  <textarea rows={10} value={jsonDraft[key]} onChange={(e) => setJsonDraft({ ...jsonDraft, [key]: e.target.value })} className={`${inp} font-mono text-ui-11`} />
                  <p className="mt-1 text-ui-10 text-brand-charcoal/60">{key === "comparison" ? 'Each row: { "feature": "...", "hm": "...", "others": "..." }' : 'Each item: { "name": "...", "tag": "...", "desc": "...", "icon": "🌿" }'}</p>
                </FieldRow>)}
              </div>}
              {activeTab === "offers" && <>
                <FieldRow label="Products shown in offer picks"><div className="max-h-56 overflow-auto rounded-xl border border-brand-gold/30 bg-white p-3 space-y-2">{products.map((product) => <label key={product.id} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={(contentForm.productIds || []).includes(product.id)} onChange={(e) => setContentForm({ ...contentForm, productIds: e.target.checked ? [...(contentForm.productIds || []), product.id] : (contentForm.productIds || []).filter((id: string) => id !== product.id) })} />{product.name} — ₹{product.price}</label>)}</div></FieldRow>
                <FieldRow label="Collections shown as bundles"><div className="max-h-40 overflow-auto rounded-xl border border-brand-gold/30 bg-white p-3 space-y-2">{collections.map((collection) => <label key={collection.id} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={(contentForm.collectionIds || []).includes(collection.id)} onChange={(e) => setContentForm({ ...contentForm, collectionIds: e.target.checked ? [...(contentForm.collectionIds || []), collection.id] : (contentForm.collectionIds || []).filter((id: string) => id !== collection.id) })} />{collection.title}</label>)}</div></FieldRow>
              </>}
              <div className="flex justify-end"><button disabled={saving} className="px-5 py-2.5 rounded-xl bg-brand-deep text-white text-xs font-bold flex items-center gap-2"><Save size={14} />Save Page Content</button></div>
            </form>
          )}

            </div>
            </div>
          </main>
        </div>

      {/* PRODUCT MODAL */}
      {productModal && (
        <Modal title={productModal === "add" ? "Add New Product" : `Edit: ${productModal.name}`} onClose={() => setProductModal(null)}>
          <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
            <FieldRow label="Product Name *">
              <input required type="text" value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })} className={inp} placeholder="e.g. Royal Jasmine Agarbatti" />
            </FieldRow>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Price (₹)">
                <input type="number" step="0.01" value={pForm.price} onChange={e => setPForm({ ...pForm, price: e.target.value })} className={inp} placeholder="Leave empty or enter price" />
              </FieldRow>
              <FieldRow label="MRP (₹)">
                <input type="number" step="0.01" value={pForm.mrp} onChange={e => setPForm({ ...pForm, mrp: e.target.value })} className={inp} placeholder="Leave empty or enter MRP" />
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
            <FieldRow label="Product Photos (Multiple Supported)">
              <ProductMultiImageControl
                existingImages={pForm.existingImages}
                newFiles={pNewFiles}
                disabled={saving}
                uploadProgressText={uploadProgressText}
                onFilesAdded={(files) => setPNewFiles((prev) => [...prev, ...files])}
                onRemoveNewFile={(idx) => setPNewFiles((prev) => prev.filter((_, i) => i !== idx))}
                onSetPrimaryExisting={handleSetPrimaryImage}
                onDeleteExisting={handleDeleteExistingImage}
              />
            </FieldRow>
            <FieldRow label="Category">
              <select
                value={pForm.categoryId}
                onChange={e => {
                  const newCatId = e.target.value;
                  setPForm({ ...pForm, categoryId: newCatId, subcategoryId: "" });
                }}
                className={inp}
              >
                <option value="">— Select Category —</option>
                {categories.filter((c: any) => !c.parentId).map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </FieldRow>
            {(() => {
              const selectedCat = categories.find((c: any) => c.id === pForm.categoryId);
              const subcats = selectedCat?.children?.length ? selectedCat.children : categories.filter((c: any) => c.parentId === pForm.categoryId);
              if (subcats && subcats.length > 0) {
                return (
                  <FieldRow label={`Subcategory under ${selectedCat?.name || "Category"}`}>
                    <select
                      value={pForm.subcategoryId || ""}
                      onChange={e => setPForm({ ...pForm, subcategoryId: e.target.value })}
                      className={inp}
                    >
                      <option value="">— Select Subcategory (Optional) —</option>
                      {subcats.map((sc: any) => (
                        <option key={sc.id} value={sc.id}>{sc.name}</option>
                      ))}
                    </select>
                  </FieldRow>
                );
              }
              return null;
            })()}
            <FieldRow label="Bundle Quantity (Boxes per Bundle - Editable)">
              <input
                type="number"
                min="1"
                value={pForm.bundleQuantity}
                onChange={e => setPForm({ ...pForm, bundleQuantity: e.target.value })}
                className={inp}
                placeholder="Leave empty or enter number of boxes per bundle (e.g. 10 or 12)"
              />
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
                <span className="text-xs font-bold text-brand-brown">Product is Active (visible on site)</span>
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
            <FieldRow label="Parent Category (Optional - select to make this a Subcategory)">
              <select
                value={cForm.parentId || ""}
                onChange={e => setCForm({ ...cForm, parentId: e.target.value })}
                className={inp}
              >
                <option value="">None (Top-Level Category)</option>
                {categories.filter((c: any) => !c.parentId && (!categoryModal || categoryModal === "add" || categoryModal.id !== c.id)).map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </FieldRow>
            <FieldRow label="Description">
              <textarea rows={3} value={cForm.description} onChange={e => setCForm({ ...cForm, description: e.target.value })} className={inp} placeholder="Short description..." />
            </FieldRow>
            <FieldRow label="Category Image (shown on shop tiles)">
              <ImageUploadControl currentUrl={cForm.imageUrl} disabled={saving} onFileChange={setCImageFile} onDelete={() => { void (async () => { if (!categoryModal?.id || !confirm("Delete this category image?")) return; setSaving(true); try { await deleteImage("CATEGORY", categoryModal.id); setCForm({ ...cForm, imageUrl: "" }); showStatus("success", "Category image deleted."); fetchTab(); refreshDbData(); } catch (error: any) { showStatus("error", error.message || "Image deletion failed"); } finally { setSaving(false); } })(); }} />
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
            <FieldRow label="Desktop Image">
              <ImageUploadControl currentUrl={bForm.desktopImage} required={bannerModal === "add"} disabled={saving} onFileChange={setBImageFile} onDelete={() => { void (async () => { if (!bannerModal?.id || !confirm("Delete this banner image?")) return; setSaving(true); try { await deleteImage("BANNER", bannerModal.id); setBForm({ ...bForm, desktopImage: "" }); showStatus("success", "Banner image deleted."); fetchTab(); refreshDbData(); } catch (error: any) { showStatus("error", error.message || "Image deletion failed"); } finally { setSaving(false); } })(); }} />
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
                <span className="text-xs font-bold text-brand-brown">Banner is Active</span>
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

      {collectionModal && <Modal title={collectionModal === "add" ? "Add Collection" : `Edit: ${collectionModal.title}`} onClose={() => setCollectionModal(null)}>
        <form onSubmit={saveCollection} className="space-y-3 text-xs">
          <FieldRow label="Collection title *"><input required value={collectionForm.title} onChange={(e) => setCollectionForm({ ...collectionForm, title: e.target.value })} className={inp} /></FieldRow>
          <FieldRow label="Description"><textarea rows={3} value={collectionForm.description} onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })} className={inp} /></FieldRow>
          <FieldRow label="Banner image URL"><input value={collectionForm.bannerUrl} onChange={(e) => setCollectionForm({ ...collectionForm, bannerUrl: e.target.value })} className={inp} placeholder="https://..." /></FieldRow>
          <FieldRow label="Products in collection"><div className="max-h-56 overflow-auto rounded-xl border border-brand-gold/30 bg-white p-3 space-y-2">{products.map((product) => <label key={product.id} className="flex items-center gap-2"><input type="checkbox" checked={collectionForm.productIds.includes(product.id)} onChange={(e) => setCollectionForm({ ...collectionForm, productIds: e.target.checked ? [...collectionForm.productIds, product.id] : collectionForm.productIds.filter((id: string) => id !== product.id) })} />{product.name}</label>)}</div></FieldRow>
          <label className="flex items-center gap-2"><input type="checkbox" checked={collectionForm.isActive} onChange={(e) => setCollectionForm({ ...collectionForm, isActive: e.target.checked })} />Visible on the website</label>
          <FormButtons onCancel={() => setCollectionModal(null)} saving={saving} />
        </form>
      </Modal>}

      {articleModal && <Modal title={articleModal === "add" ? "Add Blog Article" : `Edit: ${articleModal.title}`} onClose={() => setArticleModal(null)}>
        <form onSubmit={saveArticle} className="space-y-3 text-xs">
          <FieldRow label="Article title *"><input required value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} className={inp} /></FieldRow>
          <div className="grid grid-cols-2 gap-3"><FieldRow label="Slug (optional)"><input value={articleForm.slug} onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })} className={inp} /></FieldRow><FieldRow label="Category label *"><input required value={articleForm.label} onChange={(e) => setArticleForm({ ...articleForm, label: e.target.value })} className={inp} /></FieldRow></div>
          <FieldRow label="Short excerpt *"><textarea required rows={3} value={articleForm.excerpt} onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })} className={inp} /></FieldRow>
          <div className="grid grid-cols-2 gap-3"><FieldRow label="Tag *"><input required value={articleForm.tag} onChange={(e) => setArticleForm({ ...articleForm, tag: e.target.value })} className={inp} /></FieldRow><FieldRow label="Reading time"><input value={articleForm.readingTime} onChange={(e) => setArticleForm({ ...articleForm, readingTime: e.target.value })} className={inp} /></FieldRow></div>
          <FieldRow label="Key takeaway"><input value={articleForm.highlight} onChange={(e) => setArticleForm({ ...articleForm, highlight: e.target.value })} className={inp} /></FieldRow>
          <FieldRow label="Article body"><textarea rows={5} value={articleForm.body} onChange={(e) => setArticleForm({ ...articleForm, body: e.target.value })} className={inp} /></FieldRow>
          <FieldRow label="Author"><input value={articleForm.author} onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })} className={inp} /></FieldRow>
          <div className="grid grid-cols-3 gap-3"><FieldRow label="Text color"><input value={articleForm.color} onChange={(e) => setArticleForm({ ...articleForm, color: e.target.value })} className={inp} /></FieldRow><FieldRow label="Card background"><input value={articleForm.background} onChange={(e) => setArticleForm({ ...articleForm, background: e.target.value })} className={inp} /></FieldRow><FieldRow label="Order"><input type="number" value={articleForm.displayOrder} onChange={(e) => setArticleForm({ ...articleForm, displayOrder: e.target.value })} className={inp} /></FieldRow></div>
          <div className="flex gap-5"><label className="flex items-center gap-2"><input type="checkbox" checked={articleForm.isFeatured} onChange={(e) => setArticleForm({ ...articleForm, isFeatured: e.target.checked })} />Featured</label><label className="flex items-center gap-2"><input type="checkbox" checked={articleForm.isPublished} onChange={(e) => setArticleForm({ ...articleForm, isPublished: e.target.checked })} />Published</label></div>
          <FormButtons onCancel={() => setArticleModal(null)} saving={saving} />
        </form>
      </Modal>}

      {/* DISPATCH ORDER MODAL */}
      {dispatchModal && (
        <Modal
          title={`Dispatch Order: ${dispatchModal.orderNumber}`}
          onClose={() => setDispatchModal(null)}
        >
          <form onSubmit={handleSaveDispatch} className="space-y-4 text-xs">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl space-y-1">
              <span className="font-extrabold text-purple-900 text-xs flex items-center gap-1.5">
                <Truck size={14} className="text-purple-700" />
                <span>Courier & Dispatch Tracking Information</span>
              </span>
              <p className="text-ui-11 text-purple-800">
                Provide the courier consignment tracking number and pickup notes so the customer can collect their order easily.
              </p>
            </div>

            <FieldRow label="Courier / Shipping Provider *">
              <select
                required
                value={dispatchModal.courierName}
                onChange={(e) =>
                  setDispatchModal({ ...dispatchModal, courierName: e.target.value })
                }
                className={inp}
              >
                <option value="Speed Post (India Post)">Speed Post (India Post)</option>
                <option value="BlueDart">BlueDart</option>
                <option value="DTDC Courier">DTDC Courier</option>
                <option value="Delhivery">Delhivery</option>
                <option value="Professional Couriers">Professional Couriers</option>
                <option value="Ecom Express">Ecom Express</option>
                <option value="Shadowfax">Shadowfax</option>
                <option value="Xpressbees">Xpressbees</option>
                <option value="Other Courier">Other Courier / Transport</option>
              </select>
            </FieldRow>

            <FieldRow label="Courier / Consignment Tracking Number *">
              <input
                required
                type="text"
                value={dispatchModal.trackingNumber}
                onChange={(e) =>
                  setDispatchModal({ ...dispatchModal, trackingNumber: e.target.value.toUpperCase() })
                }
                placeholder="e.g. SP987654321IN or BD123456789"
                className={`${inp} font-mono font-bold uppercase`}
              />
            </FieldRow>

            <FieldRow label="Dispatch Note / Note for Customer Collection">
              <textarea
                rows={3}
                value={dispatchModal.courierNote}
                onChange={(e) =>
                  setDispatchModal({ ...dispatchModal, courierNote: e.target.value })
                }
                placeholder="e.g. Order dispatched via Speed Post. Customer can collect using Tracking # SP987654321IN at local post office/hub."
                className={inp}
              />
            </FieldRow>

            <FormButtons onCancel={() => setDispatchModal(null)} saving={saving} />
          </form>
        </Modal>
      )}

      {/* CUSTOMER PROFILE & ORDER DETAILS MODAL */}
      {customerProfileModal && customerProfileModal.order && (
        <Modal
          title={`Customer Profile: ${customerProfileModal.order.customerEmail}`}
          onClose={() => setCustomerProfileModal(null)}
        >
          {(() => {
            const ord = customerProfileModal.order;
            const addr = parseShippingAddress(ord.shippingAddress);
            const customerEmailOrders = orders.filter(
              (o) => o.customerEmail && o.customerEmail.toLowerCase() === ord.customerEmail.toLowerCase()
            );

            return (
              <div className="space-y-4 text-xs">
                {/* Customer Contact Card */}
                <div className="p-4 bg-white rounded-2xl border border-brand-gold/40 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-brand-brown border-b border-brand-gold/20 pb-2">
                    <User className="text-brand-deep" size={18} />
                    <span className="font-extrabold text-sm">{addr.recipientName || "Customer Profile"}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-ui-11">
                    <div>
                      <span className="text-brand-charcoal/60 block font-semibold">Email Address:</span>
                      <span className="font-bold text-brand-brown">{ord.customerEmail}</span>
                    </div>
                    <div>
                      <span className="text-brand-charcoal/60 block font-semibold">Phone Number:</span>
                      <span className="font-bold text-brand-brown">{ord.customerPhone || addr.phone || "N/A"}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-brand-gold/20 text-ui-11">
                    <span className="text-brand-charcoal/60 block font-semibold flex items-center gap-1">
                      <MapPin size={12} className="text-brand-deep" /> Full Delivery Address:
                    </span>
                    <p className="font-bold text-brand-brown mt-0.5 leading-relaxed bg-brand-surface p-2.5 rounded-xl border border-brand-gold/30">
                      {addr.addressText}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-ui-11 font-bold text-brand-brown">
                    <span>Total Lifetime Orders: <strong className="text-brand-deep">{customerEmailOrders.length}</strong></span>
                    <span>Total Spent: <strong className="text-brand-deep">₹{customerEmailOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)}</strong></span>
                  </div>
                </div>

                {/* Order Breakdown */}
                <div className="p-4 bg-white rounded-2xl border border-brand-gold/40 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-gold/20 pb-2">
                    <span className="font-mono font-bold text-sm text-brand-brown">{ord.orderNumber}</span>
                    <span className="px-2.5 py-0.5 rounded font-extrabold bg-brand-saffron-dark text-white text-ui-10">
                      {ord.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    <span className="font-extrabold text-brand-brown text-ui-11 block">Items Ordered:</span>
                    {Array.isArray(ord.items) && ord.items.length > 0 ? (
                      ord.items.map((it: any) => (
                        <div
                          key={it.id || it.productId}
                          className="flex items-center gap-3 p-2 rounded-xl bg-brand-surface/60 border border-brand-gold/30"
                        >
                          {it.imageUrlSnapshot && (
                            <img
                              src={it.imageUrlSnapshot}
                              alt=""
                              className="h-10 w-10 rounded-lg object-cover border border-brand-gold/40"
                            />
                          )}
                          <div className="flex-1">
                            <span className="font-bold text-brand-brown block text-xs">
                              {it.productNameSnapshot || it.productName || it.product?.name}
                            </span>
                            <span className="text-ui-10 text-brand-charcoal/60 font-mono">
                              SKU: {it.skuSnapshot || "N/A"} | Qty: {it.quantity}
                            </span>
                          </div>
                          <span className="font-extrabold text-brand-deep">₹{it.totalPrice || it.unitPriceSnapshot * it.quantity}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">Order items list unavailable.</p>
                    )}
                  </div>

                  {/* Courier info inside profile modal */}
                  {(addr.courierName || addr.trackingNumber || addr.courierNote) && (
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-1 text-ui-11">
                      <span className="font-extrabold text-purple-900 block flex items-center gap-1">
                        <Truck size={12} className="text-purple-700" />
                        <span>Courier Tracking Details:</span>
                      </span>
                      <p className="font-bold text-purple-900">{addr.courierName} - Consignment #{addr.trackingNumber}</p>
                      {addr.courierNote && <p className="italic text-purple-800 text-ui-10">&quot;{addr.courierNote}&quot;</p>}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setCustomerProfileModal(null)}
                    className="px-5 py-2 bg-brand-brown text-white font-extrabold rounded-xl text-xs hover:bg-[#4D2E1B] transition"
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-brand-surface-soft text-sm font-semibold text-brand-ink">Loading admin workspace…</div>}>
      <AdminWorkspace />
    </Suspense>
  );
}
