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
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
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

            <div className="rounded-2xl border border-[#b7e4c7] bg-[#f2fbf5] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#25D366]/15 text-[#168943]"><MessageCircle size={22} /></span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#168943]">Help desk</p>
                  <h2 className="mt-1 font-heading text-xl font-bold text-brand-ink">Need a quick answer?</h2>
                  <p className="mt-1 text-sm leading-6 text-brand-charcoal/75">Chat directly with our help desk on WhatsApp. No website form or backend is used.</p>
                  <a href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello HM Brand, I need help with an enquiry.")}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#168943] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#117438]">
                    <MessageCircle size={17} /> WhatsApp {CONTACT_WHATSAPP_DISPLAY}
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a href="mailto:jayamassociatescoimbatore@gmail.com" className="flex items-center gap-3 rounded-xl border border-brand-border bg-white p-4 text-sm text-brand-charcoal/80 transition hover:border-brand-primary/40">
                <Mail size={18} className="shrink-0 text-brand-primary" /><span className="min-w-0"><strong className="block text-brand-ink">Email</strong><span className="break-all text-xs">jayamassociatescoimbatore@gmail.com</span></span>
              </a>
              <a href="https://instagram.com/hmagarbatti5" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-brand-border bg-white p-4 text-sm text-brand-charcoal/80 transition hover:border-brand-primary/40">
                <span className="shrink-0 text-brand-primary"><InstagramIcon /></span><span><strong className="block text-brand-ink">Instagram</strong><span className="text-xs">@hmagarbatti5</span></span>
              </a>
            </div>
            <p className="flex items-center gap-2 px-1 text-xs text-brand-charcoal/65"><Clock size={14} /> Monday–Saturday, 9:00 AM–8:00 PM IST</p>
          </section>

          <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-primary">Send an enquiry</p>
            <h2 className="mt-1 font-heading text-2xl font-bold text-brand-ink">Message our help desk</h2>
            <p className="mt-2 text-sm leading-6 text-brand-charcoal/70">Fill this in and we’ll prepare your message in WhatsApp. You can review and send it there.</p>
            <form onSubmit={sendWhatsAppQuery} className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-brand-ink">Your name <span className="font-normal text-brand-charcoal/55">(optional)</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} type="text" autoComplete="name" placeholder="Your name" className="mt-1.5 min-h-11 w-full rounded-xl border border-brand-border bg-brand-surface/30 px-3.5 text-sm outline-none transition placeholder:text-brand-charcoal/45 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10" />
              </label>
              <label className="block text-sm font-semibold text-brand-ink">Your phone <span className="font-normal text-brand-charcoal/55">(optional)</span>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" autoComplete="tel" placeholder="Your phone number" className="mt-1.5 min-h-11 w-full rounded-xl border border-brand-border bg-brand-surface/30 px-3.5 text-sm outline-none transition placeholder:text-brand-charcoal/45 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10" />
              </label>
              <label className="block text-sm font-semibold text-brand-ink">How can we help? *
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} placeholder="Write your question or order enquiry..." className="mt-1.5 w-full resize-y rounded-xl border border-brand-border bg-brand-surface/30 px-3.5 py-3 text-sm leading-6 outline-none transition placeholder:text-brand-charcoal/45 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10" />
              </label>
              <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-primary/90 sm:w-auto">
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
