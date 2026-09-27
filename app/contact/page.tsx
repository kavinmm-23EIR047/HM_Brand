"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Sparkles, Send, Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { MascotNamaste } from "@/components/mascot-art";
import { AuspiciousSeal } from "@/components/divine-motifs";

function InstagramIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <InnerPage
      eyebrow="CONNECT WITH HM BRAND"
      title="We Are Here For Your Sacred Moments"
      subtitle="Have a question about our traditional botanical fragrances, 10-in-1 Aroma Family Pack, bulk festive orders, or distribution? Reach out directly to our Coimbatore team."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          
          {/* Left: Official Contact & Workshop Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-7 sm:p-8 rounded-3xl border-2 border-[#F6C84C]/50 shadow-md space-y-6">
              
              <div className="flex items-center gap-3 border-b border-[#F6C84C]/30 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#9E1830] text-[#F6C84C] flex items-center justify-center text-2xl shadow-xs font-bold font-heading">
                  HM
                </div>
                <div>
                  <h3 className="font-heading text-2xl text-[#173B3A] font-extrabold">HM Brand</h3>
                  <p className="text-xs text-[#9E1830] font-bold tracking-wide">Smell of Purity • Coimbatore</p>
                </div>
              </div>

              {/* Sacred Tagline Box */}
              <div className="rounded-2xl bg-[#FFF4D6] p-4 border border-[#F6C84C]/60 space-y-1">
                <p className="text-xs font-bold italic text-[#9E1830] leading-relaxed">
                  &ldquo;Beyond Form, Fragrance Speaks — Listen With Your Heart.&rdquo;
                </p>
                <p className="text-[11px] text-[#173B3A] font-semibold">
                  &ldquo;உருவத்திற்கு அப்பால், வாசனை பேசுகிறது; உங்கள் இதயத்தால் கேளுங்கள்.&rdquo;
                </p>
              </div>

              {/* Contact Data */}
              <div className="space-y-4 text-xs sm:text-sm text-[#292524]/85 font-medium">
                
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#9E1830] shrink-0 mt-1" size={18} />
                  <div>
                    <strong className="text-[#173B3A] block font-bold">Sanctum Workshop &amp; Store:</strong>
                    <span>143A, Peelamedu Main Road, Sowripalayam, Coimbatore - 641028, Tamil Nadu, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-[#9E1830] shrink-0" size={18} />
                  <div>
                    <strong className="text-[#173B3A] block font-bold">Phone / WhatsApp Support:</strong>
                    <span>+91 9345633399 · +91 6382177441</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-[#9E1830] shrink-0" size={18} />
                  <div>
                    <strong className="text-[#173B3A] block font-bold">Official Email:</strong>
                    <span>jayamassociatescoimbatore@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <InstagramIcon className="text-[#9E1830] shrink-0" size={18} />
                  <div>
                    <strong className="text-[#173B3A] block font-bold">Official Instagram:</strong>
                    <span className="font-bold text-[#9E1830]">@hmagarbatti5</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="text-[#9E1830] shrink-0" size={18} />
                  <div>
                    <strong className="text-[#173B3A] block font-bold">Customer Service Hours:</strong>
                    <span>Monday to Saturday: 9:00 AM – 8:00 PM IST</span>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-[#F6C84C]/30 flex items-center justify-between">
                <span className="text-xs font-bold text-[#287541] flex items-center gap-1.5">
                  <ShieldCheck size={16} /> Pan-India Express Delivery
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#9E1830] bg-[#FFF4D6] px-2.5 py-1 rounded-full border border-[#F6C84C]/50">
                  100% Genuine
                </span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-10 rounded-3xl border-2 border-[#F6C84C]/50 shadow-md space-y-6">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#9E1830] uppercase block">
                SEND A MESSAGE
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#173B3A] mt-1">
                How Can We Serve You?
              </h2>
            </div>

            {submitted ? (
              <div className="bg-[#FFF4D6] p-8 rounded-2xl border border-[#F6C84C]/60 text-center space-y-4">
                <CheckCircle2 className="mx-auto text-[#287541]" size={48} />
                <h3 className="font-heading text-2xl text-[#173B3A] font-bold">
                  Message Received With Gratitude!
                </h3>
                <p className="text-sm text-[#292524]/80 max-w-md mx-auto font-sans">
                  Our Coimbatore team will contact you shortly via email or phone.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="rounded-full bg-[#9E1830] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#F47A20] transition shadow-md"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#173B3A] mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-[#F6C84C]/60 bg-[#FFF8E7]/50 px-4 py-2.5 text-xs font-medium text-[#173B3A] outline-none focus:border-[#9E1830] focus:ring-2 focus:ring-[#9E1830]/10 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#173B3A] mb-1.5">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl border border-[#F6C84C]/60 bg-[#FFF8E7]/50 px-4 py-2.5 text-xs font-medium text-[#173B3A] outline-none focus:border-[#9E1830] focus:ring-2 focus:ring-[#9E1830]/10 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173B3A] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-[#F6C84C]/60 bg-[#FFF8E7]/50 px-4 py-2.5 text-xs font-medium text-[#173B3A] outline-none focus:border-[#9E1830] focus:ring-2 focus:ring-[#9E1830]/10 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#173B3A] mb-1.5">Your Query or Requirements *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the fragrances, pooja sets, or bulk festive orders you need..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border border-[#F6C84C]/60 bg-[#FFF8E7]/50 px-4 py-2.5 text-xs font-medium text-[#173B3A] outline-none focus:border-[#9E1830] focus:ring-2 focus:ring-[#9E1830]/10 shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#9E1830] hover:bg-[#F47A20] text-white px-8 py-3.5 font-bold text-xs sm:text-sm uppercase tracking-wider transition shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Send size={15} />
                  <span>Send Sacred Message</span>
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    </InnerPage>
  );
}
