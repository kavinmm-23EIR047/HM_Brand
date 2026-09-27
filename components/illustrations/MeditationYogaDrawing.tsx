"use client";

import React from "react";

interface MeditationYogaDrawingProps {
  className?: string;
  size?: number;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  withGlow?: boolean;
}

/**
 * Elegant Sacred Yoga & Meditation Lotus Silhouette Drawing
 * Recreated to match the exact Padmasana silhouette with radiating lotus crown halo.
 */
export function MeditationYogaDrawing({
  className = "",
  size,
  strokeColor = "#F6C84C",
  fillColor = "#F6C84C",
  strokeWidth = 1.5,
  withGlow = false,
}: MeditationYogaDrawingProps) {
  const svgStyle: React.CSSProperties = {
    color: strokeColor,
    ...(size ? { width: size, height: size } : {}),
  };

  return (
    <svg
      className={`select-none pointer-events-none transition-all duration-700 ${withGlow ? "drop-shadow-[0_0_25px_rgba(246,200,76,0.4)]" : ""} ${className}`}
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={svgStyle}
    >
      <defs>
        {/* Subtle Shimmering Sacred Gold Gradient */}
        <linearGradient id="sacredGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="50%" stopColor="#F6C84C" />
          <stop offset="100%" stopColor="#E5A817" />
        </linearGradient>
      </defs>

      <g fill={fillColor === "url(#sacredGoldGrad)" ? "url(#sacredGoldGrad)" : fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        
        {/* ========================================================================= */}
        {/* 1. RADIANT LOTUS PETAL HALO CROWN (SACRED 7-PETAL BLADES & ACCENTS)       */}
        {/* ========================================================================= */}
        
        {/* Top Central Majestic Lotus Petal (Vertical Flame) */}
        <path d="M300,50 C265,115 270,175 292,215 C280,165 285,110 300,50 Z" />
        <path d="M300,50 C335,115 330,175 308,215 C320,165 315,110 300,50 Z" />

        {/* Upper Left Petal Crescent */}
        <path d="M220,175 C160,215 170,270 230,285 C185,255 190,215 220,175 Z" />

        {/* Upper Right Petal Crescent */}
        <path d="M380,175 C440,215 430,270 370,285 C415,255 410,215 380,175 Z" />

        {/* Mid-Left Wide Horizontal Petal */}
        <path d="M85,315 C135,280 215,295 255,335 C195,315 135,325 85,315 Z" />

        {/* Mid-Right Wide Horizontal Petal */}
        <path d="M515,315 C465,280 385,295 345,335 C405,315 465,325 515,315 Z" />

        {/* Floating Accent Petals (Nestled between radiating blades) */}
        {/* Top-Left Accent 1 */}
        <path d="M215,145 C235,160 240,185 225,195 C210,185 205,165 215,145 Z" />
        {/* Top-Right Accent 2 */}
        <path d="M385,145 C395,165 390,185 375,195 C360,185 365,160 385,145 Z" />
        
        {/* Upper-Center-Left Accent 3 */}
        <path d="M245,115 C260,130 260,150 248,160 C238,150 238,130 245,115 Z" />
        {/* Upper-Center-Right Accent 4 */}
        <path d="M355,115 C362,130 362,150 352,160 C340,150 340,130 355,115 Z" />

        {/* Mid-Flank Left Accent 5 */}
        <path d="M205,365 C220,380 220,398 208,408 C195,398 195,380 205,365 Z" />
        {/* Mid-Flank Right Accent 6 */}
        <path d="M395,365 C405,380 405,398 392,408 C380,398 380,380 395,365 Z" />

        {/* ========================================================================= */}
        {/* 2. MEDITATING YOGI IN PADMASANA (AUTHENTIC SILHOUETTE)                     */}
        {/* ========================================================================= */}
        
        {/* Topknot Hair Bun */}
        <circle cx="300" cy="245" r="14" />

        {/* Head & Neck Profile */}
        <path d="M300,248 C318,248 327,260 327,280 C327,302 318,318 300,318 C282,318 273,302 273,280 C273,260 282,248 300,248 Z" />

        {/* Shoulders, Arms, Mudra Hands & Upper Body Contours */}
        <path
          d="M290,317 C280,323 260,332 245,340 C220,352 205,372 195,400 C185,428 170,455 152,472 
             C145,478 138,475 136,465 C134,455 142,448 152,442 C165,432 178,415 186,390 
             C196,360 215,342 245,330 C265,322 280,318 290,317 Z"
        />
        <path
          d="M310,317 C320,323 340,332 355,340 C380,352 395,372 405,400 C415,428 430,455 448,472 
             C455,478 462,475 464,465 C466,455 458,448 448,442 C435,432 422,415 414,390 
             C404,360 385,342 355,330 C335,322 320,318 310,317 Z"
        />

        {/* Torso Spine & Folded Legs */}
        <path
          d="M285,318 C285,350 280,390 270,430 L260,435 C215,450 170,480 190,510 
             C210,528 260,535 300,535 C340,535 390,528 410,510 C430,480 385,450 340,435 
             L330,430 C320,390 315,350 315,318 Z"
        />

        {/* Sculpted Cross-Legged Lotus Base */}
        <path
          d="M165,480 C152,495 170,515 210,525 C255,535 345,535 390,525 
             C430,515 448,495 435,480 C415,460 375,450 300,450 C225,450 185,460 165,480 Z"
        />

        {/* Left Gyan/Chin Mudra Ring */}
        <circle cx="146" cy="468" r="6" />

        {/* Right Gyan/Chin Mudra Ring */}
        <circle cx="454" cy="468" r="6" />

        {/* Crossed Feet Outlines */}
        <path d="M228,520 C250,528 285,532 300,526 C288,518 250,514 228,520 Z" />
        <path d="M372,520 C350,528 315,532 300,526 C312,518 350,514 372,520 Z" />

      </g>
    </svg>
  );
}
