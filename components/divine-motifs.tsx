"use client";

import { MailQuestionMark } from "lucide-react";
import React from "react";

export function TempleGopuram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      {/* Kalash on Top */}
      <circle cx="200" cy="18" r="7" fill="#C89B3C" stroke="#6B4226" strokeWidth="2" />
      <path d="M194 25 L206 25 L203 35 L197 35 Z" fill="#C89B3C" stroke="#6B4226" strokeWidth="1.5" />

      {/* Tier 1 (Apex) */}
      <path d="M175 38 L225 38 L235 65 L165 65 Z" fill="#FFF8E7" stroke="#6B4226" strokeWidth="2.5" />
      <circle cx="200" cy="52" r="5" fill="#E85D04" />

      {/* Tier 2 */}
      <path d="M155 68 L245 68 L260 105 L140 105 Z" fill="#FFF8E7" stroke="#6B4226" strokeWidth="2.5" />
      <rect x="175" y="76" width="16" height="20" rx="3" fill="#F4D35E" stroke="#6B4226" strokeWidth="1.5" />
      <rect x="209" y="76" width="16" height="20" rx="3" fill="#F4D35E" stroke="#6B4226" strokeWidth="1.5" />

      {/* Tier 3 */}
      <path d="M130 108 L270 108 L290 155 L110 155 Z" fill="#FFF8E7" stroke="#6B4226" strokeWidth="2.5" />
      <rect x="145" y="118" width="18" height="26" rx="4" fill="#F4D35E" stroke="#6B4226" strokeWidth="1.5" />
      <rect x="191" y="118" width="18" height="26" rx="4" fill="#E85D04" stroke="#6B4226" strokeWidth="1.5" />
      <rect x="237" y="118" width="18" height="26" rx="4" fill="#F4D35E" stroke="#6B4226" strokeWidth="1.5" />

      {/* Tier 4 (Mandapam Base) */}
      <path d="M100 158 L300 158 L320 215 L80 215 Z" fill="#FFF8E7" stroke="#6B4226" strokeWidth="2.5" />
      {/* Pillar details */}
      <line x1="120" y1="168" x2="120" y2="215" stroke="#C89B3C" strokeWidth="3" />
      <line x1="170" y1="168" x2="170" y2="215" stroke="#C89B3C" strokeWidth="3" />
      <line x1="230" y1="168" x2="230" y2="215" stroke="#C89B3C" strokeWidth="3" />
      <line x1="280" y1="168" x2="280" y2="215" stroke="#C89B3C" strokeWidth="3" />

      {/* Main Temple Sanctum Entrance (Garbhagriha Arch) */}
      <path d="M60 218 L340 218 L340 310 L60 310 Z" fill="#FFF8E7" stroke="#6B4226" strokeWidth="3" />
      <path
        d="M140 310 L140 248 C140 225 260 225 260 248 L260 310 Z"
        fill="#292524"
        stroke="#6B4226"
        strokeWidth="3"
      />
      {/* Inner Sanctum Flame */}
      <circle cx="200" cy="275" r="7" fill="#F48C06" />
      <circle cx="200" cy="273" r="3" fill="#FFF8E7" />
    </svg>
  );
}

