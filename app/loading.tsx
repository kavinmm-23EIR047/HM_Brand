import React from "react";
import { MascotNamaste } from "@/components/mascot-art";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFF8E7] flex flex-col items-center justify-center p-6 text-center text-[#6B4226]">
      <div className="animate-float">
        <MascotNamaste size={160} />
      </div>
      <h2 className="font-display text-3xl font-bold mt-6 text-[#6B4226]">
        Preparing Your Sacred Space…
      </h2>
      <p className="text-xs text-[#292524]/60 mt-2 font-sans">
        HM Agarbattis • Handcrafted in Coimbatore
      </p>
    </div>
  );
}
