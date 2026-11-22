"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════════════════
   Real Agarbatti & Brass Chalice Stand with Living Smoke
   • Photorealistic South Indian brass agarbatti chalice with jasmine flowers
   • 3 authentic angled masala incense sticks with glowing red-orange embers
   • Canvas-based living smoke engine: gentle wisps curling into the room
   • Responsive & retina-ready, zero pointer-blocking (pointer-events: none)
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Value noise for realistic organic smoke curl ───────────────────────────
function hash(n: number) {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}

function noise2(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix + iy * 57), b = hash(ix + 1 + iy * 57);
  const c = hash(ix + (iy + 1) * 57), d = hash(ix + 1 + (iy + 1) * 57);
  return a + (b - a) * ux + (c - a) * uy + (d - b - c + a) * ux * uy;
}

function turbulence(x: number, y: number, t: number, bias: number) {
  const s = 0.008;
  return {
    vx:
      bias +
      (noise2(x * s + t * 0.28, y * s) - 0.5) * 1.35 +
      (noise2(x * s * 2 + t * 0.45, y * s * 2 + 1.3) - 0.5) * 0.45,
    vy:
      (noise2(x * s + 1.7, y * s + t * 0.2) - 0.5) * 0.65 +
      (noise2(x * s * 2 + 2.1, y * s * 2 + t * 0.3) - 0.5) * 0.2,
  };
}

// ── Background darkness detector ───────────────────────────────────────────
function bgIsDarkAt(el: HTMLElement): boolean {
  try {
    const rect = el.getBoundingClientRect();
    let node = document.elementFromPoint(rect.left + 20, rect.top + 20) as Element | null;
    while (node && node !== el) {
      const bg = window.getComputedStyle(node).backgroundColor;
      if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (m) return 0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3] < 128;
      }
      node = node.parentElement;
    }
  } catch {}
  return false;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  age: number;
  lifespan: number;
  born: number;
}

// 3 authentic sticks tips relative to image width (849) & height (789)
const STICK_TIPS = [
  { xRatio: 0.241, yRatio: 0.023, bias: 0.24, rate: 0.75 }, // Left stick (leans out left, smoke drifts right)
  { xRatio: 0.479, yRatio: 0.001, bias: 0.18, rate: 0.8 },  // Center stick (tallest)
  { xRatio: 0.744, yRatio: 0.024, bias: 0.14, rate: 0.7 },  // Right stick
];

