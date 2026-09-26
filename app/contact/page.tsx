"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Sparkles, Send, Clock, CheckCircle2 } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import { MascotNamaste } from "@/components/mascot-art";
import { AuspiciousSeal } from "@/components/divine-motifs";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <InnerPage
      eyebrow="CONNECT WITH US"
      title="We Are Here For Your Sacred Moments"
      subtitle="Have a question about our traditional fragrances, bulk festive orders, or custom puja kits? Reach out directly to our Coimbatore team."
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-[#eadfc9] shadow-solid-md space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E85D04] text-white flex items-center justify-center text-xl">
                  ðŸª”
                </div>
                <div>
                  <h3 className="font-display text-2xl text-[#173b3a] font-bold">HM Agarbattis</h3>
                  <p className="text-xs text-[#e7771b] font-semibold">Peelamedu, Coimbatore</p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#52625a] font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#e7771b] shrink-0 mt-1" size={18} />
                  <div>
                    <strong className="text-[#173b3a] block">Sanctum Workshop & Store:</strong>
                    <span>143 A Peelamedu Main Road, Sowripalayam, Coimbatore - 641028, Tamil Nadu, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-[#e7771b] shrink-0" size={18} />
                  <div>
                    <strong className="text-[#173b3a] block">Phone / WhatsApp:</strong>
                    <span>+91 6382177441 Â· +91 9345633399</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-[#e7771b] shrink-0" size={18} />
                  <div>
                    <strong className="text-[#173b3a] block">Email:</strong>
                    <span>hmagarbattis.coimbatore@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="text-[#e7771b] shrink-0" size={18} />
                  <div>
                    <strong className="text-[#173b3a] block">Customer Service Hours:</strong>
                    <span>Monday to Saturday: 9:00 AM â€“ 7:30 PM IST</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#C89B3C]/30 flex items-center justify-between">
                <AuspiciousSeal />
                <span className="text-[11px] text-[#173b3a] font-bold">Pan-India Support</span>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#eadfc9] shadow-solid-sm space-y-6">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#a90c35] uppercase block">
                SEND A MESSAGE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#173b3a] font-bold mt-1">
                How Can We Serve You?
              </h2>
            </div>

            {submitted ? (
              <div className="bg-[#f8f2e5] p-8 rounded-2xl border border-[#eadfc9] text-center space-y-4">
                <CheckCircle2 className="mx-auto text-[#286b45]" size={48} />
                <h3 className="font-display text-2xl text-[#173b3a] font-bold">
                  Message Received With Gratitude!
                </h3>
                <p className="text-sm text-[#65716a] max-w-md mx-auto font-sans">
                  Our Coimbatore team will contact you shortly via email or phone.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", phone: "", message: "" });
                  }}
                  className="btn-saffron px-6 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label>
                    <span className="mb-1 block text-[#173b3a]">Your Full Name *</span>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Senthil Nathan"
                      className="w-full bg-white border border-[#eadfc9] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04]"
                    />
                  </label>

                  <label>
                    <span className="mb-1 block text-[#173b3a]">Mobile Number *</span>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white border border-[#eadfc9] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04]"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1 block text-[#173b3a]">Email Address *</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="senthil@example.com"
                    className="w-full bg-white border border-[#eadfc9] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[#173b3a]">Your Sacred Inquiry *</span>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you are looking for..."
                    className="w-full bg-white border border-[#eadfc9] rounded-lg p-3 text-xs text-[#292524] outline-[#E85D04] resize-none"
                  />
                </label>

                <button
                  type="submit"
                  className="btn-saffron w-full py-4 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-solid-sm"
                >
                  <Send size={15} />
                  <span>Send Message to Coimbatore Hub</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </InnerPage>
  );
}
