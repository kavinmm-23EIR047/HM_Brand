"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { InnerPage } from "@/components/inner-page";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    fetch(`${api}/content/blog`).then((response) => response.json()).then((json) => {
      if (json.success && Array.isArray(json.data)) setPosts(json.data);
    }).catch(() => setPosts([]));
  }, []);
  const featured = posts.find((post) => post.isFeatured) || posts[0];

  return (
    <InnerPage eyebrow="THE HM JOURNAL & WELLNESS" title="Sacred Notes for a Mindful, Fragrant Home" subtitle="Explore articles, rituals, and wellness insights from the HM Journal.">
      <div className="mx-auto max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1560px] space-y-12 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {featured && <section className="rounded-3xl bg-gradient-to-br from-[#FFF4D6] via-[#FFF8E7] to-[#FCEECC] p-6 sm:p-10 border-2 border-[#F6C84C]/60 shadow-lg">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9E1830]/30 bg-[#9E1830]/10 px-3 py-1 text-[11px] font-extrabold tracking-widest text-[#9E1830] uppercase"><Sparkles size={12} />{featured.label || "FEATURED ARTICLE"}</span>
          <h2 className="mt-3 max-w-3xl font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#173B3A] leading-tight">{featured.title}</h2>
          <p className="mt-2.5 max-w-3xl text-xs sm:text-sm text-[#292524]/85 leading-relaxed">{featured.excerpt}</p>
          <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#6B4226]"><Clock size={13} className="text-[#F47A20]" />{featured.readingTime || "5 min read"}{featured.author ? <span> · By {featured.author}</span> : null}</div>
        </section>}

        <section className="space-y-5">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#9E1830]">EXPLORE THE JOURNAL</span>
            <h2 className="font-heading text-lg sm:text-xl lg:text-2xl font-extrabold text-[#173B3A]">Ritual Wisdom, Guides &amp; Health Insights</h2>
          </div>
          {posts.length ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => <article key={post.id} id={post.slug} className="rounded-3xl border-2 border-[#F6C84C]/50 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3"><span className="rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider" style={{ backgroundColor: post.background || "#FFF4D6", color: post.color || "#9E1830" }}>{post.tag}</span><span className="inline-flex items-center gap-1 text-xs text-[#6B7280]"><Clock size={13} />{post.readingTime || "5 min read"}</span></div>
                <div><span className="text-[10px] font-extrabold tracking-widest text-[#9E1830] uppercase">{post.label}</span><h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#173B3A] mt-1 leading-snug">{post.title}</h3></div>
                <p className="text-xs sm:text-sm text-[#292524]/80 leading-relaxed">{post.excerpt}</p>
                {post.highlight && <div className="p-3 rounded-xl bg-[#FFF8E7] border border-[#F6C84C]/30 text-xs font-bold text-[#173B3A] flex items-center gap-2"><Sparkles size={14} className="text-[#F47A20] shrink-0" />Key Takeaway: {post.highlight}</div>}
                {post.body && <details className="text-xs text-[#292524]/80"><summary className="cursor-pointer font-bold text-[#9E1830]">Read article</summary><p className="mt-3 whitespace-pre-line leading-relaxed">{post.body}</p></details>}
              </div>
              <div className="pt-2 border-t border-[#F6C84C]/20"><Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#9E1830] hover:text-[#F47A20]"><span>Explore Related Fragrances</span><ArrowRight size={14} /></Link></div>
            </article>)}
          </div> : <div className="rounded-2xl border border-[#F6C84C]/40 bg-white p-8 text-center text-sm text-[#292524]/70">No journal articles have been published yet.</div>}
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-[#9E1830] via-[#851227] to-[#5A0919] p-8 sm:p-12 text-white border-2 border-[#F6C84C]/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl"><span className="font-script text-2xl sm:text-3xl text-[#F6C84C]">Ready to Begin Your Ritual?</span><h2 className="font-heading text-2xl sm:text-3xl font-extrabold leading-snug">Bring Botanical Purity Into Your Everyday Living</h2><p className="text-xs sm:text-sm text-white/85">Handcrafted in Coimbatore with pure herbs, sacred wood barks, and natural resins.</p></div>
          <Link href="/shop" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F6C84C] text-[#173B3A] px-7 py-3.5 font-bold text-xs sm:text-sm"><span>Shop Sacred Incense</span><ArrowRight size={16} /></Link>
        </section>
      </div>
    </InnerPage>
  );
}
