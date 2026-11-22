"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   CornerAgarbatti — realistic spreading incense smoke
   • Canvas-based particle engine: each puff spawns, rises, drifts, expands
   • Turbulence field gives organic curling / spreading motion
   • Smoke color adapts dark ↔ light based on page background at that spot
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Simplex-like noise (fast 2D value noise for turbulence) ────────────────
function hash(n: number) {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}
function noise2(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix + iy * 57);
  const b = hash(ix + 1 + iy * 57);
  const c = hash(ix + (iy + 1) * 57);
  const d = hash(ix + 1 + (iy + 1) * 57);
  return a + (b - a) * ux + (c - a) * uy + (d - b - c + a) * ux * uy;
}

// ── Turbulence: stacked noise octaves give realistic smoke curl ─────────────
function turbulence(x: number, y: number, t: number): { vx: number; vy: number } {
  const scale = 0.008;
  const vx =
    // Bias slightly left (negative x) so smoke drifts away from right wall
    -0.3 +
    (noise2(x * scale + t * 0.3, y * scale) - 0.5) * 1.6 +
    (noise2(x * scale * 2 + t * 0.5, y * scale * 2 + 1.3) - 0.5) * 0.6;
  const vy =
    (noise2(x * scale + 1.7, y * scale + t * 0.2) - 0.5) * 0.8 +
    (noise2(x * scale * 2 + 2.1, y * scale * 2 + t * 0.4) - 0.5) * 0.3;
  return { vx, vy };
}

// ── Particle definition ─────────────────────────────────────────────────────
interface Particle {
  x: number;       // canvas x
  y: number;       // canvas y
  vx: number;      // velocity x
  vy: number;      // velocity y
  radius: number;  // current radius
  maxRadius: number;
  opacity: number;
  age: number;     // 0 → 1
  lifespan: number; // seconds
  born: number;    // timestamp (s)
  spin: number;    // slow angular drift for texture
}

// ── Detect if the background at canvas position is dark ────────────────────
function bgIsDarkAt(canvasEl: HTMLCanvasElement): boolean {
  try {
    const rect = canvasEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + 20; // near the ember
    let node = document.elementFromPoint(cx, cy) as Element | null;
    while (node && node !== canvasEl) {
      const bg = window.getComputedStyle(node).backgroundColor;
      if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (m) {
          const lum = 0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3];
          return lum < 128;
        }
      }
      node = node.parentElement;
    }
  } catch {}
  return false;
}

