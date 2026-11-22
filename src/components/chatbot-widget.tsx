'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageCircle,
  PhoneCall,
  PhoneOff,
  Phone,
  Send,
  X,
  Minus,
  ShoppingBag,
  Sparkles,
  Check,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ArrowRight,
  MapPin,
  ExternalLink,
  Building2,
  Flame,
  Flower2,
  Grid2X2,
  Leaf,
  Package,
  Tag,
} from 'lucide-react';
import { useStore } from '@/components/store';
import {
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_NUMBER,
} from '@/lib/contact-info';
import { useVoiceAgent } from '@/lib/useVoiceAgent';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: Array<{ label: string; value: string }>;
  products?: Array<{
    name: string;
    slug: string;
    price: number;
    image?: string;
    imageUrl?: string;
    images?: Array<{ url: string; isPrimary?: boolean }>;
    category?: string;
    note?: string;
  }>;
  categories?: Array<{
    name: string;
    tamilName: string;
    slug: string;
    desc?: string;
    icon: string;
    link: string;
  }>;
  contactActions?: ContactAction[];
  lang?: 'ta-IN' | 'en-IN';
  timestamp: string;
}

type ContactAction = {
  type: string;
  label: string;
  detail?: string;
  href: string;
};

function cleanCustomerText(value: string) {
  return String(value || '')
    .replace(/[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D\u{1F3FB}-\u{1F3FF}\u{20E3}]/gu, '')
    .replace(/[ \t]*\n[ \t]*/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/(^|\n)[ \t]*[•·][ \t]*/g, '$1')
    .trim();
}

function getProductImageSrc(product: { image?: string; imageUrl?: string; images?: Array<{ url: string; isPrimary?: boolean }> }) {
  const candidates = [
    product.image,
    product.imageUrl,
    product.images?.find((image) => image.isPrimary)?.url,
    ...(product.images || []).map((image) => image.url),
  ];
  return candidates.find((url) => url && !/brand_logo(?:_gold_transparent|_icon_transparent)/i.test(url));
}

function CategoryIcon({ name }: { name: string }) {
  const className = 'h-4 w-4';
  if (name === 'flower') return <Flower2 className={className} />;
  if (name === 'camphor') return <Flame className={className} />;
  if (name === 'leaf') return <Leaf className={className} />;
  if (name === 'pack') return <Package className={className} />;
  if (name === 'pooja') return <Tag className={className} />;
  return <Grid2X2 className={className} />;
}

