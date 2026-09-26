"use client";

import React from "react";

export function IncenseSmoke({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`select-none pointer-events-none ${className}`}
      viewBox="0 0 120 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Incense Stick Base */}
      <line x1="60" y1="280" x2="60" y2="180" stroke="#9E1830" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="180" r="3" fill="#F47A20" className="animate-pulse" />

      {/* Floating Smoke Swirls */}
      <path
        d="M60 175 C40 140 80 120 50 80 C30 50 70 30 60 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="6 4"
        className="animate-smoke"
      />
      <path
        d="M60 175 C75 145 45 125 65 90 C80 65 55 35 62 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

export function Temple({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`select-none pointer-events-none ${className}`}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Kalash Top */}
        <circle cx="100" cy="20" r="5" fill="currentColor" />
        <path d="M95 30 L105 30 L100 25 Z" fill="currentColor" />

        {/* Tier 1 */}
        <path d="M85 30 L115 30 L120 50 L80 50 Z" />
        <circle cx="100" cy="40" r="3" fill="currentColor" />

        {/* Tier 2 */}
        <path d="M75 50 L125 50 L135 80 L65 80 Z" />
        <rect x="88" y="58" width="10" height="15" rx="2" fill="currentColor" fillOpacity="0.2" />
        <rect x="102" y="58" width="10" height="15" rx="2" fill="currentColor" fillOpacity="0.2" />

        {/* Tier 3 Sanctum */}
        <path d="M55 80 L145 80 L155 130 L45 130 Z" />
        <line x1="75" y1="80" x2="75" y2="130" />
        <line x1="125" y1="80" x2="125" y2="130" />

        {/* Base Pillars & Arch */}
        <rect x="35" y="130" width="130" height="50" rx="3" />
        <path d="M80 180 L80 145 C80 135 120 135 120 145 L120 180 Z" fill="currentColor" fillOpacity="0.1" />

        {/* Ground Line */}
        <line x1="20" y1="180" x2="180" y2="180" strokeWidth="3" />
      </g>
    </svg>
  );
}
