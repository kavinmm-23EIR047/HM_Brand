"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Package, Heart, MapPin, Bell, LogOut, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { useStore } from "@/components/store";

export default function AccountPage() {
  const { wishlist, user, logoutUser } = useStore();
  const [activeTab, setActiveTab] = useState("profile");

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
      subtitle="Manage your profile, tracked orders, saved mandir addresses, and wishlist."
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Menu */}
          <aside className="lg:col-span-4 bg-[#FFF8E7] p-6 rounded-2xl border-2 border-[#C89B3C]/40 space-y-2 shadow-sm">
            <div className="p-4 bg-[#F4D35E]/20 rounded-xl border border-[#C89B3C]/30 mb-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E85D04] text-[#FFF8E7] flex items-center justify-center text-lg font-bold">
                ॐ
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg text-[#6B4226] font-bold truncate">{user.fullName}</h3>
                <span className="inline-block bg-[#A90C35] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                  {user.role} MEMBER
                </span>
              </div>
            </div>

            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="w-full text-left p-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-between bg-[#A90C35] text-white hover:bg-[#870B2B] shadow-md transition my-3"
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
              { id: "orders", label: "Recent Orders", icon: Package },
              { id: "addresses", label: "Saved Addresses", icon: MapPin },
              { id: "notifications", label: "Devotion Alerts", icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition ${
                    activeTab === tab.id
                      ? "bg-[#6B4226] text-[#FFF8E7] shadow-sm"
                      : "text-[#6B4226] hover:bg-[#F4D35E]/30"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <Link
              href="/wishlist"
              className="w-full text-left p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between text-[#6B4226] hover:bg-[#F4D35E]/30 transition"
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
              className="w-full text-left p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 text-[#991B1B] hover:bg-[#FDF2F2] transition mt-4 border-t border-[#C89B3C]/30 pt-4"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </aside>

          {/* Tab Content (Right) */}
          <div className="lg:col-span-8 bg-[#FFF8E7] p-8 rounded-2xl border-2 border-[#C89B3C]/40 shadow-sm space-y-6">
            {activeTab === "profile" && (
              <div className="space-y-5">
                <h3 className="font-display text-2xl text-[#6B4226] font-bold border-b border-[#C89B3C]/30 pb-3">
                  Devotee Profile Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                  <div className="p-4 bg-white rounded-xl border border-[#C89B3C]/30">
                    <span className="text-[#292524]/60 block text-[10px] uppercase font-bold">Full Name</span>
                    <span className="text-[#6B4226] font-bold text-sm mt-1 block">{user.fullName}</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#C89B3C]/30">
                    <span className="text-[#292524]/60 block text-[10px] uppercase font-bold">Email Address</span>
                    <span className="text-[#6B4226] font-bold text-sm mt-1 block">{user.email}</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#C89B3C]/30">
                    <span className="text-[#292524]/60 block text-[10px] uppercase font-bold">Mobile Phone</span>
                    <span className="text-[#6B4226] font-bold text-sm mt-1 block">{user.phone || "Not provided"}</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#C89B3C]/30">
                    <span className="text-[#292524]/60 block text-[10px] uppercase font-bold">Account Role</span>
                    <span className="text-[#A90C35] font-bold text-sm mt-1 block">{user.role}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-5">
                <h3 className="font-display text-2xl text-[#6B4226] font-bold border-b border-[#C89B3C]/30 pb-3">
                  Order History
                </h3>
                <div className="p-5 bg-white rounded-xl border border-[#C89B3C]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="bg-[#588157] text-[#FFF8E7] text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                      Delivered
                    </span>
                    <h4 className="font-display text-lg text-[#6B4226] font-bold mt-2">
                      Order #HM-2026-88219
                    </h4>
                    <p className="text-xs text-[#292524]/60">HM Royal Chandan + Organic Dhoop Cones</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#E85D04] text-base block">₹349</span>
                    <Link
                      href="/orders/HM-2026-88219"
                      className="text-xs font-bold text-[#6B4226] hover:text-[#E85D04] underline mt-1 inline-block"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-5">
                <h3 className="font-display text-2xl text-[#6B4226] font-bold border-b border-[#C89B3C]/30 pb-3">
                  Saved Mandir Addresses
                </h3>
                <div className="p-5 bg-white rounded-xl border border-[#C89B3C]/40 space-y-2 text-xs">
                  <span className="bg-[#E85D04] text-[#FFF8E7] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Primary Home
                  </span>
                  <p className="font-bold text-sm text-[#6B4226]">{user.fullName}</p>
                  <p className="text-[#292524]/80">
                    143 A Peelamedu Main Road, Sowripalayam, Coimbatore, Tamil Nadu - 641028
                  </p>
                  <p className="text-[#292524]/60">Phone: {user.phone || "+91 98765 43210"}</p>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-5">
                <h3 className="font-display text-2xl text-[#6B4226] font-bold border-b border-[#C89B3C]/30 pb-3">
                  Auspicious Notifications
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-xl border border-[#C89B3C]/30 flex items-start gap-3">
                    <span className="text-lg">🪔</span>
                    <div>
                      <h4 className="font-display text-base font-bold text-[#6B4226]">
                        Navaratri Special Collection is Ready
                      </h4>
                      <p className="text-xs text-[#292524]/70 mt-0.5">
                        Authentic Paal Sambrani and Kesar Loban for evening Golu aartis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </InnerPage>
  );
}
