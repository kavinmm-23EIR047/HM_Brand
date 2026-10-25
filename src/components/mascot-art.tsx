"use client";

import React from "react";

interface MascotProps {
  className?: string;
  size?: number;
  mood?: "namaste" | "agarbatti" | "diya" | "meditate" | "basket" | "delivery" | "search" | "lost";
}

export function MascotArt({ className = "", size = 200, mood = "namaste" }: MascotProps) {
  switch (mood) {
    case "agarbatti":
      return <MascotAgarbatti size={size} className={className} />;
    case "diya":
      return <MascotDiya size={size} className={className} />;
    case "meditate":
      return <MascotMeditate size={size} className={className} />;
    case "basket":
      return <MascotBasket size={size} className={className} />;
    case "delivery":
      return <MascotDelivery size={size} className={className} />;
    case "search":
      return <MascotSearch size={size} className={className} />;
    case "lost":
      return <MascotLost size={size} className={className} />;
    case "namaste":
    default:
      return <MascotNamaste size={size} className={className} />;
  }
}

import Image from "next/image";

export function MascotNamaste({ size = 200, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Image src="/images/mascot_1.png" alt="Mascot Namaste" fill className="object-contain" unoptimized={true} />
    </div>
  );
}

export function MascotAgarbatti({ size = 200, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Image src="/images/mascot_2.png" alt="Mascot Agarbatti" fill className="object-contain" unoptimized={true} />
    </div>
  );
}

export function MascotDiya({ size = 200, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Image src="/images/mascot_3.png" alt="Mascot Diya" fill className="object-contain" unoptimized={true} />
    </div>
  );
}

export function MascotMeditate({ size = 200, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Image src="/images/mascot_4.png" alt="Mascot Meditate" fill className="object-contain" unoptimized={true} />
    </div>
  );
}

export function MascotBasket({ size = 200, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Image src="/images/mascot_5.png" alt="Mascot Basket" fill className="object-contain" unoptimized={true} />
    </div>
  );
}

export function MascotDelivery({ size = 200, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Image src="/images/mascot_6.png" alt="Mascot Delivery" fill className="object-contain" unoptimized={true} />
    </div>
  );
}

export function MascotSearch({ size = 200, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Image src="/images/mascot_7.png" alt="Mascot Search" fill className="object-contain" unoptimized={true} />
    </div>
  );
}

export function MascotLost({ size = 200, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Image src="/images/mascot_8.png" alt="Mascot Lost" fill className="object-contain" unoptimized={true} />
    </div>
  );
}