export function LeftAgarbattis() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<SmokeParticle[][]>([[], [], []]);
  const rafRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number[]>([0, 0, 0]);
  const darkRef = useRef(false);
  const [standDims, setStandDims] = useState({ width: 125, height: 116 });

  // Update rendered image dimensions on mount and resize
  useEffect(() => {
    const updateSize = () => {
      const isMobile = window.innerWidth < 640;
      const w = isMobile ? 96 : 128;
      const h = Math.round(w * (789 / 849));
      setStandDims({ width: w, height: h });
    };

    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas dimensions: taller so smoke can curl and rise naturally
    const canvasW = 280;
    const canvasH = 500;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    canvas.style.width = `${canvasW}px`;
    canvas.style.height = `${canvasH}px`;
    ctx.scale(dpr, dpr);

    let startT = -1;
    let frame = 0;

    const draw = (timestamp: number) => {
      if (startT < 0) startT = timestamp;
      const t = (timestamp - startT) / 1000;

      if (frame % 45 === 0 && containerRef.current) {
        darkRef.current = bgIsDarkAt(containerRef.current);
      }
      frame++;

      ctx.clearRect(0, 0, canvasW, canvasH);

      const isDark = darkRef.current;
      const standLeft = 6;
      const standBottomY = canvasH;
      const standTopY = standBottomY - standDims.height;

      // ── Process each of the 3 sticks ──
      STICK_TIPS.forEach((stick, idx) => {
        const emberX = standLeft + standDims.width * stick.xRatio;
        const emberY = standTopY + standDims.height * stick.yRatio;

        // Subtle ember heartbeat pulse
        const pulse = 0.8 + 0.2 * Math.sin(t * 3.5 + idx * 1.8);

        // ── 1. Draw glowing ember at the tip ──
        const glowR = 5 * pulse;
        const glowGrad = ctx.createRadialGradient(emberX, emberY, 0, emberX, emberY, glowR);
        glowGrad.addColorStop(0, `rgba(255, 110, 20, ${0.85 * pulse})`);
        glowGrad.addColorStop(0.5, `rgba(255, 60, 0, ${0.4 * pulse})`);
        glowGrad.addColorStop(1, "rgba(255, 50, 0, 0)");

        ctx.beginPath();
        ctx.arc(emberX, emberY, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Hot ember core
        ctx.beginPath();
        ctx.arc(emberX, emberY, 1.4 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = "#FFF9C4";
        ctx.fill();

        // ── 2. Spawn live smoke wisps ──
        const spawnInterval = 0.42 / stick.rate;
        if (t - lastSpawnRef.current[idx] > spawnInterval) {
          lastSpawnRef.current[idx] = t;
          particlesRef.current[idx].push({
            x: emberX + (Math.random() - 0.5) * 1.8,
            y: emberY - 2,
            vx: stick.bias * 0.35 + (Math.random() - 0.5) * 0.25,
            vy: -(0.55 + Math.random() * 0.35),
            radius: 2.2 + Math.random() * 1.2,
            maxRadius: 36 + Math.random() * 45,
            opacity: 0,
            age: 0,
            lifespan: 5.2 + Math.random() * 3.0,
            born: t,
          });
        }

        // ── 3. Update & render smoke particles ──
        particlesRef.current[idx] = particlesRef.current[idx].filter((p) => {
          p.age = (t - p.born) / p.lifespan;
          if (p.age >= 1) return false;

          const spread = p.age * 2.0;
          const turb = turbulence(p.x, p.y, t + idx * 5, stick.bias);
          p.vx += turb.vx * spread * (1 / 60);
          p.vy += turb.vy * spread * (1 / 60);
          p.vy -= (0.24 - p.age * 0.16) * (1 / 60); // gentle natural buoyancy
          p.vx *= 0.988;
          p.vy *= 0.992;
          p.x += p.vx;
          p.y += p.vy;
          p.radius += (p.maxRadius - p.radius) * 0.013;

          const fadeIn = Math.min(1, p.age / 0.18);
          const fadeOut = p.age > 0.35 ? Math.max(0, 1 - (p.age - 0.35) / 0.65) : 1;
          const baseAlpha = isDark ? 0.22 : 0.14;
          p.opacity = fadeIn * fadeOut * baseAlpha;

          const r = p.radius;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);

          if (isDark) {
            // Ethereal white sacred mist on dark surfaces
            grad.addColorStop(0, `rgba(248, 246, 242, ${p.opacity})`);
            grad.addColorStop(0.35, `rgba(235, 232, 226, ${p.opacity * 0.65})`);
            grad.addColorStop(0.7, `rgba(215, 210, 204, ${p.opacity * 0.2})`);
            grad.addColorStop(1, "rgba(200, 195, 190, 0)");
          } else {
            // Natural soft incense mist for light backgrounds
            grad.addColorStop(0, `rgba(165, 160, 155, ${p.opacity})`);
            grad.addColorStop(0.35, `rgba(185, 180, 175, ${p.opacity * 0.6})`);
            grad.addColorStop(0.7, `rgba(205, 200, 195, ${p.opacity * 0.2})`);
            grad.addColorStop(1, "rgba(220, 215, 210, 0)");
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          return true;
        });
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [standDims]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-[4.85rem] md:bottom-2 left-1 md:left-2 z-30 pointer-events-none select-none overflow-visible transition-all duration-300"
      aria-hidden="true"
    >
      {/* Dynamic smoke & glowing tip canvas overlay */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none overflow-visible"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      />

      {/* Photorealistic South Indian brass agarbatti chalice & sticks */}
      <div
        className="relative pointer-events-none transition-all duration-300"
        style={{
          width: standDims.width,
          height: standDims.height,
          marginLeft: "6px",
          marginBottom: "-2px",
          filter: "drop-shadow(0 6px 14px rgba(48, 41, 35, 0.18))",
        }}
      >
        <Image
          src="/images/real_agarbatti_stand.png"
          alt="HM Sacred Agarbattis with Traditional Brass Stand"
          width={849}
          height={789}
          priority
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
    </div>
  );
}
