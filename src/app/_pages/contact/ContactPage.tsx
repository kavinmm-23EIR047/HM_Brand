"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, ArrowUpRight, Clock } from "lucide-react";
import { InnerPage } from "@/components/inner-page";
import {
  CONTACT_ADDRESS,
  CONTACT_MAPS_URL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_DISPLAY,
  CONTACT_WHATSAPP_NUMBER,
} from "@/lib/contact-info";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const sendWhatsAppQuery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = [
      "Hello HM Brand, I have an enquiry.",
      form.name.trim() && `Name: ${form.name.trim()}`,
      form.phone.trim() && `My phone: ${form.phone.trim()}`,
      `Query: ${form.message.trim()}`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <InnerPage
      eyebrow="CONTACT HM BRAND"
      title="How Can We Help You?"
      subtitle="Contact our Coimbatore team about products, orders, bulk enquiries, or anything else you need help with."
    >
      <main className="page-container py-8 sm:py-12">
        <div className="grid items-start gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-7">
          <section className="space-y-4">
            <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">Visit or call</p>
                <h2 className="mt-1 font-heading text-2xl font-bold text-brand-ink">HM Brand, Coimbatore</h2>
              </div>
              <div className="space-y-4">
                <a href={CONTACT_MAPS_URL} target="_blank" rel="noreferrer" className="group flex items-start gap-3 rounded-xl border border-brand-border/80 bg-brand-surface/40 p-3.5 transition hover:border-brand-primary/40">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary"><MapPin size={19} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-brand-ink">Address</span>
                    <span className="mt-1 block text-sm leading-6 text-brand-charcoal/75">{CONTACT_ADDRESS}</span>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-brand-primary">Get directions <ArrowUpRight size={13} /></span>
                  </span>
                </a>
                <a href={`tel:${CONTACT_PHONE_TEL}`} className="flex items-center gap-3 rounded-xl border border-brand-border/80 bg-brand-surface/40 p-3.5 transition hover:border-brand-primary/40">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary"><Phone size={18} /></span>
                  <span><span className="block text-sm font-bold text-brand-ink">Call us</span><span className="mt-1 block text-sm text-brand-charcoal/75">{CONTACT_PHONE_DISPLAY}</span></span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-border bg-brand-positive-soft p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-[10px] bg-brand-forest/15 text-brand-forest"><MessageCircle size={22} /></span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-forest">Help desk</p>
                  <h2 className="mt-1 font-heading text-xl font-bold text-brand-ink">Need a quick answer?</h2>
                  <p className="mt-1 text-sm leading-6 text-brand-slate">Chat directly with our help desk on WhatsApp. No website form or backend is used.</p>
                  <a href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello HM Brand, I need help with an enquiry.")}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-[#14532D] hover:bg-[#0F3F22] border border-brand-accent/30 px-5 py-2.5 text-sm font-sans font-semibold text-white transition-all duration-250 hover:-translate-y-0.5 active:scale-[0.98]">
                    <MessageCircle size={17} /> WhatsApp {CONTACT_WHATSAPP_DISPLAY}
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a href="mailto:jayamassociatescoimbatore@gmail.com" className="flex items-center gap-3 rounded-xl border border-brand-border bg-white p-4 text-sm text-brand-slate transition hover:border-brand-primary">
                <Mail size={18} className="shrink-0 text-brand-primary" /><span className="min-w-0"><strong className="block text-brand-ink">Email</strong><span className="break-all text-xs">jayamassociatescoimbatore@gmail.com</span></span>
              </a>
              <a href="https://instagram.com/hmagarbatti5" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-brand-border bg-white p-4 text-sm text-brand-slate transition hover:border-brand-primary">
                <span className="shrink-0 text-brand-primary"><InstagramIcon /></span><span><strong className="block text-brand-ink">Instagram</strong><span className="text-xs">@hmagarbatti5</span></span>
              </a>
            </div>
            <p className="flex items-center gap-2 px-1 text-xs text-brand-slate"><Clock size={14} /> Monday–Saturday, 9:00 AM–8:00 PM IST</p>
          </section>

          <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">Send an enquiry</p>
            <h2 className="mt-1 font-heading text-2xl font-bold text-brand-ink">Message our help desk</h2>
            <p className="mt-2 text-sm leading-6 text-brand-slate">Fill this in and we’ll prepare your message in WhatsApp. You can review and send it there.</p>
            <form onSubmit={sendWhatsAppQuery} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-brand-ink">Your name <span className="font-normal text-brand-slate">(optional)</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} type="text" autoComplete="name" placeholder="Your name" className="mt-1.5 min-h-11 w-full rounded-[10px] border border-brand-border bg-white px-3.5 text-sm outline-none transition placeholder:text-brand-slate/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" />
              </label>
              <label className="block text-sm font-semibold text-brand-ink">Your phone <span className="font-normal text-brand-slate">(optional)</span>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" autoComplete="tel" placeholder="Your phone number" className="mt-1.5 min-h-11 w-full rounded-[10px] border border-brand-border bg-white px-3.5 text-sm outline-none transition placeholder:text-brand-slate/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" />
              </label>
              <label className="block text-sm font-semibold text-brand-ink">How can we help? *
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} placeholder="Write your question or order enquiry..." className="mt-1.5 w-full resize-y rounded-[10px] border border-brand-border bg-white px-3.5 py-3 text-sm leading-6 outline-none transition placeholder:text-brand-slate/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary" />
              </label>
              <button type="submit" className="btn-primary inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-brand-primary px-6 py-3 font-sans text-sm font-semibold text-white border border-brand-accent/40 transition hover:bg-brand-hover hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto">
                <MessageCircle size={17} /> Continue in WhatsApp
              </button>
              <p className="text-xs leading-5 text-brand-charcoal/60">Your message opens in WhatsApp addressed to {CONTACT_WHATSAPP_DISPLAY}. It is not submitted to this website.</p>
            </form>
          </section>
        </div>
      </main>
    </InnerPage>
  );
}