// ── Component ───────────────────────────────────────────────────────────────
export function CornerAgarbatti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastSpawnRef = useRef(0);
  const darkRef = useRef(false);
  const [ember, setEmber] = useState(1); // ember pulse 0–1

  // Canvas: tall so smoke rises freely without clipping; stick at right edge
  const W = 200;
  const H = 600;   // ← tall canvas: smoke rises ~400px before fully fading

  // Stick geometry — pinned to right side of canvas
  const STICK_X = W - 18;        // near right edge
  const STICK_BOTTOM = H - 16;   // base in holder
  const EMBER_Y = H - 210;       // ember position (from top)

  // ── Spawn one particle at the ember ──────────────────────────────────────
  const spawnParticle = useCallback((now: number) => {
    const lifespan = 5.0 + Math.random() * 3.5; // longer → rises higher before fading
    particlesRef.current.push({
      x: STICK_X + (Math.random() - 0.5) * 3,
      y: EMBER_Y - 2,
      vx: -(0.2 + Math.random() * 0.4),     // bias leftward (away from edge)
      vy: -(0.6 + Math.random() * 0.5),     // initial upward pull
      radius: 3 + Math.random() * 2,
      maxRadius: 50 + Math.random() * 60,   // wider spread at top
      opacity: 0,
      age: 0,
      lifespan,
      born: now,
      spin: (Math.random() - 0.5) * 0.008,
    });
  }, [EMBER_Y]);

  // ── Main animation loop ───────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // HiDPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    let startT = -1;
    let frame = 0;

    const draw = (timestamp: number) => {
      if (startT < 0) startT = timestamp;
      const t = (timestamp - startT) / 1000; // seconds
      const dt = Math.min(0.05, 1 / 60);     // clamped delta

      // Detect dark/light every 30 frames
      if (frame % 30 === 0) {
        darkRef.current = bgIsDarkAt(canvas);
      }
      frame++;

      // Clear
      ctx.clearRect(0, 0, W, H);

      // ── Draw ash tray / holder ─────────────────────────────────────────
      const grad = ctx.createLinearGradient(STICK_X - 20, STICK_BOTTOM, STICK_X + 20, STICK_BOTTOM);
      grad.addColorStop(0, "#A07820");
      grad.addColorStop(0.5, "#D4A84B");
      grad.addColorStop(1, "#A07820");
      ctx.beginPath();
      ctx.ellipse(STICK_X, STICK_BOTTOM + 6, 22, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      // Ash pile
      ctx.beginPath();
      ctx.ellipse(STICK_X, STICK_BOTTOM + 2, 10, 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(210,200,185,0.5)";
      ctx.fill();

      // ── Draw stick ────────────────────────────────────────────────────
      // Coated section (paste — lower half)
      const stickGradL = ctx.createLinearGradient(STICK_X - 2, 0, STICK_X + 2, 0);
      stickGradL.addColorStop(0, "#6B3A1F");
      stickGradL.addColorStop(0.5, "#9B5E3A");
      stickGradL.addColorStop(1, "#6B3A1F");
      ctx.beginPath();
      ctx.roundRect(STICK_X - 2, EMBER_Y + 20, 4, STICK_BOTTOM - EMBER_Y - 20, 2);
      ctx.fillStyle = stickGradL;
      ctx.fill();
      // Raw bamboo (upper thin section)
      const bambooGrad = ctx.createLinearGradient(STICK_X - 1.5, 0, STICK_X + 1.5, 0);
      bambooGrad.addColorStop(0, "#4A2808");
      bambooGrad.addColorStop(0.5, "#78350F");
      bambooGrad.addColorStop(1, "#4A2808");
      ctx.beginPath();
      ctx.roundRect(STICK_X - 1.5, EMBER_Y - 5, 3, 25, 1.5);
      ctx.fillStyle = bambooGrad;
      ctx.fill();

      // ── Ember glow ────────────────────────────────────────────────────
      const pulse = 0.75 + 0.25 * Math.sin(t * 3.1);
      // Outer diffuse glow
      const glowGrad = ctx.createRadialGradient(STICK_X, EMBER_Y, 0, STICK_X, EMBER_Y, 14 * pulse);
      glowGrad.addColorStop(0, `rgba(255,180,30,${0.6 * pulse})`);
      glowGrad.addColorStop(0.4, `rgba(255,100,0,${0.35 * pulse})`);
      glowGrad.addColorStop(1, "rgba(255,80,0,0)");
      ctx.beginPath();
      ctx.arc(STICK_X, EMBER_Y, 14 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();
      // Core
      ctx.beginPath();
      ctx.arc(STICK_X, EMBER_Y, 3 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = "#FFF176";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(STICK_X, EMBER_Y, 2 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      // Ash ring
      ctx.beginPath();
      ctx.arc(STICK_X, EMBER_Y, 5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(210,200,185,0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ── Spawn particles ────────────────────────────────────────────────
      if (t - lastSpawnRef.current > 0.22) {
        lastSpawnRef.current = t;
        spawnParticle(t);
        // Occasionally double-spawn for denser wisps
        if (Math.random() < 0.35) spawnParticle(t);
      }

      // ── Update & draw particles ────────────────────────────────────────
      const dark = darkRef.current;
      particlesRef.current = particlesRef.current.filter((p) => {
        p.age = (t - p.born) / p.lifespan;
        if (p.age >= 1) return false;

        // Turbulence force — increases with age (smoke spreads more as it rises)
        const spread = p.age * 2.5;
        const turb = turbulence(p.x, p.y, t);
        p.vx += turb.vx * spread * dt;
        p.vy += turb.vy * spread * dt;

        // Buoyancy / upward drift — weakens as smoke ages
        p.vy -= (0.35 - p.age * 0.25) * dt;

        // Gentle deceleration (air resistance)
        p.vx *= 0.985;
        p.vy *= 0.990;

        p.x += p.vx;
        p.y += p.vy;

        // Radius expands over lifetime (smoke diffuses)
        p.radius = p.radius + (p.maxRadius - p.radius) * 0.012;

        // Opacity: fade in fast → sustain → fade out gently
        const fadeIn = Math.min(1, p.age / 0.15);
        const fadeOut = p.age > 0.5 ? 1 - ((p.age - 0.5) / 0.5) : 1;
        const baseOpacity = dark ? 0.38 : 0.26;
        p.opacity = fadeIn * fadeOut * baseOpacity;

        // Draw as a soft radial gradient blob (looks like a real puff)
        const r = p.radius;
        const sg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);

        if (dark) {
          // White/grey smoke on dark backgrounds
          sg.addColorStop(0, `rgba(255,255,255,${p.opacity * 1.0})`);
          sg.addColorStop(0.4, `rgba(220,210,200,${p.opacity * 0.75})`);
          sg.addColorStop(0.75, `rgba(180,170,160,${p.opacity * 0.35})`);
          sg.addColorStop(1, `rgba(160,150,140,0)`);
        } else {
          // Warm grey-beige smoke on light backgrounds
          sg.addColorStop(0, `rgba(140,120,100,${p.opacity * 1.0})`);
          sg.addColorStop(0.4, `rgba(120,100,80,${p.opacity * 0.65})`);
          sg.addColorStop(0.75, `rgba(100,80,60,${p.opacity * 0.28})`);
          sg.addColorStop(1, `rgba(80,60,40,0)`);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = sg;
        ctx.fill();

        return true;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [spawnParticle]);

  // ── Dark/light check on scroll ─────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      if (canvasRef.current) darkRef.current = bgIsDarkAt(canvasRef.current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 right-0 z-40 pointer-events-none select-none"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          overflow: "visible",
        }}
      />
    </div>
  );
}
