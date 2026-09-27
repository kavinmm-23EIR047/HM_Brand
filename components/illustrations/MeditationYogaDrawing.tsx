"use client";

import React from "react";

interface MeditationYogaDrawingProps {
  className?: string;
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
  glow?: boolean;
}

/**
 * Serene Meditation, Yoga & Divine Virtue Vector Drawing
 * Features a peaceful yogi in Padmasana (Lotus Pose), radiant Sahasrara halo,
 * 7 glowing spinal chakras, blooming sacred lotus foundation, and gentle incense spirals.
 */
export function MeditationYogaDrawing({
  className = "",
  size,
  strokeColor = "#F6C84C",
  strokeWidth = 1.5,
  glow = true,
}: MeditationYogaDrawingProps) {
  const svgStyle: React.CSSProperties = {
    color: strokeColor,
    strokeWidth,
    ...(size ? { width: size, height: size } : {}),
  };

  return (
    <svg
      className={`select-none pointer-events-none ${glow ? "mandala-art-drawing" : ""} ${className}`}
      viewBox="0 0 500 500"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={svgStyle}
    >
      <defs>
        <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F6C84C" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#F47A20" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#F6C84C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Radiant Sahasrara Aura / Halo Behind Head */}
      <circle cx="250" cy="150" r="90" fill="url(#haloGlow)" stroke="none" />
      <circle cx="250" cy="150" r="80" strokeWidth="1" strokeDasharray="3 6" opacity="0.6" />
      <circle cx="250" cy="150" r="65" strokeWidth="1.2" opacity="0.8" />
      
      {/* Halo Sunburst Rays (12 Rays of Light) */}
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={`ray-${i}`}
          x1="250"
          y1="70"
          x2="250"
          y2="55"
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${i * 30} 250 150)`}
          opacity="0.8"
        />
      ))}

      {/* 2. Meditating Yogi Outline (Pure Sacred Line Art) */}
      {/* Head & Usnisha/Topknot */}
      <circle cx="250" cy="142" r="28" strokeWidth="1.8" />
      <path d="M242 116C242 108 258 108 258 116Z" fill="currentColor" stroke="none" />
      {/* Calm Face Profile / Third Eye Point */}
      <circle cx="250" cy="136" r="2" fill="currentColor" stroke="none" />
      <path d="M242 144C246 148 254 148 258 144" strokeWidth="1" strokeLinecap="round" />

      {/* Neck & Shoulders */}
      <path d="M243 170V182C243 186 230 192 210 198C185 205 160 220 155 250" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M257 170V182C257 186 270 192 290 198C315 205 340 220 345 250" strokeWidth="1.8" strokeLinecap="round" />

      {/* Arms in Chin Mudra / Dhyana Mudra Resting on Knees */}
      {/* Left Arm */}
      <path d="M155 250C150 280 145 310 130 330C120 345 105 350 95 345C85 340 90 325 110 320" strokeWidth="1.8" strokeLinecap="round" />
      {/* Left Hand Chin Mudra Circle */}
      <circle cx="100" cy="335" r="5" strokeWidth="1.2" />
      
      {/* Right Arm */}
      <path d="M345 250C350 280 355 310 370 330C380 345 395 350 405 345C415 340 410 325 390 320" strokeWidth="1.8" strokeLinecap="round" />
      {/* Right Hand Chin Mudra Circle */}
      <circle cx="400" cy="335" r="5" strokeWidth="1.2" />

      {/* Torso & Spine Line */}
      <path d="M210 198C215 240 218 290 225 330" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M290 198C285 240 282 290 275 330" strokeWidth="1.5" strokeLinecap="round" />
      {/* Central Prana / Sushumna Channel */}
      <path d="M250 170V355" strokeWidth="1" strokeDasharray="2 5" opacity="0.6" />

      {/* Crossed Legs in Full Lotus Posture (Padmasana) */}
      <path d="M110 330C130 365 190 380 250 380C310 380 370 365 390 330" strokeWidth="2" strokeLinecap="round" />
      <path d="M130 330C170 340 220 355 250 355C280 355 330 340 370 330" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M170 345C190 365 220 370 250 370C280 370 310 365 330 345" strokeWidth="1.4" strokeLinecap="round" />

      {/* 3. Seven Glowing Energy Chakras Along Central Spine */}
      {/* Sahasrara (Crown) */}
      <circle cx="250" cy="115" r="4" fill="#F6C84C" stroke="none" className="animate-pulse" />
      {/* Ajna (Third Eye) */}
      <circle cx="250" cy="136" r="3" fill="#FFE180" stroke="none" />
      {/* Vishuddha (Throat) */}
      <circle cx="250" cy="178" r="3" fill="#F6C84C" stroke="none" />
      {/* Anahata (Heart - Glowing Divine Virtue) */}
      <circle cx="250" cy="225" r="5" fill="#F47A20" stroke="#F6C84C" strokeWidth="1.5" className="animate-pulse" />
      {/* Manipura (Solar Plexus) */}
      <circle cx="250" cy="265" r="3.5" fill="#F6C84C" stroke="none" />
      {/* Svadhisthana (Sacral) */}
      <circle cx="250" cy="305" r="3" fill="#F47A20" stroke="none" />
      {/* Muladhara (Root) */}
      <circle cx="250" cy="350" r="4" fill="#E85D04" stroke="none" />

      {/* 4. Sacred Blooming Lotus Seat (Foundation) */}
      <g opacity="0.9">
        {/* Center Petal */}
        <path d="M250 380C235 410 240 435 250 445C260 435 265 410 250 380Z" strokeWidth="1.5" />
        {/* Left Lotus Petals */}
        <path d="M240 385C210 405 190 425 180 440C205 442 230 425 242 398" strokeWidth="1.5" />
        <path d="M225 390C175 405 140 425 120 440C150 448 190 435 215 405" strokeWidth="1.5" />
        <path d="M210 395C150 405 100 420 70 435C105 450 155 445 190 415" strokeWidth="1.2" />
        
        {/* Right Lotus Petals */}
        <path d="M260 385C290 405 310 425 320 440C295 442 270 425 258 398" strokeWidth="1.5" />
        <path d="M275 390C325 405 360 425 380 440C350 448 310 435 285 405" strokeWidth="1.5" />
        <path d="M290 395C350 405 400 420 430 435C395 450 345 445 310 415" strokeWidth="1.2" />

        {/* Lotus Base Ring & Droplets */}
        <path d="M120 445C200 465 300 465 380 445" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="250" cy="458" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="200" cy="455" r="2" fill="currentColor" stroke="none" />
        <circle cx="300" cy="455" r="2" fill="currentColor" stroke="none" />
      </g>

      {/* 5. Swirling Aromatic Incense Smoke Ribbons (Floating from Left/Right) */}
      <path
        d="M80 410C75 360 100 320 85 270C70 220 90 170 80 120"
        strokeWidth="1.2"
        strokeDasharray="4 6"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M420 410C425 360 400 320 415 270C430 220 410 170 420 120"
        strokeWidth="1.2"
        strokeDasharray="4 6"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
