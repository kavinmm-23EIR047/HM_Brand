"use client";

import React from "react";

export function Mandala({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`select-none pointer-events-none ${className}`}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="2">
        {/* Outer concentric circles */}
        <circle cx="200" cy="200" r="150" />
        <circle cx="200" cy="200" r="125" />
        <circle cx="200" cy="200" r="95" />

        {/* Outer lotus petals */}
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse
            key={i}
            cx="200"
            cy="65"
            rx="18"
            ry="55"
            transform={`rotate(${i * 30} 200 200)`}
          />
        ))}

        {/* Inner petals */}
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={`inner-${i}`}
            cx="200"
            cy="115"
            rx="12"
            ry="38"
            transform={`rotate(${i * 45} 200 200)`}
          />
        ))}

        <circle cx="200" cy="200" r="35" />

        {/* Central diamond star motif */}
        <path d="M200 170 L215 200 L200 230 L185 200 Z" fill="currentColor" fillOpacity="0.2" />

        <circle cx="200" cy="200" r="8" fill="currentColor" />
      </g>
    </svg>
  );
}
