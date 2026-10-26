'use client';

import { useEffect, useRef } from 'react';

/**
 * Ordered 8×8 Bayer matrix — the threshold map behind the dither.
 * Every value 0–63 appears exactly once.
 */
const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60,
  28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47,
  7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
];

/** Edge length of one rendered cell, in CSS pixels. */
const CELL = 3;

interface Light {
  color: readonly [number, number, number];
  x: number;
  y: number;
  radius: number;
  weight: number;
  driftX: number;
  driftY: number;
  speed: number;
  phase: number;
}

const LIGHTS: Light[] = [
  {
    color: [20, 184, 166],
    x: 0.02,
    y: -0.2,
    radius: 0.68,
    weight: 0.75,
    driftX: 0.06,
    driftY: 0.05,
    speed: 0.1,
    phase: 0,
  },
  {
    color: [99, 102, 241],
    x: 1.04,
    y: 0.5,
    radius: 0.62,
    weight: 0.62,
    driftX: 0.05,
    driftY: 0.06,
    speed: 0.075,
    phase: 1.9,
  },
  {
    color: [16, 185, 129],
    x: 0.42,
    y: 1.12,
    radius: 0.62,
    weight: 0.26,
    driftX: 0.08,
    driftY: 0.03,
    speed: 0.06,
    phase: 3.4,
  },
];

/** Soft halo behind the manifest card: a sphere whose centre is hidden by it. */
const ORB = {
  color: [45, 212, 191] as const,
  x: 0.78,
  y: 0.42,
  radius: 0.46,
  weight: 0.42,
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function HeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let image: ImageData | null = null;
    let frame = 0;
    let lastPaint = 0;
    let inView = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.ceil(rect.width / CELL));
      const height = Math.max(1, Math.ceil(rect.height / CELL));

      // Resizing the canvas resets its bitmap, so only touch it when needed.
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      // Always (re)build the buffer for this effect instance: the canvas may
      // already carry the right dimensions when the component is re-mounted
      // (route change, StrictMode, Activity re-show), and reusing a stale
      // `image` from a previous effect would leave the canvas blank.
      if (!image || image.width !== canvas.width || image.height !== canvas.height) {
        image = context.createImageData(canvas.width, canvas.height);
        lastPaint = 0;
      }
    };

    const paint = (time: number) => {
      if (!image) return;

      const { width, height } = canvas;
      const data = image.data;
      const dark = document.documentElement.classList.contains('dark');
      const alpha = (dark ? 0.5 : 0.32) * 255;
      const orbY = ORB.y + Math.sin(time * 0.09) * 0.012;
      // Distances are measured against the shorter side, so the lights keep
      // their character on tall phone viewports instead of flooding the page.
      const unit = Math.min(width, height);

      let i = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let r = 0;
          let g = 0;
          let b = 0;
          let total = 0;

          for (const light of LIGHTS) {
            const lx = (light.x + Math.sin(time * light.speed + light.phase) * light.driftX) * width;
            const ly =
              (light.y + Math.cos(time * light.speed * 0.8 + light.phase) * light.driftY) * height;
            const dx = (x - lx) / unit;
            const dy = (y - ly) / unit;
            const value =
              Math.exp(-(dx * dx + dy * dy) / (light.radius * light.radius)) * light.weight;

            if (value < 0.01) continue;
            r += light.color[0] * value;
            g += light.color[1] * value;
            b += light.color[2] * value;
            total += value;
          }

          // Halftone sphere: density follows a spherical falloff so the dots
          // stay visible instead of fusing into a flat disc.
          const ox = (x - ORB.x * width) / unit;
          const oy = (y - orbY * height) / unit;
          const od = Math.sqrt(ox * ox + oy * oy) / ORB.radius;
          if (od < 1) {
            const radial = Math.sqrt(Math.max(0, 1 - od * od));
            const rim = clamp((1 - od) / 0.26);
            const value = Math.pow(radial, 0.55) * rim * ORB.weight;
            r += ORB.color[0] * value;
            g += ORB.color[1] * value;
            b += ORB.color[2] * value;
            total += value;
          }

          if (total < 0.012) {
            data[i + 3] = 0;
            i += 4;
            continue;
          }

          const threshold = (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64;
          const density = Math.min(0.9, total * 0.95);

          const inverse = 1 / total;
          data[i] = r * inverse;
          data[i + 1] = g * inverse;
          data[i + 2] = b * inverse;
          data[i + 3] = density > threshold ? alpha * Math.min(1, 0.5 + density * 0.5) : 0;
          i += 4;
        }
      }

      context.putImageData(image, 0, 0);
    };

    const loop = (now: number) => {
      frame = window.requestAnimationFrame(loop);
      if (!inView || document.hidden) return;
      if (now - lastPaint < 90) return;
      lastPaint = now;
      paint(now / 1000);
    };

    const start = () => {
      resize();
      // Draw one frame synchronously so a re-shown backdrop never flashes empty
      // while the next animation frame is pending.
      paint(performance.now() / 1000);

      if (reduceMotion.matches) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(loop);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion.matches) paint(performance.now() / 1000);
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      // Resume immediately after scrolling back into view.
      lastPaint = 0;
    });
    intersectionObserver.observe(canvas);

    // The palette depends on the theme class that Fumadocs toggles on <html>.
    const themeObserver = new MutationObserver(() => {
      lastPaint = 0;
      if (reduceMotion.matches) paint(performance.now() / 1000);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const onMotionChange = () => {
      window.cancelAnimationFrame(frame);
      start();
    };
    reduceMotion.addEventListener('change', onMotionChange);

    start();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      reduceMotion.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_100%)]"
    >
      <canvas ref={canvasRef} className="h-full w-full [image-rendering:pixelated]" />
    </div>
  );
}
