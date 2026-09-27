"use client";

import React from "react";

/**
 * Single Marigold Flower (Chendumalli / Samanthi Poo) SVG Blossom
 */
function MarigoldBlossom({ cx, cy, r = 16 }: { cx: number; cy: number; r?: number }) {
  return (
    <g className="marigold-blossom">
      {/* Outer Glow / Petal Base */}
      <circle cx={cx} cy={cy} r={r} fill="#E85D04" />
      
      {/* Mid Layer Fluffy Petals */}
      <circle cx={cx} cy={cy} r={r * 0.85} fill="#F47A20" />
      <circle cx={cx} cy={cy} r={r * 0.85} stroke="#D9480F" strokeWidth="1" strokeDasharray="3 3" fill="none" />
      
      {/* Inner Petal Ruffle Texture */}
      {Array.from({ length: 8 }, (_, i) => (
        <circle
          key={`petal-dot-${i}`}
          cx={cx}
          cy={cy - r * 0.45}
          r={r * 0.35}
          fill="#F9C74F"
          opacity="0.9"
          transform={`rotate(${i * 45} ${cx} ${cy})`}
        />
      ))}

      {/* Core Gold Blossom Center */}
      <circle cx={cx} cy={cy} r={r * 0.45} fill="#F9C74F" />
      <circle cx={cx} cy={cy} r={r * 0.25} fill="#FFE382" />
    </g>
  );
}

/**
 * Tri-Leaf Mango Leaf Cluster (Mavilai) at Garland Tail
 */
function MangoLeafCluster({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g className="mango-mavilai" transform={`translate(${cx}, ${cy})`}>
      {/* Center Mango Leaf */}
      <path
        d="M0,0 Q-6,18 0,34 Q6,18 0,0 Z"
        fill="#386641"
        stroke="#2D5A34"
        strokeWidth="0.8"
      />
      <line x1="0" y1="2" x2="0" y2="30" stroke="#588157" strokeWidth="0.8" />

      {/* Left Serrated Mango Leaf */}
      <path
        d="M-3,4 Q-16,16 -10,30 Q-2,18 -3,4 Z"
        fill="#588157"
        stroke="#386641"
        strokeWidth="0.8"
      />
      <line x1="-3" y1="6" x2="-9" y2="26" stroke="#8CB369" strokeWidth="0.6" />

      {/* Right Serrated Mango Leaf */}
      <path
        d="M3,4 Q16,16 10,30 Q2,18 3,4 Z"
        fill="#588157"
        stroke="#386641"
        strokeWidth="0.8"
      />
      <line x1="3" y1="6" x2="9" y2="26" stroke="#8CB369" strokeWidth="0.6" />
    </g>
  );
}

/**
 * Hanging Marigold & Mango Leaf Maalai (Garland Drop)
 */
function HangingMaalaiUnit({
  x,
  flowerCount = 4,
  swayClass = "animate-maalai-1",
  flowerRadius = 14,
}: {
  x: number;
  flowerCount?: number;
  swayClass?: string;
  flowerRadius?: number;
}) {
  const flowerSpacing = flowerRadius * 1.7;
  const totalHeight = flowerCount * flowerSpacing;

  return (
    <g className={`origin-top transition-transform ${swayClass}`} style={{ transformOrigin: `${x}px 0px` }}>
      {/* Thread connecting flowers */}
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={totalHeight}
        stroke="#F6C84C"
        strokeWidth="1.5"
        strokeDasharray="2 3"
      />

      {/* Stack of Marigold Flowers */}
      {Array.from({ length: flowerCount }, (_, i) => (
        <MarigoldBlossom
          key={`blossom-${i}`}
          cx={x}
          cy={i * flowerSpacing + flowerRadius}
          r={flowerRadius}
        />
      ))}

      {/* Mango Leaf Cluster at the Bottom */}
      <MangoLeafCluster
        cx={x}
        cy={flowerCount * flowerSpacing}
      />
    </g>
  );
}

/**
 * Full Festive Toran Maalai Border
 * Renders repeating scalloped garlands with marigold flowers and swaying mango leaves
 */
export function ToranMaalai({ className = "" }: { className?: string }) {
  // 14 repeating garland drop positions across a 1440px wide viewport
  const drops = [
    { x: 35, count: 4, sway: "animate-maalai-1" },
    { x: 95, count: 2, sway: "animate-maalai-2" },
    { x: 165, count: 3, sway: "animate-maalai-3" },
    { x: 235, count: 2, sway: "animate-maalai-1" },
    { x: 310, count: 4, sway: "animate-maalai-2" },
    { x: 385, count: 2, sway: "animate-maalai-3" },
    { x: 460, count: 3, sway: "animate-maalai-1" },
    { x: 535, count: 2, sway: "animate-maalai-2" },
    { x: 610, count: 4, sway: "animate-maalai-3" },
    { x: 685, count: 2, sway: "animate-maalai-1" },
    { x: 755, count: 3, sway: "animate-maalai-2" },
    { x: 825, count: 2, sway: "animate-maalai-3" },
    { x: 900, count: 4, sway: "animate-maalai-1" },
    { x: 975, count: 2, sway: "animate-maalai-2" },
    { x: 1050, count: 3, sway: "animate-maalai-3" },
    { x: 1125, count: 2, sway: "animate-maalai-1" },
    { x: 1200, count: 4, sway: "animate-maalai-2" },
    { x: 1275, count: 2, sway: "animate-maalai-3" },
    { x: 1345, count: 3, sway: "animate-maalai-1" },
    { x: 1405, count: 4, sway: "animate-maalai-2" },
  ];

  return (
    <div className={`w-full overflow-hidden pointer-events-none select-none relative ${className}`} aria-hidden="true">
      <svg
        className="w-full h-20 sm:h-24 md:h-28 block drop-shadow-md"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Connecting Sacred Gold Toran Thread */}
        <path
          d="M0,4 Q70,16 140,4 Q210,16 280,4 Q350,16 420,4 Q490,16 560,4 Q630,16 700,4 Q770,16 840,4 Q910,16 980,4 Q1050,16 1120,4 Q1190,16 1260,4 Q1330,16 1400,4 Q1420,10 1440,4"
          stroke="#F6C84C"
          strokeWidth="3.5"
          fill="none"
        />

        {/* Hanging Floral Garlands with Staggered Swings */}
        {drops.map((drop, idx) => (
          <HangingMaalaiUnit
            key={`maalai-drop-${idx}`}
            x={drop.x}
            flowerCount={drop.count}
            swayClass={drop.sway}
            flowerRadius={11}
          />
        ))}

        {/* Small Golden Bells Hanging between Garlands */}
        {Array.from({ length: 11 }, (_, i) => (
          <g key={`bell-${i}`} transform={`translate(${i * 140 + 70}, 8)`} className="animate-bell" style={{ transformOrigin: "top center" }}>
            <circle cx="0" cy="4" r="3" fill="#F6C84C" />
            <path d="M-4,8 Q0,4 4,8 L3,14 L-3,14 Z" fill="#F6C84C" />
            <circle cx="0" cy="15" r="1.5" fill="#FFE180" />
          </g>
        ))}
      </svg>
    </div>
  );
}
