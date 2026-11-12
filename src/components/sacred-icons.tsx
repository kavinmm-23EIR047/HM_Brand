import React from "react";

interface IconProps {
  className?: string;
}

/** Fluted brass diya with teardrop sacred flame (solid fills, zero gradients). */
export function SacredDiyaSvg({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {/* Sacred flame outer & inner */}
      <path
        d="M12 2.5C10.2 5.1 9.5 7.2 9.5 8.8C9.5 10.3 10.6 11.4 12 11.4C13.4 11.4 14.5 10.3 14.5 8.8C14.5 7.2 13.8 5.1 12 2.5Z"
        fill="#F47A20"
      />
      <path
        d="M12 5.4C11.1 6.8 10.8 7.9 10.8 8.7C10.8 9.5 11.3 10.1 12 10.1C12.7 10.1 13.2 9.5 13.2 8.7C13.2 7.9 12.9 6.8 12 5.4Z"
        fill="#FDE68A"
      />
      {/* Brass lamp bowl */}
      <path
        d="M3.5 13.5C3.5 17 7.1 19 12 19C16.9 19 20.5 17 20.5 13.5H3.5Z"
        fill="#C89B3C"
        stroke="#6B4226"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Lamp pedestal */}
      <path
        d="M8.5 19H15.5L16.5 21.5H7.5L8.5 19Z"
        fill="#9E1830"
        stroke="#6B4226"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Layered sacred lotus flower emblem with botanical calyx leaves. */
export function SacredLotusSvg({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {/* Center petal */}
      <path
        d="M12 3.5C9.9 6.7 9.4 10.7 12 14.5C14.6 10.7 14.1 6.7 12 3.5Z"
        fill="#9E1830"
      />
      {/* Mid petals */}
      <path
        d="M11.1 14.5C7.1 12.7 5.5 9.6 6.3 6.8C8.8 7.8 10.4 10.7 11.1 14.5Z"
        fill="#D95369"
      />
      <path
        d="M12.9 14.5C16.9 12.7 18.5 9.6 17.7 6.8C15.2 7.8 13.6 10.7 12.9 14.5Z"
        fill="#D95369"
      />
      {/* Outer petals */}
      <path
        d="M11.3 15.2C6.8 15.8 4 14 2.8 11.2C5.9 10.8 8.9 12.3 11.3 15.2Z"
        fill="#F47A20"
      />
      <path
        d="M12.7 15.2C17.2 15.8 20 14 21.2 11.2C18.1 10.8 15.1 12.3 12.7 15.2Z"
        fill="#F47A20"
      />
      {/* Green lotus base */}
      <path
        d="M5.5 17.8C9.2 19.6 14.8 19.6 18.5 17.8"
        stroke="#287541"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Crisp Indian tricolor ribbon mark for Made-in-India / origin badges. */
export function IndiaTricolorMarkSvg({ className = "h-3.5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 rounded-[2px] border border-black/15 ${className}`}
    >
      <rect width="24" height="5.34" y="0" fill="#FF9933" />
      <rect width="24" height="5.32" y="5.34" fill="#FFFFFF" />
      <rect width="24" height="5.34" y="10.66" fill="#138808" />
      <circle cx="12" cy="8" r="2.1" stroke="#000080" strokeWidth="0.9" fill="none" />
      <circle cx="12" cy="8" r="0.6" fill="#000080" />
    </svg>
  );
}

/** Twin tulsi botanical leaves with central midrib veins. */
export function SacredBotanicalSvg({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M12 20V10"
        stroke="#287541"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 14.5C7 14.5 4.2 11 4.5 6.2C8.8 6 12 8.7 12 14.5Z"
        fill="#3F7D45"
      />
      <path
        d="M12 11.8C12 6.8 15 4 19.5 4.2C19.8 8.8 16.9 11.8 12 11.8Z"
        fill="#287541"
      />
    </svg>
  );
}

/** Cupped artisan hands cradling pure heart flame for family wellbeing badges. */
export function PureHeartCuppedSvg({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M12 12.2C12 12.2 8.5 9.9 8.5 7.4C8.5 6.1 9.5 5 10.7 5C11.4 5 12 5.4 12 6C12 5.4 12.6 5 13.3 5C14.5 5 15.5 6.1 15.5 7.4C15.5 9.9 12 12.2 12 12.2Z"
        fill="#9E1830"
      />
      <path
        d="M4.5 14.5C6.2 14.5 7.5 15.7 9 16.8C10.5 17.8 13.5 17.8 15 16.8C16.5 15.7 17.8 14.5 19.5 14.5C20.2 14.5 20.8 15.1 20.6 15.9C19.9 18.6 16.5 20.5 12 20.5C7.5 20.5 4.1 18.6 3.4 15.9C3.2 15.1 3.8 14.5 4.5 14.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Sovereign kalash crest icon for bestseller highlights. */
export function KalashCrownSvg({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M3.5 17.5L5.2 8.2L9.5 12L12 6L14.5 12L18.8 8.2L20.5 17.5H3.5Z"
        fill="#F6C84C"
        stroke="#B45309"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect x="4" y="19" width="16" height="2" rx="1" fill="#B45309" />
    </svg>
  );
}

/** Clean flame icon for trending badges and camphor lighting cues. */
export function AromaFlameSvg({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M12.5 2.5C12.5 2.5 17.5 7.1 17.5 13C17.5 16.8 14.9 19.8 12 19.8C9.1 19.8 6.5 16.8 6.5 13C6.5 10.6 7.7 8.4 9.1 6.9C9.3 8.5 10.3 9.7 11.4 9.7C11.1 7.1 12.5 2.5 12.5 2.5Z"
        fill="#9E1830"
      />
      <path
        d="M12 12.2C10.9 13.7 10.4 15.1 10.4 16.3C10.4 17.5 11.1 18.4 12 18.4C12.9 18.4 13.6 17.5 13.6 16.3C13.6 15.1 13.1 13.7 12 12.2Z"
        fill="#FDE68A"
      />
    </svg>
  );
}

/** 8-petal temple flower emblem for gentle, chemical-free home badges. */
export function JasmineBloomSvg({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <circle cx="12" cy="5.5" r="2.6" fill="#D95369" />
      <circle cx="12" cy="18.5" r="2.6" fill="#D95369" />
      <circle cx="5.5" cy="12" r="2.6" fill="#D95369" />
      <circle cx="18.5" cy="12" r="2.6" fill="#D95369" />
      <circle cx="7.4" cy="7.4" r="2.3" fill="#F47A20" />
      <circle cx="16.6" cy="7.4" r="2.3" fill="#F47A20" />
      <circle cx="7.4" cy="16.6" r="2.3" fill="#F47A20" />
      <circle cx="16.6" cy="16.6" r="2.3" fill="#F47A20" />
      <circle cx="12" cy="12" r="3" fill="#F6C84C" stroke="#9E1830" strokeWidth="1.2" />
    </svg>
  );
}

/** 4-point editorial diamond sparkle SVG (replaces raw Unicode star characters). */
export function EditorialStarSvg({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d="M10 1L12.1 7.9L19 10L12.1 12.1L10 19L7.9 12.1L1 10L7.9 7.9L10 1Z" />
    </svg>
  );
}

