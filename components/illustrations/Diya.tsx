"use client";

import React from "react";

export function Diya({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`select-none pointer-events-none ${className}`}
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Glow */}
      <circle
        cx="120"
        cy="82"
        r="55"
        fill="#F6C84C"
        opacity="0.25"
      />

      {/* Flame Outer */}
      <path
        d="M120 18C95 43 101 62 120 76C139 62 145 43 120 18Z"
        fill="#F47A20"
      />

      {/* Flame Inner */}
      <path
        d="M120 36C109 50 113 59 120 65C127 59 131 50 120 36Z"
        fill="#F6C84C"
      />

      {/* Diya Base Solid */}
      <path
        d="M55 105C70 143 170 143 185 105H55Z"
        fill="#9E1830"
      />

      {/* Diya Rim */}
      <ellipse
        cx="120"
        cy="105"
        rx="66"
        ry="20"
        fill="#F47A20"
      />
    </svg>
  );
}
