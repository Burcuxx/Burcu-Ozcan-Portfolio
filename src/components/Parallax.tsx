"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * Lightweight scroll parallax. Every layer registers in one shared set, and a single
 * passive scroll listener updates them all inside one requestAnimationFrame.
 * A layer moves by (distance from the viewport centre) × speed, so positive speeds
 * drift slower than the page and negative speeds faster.
 * Disabled for visitors who ask for reduced motion.
 */

type Layer = { el: HTMLElement; speed: number };

const layers = new Set<Layer>();
let ticking = false;
let listening = false;

/*
 * Viewport height, cached. On mobile, window.innerHeight changes while scrolling as the
 * browser's address bar slides in and out, which would make every layer jump. The layout
 * viewport (clientHeight) stays put, and we only re-measure when the width changes
 * (rotation, real resize) — not on the address-bar resizes that keep the width.
 */
let viewportHeight = 0;
let viewportWidth = 0;

function measure() {
  viewportHeight = document.documentElement.clientHeight;
  viewportWidth = document.documentElement.clientWidth;
}

function update() {
  ticking = false;
  const mid = viewportHeight / 2;
  for (const { el, speed } of layers) {
    const parent = el.parentElement;
    if (!parent) continue;
    const rect = parent.getBoundingClientRect();
    // Skip work for layers that are far off screen.
    if (rect.bottom < -200 || rect.top > viewportHeight + 200) continue;
    const offset = (rect.top + rect.height / 2 - mid) * speed;
    el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
  }
}

function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}

function onResize() {
  if (document.documentElement.clientWidth === viewportWidth) return;
  measure();
  onScroll();
}

function start() {
  if (listening) return;
  listening = true;
  measure();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
}

function stop() {
  if (!listening || layers.size > 0) return;
  listening = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
}

export function ParallaxLayer({
  speed,
  className = "",
  children,
}: {
  speed: number;
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const layer = { el, speed };
    layers.add(layer);
    start();
    onScroll();
    return () => {
      layers.delete(layer);
      el.style.transform = "";
      stop();
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
