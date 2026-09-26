import Link from "next/link";
import { ArrowRight, BookOpen, Leaf, Sparkles } from "lucide-react";
import { InnerPage } from "@/components/inner-page";

const journalEntries = [
  {
    id: "morning-ritual",
    label: "DAILY RITUALS",
    title: "A gentler start to your morning",
    copy: "A few quiet minutes, fresh air and a familiar fragrance can help make your morning feel intentional. Keep the ritual simple and make it your own.",
    icon: Leaf,
  },
  {
    id: "fragrance-notes",
    label: "FRAGRANCE GUIDE",
    title: "Finding a fragrance for every room",
    copy: "Floral notes bring a bright welcome, while woody aromas feel warm and grounding. Explore different blends and choose what feels right in each space.",
    icon: Sparkles,
  },
  {
    id: "mindful-evening",
    label: "MINDFUL LIVING",
    title: "Make space for a peaceful evening",
    copy: "As the day winds down, soften the lights, clear a small corner and take a moment to pause. A steady evening ritual can make home feel more restful.",
    icon: BookOpen,
  },
];

export default function BlogPage() {
  return (
    <InnerPage
      eyebrow="THE HM JOURNAL"
      title="Notes for a More Mindful Home"
      subtitle="Fragrance guides, everyday rituals and thoughtful ideas inspired by Indian tradition and modern wellbeing."
    >
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        {journalEntries.map(({ id, label, title, copy, icon: Icon }) => (
          <article id={id} key={id} className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-[#e1edcf] text-[#34774b]"><Icon size={22} /></div>
            <p className="text-[10px] font-extrabold tracking-[.16em] text-[#a90c35]">{label}</p>
            <h2 className="mt-2 text-xl font-extrabold leading-tight text-[#183c31]">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#52625a]">{copy}</p>
            <Link href="/shop" className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-[#a90c35]">Explore fragrances <ArrowRight size={14} /></Link>
          </article>
        ))}
      </div>
    </InnerPage>
  );
}
