"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  User, Package, Heart, MapPin, Bell, LogOut, ArrowRight, ShieldCheck,
  Lock, Edit2, Plus, Trash2, CheckCircle2, AlertCircle, X, Save,
  Home, Phone, Mail, Check, RefreshCw,
} from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { useStore, UserAddress } from "@/components/store";

export default function AccountPage() {
  const {
    wishlist, user, token, logoutUser, updateUserProfile,
    savedAddresses, defaultAddress, createAddress,
    updateAddress, setDefaultAddress, deleteAddress,
  } = useStore();

  const [activeTab, setActiveTab] = useState("profile");

  // Orders State & Fetching
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchUserOrders = useCallback(async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${API_URL}/orders?myOrders=true&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Failed to load user orders", err);
    } finally {
      setLoadingOrders(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUserOrders();
    }
  }, [token, fetchUserOrders]);

  // Profile Edit State & Modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });
  const [profileStatus, setProfileStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Address Modal State
  const [addressModal, setAddressModal] = useState<null | "add" | UserAddress>(null);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressForm, setAddressForm] = useState({
    recipientName: "",
    phone: "",
    street: "",
    city: "",
    state: "Tamil Nadu",
    postalCode: "",
    isDefault: false,
  });
  const [addressStatus, setAddressStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [user]);

  const openAddAddressModal = () => {
    setAddressForm({
      recipientName: user?.fullName || "",
      phone: user?.phone || "",
      street: "",
      city: "Coimbatore",
      state: "Tamil Nadu",
      postalCode: "",
      isDefault: savedAddresses.length === 0,
    });
    setAddressModal("add");
    setAddressStatus(null);
  };

  const openEditAddressModal = (addr: UserAddress) => {
    setAddressForm({
      recipientName: addr.recipientName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
    });
    setAddressModal(addr);
    setAddressStatus(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileStatus(null);

    const payload: any = {
      fullName: profileForm.fullName.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
    };

    if (profileForm.newPassword) {
      payload.currentPassword = profileForm.currentPassword;
      payload.newPassword = profileForm.newPassword;
    }

    const res = await updateUserProfile(payload);
    setProfileSaving(false);

    if (res.success) {
      setProfileStatus({ type: "success", text: "Devotee profile details updated successfully!" });
      setTimeout(() => {
        setIsEditingProfile(false);
        setProfileStatus(null);
      }, 1200);
    } else {
      setProfileStatus({ type: "error", text: res.message || "Failed to update profile." });
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSaving(true);
    setAddressStatus(null);

    let res: { success: boolean; message?: string };
    if (addressModal === "add") {
      res = await createAddress(addressForm);
    } else if (addressModal && typeof addressModal === "object") {
      res = await updateAddress(addressModal.id, addressForm);
    } else {
      return;
    }

    setAddressSaving(false);
    if (res.success) {
      setAddressStatus({ type: "success", text: "Address saved successfully!" });
      setTimeout(() => {
        setAddressModal(null);
        setAddressStatus(null);
      }, 1000);
    } else {
      setAddressStatus({ type: "error", text: res.message || "Failed to save address." });
    }
  };

  const handleDeleteAddress = async (id: string, name: string) => {
    if (!confirm(`Remove address for "${name}"?`)) return;
    await deleteAddress(id);
  };

  if (!user) {
    return (
      <InnerPage
        eyebrow="DEVOTEE ACCOUNT"
        title="Your Sacred Account"
        subtitle="Sign in to view your orders, profile details, and saved wishlist."
      >
        <div className="mx-auto max-w-md px-4 sm:px-6 py-16 text-center">
          <div className="bg-[#FFF8E7] p-8 rounded-3xl border-2 border-[#C89B3C]/40 shadow-xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FFF4D6] border-2 border-[#F5C84C] flex items-center justify-center text-[#A90C35] mx-auto shadow-inner">
              <Lock size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-extrabold text-[#6B4226]">Authentication Required</h3>
              <p className="text-xs text-[#292524]/70">Please log in or register a new account to access your devotee dashboard.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/login"
                className="py-3 bg-[#A90C35] hover:bg-[#870B2B] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                <span>Sign In</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/signup"
                className="py-3 bg-white hover:bg-[#F4D35E]/30 text-[#6B4226] border border-[#C89B3C]/50 text-xs font-extrabold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>Create Account</span>
              </Link>
            </div>
          </div>
        </div>
      </InnerPage>
    );
  }

  return (
    <InnerPage
      eyebrow="DEVOTEE ACCOUNT"
      title={`Welcome, ${user.fullName}`}
      subtitle="Manage your profile, tracked orders, saved mandir delivery addresses, and wishlist."
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Menu */}
          <aside className="lg:col-span-4 bg-[#FFF8E7] p-6 rounded-3xl border-2 border-[#C89B3C]/40 space-y-2 shadow-sm">
            <div className="p-4 bg-[#F4D35E]/20 rounded-2xl border border-[#C89B3C]/30 mb-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E85D04] text-[#FFF8E7] flex items-center justify-center text-xl font-bold shadow-inner">
                ॐ
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg text-[#6B4226] font-bold truncate">{user.fullName}</h3>
                <span className="inline-block bg-[#A90C35] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
                  {user.role} MEMBER
                </span>
              </div>
            </div>

            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="w-full text-left p-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between bg-[#A90C35] text-white hover:bg-[#870B2B] shadow-md transition my-3"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} />
                  <span>Admin Control Panel</span>
                </div>
                <ArrowRight size={16} />
              </Link>
            )}

            {[
              { id: "profile", label: "My Profile", icon: User },
              { id: "addresses", label: "Saved Delivery Addresses", icon: MapPin, count: savedAddresses.length },
              { id: "orders", label: "Recent Orders", icon: Package, count: orders.length },
              { id: "notifications", label: "Devotion Alerts", icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition ${
                    activeTab === tab.id
                      ? "bg-[#6B4226] text-[#FFF8E7] shadow-sm"
                      : "text-[#6B4226] hover:bg-[#F4D35E]/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-[#F4D35E]/50 text-[#6B4226]"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}

            <Link
              href="/wishlist"
              className="w-full text-left p-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-between text-[#6B4226] hover:bg-[#F4D35E]/30 transition"
            >
              <div className="flex items-center gap-3">
                <Heart size={16} />
                <span>Saved Wishlist</span>
              </div>
              <span className="bg-[#B23A48] text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                {wishlist.length}
              </span>
            </Link>

            <button
              onClick={logoutUser}
              className="w-full text-left p-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 text-[#991B1B] hover:bg-[#FDF2F2] transition mt-4 border-t border-[#C89B3C]/30 pt-4"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </aside>

          {/* Tab Content (Right) */}
          <div className="lg:col-span-8 bg-[#FFF8E7] p-6 sm:p-8 rounded-3xl border-2 border-[#C89B3C]/40 shadow-sm space-y-6">
            
            {/* 1. MY PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C89B3C]/30 pb-4">
                  <div>
                    <h3 className="font-display text-2xl text-[#6B4226] font-bold">
                      Devotee Profile Details
                    </h3>
                    <p className="text-xs text-[#292524]/70">
                      View and manage your personal details and contact preferences.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditingProfile(true);
                      setProfileStatus(null);
                    }}
                    className="px-4 py-2.5 bg-[#A90C35] hover:bg-[#870B2B] text-white text-xs font-extrabold rounded-xl shadow transition flex items-center gap-2 shrink-0 self-start sm:self-auto"
                  >
                    <Edit2 size={14} />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                  <div className="p-4 bg-white rounded-2xl border border-[#C89B3C]/30 shadow-xs space-y-1">
                    <span className="text-[#292524]/60 block text-[10px] uppercase font-bold flex items-center gap-1.5">
                      <User size={12} className="text-[#A90C35]" />
                      <span>Full Name</span>
                    </span>
                    <span className="text-[#6B4226] font-extrabold text-sm block">{user.fullName}</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-[#C89B3C]/30 shadow-xs space-y-1">
                    <span className="text-[#292524]/60 block text-[10px] uppercase font-bold flex items-center gap-1.5">
                      <Mail size={12} className="text-[#A90C35]" />
                      <span>Email Address</span>
                    </span>
                    <span className="text-[#6B4226] font-extrabold text-sm block">{user.email}</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-[#C89B3C]/30 shadow-xs space-y-1">
                    <span className="text-[#292524]/60 block text-[10px] uppercase font-bold flex items-center gap-1.5">
                      <Phone size={12} className="text-[#A90C35]" />
                      <span>Mobile Phone</span>
                    </span>
                    <span className="text-[#6B4226] font-extrabold text-sm block">
                      {user.phone || <span className="text-gray-400 italic font-normal">Not provided</span>}
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-[#C89B3C]/30 shadow-xs space-y-1">
                    <span className="text-[#292524]/60 block text-[10px] uppercase font-bold flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-[#A90C35]" />
                      <span>Account Role</span>
                    </span>
                    <span className="text-[#A90C35] font-extrabold text-sm block">{user.role}</span>
                  </div>
                </div>

                {/* Default Delivery Address Highlight */}
                <div className="p-5 bg-white rounded-2xl border-2 border-[#C89B3C]/40 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#A90C35] flex items-center gap-1.5">
                      <Home size={14} />
                      <span>Primary Delivery Address (Used in Checkout)</span>
                    </span>
                    <button
                      onClick={() => setActiveTab("addresses")}
                      className="text-xs font-extrabold text-[#6B4226] hover:text-[#A90C35] underline"
                    >
                      Manage Addresses →
                    </button>
                  </div>
                  {defaultAddress ? (
                    <div className="text-xs space-y-1 text-[#292524]">
                      <p className="font-extrabold text-sm text-[#6B4226]">{defaultAddress.recipientName}</p>
                      <p className="text-[#292524]/80">
                        {defaultAddress.street}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.postalCode}
                      </p>
                      <p className="text-[#292524]/70 font-semibold">Contact: {defaultAddress.phone}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xs text-[#292524]/70">No default delivery address set yet.</p>
                      <button
                        onClick={openAddAddressModal}
                        className="px-3 py-1.5 bg-[#FFF4D6] hover:bg-[#F4D35E]/50 text-[#6B4226] text-xs font-bold rounded-xl border border-[#C89B3C]/40"
                      >
                        + Add Address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. SAVED ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C89B3C]/30 pb-4">
                  <div>
                    <h3 className="font-display text-2xl text-[#6B4226] font-bold">
                      Saved Delivery Addresses
                    </h3>
                    <p className="text-xs text-[#292524]/70">
                      Addresses saved here will automatically appear by default during checkout.
                    </p>
                  </div>
                  <button
                    onClick={openAddAddressModal}
                    className="px-4 py-2.5 bg-[#A90C35] hover:bg-[#870B2B] text-white text-xs font-extrabold rounded-xl shadow transition flex items-center gap-2 shrink-0 self-start sm:self-auto"
                  >
                    <Plus size={16} />
                    <span>Add New Address</span>
                  </button>
                </div>

                {savedAddresses.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-[#C89B3C]/30 space-y-3">
                    <MapPin size={36} className="mx-auto text-[#C89B3C]/60" />
                    <p className="text-sm font-bold text-[#6B4226]">No delivery addresses saved yet.</p>
                    <p className="text-xs text-[#292524]/70 max-w-sm mx-auto">
                      Add your home or temple delivery address to enjoy seamless 1-click checkout.
                    </p>
                    <button
                      onClick={openAddAddressModal}
                      className="mt-2 px-5 py-2.5 bg-[#A90C35] text-white text-xs font-extrabold rounded-xl shadow"
                    >
                      Add Delivery Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-5 bg-white rounded-2xl border-2 transition shadow-xs flex flex-col justify-between space-y-3 ${
                          addr.isDefault
                            ? "border-[#588157] bg-gradient-to-b from-[#F4FBF4] to-white"
                            : "border-[#C89B3C]/30"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-sm text-[#6B4226]">{addr.recipientName}</span>
                            {addr.isDefault && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#588157] text-white text-[9px] font-extrabold flex items-center gap-1 shadow-xs whitespace-nowrap">
                                <CheckCircle2 size={11} />
                                <span>DEFAULT DELIVERY</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#292524]/85 leading-relaxed">
                            {addr.street}
                          </p>
                          <p className="text-xs font-semibold text-[#6B4226]">
                            {addr.city}, {addr.state} - <span className="font-mono">{addr.postalCode}</span>
                          </p>
                          <p className="text-xs text-[#292524]/70 font-medium">
                            Phone: <strong className="text-[#6B4226]">{addr.phone}</strong>
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#C89B3C]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                          {!addr.isDefault ? (
                            <button
                              type="button"
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-[11px] font-extrabold text-[#588157] hover:underline flex items-center gap-1"
                            >
                              <Check size={13} />
                              <span>Make Default Delivery</span>
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-[#588157] italic">
                              Active checkout address
                            </span>
                          )}

                          <div className="flex items-center gap-2 ml-auto">
                            <button
                              type="button"
                              onClick={() => openEditAddressModal(addr)}
                              className="p-1.5 text-[#6B4226] hover:bg-[#F4D35E]/30 rounded-lg transition"
                              title="Edit address"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr.id, addr.recipientName)}
                              className="p-1.5 text-[#991B1B] hover:bg-[#FEF2F2] rounded-lg transition"
                              title="Delete address"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. RECENT ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#C89B3C]/30 pb-3">
                  <div>
                    <h3 className="font-display text-2xl text-[#6B4226] font-bold">
                      Order History &amp; Tracking
                    </h3>
                    <p className="text-xs text-[#292524]/70">
                      Track your sacred purchases and delivery progress.
                    </p>
                  </div>
                  <button
                    onClick={fetchUserOrders}
                    disabled={loadingOrders}
                    className="p-2 rounded-xl border border-[#C89B3C]/40 text-[#6B4226] hover:bg-[#F4D35E]/30 transition disabled:opacity-50"
                    title="Refresh orders"
                  >
                    <RefreshCw size={14} className={loadingOrders ? "animate-spin" : ""} />
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="text-center py-12 text-xs font-bold text-[#6B4226]/60">
                    Loading your sacred orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-[#C89B3C]/30 text-center space-y-3">
                    <Package size={40} className="mx-auto text-[#C89B3C]" />
                    <h4 className="font-display text-lg font-bold text-[#6B4226]">
                      No orders placed yet
                    </h4>
                    <p className="text-xs text-[#292524]/70 max-w-sm mx-auto">
                      You haven&apos;t placed any sacred orders yet. Explore our handcrafted collection of agarbattis, pure camphor, and dhoop.
                    </p>
                    <Link
                      href="/shop"
                      className="btn-saffron px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 mt-2"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => {
                      const dateStr = ord.createdAt
                        ? new Date(ord.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recent";

                      let parsedAddress: any = null;
                      try {
                        parsedAddress = typeof ord.shippingAddress === "string" ? JSON.parse(ord.shippingAddress) : ord.shippingAddress;
                      } catch {}

                      const statusColors: Record<string, string> = {
                        DELIVERED: "bg-[#588157] text-[#FFF8E7]",
                        SHIPPED: "bg-[#2563EB] text-[#FFF8E7]",
                        PROCESSING: "bg-[#C89B3C] text-[#FFF8E7]",
                        CONFIRMED: "bg-[#588157] text-[#FFF8E7]",
                        PENDING: "bg-[#E85D04] text-[#FFF8E7]",
                        CANCELLED: "bg-[#991B1B] text-[#FFF8E7]",
                      };

                      return (
                        <div
                          key={ord.id}
                          className="p-5 bg-white rounded-2xl border border-[#C89B3C]/40 space-y-4 shadow-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C89B3C]/20 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                    statusColors[ord.status] || "bg-[#E85D04] text-white"
                                  }`}
                                >
                                  {ord.status}
                                </span>
                                <span className="text-[11px] text-[#292524]/60 font-medium">
                                  Placed on {dateStr}
                                </span>
                              </div>
                              <h4 className="font-mono text-sm font-extrabold text-[#6B4226] mt-1">
                                #{ord.orderNumber}
                              </h4>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                              <span className="font-extrabold text-[#A90C35] text-base">
                                ₹{ord.totalAmount}
                              </span>
                              <span className="text-[10px] font-bold text-[#292524]/60 uppercase">
                                {ord.paymentMethod} • {ord.paymentStatus}
                              </span>
                            </div>
                          </div>

                          {/* Line items list */}
                          {Array.isArray(ord.items) && ord.items.length > 0 && (
                            <div className="space-y-2 divide-y divide-[#C89B3C]/10">
                              {ord.items.map((item: any) => (
                                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs gap-3">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    {item.imageUrlSnapshot && (
                                      <img
                                        src={item.imageUrlSnapshot}
                                        alt={item.productNameSnapshot}
                                        className="w-9 h-9 object-cover rounded-lg border border-[#C89B3C]/30 shrink-0"
                                      />
                                    )}
                                    <div className="min-w-0">
                                      <p className="font-bold text-[#6B4226] truncate">
                                        {item.productNameSnapshot}
                                      </p>
                                      <p className="text-[10px] text-[#292524]/60">
                                        Qty: {item.quantity} • ₹{item.unitPriceSnapshot}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-bold text-[#6B4226] shrink-0">
                                    ₹{item.totalPrice}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Shipping address details & Track order link */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#C89B3C]/20 text-[11px]">
                            {parsedAddress && (
                              <p className="text-[#292524]/70 line-clamp-1">
                                <span className="font-bold text-[#6B4226]">Ship to: </span>
                                {parsedAddress.recipientName || parsedAddress.name}, {parsedAddress.city}, {parsedAddress.state} - {parsedAddress.postalCode || parsedAddress.pincode}
                              </p>
                            )}
                            <Link
                              href={`/orders/${ord.orderNumber || ord.id}`}
                              className="px-4 py-2 bg-[#A90C35] hover:bg-[#870B2B] text-white font-extrabold rounded-xl transition inline-flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto text-xs"
                            >
                              <span>Track Order</span>
                              <ArrowRight size={13} />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 4. DEVOTION ALERTS TAB */}
            {activeTab === "notifications" && (
              <div className="space-y-5">
                <h3 className="font-display text-2xl text-[#6B4226] font-bold border-b border-[#C89B3C]/30 pb-3">
                  Auspicious Notifications
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-2xl border border-[#C89B3C]/30 flex items-start gap-3 shadow-xs">
                    <span className="text-2xl">🪔</span>
                    <div>
                      <h4 className="font-display text-base font-bold text-[#6B4226]">
                        Navaratri Special Collection is Ready
                      </h4>
                      <p className="text-xs text-[#292524]/70 mt-0.5">
                        Authentic Paal Sambrani and Kesar Loban for daily festive poojas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EDIT PROFILE MODAL */}
      {/* ========================================================================= */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FFF8E7] p-6 sm:p-8 rounded-3xl border-2 border-[#C89B3C]/50 shadow-2xl max-w-lg w-full space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#C89B3C]/30 pb-3">
              <h3 className="font-display text-xl font-bold text-[#6B4226]">Edit Profile Details</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1.5 rounded-full hover:bg-[#F4D35E]/30 text-[#6B4226] transition"
              >
                <X size={18} />
              </button>
            </div>

            {profileStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  profileStatus.type === "success"
                    ? "bg-[#ECFDF5] text-[#065F46] border border-[#10B981]"
                    : "bg-[#FEF2F2] text-[#991B1B] border border-[#F87171]"
                }`}
              >
                {profileStatus.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{profileStatus.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#6B4226] mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full p-2.5 bg-white rounded-xl border border-[#C89B3C]/40 font-semibold text-xs text-[#292524] focus:outline-none focus:ring-1 focus:ring-[#A90C35]"
                  placeholder="e.g. Sarvathan C"
                />
              </div>

              <div>
                <label className="block font-bold text-[#6B4226] mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full p-2.5 bg-white rounded-xl border border-[#C89B3C]/40 font-semibold text-xs text-[#292524] focus:outline-none focus:ring-1 focus:ring-[#A90C35]"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block font-bold text-[#6B4226] mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full p-2.5 bg-white rounded-xl border border-[#C89B3C]/40 font-semibold text-xs text-[#292524] focus:outline-none focus:ring-1 focus:ring-[#A90C35]"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="pt-2 border-t border-[#C89B3C]/20 space-y-2">
                <span className="text-[11px] font-extrabold uppercase text-[#6B4226]/80 block">
                  Change Password (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#6B4226] mb-1">Current Password</label>
                    <input
                      type="password"
                      value={profileForm.currentPassword}
                      onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl border border-[#C89B3C]/40 text-xs text-[#292524] focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#6B4226] mb-1">New Password</label>
                    <input
                      type="password"
                      value={profileForm.newPassword}
                      onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                      className="w-full p-2.5 bg-white rounded-xl border border-[#C89B3C]/40 text-xs text-[#292524] focus:outline-none"
                      placeholder="Minimum 6 chars"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 bg-gray-200 text-[#6B4226] font-extrabold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-5 py-2.5 bg-[#A90C35] hover:bg-[#870B2B] disabled:opacity-60 text-white font-extrabold rounded-xl shadow text-xs flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>{profileSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT ADDRESS MODAL */}
      {/* ========================================================================= */}
      {addressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FFF8E7] p-6 sm:p-8 rounded-3xl border-2 border-[#C89B3C]/50 shadow-2xl max-w-lg w-full space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#C89B3C]/30 pb-3">
              <h3 className="font-display text-xl font-bold text-[#6B4226]">
                {addressModal === "add" ? "Add Delivery Address" : "Edit Delivery Address"}
              </h3>
              <button
                onClick={() => setAddressModal(null)}
                className="p-1.5 rounded-full hover:bg-[#F4D35E]/30 text-[#6B4226] transition"
              >
                <X size={18} />
              </button>
            </div>

            {addressStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  addressStatus.type === "success"
                    ? "bg-[#ECFDF5] text-[#065F46] border border-[#10B981]"
                    : "bg-[#FEF2F2] text-[#991B1B] border border-[#F87171]"
                }`}
              >
                {addressStatus.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{addressStatus.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#6B4226] mb-1">Recipient Name *</label>
                  <input
                    required
                    type="text"
                    value={addressForm.recipientName}
                    onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#C89B3C]/40 font-semibold text-xs text-[#292524] focus:outline-none focus:ring-1 focus:ring-[#A90C35]"
                    placeholder="Full recipient name"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#6B4226] mb-1">Mobile Phone *</label>
                  <input
                    required
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#C89B3C]/40 font-semibold text-xs text-[#292524] focus:outline-none focus:ring-1 focus:ring-[#A90C35]"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#6B4226] mb-1">Street Address / House No / Apartment *</label>
                <textarea
                  required
                  rows={2}
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full p-2.5 bg-white rounded-xl border border-[#C89B3C]/40 font-semibold text-xs text-[#292524] focus:outline-none focus:ring-1 focus:ring-[#A90C35]"
                  placeholder="e.g. 143 A Peelamedu Main Road, Sowripalayam"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#6B4226] mb-1">City *</label>
                  <input
                    required
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#C89B3C]/40 font-semibold text-xs text-[#292524] focus:outline-none focus:ring-1 focus:ring-[#A90C35]"
                    placeholder="e.g. Coimbatore"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#6B4226] mb-1">State *</label>
                  <select
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#C89B3C]/40 font-semibold text-xs text-[#292524] focus:outline-none focus:ring-1 focus:ring-[#A90C35]"
                  >
                    {["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra", "Delhi", "Gujarat", "Other"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#6B4226] mb-1">PIN Code *</label>
                  <input
                    required
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#C89B3C]/40 font-semibold text-xs text-[#292524] focus:outline-none focus:ring-1 focus:ring-[#A90C35]"
                    placeholder="641028"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="rounded text-[#A90C35] focus:ring-[#A90C35]"
                />
                <span className="text-xs font-bold text-[#6B4226]">
                  Make this my default delivery address for 1-click checkout
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#C89B3C]/20">
                <button
                  type="button"
                  onClick={() => setAddressModal(null)}
                  className="px-4 py-2.5 bg-gray-200 text-[#6B4226] font-extrabold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressSaving}
                  className="px-5 py-2.5 bg-[#A90C35] hover:bg-[#870B2B] disabled:opacity-60 text-white font-extrabold rounded-xl shadow text-xs flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>{addressSaving ? "Saving..." : "Save Address"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </InnerPage>
  );
}
