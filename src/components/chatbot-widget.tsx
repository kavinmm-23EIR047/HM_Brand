'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageSquare, X, Minus, Sparkles, Send, ShoppingBag, Check, Copy,
  Phone, Gift, ShieldCheck, ChevronRight, ArrowRight, Bot, User,
} from 'lucide-react';
import { useStore } from '@/components/store';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: Array<{ label: string; value: string }>;
  products?: Array<{
    name: string;
    slug: string;
    price: number;
    image?: string;
    note?: string;
  }>;
  showLeadForm?: boolean;
  couponCode?: string;
  timestamp: string;
}

export function ChatbotWidget() {
  const { dbProducts, add, setIsCartOpen } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [addedSlugs, setAddedSlugs] = useState<Record<string, boolean>>({});
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Lead Generation form state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [currentLeadPurpose, setCurrentLeadPurpose] = useState('Sacred Fragrance Consultation');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Initial welcome greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'msg_welcome',
          sender: 'bot',
          text: 'Namaste! 🙏 Welcome to HM Agarbatti Works Coimbatore. I am your Sacred Fragrance Advisor. How can I assist your pooja rituals or home ambience today?',
          options: [
            { label: '🕉️ Daily Temple Pooja', value: 'pooja' },
            { label: '🧘 Meditation & Deep Peace', value: 'meditation' },
            { label: '🎉 Navaratri & Festive Celebrations', value: 'festive' },
            { label: '🌿 Pure Bhimseni Camphor & Sambrani', value: 'camphor' },
            { label: '🏡 Griha Pravesh (Housewarming)', value: 'housewarming' },
            { label: '📦 Bulk / Wholesale Quote', value: 'wholesale' },
            { label: '🎁 Claim 15% Divine Discount', value: 'discount' },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [messages.length]);

  // Rule-based fragrance product matcher
  const getProductRecommendations = (categoryKey: string) => {
    const list = dbProducts && dbProducts.length > 0 ? dbProducts : [];

    const findByKeywords = (keywords: string[]) => {
      return list.filter((p) => {
        const text = `${p.name} ${p.category} ${p.slug} ${p.note || ''} ${p.description || ''}`.toLowerCase();
        return keywords.some((k) => text.includes(k.toLowerCase()));
      });
    };

    let matched: any[] = [];

    switch (categoryKey) {
      case 'pooja':
        matched = findByKeywords(['dhoop stick', 'mehak', 'pancha rudhra', 'agarbatti']);
        break;
      case 'meditation':
        matched = findByKeywords(['cardamom', 'real stone', 'kasturi', 'chandan']);
        break;
      case 'festive':
        matched = findByKeywords(['kesar loban', 'cup sambrani', 'fancy flora', 'festival']);
        break;
      case 'camphor':
        matched = findByKeywords(['bhimseni', 'camphor', 'karpoor', 'cup sambrani']);
        break;
      case 'housewarming':
        matched = findByKeywords(['cup sambrani', 'loban', 'dhoop', 'pancha rudhra']);
        break;
      default:
        matched = list.slice(0, 3);
    }

    if (matched.length === 0) {
      // Fallback defaults if catalog search yields none
      matched = list.slice(0, 3);
    }

    return matched.slice(0, 3).map((p) => ({
      name: p.name,
      slug: p.slug,
      price: Number(p.price || 120),
      image: p.image || p.images?.[0]?.url || '/images/brand_logo_gold_transparent.png',
      note: p.note || 'Pure Coimbatore herbal craftsmanship',
    }));
  };

  // Rule engine for bot responses
  const handleUserSelection = (actionValue: string, labelText?: string) => {
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: labelText || actionValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      processBotRule(actionValue);
    }, 400);
  };

  const processBotRule = (input: string) => {
    const clean = input.toLowerCase().trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (clean.includes('pooja') || clean.includes('daily') || clean.includes('morning')) {
      setCurrentLeadPurpose('Daily Temple Pooja Incense');
      const recs = getProductRecommendations('pooja');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: 'For daily morning and evening puja, our charcoal-free herbal dhoop sticks and pure flora agarbattis release smooth, pure temple sanctity without harmful chemical fumes.',
          products: recs,
          options: [
            { label: '🎁 Claim 15% Off My Order', value: 'discount' },
            { label: '🧘 View Meditation Fragrances', value: 'meditation' },
            { label: '🌿 Pure Bhimseni Camphor', value: 'camphor' },
          ],
          timestamp,
        },
      ]);
    } else if (clean.includes('meditation') || clean.includes('peace') || clean.includes('yoga') || clean.includes('calm')) {
      setCurrentLeadPurpose('Meditation & Stress Relief');
      const recs = getProductRecommendations('meditation');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: 'For quiet reflection, yoga, and mental clarity, these soothing botanical resins (Cardamom, Real Stone, and Pure Sandalwood) ground room energies and relieve daily tension.',
          products: recs,
          options: [
            { label: '🎁 Claim 15% Off My Order', value: 'discount' },
            { label: '🕉️ Daily Pooja Incense', value: 'pooja' },
            { label: '📦 Bulk / Wholesale Inquiries', value: 'wholesale' },
          ],
          timestamp,
        },
      ]);
    } else if (clean.includes('festive') || clean.includes('navaratri') || clean.includes('diwali') || clean.includes('celebration')) {
      setCurrentLeadPurpose('Festive Poojas & Celebrations');
      const recs = getProductRecommendations('festive');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: 'During Navaratri, Diwali, and sacred domestic festivals, authentic Kesar Loban and Cup Sambrani evoke royal South Indian sanctum rituals with long-lasting divine aura.',
          products: recs,
          options: [
            { label: '🎁 Claim 15% Off My Order', value: 'discount' },
            { label: '🌿 Pure Bhimseni Camphor', value: 'camphor' },
            { label: '📦 Wholesale / Temple Supply', value: 'wholesale' },
          ],
          timestamp,
        },
      ]);
    } else if (clean.includes('camphor') || clean.includes('bhimseni') || clean.includes('karpoor') || clean.includes('sambrani')) {
      setCurrentLeadPurpose('Pure Bhimseni Camphor & Sambrani');
      const recs = getProductRecommendations('camphor');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: 'Our 100% natural Bhimseni camphor leaves zero black ash and burns with a sacred, crackling white flame that drives away negative energies. Pair it with readymade Cup Sambrani for instant temple fragrance.',
          products: recs,
          options: [
            { label: '🎁 Claim 15% Off My Order', value: 'discount' },
            { label: '🕉️ Daily Pooja Incense', value: 'pooja' },
            { label: '📦 Bulk / Wholesale Quotes', value: 'wholesale' },
          ],
          timestamp,
        },
      ]);
    } else if (clean.includes('housewarming') || clean.includes('griha') || clean.includes('home')) {
      setCurrentLeadPurpose('Griha Pravesh & Housewarming');
      const recs = getProductRecommendations('housewarming');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: 'For Griha Pravesh and entering a new residence, lighting traditional Sambrani with Loban cleanses the vastu environment and welcomes Goddess Lakshmi with fragrant blessings.',
          products: recs,
          options: [
            { label: '🎁 Claim 15% Off My Order', value: 'discount' },
            { label: '📦 Bulk / Wholesale Quotes', value: 'wholesale' },
          ],
          timestamp,
        },
      ]);
    } else if (clean.includes('wholesale') || clean.includes('bulk') || clean.includes('b2b') || clean.includes('resell')) {
      setCurrentLeadPurpose('Wholesale / Bulk Spiritual Supply');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: 'We provide direct workshop wholesale pricing for temples, ashrams, pooja stores, and festive corporate gifting. Please leave your contact details below, and our Coimbatore director will reach you directly on WhatsApp with our wholesale catalog.',
          showLeadForm: true,
          timestamp,
        },
      ]);
    } else if (clean.includes('discount') || clean.includes('coupon') || clean.includes('offer') || clean.includes('code')) {
      setCurrentLeadPurpose('15% Divine Discount Coupon');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: 'We would love to bless your first order with an exclusive 15% Divine Discount! Enter your details below to activate code DIVINE15 and receive personalized recommendations on WhatsApp.',
          showLeadForm: true,
          timestamp,
        },
      ]);
    } else if (clean.includes('shipping') || clean.includes('delivery') || clean.includes('courier') || clean.includes('track')) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: 'All orders are consecrated and dispatched direct from our workshop in Peelamedu, Coimbatore with damage-proof packing. Free courier delivery is automatically applied on qualifying orders! You can track your parcel live in your account.',
          options: [
            { label: '🕉️ Explore Agarbattis', value: 'pooja' },
            { label: '🎁 Get 15% Off Code', value: 'discount' },
          ],
          timestamp,
        },
      ]);
    } else if (clean.includes('contact') || clean.includes('address') || clean.includes('phone') || clean.includes('location')) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: 'Our registered artisan works is located at: Peelamedu Main Rd, Sowri Palayam, Coimbatore, Tamil Nadu 641028. Direct WhatsApp / Call: +91 63821 77441. Email: jayamassociatescoimbatore@gmail.com.',
          options: [
            { label: '📦 Request Callback / Quote', value: 'wholesale' },
            { label: '🎁 Claim 15% Discount', value: 'discount' },
          ],
          timestamp,
        },
      ]);
    } else {
      // General match
      const recs = getProductRecommendations('pooja');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: 'Here are our most beloved sacred creations crafted with 100% pure herbal resins in Coimbatore. Which ritual can we assist with?',
          products: recs,
          options: [
            { label: '🕉️ Daily Temple Pooja', value: 'pooja' },
            { label: '🧘 Meditation & Peace', value: 'meditation' },
            { label: '🌿 Pure Bhimseni Camphor', value: 'camphor' },
            { label: '🎁 Claim 15% Discount', value: 'discount' },
          ],
          timestamp,
        },
      ]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    handleUserSelection(text, text);
  };

  // Add product to cart directly from chatbot
  const handleAddToCart = (item: { slug: string; name: string; price: number }) => {
    const fullProduct = dbProducts.find((p) => p.slug === item.slug) || {
      slug: item.slug,
      name: item.name,
      price: item.price,
      mrp: `₹${item.price + 25}`,
      category: 'Agarbatti',
      description: item.name,
      note: 'Pure herbal temple craftsmanship',
      quantity: '1 Pack',
    };

    add(fullProduct as any, 1);
    setAddedSlugs((prev) => ({ ...prev, [item.slug]: true }));

    setTimeout(() => {
      setAddedSlugs((prev) => ({ ...prev, [item.slug]: false }));
    }, 2500);
  };

  // Submit Lead Generation Form to Backend
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;

    setLeadSubmitting(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    try {
      const res = await fetch(`${apiUrl}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName.trim(),
          phone: leadPhone.trim(),
          email: leadEmail.trim() || undefined,
          purpose: currentLeadPurpose,
          couponGiven: 'DIVINE15',
          source: 'CHATBOT',
        }),
      });

      const data = await res.json();

      setLeadSubmitting(false);
      setLeadSubmitted(true);

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        {
          id: `bot_lead_success_${Date.now()}`,
          sender: 'bot',
          text: `Dhanyawad ${leadName.trim()}! 🙏 Your inquiry has been registered. Here is your exclusive 15% divine coupon code for 1-click checkout:`,
          couponCode: 'DIVINE15',
          options: [
            { label: '🛒 View My Sacred Cart', value: 'cart' },
            { label: '🌿 Explore Bhimseni Camphor', value: 'camphor' },
          ],
          timestamp,
        },
      ]);
    } catch (err) {
      console.error('Failed to submit lead:', err);
      setLeadSubmitting(false);
    }
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  return (
    <>
      {/* Floating Toggle Button (Always visible on mobile & desktop) */}
      {!isOpen && (
        <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40 flex items-center gap-2 animate-fade-in">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#9E1830] to-[#7A1224] hover:from-[#871328] hover:to-[#630E1D] text-white rounded-full shadow-2xl border-2 border-[#C89B3C]/60 transition-all transform hover:scale-105 active:scale-95"
            aria-label="Open Fragrance Advisor"
          >
            <div className="w-8 h-8 rounded-full bg-[#FFFDF8] text-[#9E1830] flex items-center justify-center shrink-0 shadow-md">
              <Bot className="w-5 h-5 text-[#9E1830]" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-[10px] uppercase tracking-wider font-extrabold text-[#DFB75A]">
                Sacred Advisor
              </span>
              <span className="block text-xs font-bold leading-tight">
                Need Fragrance Advice?
              </span>
            </div>
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C89B3C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#DFB75A] text-[9px] font-bold text-[#302923] items-center justify-center">
                1
              </span>
            </span>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-24 md:bottom-8 right-4 md:right-8 w-72 h-14'
              : 'bottom-20 md:bottom-8 right-3 md:right-8 w-[calc(100vw-24px)] sm:w-[380px] h-[580px] max-h-[85vh]'
          } bg-[#FFFDF8] rounded-3xl shadow-2xl border-2 border-[#C89B3C]/50 flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#9E1830] via-[#851428] to-[#6E0F20] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-[#FFFDF8] p-1 border border-[#DFB75A] shrink-0">
                <Image
                  src="/images/brand_logo_gold_transparent.png"
                  alt="HM Brand"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold tracking-wide flex items-center gap-1.5 text-white">
                  <span>HM Fragrance Advisor</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-[#DFB75A] font-medium">
                  Peelamedu, Coimbatore &bull; Divine Support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#FAF7F0]">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <Minus size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans bg-gradient-to-b from-[#FFFDF8] via-[#FAF7F0] to-[#FFFDF8]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#9E1830] text-white rounded-br-none'
                          : 'bg-white text-[#302923] border border-[#EAE1D3] rounded-bl-none'
                      }`}
                    >
                      <p className="text-xs">{msg.text}</p>

                      {/* Coupon Pill */}
                      {msg.couponCode && (
                        <div className="mt-2.5 p-2.5 bg-[#FAF7F0] border-2 border-dashed border-[#C89B3C] rounded-xl flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-[#746B62] uppercase block">
                              Promo Code:
                            </span>
                            <span className="font-mono text-sm font-extrabold text-[#9E1830]">
                              {msg.couponCode}
                            </span>
                          </div>
                          <button
                            onClick={() => copyCoupon(msg.couponCode!)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#9E1830] hover:bg-[#7A1224] text-white text-[10px] font-bold rounded-lg transition-colors"
                          >
                            {copiedCoupon ? <Check size={11} /> : <Copy size={11} />}
                            <span>{copiedCoupon ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Product Recommendation Cards Carousel / List */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="w-full space-y-2 my-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E1830] flex items-center gap-1">
                          <Sparkles size={11} /> Recommended Sacred Fragrances:
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.products.map((prod) => (
                            <div
                              key={prod.slug}
                              className="p-2.5 bg-white rounded-xl border border-[#C89B3C]/30 shadow-xs flex items-center justify-between gap-3 hover:border-[#C89B3C] transition-all"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="relative w-12 h-12 rounded-lg bg-[#FAF7F0] border border-[#EAE1D3] overflow-hidden shrink-0">
                                  {prod.image ? (
                                    <Image
                                      src={prod.image}
                                      alt={prod.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#C89B3C]">
                                      <ShoppingBag size={16} />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <Link
                                    href={`/product/${prod.slug}`}
                                    className="font-bold text-[#302923] hover:text-[#9E1830] truncate block text-xs"
                                  >
                                    {prod.name}
                                  </Link>
                                  <p className="font-mono text-xs font-extrabold text-[#9E1830]">
                                    ₹{prod.price}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleAddToCart(prod)}
                                  className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${
                                    addedSlugs[prod.slug]
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-[#9E1830] hover:bg-[#7A1224] text-white'
                                  }`}
                                >
                                  {addedSlugs[prod.slug] ? <Check size={12} /> : <ShoppingBag size={12} />}
                                  <span>{addedSlugs[prod.slug] ? 'Added' : 'Add'}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Inline Lead Generation Form */}
                    {msg.showLeadForm && !leadSubmitted && (
                      <div className="w-full p-4 bg-white rounded-2xl border-2 border-[#C89B3C]/50 shadow-md space-y-3">
                        <div className="flex items-center gap-2 text-[#9E1830]">
                          <Gift size={16} />
                          <h4 className="font-serif text-xs font-bold uppercase tracking-wide">
                            Claim 15% Off &amp; Expert Advice
                          </h4>
                        </div>
                        <p className="text-[11px] text-[#746B62]">
                          Enter your details below to receive your discount coupon and WhatsApp catalog:
                        </p>
                        <form onSubmit={handleSubmitLead} className="space-y-2">
                          <div>
                            <input
                              required
                              type="text"
                              value={leadName}
                              onChange={(e) => setLeadName(e.target.value)}
                              placeholder="Your Full Name *"
                              className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#EAE1D3] rounded-lg text-xs font-medium text-[#302923] focus:outline-none focus:border-[#9E1830]"
                            />
                          </div>
                          <div>
                            <input
                              required
                              type="tel"
                              value={leadPhone}
                              onChange={(e) => setLeadPhone(e.target.value)}
                              placeholder="WhatsApp / Phone Number *"
                              className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#EAE1D3] rounded-lg text-xs font-medium text-[#302923] focus:outline-none focus:border-[#9E1830]"
                            />
                          </div>
                          <div>
                            <input
                              type="email"
                              value={leadEmail}
                              onChange={(e) => setLeadEmail(e.target.value)}
                              placeholder="Email Address (Optional)"
                              className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#EAE1D3] rounded-lg text-xs font-medium text-[#302923] focus:outline-none focus:border-[#9E1830]"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={leadSubmitting}
                            className="w-full py-2 bg-[#9E1830] hover:bg-[#7A1224] text-white text-xs font-bold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            <ShieldCheck size={14} className="text-[#DFB75A]" />
                            <span>{leadSubmitting ? 'Submitting...' : 'Unlock 15% Divine Code ➔'}</span>
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Quick Selection Options Buttons */}
                    {msg.options && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              if (opt.value === 'cart') {
                                setIsCartOpen(true);
                              } else {
                                handleUserSelection(opt.value, opt.label);
                              }
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-[#FAF7F0] border border-[#C89B3C]/50 hover:border-[#9E1830] text-[#302923] text-[11px] font-semibold rounded-full shadow-2xs transition-all active:scale-95"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[9px] text-[#A8A29E] px-1">{msg.timestamp}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white border-t border-[#EAE1D3] flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about pooja, camphor, fragrances..."
                  className="flex-1 px-3.5 py-2.5 bg-[#FAF7F0] border border-[#EAE1D3] rounded-full text-xs text-[#302923] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#9E1830]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-9 h-9 rounded-full bg-[#9E1830] hover:bg-[#7A1224] disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-sm transition-all"
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