export function TempleBell({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-bell origin-top select-none ${className}`}
    >
      {/* Chain */}
      <line x1="30" y1="0" x2="30" y2="15" stroke="#6B4226" strokeWidth="3" strokeDasharray="3 3" />
      <circle cx="30" cy="17" r="5" fill="#C89B3C" stroke="#6B4226" strokeWidth="2" />

      {/* Bell Dome */}
      <path
        d="M15 48 C15 26 22 23 30 23 C38 23 45 26 45 48 C48 52 50 56 50 58 L10 58 C10 56 12 52 15 48 Z"
        fill="#C89B3C"
        stroke="#6B4226"
        strokeWidth="2.5"
      />
      {/* Bell Clapper */}
      <circle cx="30" cy="63" r="4.5" fill="#6B4226" />
      <path d="M20 46 Q30 50 40 46" stroke="#E85D04" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function BrassDiya({ className = "", size = 64 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      {/* Diya Base */}
      <path d="M30 65 L70 65 L65 74 L35 74 Z" fill="#C89B3C" stroke="#6B4226" strokeWidth="2" />
      <path
        d="M10 50 C10 68 90 68 90 50 C90 40 75 36 50 36 C25 36 10 40 10 50 Z"
        fill="#C89B3C"
        stroke="#6B4226"
        strokeWidth="2.5"
      />
      <ellipse cx="50" cy="45" rx="36" ry="7" fill="#A67C52" />

      {/* Animated Flame */}
      <g className="animate-flame" transform="translate(50, 42)">
        <path
          d="M0 0 C-12 -12 -12 -28 0 -40 C12 -28 12 -12 0 0 Z"
          fill="#F48C06"
          stroke="#6B4226"
          strokeWidth="1.5"
        />
        <path
          d="M0 -3 C-7 -12 -7 -22 0 -30 C7 -22 7 -12 0 -3 Z"
          fill="#F9C74F"
        />
        <circle cx="0" cy="-10" r="3.5" fill="#FFF8E7" />
      </g>
    </svg>
  );
}

export function LotusMotif({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      {/* Center Petal */}
      <path
        d="M40 15 C34 28 32 45 40 60 C48 45 46 28 40 15 Z"
        fill="#B23A48"
        stroke="#6B4226"
        strokeWidth="2"
      />
      {/* Side Petals Left */}
      <path
        d="M38 30 C20 35 15 50 25 60 C32 52 36 42 38 30 Z"
        fill="#C73E1D"
        stroke="#6B4226"
        strokeWidth="2"
      />
      {/* Side Petals Right */}
      <path
        d="M42 30 C60 35 65 50 55 60 C48 52 44 42 42 30 Z"
        fill="#C73E1D"
        stroke="#6B4226"
        strokeWidth="2"
      />
      {/* Outer Petals */}
      <path
        d="M24 45 C10 48 8 62 18 64 C25 60 27 52 24 45 Z"
        fill="#F48C06"
        stroke="#6B4226"
        strokeWidth="1.5"
      />
      <path
        d="M56 45 C70 48 72 62 62 64 C55 60 53 52 56 45 Z"
        fill="#F48C06"
        stroke="#6B4226"
        strokeWidth="1.5"
      />
      {/* Base Calyx */}
      <path d="M26 62 Q40 70 54 62" stroke="#386641" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function ToranBorder({ className = "" }: { className?: string }) {
  return (
    <div className={`flex w-full overflow-hidden select-none ${className}`}>
      {Array.from({ length: 16 }).map((_, i) => (
        <svg key={i} width="60" height="32" viewBox="0 0 60 32" fill="none" className="shrink-0">
          <path d="M0 4 Q30 24 60 4" stroke="#6B4226" strokeWidth="2" fill="none" />
          {/* Mango Leaf */}
          <path d="M30 14 C25 20 27 30 30 32 C33 30 35 20 30 14 Z" fill="#386641" stroke="#6B4226" strokeWidth="1" />
          {/* Marigold Flower */}
          <circle cx="15" cy="10" r="5" fill="#F48C06" stroke="#6B4226" strokeWidth="1" />
          <circle cx="45" cy="10" r="5" fill="#F9C74F" stroke="#6B4226" strokeWidth="1" />
        </svg>
      ))}
    </div>
  );
}

export function AuspiciousSeal({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center p-3 border-2 border-dashed border-[#C89B3C] rounded-full bg-[#FFF8E7] text-[#6B4226] ${className}`}>
      <div className="w-24 h-24 rounded-full border-2 border-[#6B4226] flex flex-col items-center justify-center text-center p-2 bg-[#F4D35E]/30">
        <span className="text-xs font-bold tracking-widest text-[#B23A48]">★ PURE ★</span>
        <span className="font-display font-bold text-sm text-[#6B4226] leading-tight">HM BRAND</span>
        <span className="text-[9px] uppercase tracking-wider font-semibold text-[#292524]/80 mt-0.5">EST. COIMBATORE</span>
      </div>
    </div>
  );
}

