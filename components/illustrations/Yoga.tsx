"use client";

import React from "react";

export function YogaFigure({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`select-none pointer-events-none ${className}`}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Head */}
      <circle
        cx="150"
        cy="65"
        r="22"
        fill="#F47A20"
      />

      {/* Body */}
      <path
        d="M150 90C120 105 112 145 125 175"
        stroke="#7653A6"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Arms */}
      <path
        d="M130 112C100 130 78 125 55 105"
        stroke="#7653A6"
        strokeWidth="12"
        strokeLinecap="round"
      />

      <path
        d="M165 112C195 130 220 125 245 105"
        stroke="#7653A6"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Legs */}
      <path
        d="M130 165C105 195 82 210 55 218"
        stroke="#7653A6"
        strokeWidth="13"
        strokeLinecap="round"
      />

      <path
        d="M170 165C195 195 218 210 245 218"
        stroke="#7653A6"
        strokeWidth="13"
        strokeLinecap="round"
      />

      {/* Ground Line */}
      <path
        d="M45 230H255"
        stroke="#3F7D45"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
