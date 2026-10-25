"use client";

import React from "react";

export function Leaf({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`select-none pointer-events-none ${className}`}
      viewBox="0 0 180 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M90 205C88 145 91 75 120 20"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <path
        d="M91 145C55 145 25 124 20 91C55 84 85 101 91 145Z"
        fill="currentColor"
      />

      <path
        d="M91 115C110 80 139 65 166 70C160 105 132 124 91 115Z"
        fill="currentColor"
      />

      <path
        d="M90 80C62 72 44 51 45 27C73 30 89 48 90 80Z"
        fill="currentColor"
      />
    </svg>
  );
}
