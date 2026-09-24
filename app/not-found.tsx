import React from "react";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { MascotLost } from "@/components/mascot-art";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FFF8E7] text-[#292524]">
      <Navigation />

      <main className="py-20 px-4 flex items-center justify-center">
        <div className="bg-[#FFF8E7] rounded-3xl border-2 border-[#6B4226] p-10 sm:p-14 text-center max-w-xl mx-auto shadow-solid-md flex flex-col items-center">
          <MascotLost size={190} />

          <span className="bg-[#B23A48] text-[#FFF8E7] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mt-6">
            404 • PATH NOT FOUND
          </span>

          <h1 className="font-display text-3xl sm:text-4xl text-[#6B4226] font-bold mt-4 leading-tight">
            Looks Like Our Little Guide Took a Wrong Turn.
          </h1>

          <p className="text-xs sm:text-sm text-[#292524]/75 mt-3 max-w-md font-sans leading-relaxed">
            The page you are looking for might have moved, but peace and divine fragrance are always within reach.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="btn-saffron px-6 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-solid-sm"
            >
              <Home size={15} />
              <span>Return Home</span>
            </Link>
            <Link
              href="/shop"
              className="btn-outline-earth px-6 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <span>Explore Collection</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