function CategoryButtons({
  categories,
  lang,
}: {
  categories: NonNullable<ChatMessage['categories']>;
  lang?: ChatMessage['lang'];
}) {
  const isTamil = lang === 'ta-IN';
  return (
    <div className="mt-2.5 w-full space-y-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E1830] flex items-center gap-1">
        <Grid2X2 size={12} /> {isTamil ? 'தயாரிப்பு வகைகள்' : 'Categories'}
      </span>
      <div className="grid grid-cols-1 gap-1.5">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={category.link || `/shop?category=${encodeURIComponent(category.name)}`}
            className="group flex min-h-10 items-center gap-2.5 rounded-xl border border-[#EAE1D3] bg-white px-3 py-2 text-[#302923] transition-colors hover:border-[#C89B3C] hover:bg-[#FAF7F0]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F5EFE3] text-[#9E1830]">
              <CategoryIcon name={category.icon} />
            </span>
            <span className="min-w-0 flex-1 truncate text-xs font-bold">
              {cleanCustomerText(isTamil ? category.tamilName : category.name)}
            </span>
            <ArrowRight size={13} className="shrink-0 text-[#746B62] transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProductButtons({
  products,
  lang,
  addedSlugs,
  onAdd,
}: {
  products: NonNullable<ChatMessage['products']>;
  lang?: ChatMessage['lang'];
  addedSlugs: Record<string, boolean>;
  onAdd: (product: any) => void;
}) {
  const isTamil = lang === 'ta-IN';
  return (
    <div className="mt-2.5 w-full space-y-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E1830] flex items-center gap-1">
        <ShoppingBag size={12} /> {isTamil ? 'தயாரிப்புகள்' : 'Products'}
      </span>
      <div className="grid grid-cols-1 gap-1.5">
        {products.map((product) => {
          const added = Boolean(addedSlugs[product.slug]);
          const addLabel = isTamil ? 'சேர்' : 'Add';
          const addedLabel = isTamil ? 'சேர்க்கப்பட்டது' : 'Added';
          const productImage = getProductImageSrc(product);
          return (
            <div key={product.slug} className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#EAE1D3] bg-white p-2">
              <Link href={`/product/${product.slug}`} className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#FAF7F0] p-1">
                {productImage ? (
                  <img src={productImage} alt={cleanCustomerText(product.name)} loading="lazy" className="h-full w-full object-contain" />
                ) : (
                  <Package size={22} className="text-[#9E1830]/55" aria-hidden="true" />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${product.slug}`} className="block truncate text-xs font-bold text-[#302923] hover:text-[#9E1830]">
                  {cleanCustomerText(product.name)}
                </Link>
                <span className="mt-0.5 block text-xs font-extrabold text-[#9E1830]">₹{product.price}</span>
              </div>
              <button
                type="button"
                onClick={() => onAdd(product)}
                aria-label={`${added ? addedLabel : addLabel}: ${cleanCustomerText(product.name)}`}
                className={`inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg px-2.5 text-[11px] font-bold transition active:scale-95 ${added ? 'bg-emerald-600 text-white' : 'bg-[#9E1830] text-white hover:bg-[#7A1224]'}`}
              >
                {added ? <Check size={13} /> : <ShoppingBag size={13} />}
                <span>{added ? addedLabel : addLabel}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DirectContactActions({ actions, lang }: { actions: ContactAction[]; lang?: ChatMessage['lang'] }) {
  const isTamil = lang === 'ta-IN';
  return (
    <div className="mt-3 w-full rounded-2xl border border-[#EAE1D3] bg-[#FFFDF8] p-2.5 shadow-2xs">
      <p className="mb-2 px-1 text-[10px] font-extrabold uppercase tracking-wider text-[#4A3F35]">
        {isTamil ? 'நேரடி தொடர்பு' : 'Direct contact'}
      </p>
      <div className="flex flex-col gap-1.5">
        {actions.map((action, index) => {
          const isWhatsApp = action.type === 'whatsapp';
          const isCall = action.type === 'call';
          const isLocation = action.type === 'location';
          const isWorkshop = action.type === 'workshop';
          const opensExternalPage = isLocation || isWhatsApp;

          return (
            <a
              key={`${action.type}-${index}`}
              href={action.href}
              target={opensExternalPage ? '_blank' : undefined}
              rel={opensExternalPage ? 'noopener noreferrer' : undefined}
              className={`group flex min-h-12 items-center gap-2.5 rounded-xl border px-3 py-2 transition-colors active:scale-[0.99] ${
                isWhatsApp
                  ? 'border-[#1FA855] bg-[#25D366] text-white shadow-sm hover:bg-[#20BA5A]'
                  : 'border-[#EAE1D3] bg-white text-[#302923] hover:border-[#C89B3C] hover:bg-[#FAF7F0]'
              }`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                isWhatsApp ? 'bg-white/20 text-white' : isCall ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F5EFE3] text-[#9E1830]'
              }`}>
                {isWhatsApp ? <MessageCircle size={17} /> : isCall ? <Phone size={17} /> : isWorkshop ? <Building2 size={17} /> : <MapPin size={17} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-extrabold leading-tight">{cleanCustomerText(action.label)}</span>
                {action.detail && <span className={`mt-0.5 block text-[10px] leading-tight ${isWhatsApp ? 'text-white/90' : 'text-[#4A3F35]/70'}`}>{cleanCustomerText(action.detail)}</span>}
              </span>
              {opensExternalPage ? <ExternalLink size={13} className="shrink-0 opacity-75" /> : <ArrowRight size={13} className="shrink-0 opacity-60" />}
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Audio Helpers: Synthesized Soft Ringer & Call Connected Chime
// ─────────────────────────────────────────────────────────────
function playAttendChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.2, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur);
    };

    playTone(523.25, now, 0.18); // C5
    playTone(659.25, now + 0.12, 0.18); // E5
    playTone(783.99, now + 0.24, 0.28); // G5
  } catch {}
}

/** Soft synthesized traditional telephone ringtone for incoming call screen */
function startSoftRingtone(): () => void {
  if (typeof window === 'undefined') return () => {};
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return () => {};
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    let isPlaying = true;
    let timer: any = null;

    const playRingCycle = () => {
      if (!isPlaying || ctx.state === 'closed') return;
      const now = ctx.currentTime;
      // Gentle dual-tone phone chime pair
      const bursts = [
        { start: 0, dur: 0.65 },
        { start: 0.85, dur: 0.65 },
      ];

      bursts.forEach(({ start, dur }) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, now + start); // A4
        osc2.frequency.setValueAtTime(480, now + start); // B4

        gain.gain.setValueAtTime(0.0001, now + start);
        gain.gain.exponentialRampToValueAtTime(0.09, now + start + 0.05);
        gain.gain.setValueAtTime(0.09, now + start + dur - 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now + start);
        osc2.start(now + start);
        osc1.stop(now + start + dur);
        osc2.stop(now + start + dur);
      });

      // Repeat ring cycle every 3.2 seconds
      timer = setTimeout(playRingCycle, 3200);
    };

    playRingCycle();

    return () => {
      isPlaying = false;
      clearTimeout(timer);
      try {
        ctx.close().catch(() => {});
      } catch {}
    };
  } catch {
    return () => {};
  }
}

// ─────────────────────────────────────────────────────────────
// Smart Speech Normalizer: Handles Indian accents, misheard words,
// Tamil script and Tanglish terms so speech search NEVER fails!
// ─────────────────────────────────────────────────────────────
const INTENTS: Array<{ re: RegExp; normalized: string; label: string }> = [
  { re: /camphor|camper|car\s*poor|karpoor|karpur|karpooram|bhimsen|beem|கற்பூர/i, normalized: 'bhimseni camphor', label: 'Bhimseni Camphor 🌿' },
  { re: /sambrani|sambirani|samburani|some\s*bran|loban|guggul|paal|சாம்பிராணி|சாம்பிரானி/i, normalized: 'cup sambrani', label: 'Cup Sambrani 🪔' },
  { re: /rose|gulab|roja|roza|ரோஜா|ரோஸ்/i, normalized: 'rose flower agarbatis', label: 'Rose Agarbatti 🌹' },
  { re: /jasmine|malligai|mallipoo|malli|mogra|மல்லி/i, normalized: 'jasmine', label: 'Madurai Malligai 🌸' },
  { re: /sandal|chandan|chandhan|sandhan|சந்தன/i, normalized: 'sandalwood', label: 'Sandalwood 🪵' },
  { re: /cardamom|elakkai|elaichi|ஏலக்காய்/i, normalized: 'cardamom', label: 'Cardamom 🌿' },
  { re: /house\s*warming|gruha|griha|new\s*home|vastu|puthumanai|pudhumanai|புதுமனை|கிரகப்பிரவேச/i, normalized: 'housewarming', label: 'Housewarming 🏡' },
  { re: /family\s*pack|combo|10\s*in\s*1|ten\s*in\s*one/i, normalized: '10 in 1 aroma family pack', label: 'Family Pack 📦' },
  { re: /deliver|shipping|courier|country|anuppu|anupa|eppo\s*varum|cod\b|payment|டெலிவரி|அனுப்ப|எப்போது வரும்/i, normalized: 'delivery details', label: 'Delivery 🚚' },
  { re: /burn|how\s*long|duration|evlo\s*neram|evvalavu\s*neram|neram|நேரம்|எரியும்/i, normalized: 'burn time', label: 'Burn Time ⏱️' },
  { re: /agarbatti|agarbathi|agar|bathi|incense|dhoop|stick|அகர்பத்தி|ஊதுவத்தி/i, normalized: 'agarbatti', label: 'Agarbattis 🌿' },
  { re: /pooja|puja|prayer|morning|daily|temple|பூஜை/i, normalized: 'daily morning pooja', label: 'Daily Pooja 🕉️' },
];

function cleanAndNormalizeSpeech(raw: string): { normalized: string; displayLabel: string } {
  const text = raw.toLowerCase().trim();
  for (const i of INTENTS) if (i.re.test(text)) return { normalized: i.normalized, displayLabel: i.label };
  return { normalized: text, displayLabel: text };
}

export function ChatbotWidget() {
  const { dbProducts, add, setIsCartOpen } = useStore();

  // Widget visibility & active tab: 'chat' | 'call'
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'call'>('chat');

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [callInputText, setCallInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedSlugs, setAddedSlugs] = useState<Record<string, boolean>>({});

  // ── AI Voice Call State ──
  const [callState, setCallState] = useState<'incoming' | 'connected' | 'ended'>('incoming');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  type VoiceMode = 'en' | 'ta';
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('en');
  const recLang = voiceMode === 'ta' ? 'ta-IN' : 'en-IN';

  const GREETINGS: Record<VoiceMode, { text: string; speech: string; lang: 'en-IN' | 'ta-IN' }> = {
    en: {
      text: 'Vanakkam! Tap the mic, tell me what you need, and tap again when you finish.',
      speech: 'Vanakkam! Tap the mic, tell me what you need, and tap again when you finish.',
      lang: 'en-IN',
    },
    ta: {
      text: 'வணக்கம்! மைக்கை தட்டி பேசுங்கள், முடிந்ததும் மீண்டும் தட்டுங்கள்.',
      speech: 'வணக்கம்! மைக்கை தட்டி பேசுங்கள், முடிந்ததும் மீண்டும் தட்டுங்கள்.',
      lang: 'ta-IN',
    },
  };

  const [callSuggestedProducts, setCallSuggestedProducts] = useState<any[]>([]);
  const [lastAgentSpokenText, setLastAgentSpokenText] = useState(
    'Vanakkam! I am your HM Brand assistant. What can I help you find?'
  );
  const [callLog, setCallLog] = useState<Array<{ who: 'user' | 'ai'; text: string; products?: any[]; categories?: any[]; contactActions?: any[]; lang?: 'ta-IN' | 'en-IN' }>>([]);

  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const whatsappUrl = `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hello HM Brand, I would like to ask about your agarbattis and pooja essentials.'
  )}`;

  // ── Intelligent Voice Agent Integration ──
  const askAgent = useCallback(
    async (text: string): Promise<{ speech: string; lang: 'en-IN' | 'ta-IN' }> => {
      const { normalized } = cleanAndNormalizeSpeech(text);
      setCallLog((p) => [...p, { who: 'user', text }]);
      historyRef.current.push({ role: 'user', content: text });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          hint: normalized,
          voice: true,
          mode: voiceMode,
          history: historyRef.current.slice(-8),
          products: dbProducts.map((p) => ({
            name: p.name,
            slug: p.slug,
            price: p.price,
            image: p.image,
            imageUrl: p.image,
            images: p.images,
            mrp: p.mrp,
            category: p.category,
            subCategory: p.subCategory,
            inStock: p.inStock,
            description: p.descriptionParagraphs?.join(' '),
            note: p.tagline || p.category,
          })),
        }),
      });
      const data = await res.json();
      const shown: string = cleanCustomerText(String(data.reply || 'Sorry, please ask again.').replace(/[*#_`]/g, ''));
      const speech: string = cleanCustomerText(data.speech || shown);

      historyRef.current.push({ role: 'assistant', content: shown });
      const matched = data.matchedProducts?.length ? data.matchedProducts : undefined;
      const matchedCats = data.matchedCategories?.length ? data.matchedCategories : undefined;
      const matchedActions = data.contactActions?.length ? data.contactActions : undefined;
      setCallLog((p) => [...p, { who: 'ai', text: shown, products: matched, categories: matchedCats, contactActions: matchedActions, lang: data.lang === 'ta-IN' ? 'ta-IN' : 'en-IN' }]);
      setLastAgentSpokenText(shown);
      if (data.action === 'open_cart') {
        setIsCartOpen(true);
      } else if (data.action === 'checkout') {
        window.location.href = '/checkout';
      }

      return { speech, lang: data.lang === 'ta-IN' ? 'ta-IN' : 'en-IN' };
    },
    [dbProducts, voiceMode]
  );

  const voice = useVoiceAgent({ lang: recLang, muted: isMuted, ask: askAgent });

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [callLog, voice.state]);

  // ── Soft Incoming Call Ringtone ──
  useEffect(() => {
    let stopRingtone: (() => void) | null = null;
    if (isOpen && !isMinimized && activeTab === 'call' && callState === 'incoming') {
      stopRingtone = startSoftRingtone();
    }
    return () => {
      if (stopRingtone) stopRingtone();
    };
  }, [isOpen, isMinimized, activeTab, callState]);

  // Auto-scroll chat messages
  useEffect(() => {
    if (isOpen && !isMinimized && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, activeTab]);

  // Initial welcome greeting for chat
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'msg_welcome',
          sender: 'bot',
          text: 'Vanakkam! What can we help you find today?',
          lang: 'en-IN',
          options: [
            { label: 'Browse products', value: 'all_products' },
            { label: 'Categories', value: 'categories' },
            { label: 'Contact us', value: 'contact' },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [messages.length]);

  // ── Call Timer Management ──
  useEffect(() => {
    if (callState === 'connected') {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [callState]);

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // ── Call Attend Handler ──
  const handleAttendCall = () => {
    playAttendChime();
    setCallState('connected');
    historyRef.current = [];
    setCallSuggestedProducts([]);
    const g = GREETINGS[voiceMode];
    setLastAgentSpokenText(g.text);
    setCallLog([{ who: 'ai', text: cleanCustomerText(g.text), lang: g.lang }]);
    voice.say(g.speech, g.lang);
  };

  // ── Call End Handler ──
  const handleEndCall = () => {
    voice.stop();
    setCallState('ended');
    setTimeout(() => {
      setActiveTab('chat');
      setCallState('incoming');
    }, 1200);
  };

  // ── In-Call Direct Text Question Handler ──
  const handleCallInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = callInputText.trim();
    if (!q) return;
    setCallInputText('');
    voice.submit(q);
  };

  // ── Chat API Query ──
  const queryChatEngine = async (queryText: string) => {
    setIsLoading(true);
    const { normalized } = cleanAndNormalizeSpeech(queryText);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          hint: normalized,
          mode: 'en',
          history: messages.slice(-8).map((item) => ({
            role: item.sender === 'bot' ? 'assistant' : 'user',
            content: cleanCustomerText(item.text),
          })),
          products: dbProducts.map((p) => ({
            name: p.name,
            slug: p.slug,
            price: p.price,
            image: p.image,
            imageUrl: p.image,
            images: p.images,
            mrp: p.mrp,
            category: p.category,
            subCategory: p.subCategory,
            inStock: p.inStock,
            description: p.descriptionParagraphs?.join(' '),
            note: p.tagline || p.category,
          })),
        }),
      });

      const data = await res.json();
      if (data.action === 'open_cart') {
        setIsCartOpen(true);
      } else if (data.action === 'checkout') {
        window.location.href = '/checkout';
      }
      const reply =
        data.reply ||
        'Thank you for asking! Our Coimbatore workshop team is here to assist. You can also chat on WhatsApp directly.';
      const products = data.matchedProducts || [];
      const categories = data.matchedCategories || [];
      const contactActions = data.contactActions || [];
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: cleanCustomerText(reply),
          lang: data.lang === 'ta-IN' ? 'ta-IN' : 'en-IN',
          products,
          categories,
          contactActions,
          options: data.suggestedOptions || [],
          timestamp,
        },
      ]);
    } catch {
      const fallbackProducts = dbProducts.slice(0, 3).map((p) => ({
        name: p.name,
        slug: p.slug,
        price: Number(p.price || 0),
        image: getProductImageSrc(p),
        images: p.images,
        note: p.note || 'Handcrafted Coimbatore herbal craftsmanship',
      }));

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const fallbackReply = dbProducts.length > 0
        ? (/[\u0B80-\u0BFF]/.test(queryText) ? 'இதோ சில தயாரிப்புகள்.' : 'Here are a few products.')
        : (/[\u0B80-\u0BFF]/.test(queryText) ? 'தயாரிப்பு பட்டியலை இப்போது ஏற்ற முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.' : 'I can’t load the product list right now. Please try again in a moment.');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: fallbackReply,
          lang: /[\u0B80-\u0BFF]/.test(queryText) ? 'ta-IN' : 'en-IN',
          products: fallbackProducts,
          options: [],
          timestamp,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelection = async (actionValue: string, labelText?: string) => {
    if (actionValue === 'cart') {
      setIsCartOpen(true);
      return;
    }
    if (actionValue === 'go_to_checkout') {
      window.location.href = '/checkout';
      return;
    }
    if (actionValue === 'all_products' || actionValue === 'go_to_shop') {
      window.location.href = '/shop';
      return;
    }
    if (actionValue === 'call_support') {
      window.location.href = `tel:${CONTACT_PHONE_TEL}`;
      return;
    }
    if (actionValue === 'whatsapp_support') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (actionValue === 'workshop') {
      window.location.href = '/craftsmanship';
      return;
    }
    if (actionValue === 'switch_to_call') {
      setActiveTab('call');
      setCallState('incoming');
      return;
    }

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: cleanCustomerText(labelText || actionValue),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    await queryChatEngine(actionValue);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    handleUserSelection(text, text);
  };

  // Add product to cart directly from Call or Chat
  const handleAddToCart = (item: { slug: string; name: string; price: number }) => {
    const fullProduct = dbProducts.find((p) => p.slug === item.slug) || {
      slug: item.slug,
      name: item.name,
      price: item.price,
      mrp: `₹${item.price + 25}`,
      category: 'Agarbatti',
      description: item.name,
      note: 'Pure herbal craftsmanship',
      quantity: '1 Pack',
    };

    add(fullProduct as any, 1);
    setAddedSlugs((prev) => ({ ...prev, [item.slug]: true }));

    setTimeout(() => {
      setAddedSlugs((prev) => ({ ...prev, [item.slug]: false }));
    }, 2500);
  };

  // Open Call modal directly from floating trigger
  const openCallIndividually = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setActiveTab('call');
    setCallState('incoming');
  };

  // Open Chat modal directly from floating trigger
  const openChatIndividually = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setActiveTab('chat');
  };

  return (
    <>
      {/* ──────────────────────────────────────────────────────────
          FLOATING DUAL LAUNCHERS: CHAT & CALL INDIVIDUALLY
      ────────────────────────────────────────────────────────── */}
      {!isOpen && (
        <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40 flex items-center gap-2.5 animate-fade-in">
          {/* 1. Dedicated AI Voice Call Button */}
          <button
            onClick={openCallIndividually}
            className="group relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full shadow-2xl border-2 border-emerald-300/60 transition-all transform hover:scale-105 active:scale-95"
            aria-label="Start AI Voice Call"
            title="Start voice consultation with HM AI Voice Agent"
          >
            <div className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center shrink-0 shadow-md">
              <PhoneCall className="w-4 h-4 text-emerald-700 animate-phone-ring" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-[9.5px] uppercase tracking-wider font-extrabold text-emerald-200">
                Voice Assistant
              </span>
              <span className="block text-xs font-bold leading-tight">
                AI Voice Call
              </span>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
            </span>
          </button>

          {/* 2. Dedicated Text Chatbot Button */}
          <button
            onClick={openChatIndividually}
            className="group relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#9E1830] to-[#7A1224] hover:from-[#871328] hover:to-[#630E1D] text-white rounded-full shadow-2xl border-2 border-[#C89B3C]/60 transition-all transform hover:scale-105 active:scale-95"
            aria-label="Open Text Chatbot"
            title="Chat with HM Fragrance Assistant"
          >
            <div className="w-8 h-8 rounded-full bg-[#FFFDF8] text-[#9E1830] flex items-center justify-center shrink-0 shadow-md">
              <MessageCircle className="w-4 h-4 text-[#9E1830]" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-[9.5px] uppercase tracking-wider font-extrabold text-[#DFB75A]">
                Customer Help
              </span>
              <span className="block text-xs font-bold leading-tight">
                Chat With Us
              </span>
            </div>
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          MAIN MODAL: TABS FOR INDIVIDUAL CHAT & AI VOICE CALL
      ────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-24 md:bottom-8 right-4 md:right-8 w-72 h-14'
              : 'bottom-20 md:bottom-8 right-3 md:right-8 w-[calc(100vw-24px)] sm:w-[430px] h-[640px] max-h-[90vh]'
          } bg-[#FFFDF8] rounded-3xl shadow-2xl border-2 border-[#C89B3C]/50 flex flex-col overflow-hidden`}
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#9E1830] via-[#851428] to-[#6E0F20] text-white p-3 sm:p-3.5 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-full bg-[#FFFDF8] p-1 border border-[#DFB75A] shrink-0">
                <Image
                  src="/images/brand_logo_gold_transparent.png"
                  alt="HM Brand"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-xs sm:text-sm font-bold tracking-wide flex items-center gap-1.5 text-white truncate">
                  <span>{activeTab === 'call' ? 'HM AI Voice Agent' : 'HM Fragrance Help'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                </h3>
                <p className="text-[10px] text-[#DFB75A] font-medium truncate">
                  Peelamedu, Coimbatore Workshop
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[#FAF7F0] shrink-0">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <Minus size={16} />
              </button>
              <button
                onClick={() => {
                  handleEndCall();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Individual Navigation Tabs */}
          {!isMinimized && (
            <div className="grid grid-cols-2 bg-[#F5EFE3] border-b border-[#EAE1D3] text-xs font-bold shrink-0">
              <button
                onClick={() => {
                  setActiveTab('chat');
                  if (callState === 'connected') handleEndCall();
                }}
                className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-white text-[#9E1830] border-b-2 border-[#9E1830] shadow-2xs'
                    : 'text-[#4A3F35] hover:text-[#9E1830]'
                }`}
              >
                <MessageCircle size={14} />
                <span>Text Chatbot</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('call');
                  if (callState === 'ended') setCallState('incoming');
                }}
                className={`py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'call'
                    ? 'bg-white text-emerald-800 border-b-2 border-emerald-600 shadow-2xs'
                    : 'text-[#4A3F35] hover:text-emerald-800'
                }`}
              >
                <PhoneCall size={14} className={callState === 'connected' ? 'text-emerald-600 animate-pulse' : ''} />
                <span>AI Voice Call</span>
                {callState === 'connected' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-mono">
                    LIVE
                  </span>
                )}
              </button>
            </div>
          )}

          {!isMinimized && (
            <>
              {/* ──────────────────────────────────────────────────────────
                  MODE 1: AI VOICE CALL AGENT WITH ATTEND ANIMATION & RINGTONE
              ────────────────────────────────────────────────────────── */}
              {activeTab === 'call' ? (
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col p-3 bg-gradient-to-b from-[#FFFDF8] via-[#FAF7F0] to-[#FFFDF8]">
                  {/* SUB-STATE A: INCOMING / ATTEND ANIMATION SCREEN (WITH SOFT RINGTONE) */}
                  {callState === 'incoming' && (
                    <div className="my-auto flex flex-col items-center justify-center text-center space-y-5 py-4 animate-fade-in">
                      {/* Pulsating Avatar Radar Rings */}
                      <div className="relative flex items-center justify-center">
                        <span className="absolute w-36 h-36 rounded-full bg-emerald-500/20 animate-ping" />
                        <span className="absolute w-28 h-28 rounded-full bg-emerald-500/30 animate-pulse" />
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#FFFDF8] to-[#F5EFE3] border-4 border-emerald-500 p-2 shadow-2xl flex items-center justify-center">
                          <Image
                            src="/images/brand_logo_gold_transparent.png"
                            alt="HM Voice Agent"
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 max-w-xs">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          AI Voice Agent Ready
                        </span>
                        <h4 className="font-serif text-lg font-bold text-[#302923]">
                          HM Fragrance Consultation
                        </h4>
                        <p className="text-xs text-[#4A3F35] leading-relaxed">
                          Tap <strong>Attend Call</strong> to connect. You can speak into your microphone or tap any quick topic card below for voice answers and instant product cards!
                        </p>
                      </div>

                      {/* Attend & Decline Action Buttons */}
                      <div className="flex items-center gap-3.5 pt-1">
                        <button
                          onClick={handleAttendCall}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 ring-4 ring-emerald-300/40 animate-pulse"
                        >
                          <PhoneCall size={16} />
                          <span>Attend Call</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('chat')}
                          className="px-4 py-3 bg-white hover:bg-[#FAF7F0] text-[#4A3F35] border border-[#EAE1D3] rounded-full font-semibold text-xs flex items-center gap-1.5 transition-colors"
                          title="Switch to chat"
                        >
                          <PhoneOff size={14} className="text-rose-600" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SUB-STATE B: LIVE CONNECTED CALL SCREEN (CLEAN 3-PART LAYOUT) */}
                  {callState === 'connected' && (
                    <div className="flex-1 min-h-0 flex flex-col gap-2 animate-fade-in">
                      {/* Slim status bar */}
                      <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 bg-white rounded-full border border-[#C89B3C]/40">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          </span>
                          <span className="text-[11px] font-bold text-[#302923]">Live</span>
                          <span className="font-mono text-[10px] text-emerald-800 font-bold">{formatCallTime(callDuration)}</span>
                        </div>
                        <div className="flex bg-[#FAF7F0] p-0.5 rounded-full border border-[#EAE1D3] text-[10px] font-bold">
                          {([['en', 'English'], ['ta', 'தமிழ்']] as const).map(([m, label]) => (
                            <button key={m} onClick={() => setVoiceMode(m)}
                              className={`px-2 py-0.5 rounded-full ${voiceMode === m ? 'bg-emerald-600 text-white' : 'text-[#4A3F35]'}`}>
                              {label}
                            </button>
                          ))}
                        </div>
                        <button onClick={() => { setIsMuted(!isMuted); if (!isMuted) voice.stop(); }}
                          className="p-1.5 rounded-full border border-[#EAE1D3] text-[#4A3F35]">
                          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        </button>
                      </div>

                      {/* Conversation only (the one scrolling area, like normal chat) */}
                      <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 px-0.5">
                        {callLog.map((m, i) => (
                          <div key={i} className={`flex ${m.who === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                              m.who === 'user'
                                ? 'bg-[#9E1830] text-white rounded-br-sm'
                                : 'bg-white text-[#302923] border border-[#EAE1D3] rounded-bl-sm shadow-2xs'}`}>
                              <p className="whitespace-pre-line">{cleanCustomerText(m.text)}</p>

                              {m.products && m.products.length > 0 && (
                                <ProductButtons products={m.products} lang={m.lang} addedSlugs={addedSlugs} onAdd={handleAddToCart} />
                              )}
                              {m.categories && m.categories.length > 0 && (
                                <CategoryButtons categories={m.categories} lang={m.lang} />
                              )}

                              {/* Inline Direct Contact Actions (Call, WhatsApp, Maps) */}
                              {m.contactActions && m.contactActions.length > 0 && (
                                <DirectContactActions actions={m.contactActions} lang={m.lang} />
                              )}
                            </div>
                          </div>
                        ))}

                        {/* ChatGPT-style pulsing thinking dots */}
                        {voice.state === 'thinking' && (
                          <div className="flex justify-start">
                            <div className="bg-white border border-[#EAE1D3] px-3.5 py-2.5 rounded-2xl rounded-bl-sm shadow-2xs flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#9E1830] animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C89B3C] animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-[#9E1830] animate-bounce" />
                            </div>
                          </div>
                        )}
                        <div ref={logEndRef} />
                      </div>

                      {voice.notice && (
                        <div className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold text-center">
                          {voice.notice}
                        </div>
                      )}

                      {/* ONE input row: [ text ........ mic ] [ send ] [ end ] */}
                      <form
                        onSubmit={handleCallInputSubmit}
                        className="shrink-0 flex items-center gap-1.5 pt-2 border-t border-[#EAE1D3]"
                      >
                        <div className="flex-1 min-w-0 flex items-center bg-white border border-[#EAE1D3] rounded-full pl-3.5 pr-1 py-1 focus-within:border-emerald-600">
                          <input
                            type="text"
                            value={voice.state === 'recording' || voice.state === 'thinking' ? voice.transcript : callInputText}
                            readOnly={voice.state === 'recording'}
                            onChange={(e) => setCallInputText(e.target.value)}
                            placeholder={
                              voice.state === 'thinking' ? 'Understanding...'
                              : voice.state === 'speaking' ? 'Speaking... tap stop'
                              : 'Type or tap the mic...'
                            }
                            className="flex-1 min-w-0 bg-transparent text-xs text-[#302923] placeholder:text-[#A8A29E] focus:outline-none"
                          />
                          <button
                            type="button"
                            disabled={voice.state === 'thinking'}
                            onClick={() => {
                              if (voice.state === 'recording') voice.stopRecording();
                              else if (voice.state === 'speaking') voice.stop();
                              else voice.startRecording();
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 transition-all active:scale-95 disabled:opacity-50 ${
                              voice.state === 'recording' ? 'bg-red-600 animate-pulse ring-2 ring-red-300'
                              : voice.state === 'speaking' ? 'bg-amber-600'
                              : 'bg-emerald-600'}`}
                            aria-label="Microphone"
                          >
                            {voice.state === 'recording' ? <MicOff size={15} />
                              : voice.state === 'speaking' ? <VolumeX size={15} />
                              : <Mic size={15} />}
                          </button>
                        </div>

                        <button type="submit" disabled={!callInputText.trim() || voice.state === 'recording'}
                          className="w-9 h-9 rounded-full bg-[#9E1830] disabled:opacity-40 text-white flex items-center justify-center shrink-0"
                          aria-label="Send">
                          <Send size={14} />
                        </button>

                        <button type="button" onClick={handleEndCall}
                          className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shrink-0"
                          aria-label="End call">
                          <PhoneOff size={14} />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* SUB-STATE C: CALL ENDED BANNER */}
                  {callState === 'ended' && (
                    <div className="my-auto flex flex-col items-center justify-center text-center space-y-2 py-8 animate-fade-in">
                      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mb-1">
                        <PhoneOff size={22} />
                      </div>
                      <h4 className="font-serif text-base font-bold text-[#302923]">Call Ended</h4>
                      <p className="text-xs text-[#4A3F35]">
                        Switching back to text chat in a moment...
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* ──────────────────────────────────────────────────────────
                    MODE 2: CLEAN TEXT CHATBOT VIEW
                ────────────────────────────────────────────────────────── */
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans bg-gradient-to-b from-[#FFFDF8] via-[#FAF7F0] to-[#FFFDF8]">
                    {/* Direct Contact Bar */}
                    <div className="p-2.5 bg-white rounded-xl border border-[#EAE1D3] shadow-2xs flex items-center justify-between gap-2 text-[11px]">
                      <span className="text-[#4A3F35] font-medium">Prefer voice or WhatsApp?</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setActiveTab('call');
                            setCallState('incoming');
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 text-[10px]"
                        >
                          <PhoneCall size={10} /> AI Call
                        </button>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF7F0] hover:bg-[#F5EFE3] text-[#9E1830] font-bold border border-[#EAE1D3] text-[10px]"
                        >
                          <MessageCircle size={10} /> WhatsApp
                        </a>
                      </div>
                    </div>

                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.sender === 'user' ? 'items-end' : 'items-start'
                        } space-y-2`}
                      >
                        <div
                          className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed shadow-xs ${
                            msg.sender === 'user'
                              ? 'bg-[#9E1830] text-white rounded-br-none'
                              : 'bg-white text-[#302923] border border-[#EAE1D3] rounded-bl-none whitespace-pre-line'
                          }`}
                        >
                          <p className="text-xs">{cleanCustomerText(msg.text)}</p>
                        </div>

                        {msg.products && msg.products.length > 0 && (
                          <ProductButtons products={msg.products} lang={msg.lang} addedSlugs={addedSlugs} onAdd={handleAddToCart} />
                        )}

                        {msg.categories && msg.categories.length > 0 && (
                          <CategoryButtons categories={msg.categories} lang={msg.lang} />
                        )}

                        {/* Direct Contact Actions (Call, WhatsApp, Maps) */}
                        {msg.contactActions && msg.contactActions.length > 0 && (
                          <DirectContactActions actions={msg.contactActions} lang={msg.lang} />
                        )}

                        {/* Quick Selection Options Buttons */}
                        {!msg.products?.length && !msg.categories?.length && !msg.contactActions?.length && msg.options && msg.options.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {msg.options.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => handleUserSelection(opt.value, opt.label)}
                                className="px-2.5 py-1 bg-white hover:bg-[#FAF7F0] border border-[#C89B3C]/50 hover:border-[#9E1830] text-[#302923] text-[11px] font-semibold rounded-full shadow-2xs transition-all active:scale-95"
                              >
                                {cleanCustomerText(opt.label)}
                              </button>
                            ))}
                          </div>
                        )}

                        <span className="text-[9px] text-[#A8A29E] px-1">{msg.timestamp}</span>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start animate-fade-in">
                        <div className="bg-white border border-[#EAE1D3] px-3.5 py-2.5 rounded-2xl rounded-bl-sm shadow-2xs flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9E1830] animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C89B3C] animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9E1830] animate-bounce" />
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Form */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-3 bg-white border-t border-[#EAE1D3] flex items-center gap-2 shrink-0"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask about rose agarbatti, camphor, burn time..."
                      className="flex-1 px-3.5 py-2.5 bg-[#FAF7F0] border border-[#EAE1D3] rounded-full text-xs text-[#302923] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#9E1830]"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isLoading}
                      className="w-9 h-9 rounded-full bg-[#9E1830] hover:bg-[#7A1224] disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-sm transition-all active:scale-95"
                      aria-label="Send message"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
