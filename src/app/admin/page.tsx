"use client";

import React, { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package, FolderTree, Image as ImageIcon, ShoppingBag, Ticket, Layers, FileText as ArticleIcon, Gift, Heart, Home,
  Plus, Trash2, Edit2, TrendingUp, Lock, ArrowRight, CheckCircle,
  AlertCircle, RefreshCw, X, Save, Search, ChevronLeft, ChevronRight,
  Filter, ArrowUpDown, RotateCcw, Upload, Truck, User, Copy, MapPin,
  Phone, Mail, Calendar, FileText, ExternalLink, Clock, ArrowUpRight, Check, Star, Menu, Camera, Cloud, Zap,
} from "lucide-react";
import { useStore } from "@/components/store";
import { AdminPageContentSkeleton } from "@/components/loading-skeletons";
import { normalizeProductImageUrl } from "@/lib/products";

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
    <div className={`px-4 py-3.5 rounded-xl text-[13px] font-semibold flex items-center justify-between gap-3 border shadow-2xs ${ok ? "bg-[#ECFDF5] text-[#065F46] border-[#6EE7B7]" : "bg-[#FEF2F2] text-[#B91C1C] border-[#FCA5A5]"}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {ok ? <CheckCircle size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
        <span className="truncate sm:whitespace-normal">{msg.text}</span>
      </div>
      <button type="button" onClick={onDismiss} className="shrink-0 text-xs font-bold underline hover:opacity-80">Dismiss</button>
    </div>
  );
}

function Modal({
  title,
  onClose,
  error,
  onDismissError,
  children,
}: {
  title: string;
  onClose: () => void;
  error?: string | null;
  onDismissError?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 p-3 backdrop-blur-[2px] sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#DCE2EA] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:px-6">
          <h3 className="truncate pr-3 text-lg font-bold text-[#0F172A]">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-[#475569] transition hover:bg-[#E2E8F0] hover:text-[#0F172A]" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4 overflow-y-auto p-5 sm:p-6">
          {error && (
            <div className="flex items-start justify-between gap-3 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-[13px] font-semibold text-[#B91C1C]">
              <div className="flex min-w-0 items-start gap-2.5">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                <span className="break-words">{error}</span>
              </div>
              {onDismissError && (
                <button type="button" onClick={onDismissError} className="shrink-0 text-xs font-bold underline hover:opacity-80">
                  Dismiss
                </button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

function ProductThumb({
  url,
  alt,
  onAddPhoto,
  sizeClass = "h-12 w-12",
}: {
  url?: string;
  alt: string;
  onAddPhoto?: () => void;
  sizeClass?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = normalizeProductImageUrl(url);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    if (onAddPhoto) {
      return (
        <button
          type="button"
          onClick={onAddPhoto}
          title={failed ? "Image failed to load — click to re-upload" : "Add product photo"}
          className={`flex ${sizeClass} shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-[#64748B] transition hover:border-[#861731] hover:bg-[#FDF2F4] hover:text-[#861731]`}
        >
          <Camera size={15} />
          <span className="mt-0.5 text-[10px] font-bold leading-none">{failed ? "Retry" : "+Photo"}</span>
        </button>
      );
    }
    return (
      <div className={`grid ${sizeClass} shrink-0 place-items-center rounded-lg border border-[#DCE2EA] bg-[#F8FAFC] text-[#94A3B8]`}>
        <Package size={18} />
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClass} shrink-0 overflow-hidden rounded-lg border border-[#DCE2EA] bg-[#F8FAFC]`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain p-0.5"
      />
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-semibold text-[#1E293B] mb-1.5 text-[13px]">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#CBD5E1] font-medium text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#122629]/15 focus:border-[#122629] transition";

function FormButtons({ onCancel, saving }: { onCancel: () => void; saving?: boolean }) {
  return (
    <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E2E8F0]">
      <button type="button" onClick={onCancel} className="h-10 px-4 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] font-semibold rounded-lg text-[13px] transition">Cancel</button>
      <button type="submit" disabled={saving} className="h-10 px-5 bg-[#9E1830] hover:bg-[#821327] disabled:opacity-60 text-white font-semibold rounded-lg shadow-2xs text-[13px] flex items-center gap-2 transition">
        <Save size={15} />{saving ? "Saving…" : "Save Changes"}
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
  const resolvedCurrentUrl = normalizeProductImageUrl(currentUrl);

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
    <div className="space-y-3 rounded-xl border border-[#DCE2EA] bg-[#F8FAFC] p-4">
      {disabled && (
        <div className="flex items-center gap-2 rounded-lg bg-[#FEF3C7] p-3 text-[13px] font-semibold text-[#92400E] border border-[#FCD34D]">
          <RefreshCw size={15} className="animate-spin shrink-0" />
          <span>Syncing &amp; uploading image to Cloudinary CDN... Please wait.</span>
        </div>
      )}

      {(resolvedCurrentUrl || selectedPreview) && (
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-[#E2E8F0] bg-white p-3.5">
          {resolvedCurrentUrl && (
            <div className="flex items-center gap-3">
              <img src={resolvedCurrentUrl} alt="Current upload" className="h-16 w-16 rounded-lg border border-[#DCE2EA] object-cover bg-[#F8FAFC]" />
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#ECFDF5] px-2 py-0.5 text-xs font-semibold text-[#065F46] border border-[#A7F3D0]">
                  <Cloud size={12} />
                  <span>Cloudinary Active</span>
                </span>
                <p className="text-xs font-medium text-[#64748B] mt-1">Current Saved Image</p>
              </div>
            </div>
          )}

          {resolvedCurrentUrl && selectedPreview && (
            <div className="flex items-center text-[#9E1830] font-bold text-xs px-1">
              <span>REPLACING WITH</span>
            </div>
          )}

          {selectedPreview && (
            <div className="flex items-center gap-3">
              <img src={selectedPreview} alt="New selected upload" className="h-16 w-16 rounded-lg border-2 border-[#059669] object-cover" />
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#ECFDF5] px-2 py-0.5 text-xs font-semibold text-[#065F46] border border-[#6EE7B7]">
                  <Zap size={12} />
                  <span>New Image Queued</span>
                </span>
                <p className="text-xs font-semibold text-[#065F46] mt-1 max-w-[180px] truncate">{selectedFileName}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        <label className={`cursor-pointer inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white transition ${selectedPreview ? "bg-[#0F766E] hover:bg-[#0D5E57]" : "bg-[#122629] hover:bg-[#1E3A3E]"}`}>
          <input required={required && !resolvedCurrentUrl} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,.heic,.heif" className="sr-only" onChange={e => selectFile(e.target.files?.[0] || null)} disabled={disabled} />
          <Upload size={15} />
          <span>{resolvedCurrentUrl ? (selectedPreview ? "Choose Different Image" : "Replace Image") : "Upload New Image"}</span>
        </label>

        {selectedPreview && (
          <button type="button" onClick={handleCancelSelected} disabled={disabled} className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-[13px] font-semibold text-[#334155] hover:bg-[#F1F5F9] transition">
            <X size={14} />
            <span>Cancel Selection</span>
          </button>
        )}

        {onDelete && resolvedCurrentUrl && !selectedPreview && (
          <button type="button" onClick={onDelete} disabled={disabled} className="inline-flex items-center gap-1.5 rounded-lg border border-[#FECDD3] bg-[#FFF1F2] px-3.5 py-2 text-[13px] font-semibold text-[#9E1830] transition hover:bg-[#FFE4E6] disabled:opacity-50">
            <Trash2 size={14} />
            <span>Delete Image</span>
          </button>
        )}
      </div>

      <div className="text-xs font-medium text-[#64748B]">
        {selectedPreview ? (
          <p className="text-[#065F46] font-semibold flex items-center gap-1.5">
            <Check size={14} />
            <span>New image ready! Click &quot;Save Changes&quot; below to upload to Cloudinary.</span>
          </p>
        ) : resolvedCurrentUrl ? (
          <p>Click &quot;Replace Image&quot; to pick a new photo, then click &quot;Save Changes&quot;.</p>
        ) : (
          <p>JPEG, PNG, WebP, GIF, AVIF, or HEIC (Max 15 MB). Uploads directly to Cloudinary CDN.</p>
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
  canUploadImmediately,
  onFilesAdded,
  onRemoveNewFile,
  onSetPrimaryExisting,
  onDeleteExisting,
  onUploadNow,
}: {
  existingImages: Array<{ id: string; url: string; isPrimary: boolean; displayOrder?: number }>;
  newFiles: File[];
  disabled?: boolean;
  uploadProgressText?: string;
  canUploadImmediately?: boolean;
  onFilesAdded: (files: File[]) => void;
  onRemoveNewFile: (index: number) => void;
  onSetPrimaryExisting: (imageId: string) => void;
  onDeleteExisting: (imageId: string) => void;
  onUploadNow?: () => void;
}) {
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer.files || []).filter(
      (file) => file.type.startsWith("image/") || /\.(jpe?g|jfif|png|webp|gif|avif|heic|heif|tiff?)$/i.test(file.name)
    );
    if (dropped.length > 0) {
      onFilesAdded(dropped);
    }
  };

  const totalCount = existingImages.length + newFiles.length;

  return (
    <div className="space-y-3.5 rounded-xl border border-[#DCE2EA] bg-[#F8FAFC] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[#0F172A]">Product Photos</span>
          <span className="rounded-md bg-[#E2E8F0] px-2 py-0.5 text-xs font-bold text-[#334155]">
            {totalCount} total
          </span>
        </div>
        <span className="text-xs font-medium text-[#64748B]">JPEG, PNG, WebP, HEIC • Multi-image upload</span>
      </div>

      {disabled && (
        <div className="flex items-center gap-2 rounded-lg bg-[#FEF3C7] p-3 text-[13px] font-semibold text-[#92400E] border border-[#FCD34D]">
          <RefreshCw size={15} className="animate-spin shrink-0" />
          <span>{uploadProgressText || "Syncing with Cloudinary CDN... Please wait."}</span>
        </div>
      )}

      {existingImages.length > 0 && (
        <div>
          <p className="text-xs font-bold text-[#334155] mb-2">Saved Images ({existingImages.length}):</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {existingImages.map((img) => {
              const resolvedUrl = normalizeProductImageUrl(img.url);
              return (
                <div
                  key={img.id}
                  className={`relative group rounded-lg border bg-white p-2.5 transition-all ${
                    img.isPrimary ? "border-[#122629] ring-2 ring-[#122629]/20" : "border-[#DCE2EA] hover:border-[#94A3B8]"
                  }`}
                >
                  <div className="relative h-24 w-full overflow-hidden rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center p-1">
                    {resolvedUrl ? (
                      <img src={resolvedUrl} alt="" className="h-full w-full object-contain" />
                    ) : (
                      <Package size={24} className="text-[#94A3B8]" />
                    )}
                    {img.isPrimary && (
                      <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded bg-[#122629] px-1.5 py-0.5 text-[11px] font-bold text-white">
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
                        className="text-xs font-semibold text-[#0F766E] hover:text-[#122629] px-1.5 py-1 rounded hover:bg-[#F1F5F9] transition"
                        title="Set as main display image"
                      >
                        Make Primary
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-[#122629] flex items-center gap-1">
                        <Star size={12} className="fill-[#F59E0B] text-[#F59E0B]" />
                        <span>Main Photo</span>
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onDeleteExisting(img.id)}
                      className="p-1.5 text-[#64748B] hover:text-[#DC2626] rounded hover:bg-[#FEF2F2] transition"
                      title="Delete this image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {newFiles.length > 0 && (
        <div className="rounded-lg border border-[#FCD34D] bg-[#FFFBEB] p-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold text-[#92400E] flex items-center gap-1.5">
              <span>Pending Upload ({newFiles.length}):</span>
              <span className="font-medium text-[#B45309]">Click {canUploadImmediately && onUploadNow ? "\"Upload Now\" or " : ""}&quot;Save Changes&quot; below to publish</span>
            </p>
            {canUploadImmediately && onUploadNow && (
              <button
                type="button"
                disabled={disabled}
                onClick={onUploadNow}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F766E] hover:bg-[#0D5E57] px-3 py-1.5 text-xs font-bold text-white transition disabled:opacity-50"
              >
                <Upload size={13} />
                <span>Upload Now</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {newFiles.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="relative group rounded-lg border border-[#F59E0B]/60 bg-white p-2"
              >
                <div className="relative h-24 w-full overflow-hidden rounded-md bg-[#F8FAFC] flex items-center justify-center">
                  {newPreviews[idx] && (
                    <img src={newPreviews[idx]} alt={file.name} className="h-full w-full object-contain" />
                  )}
                  <span className="absolute top-1.5 left-1.5 rounded bg-[#D97706] px-1.5 py-0.5 text-[11px] font-bold text-white">
                    + New
                  </span>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onRemoveNewFile(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/65 text-white hover:bg-black transition"
                    title="Remove from selection"
                  >
                    <X size={12} />
                  </button>
                </div>
                <p className="mt-1.5 truncate text-xs font-semibold text-[#0F172A]">{file.name}</p>
                <p className="text-xs text-[#64748B] font-mono">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed p-5 text-center cursor-pointer transition ${
          isDragging
            ? "border-[#9E1830] bg-[#FFF1F2]"
            : "border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] hover:border-[#122629]"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <Upload size={22} className={isDragging ? "text-[#9E1830]" : "text-[#475569]"} />
        <span className="text-[13px] font-bold text-[#0F172A]">
          {isDragging ? "Drop images to queue them" : "Click to choose images or drag & drop here"}
        </span>
        <span className="text-xs text-[#64748B]">
          Select one or multiple photos at once (JPG, PNG, WebP, HEIC)
        </span>
        <input
          type="file"
          accept="image/*,.heic,.heif"
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#DCE2EA] bg-white px-5 py-4 shadow-2xs">
      <div className="min-w-0">
        <h2 className="text-lg sm:text-xl text-[#0F172A] font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[13px] text-[#64748B]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[#861731] px-4 text-[13px] font-bold text-white shadow-xs transition hover:bg-[#6E1228]"
    >
      <Plus size={16} />
      <span>{label}</span>
    </button>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
        active
          ? "border-[#BBF7D0] bg-[#ECFDF3] text-[#15803D]"
          : "border-[#E2E8F0] bg-[#F1F5F9] text-[#475569]"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#16A34A]" : "bg-[#64748B]"}`} />
      <span>{active ? "Active" : "Inactive"}</span>
    </span>
  );
}

function ActionBtns({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        onClick={onEdit}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#334155] transition hover:border-[#C2CAD6] hover:bg-[#F8FAFC]"
        title="Edit record"
      >
        <Edit2 size={15} />
      </button>
      <button
        onClick={onDelete}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4C7CF] bg-white text-[#B42318] transition hover:bg-[#FEF3F2]"
        title="Delete record"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function EmptyRow({ cols, text }: { cols: number; text: string }) {
  return (
    <tr>
      <td colSpan={cols} className="p-10 text-center text-sm font-medium text-[#64748B]">
        {text}
      </td>
    </tr>
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
    <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#DCE2EA] bg-white p-3.5 shadow-xs sm:flex-row sm:items-center">
      <div className="relative flex-1 max-w-lg">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] pl-10 pr-9 text-xs font-medium text-[#111827] placeholder:text-[#94A3B8] focus:border-[#122629] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#122629]/15"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#64748B] hover:bg-[#EEF2F6] hover:text-[#B42318]"
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
        <span className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs">
          Total: <strong className="text-[#111827] tabular-nums">{totalCount}</strong>
        </span>
        {value && (
          <span className="rounded-lg border border-[#BBF7D0] bg-[#ECFDF3] px-3 py-1.5 text-xs text-[#15803D]">
            Matching: <strong className="tabular-nums">{filteredCount}</strong>
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
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E6EBF2] pt-4 text-xs font-medium text-[#475569] sm:flex-row">
      <div className="text-xs">
        Showing <span className="font-bold text-[#111827] tabular-nums">{startItem}</span> to{" "}
        <span className="font-bold text-[#111827] tabular-nums">{endItem}</span> of{" "}
        <span className="font-bold text-[#111827] tabular-nums">{totalItems}</span> records
      </div>
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex h-9 items-center gap-1 rounded-lg border border-[#D4DCE6] bg-white px-3 text-xs font-semibold text-[#334155] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>

          {getPages().map((page, idx) =>
            typeof page === "string" ? (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-[#94A3B8]">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`h-9 min-w-9 rounded-lg px-2.5 text-xs font-bold transition ${
                  currentPage === page
                    ? "border border-[#122629] bg-[#122629] text-white shadow-xs"
                    : "border border-[#D4DCE6] bg-white text-[#334155] hover:bg-[#F8FAFC]"
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
            className="flex h-9 items-center gap-1 rounded-lg border border-[#D4DCE6] bg-white px-3 text-xs font-semibold text-[#334155] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
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
  const [modalError, setModalError] = useState<string | null>(null);

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
    const noCache = { cache: "no-store" as RequestCache };
    try {
      if (activeTab === "overview") {
        const r = await fetch(`${API}/admin/dashboard`, { headers: h, ...noCache });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setMetrics(j.data);
      } else if (activeTab === "products") {
        const [rProd, rCat] = await Promise.all([
          fetch(`${API}/products?limit=500&includeInactive=true`, { headers: h, ...noCache }),
          fetch(`${API}/categories?includeInactive=true`, { headers: h, ...noCache }),
        ]);
        const jProd = await rProd.json();
        const jCat = await rCat.json();
        if (!checkUnauthorized(rProd, jProd) && jProd.success) setProducts(jProd.data);
        if (jCat?.success) setCategories(jCat.data);
      } else if (activeTab === "categories") {
        const r = await fetch(`${API}/categories?includeInactive=true`, { headers: h, ...noCache });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setCategories(j.data);
      } else if (activeTab === "banners") {
        const r = await fetch(`${API}/banners?includeInactive=true`, { headers: h, ...noCache });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setBanners(j.data);
      } else if (activeTab === "orders") {
        const r = await fetch(`${API}/orders?limit=200`, { headers: h, ...noCache });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setOrders(j.data);
      } else if (activeTab === "coupons") {
        const r = await fetch(`${API}/coupons/admin`, { headers: h, ...noCache });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setCoupons(j.data);
      } else if (activeTab === "collections") {
        const r = await fetch(`${API}/collections?includeInactive=true`, { headers: h, ...noCache });
        const j = await r.json();
        if (!checkUnauthorized(r, j) && j.success) setCollections(j.data);
        const prodRes = await fetch(`${API}/products?limit=500&includeInactive=true`, { headers: h, ...noCache });
        const prodJson = await prodRes.json(); if (prodJson.success) setProducts(prodJson.data);
      } else if (activeTab === "blog") {
        const r = await fetch(`${API}/content/blog/admin`, { headers: h, ...noCache });
        const j = await r.json(); if (!checkUnauthorized(r, j) && j.success) setArticles(j.data);
      } else if (["benefits", "offers"].includes(activeTab)) {
        const r = await fetch(`${API}/content/pages/${activeTab}`, noCache);
        const j = await r.json();
        if (j.success) {
          const next = j.data || (activeTab === "benefits" ? defaultBenefitsContent : defaultOffersContent);
          setContentForm(next);
          if (activeTab === "benefits") setJsonDraft({ comparison: JSON.stringify(next.comparison || [], null, 2), ingredients: JSON.stringify(next.ingredients || [], null, 2) });
        }
        if (activeTab === "offers") {
          const prodRes = await fetch(`${API}/products?limit=500&includeInactive=true`, { headers: h, ...noCache });
          const prodJson = await prodRes.json(); if (prodJson.success) setProducts(prodJson.data);
          const colRes = await fetch(`${API}/collections?includeInactive=true`, { headers: h, ...noCache });
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
    setModalError(null);
    setPImageFile(null);
    setPNewFiles([]);
    setUploadProgressText("");
    if (categories.length === 0) {
      const r = await fetch(`${API}/categories`, { cache: "no-store" }); const j = await r.json();
      if (j.success) setCategories(j.data);
    }
    if (coupons.length === 0 && token) {
      const r = await fetch(`${API}/coupons/admin`, { headers: authH(token), cache: "no-store" });
      const j = await r.json(); if (j.success) setCoupons(j.data);
    }
    if (item) {
      setProductModal(item);
      const existingImages = Array.isArray(item.images)
        ? item.images.map((img: any) => ({
            id: img.id,
            url: normalizeProductImageUrl(img.url),
            isPrimary: Boolean(img.isPrimary),
            displayOrder: img.displayOrder,
          }))
        : [];
      setPForm({
        name: item.name || "", sku: item.sku || "", price: String(item.price || ""),
        mrp: String(item.mrp || ""), stockQuantity: String(item.stockQuantity ?? 100),
        description: item.description || "", imageUrl: normalizeProductImageUrl(item.images?.[0]?.url || ""), imageId: item.images?.[0]?.id || "",
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

  const handleUploadPendingProductImages = async () => {
    if (!productModal || productModal === "add" || !productModal.id || pNewFiles.length === 0) return;
    setModalError(null);
    setSaving(true);
    const uploaded: { id: string; url: string; isPrimary: boolean; displayOrder?: number }[] = [];
    try {
      for (let i = 0; i < pNewFiles.length; i++) {
        setUploadProgressText(`Uploading image ${i + 1} of ${pNewFiles.length} to Cloudinary CDN...`);
        const shouldBePrimary = pForm.existingImages.length === 0 && uploaded.length === 0 && i === 0;
        const result = await uploadImage(pNewFiles[i], "PRODUCT", productModal.id, undefined, shouldBePrimary);
        if (result?.record) {
          uploaded.push({
            id: result.record.id,
            url: normalizeProductImageUrl(result.record.url),
            isPrimary: Boolean(result.record.isPrimary),
            displayOrder: result.record.displayOrder,
          });
        } else if (result?.url) {
          uploaded.push({
            id: `temp-${Date.now()}-${i}`,
            url: normalizeProductImageUrl(result.url),
            isPrimary: shouldBePrimary,
          });
        }
      }
      setPForm(prev => ({
        ...prev,
        existingImages: [...prev.existingImages, ...uploaded],
      }));
      setPNewFiles([]);
      await Promise.all([fetchTab(), refreshDbData()]);
      showStatus("success", `${uploaded.length} product image${uploaded.length > 1 ? "s" : ""} uploaded and live in catalog.`);
    } catch (error: any) {
      if (uploaded.length > 0) {
        setPForm(prev => ({
          ...prev,
          existingImages: [...prev.existingImages, ...uploaded],
        }));
        setPNewFiles(prev => prev.slice(uploaded.length));
        await Promise.all([fetchTab(), refreshDbData()]);
      }
      const msg = error?.message || "Image upload failed. Please check file size/format and try again.";
      setModalError(msg);
      showStatus("error", msg);
    } finally {
      setSaving(false);
      setUploadProgressText("");
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    if (!productModal?.id) return;
    setModalError(null);
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
      await Promise.all([fetchTab(), refreshDbData()]);
    } catch (error: any) {
      const msg = error?.message || "Failed to set primary image";
      setModalError(msg);
      showStatus("error", msg);
    } finally {
      setSaving(false);
      setUploadProgressText("");
    }
  };

  const handleDeleteExistingImage = async (imageId: string) => {
    if (!productModal?.id || !confirm("Delete this product image?")) return;
    setModalError(null);
    setSaving(true);
    setUploadProgressText("Deleting image...");
    try {
      await deleteImage("PRODUCT", productModal.id, imageId);
      setPForm(prev => {
        const remaining = prev.existingImages.filter(img => img.id !== imageId);
        const hadPrimary = remaining.some(img => img.isPrimary);
        if (!hadPrimary && remaining.length > 0) {
          remaining[0] = { ...remaining[0], isPrimary: true };
        }
        return { ...prev, existingImages: remaining };
      });
      showStatus("success", "Product image deleted.");
      await Promise.all([fetchTab(), refreshDbData()]);
    } catch (error: any) {
      const msg = error?.message || "Image deletion failed";
      setModalError(msg);
      showStatus("error", msg);
    } finally {
      setSaving(false);
      setUploadProgressText("");
    }
  };

  /* PRODUCT CRUD */
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return;
    setModalError(null);
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
    let savedRecord: any = null;
    const uploadedRecords: { id: string; url: string; isPrimary: boolean; displayOrder?: number }[] = [];
    try {
      const url = isEdit ? `${API}/products/admin/${productModal.id}` : `${API}/products/admin`;
      const r = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: authH(token), body: JSON.stringify(payload) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && (r.ok || j.success)) {
        savedRecord = j.data;
        const targetId = savedRecord?.id || productModal?.id;
        if (targetId && pNewFiles.length > 0) {
          for (let i = 0; i < pNewFiles.length; i++) {
            setUploadProgressText(`Uploading image ${i + 1} of ${pNewFiles.length} to Cloudinary CDN...`);
            const shouldBePrimary = pForm.existingImages.length === 0 && uploadedRecords.length === 0 && i === 0;
            const uploadRes = await uploadImage(pNewFiles[i], "PRODUCT", targetId, undefined, shouldBePrimary);
            if (uploadRes?.record) {
              uploadedRecords.push({
                id: uploadRes.record.id,
                url: normalizeProductImageUrl(uploadRes.record.url),
                isPrimary: Boolean(uploadRes.record.isPrimary),
                displayOrder: uploadRes.record.displayOrder,
              });
            }
          }
        }
        showStatus("success", `Product "${pForm.name}" ${isEdit ? "updated" : "created"}!`);
        setPNewFiles([]);
        setProductModal(null);
        await Promise.all([fetchTab(), refreshDbData()]);
      } else {
        const errMsg = j.message || (j.errors && j.errors.map((e: any) => `${e.field}: ${e.message}`).join(", ")) || "Failed to save product";
        setModalError(errMsg);
        showStatus("error", errMsg);
      }
    } catch (error: any) {
      if (!isEdit && savedRecord?.id) {
        setProductModal(savedRecord);
      }
      if (uploadedRecords.length > 0) {
        setPForm(prev => ({
          ...prev,
          existingImages: [...prev.existingImages, ...uploadedRecords],
        }));
        setPNewFiles(prev => prev.slice(uploadedRecords.length));
      }
      if (savedRecord?.id) {
        await Promise.all([fetchTab(), refreshDbData()]);
      }
      const errMsg = error?.message || "Product details saved, but an image upload encountered an issue. Retry uploading below.";
      setModalError(errMsg);
      showStatus("error", errMsg);
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
    if (!checkUnauthorized(r, j) && (r.ok || j.success)) { showStatus("success", `"${name}" permanently deleted from database.`); await Promise.all([fetchTab(), refreshDbData()]); }
    else showStatus("error", j.message || "Delete failed");
  };

  /* CATEGORY CRUD */
  const openCategoryModal = (item?: any, defaultParentId?: string) => {
    setModalError(null);
    setCImageFile(null);
    if (item) { setCategoryModal(item); setCForm({ name: item.name, description: item.description || "", imageUrl: normalizeProductImageUrl(item.imageUrl || ""), parentId: item.parentId || "" }); }
    else { setCategoryModal("add"); setCForm({ ...emptyCategory, parentId: defaultParentId || "" }); }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return; setModalError(null); setSaving(true);
    const isEdit = categoryModal !== "add";
    let savedCat: any = null;
    try {
      const url = isEdit ? `${API}/categories/admin/${categoryModal.id}` : `${API}/categories/admin`;
      const catPayload = { ...cForm, parentId: cForm.parentId ? cForm.parentId : null };
      const r = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: authH(token), body: JSON.stringify(catPayload) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && (r.ok || j.success)) {
        savedCat = j.data;
        if (cImageFile) await uploadImage(cImageFile, "CATEGORY", savedCat.id);
        showStatus("success", `Category "${cForm.name}" ${isEdit ? "updated" : "created"}!`);
        setCategoryModal(null); await Promise.all([fetchTab(), refreshDbData()]);
      } else {
        const errMsg = j.message || (j.errors && j.errors.map((e: any) => `${e.field}: ${e.message}`).join(", ")) || "Failed";
        setModalError(errMsg);
        showStatus("error", errMsg);
      }
    } catch (error: any) {
      if (!isEdit && savedCat?.id) setCategoryModal(savedCat);
      const msg = error?.message || "Category saved, but the image upload failed.";
      setModalError(msg);
      showStatus("error", msg);
    } finally { setSaving(false); }
  };


  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`Permanently delete category "${name}" from database?`)) return;
    if (!token) { showStatus("error", "No admin token."); return; }
    const r = await fetch(`${API}/categories/admin/${id}`, { method: "DELETE", headers: authH(token) });
    const j = await r.json();
    if (!checkUnauthorized(r, j) && j.success) { showStatus("success", `"${name}" permanently deleted from database.`); await Promise.all([fetchTab(), refreshDbData()]); }
    else if (!j.success) showStatus("error", j.message || "Delete failed");
  };

  /* BANNER CRUD */
  const openBannerModal = (item?: any) => {
    setModalError(null);
    setBImageFile(null);
    if (item) {
      setBannerModal(item);
      setBForm({ title: item.title, subtitle: item.subtitle || "", desktopImage: normalizeProductImageUrl(item.desktopImage || ""), ctaText: item.ctaText || "Explore Collection", ctaLink: item.ctaLink || "/shop", position: item.position || "HERO_MAIN", isActive: item.isActive !== false });
    } else { setBannerModal("add"); setBForm(emptyBanner); }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return; setModalError(null); setSaving(true);
    const isEdit = bannerModal !== "add";
    let savedBanner: any = null;
    try {
      const url = isEdit ? `${API}/banners/admin/${bannerModal.id}` : `${API}/banners/admin`;
      const r = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: authH(token), body: JSON.stringify(bForm) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && j.success) {
        savedBanner = j.data;
        if (bImageFile) await uploadImage(bImageFile, "BANNER", savedBanner.id);
        showStatus("success", `Banner "${bForm.title}" ${isEdit ? "updated" : "added"}!`);
        setBannerModal(null); await Promise.all([fetchTab(), refreshDbData()]);
      } else if (!j.success) {
        const msg = j.message || "Failed";
        setModalError(msg);
        showStatus("error", msg);
      }
    } catch (error: any) {
      if (!isEdit && savedBanner?.id) setBannerModal(savedBanner);
      const msg = error?.message || "Banner saved, but the image upload failed.";
      setModalError(msg);
      showStatus("error", msg);
    } finally { setSaving(false); }
  };

  const deleteBanner = async (id: string, title: string) => {
    if (!confirm(`Delete banner "${title}"?`)) return;
    if (!token) { showStatus("error", "No admin token."); return; }
    const r = await fetch(`${API}/banners/admin/${id}`, { method: "DELETE", headers: authH(token) });
    const j = await r.json();
    if (!checkUnauthorized(r, j) && j.success) { showStatus("success", `Banner "${title}" deleted.`); await Promise.all([fetchTab(), refreshDbData()]); }
    else if (!j.success) showStatus("error", j.message || "Delete failed");
  };

  /* COUPON CRUD */
  const openCouponModal = (item?: any) => {
    setModalError(null);
    if (item) {
      setCouponModal(item);
      setQForm({ code: item.code, discountPercent: String(item.discountPercent || ""), minOrderAmount: String(item.minOrderAmount || ""), expiryDate: item.expiryDate ? item.expiryDate.slice(0, 10) : "" });
    } else { setCouponModal("add"); setQForm(emptyCoupon); }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return; setModalError(null); setSaving(true);
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
      } else if (!j.success) {
        const msg = j.message || "Failed";
        setModalError(msg);
        showStatus("error", msg);
      }
    } catch { setModalError("Network error"); showStatus("error", "Network error"); } finally { setSaving(false); }
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
    setModalError(null);
    setCollectionModal(item || "add");
    setCollectionForm(item ? { title: item.title, description: item.description || "", bannerUrl: item.bannerUrl || "", isActive: item.isActive !== false, productIds: (item.products || []).map((entry: any) => entry.productId) } : { title: "", description: "", bannerUrl: "", isActive: true, productIds: [] });
  };

  const saveCollection = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return; setModalError(null); setSaving(true);
    const editing = collectionModal !== "add";
    try {
      const r = await fetch(editing ? `${API}/collections/admin/${collectionModal.id}` : `${API}/collections/admin`, { method: editing ? "PATCH" : "POST", headers: authH(token), body: JSON.stringify(collectionForm) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && j.success) { showStatus("success", `Collection ${editing ? "updated" : "created"}.`); setCollectionModal(null); fetchTab(); }
      else { const msg = j.message || "Unable to save collection"; setModalError(msg); showStatus("error", msg); }
    } catch (error: any) { const msg = error.message || "Network error"; setModalError(msg); showStatus("error", msg); } finally { setSaving(false); }
  };

  const deleteCollection = async (item: any) => {
    if (!confirm(`Delete collection "${item.title}"?`)) return;
    const r = await fetch(`${API}/collections/admin/${item.id}`, { method: "DELETE", headers: authH(token || "") }); const j = await r.json();
    if (!checkUnauthorized(r, j) && j.success) { showStatus("success", "Collection deleted."); fetchTab(); } else showStatus("error", j.message || "Delete failed");
  };

  const openArticleModal = (item?: any) => {
    setModalError(null);
    setArticleModal(item || "add");
    setArticleForm(item ? { ...item, displayOrder: String(item.displayOrder || 0) } : { title: "", slug: "", label: "", excerpt: "", readingTime: "5 min read", tag: "", highlight: "", author: "", body: "", color: "var(--brand-primary)", background: "var(--brand-surface-warm)", isFeatured: false, isPublished: true, displayOrder: "0" });
  };

  const saveArticle = async (e: React.FormEvent) => {
    e.preventDefault(); if (!token) return; setModalError(null); setSaving(true);
    const editing = articleModal !== "add";
    try {
      const r = await fetch(editing ? `${API}/content/blog/admin/${articleModal.id}` : `${API}/content/blog/admin`, { method: editing ? "PATCH" : "POST", headers: authH(token), body: JSON.stringify({ ...articleForm, displayOrder: Number(articleForm.displayOrder) || 0 }) });
      const j = await r.json();
      if (!checkUnauthorized(r, j) && j.success) { showStatus("success", `Article ${editing ? "updated" : "created"}.`); setArticleModal(null); fetchTab(); }
      else { const msg = j.message || "Unable to save article"; setModalError(msg); showStatus("error", msg); }
    } catch (error: any) { const msg = error.message || "Network error"; setModalError(msg); showStatus("error", msg); } finally { setSaving(false); }
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
        await Promise.all([fetchTab(), refreshDbData()]);
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
    setModalError(null);
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

  const navSections = [
    {
      heading: "Core Workspace",
      items: [
        { id: "overview", label: "Overview", icon: TrendingUp },
        { id: "orders", label: "Orders", icon: ShoppingBag },
      ],
    },
    {
      heading: "Catalog & Inventory",
      items: [
        { id: "products", label: "Products", icon: Package },
        { id: "categories", label: "Categories", icon: FolderTree },
        { id: "collections", label: "Collections", icon: Layers },
      ],
    },
    {
      heading: "Marketing & Content",
      items: [
        { id: "banners", label: "Banners", icon: ImageIcon },
        { id: "coupons", label: "Coupons", icon: Ticket },
        { id: "blog", label: "Blog", icon: ArticleIcon },
        { id: "benefits", label: "Benefits", icon: Heart },
        { id: "offers", label: "Offers", icon: Gift },
      ],
    },
  ];
  const tabs = navSections.flatMap((group) => group.items);

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || "Overview";
  const recentDashboardOrders = Array.isArray(metrics?.recentOrders) ? [...metrics.recentOrders].reverse() : [];
  const latestOrdersList = Array.isArray(metrics?.recentOrders) ? metrics.recentOrders : [];
  const maxRecentRevenue = Math.max(1, ...recentDashboardOrders.map((order: any) => Number(order.totalAmount) || 0));
  const recentOrderStatusGroups = [
    { label: "Pending", color: "bg-[#D97706]", count: recentDashboardOrders.filter((order: any) => ["PENDING", "PROCESSING"].includes(String(order.status).toUpperCase())).length },
    { label: "Confirmed", color: "bg-[#2563EB]", count: recentDashboardOrders.filter((order: any) => ["CONFIRMED", "READY_TO_SHIP"].includes(String(order.status).toUpperCase())).length },
    { label: "Shipped", color: "bg-[#16A34A]", count: recentDashboardOrders.filter((order: any) => ["SHIPPED", "DISPATCHED", "DELIVERED"].includes(String(order.status).toUpperCase())).length },
    { label: "Returned", color: "bg-[#B42318]", count: recentDashboardOrders.filter((order: any) => ["RETURNED", "CANCELLED"].includes(String(order.status).toUpperCase())).length },
  ];

  return (
    <div className="-mb-[calc(4.5rem+env(safe-area-inset-bottom))] min-h-dvh w-full overflow-x-clip bg-[#F4F6F9] md:mb-0">
      {loading && (
        <div className="fixed inset-0 z-[120] overflow-y-auto bg-[#F4F6F9]/85 py-4 backdrop-blur-[2px] lg:left-[252px] xl:left-[264px]" aria-label="Loading admin data">
          <AdminPageContentSkeleton />
        </div>
      )}
      {mobileNavOpen && <button type="button" aria-label="Close admin navigation" onClick={() => setMobileNavOpen(false)} className="fixed inset-0 z-[60] bg-[#0F1F22]/60 backdrop-blur-[2px] lg:hidden" />}
      <div className="min-h-dvh w-full lg:pl-[252px] xl:pl-[264px]">
          <aside className={`fixed inset-y-0 left-0 z-[70] flex h-dvh w-[min(84vw,296px)] flex-col overflow-y-auto border-r border-[#1F3A3E] bg-[#122629] text-white shadow-2xl transition-transform duration-300 ease-out lg:z-40 lg:w-[252px] xl:w-[264px] lg:translate-x-0 lg:shadow-none ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F3C967] text-[#122629] shadow-xs">
                  <Layers size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#F3C967]">HM Brand</p>
                  <p className="truncate text-[13px] font-semibold text-white">Store CRM Console</p>
                </div>
              </div>
              <button type="button" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" className="grid h-9 w-9 place-items-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white lg:hidden">
                <X size={20} />
              </button>
            </div>

            <nav aria-label="Admin sections" className="flex flex-1 flex-col gap-5 px-3 py-4">
              {navSections.map((group) => (
                <div key={group.heading} className="space-y-1">
                  <p className="px-3 pb-1 text-xs font-bold uppercase tracking-[0.12em] text-white/45">
                    {group.heading}
                  </p>
                  {group.items.map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => navigateToSection(id)}
                        aria-current={isActive ? "page" : undefined}
                        className={`group flex w-full items-center gap-3 rounded-lg border-l-[3px] px-3 py-2.5 text-left text-[14px] font-semibold transition-all duration-150 ${
                          isActive
                            ? "border-[#F3C967] bg-[#1D3B3F] text-white shadow-xs"
                            : "border-transparent text-white/75 hover:bg-white/8 hover:text-white"
                        }`}
                      >
                        <Icon size={18} className={isActive ? "text-[#F3C967]" : "text-white/65 group-hover:text-white"} />
                        <span className="truncate">{label}</span>
                        {id === "products" && products.length > 0 && (
                          <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${isActive ? "bg-white/15 text-white" : "bg-white/10 text-white/75"}`}>
                            {products.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="mt-auto border-t border-white/10 p-3">
              <button
                type="button"
                onClick={fetchTab}
                className="flex h-10 w-full items-center gap-3 rounded-lg border border-white/12 bg-white/5 px-3.5 text-left text-[13px] font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
                title="Refresh current section"
              >
                <RefreshCw size={16} className={loading ? "animate-spin text-[#F3C967]" : "text-[#F3C967]"} />
                <span>Refresh workspace</span>
              </button>
            </div>
          </aside>

          <main className="flex min-h-dvh min-w-0 flex-col bg-[#F4F6F9]">
            <header className="sticky top-0 z-30 border-b border-[#DCE2EA] bg-white px-4 py-3.5 shadow-2xs sm:px-6 lg:px-8">
              <div className="mx-auto flex w-full max-w-[1640px] flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(true)}
                    aria-label="Open admin navigation"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#DCE2EA] bg-white text-[#122629] transition hover:border-[#861731] hover:text-[#861731] lg:hidden"
                  >
                    <Menu size={19} />
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
                      <span className="text-[#861731] font-bold">CRM Workspace</span>
                      <span>/</span>
                      <span>{activeTabLabel}</span>
                    </div>
                    <h1 className="truncate font-brand text-xl font-bold text-[#122629] sm:text-2xl">
                      {activeTab === "overview" ? `Welcome back, ${user.fullName.split(" ")[0]}` : `${activeTabLabel} Module`}
                    </h1>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={fetchTab}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#D4DCE6] bg-white px-3.5 text-[13px] font-semibold text-[#334155] transition hover:bg-[#F8FAFC]"
                    title="Sync live records"
                  >
                    <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                    <span className="hidden sm:inline">Sync</span>
                  </button>
                  <Link
                    href="/"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#861731] px-4 text-[13px] font-bold text-white transition hover:bg-[#6E1228]"
                  >
                    <Home size={15} />
                    <span>Storefront</span>
                  </Link>
                  <div className="flex min-w-0 items-center gap-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#122629] text-xs font-bold text-white">
                      {user.fullName.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="hidden sm:block">
                      <p className="max-w-40 truncate text-[13px] font-bold text-[#111827] leading-tight">{user.fullName}</p>
                      <p className="text-xs font-medium text-[#64748B] leading-tight">Administrator</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="mx-auto w-full max-w-[1640px] flex-1 space-y-5 p-4 sm:p-6 lg:p-7">
            <StatusMsg msg={status} onDismiss={() => setStatus(null)} />

            {/* Content Panel */}
            <div key={activeTab} className="admin-slide-in min-w-0 space-y-5">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div className="flex flex-col justify-between gap-2 rounded-xl border border-[#DCE2EA] bg-white px-5 py-4 shadow-xs sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#861731]">Executive Snapshot</p>
                  <h2 className="mt-0.5 font-brand text-xl font-bold text-[#122629] sm:text-2xl">Store Performance Overview</h2>
                </div>
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#475569]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A]" />
                  <span>Connected to live store database</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {[
                  { label: "Paid Revenue", value: `₹${Number(metrics?.totalRevenue || 0).toLocaleString("en-IN")}`, note: "Completed payments", icon: TrendingUp, color: "text-[#15803D]", iconBg: "bg-[#ECFDF3]", borderAccent: "border-t-[#16A34A]" },
                  { label: "Products", value: metrics?.totalProducts ?? products.length, note: "Active & draft catalog", icon: Package, color: "text-[#861731]", iconBg: "bg-[#FDF2F4]", borderAccent: "border-t-[#861731]" },
                  { label: "Categories", value: metrics?.totalCategories ?? categories.length, note: "Store taxonomy", icon: FolderTree, color: "text-[#B45309]", iconBg: "bg-[#FEF3C7]", borderAccent: "border-t-[#D97706]" },
                  { label: "Orders", value: metrics?.totalOrders ?? 0, note: "All-time volume", icon: ShoppingBag, color: "text-[#1D4ED8]", iconBg: "bg-[#EFF6FF]", borderAccent: "border-t-[#2563EB]" },
                  { label: "Customers", value: metrics?.totalUsers ?? 0, note: "Registered accounts", icon: User, color: "text-[#122629]", iconBg: "bg-[#EEF2F6]", borderAccent: "border-t-[#122629]" },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} className={`rounded-xl border border-[#DCE2EA] border-t-[3px] ${m.borderAccent} bg-white p-5 shadow-xs transition hover:shadow-md`}>
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#475569]">{m.label}</span>
                        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${m.iconBg} ${m.color}`}>
                          <Icon size={19} />
                        </span>
                      </div>
                      <span className={`mt-3 block break-words text-[28px] font-extrabold leading-none tracking-tight tabular-nums ${m.color}`}>
                        {m.value}
                      </span>
                      <span className="mt-2 block text-[13px] font-medium text-[#64748B]">{m.note}</span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.85fr)]">
                <section className="rounded-xl border border-[#DCE2EA] bg-white p-5 shadow-xs sm:p-6">
                  <div className="mb-5 flex items-start justify-between gap-3 border-b border-[#E8EDF3] pb-4">
                    <div>
                      <h3 className="text-base font-bold text-[#111827]">Recent Order Value</h3>
                      <p className="mt-0.5 text-[13px] text-[#64748B]">Gross revenue across the latest orders received</p>
                    </div>
                    <span className="rounded-lg border border-[#DCE2EA] bg-[#F8FAFC] px-3 py-1.5 text-xs font-bold text-[#122629]">
                      Last {recentDashboardOrders.length} orders
                    </span>
                  </div>
                  {recentDashboardOrders.length > 0 ? (
                    <div className="flex h-60 items-end gap-4 border-b border-l border-[#E2E8F0] px-4 pb-0 pt-5 sm:gap-6">
                      {recentDashboardOrders.map((order: any, index: number) => {
                        const amount = Number(order.totalAmount) || 0;
                        const height = Math.max(10, (amount / maxRecentRevenue) * 100);
                        const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : `Order ${index + 1}`;
                        return (
                          <div key={order.id || order.orderNumber || index} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                            <span className="text-xs font-bold text-[#111827] tabular-nums">₹{amount.toLocaleString("en-IN")}</span>
                            <div className="relative flex w-full flex-1 items-end justify-center">
                              <div
                                title={`${order.orderNumber || "Order"}: ₹${amount.toLocaleString("en-IN")}`}
                                className="w-full max-w-14 rounded-t-lg bg-[#1E6B52] transition-all duration-200 group-hover:bg-[#861731]"
                                style={{ height: `${height}%` }}
                              />
                            </div>
                            <span className="pb-2 text-xs font-semibold text-[#64748B]">{date}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid h-60 place-items-center rounded-xl bg-[#F8FAFC] text-center text-sm text-[#64748B]">
                      Recent orders will appear here when your store receives them.
                    </div>
                  )}
                </section>

                <section className="flex flex-col rounded-xl border border-[#DCE2EA] bg-white p-5 shadow-xs sm:p-6">
                  <div className="mb-5 border-b border-[#E8EDF3] pb-4">
                    <h3 className="text-base font-bold text-[#111827]">Order Pipeline</h3>
                    <p className="mt-0.5 text-[13px] text-[#64748B]">Status mix across latest store orders</p>
                  </div>
                  {recentDashboardOrders.length > 0 ? (
                    <>
                      <div className="mb-5 flex h-3.5 overflow-hidden rounded-full bg-[#EEF2F6]" aria-label="Recent order status distribution">
                        {recentOrderStatusGroups.map((group) => group.count > 0 && (
                          <span key={group.label} className={`${group.color} transition-all`} style={{ width: `${(group.count / recentDashboardOrders.length) * 100}%` }} title={`${group.label}: ${group.count}`} />
                        ))}
                      </div>
                      <div className="space-y-2.5">
                        {recentOrderStatusGroups.map((group) => (
                          <div key={group.label} className="flex items-center justify-between rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] px-3.5 py-2.5 text-[13px]">
                            <span className="flex items-center gap-2.5 font-medium text-[#334155]">
                              <span className={`h-2.5 w-2.5 rounded-full ${group.color}`} />
                              {group.label}
                            </span>
                            <span className="text-sm font-bold tabular-nums text-[#111827]">{group.count}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="grid h-36 place-items-center rounded-xl bg-[#F8FAFC] text-center text-sm text-[#64748B]">
                      No order status data yet.
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => navigateToSection("orders")}
                    className="mt-auto inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#DCE2EA] bg-[#F8FAFC] px-4 text-[13px] font-bold text-[#861731] transition hover:border-[#861731]/40 hover:bg-[#FDF2F4] mt-6"
                  >
                    <span>Open Order Management</span>
                    <ArrowUpRight size={15} />
                  </button>
                </section>
              </div>

              <section className="overflow-hidden rounded-xl border border-[#DCE2EA] bg-white shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-[#E8EDF3] px-5 py-4 sm:px-6">
                  <div>
                    <h3 className="text-base font-bold text-[#111827]">Latest Orders</h3>
                    <p className="mt-0.5 text-[13px] text-[#64748B]">Most recent customer transactions from the database</p>
                  </div>
                  <button type="button" onClick={() => navigateToSection("orders")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D4DCE6] bg-white px-3.5 text-[13px] font-semibold text-[#861731] hover:bg-[#FDF2F4]">
                    <span>View all</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
                {latestOrdersList.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold uppercase tracking-wider text-[#475569]">
                        <tr>
                          <th className="px-5 py-3">Order Number</th>
                          <th className="px-5 py-3">Customer</th>
                          <th className="px-5 py-3">Date</th>
                          <th className="px-5 py-3 text-right">Amount</th>
                          <th className="px-5 py-3 text-right">Stage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EDF2F7] text-[13px]">
                        {latestOrdersList.map((order: any) => (
                          <tr key={order.id || order.orderNumber} className="transition hover:bg-[#F8FAFC]">
                            <td className="px-5 py-3.5 font-bold text-[#122629]">{order.orderNumber || "Order"}</td>
                            <td className="px-5 py-3.5 text-[#334155]">{order.customerEmail || order.customerName || "Customer"}</td>
                            <td className="px-5 py-3.5 text-[#64748B]">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                            </td>
                            <td className="px-5 py-3.5 text-right font-extrabold tabular-nums text-[#111827]">
                              ₹{(Number(order.totalAmount) || 0).toLocaleString("en-IN")}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <span className="inline-flex items-center rounded-full border border-[#DCE2EA] bg-[#F8FAFC] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#334155]">
                                {String(order.status || "Pending").replace(/_/g, " ")}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="p-8 text-center text-sm text-[#64748B]">No orders have been placed yet.</p>
                )}
              </section>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-5">
              <SectionHeader
                title="Manage Products"
                subtitle="Add, edit, upload product photos, and manage inventory across categories."
                action={<AddBtn onClick={() => openProductModal()} label="Add Product" />}
              />

              {/* Product Search & Filter Toolbar */}
              <div className="space-y-3 rounded-xl border border-[#DCE2EA] bg-white p-4 shadow-xs">
                {/* Search Input + Counts */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
                    <input
                      type="text"
                      value={searchProduct}
                      onChange={(e) => {
                        setSearchProduct(e.target.value);
                        setProductPage(1);
                      }}
                      placeholder="Search products by name, SKU, category, or coupon..."
                      className="h-10 w-full rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] pl-10 pr-9 text-xs font-medium text-[#111827] placeholder:text-[#94A3B8] focus:border-[#122629] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#122629]/15"
                    />
                    {searchProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchProduct("");
                          setProductPage(1);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#64748B] hover:bg-[#EEF2F6] hover:text-[#B42318]"
                        title="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-[#475569]">
                    <span className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs">
                      Total: <strong className="text-[#111827] tabular-nums">{products.length}</strong>
                    </span>
                    {(searchProduct || productCategoryFilter !== "all" || productStatusFilter !== "all" || productSort !== "newest") && (
                      <span className="rounded-lg border border-[#BBF7D0] bg-[#ECFDF3] px-3 py-1.5 text-xs text-[#15803D]">
                        Filtered: <strong className="tabular-nums">{filteredProducts.length}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Filters: Category Filter, Sort Filter, Status Filter */}
                <div className="flex flex-wrap items-center gap-2.5 border-t border-[#E8EDF3] pt-3 text-xs">
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] px-3">
                    <Filter size={14} className="shrink-0 text-[#122629]" />
                    <span className="whitespace-nowrap text-xs font-bold text-[#475569]">Category:</span>
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => {
                        setProductCategoryFilter(e.target.value);
                        setProductPage(1);
                      }}
                      className="cursor-pointer bg-transparent text-xs font-bold text-[#111827] focus:outline-none"
                    >
                      <option value="all">All Categories ({products.length})</option>
                      {productCategoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex h-10 items-center gap-2 rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] px-3">
                    <ArrowUpDown size={14} className="shrink-0 text-[#122629]" />
                    <span className="whitespace-nowrap text-xs font-bold text-[#475569]">Sort:</span>
                    <select
                      value={productSort}
                      onChange={(e) => {
                        setProductSort(e.target.value);
                        setProductPage(1);
                      }}
                      className="cursor-pointer bg-transparent text-xs font-bold text-[#111827] focus:outline-none"
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

                  <div className="flex h-10 items-center gap-2 rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] px-3">
                    <span className="whitespace-nowrap text-xs font-bold text-[#475569]">Status:</span>
                    <select
                      value={productStatusFilter}
                      onChange={(e) => {
                        setProductStatusFilter(e.target.value);
                        setProductPage(1);
                      }}
                      className="cursor-pointer bg-transparent text-xs font-bold text-[#111827] focus:outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                  </div>

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
                      className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#861731]/30 bg-white px-3.5 text-xs font-bold text-[#861731] transition hover:bg-[#FDF2F4]"
                    >
                      <RotateCcw size={13} />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="hidden overflow-x-auto rounded-xl border border-[#DCE2EA] bg-white shadow-xs xl:block">
                <table className="w-full border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold uppercase tracking-wider text-[#475569]">
                      <th className="px-4 py-3.5">Product & Photos</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Coupon</th>
                      <th className="px-4 py-3.5">Price / MRP</th>
                      <th className="px-4 py-3.5">Stock</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDF2F7]">
                    {filteredProducts.length === 0 && (
                      <EmptyRow
                        cols={7}
                        text={searchProduct ? `No products matching "${searchProduct}".` : "No products found."}
                      />
                    )}
                    {paginatedProducts.map((p) => {
                      const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url;
                      return (
                        <tr key={p.id} className="transition hover:bg-[#F8FAFC]">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <ProductThumb
                                url={primaryImg}
                                alt={p.name || "Product photo"}
                                onAddPhoto={() => openProductModal(p)}
                              />
                              <div className="min-w-0 space-y-1">
                                <span className="block font-bold text-[14px] text-[#111827]">{p.name}</span>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                                  {p.sku && <span className="font-mono">SKU: {p.sku}</span>}
                                  {p.images && p.images.length > 0 ? (
                                    <span className="inline-flex items-center gap-1 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-xs font-semibold text-[#334155]">
                                      <Camera size={12} />
                                      <span>{p.images.length} {p.images.length === 1 ? "photo" : "photos"}</span>
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => openProductModal(p)}
                                      className="inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                                    >
                                      <Upload size={12} />
                                      <span>No photo uploaded</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            {p.categories?.[0]?.category?.name ? (
                              <div className="space-y-1">
                                <span className="block font-semibold text-[#111827]">{p.categories[0].category.name}</span>
                                {(p.subcategory?.name || p.subCategory) && (
                                  <span className="inline-block rounded border border-[#F3C967]/60 bg-[#FEFCE8] px-2 py-0.5 text-xs font-semibold text-[#854D0E]">
                                    › {p.subcategory?.name || p.subCategory}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="italic text-[#94A3B8]">Uncategorized</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 font-mono">
                            {p.couponCode ? (
                              <span className="rounded border border-[#D4DCE6] bg-[#F8FAFC] px-2.5 py-1 text-xs font-bold text-[#861731]">
                                {p.couponCode}
                              </span>
                            ) : (
                              <span className="text-[#94A3B8]">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 font-bold tabular-nums text-[#861731]">
                            {p.price > 0 ? (
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-[14px]">₹{p.price}</span>
                                {p.mrp > 0 && p.mrp !== p.price && (
                                  <span className="text-xs font-normal text-[#94A3B8] line-through">₹{p.mrp}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs font-semibold text-[#64748B]">₹0</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold tabular-nums ${p.stockQuantity > 0 ? "border-[#BBF7D0] bg-[#ECFDF3] text-[#15803D]" : "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"}`}>
                              {p.stockQuantity} in stock
                            </span>
                          </td>
                          <td className="px-4 py-3.5"><StatusBadge active={p.isActive} /></td>
                          <td className="px-4 py-3.5 text-right"><ActionBtns onEdit={() => openProductModal(p)} onDelete={() => deleteProduct(p.id, p.name)} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:hidden">
                {filteredProducts.length === 0 && (
                  <div className="rounded-xl border border-[#DCE2EA] bg-white p-8 text-center text-sm text-[#64748B] md:col-span-2">
                    {searchProduct ? `No products matching "${searchProduct}".` : "No products found."}
                  </div>
                )}
                {paginatedProducts.map((p) => {
                  const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url;
                  const categoryName = p.categories?.[0]?.category?.name || "Uncategorized";
                  return (
                    <article key={p.id} className="min-w-0 rounded-xl border border-[#DCE2EA] bg-white p-4 shadow-xs">
                      <div className="flex items-start gap-3">
                        <ProductThumb
                          url={primaryImg}
                          alt={p.name || "Product photo"}
                          onAddPhoto={() => openProductModal(p)}
                          sizeClass="h-16 w-16"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="min-w-0 flex-1 truncate text-[15px] font-bold text-[#111827]">{p.name}</h3>
                            <StatusBadge active={p.isActive} />
                          </div>
                          <p className="mt-1 truncate text-xs font-medium text-[#475569]">
                            {categoryName}{(p.subcategory?.name || p.subCategory) ? ` · ${p.subcategory?.name || p.subCategory}` : ""}
                          </p>
                          <p className="mt-1 font-mono text-xs text-[#64748B]">SKU: {p.sku || "—"}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] p-3 text-xs">
                        <div>
                          <span className="block text-xs font-semibold text-[#64748B]">Price / MRP</span>
                          <span className="mt-0.5 block text-[14px] font-extrabold tabular-nums text-[#861731]">
                            ₹{p.price || 0}
                            {p.mrp > 0 && p.mrp !== p.price && <span className="ml-1.5 text-xs font-normal text-[#94A3B8] line-through">₹{p.mrp}</span>}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-[#64748B]">Stock</span>
                          <span className={`mt-0.5 inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums ${p.stockQuantity > 0 ? "bg-[#ECFDF3] text-[#15803D]" : "bg-[#FEF2F2] text-[#B91C1C]"}`}>
                            {p.stockQuantity || 0}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-[#64748B]">Coupon</span>
                          <span className="mt-0.5 block truncate font-mono font-semibold text-[#111827]">{p.couponCode || "—"}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-[#64748B]">Photos</span>
                          <span className="mt-0.5 block font-semibold text-[#111827]">{p.images?.length || 0}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end border-t border-[#E8EDF3] pt-3">
                        <ActionBtns onEdit={() => openProductModal(p)} onDelete={() => deleteProduct(p.id, p.name)} />
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="rounded-xl border border-[#DCE2EA] bg-white px-4 pb-4 shadow-xs">
                <Pagination
                  currentPage={productPage}
                  totalItems={filteredProducts.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setProductPage}
                />
              </div>
            </div>
          )}

          {/* CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-5">
              <SectionHeader
                title="Manage Categories"
                subtitle="Organize store taxonomy, subcategories, and storefront category tiles."
                action={<AddBtn onClick={() => openCategoryModal()} label="Add Category" />}
              />

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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCategories.length === 0 && (
                  <p className="col-span-3 rounded-xl border border-[#DCE2EA] bg-white p-8 text-center text-sm text-[#64748B]">
                    {searchCategory ? `No categories matching "${searchCategory}".` : "No categories found."}
                  </p>
                )}
                {paginatedCategories.map(cat => (
                  <div key={cat.id} className="flex flex-col space-y-3 rounded-xl border border-[#DCE2EA] bg-white p-4 shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#DCE2EA] bg-[#F8FAFC]">
                          {cat.imageUrl ? (
                            <img src={normalizeProductImageUrl(cat.imageUrl)} alt={`${cat.name} category`} loading="lazy" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-[#64748B]">
                              <ImageIcon size={19} />
                              <span className="text-[11px] font-semibold">No img</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[15px] font-bold text-[#111827]">{cat.name}</h4>
                          {cat.parent && (
                            <span className="mt-1 inline-block rounded border border-[#F3C967]/60 bg-[#FEFCE8] px-2 py-0.5 text-xs font-semibold text-[#854D0E]">
                              Subcategory of: {cat.parent.name}
                            </span>
                          )}
                          <span className="mt-0.5 block font-mono text-xs text-[#64748B]">/{cat.slug}</span>
                          <span className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${cat.imageUrl ? "text-[#15803D]" : "text-[#B45309]"}`}>
                            <ImageIcon size={12} />{cat.imageUrl ? "Shop image set" : "Upload shop photo"}
                          </span>
                        </div>
                      </div>
                      <StatusBadge active={cat.isActive} />
                    </div>
                    <p className="flex-1 text-[13px] leading-relaxed text-[#475569]">{cat.description || "No description provided."}</p>
                    {cat.children && cat.children.length > 0 && (
                      <div className="space-y-1.5 border-t border-[#E8EDF3] pt-2.5">
                        <span className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                          Subcategories ({cat.children.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.children.map((child: any) => (
                            <span key={child.id} className="rounded-md border border-[#DCE2EA] bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-[#334155]">
                              {child.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 border-t border-[#E8EDF3] pt-3">
                      {!cat.parentId && (
                        <button onClick={() => openCategoryModal(undefined, cat.id)} className="flex h-9 items-center justify-center gap-1 rounded-lg border border-[#BBF7D0] bg-[#ECFDF3] px-3 text-xs font-bold text-[#15803D] transition hover:bg-[#D1FAE5]" title="Add Subcategory">
                          <Plus size={14} />Subcategory
                        </button>
                      )}
                      <button onClick={() => openCategoryModal(cat)} title="Edit category details or upload its shop image" className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] text-xs font-bold text-[#111827] transition hover:bg-[#EEF2F6]">
                        <Edit2 size={13} />Edit / Image
                      </button>
                      <button onClick={() => deleteCategory(cat.id, cat.name)} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 text-xs font-bold text-[#B91C1C] transition hover:bg-[#FEE2E2]">
                        <Trash2 size={13} />Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[#DCE2EA] bg-white px-4 pb-4 shadow-xs">
                <Pagination
                  currentPage={categoryPage}
                  totalItems={filteredCategories.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCategoryPage}
                />
              </div>
            </div>
          )}

          {/* BANNERS */}
          {activeTab === "banners" && (
            <div className="space-y-5">
              <SectionHeader
                title="Manage Banners"
                subtitle="Configure hero sliders and promotional banners."
                action={<AddBtn onClick={() => openBannerModal()} label="Add Banner" />}
              />

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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredBanners.length === 0 && (
                  <p className="col-span-2 rounded-xl border border-[#DCE2EA] bg-white p-8 text-center text-sm text-[#64748B]">
                    {searchBanner ? `No banners matching "${searchBanner}".` : "No banners found."}
                  </p>
                )}
                {paginatedBanners.map(ban => (
                  <div key={ban.id} className="space-y-3 rounded-xl border border-[#DCE2EA] bg-white p-4 shadow-xs">
                    {ban.desktopImage && (
                      <img src={normalizeProductImageUrl(ban.desktopImage)} alt={ban.title || "Banner"} className="h-36 w-full rounded-lg border border-[#DCE2EA] object-cover" />
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block rounded bg-[#122629] px-2.5 py-0.5 text-xs font-bold uppercase text-white">{ban.position}</span>
                        <h4 className="mt-1.5 text-[15px] font-bold text-[#111827]">{ban.title}</h4>
                        <p className="text-[13px] text-[#475569]">{ban.subtitle}</p>
                      </div>
                      <StatusBadge active={ban.isActive} />
                    </div>
                    <div className="flex gap-2 border-t border-[#E8EDF3] pt-3">
                      <button onClick={() => openBannerModal(ban)} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] text-xs font-bold text-[#111827] transition hover:bg-[#EEF2F6]">
                        <Edit2 size={13} />Edit
                      </button>
                      <button onClick={() => deleteBanner(ban.id, ban.title)} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] text-xs font-bold text-[#B91C1C] transition hover:bg-[#FEE2E2]">
                        <Trash2 size={13} />Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[#DCE2EA] bg-white px-4 pb-4 shadow-xs">
                <Pagination
                  currentPage={bannerPage}
                  totalItems={filteredBanners.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setBannerPage}
                />
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-5">
              <SectionHeader
                title="Customer Orders & Fulfillment"
                subtitle="Manage order pipeline stages, customer profiles, shipping dispatch, and courier tracking numbers."
              />

              {/* STAGE SUB-TABS (ZOHO CRM PIPELINE) */}
              <div className="flex items-center gap-2 overflow-x-auto rounded-xl border border-[#DCE2EA] bg-white p-2.5 text-[13px] font-bold shadow-xs">
                {[
                  { key: "pending", label: "Pending (Payment / Verify)", count: orderCounts.pending, color: "bg-amber-100 text-amber-800" },
                  { key: "confirmed", label: "Confirmed", count: orderCounts.confirmed, color: "bg-emerald-100 text-emerald-800" },
                  { key: "ready_to_ship", label: "Ready to Ship", count: orderCounts.readyToShip, color: "bg-blue-100 text-blue-800" },
                  { key: "dispatched", label: "Dispatched", count: orderCounts.dispatched, color: "bg-purple-100 text-purple-800" },
                  { key: "returned", label: "Returned", count: orderCounts.returned, color: "bg-rose-100 text-rose-800" },
                  { key: "all", label: "All Orders", count: orderCounts.all, color: "bg-slate-100 text-slate-800" },
                ].map((tab) => {
                  const isActive = orderSubTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => navigateToOrderStage(tab.key)}
                      className={`flex h-10 shrink-0 items-center gap-2 rounded-lg border px-4 whitespace-nowrap transition ${
                        isActive
                          ? "border-[#122629] bg-[#122629] text-white shadow-xs"
                          : "border-[#DCE2EA] bg-[#F8FAFC] text-[#334155] hover:border-[#94A3B8] hover:bg-white"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-extrabold tabular-nums ${
                          isActive ? "bg-white/20 text-white" : tab.color
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Orders Search & Filter Toolbar */}
              <div className="space-y-3 rounded-xl border border-[#DCE2EA] bg-white p-4 shadow-xs">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
                    <input
                      type="text"
                      value={searchOrder}
                      onChange={(e) => {
                        setSearchOrder(e.target.value);
                        setOrderPage(1);
                      }}
                      placeholder="Search by order #, email, phone, courier tracking #, or address..."
                      className="h-10 w-full rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] pl-10 pr-9 text-xs font-medium text-[#111827] placeholder:text-[#94A3B8] focus:border-[#122629] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#122629]/15"
                    />
                    {searchOrder && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchOrder("");
                          setOrderPage(1);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#64748B] hover:bg-[#EEF2F6] hover:text-[#B42318]"
                        title="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-[#475569]">
                    <span className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs">
                      Total: <strong className="text-[#111827] tabular-nums">{orders.length}</strong>
                    </span>
                    {(searchOrder || orderMonthFilter !== "all" || orderStatusFilter !== "all" || orderSort !== "newest") && (
                      <span className="rounded-lg border border-[#BBF7D0] bg-[#ECFDF3] px-3 py-1.5 text-xs text-[#15803D]">
                        Filtered: <strong className="tabular-nums">{filteredOrders.length}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 border-t border-[#E8EDF3] pt-3 text-xs">
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] px-3">
                    <Calendar size={14} className="shrink-0 text-[#122629]" />
                    <span className="whitespace-nowrap text-xs font-bold text-[#475569]">Month:</span>
                    <select
                      value={orderMonthFilter}
                      onChange={(e) => {
                        setOrderMonthFilter(e.target.value);
                        setOrderPage(1);
                      }}
                      className="cursor-pointer bg-transparent text-xs font-bold text-[#111827] focus:outline-none"
                    >
                      <option value="all">All Months</option>
                      {orderMonthOptions.map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex h-10 items-center gap-2 rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] px-3">
                    <ArrowUpDown size={14} className="shrink-0 text-[#122629]" />
                    <span className="whitespace-nowrap text-xs font-bold text-[#475569]">Sort:</span>
                    <select
                      value={orderSort}
                      onChange={(e) => {
                        setOrderSort(e.target.value);
                        setOrderPage(1);
                      }}
                      className="cursor-pointer bg-transparent text-xs font-bold text-[#111827] focus:outline-none"
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
                      className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#861731]/30 bg-white px-3.5 text-xs font-bold text-[#861731] transition hover:bg-[#FDF2F4]"
                    >
                      <RotateCcw size={13} />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ORDERS TABLE */}
              <div className="hidden overflow-x-auto rounded-xl border border-[#DCE2EA] bg-white shadow-xs xl:block">
                <table className="w-full border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold uppercase tracking-wider text-[#475569]">
                      <th className="px-4 py-3.5">Order Details</th>
                      <th className="px-4 py-3.5">Customer Profile & Address</th>
                      <th className="px-4 py-3.5">Amount & Items</th>
                      <th className="px-4 py-3.5">Payment</th>
                      <th className="px-4 py-3.5">Courier / Dispatch Notes</th>
                      <th className="px-4 py-3.5 text-right">Stage Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDF2F7]">
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
                        <tr key={ord.id} className="transition hover:bg-[#F8FAFC]">
                          <td className="px-4 py-4 align-top space-y-2">
                            <span className="block font-mono text-[13px] font-bold text-[#111827]">{ord.orderNumber}</span>
                            <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
                              <Clock size={12} className="shrink-0" />
                              {ord.createdAt ? new Date(ord.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "N/A"}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                                isDispatchedStage
                                  ? "border-purple-200 bg-purple-50 text-purple-800"
                                  : isDeliveredStage
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                  : isReadyToShipStage
                                  ? "border-blue-200 bg-blue-50 text-blue-800"
                                  : isReturnedStage
                                  ? "border-rose-200 bg-rose-50 text-rose-800"
                                  : isOrderPending
                                  ? "border-amber-200 bg-amber-50 text-amber-800"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
                              }`}
                            >
                              {isOrderPending ? "PENDING (PAYMENT)" : ord.status.replace(/_/g, " ")}
                            </span>
                          </td>

                          <td className="max-w-sm px-4 py-4 align-top space-y-2">
                            <div className="space-y-0.5">
                              <span className="flex items-center gap-1.5 font-semibold text-[#111827]">
                                <Mail size={13} className="shrink-0 text-[#122629]" />
                                <span className="truncate">{ord.customerEmail}</span>
                              </span>
                              <span className="flex items-center gap-1.5 text-xs font-medium text-[#475569]">
                                <Phone size={12} className="shrink-0 text-[#64748B]" />
                                {ord.customerPhone || addr.phone || "No Phone"}
                              </span>
                            </div>

                            <div className="space-y-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 text-xs text-[#334155]">
                              <div className="flex items-center gap-1 text-xs font-bold uppercase text-[#122629]">
                                <MapPin size={12} className="text-[#861731]" />
                                <span>Delivery Address</span>
                              </div>
                              <p className="line-clamp-2 leading-relaxed">{addr.addressText}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => openCustomerProfile(ord)}
                              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#D4DCE6] bg-white px-3 text-xs font-semibold text-[#122629] transition hover:border-[#122629] hover:bg-[#F8FAFC]"
                            >
                              <User size={12} />
                              <span>View Customer Profile & History</span>
                            </button>
                          </td>

                          <td className="px-4 py-4 align-top space-y-1">
                            <span className="block text-[15px] font-extrabold tabular-nums text-[#861731]">₹{ord.totalAmount}</span>
                            <span className="block text-xs font-semibold text-[#475569]">
                              {Array.isArray(ord.items) ? `${ord.items.length} item(s)` : "1 item"}
                            </span>
                            {Array.isArray(ord.items) && ord.items[0] && (
                              <div className="max-w-[170px] truncate text-xs font-medium text-[#334155]">
                                • {ord.items[0].productNameSnapshot || ord.items[0].productName || ord.items[0].product?.name}
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-4 align-top space-y-1">
                            <span className="inline-block rounded border border-[#D4DCE6] bg-[#F8FAFC] px-2.5 py-0.5 text-xs font-bold uppercase text-[#111827]">
                              {ord.paymentMethod || "COD"}
                            </span>
                            <span className={`block text-xs font-bold ${ord.paymentStatus === "COMPLETED" ? "text-[#15803D]" : "text-[#B45309]"}`}>
                              Payment: {ord.paymentStatus || "PENDING"}
                            </span>
                          </td>

                          <td className="max-w-xs px-4 py-4 align-top">
                            {addr.trackingNumber || addr.courierName || addr.courierNote ? (
                              <div className="space-y-1.5 rounded-lg border border-purple-200 bg-purple-50 p-2.5 text-xs text-purple-950">
                                {addr.courierName && (
                                  <div className="flex items-center gap-1.5 font-bold text-purple-900">
                                    <Truck size={13} className="text-purple-700" />
                                    <span>{addr.courierName}</span>
                                  </div>
                                )}
                                {addr.trackingNumber && (
                                  <div className="inline-block rounded border border-purple-200 bg-white px-2 py-0.5 font-mono text-xs font-bold text-purple-900">
                                    No: {addr.trackingNumber}
                                  </div>
                                )}
                                {addr.courierNote && (
                                  <p className="line-clamp-2 text-xs italic text-purple-800">
                                    &quot;{addr.courierNote}&quot;
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs italic text-[#94A3B8]">No courier info added yet</span>
                            )}
                          </td>

                          <td className="px-4 py-4 align-top text-right">
                            {isOrderPending && (
                              <div className="ml-auto flex max-w-[200px] flex-col gap-1.5">
                                <span className="inline-flex items-center justify-center gap-1 rounded border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                                  <Clock size={12} />
                                  <span>Payment Pending</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Confirm order ${ord.orderNumber} and verify payment?`)) {
                                      updateOrderStatus(ord.id, "CONFIRMED", undefined, isCod ? undefined : "COMPLETED");
                                    }
                                  }}
                                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#15803D] px-3 text-xs font-bold text-white shadow-2xs transition hover:bg-[#166534]"
                                  title="Confirm order & mark payment received"
                                >
                                  <Check size={14} />
                                  <span>Confirm Order</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Cancel pending order ${ord.orderNumber}?`)) {
                                      updateOrderStatus(ord.id, "CANCELLED");
                                    }
                                  }}
                                  className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 text-xs font-bold text-rose-800 transition hover:bg-rose-100"
                                >
                                  <X size={13} />
                                  <span>Cancel Order</span>
                                </button>
                              </div>
                            )}

                            {isOrderConfirmed && (
                              <div className="ml-auto flex max-w-[200px] flex-col gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(ord.id, "READY_TO_SHIP")}
                                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#122629] px-3 text-xs font-bold text-white shadow-2xs transition hover:bg-[#1D3B3F]"
                                >
                                  <span>Ready to Ship</span>
                                  <ArrowRight size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Cancel confirmed order ${ord.orderNumber}?`)) {
                                      updateOrderStatus(ord.id, "CANCELLED");
                                    }
                                  }}
                                  className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 text-xs font-bold text-rose-800 transition hover:bg-rose-100"
                                >
                                  <X size={13} />
                                  <span>Cancel Order</span>
                                </button>
                              </div>
                            )}

                            {isReadyToShipStage && (
                              <div className="ml-auto flex max-w-[200px] flex-col gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openDispatchModal(ord, "DISPATCHED")}
                                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-purple-700 px-3 text-xs font-bold text-white shadow-2xs transition hover:bg-purple-800"
                                >
                                  <Package size={14} />
                                  <span>Dispatch Order</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Cancel order ${ord.orderNumber}?`)) {
                                      updateOrderStatus(ord.id, "CANCELLED");
                                    }
                                  }}
                                  className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 text-xs font-bold text-rose-800 transition hover:bg-rose-100"
                                >
                                  <X size={13} />
                                  <span>Cancel Order</span>
                                </button>
                              </div>
                            )}

                            {isDispatchedStage && (
                              <div className="ml-auto flex max-w-[200px] flex-col gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => updateOrderStatus(ord.id, "DELIVERED")}
                                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#15803D] px-3 text-xs font-bold text-white shadow-2xs transition hover:bg-[#166534]"
                                >
                                  <Check size={14} />
                                  <span>Mark Delivered</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openDispatchModal(ord, "DISPATCHED")}
                                  className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-2.5 text-xs font-bold text-purple-900 transition hover:bg-purple-100"
                                >
                                  <Edit2 size={12} />
                                  <span>Edit Courier No</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Mark order ${ord.orderNumber} as returned?`)) {
                                      updateOrderStatus(ord.id, "RETURNED");
                                    }
                                  }}
                                  className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 text-xs font-bold text-rose-800 transition hover:bg-rose-100"
                                >
                                  <RotateCcw size={12} />
                                  <span>Mark Returned</span>
                                </button>
                              </div>
                            )}

                            {isDeliveredStage && (
                              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                                <Check size={13} />
                                <span>Delivered</span>
                              </span>
                            )}

                            {isReturnedStage && (
                              <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-800">
                                {st === "CANCELLED" ? (
                                  <>
                                    <X size={13} />
                                    <span>Cancelled</span>
                                  </>
                                ) : (
                                  <>
                                    <RotateCcw size={13} />
                                    <span>Returned</span>
                                  </>
                                )}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:hidden">
                {filteredOrders.length === 0 && (
                  <div className="rounded-xl border border-[#DCE2EA] bg-white p-8 text-center text-sm text-[#64748B] md:col-span-2">
                    {searchOrder ? `No orders matching "${searchOrder}".` : `No orders in "${orderSubTab.replace(/_/g, " ")}" stage.`}
                  </div>
                )}
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

                  return (
                    <article key={ord.id} className="min-w-0 space-y-4 rounded-xl border border-[#DCE2EA] bg-white p-4 shadow-xs">
                      <div className="flex items-start justify-between gap-3 border-b border-[#E8EDF3] pb-3">
                        <div className="min-w-0">
                          <p className="truncate font-mono text-[14px] font-bold text-[#111827]">{ord.orderNumber || "Order"}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748B]"><Clock size={12} />{placedDate}</p>
                        </div>
                        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${statusClass}`}>
                          {isPending ? "Payment pending" : st.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="min-w-0 rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] p-3">
                          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[#64748B]">Customer</p>
                          <p className="break-all text-[13px] font-bold text-[#111827]">{ord.customerEmail || "Email not provided"}</p>
                          <p className="mt-1 text-xs text-[#475569]">{ord.customerPhone || addr.phone || "Phone not provided"}</p>
                          <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-[#475569]"><MapPin size={13} className="mt-0.5 shrink-0 text-[#861731]" /><span>{addr.addressText}</span></p>
                          <button type="button" onClick={() => openCustomerProfile(ord)} className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[#D4DCE6] bg-white px-3 text-xs font-bold text-[#122629] transition hover:border-[#861731]/40 hover:text-[#861731]">
                            <User size={13} />View customer history
                          </button>
                        </div>
                        <div className="rounded-lg border border-[#E8EDF3] bg-[#F8FAFC] p-3">
                          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[#64748B]">Order & payment</p>
                          <p className="text-xl font-extrabold tabular-nums text-[#861731]">₹{Number(ord.totalAmount || 0).toLocaleString("en-IN")}</p>
                          <p className="mt-1 text-xs font-semibold text-[#334155]">
                            {Array.isArray(ord.items) ? `${ord.items.length} item(s)` : "1 item"}
                            {Array.isArray(ord.items) && ord.items[0] ? ` · ${ord.items[0].productNameSnapshot || ord.items[0].productName || ord.items[0].product?.name || "Product"}` : ""}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-lg border border-[#D4DCE6] bg-white px-2.5 py-1 text-xs font-bold uppercase text-[#111827]">{ord.paymentMethod || "COD"}</span>
                            <span className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase ${pst === "COMPLETED" ? "bg-[#ECFDF3] text-[#15803D]" : "bg-amber-50 text-amber-800"}`}>{pst}</span>
                          </div>
                        </div>
                      </div>

                      {(addr.trackingNumber || addr.courierName || addr.courierNote) && (
                        <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-xs text-purple-950">
                          <p className="flex items-center gap-1.5 font-bold"><Truck size={14} />{addr.courierName || "Courier"}</p>
                          {addr.trackingNumber && <p className="mt-1 break-all font-mono font-bold">Tracking: {addr.trackingNumber}</p>}
                          {addr.courierNote && <p className="mt-1 text-xs">{addr.courierNote}</p>}
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-2 border-t border-[#E8EDF3] pt-3 sm:grid-cols-2">
                        {isPending && (
                          <>
                            <button type="button" onClick={() => { if (confirm(`Confirm order ${ord.orderNumber} and verify payment?`)) updateOrderStatus(ord.id, "CONFIRMED", undefined, isCod ? undefined : "COMPLETED"); }} className="h-10 rounded-lg bg-[#15803D] px-3 text-xs font-bold text-white transition hover:bg-[#166534]">
                              <Check size={14} className="mr-1.5 inline" />Confirm order
                            </button>
                            <button type="button" onClick={() => { if (confirm(`Cancel pending order ${ord.orderNumber}?`)) updateOrderStatus(ord.id, "CANCELLED"); }} className="h-10 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-800 transition hover:bg-rose-100">
                              Cancel order
                            </button>
                          </>
                        )}
                        {isConfirmed && (
                          <>
                            <button type="button" onClick={() => updateOrderStatus(ord.id, "READY_TO_SHIP")} className="h-10 rounded-lg bg-[#122629] px-3 text-xs font-bold text-white transition hover:bg-[#1D3B3F]">
                              Ready to ship <ArrowRight size={14} className="ml-1 inline" />
                            </button>
                            <button type="button" onClick={() => { if (confirm(`Cancel confirmed order ${ord.orderNumber}?`)) updateOrderStatus(ord.id, "CANCELLED"); }} className="h-10 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-800 transition hover:bg-rose-100">
                              Cancel order
                            </button>
                          </>
                        )}
                        {isReady && (
                          <>
                            <button type="button" onClick={() => openDispatchModal(ord, "DISPATCHED")} className="h-10 rounded-lg bg-purple-700 px-3 text-xs font-bold text-white transition hover:bg-purple-800">
                              <Truck size={14} className="mr-1.5 inline" />Dispatch order
                            </button>
                            <button type="button" onClick={() => { if (confirm(`Cancel order ${ord.orderNumber}?`)) updateOrderStatus(ord.id, "CANCELLED"); }} className="h-10 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-800 transition hover:bg-rose-100">
                              Cancel order
                            </button>
                          </>
                        )}
                        {isDispatched && (
                          <>
                            <button type="button" onClick={() => updateOrderStatus(ord.id, "DELIVERED")} className="h-10 rounded-lg bg-[#15803D] px-3 text-xs font-bold text-white transition hover:bg-[#166534]">
                              <Check size={14} className="mr-1.5 inline" />Mark delivered
                            </button>
                            <button type="button" onClick={() => openDispatchModal(ord, "DISPATCHED")} className="h-10 rounded-lg border border-purple-200 bg-purple-50 px-3 text-xs font-bold text-purple-900 transition hover:bg-purple-100">
                              <Edit2 size={14} className="mr-1.5 inline" />Edit courier
                            </button>
                            <button type="button" onClick={() => { if (confirm(`Mark order ${ord.orderNumber} as returned?`)) updateOrderStatus(ord.id, "RETURNED"); }} className="h-10 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-800 transition hover:bg-rose-100 sm:col-span-2">
                              Mark returned
                            </button>
                          </>
                        )}
                        {isDelivered && <p className="rounded-lg bg-emerald-50 px-3 py-2.5 text-center text-xs font-bold text-emerald-800 sm:col-span-2">Delivered</p>}
                        {isReturned && <p className="rounded-lg bg-rose-50 px-3 py-2.5 text-center text-xs font-bold text-rose-800 sm:col-span-2">{st === "CANCELLED" ? "Cancelled" : "Returned"}</p>}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="rounded-xl border border-[#DCE2EA] bg-white px-4 pb-4 shadow-xs">
                <Pagination
                  currentPage={orderPage}
                  totalItems={filteredOrders.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setOrderPage}
                />
              </div>
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCoupons.length === 0 && (
                  <p className="col-span-3 rounded-xl border border-[#DCE2EA] bg-white p-8 text-center text-sm text-[#64748B]">
                    {searchCoupon ? `No coupons matching "${searchCoupon}".` : "No coupons yet."}
                  </p>
                )}
                {paginatedCoupons.map(cp => (
                  <div key={cp.id} className="space-y-2.5 rounded-xl border border-[#DCE2EA] bg-white p-4 shadow-xs">
                    <span className="inline-block rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] px-3 py-1 font-mono text-base font-extrabold text-[#861731]">{cp.code}</span>
                    <p className="text-[14px] font-bold text-[#111827]">{cp.discountPercent}% Discount</p>
                    <p className="text-xs font-medium text-[#475569]">Min Order: ₹{cp.minOrderAmount}</p>
                    <p className="text-xs text-[#64748B]">Expires: {new Date(cp.expiryDate).toLocaleDateString()}</p>
                    <div className="flex gap-2 border-t border-[#E8EDF3] pt-3">
                      <button onClick={() => openCouponModal(cp)} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] text-xs font-bold text-[#111827] transition hover:bg-[#EEF2F6]">
                        <Edit2 size={13} />Edit
                      </button>
                      <button onClick={() => deleteCoupon(cp.id, cp.code)} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] text-xs font-bold text-[#B91C1C] transition hover:bg-[#FEE2E2]">
                        <Trash2 size={13} />Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-[#DCE2EA] bg-white px-4 pb-4 shadow-xs">
                <Pagination
                  currentPage={couponPage}
                  totalItems={filteredCoupons.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCouponPage}
                />
              </div>
            </div>
          )}

          {activeTab === "collections" && (
            <div className="space-y-5">
              <SectionHeader title="Manage Collections" subtitle="Create collections and choose which database products appear in each one." action={<AddBtn onClick={() => openCollectionModal()} label="Add Collection" />} />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {collections.map((item) => (
                  <div key={item.id} className="space-y-3 rounded-xl border border-[#DCE2EA] bg-white p-4 shadow-xs">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[15px] font-bold text-[#111827]">{item.title}</h3>
                      <StatusBadge active={item.isActive} />
                    </div>
                    <p className="text-[13px] text-[#475569]">{item.description || "No description"}</p>
                    <p className="text-xs font-semibold text-[#64748B]">{item.products?.length || 0} linked products</p>
                    <div className="flex gap-2 border-t border-[#E8EDF3] pt-3">
                      <button onClick={() => openCollectionModal(item)} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] text-xs font-bold text-[#111827] transition hover:bg-[#EEF2F6]">
                        <Edit2 size={13} />Edit
                      </button>
                      <button onClick={() => deleteCollection(item)} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] text-xs font-bold text-[#B91C1C] transition hover:bg-[#FEE2E2]">
                        <Trash2 size={13} />Delete
                      </button>
                    </div>
                  </div>
                ))}
                {!collections.length && <p className="col-span-2 rounded-xl border border-[#DCE2EA] bg-white p-8 text-center text-sm text-[#64748B]">No collections yet. Add one to publish it on the Collections page.</p>}
              </div>
            </div>
          )}

          {activeTab === "blog" && (
            <div className="space-y-5">
              <SectionHeader title="Manage Blog Articles" subtitle="Draft, publish, edit, and remove journal articles." action={<AddBtn onClick={() => openArticleModal()} label="Add Article" />} />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {articles.map((item) => (
                  <div key={item.id} className="space-y-3 rounded-xl border border-[#DCE2EA] bg-white p-4 shadow-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#861731]">{item.tag}</span>
                      <StatusBadge active={item.isPublished} />
                    </div>
                    <h3 className="text-[15px] font-bold text-[#111827]">{item.title}</h3>
                    <p className="text-[13px] text-[#475569]">{item.excerpt}</p>
                    <div className="flex gap-2 border-t border-[#E8EDF3] pt-3">
                      <button onClick={() => openArticleModal(item)} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#D4DCE6] bg-[#F8FAFC] text-xs font-bold text-[#111827] transition hover:bg-[#EEF2F6]">
                        <Edit2 size={13} />Edit
                      </button>
                      <button onClick={() => deleteArticle(item)} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] text-xs font-bold text-[#B91C1C] transition hover:bg-[#FEE2E2]">
                        <Trash2 size={13} />Delete
                      </button>
                    </div>
                  </div>
                ))}
                {!articles.length && <p className="col-span-2 rounded-xl border border-[#DCE2EA] bg-white p-8 text-center text-sm text-[#64748B]">No articles yet. Add your first article here.</p>}
              </div>
            </div>
          )}

          {(activeTab === "benefits" || activeTab === "offers") && (
            <form onSubmit={savePageContent} className="space-y-5">
              <SectionHeader title={activeTab === "benefits" ? "Benefits Page Content" : "Offers Page Content"} subtitle="Edit public page text and choose content directly from your product and collection catalog." />
              <div className="space-y-5 rounded-xl border border-[#DCE2EA] bg-white p-5 shadow-xs">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(contentForm).filter(([key, value]) => !["comparison", "ingredients", "productIds", "collectionIds"].includes(key) && typeof value === "string").map(([key, value]) => (
                    <FieldRow key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}>
                      <textarea rows={key.toLowerCase().includes("description") || key.toLowerCase().includes("subtitle") ? 3 : 2} value={value as string} onChange={(e) => setContentForm({ ...contentForm, [key]: e.target.value })} className={inp} />
                    </FieldRow>
                  ))}
                </div>
                {activeTab === "benefits" && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {(["comparison", "ingredients"] as const).map((key) => (
                      <FieldRow key={key} label={`${key === "comparison" ? "Comparison rows" : "Ingredient cards"} (JSON)`}>
                        <textarea rows={10} value={jsonDraft[key]} onChange={(e) => setJsonDraft({ ...jsonDraft, [key]: e.target.value })} className={`${inp} font-mono text-xs`} />
                        <p className="mt-1.5 text-xs text-[#64748B]">{key === "comparison" ? 'Each row: { "feature": "...", "hm": "...", "others": "..." }' : 'Each item: { "name": "...", "tag": "...", "desc": "...", "icon": "leaf" }'}</p>
                      </FieldRow>
                    ))}
                  </div>
                )}
                {activeTab === "offers" && (
                  <>
                    <FieldRow label="Products shown in offer picks">
                      <div className="max-h-56 space-y-2 overflow-auto rounded-lg border border-[#DCE2EA] bg-[#F8FAFC] p-3">
                        {products.map((product) => (
                          <label key={product.id} className="flex items-center gap-2.5 text-[13px] text-[#111827]">
                            <input type="checkbox" checked={(contentForm.productIds || []).includes(product.id)} onChange={(e) => setContentForm({ ...contentForm, productIds: e.target.checked ? [...(contentForm.productIds || []), product.id] : (contentForm.productIds || []).filter((id: string) => id !== product.id) })} />
                            <span>{product.name} — ₹{product.price}</span>
                          </label>
                        ))}
                      </div>
                    </FieldRow>
                    <FieldRow label="Collections shown as bundles">
                      <div className="max-h-40 space-y-2 overflow-auto rounded-lg border border-[#DCE2EA] bg-[#F8FAFC] p-3">
                        {collections.map((collection) => (
                          <label key={collection.id} className="flex items-center gap-2.5 text-[13px] text-[#111827]">
                            <input type="checkbox" checked={(contentForm.collectionIds || []).includes(collection.id)} onChange={(e) => setContentForm({ ...contentForm, collectionIds: e.target.checked ? [...(contentForm.collectionIds || []), collection.id] : (contentForm.collectionIds || []).filter((id: string) => id !== collection.id) })} />
                            <span>{collection.title}</span>
                          </label>
                        ))}
                      </div>
                    </FieldRow>
                  </>
                )}
                <div className="flex justify-end border-t border-[#E8EDF3] pt-4">
                  <button disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#861731] px-5 text-[13px] font-bold text-white shadow-2xs transition hover:bg-[#6E1228]">
                    <Save size={15} />Save Page Content
                  </button>
                </div>
              </div>
            </form>
          )}

            </div>
            </div>
          </main>
        </div>

      {/* PRODUCT MODAL */}
      {productModal && (
        <Modal
          title={productModal === "add" ? "Add New Product" : `Edit: ${productModal.name}`}
          onClose={() => { setModalError(null); setProductModal(null); }}
          error={modalError}
          onDismissError={() => setModalError(null)}
        >
          <form onSubmit={handleSaveProduct} className="space-y-4 text-[13px]">
            <FieldRow label="Product Name *">
              <input required type="text" value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })} className={inp} placeholder="e.g. Royal Jasmine Agarbatti" />
            </FieldRow>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FieldRow label="Price (₹)">
                <input type="number" step="0.01" value={pForm.price} onChange={e => setPForm({ ...pForm, price: e.target.value })} className={inp} placeholder="Leave empty or enter price" />
              </FieldRow>
              <FieldRow label="MRP (₹)">
                <input type="number" step="0.01" value={pForm.mrp} onChange={e => setPForm({ ...pForm, mrp: e.target.value })} className={inp} placeholder="Leave empty or enter MRP" />
              </FieldRow>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                canUploadImmediately={productModal !== "add"}
                onUploadNow={handleUploadPendingProductImages}
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
              <div className="flex flex-col gap-2 sm:flex-row">
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
              <label className="flex cursor-pointer items-center gap-2.5">
                <input type="checkbox" checked={pForm.isActive} onChange={e => setPForm({ ...pForm, isActive: e.target.checked })} className="h-4 w-4 rounded" />
                <span className="text-[13px] font-semibold text-[#1E293B]">Product is Active (visible on site)</span>
              </label>
            )}
            <FormButtons onCancel={() => { setModalError(null); setProductModal(null); }} saving={saving} />
          </form>
        </Modal>
      )}

      {/* CATEGORY MODAL */}
      {categoryModal && (
        <Modal
          title={categoryModal === "add" ? "Add New Category" : `Edit: ${categoryModal.name}`}
          onClose={() => { setModalError(null); setCategoryModal(null); }}
          error={modalError}
          onDismissError={() => setModalError(null)}
        >
          <form onSubmit={handleSaveCategory} className="space-y-4 text-[13px]">
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
              <ImageUploadControl
                currentUrl={cForm.imageUrl}
                disabled={saving}
                onFileChange={setCImageFile}
                onDelete={() => {
                  void (async () => {
                    if (!categoryModal?.id || !confirm("Delete this category image?")) return;
                    setModalError(null);
                    setSaving(true);
                    try {
                      await deleteImage("CATEGORY", categoryModal.id);
                      setCForm({ ...cForm, imageUrl: "" });
                      showStatus("success", "Category image deleted.");
                      await Promise.all([fetchTab(), refreshDbData()]);
                    } catch (error: any) {
                      const msg = error?.message || "Image deletion failed";
                      setModalError(msg);
                      showStatus("error", msg);
                    } finally {
                      setSaving(false);
                    }
                  })();
                }}
              />
            </FieldRow>
            <FormButtons onCancel={() => { setModalError(null); setCategoryModal(null); }} saving={saving} />
          </form>
        </Modal>
      )}

      {/* BANNER MODAL */}
      {bannerModal && (
        <Modal
          title={bannerModal === "add" ? "Add New Banner" : `Edit: ${bannerModal.title}`}
          onClose={() => { setModalError(null); setBannerModal(null); }}
          error={modalError}
          onDismissError={() => setModalError(null)}
        >
          <form onSubmit={handleSaveBanner} className="space-y-4 text-[13px]">
            <FieldRow label="Banner Title *">
              <input required type="text" value={bForm.title} onChange={e => setBForm({ ...bForm, title: e.target.value })} className={inp} placeholder="e.g. Festive Special" />
            </FieldRow>
            <FieldRow label="Subtitle">
              <input type="text" value={bForm.subtitle} onChange={e => setBForm({ ...bForm, subtitle: e.target.value })} className={inp} placeholder="Tagline or offer text" />
            </FieldRow>
            <FieldRow label="Desktop Image">
              <ImageUploadControl
                currentUrl={bForm.desktopImage}
                required={bannerModal === "add"}
                disabled={saving}
                onFileChange={setBImageFile}
                onDelete={() => {
                  void (async () => {
                    if (!bannerModal?.id || !confirm("Delete this banner image?")) return;
                    setModalError(null);
                    setSaving(true);
                    try {
                      await deleteImage("BANNER", bannerModal.id);
                      setBForm({ ...bForm, desktopImage: "" });
                      showStatus("success", "Banner image deleted.");
                      await Promise.all([fetchTab(), refreshDbData()]);
                    } catch (error: any) {
                      const msg = error?.message || "Image deletion failed";
                      setModalError(msg);
                      showStatus("error", msg);
                    } finally {
                      setSaving(false);
                    }
                  })();
                }}
              />
            </FieldRow>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              <label className="flex cursor-pointer items-center gap-2.5">
                <input type="checkbox" checked={bForm.isActive} onChange={e => setBForm({ ...bForm, isActive: e.target.checked })} className="h-4 w-4 rounded" />
                <span className="text-[13px] font-semibold text-[#1E293B]">Banner is Active</span>
              </label>
            )}
            <FormButtons onCancel={() => { setModalError(null); setBannerModal(null); }} saving={saving} />
          </form>
        </Modal>
      )}

      {/* COUPON MODAL */}
      {couponModal && (
        <Modal
          title={couponModal === "add" ? "Create Discount Coupon" : `Edit: ${couponModal.code}`}
          onClose={() => { setModalError(null); setCouponModal(null); }}
          error={modalError}
          onDismissError={() => setModalError(null)}
        >
          <form onSubmit={handleSaveCoupon} className="space-y-4 text-[13px]">
            <FieldRow label="Coupon Code *">
              <input required type="text" value={qForm.code} onChange={e => setQForm({ ...qForm, code: e.target.value.toUpperCase() })} className={`${inp} uppercase`} placeholder="e.g. DIWALI20" />
            </FieldRow>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            <FormButtons onCancel={() => { setModalError(null); setCouponModal(null); }} saving={saving} />
          </form>
        </Modal>
      )}

      {collectionModal && (
        <Modal
          title={collectionModal === "add" ? "Add Collection" : `Edit: ${collectionModal.title}`}
          onClose={() => { setModalError(null); setCollectionModal(null); }}
          error={modalError}
          onDismissError={() => setModalError(null)}
        >
          <form onSubmit={saveCollection} className="space-y-4 text-[13px]">
            <FieldRow label="Collection title *"><input required value={collectionForm.title} onChange={(e) => setCollectionForm({ ...collectionForm, title: e.target.value })} className={inp} /></FieldRow>
            <FieldRow label="Description"><textarea rows={3} value={collectionForm.description} onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })} className={inp} /></FieldRow>
            <FieldRow label="Banner image URL"><input value={collectionForm.bannerUrl} onChange={(e) => setCollectionForm({ ...collectionForm, bannerUrl: e.target.value })} className={inp} placeholder="https://..." /></FieldRow>
            <FieldRow label="Products in collection">
              <div className="max-h-56 space-y-2 overflow-auto rounded-lg border border-[#DCE2EA] bg-[#F8FAFC] p-3">
                {products.map((product) => (
                  <label key={product.id} className="flex items-center gap-2.5 text-[13px] text-[#111827]">
                    <input type="checkbox" checked={collectionForm.productIds.includes(product.id)} onChange={(e) => setCollectionForm({ ...collectionForm, productIds: e.target.checked ? [...collectionForm.productIds, product.id] : collectionForm.productIds.filter((id: string) => id !== product.id) })} />
                    <span>{product.name}</span>
                  </label>
                ))}
              </div>
            </FieldRow>
            <label className="flex items-center gap-2.5 text-[13px] font-semibold text-[#1E293B]">
              <input type="checkbox" checked={collectionForm.isActive} onChange={(e) => setCollectionForm({ ...collectionForm, isActive: e.target.checked })} className="h-4 w-4 rounded" />
              <span>Visible on the website</span>
            </label>
            <FormButtons onCancel={() => { setModalError(null); setCollectionModal(null); }} saving={saving} />
          </form>
        </Modal>
      )}

      {articleModal && (
        <Modal
          title={articleModal === "add" ? "Add Blog Article" : `Edit: ${articleModal.title}`}
          onClose={() => { setModalError(null); setArticleModal(null); }}
          error={modalError}
          onDismissError={() => setModalError(null)}
        >
          <form onSubmit={saveArticle} className="space-y-4 text-[13px]">
            <FieldRow label="Article title *"><input required value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} className={inp} /></FieldRow>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><FieldRow label="Slug (optional)"><input value={articleForm.slug} onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })} className={inp} /></FieldRow><FieldRow label="Category label *"><input required value={articleForm.label} onChange={(e) => setArticleForm({ ...articleForm, label: e.target.value })} className={inp} /></FieldRow></div>
            <FieldRow label="Short excerpt *"><textarea required rows={3} value={articleForm.excerpt} onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })} className={inp} /></FieldRow>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><FieldRow label="Tag *"><input required value={articleForm.tag} onChange={(e) => setArticleForm({ ...articleForm, tag: e.target.value })} className={inp} /></FieldRow><FieldRow label="Reading time"><input value={articleForm.readingTime} onChange={(e) => setArticleForm({ ...articleForm, readingTime: e.target.value })} className={inp} /></FieldRow></div>
            <FieldRow label="Key takeaway"><input value={articleForm.highlight} onChange={(e) => setArticleForm({ ...articleForm, highlight: e.target.value })} className={inp} /></FieldRow>
            <FieldRow label="Article body"><textarea rows={5} value={articleForm.body} onChange={(e) => setArticleForm({ ...articleForm, body: e.target.value })} className={inp} /></FieldRow>
            <FieldRow label="Author"><input value={articleForm.author} onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })} className={inp} /></FieldRow>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><FieldRow label="Text color"><input value={articleForm.color} onChange={(e) => setArticleForm({ ...articleForm, color: e.target.value })} className={inp} /></FieldRow><FieldRow label="Card background"><input value={articleForm.background} onChange={(e) => setArticleForm({ ...articleForm, background: e.target.value })} className={inp} /></FieldRow><FieldRow label="Order"><input type="number" value={articleForm.displayOrder} onChange={(e) => setArticleForm({ ...articleForm, displayOrder: e.target.value })} className={inp} /></FieldRow></div>
            <div className="flex gap-5 text-[13px] font-semibold text-[#1E293B]"><label className="flex items-center gap-2"><input type="checkbox" checked={articleForm.isFeatured} onChange={(e) => setArticleForm({ ...articleForm, isFeatured: e.target.checked })} className="h-4 w-4 rounded" />Featured</label><label className="flex items-center gap-2"><input type="checkbox" checked={articleForm.isPublished} onChange={(e) => setArticleForm({ ...articleForm, isPublished: e.target.checked })} className="h-4 w-4 rounded" />Published</label></div>
            <FormButtons onCancel={() => { setModalError(null); setArticleModal(null); }} saving={saving} />
          </form>
        </Modal>
      )}

      {/* DISPATCH ORDER MODAL */}
      {dispatchModal && (
        <Modal
          title={`Dispatch Order: ${dispatchModal.orderNumber}`}
          onClose={() => { setModalError(null); setDispatchModal(null); }}
          error={modalError}
          onDismissError={() => setModalError(null)}
        >
          <form onSubmit={handleSaveDispatch} className="space-y-4 text-[13px]">
            <div className="space-y-1 rounded-xl border border-purple-200 bg-purple-50 p-3.5">
              <span className="flex items-center gap-1.5 text-[13px] font-bold text-purple-900">
                <Truck size={15} className="text-purple-700" />
                <span>Courier & Dispatch Tracking Information</span>
              </span>
              <p className="text-xs leading-relaxed text-purple-800">
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

            <FormButtons onCancel={() => { setModalError(null); setDispatchModal(null); }} saving={saving} />
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
              <div className="space-y-4 text-[13px]">
                {/* Customer Contact Card */}
                <div className="space-y-3 rounded-xl border border-[#DCE2EA] bg-white p-4 shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-[#E8EDF3] pb-2.5 text-[#111827]">
                    <User className="text-[#861731]" size={18} />
                    <span className="text-base font-bold">{addr.recipientName || "Customer Profile"}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-[13px] sm:grid-cols-2">
                    <div>
                      <span className="block text-xs font-semibold text-[#64748B]">Email Address</span>
                      <span className="font-bold text-[#111827]">{ord.customerEmail}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-[#64748B]">Phone Number</span>
                      <span className="font-bold text-[#111827]">{ord.customerPhone || addr.phone || "N/A"}</span>
                    </div>
                  </div>

                  <div className="border-t border-[#E8EDF3] pt-3">
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#64748B]">
                      <MapPin size={13} className="text-[#861731]" /> Full Delivery Address
                    </span>
                    <p className="mt-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[13px] font-medium leading-relaxed text-[#111827]">
                      {addr.addressText}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E8EDF3] pt-2 text-[13px] font-bold text-[#334155]">
                    <span>Total Lifetime Orders: <strong className="text-[#861731] tabular-nums">{customerEmailOrders.length}</strong></span>
                    <span>Total Spent: <strong className="text-[#861731] tabular-nums">₹{customerEmailOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)}</strong></span>
                  </div>
                </div>

                {/* Order Breakdown */}
                <div className="space-y-3 rounded-xl border border-[#DCE2EA] bg-white p-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#E8EDF3] pb-2.5">
                    <span className="font-mono text-sm font-bold text-[#111827]">{ord.orderNumber}</span>
                    <span className="rounded-full bg-[#122629] px-3 py-1 text-xs font-bold uppercase text-white">
                      {ord.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#64748B]">Items Ordered</span>
                    {Array.isArray(ord.items) && ord.items.length > 0 ? (
                      ord.items.map((it: any) => (
                        <div
                          key={it.id || it.productId}
                          className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2.5"
                        >
                          {it.imageUrlSnapshot && (
                            <img
                              src={normalizeProductImageUrl(it.imageUrlSnapshot)}
                              alt=""
                              className="h-11 w-11 rounded-lg border border-[#DCE2EA] bg-white object-contain"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="block text-[13px] font-bold text-[#111827]">
                              {it.productNameSnapshot || it.productName || it.product?.name}
                            </span>
                            <span className="font-mono text-xs text-[#64748B]">
                              SKU: {it.skuSnapshot || "N/A"} · Qty: {it.quantity}
                            </span>
                          </div>
                          <span className="font-extrabold tabular-nums text-[#861731]">₹{it.totalPrice || it.unitPriceSnapshot * it.quantity}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#64748B]">Order items list unavailable.</p>
                    )}
                  </div>

                  {/* Courier info inside profile modal */}
                  {(addr.courierName || addr.trackingNumber || addr.courierNote) && (
                    <div className="space-y-1 rounded-lg border border-purple-200 bg-purple-50 p-3 text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-purple-900">
                        <Truck size={13} className="text-purple-700" />
                        <span>Courier Tracking Details</span>
                      </span>
                      <p className="font-bold text-purple-900">{addr.courierName} — Consignment #{addr.trackingNumber}</p>
                      {addr.courierNote && <p className="italic text-purple-800">&quot;{addr.courierNote}&quot;</p>}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setCustomerProfileModal(null)}
                    className="h-10 rounded-lg bg-[#122629] px-5 text-[13px] font-bold text-white transition hover:bg-[#1D3B3F]"
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
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#F4F6F9] text-sm font-semibold text-[#122629]">Loading CRM workspace…</div>}>
      <AdminWorkspace />
    </Suspense>
  );
}
