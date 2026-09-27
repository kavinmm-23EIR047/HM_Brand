"use client";

import React from "react";

type MandalaMotifProps = {
  className?: string;
  size?: number;
  speed?: number;
  counterRotate?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  isRotating?: boolean;
  withDrawingEffect?: boolean;
  withGlow?: boolean;
};

/**
 * Exquisite Fine-Line Animated Mandala & Sacred Geometry Drawing
 * Features multi-tiered concentric rotating rings, intricate kolam lotus petals,
 * paisley filigree, sacred yantra stars, and dynamic stroke line-flow animations.
 */
export function MandalaMotif({
  className = "",
  size,
  speed = 120,
  counterRotate = true,
  strokeColor = "currentColor",
  strokeWidth = 1.5,
  isRotating = true,
  withDrawingEffect = true,
  withGlow = false,
}: MandalaMotifProps) {
  const rotationStyle: React.CSSProperties & { "--mandala-speed": string } = {
    "--mandala-speed": `${speed}s`,
    animationPlayState: isRotating ? "running" : "paused",
  };

  const svgStyle: React.CSSProperties = {
    color: strokeColor,
    strokeWidth,
    ...(size ? { width: size, height: size } : {}),
  };

  return (
    <svg
      className={`mandala-art pointer-events-none select-none ${withGlow ? "mandala-art-drawing" : ""} ${className}`}
      viewBox="0 0 1000 1000"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={svgStyle}
    >
      <defs>
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Outermost Filigree Ring & 32 Engraved Paisley Teardrop Petals */}
      <g className="mandala-rotate-outer" style={rotationStyle}>
        <circle cx="500" cy="500" r="492" strokeWidth="1" strokeDasharray="3 6" />
        <circle cx="500" cy="500" r="482" strokeWidth="1.8" />
        <circle cx="500" cy="500" r="472" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="500" cy="500" r="455" strokeDasharray="1 8" strokeWidth="1" />

        {Array.from({ length: 32 }, (_, i) => (
          <g key={`outer-petal-${i}`} transform={`rotate(${i * 11.25} 500 500)`}>
            {/* Outer Paisley Arch */}
            <path
              d="M500 24C472 50 470 86 500 118C530 86 528 50 500 24Z"
              className={withDrawingEffect ? "mandala-stroke-draw" : ""}
            />
            <path d="M500 38C482 60 484 84 500 104C516 84 518 60 500 38Z" strokeWidth="1" />
            <path d="M500 50C494 66 494 80 500 92M500 58C490 70 490 78 492 84M500 58C510 70 510 78 508 84" strokeWidth="1" />
            <circle cx="500" cy="68" r="3" fill="currentColor" stroke="none" />
            <circle cx="488" cy="74" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="512" cy="74" r="1.5" fill="currentColor" stroke="none" />
            {/* Outer Ring Accent Bead */}
            <circle cx="500" cy="18" r="2.5" fill="currentColor" stroke="none" />
          </g>
        ))}

        <circle cx="500" cy="500" r="432" strokeWidth="1.5" />
        <circle cx="500" cy="500" r="422" strokeDasharray="3 7" strokeWidth="1" />
      </g>

      {/* 2. Middle Sacred Geometry: 24-Point Dotted Kolam & Yantra Star Petals */}
      <g className={counterRotate ? "mandala-rotate-inner" : "mandala-rotate-outer"} style={rotationStyle}>
        <circle cx="500" cy="500" r="398" strokeWidth="1.6" />
        <circle cx="500" cy="500" r="388" strokeDasharray="2 6" strokeWidth="1" />

        {Array.from({ length: 24 }, (_, i) => (
          <g key={`mid-dot-petal-${i}`} transform={`rotate(${i * 15} 500 500)`}>
            <path
              d="M500 115C466 142 462 188 500 228C538 188 534 142 500 115Z"
              className={withDrawingEffect ? "mandala-stroke-draw" : ""}
            />
            <path d="M500 128C478 152 478 184 500 208C522 184 522 152 500 128Z" strokeWidth="1" />
            <path d="M500 140C484 160 486 180 500 196C514 180 516 160 500 140Z" strokeWidth="1" strokeDasharray="2 4" />
            {/* Kolam decorative dots */}
            <circle cx="500" cy="162" r="4" fill="currentColor" stroke="none" />
            <circle cx="488" cy="172" r="1.8" fill="currentColor" stroke="none" />
            <circle cx="512" cy="172" r="1.8" fill="currentColor" stroke="none" />
            <circle cx="500" cy="184" r="2" fill="currentColor" stroke="none" />
          </g>
        ))}

        <circle cx="500" cy="500" r="280" strokeWidth="1.5" />
        <circle cx="500" cy="500" r="268" strokeDasharray="2 8" strokeWidth="1" />

        {/* 3. 16 Broad Sacred Temple Lotus Petals with Hand-Drawn Veins */}
        {Array.from({ length: 16 }, (_, i) => (
          <g key={`wide-lotus-${i}`} transform={`rotate(${i * 22.5} 500 500)`}>
            <path
              d="M500 395C450 354 442 288 500 216C558 288 550 354 500 395Z"
              className={withDrawingEffect ? "mandala-stroke-draw" : ""}
            />
            <path d="M500 382C464 345 458 294 500 240C542 294 536 345 500 382Z" strokeWidth="1.2" />
            {/* Vein lines */}
            <path d="M500 382V242M500 350L474 298M500 350L526 298M500 324L482 282M500 324L518 282" strokeWidth="1" />
            <circle cx="500" cy="268" r="3.5" fill="currentColor" stroke="none" />
            <circle cx="486" cy="304" r="2" fill="currentColor" stroke="none" />
            <circle cx="514" cy="304" r="2" fill="currentColor" stroke="none" />
          </g>
        ))}

        <circle cx="500" cy="500" r="188" strokeWidth="1.5" />
        <circle cx="500" cy="500" r="176" strokeDasharray="3 6" strokeWidth="1" />
      </g>

      {/* 4. Central Radiant Sunburst Chakra & Sacred Bindu Seed */}
      <g className="mandala-center">
        {Array.from({ length: 16 }, (_, i) => (
          <g key={`sun-ray-${i}`} transform={`rotate(${i * 22.5} 500 500)`}>
            <path d="M500 435C476 410 478 376 500 342C522 376 524 410 500 435Z" strokeWidth="1.2" />
            <path d="M500 424C486 406 486 386 500 366C514 386 514 406 500 424Z" strokeWidth="1" />
            <path d="M500 416V374" strokeWidth="1" />
            <circle cx="500" cy="390" r="2.2" fill="currentColor" stroke="none" />
          </g>
        ))}

        {/* Concentric Center Rings */}
        <circle cx="500" cy="500" r="70" strokeWidth="1.5" />
        <circle cx="500" cy="500" r="56" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="500" cy="500" r="34" strokeWidth="1.5" />
        <circle cx="500" cy="500" r="14" fill="currentColor" stroke="none" />

        {/* 16 Golden Seed Dots */}
        {Array.from({ length: 16 }, (_, i) => (
          <circle
            key={`seed-dot-${i}`}
            cx="500"
            cy="446"
            r="2.5"
            fill="currentColor"
            stroke="none"
            transform={`rotate(${i * 22.5} 500 500)`}
          />
        ))}
      </g>
    </svg>
  );
}