export function MarigoldGarland({ className = "", length = 5 }: { className?: string; length?: number }) {
  return (
    <div className={`flex flex-col items-center select-none origin-top animate-sway ${className}`}>
      {/* Top String hook */}
      <div className="w-0.5 h-6 bg-earthBrown opacity-50"></div>

      {Array.from({ length }).map((_, i) => (
        <div key={i} className="flex flex-col items-center -mt-2">
          {/* Green Leaf */}
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="z-0">
            <path d="M12 0 C5 0 0 6 0 12 C0 6 5 0 12 0 Z" fill="#386641" />
            <path d="M12 0 C19 0 24 6 24 12 C24 6 19 0 12 0 Z" fill="#386641" />
          </svg>
          {/* Orange Marigold */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="z-10 -mt-2">
            <circle cx="20" cy="20" r="16" fill="#F48C06" />
            <path d="M10 20 A 10 10 0 0 1 30 20 A 10 10 0 0 1 10 20 Z" fill="#F9C74F" stroke="#E85D04" strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="20" cy="20" r="4" fill="#C73E1D" />
          </svg>
        </div>
      ))}

      {/* Bottom String with small bell */}
      <div className="w-0.5 h-4 bg-earthBrown opacity-50 -mt-2"></div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 10 C4 6 6 4 8 4 C10 4 12 6 12 10 L14 12 L2 12 L4 10 Z" fill="#C89B3C" />
        <circle cx="8" cy="14" r="2" fill="#6B4226" />
      </svg>
    </div>
  );
}

export function TemplePillar({ className = "", height = 300 }: { className?: string; height?: number }) {
  return (
    <svg
      width="100"
      height={height}
      viewBox={`0 0 100 ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      preserveAspectRatio="none"
    >
      {/* Pillar Shaft */}
      <rect x="25" y="40" width="50" height={height - 80} fill="#E5D9C5" stroke="#C89B3C" strokeWidth="2" />

      {/* Decorative vertical lines on shaft */}
      <line x1="35" y1="40" x2="35" y2={height - 40} stroke="#D4C5AB" strokeWidth="2" />
      <line x1="65" y1="40" x2="65" y2={height - 40} stroke="#D4C5AB" strokeWidth="2" />

      {/* Top Capital / Bracket */}
      <path d="M10 40 L90 40 L75 20 L25 20 Z" fill="#D4C5AB" stroke="#C89B3C" strokeWidth="2" />
      <rect x="20" y="0" width="60" height="20" fill="#E5D9C5" stroke="#C89B3C" strokeWidth="2" />

      {/* Bottom Base */}
      <path d="M25 100 L75 100 L90 120 L10 120 Z" transform={`translate(0, ${height - 140})`} fill="#D4C5AB" stroke="#C89B3C" strokeWidth="2" />
      <rect x="15" y={height - 20} width="70" height="20" fill="#E5D9C5" stroke="#C89B3C" strokeWidth="2" />

      {/* Carved Motif Pattern on Shaft */}
      <circle cx="50" cy={height / 2} r="15" fill="#D4C5AB" stroke="#C89B3C" strokeWidth="2" />
      <circle cx="50" cy={height / 2} r="6" fill="#C89B3C" />
    </svg>
  );
}

export function RangoliMotif({ className = "", size = 400 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" opacity="0.3" />
      <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="1" opacity="0.5" />

      {/* 8-Petal Lotus Core */}
      <path d="M200 200 L200 60 C240 60 260 160 200 200 Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M200 200 L200 340 C160 340 140 240 200 200 Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M200 200 L340 200 C340 160 240 140 200 200 Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M200 200 L60 200 C60 240 160 260 200 200 Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />

      <path d="M200 200 L299 101 C327 129 270 170 200 200 Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M200 200 L101 299 C73 271 130 230 200 200 Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M200 200 L299 299 C271 327 230 270 200 200 Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M200 200 L101 101 C129 73 170 130 200 200 Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />

      {/* Outer Dots */}
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} cx="375" cy="200" r="4" fill="currentColor" opacity="0.8" transform={`rotate(${i * 45}, 200, 200)`} />
      ))}

      <circle cx="200" cy="200" r="15" stroke="currentColor" strokeWidth="3" opacity="0.9" fill="none" />
      <circle cx="200" cy="200" r="5" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

/**
 * Detailed Intricate Mandala Pattern Component
 * Styled after hand-drawn concentric ink artwork with multi-layered rotation effects.
 */
export function MandalaMotif({
  className = "",
  size = 500,
  speed = 120,
  counterRotate = true,
  strokeColor = "currentColor",
  isRotating = true,
}: {
  className?: string;
  size?: number;
  speed?: number;
  counterRotate?: boolean;
  strokeColor?: string;
  isRotating?: boolean;
}) {
  const slices16 = Array.from({ length: 16 });
  const slices32 = Array.from({ length: 32 });
  const slices64 = Array.from({ length: 64 });
  const slices128 = Array.from({ length: 128 });

  const speedStyle = {
    "--speed": `${speed}s`,
    animationPlayState: isRotating ? "running" : "paused",
  } as React.CSSProperties;

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
        style={{ color: strokeColor }}
      >
        <defs>
          <style>{`
            @keyframes spin-cw {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes spin-ccw {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            .m-rotate-cw {
              animation: spin-cw var(--speed) linear infinite;
              transform-origin: 500px 500px;
            }
            .m-rotate-ccw {
              animation: spin-ccw var(--speed) linear infinite;
              transform-origin: 500px 500px;
            }
          `}</style>

          {/* Central Spoke Petal */}
          <path
            id="core-spoke-petal"
            d="M 500 450 Q 492 420 500 390 Q 508 420 500 450 Z"
            fill="currentColor"
          />

          {/* Layer 2: Pointed Lotus Arc */}
          <g id="layer2-lotus">
            <path
              d="M 480 390 C 470 340 450 300 500 250 C 550 300 530 340 520 390 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M 488 388 C 480 345 465 310 500 270 C 535 310 520 345 512 388 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 500 375 Q 493 340 500 310 Q 507 340 500 375 Z"
              fill="currentColor"
            />
          </g>

          {/* Layer 3: Scallop Arch Ring */}
          <g id="layer3-scallop">
            <path
              d="M 470 250 A 30 30 0 0 1 530 250"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              d="M 476 250 A 24 24 0 0 1 524 250"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="500" cy="232" r="3" fill="currentColor" />
          </g>

          {/* Layer 4: Paisley Leaf Motif */}
          <g id="layer4-paisley">
            <path
              d="M 480 185 C 450 160 470 120 500 100 C 530 120 550 160 520 185 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M 488 182 C 462 160 478 128 500 112 C 522 128 538 160 512 182 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="500" cy="148" r="4" fill="currentColor" />
          </g>

          {/* Layer 5: Outer Edge Vine Scroll */}
          <path
            id="outer-vine-scroll"
            d="M 485 70 C 470 50 480 30 500 30 C 520 30 530 50 515 70 C 500 85 490 85 485 70 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </defs>

        {/* Core & Layer 1 (Clockwise Rotation) */}
        <g className="m-rotate-cw" style={speedStyle}>
          <circle cx="500" cy="500" r="18" fill="currentColor" />
          <circle cx="500" cy="500" r="30" stroke="currentColor" strokeWidth="3" fill="none" />
          <circle cx="500" cy="500" r="50" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <circle cx="500" cy="500" r="70" stroke="currentColor" strokeWidth="3" fill="none" />

          {slices16.map((_, i) => (
            <g key={`core-spoke-${i}`} transform={`rotate(${i * 22.5}, 500, 500)`}>
              <use href="#core-spoke-petal" />
              <line x1="500" y1="430" x2="500" y2="390" stroke="currentColor" strokeWidth="1.5" />
            </g>
          ))}

          <circle cx="500" cy="500" r="110" stroke="currentColor" strokeWidth="3" fill="none" />
          <circle cx="500" cy="500" r="118" stroke="currentColor" strokeWidth="1.5" fill="none" />

          {slices32.map((_, i) => (
            <g key={`hub-arch-${i}`} transform={`rotate(${i * 11.25}, 500, 500)`}>
              <path
                d="M 488 382 Q 500 365 512 382"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="500" cy="374" r="1.5" fill="currentColor" />
            </g>
          ))}

          <circle cx="500" cy="500" r="135" stroke="currentColor" strokeWidth="4" fill="none" />
          <circle cx="500" cy="500" r="142" stroke="currentColor" strokeWidth="1" fill="none" />
        </g>

        {/* Layer 2 & 3 (Counter-Clockwise Rotation) */}
        <g className={counterRotate ? "m-rotate-ccw" : "m-rotate-cw"} style={speedStyle}>
          {slices16.map((_, i) => (
            <g key={`lotus-${i}`} transform={`rotate(${i * 22.5}, 500, 500)`}>
              <use href="#layer2-lotus" />
            </g>
          ))}

          <circle cx="500" cy="500" r="250" stroke="currentColor" strokeWidth="4" fill="none" />
          <circle cx="500" cy="500" r="258" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" fill="none" />
          <circle cx="500" cy="500" r="266" stroke="currentColor" strokeWidth="2" fill="none" />

          {slices32.map((_, i) => (
            <g key={`scallop-${i}`} transform={`rotate(${i * 11.25}, 500, 500)`}>
              <use href="#layer3-scallop" />
            </g>
          ))}

          <circle cx="500" cy="500" r="315" stroke="currentColor" strokeWidth="3" fill="none" />
          <circle cx="500" cy="500" r="322" stroke="currentColor" strokeWidth="1" fill="none" />
        </g>

        {/* Layer 4 (Clockwise Rotation) */}
        <g className="m-rotate-cw" style={speedStyle}>
          {slices64.map((_, i) => (
            <g key={`ray-${i}`} transform={`rotate(${i * 5.625}, 500, 500)`}>
              <line x1="500" y1="182" x2="500" y2="173" stroke="currentColor" strokeWidth="1" />
            </g>
          ))}

          <circle cx="500" cy="500" r="328" stroke="currentColor" strokeWidth="2" fill="none" />

          {slices32.map((_, i) => (
            <g key={`paisley-${i}`} transform={`rotate(${i * 11.25 + 5.625}, 500, 500)`}>
              <use href="#layer4-paisley" />
            </g>
          ))}

          <circle cx="500" cy="500" r="400" stroke="currentColor" strokeWidth="5" fill="none" />
          <circle cx="500" cy="500" r="408" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" fill="none" />
          <circle cx="500" cy="500" r="416" stroke="currentColor" strokeWidth="2" fill="none" />
        </g>

        {/* Outer Scroll Borders (Counter-Clockwise Rotation) */}
        <g className={counterRotate ? "m-rotate-ccw" : "m-rotate-cw"} style={speedStyle}>
          {slices32.map((_, i) => (
            <g key={`vine-${i}`} transform={`rotate(${i * 11.25}, 500, 500)`}>
              <use href="#outer-vine-scroll" />
            </g>
          ))}

          <circle cx="500" cy="500" r="472" stroke="currentColor" strokeWidth="3" fill="none" />
          <circle cx="500" cy="500" r="478" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 4" fill="none" />

          {slices128.map((_, i) => (
            <g key={`edge-dash-${i}`} transform={`rotate(${i * 2.8125}, 500, 500)`}>
              <line x1="500" y1="20" x2="500" y2="10" stroke="currentColor" strokeWidth="1.5" />
            </g>
          ))}

          <circle cx="500" cy="500" r="492" stroke="currentColor" strokeWidth="4" fill="none" />
        </g>
      </svg>
    </div>
  );
}