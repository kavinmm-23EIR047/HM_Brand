import React from "react";

type MandalaMotifProps = {
  className?: string;
  size?: number;
  speed?: number;
  counterRotate?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  isRotating?: boolean;
};

/** Fine-line, kolam-inspired mandala built from repeatable SVG petal rings. */
export function MandalaMotif({
  className = "",
  size,
  speed = 180,
  counterRotate = true,
  strokeColor = "currentColor",
  strokeWidth = 1.6,
  isRotating = true,
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
      className={`mandala-art pointer-events-none select-none ${className}`}
      viewBox="0 0 1000 1000"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={svgStyle}
    >
      {/* Outer fine ring and engraved paisley leaves */}
      <g className="mandala-rotate-outer" style={rotationStyle}>
        <circle cx="500" cy="500" r="488" />
        <circle cx="500" cy="500" r="478" strokeWidth="1" />
        <circle cx="500" cy="500" r="455" strokeDasharray="1 10" strokeWidth="1" />
        {Array.from({ length: 32 }, (_, i) => (
          <g key={`outer-leaf-${i}`} transform={`rotate(${i * 11.25} 500 500)`}>
            <path d="M500 31C476 53 474 82 500 111C526 82 524 53 500 31Z" />
            <path d="M500 42C486 62 487 82 500 98C513 82 514 62 500 42Z" strokeWidth="1" />
            <path d="M500 51C495 65 495 78 500 89M500 58C492 68 492 76 493 81M500 58C508 68 508 76 507 81" strokeWidth="1" />
            <circle cx="500" cy="68" r="3" fill="currentColor" stroke="none" />
            <circle cx="490" cy="71" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="510" cy="71" r="1.5" fill="currentColor" stroke="none" />
          </g>
        ))}
        <circle cx="500" cy="500" r="430" />
        <circle cx="500" cy="500" r="421" strokeDasharray="2 8" strokeWidth="1" />
      </g>

      {/* Dotted teardrop ring */}
      <g className={counterRotate ? "mandala-rotate-inner" : "mandala-rotate-outer"} style={rotationStyle}>
        <circle cx="500" cy="500" r="398" />
        {Array.from({ length: 24 }, (_, i) => (
          <g key={`dot-petal-${i}`} transform={`rotate(${i * 15} 500 500)`}>
            <path d="M500 115C470 139 467 181 500 216C533 181 530 139 500 115Z" />
            <path d="M500 126C480 148 480 177 500 198C520 177 520 148 500 126Z" strokeWidth="1" />
            <path d="M500 136C486 154 487 173 500 188C513 173 514 154 500 136Z" strokeWidth="1" strokeDasharray="1 4" />
            <circle cx="500" cy="159" r="4" fill="currentColor" stroke="none" />
            <circle cx="491" cy="166" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="509" cy="166" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="500" cy="177" r="1.5" fill="currentColor" stroke="none" />
          </g>
        ))}
        <circle cx="500" cy="500" r="278" />
        <circle cx="500" cy="500" r="267" strokeDasharray="1 9" strokeWidth="1" />

        {/* Broad lotus ring with fine veins */}
        {Array.from({ length: 16 }, (_, i) => (
          <g key={`wide-petal-${i}`} transform={`rotate(${i * 22.5} 500 500)`}>
            <path d="M500 390C455 352 447 290 500 222C553 290 545 352 500 390Z" />
            <path d="M500 378C468 343 462 295 500 244C538 295 532 343 500 378Z" strokeWidth="1" />
            <path d="M500 378V246M500 348 477 300M500 348l23-48M500 325l-16-35M500 325l16-35" strokeWidth="1" />
            <circle cx="500" cy="272" r="3" fill="currentColor" stroke="none" />
            <circle cx="488" cy="306" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="512" cy="306" r="1.6" fill="currentColor" stroke="none" />
          </g>
        ))}
        <circle cx="500" cy="500" r="185" />
        <circle cx="500" cy="500" r="174" strokeDasharray="2 7" strokeWidth="1" />
      </g>

      {/* Central sunburst and seed details */}
      <g className="mandala-center">
        {Array.from({ length: 16 }, (_, i) => (
          <g key={`sun-petal-${i}`} transform={`rotate(${i * 22.5} 500 500)`}>
            <path d="M500 431C478 407 479 377 500 345C521 377 522 407 500 431Z" />
            <path d="M500 421C489 404 489 386 500 369C511 386 511 404 500 421Z" strokeWidth="1" />
            <path d="M500 415V376" strokeWidth="1" />
            <circle cx="500" cy="391" r="2" fill="currentColor" stroke="none" />
          </g>
        ))}
        <circle cx="500" cy="500" r="67" />
        <circle cx="500" cy="500" r="53" strokeWidth="1" />
        <circle cx="500" cy="500" r="30" />
        <circle cx="500" cy="500" r="11" fill="currentColor" stroke="none" />
        {Array.from({ length: 16 }, (_, i) => (
          <circle key={`seed-${i}`} cx="500" cy="442" r="2" fill="currentColor" stroke="none" transform={`rotate(${i * 22.5} 500 500)`} />
        ))}
      </g>
    </svg>
  );
}
