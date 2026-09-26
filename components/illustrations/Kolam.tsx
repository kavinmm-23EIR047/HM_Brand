"use client";

import React from "react";

export function Kolam({
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
      <g
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M150 25C110 65 110 100 150 150C190 100 190 65 150 25Z" />
        <path d="M25 150C65 110 100 110 150 150C100 190 65 190 25 150Z" />
        <path d="M150 275C190 235 190 200 150 150C110 200 110 235 150 275Z" />
        <path d="M275 150C235 190 200 190 150 150C200 110 235 110 275 150Z" />

        <circle cx="150" cy="150" r="18" fill="currentColor" fillOpacity="0.1" />

        <circle cx="75" cy="75" r="8" fill="currentColor" fillOpacity="0.3" />
        <circle cx="225" cy="75" r="8" fill="currentColor" fillOpacity="0.3" />
        <circle cx="75" cy="225" r="8" fill="currentColor" fillOpacity="0.3" />
        <circle cx="225" cy="225" r="8" fill="currentColor" fillOpacity="0.3" />
      </g>
    </svg>
  );
}
